<script lang="ts">
	import { Header, Footer } from '$lib/components/layout';
	import { ProductDetail } from '$lib/components/product';
	import { Button } from '$lib/components/ui';
	import type { Product } from '$lib/types';

	let { data } = $props();

	function handleAddToCart(product: Product) {
		// TODO: Implement cart functionality
		console.log('Add to cart:', product.name);
	}

	function handleGoBack() {
		history.back();
	}
</script>

<svelte:head>
	<title>{data.product.name} - Bakeruu</title>
	<meta name="description" content={data.product.deskripsi || `${data.product.name} - Fresh from Bakeruu`} />
</svelte:head>

<!-- Header -->
<Header variant="solid" />

<!-- Page Content -->
<main class="bg-white min-h-screen pt-24 pb-12">
	<div class="container mx-auto px-4 md:px-10">
		<!-- Back Button -->
		<div class="mb-6">
			<Button variant="ghost" onclick={handleGoBack} class="gap-2">
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
				</svg>
				<span>Back to Products</span>
			</Button>
		</div>

		<!-- Product Detail Card -->
		<div class="bg-[var(--color-gray-100)] rounded-[var(--radius-lg)] shadow-lg max-w-4xl mx-auto">
			<!-- Product Title Header -->
			<div class="px-6 py-5 border-b border-[var(--color-gray-300)]">
				<h1 class="text-2xl md:text-3xl font-bold text-[var(--color-gray-700)]">
					{data.product.name}
				</h1>
			</div>

			<!-- Product Detail Content -->
			<ProductDetail product={data.product} onAddToCart={handleAddToCart} />
		</div>
	</div>
</main>

<!-- Footer -->
<Footer />
