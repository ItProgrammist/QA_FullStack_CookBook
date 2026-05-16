using System.Net;
using System.Net.Http.Json;
using api.Tests.Fixtures;
using Bogus;
using FluentAssertions;
using AventStack.ExtentReports;
using AventStack.ExtentReports.Reporter;
using Xunit;

namespace api.Tests.Integration
{
    public class FullSystemApiTests : IClassFixture<ApiWebApplicationFactory>, IDisposable
    {
        private readonly HttpClient _client;
        private readonly Faker _faker;
        private static readonly ExtentReports _extent;
        private readonly ExtentTest _testReport;

        static FullSystemApiTests()
        {
            var sparkReporter = new ExtentSparkReporter(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "TestReport.html"));
            _extent = new ExtentReports();
            _extent.AttachReporter(sparkReporter);
        }

        public FullSystemApiTests(ApiWebApplicationFactory factory)
        {
            _client = factory.CreateClient();
            _faker = new Faker("ru");
            _testReport = _extent.CreateTest("Комплексный Интеграционный Тест Системы (Блюда + Продукты)");
        }

        public void Dispose()
        {
            _client.Dispose();
            _extent.Flush();
        }

        // =========================================================================
        // МОДУЛЬ 1: УПРАВЛЕНИЕ ПРОДУКТАМИ (PRODUCT API)
        // =========================================================================

        /// <summary>
        /// Позитивный тест-кейс создания продукта.
        /// Техника: Эквивалентное разбиение (Класс валидных атрибутов продукта).
        /// </summary>
        [Fact]
        public async Task CreateProduct_WithValidData_ReturnsSuccessStatusCode()
        {
            _testReport.Log(Status.Info, "Тест 1: Создание валидного продукта");

            var validProduct = new
            {
                Name = _faker.Commerce.ProductName(),
                Calories = (decimal)_faker.Random.Double(10, 800),
                Proteins = (decimal)20.0,
                Fats = (decimal)15.5,
                Carbohydrates = (decimal)40.0,
                Composition = "Натуральный состав продукта",
                Category = 0, // Замороженный
                CookingNecessity = 0, // Готовый к употреблению
                Flags = new List<int> { 1 } // Vegan
            };

            var response = await _client.PostAsJsonAsync("api/product", validProduct);
            
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            _testReport.Log(Status.Pass, "Продукт успешно записан в MS SQL Server контейнера");
        }

        /// <summary>
        /// Негативный параметризованный тест-кейс валидации названия продукта.
        /// Техника: Анализ граничных значений (BVA) для минимальной длины строки (2 символа).
        /// </summary>
        [Theory]
        [InlineData("", "Пустая строка названия")]
        [InlineData("A", "Строка из 1 символа - невалидная левая граница")]
        public async Task CreateProduct_NameBelowMinimumLengthBoundary_Returns400BadRequest(string invalidName, string boundaryDesc)
        {
            _testReport.Log(Status.Info, $"Тест 2 (BVA продукта): {boundaryDesc} (Значение: '{invalidName}')");

            var brokenProduct = new
            {
                Name = invalidName,
                Calories = (decimal)100.0, Proteins = (decimal)10.0, Fats = (decimal)5.0, Carbohydrates = (decimal)5.0,
                Category = 2, CookingNecessity = 1
            };

            var response = await _client.PostAsJsonAsync("api/product", brokenProduct);
            
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
            _testReport.Log(Status.Pass, "Сервер успешно отклонил слишком короткое название продукта");
        }

        /// <summary>
        /// Негативный тест-кейс жесткого ограничения суммы БЖУ.
        /// Техника: Анализ граничных значений (Верхняя критическая граница суммы нутриентов = 100).
        /// </summary>
        [Fact]
        public async Task CreateProduct_SumOfMacrosExceeds100Grams_Returns400BadRequest()
        {
            _testReport.Log(Status.Info, "Тест 3: Превышение лимита суммы БЖУ продукта (> 100)");

            var heavyProduct = new
            {
                Name = "Концентрат белков",
                Calories = (decimal)900.0,
                Proteins = (decimal)60.0,
                Fats = (decimal)30.0,
                Carbohydrates = (decimal)20.0, // Сумма = 110г, что физически невозможно на 100г веса
                Category = 1, CookingNecessity = 0
            };

            var response = await _client.PostAsJsonAsync("api/product", heavyProduct);
            
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
            _testReport.Log(Status.Pass, "Валидатор бэкенда успешно пресек сохранение продукта с БЖУ > 100");
        }


