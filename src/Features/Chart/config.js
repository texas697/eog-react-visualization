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

export const colors = [
  "#000000",
  "#c7000d",
  "#0013f7",
  "#FFC300",
  "#249000",
  "#f77800"
];
