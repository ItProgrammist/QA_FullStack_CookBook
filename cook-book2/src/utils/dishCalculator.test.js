/* eslint-disable no-unused-vars */
import { describe, test, expect, beforeAll, afterAll, beforeEach, afterEach, vi } from 'vitest';
import { calculateDishMacros } from './dishCalculator';

describe('Dish Calories Automatic Calculation Suite (According to Specification)', () => {
    let mockProductsDatabase;

    /**
     * моки продуктов
    */
    beforeAll(() => {
        mockProductsDatabase = [
            { id: "prod-1", name: "Куриное филе", calories: 110, proteins: 23, fats: 2, carbohydrates: 0 },
            { id: "prod-2", name: "Рис отварной", calories: 130, proteins: 2.7, fats: 0.3, carbohydrates: 28 },
            { id: "prod-3", name: "Масло оливковое", calories: 884, proteins: 0, fats: 100, carbohydrates: 0 },
            { id: "prod-4", name: "Вода питьевая", calories: 0, proteins: 0, fats: 0, carbohydrates: 0 }
        ];
    });

    /**
     * глобальный Teardown для всего тест-сьюта
    */
    afterAll(() => {
        mockProductsDatabase = null;
    });

    // beforeEach(() => {
        
    // });

    afterEach(() => {
        vi.clearAllMocks();
    });







    // ЭКВИВАЛЕНТНОЕ РАЗБИЕНИЕ

    /**
     * @test позитив кейсы
     * класс эквивалентности: валидные данные (ингредиенты весом > 0, КБЖУ >= 0)
     */
    test('1. should correctly calculate total macros for a standard valid list of products in portion', () => {
        const ingredientsInPortion = [
            { productId: "prod-1", amount: 150 }, 
            { productId: "prod-2", amount: 100 }, 
            { productId: "prod-3", amount: 10 }   
        ]; 

        const result = calculateDishMacros(ingredientsInPortion, mockProductsDatabase);

        expect(result.calories).toBe("383.4");
        expect(result.proteins).toBe("37.2");     
        expect(result.fats).toBe("13.3");         
        expect(result.carbohydrates).toBe("28"); 
    });

    /**
     * @test чекаю возврат дефолтных нулевых макросов при отсутствии состава
     * а тут класс эквивалентности: пустые неполные структуры данных (null/undefined/empty)
     */
    test('2. should return all zeroes if the ingredients list is empty, null or undefined', () => {
        const expectedZeroes = { calories: "0", proteins: "0", fats: "0", carbohydrates: "0" };

        const resultEmpty = calculateDishMacros([], mockProductsDatabase);
        const resultNull = calculateDishMacros(null, mockProductsDatabase);
        const resultUndefined = calculateDishMacros(undefined, mockProductsDatabase);

        expect(resultEmpty).toEqual(expectedZeroes);
        expect(resultNull).toEqual(expectedZeroes);
        expect(resultUndefined).toEqual(expectedZeroes);
    });

    /**
     * @test исключения (всякие ерроры) при передаче деструктивных данных
     * класс эквивалентности: невалидные отрицательные значения параметров
     */
    test('3. should throw a validation error if any numerical input value is negative', () => {
        const brokenIngredients = [{ productId: "prod-1", amount: -25 }];
        const brokenDatabase = [{ id: "prod-1", name: "Мусор", calories: -10, proteins: 0, fats: 0, carbohydrates: 0 }];

        expect(() => {
            calculateDishMacros(brokenIngredients, mockProductsDatabase);
        }).toThrow("Product amount in portion cannot be negative");

        expect(() => {
            calculateDishMacros([{ productId: "prod-1", amount: 100 }], brokenDatabase);
        }).toThrow("Product nutrient values cannot be negative");
    });









    // АНАЛИЗ ГРАНИЧНЫХ ЗНАЧЕНИЙ

    /**
     * @test тестим точную нижнюю границу количества продукта в порции блюда (0 г )
     * граница: точное значение 0
       */
    test('4. should handle exactly 0 grams ingredient boundary without producing NaN or Infinity errors', () => {
        const ingredientsWithZero = [{ productId: "prod-1", amount: 0 }];

        const result = calculateDishMacros(ingredientsWithZero, mockProductsDatabase);

        expect(result).toEqual({ calories: "0", proteins: "0", fats: "0", carbohydrates: "0" });
    });

    /**
     * @test тут тест микро-количества продукта на правой границе нуля (0.01 грамм).
     * граница: ближайшее правое валидное значение (0.01г )
  */
    test('5. should calculate correct micro-calories for the closest right valid portion boundary (0.01g)', () => {
        const minimalIngredient = [
            { productId: "prod-3", amount: 0.01 } 
        ];

        const result = calculateDishMacros(minimalIngredient, mockProductsDatabase);

        expect(result.calories).toBe("0.09");
    });

    /**
     * @test тест поведения алгоритма на левой невалидной границе нуля (-0.01 г )
     * граница: ближайшее левое невалидное значение (-0.01г )     */
    test.each([
        [-0.01],
        [-999]
    ])('6. should throw a strict Error if product amount hits negative boundary: %p', (invalidAmount) => {
        const brokenIngredients = [{ productId: "prod-1", amount: invalidAmount }];

        expect(() => {
            calculateDishMacros(brokenIngredients, mockProductsDatabase);
        }).toThrow("Product amount in portion cannot be negative");
    });










  });
