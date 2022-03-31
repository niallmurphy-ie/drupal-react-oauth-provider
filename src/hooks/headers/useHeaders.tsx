import React from 'react';
import { DrupalContext } from '../../context';

/**
 * @example
 * const { addHeaders } = useHeaders();
 *	addHeaders('Hello', 'World');
 */
export const useHeaders = () => {
	const { addHeaders, removeHeaders } = React.useContext(DrupalContext);
	return {
		addHeaders,
		removeHeaders,
	};
};
