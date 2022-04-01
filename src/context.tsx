import React from 'react';
import { refreshToken } from './util/refreshToken';

export interface Token {
	date: number;
	access_token: string;
	refresh_token: string;
	expires_in: number;
	token_type: string;
	expirationDate: number;
}
// Oauth Settings set in login function.
export interface OauthSettings {
	url: string;
	_clientID: string;
	_clientSecret: string;
	_grantType: string;
	_scope: string;
}

// Everything here except url is optional. If not, it is required when instantiating DrupalProvider which is impossible.
interface ProviderConfig {
	url: string;
	token?: Token | null;
	handleSetToken?: (token: Token) => void;
	isAuthenticated?: boolean;
	getHeaders?: () => Headers;
	addHeaders?: (key: string, value: string) => void;
	removeHeaders?: (key: string) => void;
	storeOauthSettings?: (settings: OauthSettings) => void;
	logoutUser?: () => void;
}

interface ProviderProps {
	readonly children: React.ReactNode;
	config: ProviderConfig;
}

export const DrupalContext = React.createContext<ProviderConfig>({
	url: '',
});

export const DrupalProvider = ({ children, config }: ProviderProps) => {
	const [headers, setHeaders] = React.useState<Headers>(
		new Headers({ 'Content-Type': 'application/json', Accept: 'application/json' }),
	);
	const [token, setToken] = React.useState<Token | null>(
		localStorage.getItem('token') !== null ? JSON.parse(localStorage.getItem('token') as string) : null,
	);
	const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false);

	/**
	 * This function will add headers for useAPI(), useLazyAPI().
	 */
	const addHeaders = (key: string, value: string) => {
		const newHeaders = headers;
		newHeaders.delete(key); // toDo - Crutch? Checks should be enough?
		newHeaders.append(key, value);
		setHeaders(newHeaders);
	};
	/**
	 * This function will remove headers for useAPI(), useLazyAPI().
	 */
	const removeHeaders = (key: string) => {
		const newHeaders = headers;
		newHeaders.delete(key);
		setHeaders(newHeaders);
	};
	const getHeaders = () => {
		return headers;
	};
	// We are setting tokens from outside React because of rules of hooks. Handler needed for state to work correctly.
	const handleSetToken = (newToken: Token) => {
		newToken.date = Math.floor(Date.now() / 1000);
		newToken.expirationDate = newToken.date + newToken.expires_in;
		localStorage.setItem('token', JSON.stringify(newToken));
		setIsAuthenticated(true);
		setToken(newToken);
		addHeaders('Authorization', `${newToken.token_type} ${newToken.access_token}`);
		addHeaders('Content-Type', 'application/json');
	};
	const logoutUser = () => {
		localStorage.clear();
		setToken(null);
		setIsAuthenticated(false);
		removeHeaders('Authorization');
		removeHeaders('Content-Type');
	};
	// Store oauth settings in localStorage
	const storeOauthSettings = (oauthSettings: OauthSettings) => {
		localStorage.setItem('oauthSettings', JSON.stringify(oauthSettings));
	};

	// Refresh token if it is expired when app is opened.
	React.useEffect(() => {
		if (!token || isAuthenticated) return;
		if (token.expirationDate > Math.floor(Date.now() / 1000)) {
			setIsAuthenticated(true);
			addHeaders('Authorization', `${token.token_type} ${token.access_token}`);
		}
		if (token.expirationDate < Math.floor(Date.now() / 1000)) {
			// Ok to call this non async as the state will update
			refreshToken({
				handleSetToken,
			});
		}
	}, [token]);

	return (
		<DrupalContext.Provider
			value={{
				...config, // includes url
				token,
				handleSetToken,
				isAuthenticated,
				storeOauthSettings,
				getHeaders,
				addHeaders,
				removeHeaders,
				logoutUser,
			}}
		>
			{children}
		</DrupalContext.Provider>
	);
};
