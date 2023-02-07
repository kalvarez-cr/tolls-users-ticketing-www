export const currencyFormatter = new Intl.NumberFormat('es-VE', {
  style: 'currency',
  currency: 'VED',
});

export const dateFormatter = (dateStr) => {
  return new Date(dateStr).toLocaleString('es-VE');
};

// export const uniqueKeys = (array: Array<any>, key: string) => {
//   return [...new Set(array.map((it) => it[key]))];
// };

export const removeByKey = (
  array: Array<any>,
  byKey: string,
  values: Array<string>
) => {
  return array.filter((item) => !values.includes(item[byKey]));
};

// export const arrayUniqueByKey = (array: Array<any>, key: string) => {
//   return [...new Map(array.map((it) => [it[key], it])).values()];
// };
