<script lang="ts">
	import type { Product } from '$lib/types';
	import { Button } from '$lib/components/ui';
	import { formatPrice } from '$lib/utils/format';

	interface Props {
		product: Product;
		class?: string;
		onaddtocart?: (product: Product) => void;
	}

	let { product, class: className = '', onaddtocart }: Props = $props();

	const hasDiscount = $derived(product.hargaDiskon && product.hargaDiskon < product.harga);
	const isOutOfStock = $derived(product.stok <= 0);

	function handleAddToCart() {
		if (!isOutOfStock) {
			onaddtocart?.(product);
		}
	}
</script>

<div
	class="bg-[var(--color-gray-100)] rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] overflow-hidden flex flex-col h-full {className}"
>
	<!-- Product Image -->
	<a href="/products/{product.id}" class="block bg-white h-[300px] overflow-hidden">
		{#if product.image}
			<img
				src={product.image}
				alt={product.name}
				class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
			/>
		{:else}
			<div
				class="w-full h-full flex items-center justify-center bg-[var(--color-gray-200)] text-[var(--color-gray-600)]"
			>
				No Image
			</div>
		{/if}
	</a>

	<!-- Product Info -->
	<div class="p-4 flex flex-col gap-3 flex-1">
		<!-- Name -->
		<a href="/products/{product.id}" class="block">
			<h3 class="font-semibold text-lg text-[var(--color-gray-700)] line-clamp-1 hover:underline">
				{product.name}
			</h3>
		</a>

		<!-- Stock -->
		<p class="text-[var(--color-accent)] text-sm font-semibold">
			{#if isOutOfStock}
				Habis
			{:else}
				{product.stok} Tersisa
			{/if}
		</p>

		<!-- Price and Button -->
		<div class="flex items-center justify-between mt-auto">
			<div class="flex items-center gap-1 font-semibold">
				<span class="text-[var(--color-gray-800)]">Rp</span>
				<span class="text-[var(--color-gray-800)]">
					{formatPrice(hasDiscount ? product.hargaDiskon! : product.harga)}
				</span>
			</div>

			<Button variant="primary" size="sm" disabled={isOutOfStock} onclick={handleAddToCart}>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"
					></path>
				</svg>
				<span>Add to Cart</span>
			</Button>
		</div>
	</div>
</div>
