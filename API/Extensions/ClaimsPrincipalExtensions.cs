using System.Security.Claims;

namespace API.Extensions
{
    // static class is a class that can't be instantiated
    // static classes can only contain static members
    // static class can be used to group related functionality
    // static class can be used all over the application
    public static class ClaimsPrincipalExtensions
    {
        public static string GetUsername(this ClaimsPrincipal user)
        {
            return user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        }
    }
}