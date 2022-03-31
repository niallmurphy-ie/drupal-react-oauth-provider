import React from 'react';
import { DrupalContext } from '../context';
import { refreshToken } from '../util/refreshToken';

// Hide _execute
export interface Params {
	readonly method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
	readonly endpoint: string;
	readonly body: object;
	_execute?: boolean;
}

/**
 * Ignore _execute. It is used for lazyAPI.
 * @example
 * const { data, loading, error } = useAPI({ endpoint, method, body });
 */

export const useAPI = ({ body = {}, method = 'GET', endpoint = '', _execute = true }: Params) => {
	const { getHeaders, url, token, handleSetToken } = React.useContext(DrupalContext);

	const [loading, setLoading] = React.useState<boolean>(false);
	const [error, setError] = React.useState<object | null>(null);
	const [data, setData] = React.useState<object | object[] | null>(null);

	React.useEffect(() => {
		async function loadData() {
			if (_execute) {
				setLoading(true);

				// Check access token expiry time and renew it before making request.
				if (token !== null && token.expirationDate < Math.floor(Date.now() / 1000)) {
					// Must call this async so that the token is set before making the request.
					await refreshToken({
						handleSetToken,
					});
				}

				// Deal with jsonAPI / user input / query strings. Ugly but works.
				const query =
					endpoint.startsWith('jsonapi') || endpoint.includes('_format=json')
						? `${url}${endpoint}`
						: endpoint.includes('?')
						? `${url}${endpoint}&_format=json`
						: `${url}${endpoint}?_format=json`;
				// body not allowed on GET requests. #toDo - PATCH and DELETE ?
				const settings = {
					method: method.toUpperCase(),
					headers: getHeaders(),
					...(body && ('POST' === method || 'PATCH' === method || 'DELETE' === method)
						? { body: JSON.stringify(body) }
						: {}),
				};
				try {
					const response = await fetch(query, settings);
					// DELETE doesn't seem to give a valid JSON
					// This is hacky. #toDO - figure out why.
					if (testJSON(response)) {
						const parsedResponse = await response.json();
						setLoading(false);
						response.ok ? setData(parsedResponse) : setError(parsedResponse);
					} else {
						setLoading(false);
						method === 'DELETE' // Read comments above. #toDo
							? setData({
									message:
										"JSON error. This is probably ok because it was a DELETE. Drupal doesn't return a valid JSON object for delete.",
							  })
							: setError({
									message: 'JSON error. This is not ok.',
							  });
					}
				} catch (error) {
					setLoading(false);
					setError(error as Error);
				}
			}
		}
		loadData();
	}, [_execute, endpoint]);

	return { loading, error, data };
};

function testJSON(strJson: any) {
	try {
		const parsed = JSON.parse(strJson);
		if (parsed && typeof parsed === 'object') {
			return true;
		}
	} catch {
		return false;
	}
	return false;
}
