import React from 'react';
import { DrupalContext } from '../context';
import { RequestMethod } from '../enums/RequestMethod';
import { Credentials } from '../context';
// import { serializeOptions, passToBody } from '../utils';

interface Params {
	readonly method?: string;
	readonly endpoint?: string;
	readonly options: object;
}

interface DrupalResponse {
	status?: number;
	statusText?: string;
	headers?: Headers;
}

export const useAPI = ({ options = {}, method = RequestMethod.Get, endpoint = '' }: Params) => {
	const { url, authorized, headers, setCSRF, setCredentials } = React.useContext(DrupalContext);

	const [loading, setLoading] = React.useState(false);
	const [error, setError] = React.useState<object | undefined>(undefined);
	const [data, setData] = React.useState<object[]>([]);

	React.useEffect(() => {
		async function loadData() {
			try {
				setLoading(true);

				const query = endpoint.includes('?')
					? `${url}${endpoint}&_format=json`
					: `${url}${endpoint}?_format=json`;
				const settings = {
					method: method,
					headers: headers,
					...(options && RequestMethod.Post === method ? { body: JSON.stringify(options) } : {}),
				};

				const res = await fetch(query, settings);
				const parsedResponse = await res.json();

				setLoading(false);
				// Check for errors from Drupal
				if (!res.ok) {
					setError(parsedResponse);
				} else {
					setData(parsedResponse);
				}
				// If login
				if (parsedResponse.csrf_token) {
					setCSRF?.(parsedResponse.csrf_token);
					setCredentials?.({ ...(options as Credentials) }); // We know name and pass exist here.
				}
			} catch (err) {
				setLoading(false);
				setError(err as object);
			}
		}

		loadData();
	}, [endpoint]);

	return { loading, error, data };
};
