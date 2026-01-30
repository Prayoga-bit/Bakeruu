# Product Requirements Document: Bakeruu - UMKM Sheet Commerce

## 1. Product Overview

### Product Name
**Bakeruu** - UMKM Sheet Commerce

### One-Line Summary
A lightweight e-commerce catalog for UMKM bakeries where product data is managed via Google Sheets, with checkout via WhatsApp direct message link.

### Primary Users

**UMKM Owners and Staff:**
- Prefer managing data in spreadsheets rather than web dashboards
- Need simple, cost-effective solution for online presence
- Want to manage orders without complex systems

**End Customers:**
- Browse products on a simple, fast mobile-friendly site
- Place orders that are confirmed via WhatsApp
- Expect quick loading times and intuitive navigation

### Key Constraints
- No admin dashboard - all operational control is via Google Sheets
- No traditional database - Google Sheets serves as the data layer
- Mobile-first approach for customer-facing UI

---

## 2. High-Level Goals

1. Allow UMKM to manage product catalog via Google Sheets
2. Provide a fast, mobile-first product catalog UI using SvelteKit
3. Enable customers to checkout via WhatsApp direct message
4. Keep infrastructure and running costs minimal (no database, no API subscriptions)
5. Maintain clean, maintainable codebase with clear separation of concerns

---

## 3. Functional Requirements

### 3.1 Catalog Management (via Google Sheets)

The system must read product data from a Google Sheet named **Katalog**.

**Expected Columns (row 1 is header):**

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `id` | string | Yes | Unique product identifier |
| `name` | string | Yes | Product name |
| `deskripsi` | string | Yes | Product description |
| `kategori` | string | Yes | Product category |
| `harga` | number | Yes | Current price |
| `harga_diskon` | number | No | Discounted price |
| `stok` | number | Yes | Available stock |
| `image` | string | Yes | Product image URL |
| `is_active` | boolean | Yes | TRUE/FALSE - only TRUE rows displayed |

**Business Rules:**
- Only rows with `is_active = TRUE` must be displayed
- Products with `stok = 0` should show "Out of Stock" status
- Price display should show discount if `harga_diskon` < `harga`

### 3.2 Shopping Cart

**Cart Requirements:**
- Persist cart in browser localStorage
- Support adding/removing items
- Support quantity adjustment
- Show cart summary with total
- Validate stock before checkout

**Cart Item Structure:**
```typescript
interface CartItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  imageUrl: string;
}
```

### 3.3 WhatsApp Checkout (Direct Link)

When customer proceeds to checkout, the app will:
1. Generate a pre-formatted order message
2. Open WhatsApp via `wa.me` link with the message
3. Customer sends the message to complete the order

**WhatsApp Link Format:**
```
https://wa.me/{ADMIN_PHONE}?text={ENCODED_MESSAGE}
```

**Message Template:**
```
Halo, saya ingin memesan:

{ITEM_LIST}

Total: Rp {TOTAL}

Nama: {CUSTOMER_NAME}
Alamat: {CUSTOMER_ADDRESS}
Catatan: {NOTES}
```

**Checkout Form Fields:**

| Field | Type | Required | Description |
|-------|------|----------|------------|
| `name` | string | Yes | Customer name |
| `address` | string | Yes | Delivery address |
| `notes` | string | No | Optional order notes |

**Flow:**
1. Customer fills checkout form (name, address, notes)
2. Click "Pesan via WhatsApp" button
3. App opens WhatsApp with pre-filled message
4. Customer sends message directly to admin
5. Admin handles order manually via WhatsApp chat

### 3.4 Public Web UI Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page - brand overview, featured products, CTA |
| `/products` | Product catalog with filtering and search |
| `/products/[id]` | Product detail page |
| `/cart` | Shopping cart page |
| `/checkout` | Checkout form + WhatsApp redirect |

---

## 4. Page Specifications

### 4.1 Landing Page (`/`)

**Sections:**
1. Hero banner with brand message and CTA
2. Featured products carousel/grid (limit 4-6)
3. Categories showcase
4. Why choose us / value proposition
5. Footer with contact and social links

### 4.2 Products Page (`/products`)

**Features:**
- Product grid (responsive: 2 cols mobile, 3-4 cols desktop)
- Category filter (sidebar or dropdown)
- Search by product name
- Sort options (price low-high, high-low, newest)
- Quick add to cart

**Product Card Display:**
- Product image
- Product name
- Price (with strikethrough original if discounted)
- Discount badge if applicable
- Stock status indicator
- Add to cart button

### 4.3 Product Detail Page (`/products/[id]`)

