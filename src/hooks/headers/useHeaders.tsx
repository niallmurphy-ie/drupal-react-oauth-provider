import React from 'react';
import { DrupalContext } from '../../context';

export const useHeaders = () => {
	const { addHeaders, removeHeaders } = React.useContext(DrupalContext);
	return {
		addHeaders,
		removeHeaders,
	};
};
