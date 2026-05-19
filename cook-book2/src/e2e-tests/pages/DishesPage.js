export class DishesPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.createButton = page.locator('button:has-text("Создать блюдо")');
    this.nameInput = page.locator('input[name="name"]');
    this.portionInput = page.locator('input[name="portionSize"]');
    this.caloriesInput = page.locator('input[name="calories"]');
    this.proteinsInput = page.locator('input[name="proteins"]');
    this.fatsInput = page.locator('input[name="fats"]');
    this.carbohydratesInput = page.locator('input[name="carbohydrates"]');
    this.addIngredientButton = page.locator('button:has-text("Добавить ингредиент")');
    this.productSelect = page.locator('select[name="ingredientProductId"]');
    this.amountInput = page.locator('input[name="ingredientAmount"]');
    this.veganCheckbox = page.locator('input[type="checkbox"]#vegan, label:has-text("Веган")');
    this.submitButton = page.locator('button[type="submit"], button:has-text("Сохранить")');
  }

  async navigate() {
    await this.page.goto('/dishes');
  }

  async openCreateModal() {
    await this.createButton.first().click();
  }

  async addIngredient(productName, amount) {
    await this.addIngredientButton.click();
    await this.productSelect.last().selectOption({ label: productName });
    await this.amountInput.last().fill(amount.toString());
  }
}
