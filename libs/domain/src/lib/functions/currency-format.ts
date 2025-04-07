export function currencyFormatWithDecimals(value: number): string {
  return `$${value.toLocaleString('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  })}`;
}

export function currencyFormatWithoutDecimals(value: number): string {
    return `$${value.toLocaleString('en-US', {
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    })}`;
  }
