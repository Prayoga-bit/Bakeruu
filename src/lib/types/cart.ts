export interface CartItem {
	productId: string;
	productName: string;
	price: number;
	quantity: number;
	image: string;
}

export interface Cart {
	items: CartItem[];
	totalItems: number;
	totalPrice: number;
}

export interface CustomerInfo {
	name: string;
	address: string;
	notes?: string;
}
