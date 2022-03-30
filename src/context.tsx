import React from 'react';
import { refreshToken } from './oauth';
export interface Token {
	access_token: string;
	refresh_token: string;
	expires_in: number;
	token_type: string;
	expirationDate: number;
}

interface ProviderConfig {
	url: string;
	client_id: string;
	client_secret: string;
	grant_type: string;
	scope: string;
	token: Token | null;
	handleSetToken: (token: Token) => void;
	isAuthenticated: boolean;
	setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
	headers: Headers;
	addHeaders: (key: string, value: string) => void;
}

export interface Credentials {
	name: string;
	pass: string;
}

export const DrupalContext = React.createContext<ProviderConfig>({
	url: '',
	client_id: '',
	client_secret: '',
	grant_type: '',
	scope: '',
	token: null,
	isAuthenticated: false,
	headers: new Headers(),
	handleSetToken: () => {},
	setIsAuthenticated: () => {},
	addHeaders: () => {},
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

	const addHeaders = (key: string, value: string) => {
		const newHeaders = headers;
		newHeaders.delete(key);
		newHeaders.append(key, value);
		setHeaders(newHeaders);
	};
	const removeHeaders = (key: string) => {
		const newHeaders = headers;
		newHeaders.delete(key);
		setHeaders(newHeaders);
	};
	// We are setting tokens from outside React because of rules of hooks. Handler needed for state to work correctly.
	const handleSetToken = (newToken: Token) => {
		setToken(newToken);
		localStorage.removeItem('token');
		localStorage.setItem('token', JSON.stringify(newToken));
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
				url: config.url,
				client_id: config.client_id,
				client_secret: config.client_secret,
				scope: config.scope,
				token,
				handleSetToken,
				isAuthenticated,
				setIsAuthenticated,
				addHeaders,
				headers,
			});
		}
	}, [token]);

	return (
		<DrupalContext.Provider
			value={{
				...config, // includes client_id and client_secret
				headers,
				addHeaders,
				token,
				handleSetToken,
				isAuthenticated,
				setIsAuthenticated,
			}}
		>
			{children}
		</DrupalContext.Provider>
	);
};
