import type { PageServerLoad } from './$types';
import { getProducts, getTestimonials } from '$lib/server/sheets';

export const load: PageServerLoad = async () => {
	const [products, testimonials] = await Promise.all([getProducts(), getTestimonials()]);

	// Get featured products (first 4 active products)
	const featuredProducts = products.slice(0, 4);

	return {
		featuredProducts,
		testimonials
	};
};
