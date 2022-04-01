/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { DrupalProvider, DrupalContext } from '../context';
import { render, screen } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { useAPI } from '../';
import { useLazyAPI } from '../';

const config = {
	url: 'https://d9-testing.niallmurphy.dev/',
	client_id: '5e6c8415-9a1f-4d8b-9249-72b9dc6f7494',
	client_secret: 'client_secret_simple_oauth',
	grant_type: 'password',
	scope: 'consumer',
	token: null,
	handleSetToken: () => {},
	_isAuthenticated: false,
	setIsAuthenticated: () => {},
	getHeaders: () => new Headers({ Accept: 'application/json' }),
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
	it('should render children', () => {
		render(
			<DrupalProvider config={config}>
				<DrupalContext.Consumer>
					{(context) => {
						return <div>{context.url}</div>;
					}}
				</DrupalContext.Consumer>
			</DrupalProvider>,
		);
		// Expect context.url to be in the document
		expect(screen.getByText('https://d9-testing.niallmurphy.dev/')).toBeInTheDocument();
	});
});

describe('DrupalProvider', () => {
	it('addHeaders should add a header to the Headers object', () => {
		render(
			<DrupalProvider config={config}>
				<DrupalContext.Consumer>
					{(context) => {
						context.addHeaders('test', 'testHeader');
						return <div>{context.getHeaders().get('test')}</div>;
					}}
				</DrupalContext.Consumer>
			</DrupalProvider>,
		);
		// Expect context.getHeaders().get('test') to be 'test'
		expect(screen.getByText('testHeader')).toBeInTheDocument();
	});
});

// Test useAPI
describe('useAPI', () => {
	const { result } = renderHook(() =>
		useAPI({ endpoint: 'https://d9-testing.niallmurphy.dev/node/1', method: 'GET', body: {}, _execute: true }),
	);
	it('should return an object', () => {
		expect(result.current).toBeInstanceOf(Object);
	});
});

// toDo: How to test the lazyAPI function. People also have trouble testing useLazyQuery which is similar.
// toDo: Use Cypress for E2E to testing instead?

// [lazyAPI, {data, error, loading}] = useLazyAPI();
// describe('useLazyAPI', () => {
// 	const { result } = renderHook(() => useLazyAPI());
// 	it('should return a function', () => {
// 		expect(result.current[0]).toBeInstanceOf(Function);
// 	});
// 	it('should return an object', () => {
// 		expect(result.current[1]).toBeInstanceOf(Object);
// 	});
// });
