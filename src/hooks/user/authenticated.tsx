import React from 'react';
import { DrupalContext } from '../../context';

/**
 * @example
 * {authenticated() ? "Yes" : "No"}
 */

const authenticated = (): boolean => {
	const { isAuthenticated } = React.useContext(DrupalContext);

	// Typescript checks
	if (!isAuthenticated) return false;

	return isAuthenticated;
};

export const isAuthenticated = () => {
	const isAuthenticated = authenticated();
	return isAuthenticated;
};
