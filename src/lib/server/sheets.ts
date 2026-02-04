import { google } from 'googleapis';
import { GOOGLE_SHEET_ID, GOOGLE_API_KEY, GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY } from '$env/static/private';
import type { Product, ProductRaw } from '$lib/types/product.js';
import type { Testimonial } from '$lib/types/testimonial.js';

// Change this to match your actual sheet tab name (visible at the bottom of Google Sheets)
const SHEET_NAME = 'Katalog';
const RANGE = `${SHEET_NAME}!A:J`;

const TESTIMONI_SHEET_NAME = 'Testimoni';
const TESTIMONI_RANGE = `${TESTIMONI_SHEET_NAME}!A:E`;

// Column mapping based on your sheet structure:
// A: id, B: name, C: deskripsi, D: kategori, E: harga, F: harga_diskon, G: stok, H: image, I: is_active, J: best_seller
const COLUMN_INDEX = {
	id: 0,
	name: 1,
	deskripsi: 2,
	kategori: 3,
	harga: 4,
	harga_diskon: 5,
	stok: 6,
	image: 7,
	is_active: 8,
	best_seller: 9
} as const;

// Testimoni column mapping: id, nama, tipe, bintang, komentar
const TESTIMONI_COLUMN_INDEX = {
	id: 0,
	nama: 1,
	tipe: 2,
	bintang: 3,
	komentar: 4
} as const;

// Read-only sheets client (using API key)
function getSheets() {
	return google.sheets({
		version: 'v4',
		auth: GOOGLE_API_KEY
	});
}

// Read-write sheets client (using service account with JWT)
function getSheetsWithAuth() {
	// Check if service account credentials are available
	if (!GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY) {
		throw new Error('Service account credentials not configured. Please add GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY to your .env file.');
	}

	// Use JWT client directly for service account authentication
	const auth = new google.auth.JWT({
		email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
		key: GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n'),
		scopes: ['https://www.googleapis.com/auth/spreadsheets']
	});

	return google.sheets({ version: 'v4', auth });
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
	let fileId = '';

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

	// If no match found but it looks like just an ID (alphanumeric with - and _)
	if (!fileId && /^[a-zA-Z0-9_-]+$/.test(trimmed)) {
		fileId = trimmed;
	}

	// If we have a file ID, convert to direct URL
	if (fileId) {
		// Try multiple formats - lh3 is more reliable for embedding
		return `https://lh3.googleusercontent.com/d/${fileId}=s0`;
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
		isActive: parseBoolean(row[COLUMN_INDEX.is_active]),
		isBestSeller: parseBoolean(row[COLUMN_INDEX.best_seller])
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

function rowToTestimonial(row: string[]): Testimonial {
	return {
		id: row[TESTIMONI_COLUMN_INDEX.id] || '',
		nama: row[TESTIMONI_COLUMN_INDEX.nama] || '',
		tipe: row[TESTIMONI_COLUMN_INDEX.tipe] || '',
		bintang: parseNumber(row[TESTIMONI_COLUMN_INDEX.bintang]),
		komentar: row[TESTIMONI_COLUMN_INDEX.komentar] || ''
	};
}

export async function getTestimonials(): Promise<Testimonial[]> {
	try {
		const sheets = getSheets();
		const response = await sheets.spreadsheets.values.get({
			spreadsheetId: GOOGLE_SHEET_ID,
			range: TESTIMONI_RANGE
		});

		const rows = response.data.values;
		if (!rows || rows.length <= 1) {
			console.log('[Sheets] No testimonials found in sheet');
			return [];
		}

		// Skip header row (index 0), convert to testimonials
		const testimonials = rows
			.slice(1)
			.map((row) => rowToTestimonial(row))
			.filter((t) => t.id && t.nama);

		console.log(`[Sheets] Loaded ${testimonials.length} testimonials`);
		return testimonials;
	} catch (error) {
		console.error('[Sheets] Error fetching testimonials:', error);
		// Return empty array instead of throwing to not break the page
		return [];
	}
}

interface StockUpdateItem {
	productId: string;
	quantity: number;
}

interface StockUpdateResult {
	productId: string;
	success: boolean;
	message: string;
	newStock?: number;
}

/**
 * Decrease stock for multiple products after an order is placed.
 * This function uses a service account to write to Google Sheets.
 */
export async function decreaseStock(items: StockUpdateItem[]): Promise<StockUpdateResult[]> {
	const results: StockUpdateResult[] = [];

	try {
		const sheets = getSheetsWithAuth();

		// First, get all current data to find row numbers
		const response = await sheets.spreadsheets.values.get({
			spreadsheetId: GOOGLE_SHEET_ID,
			range: RANGE
		});

		const rows = response.data.values;
		if (!rows || rows.length <= 1) {
			return items.map((item) => ({
				productId: item.productId,
				success: false,
				message: 'No products found in sheet'
			}));
		}

		// Process each item
		for (const item of items) {
			try {
				// Find the row index for this product (skip header, so +2 for 1-indexed sheet)
				const rowIndex = rows.findIndex((row, index) => index > 0 && row[COLUMN_INDEX.id] === item.productId);

				if (rowIndex === -1) {
					results.push({
						productId: item.productId,
						success: false,
						message: 'Product not found'
					});
					continue;
				}

				const currentRow = rows[rowIndex];
				const currentStock = parseNumber(currentRow[COLUMN_INDEX.stok]);
				const newStock = Math.max(0, currentStock - item.quantity);

				// Update the stock cell (column G = index 6, but sheets use 1-indexed columns)
				// Row number in sheet is rowIndex + 1 (since arrays are 0-indexed)
				const stockCellRange = `${SHEET_NAME}!G${rowIndex + 1}`;

				await sheets.spreadsheets.values.update({
					spreadsheetId: GOOGLE_SHEET_ID,
					range: stockCellRange,
					valueInputOption: 'RAW',
					requestBody: {
						values: [[newStock]]
					}
				});

				console.log(`[Sheets] Updated stock for ${item.productId}: ${currentStock} -> ${newStock}`);

				results.push({
					productId: item.productId,
					success: true,
					message: `Stock updated from ${currentStock} to ${newStock}`,
					newStock
				});
			} catch (itemError) {
				console.error(`[Sheets] Error updating stock for ${item.productId}:`, itemError);
				results.push({
					productId: item.productId,
					success: false,
					message: itemError instanceof Error ? itemError.message : 'Unknown error'
				});
			}
		}

		return results;
	} catch (error) {
		console.error('[Sheets] Error in decreaseStock:', error);
		// Return failure for all items
		return items.map((item) => ({
			productId: item.productId,
			success: false,
			message: error instanceof Error ? error.message : 'Failed to connect to Google Sheets'
		}));
	}
}
