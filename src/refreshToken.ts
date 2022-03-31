import { Token } from './context';

interface RefreshToken {
	url: string;
	client_id: string;
	client_secret: string;
	scope: string;
	token: Token;
	handleSetToken: (token: Token) => void;
	isAuthenticated: boolean;
	setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
	addHeaders: (key: string, value: string) => void;
}

export const refreshToken = async ({
	url,
	client_id,
	client_secret,
	scope,
	token,
	handleSetToken,
	isAuthenticated,
	setIsAuthenticated,
	addHeaders,
}: RefreshToken) => {
	// if (!setToken || !token || isAuthenticated || !token.refresh_token) return;

	const formData = new URLSearchParams();
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
		addHeaders('Authorization', `${parsedResponse.token_type} ${parsedResponse.access_token}`);
		addHeaders('Content-Type', 'application/json');
		const newToken = Object.assign({}, parsedResponse);
		newToken.date = Math.floor(Date.now() / 1000);
		newToken.expirationDate = newToken.date + newToken.expires_in;
		setIsAuthenticated(true);
		localStorage.setItem('token', JSON.stringify(token));
		handleSetToken(newToken);
	} else {
		localStorage.clear();
	}
	return parsedResponse;
};
