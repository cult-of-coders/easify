export function humanize(label) {
  return capitalizeFirstLetter(
    label.replace(/([A-Z]+)/g, ' $1').replace(/([A-Z][a-z])/g, ' $1')
  );
}

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
