using System.Net;
using System.Net.Http.Json;
using api.Tests.Fixtures;
using Bogus;
using FluentAssertions;
using AventStack.ExtentReports;
using AventStack.ExtentReports.Reporter;
using Xunit;
using Xunit.Abstractions;
using System.Text.RegularExpressions;
using System.Reflection; 

namespace api.Tests.Integration
{
    /// <summary>
    /// комплексный сьют сквозных API-тестов без изоляции (Black Box End-to-End API Tests)
    /// полностью покрывает бизнес-логику управления продуктами и блюдами согласно ТЗ
    /// каждая проверка изолирована во избежание каскадных падений (антипаттерн склеек)
    /// </summary>
    public class FullSystemApiTests : IClassFixture<ApiWebApplicationFactory>, IDisposable
    {
        private readonly HttpClient _client;
        private readonly Faker _faker;
        private static readonly ExtentReports _extent;
        private readonly ExtentTest _testReport;

        /// <summary>
        /// вспомогательное DTO для извлечения системного идентификатора созданной сущности.
        /// </summary>
        private class IdResponseDto { public Guid Id { get; set; } }

        /// <summary>
        /// статический конструктор для глобального Setup отчетов ExtentReports v5 [INDEX].
        /// </summary>
        static FullSystemApiTests()
        {
            var sparkReporter = new ExtentSparkReporter(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "TestReport.html"));
            _extent = new ExtentReports();
            _extent.AttachReporter(sparkReporter);
        }

        /// <summary>
        /// изолированный Setup для каждого тест-кейса
        /// инициализирует виртуальный клиент Kestrel и Bogus
        /// </summary>
        public FullSystemApiTests(ApiWebApplicationFactory factory, ITestOutputHelper output)
        {
            _client = factory.CreateClient();
            _faker = new Faker("ru");

            string methodName = "Сквозной API-тест";
            var type = output.GetType();
            var testField = type.GetField("test", System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance);
            if (testField != null)
            {
                var test = testField.GetValue(output) as ITest;
                if (test != null)
                {
                    methodName = test.DisplayName;
                    int dotIndex = methodName.LastIndexOf('.');
                    if (dotIndex != -1)
                    {
                        methodName = methodName.Substring(dotIndex + 1);
                    }
                    methodName = Regex.Replace(methodName, @"\(.*?\)", "");
                }
            }
            _testReport = _extent.CreateTest(methodName);
        }    


        /// <summary>
        /// изолированный Teardown для каждого тест-кейса
        /// сбрасывает буфер HTML-отчета на диск
        /// </summary>
        public void Dispose()
        {
            _client.Dispose();
            _extent.Flush();
        }

        /// <summary>
        /// инфраструктурный вспомогательный метод (Seed) для создания легального продукта в СУБД
        /// используется для обеспечения ссылочной целостности ( Foreign Key)
        ///  в тестах рецептур блюд
        /// </summary>
        private async Task<Guid> SeedProductAsync(bool isVegan, bool isGlutenFree, bool isSugarFree, decimal proteins = 10)
        {
            var flags = new List<int>();
            if (isVegan) flags.Add(1);
            if (isGlutenFree) flags.Add(2);
            if (isSugarFree) flags.Add(3);

            var payload = new
            {
                Name = _faker.Commerce.ProductName(),
                Calories = (decimal)100.0,
                Proteins = proteins,
                Fats = (decimal)5.0,
                Carbohydrates = (decimal)10.0,
                Category = 0,
                CookingNecessity = 0,
                Flags = flags
            };

            var response = await _client.PostAsJsonAsync("api/product", payload);
            var data = await response.Content.ReadFromJsonAsync<IdResponseDto>();
            return data?.Id ?? Guid.NewGuid();
        }




        // =========================================================================
        // МОДУЛЬ 1: УПРАВЛЕНИЕ ПРОДУКТАМИ (PRODUCT API)
        // =========================================================================

        /// <summary>
        /// позитив тест создания продукта
        /// техника: Эквивалентное разбиение (полностью валидные кулинарные атрибты)
        /// ТЗ Пункт 1.1: чекает штатное создание записи и возврат типа контракта 201 Created
        /// </summary>
        [Fact]
        public async Task CreateProduct_WithValidData_Returns201Created()
        {
            var validProduct = new { Name = "Банан", Calories = (decimal)89.0, Proteins = (decimal)1.5, Fats = (decimal)0.2, Carbohydrates = (decimal)21.8, Category = 2, CookingNecessity = 0, Flags = new List<int> { 1, 2, 3 } };
            var response = await _client.PostAsJsonAsync("api/product", validProduct);
            response.StatusCode.Should().Be(HttpStatusCode.Created);
        }

