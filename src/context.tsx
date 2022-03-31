import React from 'react';
import { refreshToken } from './refreshToken';
export interface Token {
	date?: number;
	access_token: string;
	refresh_token: string;
	expires_in: number;
	token_type: string;
	expirationDate: number;
}

interface ProviderConfig {
	url: string;
	token: Token | null;
	handleSetToken: (token: Token) => void;
	isAuthenticated: boolean;
	getHeaders: () => Headers;
	addHeaders: (key: string, value: string) => void;
	removeHeaders: (key: string) => void;
	storeOauthSettings: (settings: OauthSettings) => void;
}

export interface OauthSettings {
	url: string;
	client_id: string;
	client_secret: string;
	grant_type: string;
	scope: string;
}

export const DrupalContext = React.createContext<ProviderConfig>({
	url: '',
	token: null,
	isAuthenticated: false,
	getHeaders: () => new Headers(),
	addHeaders: () => {},
	removeHeaders: () => {},
	handleSetToken: () => {},
	storeOauthSettings: () => {},
});

interface ProviderProps {
	readonly children: React.ReactNode;
	config: ProviderConfig;
}

export const DrupalProvider = ({ children, config }: ProviderProps) => {
	const [headers, setHeaders] = React.useState<Headers>(new Headers({ Accept: 'application/json' }));
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
	// Store oauth settings in localStorage
	const storeOauthSettings = (oauthSettings: OauthSettings) => {
		localStorage.setItem('oauthSettings', JSON.stringify(oauthSettings));
	};

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
			}}
		>
			{children}
		</DrupalContext.Provider>
	);
};
