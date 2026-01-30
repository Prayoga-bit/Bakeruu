import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { testConnection } from '$lib/server/sheets';

export const GET: RequestHandler = async () => {
	const result = await testConnection();
	return json(result);
};
