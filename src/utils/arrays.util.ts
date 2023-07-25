export function isArray2DEmpty(arr: any[][]) {
  if (!Array.isArray(arr) || arr.length === 0) {
    return true;
  }

  for (const subArray of arr) {
    if (!Array.isArray(subArray) || subArray.length !== 0) {
      return false;
    }
  }

  return true;
}
