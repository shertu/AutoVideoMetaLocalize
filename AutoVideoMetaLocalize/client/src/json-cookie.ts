import * as cookie from 'cookie';

/**
 * A utility function used to serialize a value into a cookie.
 *
 * @param {string} key
 * @param {T} value
 */
export function writeJsonCookie<T>(key: string, value: T): void {
  if (value) {
    const cookieValue: string = JSON.stringify(value);
    document.cookie = cookie.serialize(key, cookieValue);
  }
}

/**
 * A utility function used to deserialize a value from a cookie.
 *
 * @param {string} key
 * @return {T}
 */
export function readJsonCookie<T>(key: string): T {
  const cookieValue: string = cookie.parse(document.cookie)[key];

  let value: T;
  if (cookieValue) {
    value = JSON.parse(cookieValue);
  }

  return value;
}
