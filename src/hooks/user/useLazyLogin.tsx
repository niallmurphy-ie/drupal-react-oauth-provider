import React from 'react';
import { DrupalContext } from '../../context';
interface Login {
	username: string;
	password: string;
	client_id: string;
	client_secret: string;
	grant_type: string;
	scope: string;
}

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
export const useLazyLogin = () => {
	const { url, handleSetToken, isAuthenticated, storeOauthSettings } = React.useContext(DrupalContext);

	// Lazy functionality through execute like Apollo's useLazyQuery.
	// Seems like providing a function is the best way for something like login.
	const [execute, setExecute] = React.useState<boolean>(false);

	const [username, setUsername] = React.useState<string | null>(null);
	const [password, setPassword] = React.useState<string | null>(null);
	const [client_id, setClientId] = React.useState<string | null>(null);
	const [client_secret, setClientSecret] = React.useState<string | null>(null);
	const [grant_type, setGrantType] = React.useState<string | null>(null);
	const [scope, setScope] = React.useState<string | null>(null);

	const [loading, setLoading] = React.useState<boolean>(false);
	const [error, setError] = React.useState<object | null>(null);
	const [data, setData] = React.useState<object | null>(null);

	React.useEffect(() => {
		async function loadData() {
			try {
				if (
					execute &&
					username &&
					password &&
					grant_type &&
					client_id &&
					client_secret &&
					scope &&
					!isAuthenticated
				) {
					setLoading(true);

					const formData = new URLSearchParams();
					formData.append('grant_type', grant_type);
					formData.append('client_id', client_id);
					formData.append('client_secret', client_secret);
					formData.append('scope', scope);
					formData.append('username', username);
					formData.append('password', password);

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
							client_id,
							client_secret,
							grant_type,
							scope,
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
				setError(error as object);
				setExecute(false);
			}
		}
		loadData();
	}, [execute, username, password]);

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
