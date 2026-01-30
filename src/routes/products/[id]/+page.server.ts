import type { PageServerLoad } from './$types';
import { getProductById } from '$lib/server/sheets';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const product = await getProductById(params.id);

	if (!product) {
		throw error(404, {
			message: 'Produk tidak ditemukan'
		});
	}

	return {
		product
	};
};
