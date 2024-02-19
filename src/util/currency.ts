export function formatToPeso(number: number): string {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0, // Minimum number of decimal places to show
    maximumFractionDigits: 4, // Maximum number of decimal places to show
  }).format(number)
}
