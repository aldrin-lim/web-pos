import convert from 'convert-units'

function getAllMeasurementUnits() {
  const measures = convert().measures()
  const measurementOptions = []

  for (const measure of measures) {
    const units = convert().possibilities(measure)
    for (const unit of units) {
      const unitInfo = convert().describe(unit)
      measurementOptions.push({
        label: `${unitInfo.singular} (${unitInfo.abbr})`,
        value: unitInfo.abbr,
      })
    }
  }

  return measurementOptions
}
export const measurementOptions = getAllMeasurementUnits()
