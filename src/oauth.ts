import { Token } from './context';

interface RefreshToken {
	url: string;
	client_id: string;
	client_secret: string;
	grant_type: string;
	scope: string;
	token: Token;
	setToken: (token: Token) => void;
	isAuthenticated: boolean;
	setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

export const refreshToken = async ({
	url,
	client_id,
	client_secret,
	grant_type,
	scope,
	token,
	setToken,
	isAuthenticated,
	setIsAuthenticated,
}: RefreshToken) => {
	if (!setToken || !token || isAuthenticated) return;

	let formData = new FormData();
	formData.append('grant_type', 'refresh_token');
	formData.append('client_id', client_id);
	formData.append('client_secret', client_secret);
	formData.append('scope', scope);
	formData.append('refresh_token', token.refresh_token);

	const response = await fetch(`${url}oauth/token`, {
		method: 'post',
		headers: new Headers({
			Accept: 'application/json',
		}),
		body: formData,
	});
	const parsedResponse = await response.json();

	if (response.ok && parsedResponse.access_token) {
		const token = Object.assign({}, parsedResponse);
		token.date = Math.floor(Date.now() / 1000);
		token.expirationDate = token.date + token.expires_in;
		setToken(token);
		localStorage.clear();
		localStorage.setItem('token', JSON.stringify(token));
		setIsAuthenticated(true);
	} else {
		throw new Error('Error refreshing token');
	}
};
