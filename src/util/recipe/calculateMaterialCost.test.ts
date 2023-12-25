import { describe, it, expect } from 'vitest'
import calculateMaterialCost from './calculateMaterialCost'

describe('calculateMaterialCost', () => {
  it('calculates material cost correctly with direct unit conversion', () => {
    // Example: Product cost is 1000 per kg, material required is 100g
    // Expected cost: (1000 per kg) / (1000g in a kg) * 100g = 100
    expect(calculateMaterialCost(100, 'g', 1000, 'kg')).toBeCloseTo(100)
  })

  it('calculates material cost correctly with different units', () => {
    // Example: Product cost is 500 per lb, material required is 100g
    // 1 lb is approximately 453.592g. Expected cost: (500 per lb) / (453.592g in a lb) * 100g ≈ 110.23
    expect(calculateMaterialCost(100, 'g', 500, 'lb')).toBeCloseTo(110.23)
  })

  it('handles material cost calculation with same units', () => {
    // Example: Both product cost and material required in kg
    // Expected cost: 1200 cost per kg, 1 kg needed = 1200
    expect(calculateMaterialCost(1, 'kg', 1200, 'kg')).toBe(1200)
  })

  it('handles fractional quantities correctly', () => {
    // Example: Fractional quantities with unit conversion
    // Product cost is 800 per lb, material required is 250g
    // Expected cost: (800 per lb) / (453.592g in a lb) * 250g ≈ 441.96
    expect(calculateMaterialCost(250, 'g', 800, 'lb')).toBeCloseTo(440.92)
  })

  // Add more test cases as needed for edge cases, large quantities, etc.
})
