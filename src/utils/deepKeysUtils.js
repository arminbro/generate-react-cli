/**
 * Recursively extracts all keys from a nested object as dot-notation paths.
 *
 * @param {object} obj - The object to extract keys from
 * @param {string} [prefix] - Internal prefix for recursion
 * @returns {string[]} Array of dot-notation key paths
 *
 * @example
 * deepKeys({ a: 1, b: { c: 2 } })
 * // Returns: ['a', 'b.c']
 */
export default function deepKeys(obj, prefix = '') {
  return Object.keys(obj).reduce((keys, key) => {
    const path = prefix ? `${prefix}.${key}` : key;
    const value = obj[key];

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return [...keys, ...deepKeys(value, path)];
    }

    return [...keys, path];
  }, []);
}
