import React from 'react';
import { DrupalContext } from '../../context';

/**
 * @example
 * {isAuthenticated() ? "Yes" : "No"}
 */
export const authenticated = (): boolean => {
	const { isAuthenticated } = React.useContext(DrupalContext);
	return isAuthenticated;
};