**Sections:**
1. Product image (large)
2. Product info (name, price, description, stock)
3. Quantity selector
4. Add to cart / Buy now buttons
5. Product details/specifications

### 4.4 Cart Page (`/cart`)

**Features:**
- List of cart items with images
- Quantity adjustment (+/-)
- Remove item option
- Item subtotal
- Cart total
- Continue shopping link
- Proceed to checkout button
- Empty cart state

### 4.5 Checkout Page (`/checkout`)

**Sections:**
1. Order summary (cart items)
2. Customer information form (name, address, notes)
3. Total with breakdown
4. "Pesan via WhatsApp" button (opens wa.me link)

---

## 5. Non-Functional Requirements

### 5.1 Performance
- Catalog and product pages load within 2 seconds (90th percentile)
- Implement caching layer for Sheets data
- Use SSR for initial page loads
- Optimize images (lazy loading, proper sizing)

### 5.2 Reliability
- Graceful fallback to cached data if Sheets API unavailable
- Clear error messages for users

### 5.3 Security
- Google credentials via environment variables
- Input validation on all forms
- Sanitize user inputs
- No sensitive data in client-side code

### 5.4 Maintainability
- Clear separation of concerns
- Type-safe with TypeScript
- Consistent naming conventions
- Comprehensive error handling

---

## 6. Technical Architecture

### 6.1 Technology Stack

| Layer | Technology |
|-------|------------|
| Framework | SvelteKit (latest stable) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Runtime | Node.js 20 LTS |
| Data Source | Google Sheets API |
| Checkout | WhatsApp Direct Link (wa.me) |
| State | Svelte stores + localStorage |

### 6.2 Project Structure

```
src/
  lib/
    components/
      ui/                    # Reusable UI components
        Button.svelte
        Card.svelte
        Input.svelte
        Badge.svelte
        Skeleton.svelte
      layout/                # Layout components
        Header.svelte
        Footer.svelte
        Navigation.svelte
      product/               # Product-specific components
        ProductCard.svelte
        ProductGrid.svelte
      cart/                  # Cart components
        CartItem.svelte
        CartSummary.svelte
      checkout/              # Checkout components
        CheckoutForm.svelte
        OrderSummary.svelte
    server/                  # Server-side only modules
      sheets.ts              # Google Sheets service
      cache.ts               # Caching layer
    stores/                  # Svelte stores
      cart.ts                # Cart state management
    types/                   # TypeScript type definitions
      product.ts
      cart.ts
    utils/                   # Utility functions
      format.ts              # Price, date formatting
      validation.ts          # Form validation
      whatsapp.ts            # WhatsApp link generator
    constants/               # App constants
      index.ts
  routes/
    +layout.svelte           # Root layout
    +layout.server.ts        # Root layout data
    +page.svelte             # Landing page
    +page.server.ts          # Landing page data
    products/
      +page.svelte           # Product listing
      +page.server.ts        # Load products
      [id]/
        +page.svelte         # Product detail
        +page.server.ts      # Load product
    cart/
      +page.svelte           # Cart page
    checkout/
      +page.svelte           # Checkout page
  app.html
  app.css                    # Global styles
```

### 6.3 Data Flow

```
Google Sheets (Product Data)
        |
        v
  sheets.ts (Service Layer)
        |
        v
  cache.ts (Caching Layer)
        |
        v
  +page.server.ts (Data Loading)
        |
        v
  +page.svelte (UI Rendering)
        |
        v
  cart store (Client State - localStorage)
        |
        v
  WhatsApp Link (Checkout)
```

### 6.4 Service Layer Design

**sheets.ts - Google Sheets Service**
```typescript
// Responsibilities:
// - Initialize Google Sheets client
// - Read product data from Katalog sheet
// - Handle API errors and retries

export interface SheetsService {
  getProducts(): Promise<Product[]>;
  getProductById(id: string): Promise<Product | null>;
  getCategories(): Promise<string[]>;
}
```

**cache.ts - Caching Layer**
```typescript
// Responsibilities:
// - Cache products data
// - Implement TTL (Time To Live)
// - Memory-based caching

export interface CacheService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
}
```

**whatsapp.ts - WhatsApp Link Generator (Client-side utility)**
```typescript
// Responsibilities:
// - Generate wa.me link with encoded message
// - Format order message

export function generateWhatsAppLink(
  phone: string,
  cart: CartItem[],
  customer: CustomerInfo
): string;

export function formatOrderMessage(
  cart: CartItem[],
  customer: CustomerInfo
): string;
```

---

## 7. Type Definitions

