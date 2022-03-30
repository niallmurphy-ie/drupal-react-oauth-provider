import React from 'react';
import { useAPI } from './useAPI';
import { RequestMethod } from '../enums/RequestMethod';
import { Params } from './useAPI';

export const useLazyAPI = () => {
	const [exectute, setExecute] = React.useState<boolean>(false);
	const [body, setBody] = React.useState<object>({});
	const [method, setMethod] = React.useState<string>(RequestMethod.Get);
	const [endpoint, setEndpoint] = React.useState<string>('');

	// API with _execute set to false so it doesn't fire.
	const { data, loading, error } = useAPI({ body, method, endpoint, _execute: exectute });

	// When anything from useAPI changes, set execute to false so that the API can be used again.
	React.useEffect(() => {
		setExecute(false);
		setBody({});
		setMethod(RequestMethod.Get);
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
