import {
  Product,
  ProductVariant,
  ProductVariantAttribute,
} from 'types/product.types'

export const uniqueVariantCombinations = (
  variants?: Array<ProductVariant>,
): boolean => {
  if (!variants) {
    return true // If variants are undefined, skip the check
  }
  const seenCombinations = new Set<string>()

  for (const variant of variants) {
    // Here, focus on the 'variant' property of each variant object
    const sortedOptions = variant.variantOptions
      .map((opt) => `${opt.option}:${opt.value}`)
      .sort()
      .join('|')

    if (seenCombinations.has(sortedOptions)) {
      return false // Duplicate combination found
    }

    seenCombinations.add(sortedOptions)
  }

  return true // No duplicates found
}

export function cartesianProduct(
  arr: Array<ProductVariantAttribute>,
): string[][] {
  return arr.reduce<string[][]>(
    (a, b) => a.flatMap((d) => b.values.map((e) => [d, e].flat())),
    [[]],
  )
}

export function getVariantOptionsFromProduct(
  product: Product,
): Array<ProductVariantAttribute> {
  const variantOptionsMap = new Map<string, Set<string>>()

  product.variants?.forEach((variant) => {
    variant.variantOptions.forEach(({ option, value }) => {
      if (!variantOptionsMap.has(option)) {
        variantOptionsMap.set(option, new Set())
      }
      variantOptionsMap.get(option)?.add(value)
    })
  })

  const variantOptions: Array<ProductVariantAttribute> = []

  variantOptionsMap.forEach((values, option) => {
    variantOptions.push({
      option,
      values: Array.from(values),
    })
  })

  return variantOptions
}

export function generateProductVariants(
  variantOptionsInput: Array<ProductVariantAttribute>,
  product: Product,
): Product {
  const variantCombinations = cartesianProduct(variantOptionsInput)
  const variants: Product['variants'] = variantCombinations.map(
    (combination) => {
      const variantName = combination.join('/')

      if (
        variantOptionsInput.length ===
        getVariantOptionsFromProduct(product).length
      ) {
        const newVariantOptions = combination.map((value, index) => ({
          option: variantOptionsInput[index].option,
          value: value,
        }))

        const existingVariant = product.variants?.find((variant) =>
          variant.variantOptions.every((opt, idx) => {
            return (
              opt.value === newVariantOptions[idx].value &&
              opt.option === newVariantOptions[idx].option
            )
          }),
        )

        if (existingVariant) {
          return existingVariant
        }
      }

      return {
        name: `${product.name} (${variantName})`,
        cost: 0,
        price: 0,
        profit: 0,
        measurement: 'pieces',
        quantity: 0,
        allowBackOrder: true,
        category: '',
        description: '',
        expiryDate: null,
        images: [],
        variantOptions: combination.map((value, index) => ({
          option: variantOptionsInput[index].option,
          value: value,
        })),
      }
    },
  )

  return {
    ...product,
    variants,
  }
}