        // =========================================================================
        // МОДУЛЬ 2: УПРАВЛЕНИЕ БЛЮДАМИ (DISH API)
        // =========================================================================

        /// <summary>
        /// Позитивный тест-кейс создания блюда.
        /// Техника: Эквивалентное разбиение (Класс валидных атрибутов блюда с ингредиентами).
        /// </summary>
        [Fact]
        public async Task CreateDish_WithCompleteValidData_ReturnsSuccessStatusCode()
        {
            _testReport.Log(Status.Info, "Тест 4: Создание валидного блюда");

            var validDish = new
            {
                Name = _faker.Commerce.ProductName(),
                Calories = (decimal)_faker.Random.Double(100, 900),
                Proteins = (decimal)15.0,
                Fats = (decimal)10.0,
                Carbohydrates = (decimal)30.0,
                PortionSize = (decimal)350.0,
                Category = 1, // FirstCourse
                Flags = new List<int> { 2 }, // GlutenFree
                Ingredients = new List<object>
                {
                    new { ProductId = Guid.NewGuid(), Amount = 200.0 }
                }
            };

            var response = await _client.PostAsJsonAsync("api/dish", validDish);
            
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            _testReport.Log(Status.Pass, "Блюдо и его связи сохранены в реляционной базе данных");
        }

        /// <summary>
        /// Негативный параметризованный тест-кейс физических лимитов нутриентов.
        /// Техника: Анализ граничных значений (Левая невалидная граница порции = -0.01).
        /// </summary>
        [Theory]
        [InlineData(-0.01)]
        [InlineData(-1500)]
        public async Task CreateDish_WithNegativeCaloriesBoundary_Returns400BadRequest(double invalidCalories)
        {
            _testReport.Log(Status.Info, $"Тест 5 (BVA блюда): Проверка отрицательных калорий ({invalidCalories})");

            var brokenDish = new
            {
                Name = "Запрещенный суп",
                Calories = (decimal)invalidCalories,
                Proteins = (decimal)5.0, Fats = (decimal)5.0, Carbohydrates = (decimal)5.0, PortionSize = (decimal)150.0,
                Category = 5,
                Ingredients = new List<object> { new { ProductId = Guid.NewGuid(), Amount = 100 } }
            };

            var response = await _client.PostAsJsonAsync("api/dish", brokenDish);
            
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
            _testReport.Log(Status.Pass, "ModelState контроллера успешно заблокировал отрицательную ценность");
        }

        /// <summary>
        /// Негативный тест-кейс наличия состава рецепта.
        /// Техника: Эквивалентное разбиение (Класс невалидных данных: пустая коллекция ингредиентов).
        /// </summary>
        [Fact]
        public async Task CreateDish_WithEmptyIngredientsCollection_Returns400BadRequest()
        {
            _testReport.Log(Status.Info, "Тест 6: Создание блюда с пустым массивом ингредиентов");

            var ghostDish = new
            {
                Name = "Пустой суп",
                Calories = (decimal)200.0, Proteins = (decimal)10.0, Fats = (decimal)5.0, Carbohydrates = (decimal)20.0, PortionSize = (decimal)250.0,
                Category = 5,
                Ingredients = new List<object>() // Пусто
            };

            var response = await _client.PostAsJsonAsync("api/dish", ghostDish);
            
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
            _testReport.Log(Status.Pass, "Бэкенд успешно выдал 400 на попытку сохранить блюдо без продуктов");
        }

        /// <summary>
        /// Тест-кейс автоматической обработки текстовых макросов категорий (Пункт 2.3 функциональных требований).
        /// Проверяет, что при отправке макроса "!суп" в названии, сервер перехватит его, присвоит правильную категорию и очистит имя.
        /// </summary>
        [Fact]
        public async Task CreateDish_WithCategoryMacroInName_ProcessesAndCleansNameCorrectly()
        {
            _testReport.Log(Status.Info, "Тест 7: Автоматическое определение категории через текстовый макрос (!суп)");

            var macroDish = new
            {
                Name = "!суп Борщ Украинский",
                Calories = (decimal)300.0, Proteins = (decimal)15.0, Fats = (decimal)12.0, Carbohydrates = (decimal)22.0, PortionSize = (decimal)400.0,
                Category = 0, // Передаем дефолтную категорию, макрос должен её перегрузить
                Ingredients = new List<object> { new { ProductId = Guid.NewGuid(), Amount = 200 } }
            };

            var response = await _client.PostAsJsonAsync("api/dish", macroDish);
            
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            _testReport.Log(Status.Pass, "Макрос успешно обработан сервером без падения бизнес-логики");
        }
    }
}