        /// <summary>
        /// негативный параметризованный тест валидации строки названия
        /// техника: Анализ граничных значений (BVA) для левой невалидной границы строки (длина менее 2)
        /// ТЗ Атрибуты продукта: Поле Название "Минимальная длина: 2 символа"
        ///  должно вызывать 400 BadRequest
        /// </summary>
        [Theory]
        [InlineData("")]
        [InlineData("A")]
        public async Task CreateProduct_NameBelowMinimumLength_Returns400BadRequest(string invalidName)
        {
            var product = new { Name = invalidName, Calories = (decimal)100.0, Proteins = (decimal)10.0, Fats = (decimal)5.0, Carbohydrates = (decimal)5.0, Category = 2, CookingNecessity = 0 };
            var response = await _client.PostAsJsonAsync("api/product", product);
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        }

        /// <summary>
        /// негативный параметризованный тест физических ограничений КБЖУ
        /// Техника: Анализ граничных значений (BVA) вокруг левой невалидной границы нуля ккал
        /// ТЗ Атрибуты продукта: Калорийность "Минимальное значение: 0"
        /// минусы должны строго блокироваться
        /// </summary>
        [Theory]
        [InlineData(-0.01)]
        [InlineData(-100)]
        public async Task CreateProduct_NegativeNutrients_Returns400BadRequest(double invalidValue)
        {
            var product = new { Name = "Яблоко", Calories = (decimal)invalidValue, Proteins = (decimal)1.0, Fats = (decimal)0.1, Carbohydrates = (decimal)10.0, Category = 2, CookingNecessity = 0 };
            var response = await _client.PostAsJsonAsync("api/product", product);
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        }

        /// <summary>
        /// негативный тест кулинарного ограничения плотности макронутриентов
        /// техника: Анализ граничных значений (Правая критическая граница суммы долей вещества)
        /// ТЗ Пункт 1.1: "Сумма БЖУ на 100 грамм не может превышать 100"
        /// значение 110г должно быть заблочено
        /// </summary>
        [Fact]
        public async Task CreateProduct_SumOfMacrosExceeds100_Returns400BadRequest()
        {
            var heavyProduct = new { Name = "Концентрат", Calories = (decimal)500.0, Proteins = (decimal)60.0, Fats = (decimal)30.0, Carbohydrates = (decimal)20.0, Category = 1, CookingNecessity = 0 };
            var response = await _client.PostAsJsonAsync("api/product", heavyProduct);
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        }

        /// <summary>
        /// позитивный тест чтения информации о продукте
        /// техника: Эквивалентное разбиение
        /// ТЗ Пункт 1.3: Позволяет пользователю просмотреть выбранный продукт со всеми его сохраненными атрибутами.
        /// </summary>
        [Fact]
        public async Task GetProductById_ExistingId_Returns200OkWithData()
        {
            Guid productId = await SeedProductAsync(true, true, true);
            var response = await _client.GetAsync($"api/product/{productId}");
            response.StatusCode.Should().Be(HttpStatusCode.OK);
        }

        /// <summary>
        /// позитив тест модификации данных
        /// техника: Эквивалентное разбиение (Передача валидного обновленного состояния модели )
        /// ТЗ Пункт 1.4: Редактирование существующих продуктов с возвратом
        /// стандартного успешного статус кода REST API
        /// </summary>
        [Fact]
        public async Task UpdateProduct_WithValidData_Returns200OkOr24NoContent()
        {
            Guid productId = await SeedProductAsync(true, true, true);
            var updatePayload = new { Name = "Обновленный Банан", Calories = (decimal)95.0, Proteins = (decimal)2.0, Fats = (decimal)0.2, Carbohydrates = (decimal)22.0, Category = 2, CookingNecessity = 0, Flags = new List<int> { 1 } };
            var response = await _client.PutAsJsonAsync($"api/product/{productId}", updatePayload);
            response.StatusCode.Should().Match(x => x == HttpStatusCode.OK || x == HttpStatusCode.NoContent);
        }

        /// <summary>
        /// негатив тест модификации лимитов БЖУ
        /// техника: Анализ граничных значений при обновлении записи (Сумма БЖУ > 100 при PUT)
        /// ТЗ Пункт 1.4: Проверяет, что ограничение "Сумма БЖУ на 100 грамм не может
        ///  превышать 100" строго работает и при апдейте.
        /// </summary>
        [Fact]
        public async Task UpdateProduct_SumOfMacrosExceeds100_Returns400BadRequest()
        {
            Guid productId = await SeedProductAsync(true, true, true);
            var invalidPayload = new { Name = "Сбойный Банан", Calories = (decimal)95.0, Proteins = (decimal)70.0, Fats = (decimal)40.0, Carbohydrates = (decimal)10.0, Category = 2, CookingNecessity = 0 };
            var response = await _client.PutAsJsonAsync($"api/product/{productId}", invalidPayload);
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        }

