function getPaddingBottom(height, width) {
  return ((height / width) * 100).toFixed(2) + '%'
}

function noop() {}

export {
  getPaddingBottom,
  noop
}
