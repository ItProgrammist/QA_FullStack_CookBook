/**
 * 
 * @param {Array} ingredientsList
 * @param {Array} allProducts
 * @returns {Object}
 */
export const calculateDishMacros = (ingredientsList, allProducts) => {
    const defaultResult = { calories: "0", proteins: "0", fats: "0", carbohydrates: "0" };

    // класс эквивалентности (allProducts пуст..)
    if (!allProducts || allProducts.length === 0) {
        return defaultResult;
    }

    // класс эквивалентности (продуктов в порции блюда нема)
    if (!ingredientsList || ingredientsList.length === 0) {
        return defaultResult;
    }

    let totalCalories = 0;
    let totalProteins = 0;
    let totalFats = 0;
    let totalCarbohydrates = 0;

    for (const item of ingredientsList) {
        // валидация на невалидный <0  класс эквивалентности
        if (item.amount < 0) {
            throw new Error("Product amount in portion cannot be negative");
        }

        const origProduct = allProducts.find(p => p.id === item.productId);
        if (origProduct) {
            if (origProduct.calories < 0 || origProduct.proteins < 0 || origProduct.fats < 0 || origProduct.carbohydrates < 0) {
                throw new Error("Product nutrient values cannot be negative");
            }

            totalCalories += (origProduct.calories * item.amount) / 100;
            totalProteins += (origProduct.proteins * item.amount) / 100;
            totalFats += (origProduct.fats * item.amount) / 100;
            totalCarbohydrates += (origProduct.carbohydrates * item.amount) / 100;
        }
    }

    // округляю до 2 знаков после запятой
    return {
        calories: (Math.round(totalCalories * 100) / 100).toString(),
        proteins: (Math.round(totalProteins * 100) / 100).toString(),
        fats: (Math.round(totalFats * 100) / 100).toString(),
        carbohydrates: (Math.round(totalCarbohydrates * 100) / 100).toString()
    };
};
