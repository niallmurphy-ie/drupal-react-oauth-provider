import React from 'react';
import { DrupalContext } from '../../context';

interface Login {
	username: string;
	password: string;
}
export const useLazyLogin = () => {
	const { url, client_id, client_secret, grant_type, scope } = React.useContext(DrupalContext);
	const [execution, setExecution] = React.useState<boolean>(false);

	const [loading, setLoading] = React.useState<boolean>(false);
	const [error, setError] = React.useState<object | null>(null);
	const [data, setData] = React.useState<any>(null);
	const [username, setUsername] = React.useState<string>('');
	const [password, setPassword] = React.useState<string>('');

	React.useEffect(() => {
		async function loadData() {
			try {
				if (execution) {
					// For "lazy methods" like logout.
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
					console.log('response', response);

					setLoading(false);
					setData(parsedResponse);
				}
			} catch (error) {
				setLoading(false);
				setError(error as object);
			}
		}
		loadData();
	}, [execution, username, password]);

	const login = ({ username, password }: Login) => {
		setUsername(username);
		setPassword(password);
		setExecution(true);
	};

	return [login, { loading, error, data }];
	// return { loading, error, data };
};
