using api.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using DotNet.Testcontainers.Builders;
using DotNet.Testcontainers.Containers;
using Xunit;

namespace api.Tests.Fixtures
{
    public class ApiWebApplicationFactory : WebApplicationFactory<Program>, IAsyncLifetime
    {
        // ИСПРАВЛЕНИЕ: Используем универсальный IContainer и базовый ContainerBuilder, 
        // чтобы обойти баг парсинга строк репозитория mcr.microsoft.com
        private readonly IContainer _dbContainer = new ContainerBuilder()
            .WithImage("mcr.microsoft.com/azure-sql-edge:latest")
            .WithPortBinding(1433, true) // Динамический или фиксированный порт
            .WithEnvironment("ACCEPT_EULA", "Y") // Обязательное лицензионное соглашение для Microsoft SQL
            .WithEnvironment("MSSQL_SA_PASSWORD", "Strong_Password_123!")
            .WithWaitStrategy(Wait.ForUnixContainer().UntilPortIsAvailable(1433))
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

                // Собираем строку подключения вручную на основе динамического порта Docker контейнера
                var host = _dbContainer.Hostname;
                var port = _dbContainer.GetMappedPublicPort(1433);
                var connectionString = $"Server={host},{port};Database=master;User Id=sa;Password=Strong_Password_123!;TrustServerCertificate=True;";

                services.AddDbContext<ApplicationDBContext>(options =>
                {
                    options.UseSqlServer(connectionString);
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
