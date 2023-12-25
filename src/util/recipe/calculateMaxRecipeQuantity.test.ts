/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from 'vitest'
import calculateMaxRecipeQuantity from './calculateMaxRecipeQuantity'

describe('calculateMaxRecipeQuantity', () => {
  it('calculates correctly for simple unit conversion', () => {
    const materials = [
      {
        id: '1',
        measurement: 'g',
        quantity: 100,
        product: {
          id: 'butter',
          name: 'Butter',
          quantity: 2, // 2 kg
          measurement: 'kg',
          cost: 120,
        },
      },
      {
        id: '2',
        measurement: 'g',
        quantity: 100,
        product: {
          id: 'dough',
          name: 'Dough',
          quantity: 1, // 1 kg
          measurement: 'kg',
          cost: 100,
        },
      },
    ]

    expect(calculateMaxRecipeQuantity(materials as any)).toEqual(10)
  })

  it('calculates correctly with different units', () => {
    const materials = [
      {
        id: '1',
        measurement: 'g',
        quantity: 50,
        product: {
          id: 'sugar',
          name: 'Sugar',
          quantity: 1, // 1 lb
          measurement: 'lb',
          cost: 50,
        },
      },
      {
        id: '2',
        measurement: 'g',
        quantity: 200,
        product: {
          id: 'flour',
          name: 'Flour',
          quantity: 1, // 1 kg
          measurement: 'kg',
          cost: 30,
        },
      },
    ]

    // 1 lb of sugar = 453.592 g. So, 453.592 / 50 = 9.07... -> rounded down to 9
    // 1 kg of flour = 1000 g. So, 1000 / 200 = 5
    // The limiting factor is flour, allowing 5 units of the recipe.
    expect(calculateMaxRecipeQuantity(materials as any)).toEqual(5)
  })

  it('throws error if product is missing in a material', () => {
    const materials = [
      {
        id: '1',
        measurement: 'g',
        quantity: 100,
        product: null, // No product linked
      },
    ]

    expect(() => calculateMaxRecipeQuantity(materials as any)).toThrow(
      'Product not found for material: 1',
    )
  })

  // Additional tests can be added here for edge cases, large quantities, etc.
})
