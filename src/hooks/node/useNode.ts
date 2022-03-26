import { useAPI } from '../useAPI';

export const useNode = (nid: number | number[]) => {
	const options = {};
	const endpoint: string = `node/${nid}?_format=json`;
	return useAPI({ options, endpoint });
};
