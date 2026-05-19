import { test, expect } from '@playwright/test';
import { DishesPage } from '../pages/DishesPage.js';
import { ProductsPage } from '../pages/ProductsPage.js';

test.describe('Модуль Блюда и Калькулятор — Системные UI тесты (POM + Реальный расчет)', () => {
  let dishesPage;
  let productsPage;

  test.beforeEach(async ({ page }) => {
    dishesPage = new DishesPage(page);
    productsPage = new ProductsPage(page);
  });

  test('Инпуты КБЖУ формы должны автоматически наполняться черновиками при добавлении продуктов', async () => {
    await productsPage.navigate();
    await productsPage.openCreateModal();
    const ingredientName = `UI-Томат ${Date.now()}`;
    await productsPage.fillForm({ name: ingredientName, calories: 100, proteins: 10, fats: 0, carbohydrates: 10 });
    await productsPage.submit();
    
    await dishesPage.navigate();
    await dishesPage.openCreateModal();
    await dishesPage.nameInput.fill('Тестовый Салат');
    await dishesPage.portionInput.fill('200');

    await dishesPage.addIngredient(ingredientName, 200);

    await expect(dishesPage.proteinsInput).not.toHaveValue('0');
    await expect(dishesPage.proteinsInput).toHaveValue('20'); 
  });

  test('Интерфейс должен запрещать установку флага Веган, если в составе есть не-веганский ингредиент', async () => {
    await productsPage.navigate();
    await productsPage.openCreateModal();
    const meatName = `UI-Говядина ${Date.now()}`;
    await productsPage.fillForm({ name: meatName, calories: 250, proteins: 20, fats: 15, carbohydrates: 0, category: '1' });
    await productsPage.submit();

    await dishesPage.navigate();
    await dishesPage.openCreateModal();
    await dishesPage.addIngredient(meatName, 150);

    await expect(dishesPage.veganCheckbox).toBeDisabled();
  });
});
