<script lang="ts">
	import { Header, Footer } from '$lib/components/layout';
	import { SearchInput, CategoryTabs } from '$lib/components/ui';
	import { ProductCatalogCard, ProductDetailModal } from '$lib/components/product';
	import type { Product } from '$lib/types';

	let { data } = $props();

	// Client-side state for filtering
	let searchQuery = $state('');
	let selectedCategory = $state('All');

	// Modal state
	let selectedProduct = $state<Product | null>(null);
	let isModalOpen = $state(false);

	// Filtered products - computed on client side to avoid server roundtrips
	const filteredProducts = $derived.by(() => {
		let result = data.products;

		// Filter by category
		if (selectedCategory !== 'All') {
			result = result.filter((p) => p.kategori === selectedCategory);
		}

		// Filter by search query
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase().trim();
			result = result.filter(
				(p) => p.name.toLowerCase().includes(query) || p.deskripsi.toLowerCase().includes(query)
			);
		}

		return result;
	});

	function handleSearch(value: string) {
		searchQuery = value;
	}

	function handleCategorySelect(category: string) {
		selectedCategory = category;
	}

	function handleProductClick(product: Product) {
		selectedProduct = product;
		isModalOpen = true;
	}

	function handleCloseModal() {
		isModalOpen = false;
		selectedProduct = null;
	}

	function handleAddToCart(product: Product) {
		// TODO: Implement cart functionality
		console.log('Add to cart:', product.name);
		handleCloseModal();
	}
</script>

<svelte:head>
	<title>Our Products - Bakeruu</title>
	<meta
		name="description"
		content="Discover our full range of freshly baked goods at Bakeruu. Croissants, pastries, cakes and more."
	/>
</svelte:head>

<!-- Header with Solid Background -->
<Header variant="solid" />

<!-- Page Header -->
<section class="bg-[var(--color-primary)] pt-24 pb-12">
	<div class="container mx-auto px-4 md:px-10">
		<div class="space-y-4">
			<h1 class="text-4xl md:text-5xl font-bold text-[var(--color-cream)]">Our Products</h1>
			<p class="text-lg text-[var(--color-cream)] opacity-90">
				Discover our full range of freshly baked goods
			</p>
		</div>
	</div>
</section>

<!-- Main Content -->
<section class="py-8 min-h-screen">
	<div class="container mx-auto px-4 md:px-10">
		<!-- Search and Filter Controls -->
		<div class="space-y-6 mb-8">
			<!-- Search Bar -->
			<SearchInput
				value={searchQuery}
				placeholder="Search products..."
				class="max-w-md"
				oninput={handleSearch}
			/>

			<!-- Category Tabs -->
			<CategoryTabs
				categories={data.categories}
				selected={selectedCategory}
				onselect={handleCategorySelect}
			/>
		</div>

		<!-- Results Count -->
		<p class="text-[var(--color-gray-600)] mb-6">
			{filteredProducts.length}
			{filteredProducts.length === 1 ? 'product' : 'products'} found
		</p>

		<!-- Product Grid -->
		{#if filteredProducts.length > 0}
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{#each filteredProducts as product (product.id)}
					<ProductCatalogCard
						{product}
						onaddtocart={handleAddToCart}
						onclick={() => handleProductClick(product)}
					/>
				{/each}
			</div>
		{:else}
			<div class="text-center py-16">
				<p class="text-xl text-[var(--color-gray-600)]">No products found</p>
				<p class="text-[var(--color-gray-500)] mt-2">Try adjusting your search or filter criteria</p>
			</div>
		{/if}
	</div>
</section>

<!-- Product Detail Modal -->
<ProductDetailModal
	product={selectedProduct}
	isOpen={isModalOpen}
	onclose={handleCloseModal}
	onAddToCart={handleAddToCart}
/>

<!-- Footer -->
<Footer />
