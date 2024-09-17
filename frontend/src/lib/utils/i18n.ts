import * as m from '$paraglide/messages.js';
import { toCamelCase } from '$lib/utils/locales';

/**
 * Safe translate function that returns the key if the translation is not found.
 * @param key The key to translate.
 * @param params The parameters to pass to the translation function.
 * @param options The options to pass to the translation function.
 */
export function safeTranslate(key: string, params = {}, options = {}): string {
	if (Object.hasOwn(m, toCamelCase(key))) {
		return m[toCamelCase(key)](params, options);
	}
	if (Object.hasOwn(m, key)) {
		return m[key](params, options);
	}
	return key;
}
