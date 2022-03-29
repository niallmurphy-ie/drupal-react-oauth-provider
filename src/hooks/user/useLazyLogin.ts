import React from 'react';
import { DrupalContext } from '../../context';

interface Login {
	username: string;
	password: string;
}
export const useLazyLogin = () => {
	const { url, client_id, client_secret, grant_type, scope, setToken, isAuthenticated, setIsAuthenticated } =
		React.useContext(DrupalContext);
	// Lazy functionality
	const [execute, setExecute] = React.useState<boolean>(false);
	const [username, setUsername] = React.useState<string | null>(null);
	const [password, setPassword] = React.useState<string | null>(null);

	const [loading, setLoading] = React.useState<boolean>(false);
	const [error, setError] = React.useState<object | null>(null);
	const [data, setData] = React.useState<any>(null);

	React.useEffect(() => {
		async function loadData() {
			try {
				if (isAuthenticated) {
					return setError({ message: 'Already logged in.' });
				}
				if (execute && username && password && !isAuthenticated) {
					setLoading(true);

					let formData = new FormData();
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
					console.log('response, parsedResponse', response, parsedResponse);

					if (response.ok && parsedResponse.access_token) {
						const token = Object.assign({}, parsedResponse);
						token.date = Math.floor(Date.now() / 1000);
						token.expirationDate = token.date + token.expires_in;
						setToken(token);
						localStorage.setItem('token', JSON.stringify(token));
						setIsAuthenticated(true);
						setData(parsedResponse);
					} else {
						setError(parsedResponse);
					}
					setLoading(false);
					setExecute(false);
					setUsername(null);
					setPassword(null);
				}
			} catch (error) {
				setLoading(false);
				setError(error as object);
				setExecute(false);
				setUsername(null);
				setPassword(null);
			}
		}
		loadData();
	}, [execute, username, password]);

	const login = ({ username, password }: Login) => {
		setUsername(username);
		setPassword(password);
		setExecute(true);
	};

	return [login, { loading, error, data }];
};
