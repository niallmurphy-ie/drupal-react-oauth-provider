import React from 'react';
import { useAPI } from '../useAPI';
import { RequestMethod } from '../../enums/RequestMethod';

type UseLogin = {
	name: string;
	pass: string;
};

export const useLogin = ({ name, pass }: UseLogin) => {
	const options = {
		name,
		pass,
	};
	const endpoint: string = `user/login`;
	return useAPI({ endpoint, options, method: RequestMethod.Post });
};
