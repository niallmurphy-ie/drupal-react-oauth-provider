import React from 'react';
import { DrupalContext } from '../../context';

/**
 * @example
 * const { addHeaders } = useHeaders();
 * addHeaders('Hello', 'World');
 */

interface UseHeaders {
	addHeaders: (key: string, value: string) => void;
	removeHeaders: (key: string) => void;
}

// #toDo -
export const useHeaders = (): UseHeaders => {
	const { addHeaders, removeHeaders } = React.useContext(DrupalContext);
	if (!addHeaders || !removeHeaders) return {} as UseHeaders; // This is safe as these functions always exist? #toDo - Check this
	return {
		addHeaders,
		removeHeaders,
	};
};
