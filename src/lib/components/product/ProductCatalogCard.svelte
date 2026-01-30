<script lang="ts">
	import type { Product } from '$lib/types';
	import { formatPrice } from '$lib/utils/format';

	interface Props {
		product: Product;
		class?: string;
		onaddtocart?: (product: Product) => void;
		onclick?: () => void;
	}

	let { product, class: className = '', onaddtocart, onclick }: Props = $props();

	const hasDiscount = $derived(product.hargaDiskon && product.hargaDiskon < product.harga);
	const isOutOfStock = $derived(product.stok <= 0);
	const isLowStock = $derived(product.stok > 0 && product.stok <= 10);

	function handleAddToCart(event: MouseEvent) {
		event.stopPropagation();
		if (!isOutOfStock) {
			onaddtocart?.(product);
		}
	}

	function handleClick() {
		onclick?.();
	}
</script>

<div
	class="bg-[var(--color-gray-100)] rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] overflow-hidden flex flex-col {className}"
>
	<!-- Product Image -->
	<button
		type="button"
		onclick={handleClick}
		class="block bg-white h-[300px] md:h-[350px] overflow-hidden cursor-pointer text-left w-full"
	>
		{#if product.image}
			<img
				src={product.image}
				alt={product.name}
				class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
				loading="lazy"
			/>
		{:else}
			<div
				class="w-full h-full flex items-center justify-center bg-[var(--color-gray-200)] text-[var(--color-gray-600)]"
			>
				No Image
			</div>
		{/if}
	</button>

	<!-- Product Info -->
	<div class="p-3 flex flex-col gap-2">
		<!-- Name -->
		<button type="button" onclick={handleClick} class="block text-left">
			<h3
				class="font-semibold text-lg md:text-xl text-[var(--color-gray-700)] line-clamp-1 hover:underline"
			>
				{product.name}
			</h3>
		</button>

		<!-- Stock Status -->
		<p class="text-[var(--color-accent)] text-sm md:text-base font-semibold">
			{#if isOutOfStock}
				Habis
			{:else}
				{product.stok} Tersisa
			{/if}
		</p>

		<!-- Price and Button Row -->
		<div class="flex items-center justify-between gap-2 mt-1">
			<!-- Price -->
			<div class="flex items-center gap-1 font-semibold text-[var(--color-gray-800)]">
				<span>Rp</span>
				<span>{formatPrice(hasDiscount ? product.hargaDiskon! : product.harga)}</span>
			</div>

			<!-- Add to Cart Button -->
			<button
				type="button"
				onclick={handleAddToCart}
				disabled={isOutOfStock}
				class="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-accent)] text-white
					font-semibold rounded-[var(--radius-md)] shadow-[var(--shadow-md)]
					hover:bg-[var(--color-accent-hover)] transition-colors
					disabled:opacity-50 disabled:cursor-not-allowed"
			>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"
					></path>
				</svg>
				<span class="hidden sm:inline">Add to Cart</span>
			</button>
		</div>
	</div>
</div>
