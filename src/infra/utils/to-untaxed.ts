export function toUntaxed(price: number, tax: number) {
  return (price * 100) / (100 + tax);
}
