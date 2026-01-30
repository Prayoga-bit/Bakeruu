import { google } from 'googleapis';
import { GOOGLE_SHEET_ID, GOOGLE_API_KEY } from '$env/static/private';
import type { Product, ProductRaw } from '$lib/types/product.js';

// Change this to match your actual sheet tab name (visible at the bottom of Google Sheets)
const SHEET_NAME = 'Katalog';
const RANGE = `${SHEET_NAME}!A:I`;

// Column mapping based on your sheet structure:
// A: id, B: name, C: deskripsi, D: kategori, E: harga, F: harga_diskon, G: stok, H: image, I: is_active
const COLUMN_INDEX = {
	id: 0,
	name: 1,
	deskripsi: 2,
	kategori: 3,
	harga: 4,
	harga_diskon: 5,
	stok: 6,
	image: 7,
	is_active: 8
} as const;

function getSheets() {
	return google.sheets({
		version: 'v4',
		auth: GOOGLE_API_KEY
	});
}

function parseNumber(value: string | undefined): number {
	if (!value) return 0;
	// Remove commas and parse as float
	const cleaned = value.toString().replace(/,/g, '');
	const parsed = parseFloat(cleaned);
	return isNaN(parsed) ? 0 : parsed;
}

function parseBoolean(value: string | undefined): boolean {
	if (!value) return false;
	return value.toString().toUpperCase() === 'TRUE';
}

/**
 * Convert Google Drive file ID or URL to direct image URL
 * Supports:
 * - Just the ID: "ABC123xyz"
 * - Full share URL: "https://drive.google.com/file/d/ABC123xyz/view"
 * - Direct URL: "https://drive.google.com/uc?id=ABC123xyz"
 * - Any other URL: returns as-is
 */
function parseImageUrl(value: string | undefined): string {
	if (!value) return '';

	const trimmed = value.trim();

	// If it's already a direct URL (not Google Drive), return as-is
	if (trimmed.startsWith('http') && !trimmed.includes('drive.google.com')) {
		return trimmed;
	}

	// Extract Google Drive file ID
	let fileId = trimmed;

	// Match: https://drive.google.com/file/d/{ID}/view or similar
	const driveFileMatch = trimmed.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
	if (driveFileMatch) {
		fileId = driveFileMatch[1];
	}

	// Match: https://drive.google.com/uc?id={ID} or &id={ID}
	const driveUcMatch = trimmed.match(/drive\.google\.com\/uc\?.*id=([a-zA-Z0-9_-]+)/);
	if (driveUcMatch) {
		fileId = driveUcMatch[1];
	}

	// Match: https://drive.google.com/open?id={ID}
	const driveOpenMatch = trimmed.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/);
	if (driveOpenMatch) {
		fileId = driveOpenMatch[1];
	}

	// If we have a file ID (either extracted or raw), convert to direct URL
	if (fileId && !fileId.startsWith('http')) {
		// Use lh3.googleusercontent.com for better image serving
		return `https://lh3.googleusercontent.com/d/${fileId}`;
	}

	return trimmed;
}

function rowToProduct(row: string[]): Product {
	const harga = parseNumber(row[COLUMN_INDEX.harga]);
	const hargaDiskon = parseNumber(row[COLUMN_INDEX.harga_diskon]);

	return {
		id: row[COLUMN_INDEX.id] || '',
		name: row[COLUMN_INDEX.name] || '',
		deskripsi: row[COLUMN_INDEX.deskripsi] || '',
		kategori: row[COLUMN_INDEX.kategori] || '',
		harga,
		hargaDiskon: hargaDiskon > 0 && hargaDiskon < harga ? hargaDiskon : undefined,
		stok: parseNumber(row[COLUMN_INDEX.stok]),
		image: parseImageUrl(row[COLUMN_INDEX.image]),
		isActive: parseBoolean(row[COLUMN_INDEX.is_active])
	};
}

export async function getProducts(): Promise<Product[]> {
	try {
		const sheets = getSheets();
		const response = await sheets.spreadsheets.values.get({
			spreadsheetId: GOOGLE_SHEET_ID,
			range: RANGE
		});

		const rows = response.data.values;
		if (!rows || rows.length <= 1) {
			console.log('[Sheets] No data found in sheet');
			return [];
		}

		// Skip header row (index 0), convert to products, filter active only
		const products = rows
			.slice(1)
			.map((row) => rowToProduct(row))
			.filter((product) => product.isActive && product.id);

		console.log(`[Sheets] Loaded ${products.length} active products`);
		return products;
	} catch (error) {
		console.error('[Sheets] Error fetching products:', error);
		throw new Error('Failed to fetch products from Google Sheets');
	}
}

export async function getProductById(id: string): Promise<Product | null> {
	try {
		const products = await getProducts();
		const product = products.find((p) => p.id === id);
		return product || null;
	} catch (error) {
		console.error(`[Sheets] Error fetching product ${id}:`, error);
		throw new Error('Failed to fetch product from Google Sheets');
	}
}

export async function getCategories(): Promise<string[]> {
	try {
		const products = await getProducts();
		const categories = [...new Set(products.map((p) => p.kategori).filter(Boolean))];
		return categories.sort();
	} catch (error) {
		console.error('[Sheets] Error fetching categories:', error);
		throw new Error('Failed to fetch categories from Google Sheets');
	}
}

// Test connection function
export async function testConnection(): Promise<{
	success: boolean;
	message: string;
	data?: Product[];
}> {
	try {
		const products = await getProducts();
		return {
			success: true,
			message: `Connected successfully. Found ${products.length} active products.`,
			data: products
		};
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Unknown error';
		return {
			success: false,
			message: `Connection failed: ${errorMessage}`
		};
	}
}
