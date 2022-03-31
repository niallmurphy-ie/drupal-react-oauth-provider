import React from 'react';
import { useAPI } from './useAPI';
import { Params } from './useAPI';

/**
 * Add ?_format=hal_json or &_format=hal_json to the endpoint if it is required. Otherwise, _format=json will be added automatically.
 * @example
 * const [lazyAPI, { loading, error, data }] = useLazyAPI();
 *
 */

export const useLazyAPI = () => {
	const [exectute, setExecute] = React.useState<boolean>(false);
	const [body, setBody] = React.useState<object>({});
	const [method, setMethod] = React.useState<'GET' | 'POST' | 'PATCH' | 'DELETE'>('GET');
	const [endpoint, setEndpoint] = React.useState<string>('');

	// API with _execute set to false so it doesn't fire.
	const { data, loading, error } = useAPI({ body, method, endpoint, _execute: exectute });

	// When anything from useAPI changes, set execute to false so that the API can be used again.
	React.useEffect(() => {
		setExecute(false);
		setBody({});
		setMethod('GET');
		setEndpoint('');
	}, [data, loading, error]);

	// Set execute to true so that the API can be used.
	const lazyAPI = ({ body, method, endpoint }: Params) => {
		setBody(body);
		setMethod(method);
		setEndpoint(endpoint);
		setExecute(true);
	};

	return [lazyAPI, { data, loading, error }];
};
