/**
 * Sanitizes special characters used in regular expressions, so these can be
 * used as a literal search input.
 *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Escaping
 *
 * @param {string} string input string to be escaped
 */
export function escapeRegExp(string) {
  return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
