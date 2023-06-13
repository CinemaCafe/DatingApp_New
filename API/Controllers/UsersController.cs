using System.Security.Claims;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    public class UsersController : BaseApiController
    {

        private readonly IUserRepository _userRepository;

        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;

        // inject the user repository into the constructor
        // interface is used to access the methods in the repository class
        // interface can't be instantiated, so we need to inject it into the constructor
        // Dependency injection is a technique in which an object receives other objects that it depends on.
        // These other objects are called dependencies.
        public UsersController(IUserRepository userRepository, IMapper mapper, IPhotoService photoService)
        {
            _photoService = photoService;
            _mapper = mapper;
            _userRepository = userRepository;
        }

        //[AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers()
        {
            // var users = await _userRepository.GetUsersAsync();
            // var usersToReturn = _mapper.Map<IEnumerable<MemberDto>>(users);
            // return Ok(usersToReturn);
            var users = await _userRepository.GetMembersAsync();
            return Ok(users);
        }

        [HttpGet("{username}")]
        public async Task<ActionResult<MemberDto>> GetUser(string username)
        {
            return await _userRepository.GetMemberAsync(username);
            /*
            var user = await _userRepository.GetUserByUsernameAsync(username);
            return _mapper.Map<MemberDto>(user);
            */
        }

        [HttpPut]
        public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto)
        {
            // question mark is a null conditional operator
            // var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            // this method is in API/Extensions/ClaimsPrincipalExtensions.cs
            var username = User.GetUsername();
            var user = await _userRepository.GetUserByUsernameAsync(username);

            if (user == null) return NotFound();

            // _mapper.Map(source, destination)
            // this line of code is effectively updating all of the properties that we pass through in that member
            // DTO into and overwriting the properties that we have in our user object.
            // But nothing is actually happening in the database yet.
            _mapper.Map(memberUpdateDto, user);
            // NoContent is actually going to return a status code of 204, which means everything is okay, 
            // but there's nothing to return.
            if (await _userRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Failed to update user");
        }

        [HttpPost("add-photo")]
        public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
        {
            // remember, when we 're doing this entity framework because we're getting this from our repository,
            // is tracking this entity.
            // So when we make a change to this entity, that means Entity Framework is now tracking this in memory.
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
            if (user == null) return NotFound();
            var result = await _photoService.AddPhotoAsync(file);

            if (result.Error != null) return BadRequest(result.Error.Message);

            // create a new photo object
            var photo = new Photo
            {
                // url is the url of the photo in cloudinary
                Url = result.SecureUrl.AbsoluteUri,
                // public id is the id of the photo in cloudinary
                PublicId = result.PublicId
            };

            // if the user doesn't have any photos, set the photo as the main photo
            if (user.Photos.Count == 0)
            {
                photo.IsMain = true;
            }

            user.Photos.Add(photo);

            // if (await _userRepository.SaveAllAsync()) return _mapper.Map<PhotoDto>(photo);
            if (await _userRepository.SaveAllAsync())
            {
                // we need to return the photo DTO, not the photo entity, 
                // and this is going to return a 201 created response along with some location details about where to find the newly created resource.
                return CreatedAtAction(nameof(GetUser), new { username = user.UserName }, _mapper.Map<PhotoDto>(photo));
            }

            return BadRequest("Problem adding photo");

        }

        [HttpPut("set-main-photo/{photoId}")]
        public async Task<ActionResult> SetMainPhoto(int photoId)
        {
            // get the user
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());

            if (user == null) return NotFound();

            // get the photo
            var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);

            if (photo == null) return NotFound();
            // if the photo is already the main photo, return bad request
            if (photo.IsMain) return BadRequest("This is already your main photo");

            // get the current main photo
            var currentMain = user.Photos.FirstOrDefault(x => x.IsMain);

            // if there is a current main photo, set it to false
            if (currentMain != null) currentMain.IsMain = false;
            photo.IsMain = true;

            // update the user
            if (await _userRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Problem setting main photo");

        }

        [HttpDelete("delete-photo/{photoId}")]
        public async Task<ActionResult> DeletePhoto(int photoId)
        {
            // get the user 
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
            // get the photo from the user
            var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);
            // if the photo doesn't exist, return not found
            if (photo == null) return NotFound();
            // if the photo is the main photo, return bad request
            if (photo.IsMain) return BadRequest("You cannot delete your main photo");
            // if the photo has a public id, delete the photo from cloudinary
            if (photo.PublicId != null)
            {
                var result = await _photoService.DeletePhotoAsync(photo.PublicId);
                // if there is an error, return bad request.
                // it will get back from cloudinary an object that has an error property on it.
                if (result.Error != null) return BadRequest(result.Error.Message);

                user.Photos.Remove(photo);

                if (await _userRepository.SaveAllAsync()) return Ok();
            }
            return BadRequest("Problem deleting the photo");
        }
    }
}