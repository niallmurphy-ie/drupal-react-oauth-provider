import React from 'react';

interface ProviderConfig {
	readonly url: string;
	token?: string;
	authorized: boolean;
	headers?: Headers;
	setToken?: (token: string) => void;
	removeToken?: () => void;
}

export const DrupalContext = React.createContext<ProviderConfig>({
	url: '',
	token: undefined,
	authorized: false,
});

interface ProviderProps {
	readonly children: React.ReactNode;
	config: ProviderConfig;
}

export const DrupalProvider = ({ children, config }: ProviderProps) => {
	const [headers, setHeaders] = React.useState<Headers>(new Headers());
	const setToken = (token: string) => {
		setHeaders(
			new Headers({
				...headers,
				Authorization: `Bearer ${token}`,
			}),
		);
	};
	const removeToken = () => {
		setHeaders(
			new Headers({
				...headers,
				Authorization: '',
			}),
		);
	};

	return (
		<DrupalContext.Provider value={{ ...config, headers, setToken, removeToken }}>
			{children}
		</DrupalContext.Provider>
	);
};
