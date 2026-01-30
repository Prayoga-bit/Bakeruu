/**
 * Format price to Indonesian Rupiah format without currency symbol
 * @param price - Number to format
 * @returns Formatted price string (e.g., "15.000")
 */
export function formatPrice(price: number): string {
	return new Intl.NumberFormat('id-ID', {
		minimumFractionDigits: 0,
		maximumFractionDigits: 0
	}).format(price);
}

/**
 * Format price with Rupiah currency symbol
 * @param price - Number to format
 * @returns Formatted price string with Rp (e.g., "Rp 15.000")
 */
export function formatRupiah(price: number): string {
	return `Rp ${formatPrice(price)}`;
}

/**
 * Calculate discount percentage
 * @param originalPrice - Original price
 * @param discountedPrice - Discounted price
 * @returns Discount percentage (e.g., 20)
 */
export function calculateDiscountPercentage(
	originalPrice: number,
	discountedPrice: number
): number {
	if (originalPrice <= 0 || discountedPrice >= originalPrice) return 0;
	return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
}
