import React from 'react';

interface ProviderConfig {
	readonly url: string;
	readonly client_id: string;
	readonly client_secret: string;
	readonly grant_type: string;
	readonly scope: string;
	username: string;
	password: string;
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
	username: '',
	password: '',
	setHeaders: () => {},
});

interface ProviderProps {
	readonly children: React.ReactNode;
	config: ProviderConfig;
}

export const DrupalProvider = ({ children, config }: ProviderProps) => {
	const [headers, setHeaders] = React.useState<Headers>(new Headers({ 'Content-Type': 'application/json' }));

	console.log('config :>> ', config);
	return (
		<DrupalContext.Provider
			value={{
				...config, // includes client_id and client_secret
				headers,
				setHeaders,
			}}
		>
			{children}
		</DrupalContext.Provider>
	);
};
