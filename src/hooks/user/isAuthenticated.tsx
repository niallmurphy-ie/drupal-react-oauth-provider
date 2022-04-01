import React from 'react';
import { DrupalContext } from '../../context';

/**
 * @example
 * {isAuthenticated() ? "Yes" : "No"}
 */

export const isAuthenticated = () => {
	const { _isAuthenticated } = React.useContext(DrupalContext);

	// Typescript checks
	if (!_isAuthenticated) return false;

	const returnAuthenticated = () => {
		return _isAuthenticated;
	};

	return returnAuthenticated;
};
