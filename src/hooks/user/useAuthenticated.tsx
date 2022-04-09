import React from 'react';
import { DrupalContext } from '../../context';

/**
 * @example
 * const isAuthenticated = useAuthenticated();
 * {isAuthenticated ? "Yes" : "No"}
 */

export const useAuthenticated = () => {
	const { _isAuthenticated } = React.useContext(DrupalContext);

	return _isAuthenticated;
};