### 7.1 Product Types

```typescript
// src/lib/types/product.ts

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
}

export interface ProductFilters {
  category?: string;
  search?: string;
  sortBy?: 'price_asc' | 'price_desc';
}
```

### 7.2 Cart Types

```typescript
// src/lib/types/cart.ts

export interface CartItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  imageUrl: string;
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
```

---

## 8. Environment Variables

```env
# Google Sheets Configuration
GOOGLE_SHEETS_SHEET_ID=your_google_sheet_id
GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# WhatsApp Admin Phone (for wa.me link)
PUBLIC_WHATSAPP_ADMIN_PHONE=628123456789

# App Configuration
PUBLIC_APP_NAME=Bakeruu
PUBLIC_APP_URL=https://your-domain.com

# Cache Configuration
CACHE_TTL_PRODUCTS=300

# Node Environment
NODE_ENV=development
```

---

## 9. UI/UX Guidelines

### 9.1 Design Principles
- Mobile-first responsive design
- Clean, modern aesthetic
- Warm, inviting colors suitable for bakery
- Clear visual hierarchy
- Accessible (WCAG 2.1 AA)

### 9.2 Color Palette (Suggested)
- Primary: Warm brown/terracotta
- Secondary: Cream/off-white
- Accent: Soft gold
- Text: Dark brown/charcoal
- Background: Light cream

### 9.3 Typography
- Headings: Modern serif or friendly sans-serif
- Body: Clean sans-serif
- Consistent sizing scale

### 9.4 Component States
- Default
- Hover
- Active/Pressed
- Disabled
- Loading
- Error

---

## 10. Error Handling Strategy

### 10.1 Client-Side Errors
- Form validation errors shown inline
- Toast notifications for actions
- Friendly error messages (no technical jargon)

### 10.2 Server-Side Errors
- Log detailed errors to console
- Return user-friendly messages

### 10.3 Error Messages

| Scenario | User Message |
|----------|--------------|
| Product not found | "Produk tidak ditemukan" |
| Out of stock | "Maaf, stok produk habis" |
| Network error | "Koneksi bermasalah. Silakan periksa internet Anda." |
| Sheets API error | "Gagal memuat data. Silakan coba lagi." |

---

## 11. Testing Strategy

### 11.1 Unit Tests
- Service layer functions
- Utility functions (formatting, validation, WhatsApp link generator)
- Store logic

### 11.2 Component Tests
- UI component rendering
- User interactions
- Form validation

---

## 12. Development Phases

### Phase 1: Foundation (Week 1)
- [ ] Project setup and configuration
- [ ] Google Sheets service implementation
- [ ] Type definitions
- [ ] Basic caching layer
- [ ] Layout components (Header, Footer)
- [ ] Landing page

### Phase 2: Catalog (Week 2)
- [ ] Product listing page
- [ ] Product card component
- [ ] Category filtering
- [ ] Search functionality
- [ ] Product detail page

### Phase 3: Cart & Checkout (Week 3)
- [ ] Cart store implementation
- [ ] Cart page
- [ ] Add to cart functionality
- [ ] Checkout form
- [ ] WhatsApp link generator
- [ ] Form validation

### Phase 4: Polish (Week 4)
- [ ] Error handling refinement
- [ ] Loading states
- [ ] Performance optimization
- [ ] Testing
- [ ] Documentation

---

## 13. Acceptance Criteria

The app is considered acceptable for MVP if:

1. **Catalog Management**
   - Products display correctly from Google Sheets
   - Category filtering works
   - Search functionality works
   - Stock status displays correctly

2. **Shopping Cart**
   - Items can be added/removed
   - Quantity can be adjusted
   - Cart persists across sessions (localStorage)
   - Total calculates correctly

3. **Checkout**
   - Form validates correctly
   - WhatsApp link opens with correct pre-filled message
   - Customer info included in message

4. **Performance**
   - Pages load within 2 seconds
   - Caching reduces API calls

5. **Code Quality**
   - No emojis in code, logs, or responses
   - TypeScript strict mode passes
   - Consistent architecture followed

---

## 14. Future Enhancements (Post-MVP)

- Product image gallery with multiple images
- Testimonials/reviews (stored in Sheets)
- Order tracking (Sheets-based)
- Promo codes/coupons
- Multiple delivery options
- PWA support
- Analytics integration

---

## 15. References

- [SvelteKit Documentation](https://kit.svelte.dev/docs)
- [Google Sheets API](https://developers.google.com/sheets/api)
- [WhatsApp Click to Chat](https://faq.whatsapp.com/5913398998672934)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
