using api.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// 1. Регистрация контроллеров и генератора Swagger (Swashbuckle)
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(); // Используем стандартный генератор для SwaggerUI

// 2. Настройка подключения к БД
builder.Services.AddDbContext<ApplicationDBContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

// 3. Настройка CORS политики для React
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// 4. Настройка HTTP pipeline (Порядок имеет значение)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger(); // Генерирует файл /swagger/v1/swagger.json
    app.UseSwaggerUI(c =>
    {
        // Явно указываем правильную конечную точку для Swashbuckle
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "CookBook API V1");
        
        // Переносим Swagger на корень приложения (http://localhost:5254)
        c.RoutePrefix = string.Empty; 
    });
}

app.UseHttpsRedirection();

// CORS должен быть до авторизации и контроллеров
app.UseCors("AllowReactApp");

app.UseAuthorization();

// Мапим маршруты контроллеров строго один раз
app.MapControllers();

// 5. Запуск сервера в самом конце файла
app.Run();
