using API.Helpers;
using API.Interfaces;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Options;

namespace API.Services
{
    public class PhotoService : IPhotoService
    {
        // create a new cloudinary instance the readonly keyword means that the value can only be set in the constructor.
        private readonly Cloudinary _cloudinary;

        // dependency injection of cloudinary settings from appsettings.json
        public PhotoService(IOptions<CloudinarySettings> config)
        {
            // create a new account with cloudinary settings
            var acc = new Account(
                config.Value.CloudName,
                config.Value.ApiKey,
                config.Value.ApiSecret
            );

            // create a new cloudinary instance with the account
            _cloudinary = new Cloudinary(acc);
        }

        /// <summary>
        /// This method will upload a photo to cloudinary.
        /// </summary>
        /// <param name="file"></param>
        /// <returns></returns>
        public async Task<ImageUploadResult> AddPhotoAsync(IFormFile file)
        {
            var uploadResult = new ImageUploadResult();

            // check if file is not empty
            if (file.Length > 0)
            {
                // read file into memory stream
                using var stream = file.OpenReadStream();
                // upload params
                var uploadParams = new ImageUploadParams
                {
                    // file to upload
                    File = new FileDescription(file.FileName, stream),
                    // resize image
                    Transformation = new Transformation().Height(500).Width(500).Crop("fill").Gravity("face"),
                    // folder to upload to in cloudinary
                    Folder = "da-net7"
                };
                // upload to cloudinary and get result
                uploadResult = await _cloudinary.UploadAsync(uploadParams);
            }

            return uploadResult;
        }

        /// <summary>
        /// This method will delete a photo from cloudinary.
        /// </summary>
        /// <param name="publicId"></param>
        /// <returns></returns>
        public async Task<DeletionResult> DeletePhotoAsync(string publicId)
        {
            // delete params for cloudinary, it returns a deletion result.
            var deleteParams = new DeletionParams(publicId);

            return await _cloudinary.DestroyAsync(deleteParams);

        }
    }
}