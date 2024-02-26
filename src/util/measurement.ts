import convert, { Measure, Unit } from 'convert-units'

export const pieceMesurement = {
  label: 'Piece (pc)',
  value: 'pc(s)' as Unit,
}

export function getAllMeasurementUnits(
  measures: Measure[] = ['mass', 'volume'],
) {
  const measurementOptions = []

  const units = measures
    .map((measure) => convert().possibilities(measure))
    .flat()

  for (const unit of units) {
    const unitInfo = convert().describe(unit)
    measurementOptions.push({
      label: `${unitInfo.singular} (${unitInfo.abbr})`,
      value: unitInfo.abbr,
    })
  }

  return measurementOptions
}
export const measurementOptions = getAllMeasurementUnits()

export const unitAbbrevationsToLabel = (unit: string) => {
  if (['piece', 'pc', 'pcs', 'piece(s)', 'pieces'].includes(unit)) {
    return 'pc(s)'
  }

  const unitInfo = convert().describe(unit as Unit)
  if (unitInfo.abbr === 'l') {
    return 'L'
  }
  return unitInfo.abbr
}
