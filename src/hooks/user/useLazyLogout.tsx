import React from 'react';
import { DrupalContext } from '../../context';

export const useLazyLogout = () => {
	const { logoutUser } = React.useContext(DrupalContext);
	const [execute, setExecute] = React.useState<boolean>(false);

	React.useEffect(() => {
		async function loadData() {
			try {
				if (execute) {
					logoutUser();
					setExecute(false);
				}
			} catch (error) {
				setExecute(false);
				console.log(error as Error);
			}
		}
		loadData();
	}, [execute]);

	const logout = () => setExecute(true);
	return [logout];
};
