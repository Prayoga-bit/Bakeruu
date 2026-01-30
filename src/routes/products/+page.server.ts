import type { PageServerLoad } from './$types';
import { getProducts, getCategories } from '$lib/server/sheets';

export const load: PageServerLoad = async () => {
	const [products, categories] = await Promise.all([getProducts(), getCategories()]);

	return {
		products,
		categories
	};
};
