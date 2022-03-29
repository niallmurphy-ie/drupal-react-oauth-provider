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
	setToken: React.Dispatch<React.SetStateAction<Token | null>>;
	isAuthenticated: boolean;
	setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
	headers: Headers;
	addHeaders: (key: string, value: string) => void;
	removeHeaders: (key: string) => void;
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
	setToken: () => {},
	setIsAuthenticated: () => {},
	addHeaders: () => {},
	removeHeaders: () => {},
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
		newHeaders.append(key, value);
		setHeaders(newHeaders);
	};
	const removeHeaders = (key: string) => {
		const newHeaders = headers;
		newHeaders.delete(key);
		setHeaders(newHeaders);
	};

	React.useEffect(() => {
		console.log('token :>> ', token);
		if (!token || isAuthenticated) return;
		if (token !== null && token.expirationDate > Math.floor(Date.now() / 1000) && !isAuthenticated) {
			setIsAuthenticated(true);
			addHeaders('Authorization', `${token.token_type} ${token.access_token}`);
		}
		if (token !== null && token.expirationDate < Math.floor(Date.now() / 1000) && !isAuthenticated) {
			refreshToken({
				url: config.url,
				client_id: config.client_id,
				client_secret: config.client_secret,
				scope: config.scope,
				token,
				setToken,
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
				removeHeaders,
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
