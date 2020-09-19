import * as cookie from 'cookie';

const COOKIE_NAMES = Object.freeze({
  SERVICE_FORM_LANGUAGES: 'service-form-languages',
});

export default COOKIE_NAMES;

/**
 * A utility function used to serialize a value into a cookie.
 *
 * @param {string} key
 * @param {any} value
 */
export function writeJsonCookie(key: string, value: any): void {
  if (value !== undefined) {
    const cookieValue: string = JSON.stringify(value);
    document.cookie = cookie.serialize(key, cookieValue);
  }
}

/**
 * A utility function used to deserialize a value from a cookie.
 *
 * @param {string} key
 * @return {any}
 */
export function readJsonCookie(key: string): any {
  const cookieValue: string = cookie.parse(document.cookie)[key];

  let value: any;
  if (cookieValue) {
    value = JSON.parse(cookieValue);
  }

  return value;
}
