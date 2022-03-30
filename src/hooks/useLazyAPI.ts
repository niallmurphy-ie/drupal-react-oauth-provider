import React from 'react';
import { useAPI } from './useAPI';
import { RequestMethod } from '../enums/RequestMethod';
import { Params } from './useAPI';

export const useLazyAPI = () => {
	const [exectute, setExecute] = React.useState<boolean>(false);
	const [options, setOptions] = React.useState<object>({});
	const [method, setMethod] = React.useState<string>(RequestMethod.Get);
	const [endpoint, setEndpoint] = React.useState<string>('');

	// API with _execute set to false
	const { data, loading, error } = useAPI({ options, method, endpoint, _execute: exectute });

	// When anything from useAPI changes, set execute to false so that the API can be used again.
	React.useEffect(() => {
		setExecute(false);
		setOptions({});
		setMethod(RequestMethod.Get);
		setEndpoint('');
	}, [data, loading, error]);

	const lazyAPI = ({ options, method, endpoint }: Params) => {
		setOptions(options);
		setMethod(method);
		setEndpoint(endpoint);
		setExecute(true); // Set execute to true so that the data is loaded.
	};

	return [lazyAPI, { data, loading, error }];
};
