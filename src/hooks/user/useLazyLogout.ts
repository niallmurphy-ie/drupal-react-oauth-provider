import React from 'react';
import { useAPI } from '../useAPI';
import { RequestMethod } from '../../enums/RequestMethod';
import { DrupalContext } from '../../context';

export const useLazyLogout = () => {
	const [execution, setExecution] = React.useState<boolean>(false);

	const { logoutToken, logoutHeaders, removeCredentials, csrfToken } = React.useContext(DrupalContext);

	const logout = () => {
		removeCredentials(); // Must remove Authorization or Drupal won't accept the request.
		setExecution(true);
	};

	const endpoint: string = `user/logout?_format=json&token=${logoutToken}`;

	const result = useAPI({
		endpoint,
		options: {},
		method: RequestMethod.Post,
		execution,
	});

	if ((logoutToken === '' || logoutToken === null) && execution === true) {
		return [
			logout,
			{
				loading: false,
				error: {
					message: 'No logout token found',
				},
				data: null,
			},
		];
	}
	return [logout, result];
};
