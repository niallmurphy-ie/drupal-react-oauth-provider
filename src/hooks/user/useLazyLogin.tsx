import React from 'react';
import { DrupalContext } from '../../context';
import { RequestMethod } from '../../enums/RequestMethod';
interface Login {
	username: string;
	password: string;
}
export const useLazyLogin = () => {
	const {
		headers,
		addHeaders,
		url,
		client_id,
		client_secret,
		grant_type,
		scope,
		handleSetToken,
		isAuthenticated,
		setIsAuthenticated,
	} = React.useContext(DrupalContext);

	// Lazy functionality
	const [execute, setExecute] = React.useState<boolean>(false);
	const [username, setUsername] = React.useState<string | null>(null);
	const [password, setPassword] = React.useState<string | null>(null);

	const [loading, setLoading] = React.useState<boolean>(false);
	const [error, setError] = React.useState<object | null>(null);
	const [data, setData] = React.useState<object | null>(null);

	React.useEffect(() => {
		async function loadData() {
			try {
				if (execute && username && password && !isAuthenticated) {
					setLoading(true);

					const formData = new URLSearchParams();
					formData.append('grant_type', grant_type);
					formData.append('client_id', client_id);
					formData.append('client_secret', client_secret);
					formData.append('scope', scope);
					formData.append('username', username);
					formData.append('password', password);

					const response = await fetch(`${url}oauth/token`, {
						method: RequestMethod.Post,
						headers,
						body: formData,
					});

					const parsedResponse = await response.json();
					console.log('response, parsedResponse', response, parsedResponse);

					if (response.ok && parsedResponse.access_token) {
						addHeaders('Authorization', `${parsedResponse.token_type} ${parsedResponse.access_token}`);
						addHeaders('Content-Type', 'application/json');
						const newToken = Object.assign({}, parsedResponse);
						newToken.date = Math.floor(Date.now() / 1000);
						newToken.expirationDate = newToken.date + newToken.expires_in;
						setIsAuthenticated(true);
						// localStorage.clear();
						localStorage.setItem('token', JSON.stringify(newToken));
						handleSetToken(newToken);
						setData(parsedResponse);
					} else {
						localStorage.clear();
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
