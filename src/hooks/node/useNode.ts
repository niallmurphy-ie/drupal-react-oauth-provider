import { useAPI } from '../useAPI';
import { RequestMethod } from '../../enums/RequestMethod';

export const useNode = (nid: number | number[]) => {
	const options = {};
	const endpoint: string = `node/${nid}?_format=json`;
	return useAPI({ endpoint, requestMethod: RequestMethod.Get });
};