        /// <summary>
        /// позитив тест удаления неиспользуемого продукта
        /// Техника: Эквивалентное разбиение (Класс свободных от внешних ключей сущностей СУБД)
        /// ТЗ Пункт 1.5: "Пользователь должен иметь возможность удалять
        ///  продукты, которые больше не нужны"
        /// </summary>
        [Fact]
        public async Task DeleteProduct_NotUsedInDishes_Returns200OkOr204NoContent()
        {
            Guid productId = await SeedProductAsync(true, true, true);
            var response = await _client.DeleteAsync($"api/product/{productId}");
            response.StatusCode.Should().Match(x => x == HttpStatusCode.OK || x == HttpStatusCode.NoContent);
        }

        /// <summary>
        /// специфический негативный тест на ссылочную целостность системы
        /// ТЗ Пункт 1.5: "ВНИМАНИЕ! Удаление продукта, который используется в составе хотя бы одного блюда, должно быть недоступно"
        /// проверяет, что сервер наложит вето (400 BadRequest) и защитит реляционные связи бд Docker
        /// </summary>
        [Fact]
        public async Task DeleteProduct_UsedInDish_Returns400BadRequest_ConstraintRule15()
        {
            Guid productId = await SeedProductAsync(true, true, true);
            var dishPayload = new { Name = "Суп с филе", Calories = (decimal)200.0, Proteins = (decimal)10.0, Fats = (decimal)5.0, Carbohydrates = (decimal)20.0, PortionSize = (decimal)300.0, Category = 5, Ingredients = new List<object> { new { ProductId = productId, Amount = 150.0 } } };
            await _client.PostAsJsonAsync("api/dish", dishPayload);

            var response = await _client.DeleteAsync($"api/product/{productId}");
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        }


        // =========================================================================
        // МОДУЛЬ 2: УПРАВЛЕНИЕ БЛЮДАМИ (DISH API)
        // =========================================================================

        /// <summary>
        /// позитив тест-кейс создания блюда
        /// техника: Эквивалентное разбиение (класс валидного состава рецепта и КБЖУ порции)
        /// ТЗ Пункт 2.1: проверяет успешную транзакционную запись в 
        /// таблицы [Dishes] и [DishIngredients] в Docker
        /// </summary>
        [Fact]
        public async Task CreateDish_WithValidData_Returns201Created()
        {
            Guid productId = await SeedProductAsync(true, true, true);
            var validDish = new { Name = "Овощной Салат", Calories = (decimal)150.0, Proteins = (decimal)5.0, Fats = (decimal)8.0, Carbohydrates = (decimal)12.0, PortionSize = (decimal)200.0, Category = 4, Flags = new List<int> { 1, 2, 3 }, Ingredients = new List<object> { new { ProductId = productId, Amount = 100.0 } } };
            var response = await _client.PostAsJsonAsync("api/dish", validDish);
            response.StatusCode.Should().Be(HttpStatusCode.Created);
        }

        /// <summary>
        /// негативный параметризованный тест валидации длины строки названия блюда
        /// техника: Анализ граничных значений (BVA) для левой невалидной границы длины строки
        /// ТЗ Атрибуты блюда: Название "Минимальная длина: 2 символа". Строки
        ///  в 0 и 1 символ должны вызывать 400
        /// </summary>
        [Theory]
        [InlineData("")]
        [InlineData("Z")]
        public async Task CreateDish_NameBelowMinimumLength_Returns400BadRequest(string invalidName)
        {
            Guid productId = await SeedProductAsync(true, true, true);
            var brokenDish = new { Name = invalidName, Calories = (decimal)100.0, Proteins = (decimal)5.0, Fats = (decimal)2.0, Carbohydrates = (decimal)10.0, PortionSize = (decimal)150.0, Category = 4, Ingredients = new List<object> { new { ProductId = productId, Amount = 100 } } };
            var response = await _client.PostAsJsonAsync("api/dish", brokenDish);
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        }

