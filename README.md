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
-   Hooks such as `useAPI`, `useLazyAPI`, and `useLazyLogin` access REST / JSON:API / Views REST etc. with user credentials in the header
-   GET, POST, PATCH, and DELETE supported
-   `_format=json` added by default. `_format=hal_json` can be added manually

#

> Lazy?

Taking inspiration from [Apollo GraphQL's](https://www.apollographql.com/docs/react/data/queries#manual-execution-with-uselazyquery) `useLazyQuery`, the hooks provided can be triggered at any time, instead of when the React component is rendered.

## How does it work?

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

### Log users in with `useLazyLogin`

```javascript
import { useLazyLogin } from 'drupal-react-oauth-provider';
...
const [login, { loading, error, data }] = useLazyLogin();
...
    onClick={() =>
    	login({
    		username,
    		password,
    		client_id,
    		client_secret,
    		grant_type,
    		scope,
    	})
    }
```

### Check authentication status with `isAuthenticated`

```javascript
import { isAuthenticated } from 'drupal-react-oauth-provider';
...
{isAuthenticated() ? 'You are authenticated': 'You are not authenticated'}
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

<br/><br/>

##### Note:

There is a problem with Jest tests. They require `react` and `react-dom` as devDependencies, but this breaks production. And help writing more comprehensive tests would be welcome. Unit testing the lazy functions is difficult so I think E2E testing with Cyrpus would work better. I've seen some people talk testing Apollo's lazy queries being difficult.

### I hope the Drupal community can share ideas on how to make this better.

## Enjoy your headless Drupal.

##### Tested with [Simple OAuth (OAuth2) & OpenID Connect](https://www.drupal.org/project/simple_oauth/)

<br/>

License: MIT
