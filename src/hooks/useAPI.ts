import React from 'react';
import { DrupalContext } from '../context';
import { RequestMethod } from '../enums/RequestMethod';

// import { serializeOptions, passToBody } from '../utils';

interface Params {
	readonly requestMethod?: string;
	readonly endpoint?: string;
}

interface DrupalResponse {
	status?: number;
	statusText?: string;
	headers?: Headers;
}

export const useAPI = ({ requestMethod = RequestMethod.Get, endpoint = '' }: Params) => {
	const { url, token, authorized, headers } = React.useContext(DrupalContext);

	const [loading, setLoading] = React.useState(false);
	const [error, setError] = React.useState<string | object | undefined>(undefined);
	const [data, setData] = React.useState<object[]>([]);

	const [response, setResponse] = React.useState<DrupalResponse | undefined>({
		status: undefined,
		statusText: undefined,
		headers: undefined,
	});

	React.useEffect(() => {
		async function loadData() {
			try {
				setLoading(true);

				const query = `${url}${endpoint}`;
				const settings = {
					method: requestMethod,
					headers,
				};

				const res = await fetch(query, settings);

				const parsedResponse = await res.json();

				setLoading(false);

				setResponse({
					status: res.status,
					statusText: res.statusText,
					headers: res.headers,
				});

				if (parsedResponse.code) {
					setError(parsedResponse);
				} else {
					setData(parsedResponse);
				}
			} catch (err) {
				setLoading(false);
				setError(err as object);
			}
		}

		loadData();
	}, [endpoint]);

	return { ...response, loading, error, data };
};
