using API.Data;
using API.Helpers;
using API.Interfaces;
using API.Services;
using Microsoft.EntityFrameworkCore;


namespace API.Extensions
{
    public static class ApplicationServiceExtensions
    {
        // to create an extension method, the class and the method must be static
        // the first parameter of the method must be preceded by the this keyword
        // the this keyword tells the compiler which type the extension method applies to
        // the extension method must be in the same namespace as the class it extends or in a namespace imported by a using directive
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
        {
            // add dbcontex and connection string.
            services.AddDbContext<DataContext>(opt =>
            {
                opt.UseSqlite(config.GetConnectionString("DefaultConnection"));
            });

            // add Cors
            services.AddCors();
            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<IUserRepository, UserRepository>();
            // add automapper
            services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
            // add cloudinary settings
            services.Configure<CloudinarySettings>(config.GetSection("CloudinarySettings"));
            services.AddScoped<IPhotoService, PhotoService>();

            return services;
        }
    }
}