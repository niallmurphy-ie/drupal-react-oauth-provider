import { Token } from '../context';
import { OauthSettings, OauthSettingsProxy } from '../context';
interface RefreshToken {
	handleSetToken: (token: Token) => void;
}

export const refreshToken = async ({ handleSetToken }: RefreshToken) => {

	const oauthConfig: OauthSettings | OauthSettingsProxy = JSON.parse(localStorage.getItem('oauthSettings') as string);
	// Get token
	const token: Token = JSON.parse(localStorage.getItem('token') as string);
	if (!oauthConfig || !token) return;

	// Client data stored in browser
	if (Object.keys(oauthConfig).includes('_clientID')) {
		const config = oauthConfig as OauthSettings;
		const formData = new URLSearchParams();
		formData.append('grant_type', 'refresh_token');
		formData.append('client_id', config._clientID);
		formData.append('client_secret', config._clientSecret);
		formData.append('scope', config._scope);
		formData.append('refresh_token', token.refresh_token);

		const response = await fetch(`${config.url}oauth/token`, {
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
	}
	// Proxy url stored in browser
	else if (Object.keys(oauthConfig).includes('proxyURL')) {
		const config = oauthConfig as OauthSettingsProxy;
		const response = await fetch(`${config.proxyURL}`, {
			method: 'POST',
			headers: new Headers({
				Accept: 'application/json',
				'Content-Type': 'application/json',
			}),
			body: JSON.stringify({
				refresh_token: token.refresh_token,
			}),
		});
		const parsedResponse = await response.json();
		if (response.ok && parsedResponse.access_token) {
			handleSetToken(parsedResponse);
		}
	}
};
