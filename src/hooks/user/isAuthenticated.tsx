import React from 'react';
import { DrupalContext } from '../../context';

/**
 * @example
 * { isAuthenticated() ? "Yes" : "No" }
 */
export const isAuthenticated = (): boolean => {
	const { isAuthenticated } = React.useContext(DrupalContext);
	console.log('isAuthenticated :>> ', isAuthenticated);
	return isAuthenticated;
};
