import { camelizeKeys, decamelizeKeys } from 'humps';

export const cleanObject = (object: any) => JSON.parse(JSON.stringify(object));

export function appDecamelizeKeys(obj: any) {
  return decamelizeKeys(obj, (key, convert) =>
    /^(_|[A-Z]+).*$/.test(key) ? key : convert(key),
  );
}

export function appCamelizeKeys(obj: any) {
  return camelizeKeys(obj, (key, convert) => {
    key = key.replace(/\./g, '_');

    return /^(_|[A-Z]+).*$/.test(key) ? key : convert(key);
  });
}
