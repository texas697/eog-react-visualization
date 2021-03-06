export const query = `
query($input: [MeasurementQuery]) {
  getMultipleMeasurements(input: $input) {
    metric
    measurements {
      at
      value
      metric
      unit
    }
  }
}
`;

export const newMessages = `
subscription {
  newMeasurement {metric, at, value, unit}
}
`;
