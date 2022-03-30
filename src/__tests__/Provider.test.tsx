import React from 'react';
import { DrupalProvider, DrupalContext } from '../context';
// import jest from 'jest-mock';

import { mount } from 'enzyme';

import { render, screen } from '@testing-library/react';

// interface ProviderProps {
// 	readonly children: React.ReactNode;
// 	config: ProviderConfig;
// }

const config = {
	url: 'https://d9-testing.niallmurphy.dev/',
	client_id: '5e6c8415-9a1f-4d8b-9249-72b9dc6f7494',
	client_secret: 'client_secret_simple_oauth',
	grant_type: 'password',
	scope: 'consumer',
	token: null,
	handleSetToken: () => {},
	isAuthenticated: false,
	setIsAuthenticated: () => {},
	headers: new Headers({ Accept: 'application/json' }),
	addHeaders: () => {},
};

// Test DrupalContext and DrupalProvider
describe('DrupalContext', () => {
	it('should render without crashing', () => {
		render(
			<DrupalProvider config={config}>
				<DrupalContext.Consumer>
					{(context) => {
						return <div>{context.url}</div>;
					}}
				</DrupalContext.Consumer>
			</DrupalProvider>,
		);
	});
});
