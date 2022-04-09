import React from 'react';
import { DrupalContext } from '../../context';
import { Data, Error, Loading } from '../../returnTypes';
type Login = {
	username: string;
	password: string;
	client_id: string;
	client_secret: string;
	grant_type: string;
	scope: string;
}
interface LazyLogin {
	loading: Loading;
	error: Error;
	data: Data;
}
type UseLazyLogin = [(params: Login) => void, LazyLogin];

/**
 * The oauth settings get saved to localStorage so refresh tokens work. Doing it this way means you can easily have multiple oauth clients in one app.
 * @example
 * const [login, { loading, error, data }] = useLazyLogin();
 * login({
 * 	username: 'username',
 * 	password: 'password',
 * 	client_id: 'client_id',
 * 	client_secret: 'client_secret',
 * 	grant_type: 'grant_type',
 * 	scope: 'scope',
 * });
 */
export const useLazyLogin = (): UseLazyLogin => {
	const { url, handleSetToken, _isAuthenticated, storeOauthSettings } = React.useContext(DrupalContext);

	// Lazy functionality through execute like Apollo's useLazyQuery.
	// Seems like providing a function is the best way for something like login.
	const [execute, setExecute] = React.useState<boolean>(false);

	const [_username, setUsername] = React.useState<string | null>(null);
	const [_password, setPassword] = React.useState<string | null>(null);
	const [_clientID, setClientId] = React.useState<string | null>(null);
	const [_clientSecret, setClientSecret] = React.useState<string | null>(null);
	const [_grantType, setGrantType] = React.useState<string | null>(null);
	const [_scope, setScope] = React.useState<string | null>(null);

	const [loading, setLoading] = React.useState<Loading>(false);
	const [error, setError] = React.useState<Error>(null);
	const [data, setData] = React.useState<Data>(null);

	React.useEffect(() => {
		async function loadData() {
			try {
				// Typescript checks
				if (!url || !handleSetToken || !storeOauthSettings) return;

				if (
					execute &&
					_username &&
					_password &&
					_grantType &&
					_clientID &&
					_clientSecret &&
					_scope &&
					!_isAuthenticated
				) {
					setLoading(true);

					const formData = new URLSearchParams();
					formData.append('grant_type', _grantType);
					formData.append('client_id', _clientID);
					formData.append('client_secret', _clientSecret);
					formData.append('scope', _scope);
					formData.append('username', _username);
					formData.append('password', _password);

					const response = await fetch(`${url}oauth/token`, {
						method: 'post',
						headers: new Headers({
							Accept: 'application/json',
						}),
						body: formData,
					});
					const parsedResponse = await response.json();

					if (response.ok && parsedResponse.access_token) {
						handleSetToken(parsedResponse);
						storeOauthSettings({
							url,
							_clientID,
							_clientSecret,
							_grantType,
							_scope,
						});
						setData(parsedResponse);
					} else {
						setError(parsedResponse);
					}
					setUsername(null);
					setPassword(null);
					setClientId(null);
					setClientSecret(null);
					setGrantType(null);
					setScope(null);
					setLoading(false);
					setExecute(false);
				}
			} catch (error) {
				setUsername(null);
				setPassword(null);
				setClientId(null);
				setClientSecret(null);
				setGrantType(null);
				setScope(null);
				setLoading(false);
				setError(error as Error);
				setExecute(false);
			}
		}
		loadData();
	}, [execute, _username, _password]);

	const login = ({ username, password, client_id, client_secret, grant_type, scope }: Login) => {
		setUsername(username);
		setPassword(password);
		setClientId(client_id);
		setClientSecret(client_secret);
		setGrantType(grant_type);
		setScope(scope);
		setExecute(true);
	};

	return [login, { loading, error, data }];
};
