export interface Product {
	id: string;
	name: string;
	deskripsi: string;
	kategori: string;
	harga: number;
	hargaDiskon?: number;
	stok: number;
	image: string;
	isActive: boolean;
	isBestSeller: boolean;
}

export interface ProductFilters {
	category?: string;
	search?: string;
	sortBy?: 'price_asc' | 'price_desc';
}

export interface ProductRaw {
	id: string;
	name: string;
	deskripsi: string;
	kategori: string;
	harga: string;
	harga_diskon: string;
	stok: string;
	image: string;
	is_active: string;
	best_seller: string;
}
