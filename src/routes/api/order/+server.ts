import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { decreaseStock } from '$lib/server/sheets';

interface OrderItem {
	productId: string;
	quantity: number;
}

interface OrderRequest {
	items: OrderItem[];
}

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body: OrderRequest = await request.json();

		if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
			return json({ success: false, error: 'Invalid order items' }, { status: 400 });
		}

		// Validate items structure
		for (const item of body.items) {
			if (!item.productId || typeof item.quantity !== 'number' || item.quantity <= 0) {
				return json({ success: false, error: 'Invalid item format' }, { status: 400 });
			}
		}

		// Decrease stock for each item
		const results = await decreaseStock(body.items);

		// Check if all updates were successful
		const allSuccess = results.every((r) => r.success);

		if (allSuccess) {
			return json({
				success: true,
				message: 'Stock updated successfully',
				results
			});
		} else {
			// Some failed - return partial success info
			return json({
				success: false,
				message: 'Some stock updates failed',
				results
			}, { status: 207 }); // 207 Multi-Status
		}
	} catch (error) {
		console.error('[API Order] Error processing order:', error);
		return json(
			{ success: false, error: 'Failed to process order' },
			{ status: 500 }
		);
	}
};
