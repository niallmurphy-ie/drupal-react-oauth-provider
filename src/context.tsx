import React from 'react';

interface ProviderConfig {
	readonly url: string;
	token?: string;
	authorized: boolean;
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

export const DrupalProvider = ({ children, config }: ProviderProps) => (
	<DrupalContext.Provider value={config}>{children}</DrupalContext.Provider>
);
