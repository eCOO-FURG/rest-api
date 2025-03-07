export function toCurrencyColumnStyle(currency: string) {
  const currencyStyles: Record<string, { numFmt: string }> = {
    BRL: { numFmt: "R$ #,##0.00" },
    USD: { numFmt: "$ #,##0.00" },
  };

  return currencyStyles[currency] ?? {};
}
