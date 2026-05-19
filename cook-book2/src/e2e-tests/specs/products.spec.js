import { test, expect } from '@playwright/test';
import { ProductsPage } from '../pages/ProductsPage.js';

test.describe('Модуль Продукты - Системные UI тесты (POM + BVA + EP)', () => {
  let productsPage;

  test.beforeEach(async ({ page }) => {
    productsPage = new ProductsPage(page);
    await productsPage.navigate();
    await productsPage.openCreateModal();
  });

  test('Создание продукта с валидными данными должно отобразить его в каталоге', async () => {
    const productName = `АвтоТест Продукт ${Date.now()}`;
    
    await productsPage.fillForm({
      name: productName,
      calories: 120,
      proteins: 10,
      fats: 5,
      carbohydrates: 15
    });
    await productsPage.submit();

    await expect(productsPage.productCard(productName)).toBeVisible({ timeout: 5000 });
  });

  const shortNames = [
    { name: '', desc: 'Пустое поле названия' },
    { name: 'X', desc: 'Название из 1 символа - невалидная граница' }
  ];
  for (const tc of shortNames) {
    test(`Валидация имени: ${tc.desc} должна вызывать ошибку на интерфейсе`, async () => {
      await productsPage.fillForm({
        name: tc.name,
        calories: 100, proteins: 10, fats: 5, carbohydrates: 5
      });
      await productsPage.submit();
      
      await expect(productsPage.errorMessage.first()).toBeVisible();
    });
  }

  test('Сумма БЖУ более 100 грамм должна блокироваться валидацией формы', async () => {
    await productsPage.fillForm({
      name: 'Невозможный концентрат',
      calories: 500,
      proteins: 60,
      fats: 30,
      carbohydrates: 20
    });
    await productsPage.submit();

    await expect(productsPage.errorMessage.first()).toBeVisible();
  });
});