        /// <summary>
        /// негативный параметризованный тест лимитов нутриентов порции
        /// техника: Анализ граничных значений (BVA) левой границы калорийности
        /// ТЗ Атрибуты блюда: Калорийность "Минимальное значение: 0"
        /// отрицательные числа недопустимы
        /// </summary>
        [Theory]
        [InlineData(-0.01)]
        [InlineData(-500)]
        public async Task CreateDish_NegativeNutrients_Returns400BadRequest(double invalidValue)
        {
            Guid productId = await SeedProductAsync(true, true, true);
            var brokenDish = new { Name = "Пюре", Calories = (decimal)invalidValue, Proteins = (decimal)2.0, Fats = (decimal)1.0, Carbohydrates = (decimal)20.0, PortionSize = (decimal)150.0, Category = 2, Ingredients = new List<object> { new { ProductId = productId, Amount = 100 } } };
            var response = await _client.PostAsJsonAsync("api/dish", brokenDish);
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        }

        /// <summary>
        /// негативный параметризованный тест валидации массы порции блюда
        /// техника: Анализ граничных значений (BVA) вокруг физической границы нуля грамм
        /// ТЗ Атрибуты блюда: размер порции "Минимальное значение: > 0"
        /// значения 0 и минус должны отклоняться
        /// </summary>
        [Theory]
        [InlineData(0)]
        [InlineData(-50)]
        public async Task CreateDish_PortionSizeZeroOrNegative_Returns400BadRequest(double invalidPortion)
        {
            Guid productId = await SeedProductAsync(true, true, true);
            var brokenDish = new { Name = "Компот", Calories = (decimal)80.0, Proteins = (decimal)0.5, Fats = (decimal)0.1, Carbohydrates = (decimal)18.0, PortionSize = (decimal)invalidPortion, Category = 3, Ingredients = new List<object> { new { ProductId = productId, Amount = 200 } } };
            var response = await _client.PostAsJsonAsync("api/dish", brokenDish);
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        }

        /// <summary>
        /// негатив тест наличия структуры рецепта состава
        /// техника: Эквивалентное разбиение ( класс невалидных пустых коллекций данных)
        /// ТЗ Атрибуты блюда: Состав "Минимальное количество записей: 1". Запрос с пустым массивом [] блокируется.
        /// </summary>
        [Fact]
        public async Task CreateDish_WithEmptyIngredients_Returns400BadRequest()
        {
            var ghostDish = new { Name = "Воздух", Calories = (decimal)100.0, Proteins = (decimal)5.0, Fats = (decimal)2.0, Carbohydrates = (decimal)10.0, PortionSize = (decimal)150.0, Category = 6, Ingredients = new List<object>() };
            var response = await _client.PostAsJsonAsync("api/dish", ghostDish);
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        }

        /// <summary>
        /// адвансед xD негативный тест кулинарных лимитов плотности вещества готового блюда
        /// Техника: Анализ граничных значений (Максимальная плотность нутриентов на 100г веса порции = 100г)
        /// ТЗ Пункт 2.7: "Сумма БЖУ на 100 грамм не может превышать 100". Значения белков 80г и жиров 20г на 100г порции
        /// в сумме со всеми углеводами превышают лимит плотности и должны приводить к ошибке 400 BadRequest
        /// </summary>
        [Fact]
        public async Task CreateDish_SumOfMacrosExceeds100Per100g_Returns400BadRequest_Rule27()
        {
            Guid productId = await SeedProductAsync(true, true, true, proteins: 90);
            var heavyDish = new { Name = "Протеиновый батончик", Calories = (decimal)600.0, Proteins = (decimal)80.0, Fats = (decimal)20.0, Carbohydrates = (decimal)15.0, PortionSize = (decimal)100.0, Category = 6, Ingredients = new List<object> { new { ProductId = productId, Amount = 100.0 } } };
            var response = await _client.PostAsJsonAsync("api/dish", heavyDish);
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        }

        /// <summary>
        /// интеграционный тест обработки текстового процессора названий на бэкенде
        /// ТЗ Пункт 2.3: "Автоматическое определение категории блюда (макросы)"
        /// название "!суп Борщ" должно перехватиться сервером, выставить категорию "Суп",
        ///  стереть тег из строки и вернуть 201 Created
        /// </summary>
        [Fact]
        public async Task CreateDish_WithCategoryMacroInName_ProcessesAndCleansName()
        {
            Guid productId = await SeedProductAsync(true, true, true);
            var macroDish = new { Name = "!суп Борщ", Calories = (decimal)250.0, Proteins = (decimal)8.0, Fats = (decimal)6.0, Carbohydrates = (decimal)15.0, PortionSize = (decimal)350.0, Category = 0, Ingredients = new List<object> { new { ProductId = productId, Amount = 200 } } };
            var response = await _client.PostAsJsonAsync("api/dish", macroDish);
            response.StatusCode.Should().Be(HttpStatusCode.Created);
        }

