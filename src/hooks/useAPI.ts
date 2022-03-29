import React from 'react';
import { DrupalContext } from '../context';
import { RequestMethod } from '../enums/RequestMethod';

interface Params {
	readonly method?: string;
	readonly endpoint?: string;
	readonly options?: object;
	readonly execute?: boolean;
	readonly credentials?: string;
}

export const useAPI = ({ options = {}, method = RequestMethod.Get, endpoint = '', execute = true }: Params) => {
	const { headers, url } = React.useContext(DrupalContext);

	const [loading, setLoading] = React.useState<boolean>(false);
	const [error, setError] = React.useState<object | null>(null);
	const [data, setData] = React.useState<any>(null);

	React.useEffect(() => {
		async function loadData() {
			try {
				if (execute) {
					setLoading(true);

					const query = endpoint.includes('?')
						? `${url}${endpoint}&_format=json`
						: `${url}${endpoint}?_format=json`;
					const settings = {
						method,
						headers,
						// withCredentials: true,
						// credentials: 'same-origin' as RequestCredentials,
						...(options && RequestMethod.Post === method ? { body: JSON.stringify(options) } : {}),
					};

					const res = await fetch(query, settings);
					const parsedResponse = await res.json();

					console.log('res, parsedResponse', res, parsedResponse);

					setLoading(false);
					// Check for errors from Drupal
					res.ok ? setData(parsedResponse) : setError(parsedResponse);
				}
			} catch (error) {
				setLoading(false);
				setError(error as object);
			}
		}
		loadData();
	}, [execute, endpoint]);

	return { loading, error, data };
};

// import React from 'react';
// import { DrupalContext } from '../context';
// import { RequestMethod } from '../enums/RequestMethod';
// import { Credentials } from '../context';
// // import { serializeOptions, passToBody } from '../utils';

// interface Params {
// 	readonly method?: string;
// 	readonly endpoint?: string;
// 	readonly options?: object;
// 	readonly execution?: boolean;
// 	readonly credentials?: string;
// }

// export const useAPI = ({ options = {}, method = RequestMethod.Get, endpoint = '', execution = true }: Params) => {
// 	const { url, authorized, headers, setCSRF, setCredentials, setLogoutToken, setCSRFToken } =
// 		React.useContext(DrupalContext);

// 	// console.log('headers', headers.get('X-CSRF-Token'));
// 	const [loading, setLoading] = React.useState<boolean>(false);
// 	const [error, setError] = React.useState<object | null>(null);
// 	const [data, setData] = React.useState<any>(null);

// 	React.useEffect(() => {
// 		async function loadData() {
// 			try {
// 				if (execution) {
// 					// For "lazy methods" like logout.
// 					setLoading(true);

// 					const query = endpoint.includes('?')
// 						? `${url}${endpoint}&_format=json`
// 						: `${url}${endpoint}?_format=json`;
// 					const settings = {
// 						method: method,
// 						headers: headers,
// 						withCredentials: true,
// 						credentials: 'same-origin' as RequestCredentials,
// 						...(options && RequestMethod.Post === method ? { body: JSON.stringify(options) } : {}),
// 					};

// 					const res = await fetch(query, settings);
// 					const parsedResponse = await res.json();

// 					console.log('res, parsedResponse', res, parsedResponse);

// 					setLoading(false);
// 					// Check for errors from Drupal
// 					res.ok ? setData(parsedResponse) : setError(parsedResponse);

// 					// If login
// 					if (parsedResponse.csrf_token) {
// 						setCSRF?.(parsedResponse.csrf_token);
// 						setCSRFToken?.(parsedResponse.csrf_token);
// 						setCredentials?.({ ...(options as Credentials) }); // We know name and pass exist here.
// 						setLogoutToken?.(parsedResponse.logout_token);
// 					}
// 				}
// 			} catch (err) {
// 				setLoading(false);
// 				setError(err as object);
// 			}
// 		}

// 		loadData();
// 	}, [endpoint, execution]);

// 	return { loading, error, data };
// };
