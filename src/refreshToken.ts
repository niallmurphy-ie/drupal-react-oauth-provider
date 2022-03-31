import { Token } from './context';
import { OauthSettings } from './context';
interface RefreshToken {
	handleSetToken: (token: Token) => void;
}

export const refreshToken = async ({ handleSetToken }: RefreshToken) => {
	const oauthConfig: OauthSettings = JSON.parse(localStorage.getItem('oauthSettings') as string);
	// Get token
	const token: Token = JSON.parse(localStorage.getItem('token') as string);
	if (!oauthConfig || !token) return;

	const formData = new URLSearchParams();
	formData.append('grant_type', 'refresh_token');
	formData.append('client_id', oauthConfig.client_id);
	formData.append('client_secret', oauthConfig.client_secret);
	formData.append('scope', oauthConfig.scope);
	formData.append('refresh_token', token.refresh_token);

	const response = await fetch(`${oauthConfig.url}oauth/token`, {
		method: 'post',
		headers: new Headers({
			Accept: 'application/json',
		}),
		body: formData,
	});
	const parsedResponse = await response.json();

	if (response.ok && parsedResponse.access_token) {
		handleSetToken(parsedResponse);
	} else {
		localStorage.clear();
	}
};
