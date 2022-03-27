import React from 'react';

interface ProviderConfig {
	readonly url: string;
	authorized: boolean;
	headers?: Headers;
	setCSRF?: (csrfToken: string) => void;
	setCredentials?: (credentials: Credentials) => void;
	setLogoutToken?: (logoutToken: string) => void;
	clearHeaders?: () => void;
}

export interface Credentials {
	name: string;
	pass: string;
}

export const DrupalContext = React.createContext<ProviderConfig>({
	url: '',
	authorized: false,
});

interface ProviderProps {
	readonly children: React.ReactNode;
	config: ProviderConfig;
}

export const DrupalProvider = ({ children, config }: ProviderProps) => {
	const [logoutToken, setLogoutToken] = React.useState<string>('');
	const [headers, setHeaders] = React.useState<Headers>(
		new Headers({
			'Content-Type': 'application/json',
		}),
	);
	const setCSRF = (token: string): void => {
		setHeaders(
			new Headers({
				...headers,
				'X-CSRF-Token': token,
			}),
		);
	};
	const setCredentials = ({ name, pass }: Credentials): void => {
		setHeaders(
			new Headers({
				...headers,
				Authorization: `Basic ${btoa(`${name}:${pass}`)}`,
			}),
		);
	};
	const clearHeaders = (): void => {
		setHeaders(
			new Headers({
				...headers,
				Authorization: '',
				'X-CSRF-Token': '',
			}),
		);
	};

	return (
		<DrupalContext.Provider value={{ ...config, headers, setCSRF, setCredentials, setLogoutToken, clearHeaders }}>
			{children}
		</DrupalContext.Provider>
	);
};
