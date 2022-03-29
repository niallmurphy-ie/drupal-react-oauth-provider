import React from 'react';

interface Token {
	access_token: string;
	refresh_token: string;
	expires_in: number;
	token_type: string;
}

interface ProviderConfig {
	readonly url: string;
	readonly client_id: string;
	readonly client_secret: string;
	readonly grant_type: string;
	readonly scope: string;
	token: Token | null;
	setToken: (token: Token | null) => void;
	isAuthenticated: boolean;
	setIsAuthenticated: (isAuthenticated: boolean) => void;
	headers?: Headers;
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
		localStorage.getItem('token') !== null ? (JSON.parse(localStorage.getItem('token') as string) as Token) : null,
	);
	const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false);

	React.useEffect(() => {
		if (token !== null) {
			setHeaders(
				new Headers({ 'Content-Type': 'application/json', Authorization: `Bearer ${token.access_token}` }),
			);
			setIsAuthenticated(true);
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
