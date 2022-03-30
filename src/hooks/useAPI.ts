import React from 'react';
import { DrupalContext } from '../context';
import { RequestMethod } from '../enums/RequestMethod';
import { refreshToken } from '../oauth';

export interface Params {
	readonly method: string;
	readonly endpoint: string;
	readonly options: object;
	readonly _execute: boolean;
}

export const useAPI = ({ options = {}, method = RequestMethod.Get, endpoint = '', _execute = true }: Params) => {
	const {
		headers,
		addHeaders,
		url,
		client_id,
		client_secret,
		token,
		scope,
		handleSetToken,
		isAuthenticated,
		setIsAuthenticated,
	} = React.useContext(DrupalContext);

	const [loading, setLoading] = React.useState<boolean>(false);
	const [error, setError] = React.useState<object | null>(null);
	const [data, setData] = React.useState<any>(null);

	React.useEffect(() => {
		async function loadData() {
			try {
				if (_execute) {
					setLoading(true);

					// Check access token expiry time and renew it before making request.
					if (token !== null && token.expirationDate < Math.floor(Date.now() / 1000)) {
						// Must call this async so that the token is set before making the request.
						await refreshToken({
							url: url,
							client_id,
							client_secret,
							scope,
							token,
							handleSetToken,
							isAuthenticated,
							setIsAuthenticated,
							addHeaders,
							headers,
						});
					}

					// Deal with jsonAPI / user input / query strings. Ugly but works.
					//
					const query =
						endpoint.startsWith('jsonapi') || endpoint.includes('_format=json')
							? `${url}${endpoint}`
							: endpoint.includes('?')
							? `${url}${endpoint}&_format=json`
							: `${url}${endpoint}?_format=json`;
					const settings = {
						method,
						headers,
						...(options && RequestMethod.Post === method ? { body: JSON.stringify(options) } : {}), // body not allowed on Get requests
					};

					const response = await fetch(query, settings);
					const parsedResponse = await response.json();

					console.log('response, parsedResponse', response, parsedResponse);

					setLoading(false);
					// Check for errors from Drupal
					response.ok ? setData(parsedResponse) : setError(parsedResponse);
				}
			} catch (error) {
				setLoading(false);
				setError(error as object);
			}
		}
		loadData();
	}, [_execute, endpoint]);

	return { loading, error, data };
};
