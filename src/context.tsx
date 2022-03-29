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
	setToken: (token: Token | null) => void;
	isAuthenticated: boolean;
	setIsAuthenticated: (isAuthenticated: boolean) => void;
	headers: Headers;
	setHeaders: (headers: Headers) => void;
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
	setToken: () => {},
	headers: new Headers(),
	setHeaders: () => {},
	isAuthenticated: false,
	setIsAuthenticated: () => {},
});

interface ProviderProps {
	readonly children: React.ReactNode;
	config: ProviderConfig;
}

export const DrupalProvider = ({ children, config }: ProviderProps) => {
	const [headers, setHeaders] = React.useState<Headers>(new Headers({ 'Content-Type': 'application/json' }));
	const [token, setToken] = React.useState<Token | null>(
		localStorage.getItem('token') !== null ? JSON.parse(localStorage.getItem('token') as string) : null,
	);
	const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false);

	React.useEffect(() => {
		if (!token || isAuthenticated) return;
		if (token !== null && token.expirationDate > Math.floor(Date.now() / 1000)) setIsAuthenticated(true);
		if (token !== null && token.expirationDate < Math.floor(Date.now() / 1000)) {
			refreshToken({
				url: config.url,
				client_id: config.client_id,
				client_secret: config.client_secret,
				grant_type: config.grant_type,
				scope: config.scope,
				token,
				setToken,
				isAuthenticated,
				setIsAuthenticated,
			});
		}
	}, [token]);

	return (
		<DrupalContext.Provider
			value={{
				...config, // includes client_id and client_secret
				headers,
				setHeaders,
				token,
				setToken,
				isAuthenticated,
				setIsAuthenticated,
			}}
		>
			{children}
		</DrupalContext.Provider>
	);
};
