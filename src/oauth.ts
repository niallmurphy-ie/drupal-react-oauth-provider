interface GetOauthToken {
	readonly url: string;
	readonly client_id: string;
	readonly client_secret: string;
	readonly grant_type: string;
	readonly username: string;
	readonly password: string;
	readonly scope: string;
}

export const getOauthToken = async ({
	url,
	client_id,
	client_secret,
	grant_type,
	username,
	password,
	scope,
}: GetOauthToken) => {
	console.log('getting oauth token');
	const token = await fetchOauthToken({
		url: `${url}oauth/token`,
		client_id,
		client_secret,
		grant_type,
		username,
		password,
		scope,
	});
	return token as object;
};

// getRefreshToken() {
// 	console.log('getting refresh token');
// 	this.refreshOauthToken('token', `${DRUPAL_API_ROOT}oauth/token`);
// }

interface FetchOauthToken {
	readonly url: string;
	readonly client_id: string;
	readonly client_secret: string;
	readonly grant_type: string;
	readonly username: string;
	readonly password: string;
	readonly scope: string;
}

type Token = {
	date?: Date;
};

const fetchOauthToken = async ({
	url,
	client_id,
	client_secret,
	grant_type,
	username,
	password,
	scope,
}: FetchOauthToken) => {
	console.log('getting oauth token');
	let formData = new FormData();
	formData.append('grant_type', grant_type);
	formData.append('client_id', client_id);
	formData.append('client_secret', client_secret);
	formData.append('scope', scope);
	formData.append('username', username);
	formData.append('password', password);

	try {
		const response = await fetch(url, {
			method: 'post',
			headers: new Headers({
				Accept: 'application/json',
			}),
			body: formData,
		});

		const data = await response.json;
		console.log('data', data);
		// return data;

		// const accessToken = da.
		// // Convert the date to a UNIX timestamp.
		// token.date = Math.floor(Date.now() / 1000);
		// token.expirationDate = token.date + token.expires_in;
		// this.setState({ token: token });
		// this.setState({ appUserLoggedIn: true });
		// localStorage.setItem('token', JSON.stringify(token));
		// After getting a new token we should also refresh the node data since
		// different users might have access to different content.
		// this.loadNodeData();

		return data;
	} catch (error) {
		return error;
	}
};

// refreshOauthToken(destination, url) {
// 	console.log('getting refresh token');
// 	if (this.state.token !== null) {
// 		let formData = new FormData();
// 		formData.append('grant_type', 'refresh_token');
// 		formData.append('client_id', config.oauth.client_id);
// 		formData.append('client_secret', config.oauth.client_secret);
// 		formData.append('scope', config.oauth.scope);
// 		formData.append('refresh_token', this.state.token.refresh_token);

// 		fetch(url, {
// 			method: 'post',
// 			headers: new Headers({
// 				Accept: 'application/json',
// 			}),
// 			body: formData,
// 		})
// 			.then(function (response) {
// 				return response.json();
// 			})
// 			.then((data) => {
// 				console.log('refresh token', data);
// 				let token = Object.assign({}, data);
// 				// Convert the date to a UNIX timestamp.
// 				token.date = Math.floor(Date.now() / 1000);
// 				token.expirationDate = token.date + token.expires_in;
// 				this.setState({ token: token });
// 				localStorage.setItem('token', JSON.stringify(token));
// 			})
// 			.catch((err) => console.log('API got an error', err));
// 	}
// }
