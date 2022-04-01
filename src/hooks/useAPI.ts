import React from 'react';
import { DrupalContext } from '../context';
import { refreshToken } from '../util/refreshToken';
import { Error, Data, Loading } from '../returnTypes';

// Hide _execute
export type Params = {
	readonly endpoint: string;
	readonly method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
	readonly body?: object;
	_execute?: boolean;
};

/**
 * Ignore _execute. It is used for lazyAPI.
 * Add ?_format=hal_json or &_format=hal_json to the endpoint if it is required. Otherwise, _format=json will be added automatically.
 * @example
 * const { data, loading, error } = useAPI({ endpoint, method, body });
 */

export const useAPI = ({ body = {}, method = 'GET', endpoint = '', _execute = true }: Params) => {
	const { addHeaders, getHeaders, url, token, handleSetToken } = React.useContext(DrupalContext);

	const [loading, setLoading] = React.useState<Loading>(false);
	const [error, setError] = React.useState<Error>(null);
	const [data, setData] = React.useState<Data>(null);

	React.useEffect(() => {
		async function loadData() {
			if (_execute) {
				setLoading(true);

				// Typescript checks
				if (!addHeaders || !getHeaders || !url || !handleSetToken) return;

				// Set Headers here because component useAPI (not useLazyAPI) can render too fast resulting in authentication error.
				// #toDo - Find a better solution.
				if (token && token.expirationDate > Math.floor(Date.now() / 1000)) {
					addHeaders('Authorization', `Bearer ${token.access_token}`);
				}

				// Check access token expiry time and renew it before making request.
				if (token && token.expirationDate < Math.floor(Date.now() / 1000)) {
					// Must call this async so that the token is set before making the request.
					await refreshToken({
						handleSetToken,
					});
				}

				// Deal with jsonAPI / user input / query strings.
				// If hal_json is required for some requests, users should just enter it
				const query =
					endpoint.startsWith('jsonapi') ||
					endpoint.includes('_format=json') ||
					endpoint.includes('_format=hal_json')
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
					// Drupal's 204 for DELETE messes with fetch.
					// https://github.com/whatwg/fetch/issues/113
					if (method === 'DELETE' && response.status === 204) {
						setLoading(false);
						setData({
							message: 'Content deleted.',
						});
						setError(null);
					} else {
						if (response.body) {
							const parsedResponse = await response.json();
							setLoading(false);
							if (response.ok) {
								setData(parsedResponse);
								setError(null);
							} else {
								setData(null);
								setError(parsedResponse);
							}
						} else {
							setLoading(false);
							method === 'DELETE' // Read comments above. #toDo
								? setData({
										message: 'Content deleted.',
								  })
								: setError({
										message: 'JSON error. This is not ok.',
								  });
						}
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
