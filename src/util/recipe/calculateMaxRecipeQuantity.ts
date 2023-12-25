import convert, { Unit } from 'convert-units'
import { Material } from 'types/recipe.types'

const calculateMaxRecipeQuantity = (materials: Material[]): number => {
  let minQuantityPossible = Infinity

  for (const material of materials) {
    if (!material.product) {
      throw new Error(`Product not found for material: ${material.id}`)
    }

    // Asserting the type of measurement units to 'Unit'
    const fromUnit = material.product.measurement as Unit
    const toUnit = material.measurement as Unit

    const productQuantityInMaterialUnit = convert(material.product.quantity)
      .from(fromUnit)
      .to(toUnit)

    const quantityPossibleWithProduct =
      productQuantityInMaterialUnit / material.quantity

    minQuantityPossible = Math.min(
      minQuantityPossible,
      quantityPossibleWithProduct,
    )
  }

  return Math.floor(minQuantityPossible)
}

export default calculateMaxRecipeQuantity
