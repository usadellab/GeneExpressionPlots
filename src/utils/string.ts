/**
 * Sanitize special characters used in regular expressions so they can be
 * used in a search input.
 *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Escaping
 *
 * @param {string} regexpString input string to be escaped
 */
export function escapeRegExp(regexpString: string): string {
  return regexpString.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

/**
 * Remove leading backslashes from known string separator characters.
 *
 * Currently supported characters:
 *  - `\t` (tab)
 *  - `\s` (whitespace)
 *
 * @param charString input string to be unescaped
 * @returns the unescaped delimiter
 */
export function unescapeDelimiters(charString: string): string {
  return charString.replace(/\\t|\\s/, (match) => {
    switch (match) {
      case '\\t':
        return '\t';

      case '\\s':
        return 's';

      default:
        return match;
    }
  });
}
