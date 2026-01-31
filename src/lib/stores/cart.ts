import { writable, derived, get } from 'svelte/store';
import type { CartItem, Cart } from '$lib/types';
import type { Product } from '$lib/types';
import { browser } from '$app/environment';

const CART_STORAGE_KEY = 'bakeruu_cart';

// Initialize cart from localStorage
function getInitialCart(): CartItem[] {
	if (browser) {
		try {
			const stored = localStorage.getItem(CART_STORAGE_KEY);
			if (stored) {
				return JSON.parse(stored);
			}
		} catch (e) {
			console.error('Error reading cart from localStorage:', e);
		}
	}
	return [];
}

// Create the writable store for cart items
function createCartStore() {
	const { subscribe, set, update } = writable<CartItem[]>(getInitialCart());

	// Persist to localStorage whenever cart changes
	if (browser) {
		subscribe((items) => {
			try {
				localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
			} catch (e) {
				console.error('Error saving cart to localStorage:', e);
			}
		});
	}

	return {
		subscribe,

		/**
		 * Add a product to the cart
		 */
		addItem: (product: Product, quantity: number = 1) => {
			update((items) => {
				const existingIndex = items.findIndex((item) => item.productId === product.id);

				if (existingIndex >= 0) {
					// Update quantity if already exists
					const updatedItems = [...items];
					updatedItems[existingIndex] = {
						...updatedItems[existingIndex],
						quantity: updatedItems[existingIndex].quantity + quantity
					};
					return updatedItems;
				} else {
					// Add new item
					return [
						...items,
						{
							productId: product.id,
							productName: product.name,
							price: product.hargaDiskon ?? product.harga,
							quantity,
							image: product.image
						}
					];
				}
			});
		},

		/**
		 * Update quantity of an item
		 */
		updateQuantity: (productId: string, quantity: number) => {
			update((items) => {
				if (quantity <= 0) {
					return items.filter((item) => item.productId !== productId);
				}

				return items.map((item) =>
					item.productId === productId ? { ...item, quantity } : item
				);
			});
		},

		/**
		 * Remove an item from cart
		 */
		removeItem: (productId: string) => {
			update((items) => items.filter((item) => item.productId !== productId));
		},

		/**
		 * Clear the entire cart
		 */
		clear: () => {
			set([]);
		},

		/**
		 * Get the current cart items (snapshot)
		 */
		getItems: () => get({ subscribe })
	};
}

// Export the cart store
export const cartStore = createCartStore();

// Derived store for cart summary
export const cartSummary = derived(cartStore, ($items): Cart => {
	const totalItems = $items.reduce((sum, item) => sum + item.quantity, 0);
	const totalPrice = $items.reduce((sum, item) => sum + item.price * item.quantity, 0);

	return {
		items: $items,
		totalItems,
		totalPrice
	};
});

// Derived store for item count (for header badge)
export const cartItemCount = derived(cartStore, ($items) =>
	$items.reduce((sum, item) => sum + item.quantity, 0)
);
