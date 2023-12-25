import convert, { Unit } from 'convert-units'

/**
 * Calculates the cost for a single material in a recipe based on per-unit cost conversion.
 *
 * @param material - The material for which to calculate the cost, including a linked product.
 * @returns The calculated cost for the specified quantity of the material.
 */
function calculateMaterialCost(
  materialQuantity: number,
  materialUnit: string,
  productCost: number,
  productUnit: string,
): number {
  // Cast the measurement units to the Unit type

  // Assuming material.product.cost is the cost per one unit of the product
  const costPerBaseUnit = productCost

  // Calculate the conversion factor from the product's unit to the material's unit
  const conversionFactor = convert(1)
    .from(productUnit as Unit)
    .to(materialUnit as Unit)

  // Apply this conversion factor to the cost per base unit
  const costPerConvertedUnit = costPerBaseUnit / conversionFactor

  // Calculate the total cost for the required quantity of material
  const materialCost = costPerConvertedUnit * materialQuantity

  return materialCost
}

export default calculateMaterialCost
