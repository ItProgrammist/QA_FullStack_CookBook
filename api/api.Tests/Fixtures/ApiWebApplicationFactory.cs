using api.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Testcontainers.MsSql;
using Xunit;

namespace api.Tests.Fixtures
{
    public class ApiWebApplicationFactory : WebApplicationFactory<Program>, IAsyncLifetime
    {
        private readonly MsSqlContainer _dbContainer = new MsSqlBuilder()
            .WithImage("://microsoft.com")
            .WithPassword("Strong_Password_123!")
            .Build();

        public async Task InitializeAsync()
        {
            await _dbContainer.StartAsync();
        }

        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.ConfigureServices(services =>
            {
                var dbContextDescriptor = services.SingleOrDefault(
                    d => d.ServiceType == typeof(DbContextOptions<ApplicationDBContext>));

                if (dbContextDescriptor != null)
                {
                    services.Remove(dbContextDescriptor);
                }

                services.AddDbContext<ApplicationDBContext>(options =>
                {
                    options.UseSqlServer(_dbContainer.GetConnectionString());
                });

                using var scope = services.BuildServiceProvider().CreateScope();
                var scopedDb = scope.ServiceProvider.GetRequiredService<ApplicationDBContext>();
                scopedDb.Database.Migrate();
            });
        }

        public new async Task DisposeAsync()
        {
            await _dbContainer.StopAsync();
            await _dbContainer.DisposeAsync();
        }
    }
}
