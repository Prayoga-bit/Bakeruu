<script lang="ts">
	import type { Product } from '$lib/types';
	import ProductCard from './ProductCard.svelte';

	interface Props {
		products: Product[];
		columns?: 2 | 3 | 4;
		class?: string;
	}

	let { products, columns = 4, class: className = '' }: Props = $props();

	const gridCols = {
		2: 'grid-cols-1 sm:grid-cols-2',
		3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
		4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
	};
</script>

{#if products.length > 0}
	<div class="grid {gridCols[columns]} gap-5 {className}">
		{#each products as product (product.id)}
			<ProductCard {product} />
		{/each}
	</div>
{:else}
	<div class="text-center py-12 text-[var(--color-gray-600)]">
		<p>Tidak ada produk ditemukan</p>
	</div>
{/if}