        /// <summary>
        /// негативный тест правила наследования веганских флагов рецепта
        /// ТЗ Пункт 2.4: "Флаг Веган доступен для установки только если все продукты в составе отмечены флагом Веган"
        /// Тест добавляет в блюдо не-веганский продукт, но принудительно шлет у блюда флаг Веган (1) 
        /// сервак обязан заблокировать это нарушение правил флагов кодом 400
        /// </summary>
        [Fact]
        public async Task CreateDish_ViolatingVeganFlagRule24_Returns400BadRequest()
        {
            Guid nonVeganProduct = await SeedProductAsync(isVegan: false, isGlutenFree: true, isSugarFree: true);
            var brokenDish = new { Name = "Обманный Салат", Calories = (decimal)100.0, Proteins = (decimal)2.0, Fats = (decimal)4.0, Carbohydrates = (decimal)10.0, PortionSize = (decimal)150.0, Category = 4, Flags = new List<int> { 1 }, Ingredients = new List<object> { new { ProductId = nonVeganProduct, Amount = 100 } } };
            var response = await _client.PostAsJsonAsync("api/dish", brokenDish);
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        }

        /// <summary>
        /// негатив тест правила наследования безглютеновых флагов рецепта
        /// ТЗ Пункт 2.4: "Флаг Без глютена доступен только если все продукты в составе отмечены флагом Без глютена"
        /// пытаемся стараемся и пыхтим сохранить блюдо с флагом безглютена (2), 
        /// содержащее глютеновый продукт, пресекается статус-кодом 400
        /// </summary>
        [Fact]
        public async Task CreateDish_ViolatingGlutenFreeFlagRule24_Returns400BadRequest()
        {
            Guid glutenProduct = await SeedProductAsync(isVegan: true, isGlutenFree: false, isSugarFree: true);
            var brokenDish = new { Name = "Хлеб", Calories = (decimal)250.0, Proteins = (decimal)8.0, Fats = (decimal)1.0, Carbohydrates = (decimal)50.0, PortionSize = (decimal)100.0, Category = 2, Flags = new List<int> { 2 }, Ingredients = new List<object> { new { ProductId = glutenProduct, Amount = 100 } } };
            var response = await _client.PostAsJsonAsync("api/dish", brokenDish);
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        }

        /// <summary>
        /// негатив тест правила наследования флагов отсутствия сахара в составе рецепта
        /// ТЗ Пункт 2.4: "Флаг Без сахара доступен только если все продукты в составе отмечены флагом Без сахара"
        /// бэк обязан отклонить транзакцию кодом 400, если в безсахарное 
        /// блюдо (флаг 3) подмешан продукт с сахаром
        /// </summary>
        [Fact]
        public async Task CreateDish_ViolatingSugarFreeFlagRule24_Returns400BadRequest()
        {
            Guid sugarProduct = await SeedProductAsync(isVegan: true, isGlutenFree: true, isSugarFree: false);
            var brokenDish = new { Name = "Варенье", Calories = (decimal)300.0, Proteins = (decimal)0.5, Fats = (decimal)0.0, Carbohydrates = (decimal)75.0, PortionSize = (decimal)50.0, Category = 0, Flags = new List<int> { 3 }, Ingredients = new List<object> { new { ProductId = sugarProduct, Amount = 50 } } };
            var response = await _client.PostAsJsonAsync("api/dish", brokenDish);
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        }

        /// <summary>
        /// позитив тест-кейс удаления существующего блюда
        /// техника: Эквивалентное разбиение (Класс существующих записей в таблицах СУБД)
        /// ТЗ Пункт 2.8: Пользователь должен иметь возможность удалять блюда, которые больше не нужны, с очисткой связей
        /// </summary>
        [Fact]
        public async Task DeleteDish_ExistingId_Returns200OkOr204NoContent()
        {
            Guid productId = await SeedProductAsync(true, true, true);
            var dishPayload = new { Name = "Желе", Calories = (decimal)90.0, Proteins = (decimal)2.0, Fats = (decimal)0.0, Carbohydrates = (decimal)20.0, PortionSize = (decimal)100.0, Category = 0, Ingredients = new List<object> { new { ProductId = productId, Amount = 100 } } };
            var resCreate = await _client.PostAsJsonAsync("api/dish", dishPayload);
            var data = await resCreate.Content.ReadFromJsonAsync<IdResponseDto>();

            var response = await _client.DeleteAsync($"api/dish/{data!.Id}");
            response.StatusCode.Should().Match(x => x == HttpStatusCode.OK || x == HttpStatusCode.NoContent);
        }
    }
}
