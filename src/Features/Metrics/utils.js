
export function getStyles(x, selectedMetric, theme) {
  return {
    fontWeight: selectedMetric.indexOf(x) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium
  };
}

export function formatString(x) {
  const result = x.replace( /([A-Z])/g, " $1" );
  return result.charAt(0).toUpperCase() + result.slice(1);
}
