/**
 * Formats a number into a human-readable string with suffixes (e.g., 1K, 1.5M).
 * @param {number} num - The number to format.
 * @returns {string} - The formatted number as a string.
 */

const formatNumber = (num: number) => {
    if (num >= 1e9) {
      return (num / 1e9).toFixed(1).replace(/\.0$/, "") + "B";
    }
    if (num >= 1e6) {
      return (num / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
    }
    if (num >= 1e3) {
      return (num / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
    }
    return num.toString();
  };
  
  export default formatNumber;


  const Currencies = [
    { value: "USD", label: "$ Dollar", locale: "en-US" },
    { value: "EUR", label: "€ Euro", locale: "de-DE" },
    { value: "JPY", label: "¥ Yen", locale: "ja-JP" },
    { value: "GBP", label: "£ Pound", locale: "en-GB" },
  ];
  
  export function GetFormatterForCurrency(currency: string) {
    const locale = Currencies.find((c) => c.value === currency)?.locale;
  
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    });
  }