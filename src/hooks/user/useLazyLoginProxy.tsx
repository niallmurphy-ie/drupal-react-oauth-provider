import React from 'react';
import { DrupalContext } from '../../context';
import { Data, Error, Loading } from '../../returnTypes';
type LoginProxy = {
	username: string;
	password: string;
	proxyURL: string;
};
interface LazyLogin {
	loading: Loading;
	error: Error;
	data: Data;
}
type UseLazyLoginProxy = [(params: LoginProxy) => void, LazyLogin];

/**
 * Uses a proxy server to login to Drupal.
 * @example
 * const [login, { loading, error, data }] = useLazyLoginProxy();
 * login({
 * 	username: 'username',
 * 	password: 'password',
 * 	proxyURL: 'url',
 * });
 */
export const useLazyLoginProxy = (): UseLazyLoginProxy => {
	const { handleSetToken, _isAuthenticated, storeOauthSettings } = React.useContext(DrupalContext);

	// Lazy functionality through execute like Apollo's useLazyQuery.
	// Seems like providing a function is the best way for something like login.
	const [execute, setExecute] = React.useState<boolean>(false);

	const [_username, setUsername] = React.useState<string | null>(null);
	const [_password, setPassword] = React.useState<string | null>(null);
	const [_proxyURL, setProxyURL] = React.useState<string | null>(null);

	const [loading, setLoading] = React.useState<Loading>(false);
	const [error, setError] = React.useState<Error>(null);
	const [data, setData] = React.useState<Data>(null);

	React.useEffect(() => {
		async function loadData() {
			try {
				// Typescript checks
				if (!handleSetToken || !storeOauthSettings) return;

				if (execute && _username && _password && _proxyURL && !_isAuthenticated) {
					setLoading(true);
					setError(null);

					const response = await fetch(`${_proxyURL}`, {
						method: 'post',
						headers: new Headers({
							Accept: 'application/json',
							'Content-Type': 'application/json',
						}),
						body: JSON.stringify({
							username: _username,
							password: _password,
						}),
					});
					const parsedResponse = await response.json();

					if (response.ok && parsedResponse.access_token) {
						handleSetToken(parsedResponse);
						storeOauthSettings({
							proxyURL: _proxyURL,
						});
						setData(parsedResponse);
					} else {
						setError(parsedResponse);
					}
					setUsername(null);
					setPassword(null);
					setLoading(false);
					setExecute(false);
				}
			} catch (error) {
				setUsername(null);
				setPassword(null);
				setLoading(false);
				setError(error as Error);
				setExecute(false);
			}
		}
		loadData();
	}, [execute, _username, _password, _proxyURL]);

	const login = ({ username, password, proxyURL }: LoginProxy) => {
		setUsername(username);
		setPassword(password);
		setProxyURL(proxyURL);
		setExecute(true);
	};

	return [login, { loading, error, data }];
};
