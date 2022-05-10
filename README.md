# drupal-react-oauth-provider

##### React Context provider and hooks for Drupal, with support for Oauth2 authentication.

##### Simplify headless Drupal REST and authentication.

-   [x] Written in Typescript
-   [x] Zero dependencies
-   [x] Drupal 8+
-   [ ] Drupal 7 - (Planned)
-   [x] Collaboration, feedback, and feature requests welcome

## Features

-   Context Provider stores Oauth across app
-   Abstract away all token management
- 	 Supports proxies to hide oauth client ID, secret etc. on frontend
-   Hooks such as `useAPI`, `useLazyAPI`, `useLazyLogin`, and `useLazyLoginProxy` access REST / JSON:API / Views REST etc. with user credentials in the header
-   GET, POST, PATCH, and DELETE supported
-   `_format=json` added by default. `_format=hal_json` can be added manually



> Lazy?

Taking inspiration from [Apollo GraphQL's](https://www.apollographql.com/docs/react/data/queries#manual-execution-with-uselazyquery) `useLazyQuery`, the hooks provided can be triggered at any time, instead of when the React component is rendered.

# How does it work?

### Wrap your React app with DrupalProvider.

```javascript
import { DrupalProvider } from 'drupal-react-oauth-provider';
const config = {
	url: 'https://d9-testing.niallmurphy.dev/',
};
ReactDOM.render(
	<React.StrictMode>
		<DrupalProvider config={config}>
			<App />
		</DrupalProvider>
	</React.StrictMode>,
	document.getElementById('root'),
);
```

### Log in users with `useLazyLogin` or `useLazyLoginProxy`

```javascript
import { useLazyLogin } from 'drupal-react-oauth-provider';
...
const [login, { loading, error, data }] = useLazyLogin();
...
    onClick={() =>
    	login({ // examples below
    		username, // 'user1',
    		password, // '123456',
    		client_id, // '5e6c8415-9a1f-4d8b-9249-72b9dc6f7494',
    		client_secret, // 'client_secret_simple_oauth',
    		grant_type, // 'password',
    		scope, // 'consumer' < Some Drupal role that's set in oauth
    	})
    }
```
#### Create a proxy server that stores oauth settings.
Any stack can be used as long as it return the JSON from Drupal. Proxy server should listen for `username` and `password` for login, and `refresh_token` for refreshing the access token. The proxy should have the fields in the example above.

Example: https://github.com/niallmurphy-ie/drupal-react-oauth-provider-proxy-example/blob/master/index.js

```javascript
const [login, { loading, error, data }] = useLazyLoginProxy();
...
    onClick={() =>
    	login({
    		username, // 'user1',
    		password, // '123456',
    		proxyURL: 'https://myproxy.mysite.com/oauth',
    	})
    }
```

### Check authentication status with `authenticated`

```javascript
import { useAuthenticated } from 'drupal-react-oauth-provider';
...
const isAuthenticated = useAuthenticated();
{isAuthenticated ? 'You are authenticated': 'You are not authenticated'}
```

### Make queries with `useAPI` or `useLazyAPI`

Get, post, patch, or delete any data you need. eg. Views.

```javascript
import { useLazyAPI } from 'drupal-react-oauth-provider';
...
const [lazyAPI, { loading, error, data }] = useLazyAPI();
...
onClick={() =>
	lazyAPI({
		endpoint: 'node/3',
		method: 'PATCH',
		body: {
			nid: [{ value: '3' }],
			type: [{ target_id: 'article' }],
			title: [{ value: 'This is hardcoded to show how body works.' }],
		},
	})
}
```

### Log out with `useLazyLogout`

```javascript
import { useLazyLogout } from 'drupal-react-oauth-provider';
...
const [logout] = useLazyLogout();
...
<button onClick={() => logout()}>Logout</button>
```

# Drupal Installation

#### Requirements

-   Oauth2 (Tested with [Simple OAuth (OAuth2) & OpenID Connect](https://www.drupal.org/project/simple_oauth/))
-   An oauth client created in Drupal with ID / scope etc.
-   Drupal 8+

#### Recommended

-   Enable REST / RESTUI / JSON:API / Views etc.
-   Create a "me" user View with `Contextual Filter: User ID: User ID from logged in user` to get user roles etc. Access it with `useAPI` or `useLazyAPI`

#

## Note

There is a problem with Jest tests. They require `react` and `react-dom` as devDependencies, but this breaks production. And help writing more comprehensive tests would be welcome. Unit testing the lazy functions is difficult so I think E2E testing with Cyrpus would work better. I've seen some people say that testing Apollo's lazy queries is difficult.

##### I hope the Drupal community can share ideas on how to make this better.

## Enjoy your headless Drupal.

License: MIT
