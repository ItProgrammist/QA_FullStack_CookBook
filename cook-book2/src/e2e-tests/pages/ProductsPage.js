export class ProductsPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.createButton = page.locator('button:has-text("Создать продукт"), button:has-text("Добавить")');
    this.nameInput = page.locator('input[name="name"], input[placeholder*="название"]');
    this.caloriesInput = page.locator('input[name="calories"]');
    this.proteinsInput = page.locator('input[name="proteins"]');
    this.fatsInput = page.locator('input[name="fats"]');
    this.carbohydratesInput = page.locator('input[name="carbohydrates"]');
    this.categorySelect = page.locator('select[name="category"]');
    this.cookingSelect = page.locator('select[name="cookingNecessity"]');
    this.submitButton = page.locator('button[type="submit"], button:has-text("Сохранить")');
    this.errorMessage = page.locator('.error-message, .validation-error, [class*="error"]');
    this.productCard = (name) => page.locator(`.product-card:has-text("${name}"), .card:has-text("${name}")`);
  }

  async navigate() {
    await this.page.goto('/products');
  }

  async openCreateModal() {
    await this.createButton.first().click();
  }

  async fillForm({ name, calories, proteins, fats, carbohydrates, category = '0', cooking = '0' }) {
    if (name !== undefined) await this.nameInput.fill(name);
    if (calories !== undefined) await this.caloriesInput.fill(calories.toString());
    if (proteins !== undefined) await this.proteinsInput.fill(proteins.toString());
    if (fats !== undefined) await this.fatsInput.fill(fats.toString());
    if (carbohydrates !== undefined) await this.carbohydratesInput.fill(carbohydrates.toString());
    await this.categorySelect.selectOption(category.toString());
    await this.cookingSelect.selectOption(cooking.toString());
  }

  async submit() {
    await this.submitButton.click();
  }
}
