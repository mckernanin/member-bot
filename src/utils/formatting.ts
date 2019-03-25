import * as currency from "currency-formatter";

const iskFormat = {
  code: "ISK",
  symbol: "ISK",
  thousandsSeparator: ",",
  decimalSeparator: ".",
  symbolOnLeft: false,
  spaceBetweenAmountAndSymbol: true,
  decimalDigits: 2
};

const m3Format = {
  code: "m3",
  symbol: "",
  thousandsSeparator: ",",
  decimalSeparator: ".",
  symbolOnLeft: false,
  spaceBetweenAmountAndSymbol: true,
  decimalDigits: 2
};

export const toISK = (amount: number): string =>
  currency.format(amount, iskFormat);

export const toM3 = (amount: number): string =>
  currency.format(amount, m3Format);

export const toLocationName = (locationId: number, locations) => {
  const location = locations.find(location => location.id === locationId);
  if (location) {
    return location.name;
  }
  return locationId;
};
