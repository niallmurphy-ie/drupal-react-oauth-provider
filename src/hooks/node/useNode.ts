import { useAPI } from '../useAPI';
import { RequestMethod } from '../../enums/RequestMethod';

export const useNode = (nid: number | number[]) => {
	const options = {};
	const endpoint: string = `node/${nid}`;
	return useAPI({ endpoint, options, method: RequestMethod.Get });
};
