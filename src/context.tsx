import React from 'react';

interface ProviderConfig {
	readonly url: string;
	authorized: boolean;
	headers?: Headers;
	setCSRF?: (csrfToken: string) => void;
	setCredentials?: (credentials: Credentials) => void;
	removeCredentials: () => void;
	setLogoutToken?: (logoutToken: string) => void;
	logoutHeaders?: () => void;
	logoutToken: string;
	csrfToken: string;
	setCSRFToken: (csrfToken: string) => void;
}

export interface Credentials {
	name: string;
	pass: string;
}

export const DrupalContext = React.createContext<ProviderConfig>({
	url: '',
	authorized: false,
	removeCredentials: () => {},
	logoutToken: '',
	csrfToken: '',
	setCSRFToken: () => {},
});

interface ProviderProps {
	readonly children: React.ReactNode;
	config: ProviderConfig;
}

export const DrupalProvider = ({ children, config }: ProviderProps) => {
	const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false);
	const [logoutToken, setLogoutToken] = React.useState<string>('');
	const [csrfToken, setCSRFToken] = React.useState<string>('');
	const [headers, setHeaders] = React.useState<Headers>(
		new Headers({ 'Content-Type': 'application/json', withCredentials: 'true' }),
	);
	// Append headers
	const setCSRF = (csrfToken: string) => {
		const newHeaders = headers;
		newHeaders.append('X-CSRF-Token', csrfToken);
		newHeaders.append('_csrf_token', csrfToken);
		setHeaders(newHeaders);
	};
	const setCredentials = ({ name, pass }: Credentials): void => {
		const newHeaders = headers;
		newHeaders.append('Authorization', `Basic ${btoa(`${name}:${pass}`)}`);
		setHeaders(newHeaders);
	};
	const removeCredentials = () => {
		const newHeaders = headers;
		newHeaders.delete('authorization');
		setHeaders(newHeaders);
	};
	const logoutHeaders = (): void => {
		setHeaders(
			new Headers({
				...headers,
				Authorization: '',
				'X-CSRF-Token': '',
			}),
		);
		setIsAuthenticated(false);
	};

	return (
		<DrupalContext.Provider
			value={{
				...config,
				headers,
				setCSRF,
				setCredentials,
				removeCredentials,
				setLogoutToken,
				logoutHeaders,
				logoutToken,
				csrfToken,
				setCSRFToken,
			}}
		>
			{children}
		</DrupalContext.Provider>
	);
};
