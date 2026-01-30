<script lang="ts">
	import type { Product } from '$lib/types';
	import { formatRupiah } from '$lib/utils/format';
	import { Button } from '$lib/components/ui';

	interface Props {
		product: Product;
		onAddToCart?: (product: Product) => void;
		class?: string;
	}

	let { product, onAddToCart, class: className = '' }: Props = $props();

	const displayPrice = $derived(product.hargaDiskon || product.harga);
	const stockLabel = $derived(
		product.stok <= 0 ? 'Stok Habis' : product.stok <= 5 ? `${product.stok} Tersisa` : `Stok: ${product.stok}`
	);
	const isLowStock = $derived(product.stok > 0 && product.stok <= 5);
	const isOutOfStock = $derived(product.stok <= 0);

	function handleAddToCart() {
		if (!isOutOfStock) {
			onAddToCart?.(product);
		}
	}
</script>

<div class="p-6 {className}">
	<div class="flex flex-col md:flex-row gap-8">
		<!-- Product Image -->
		<div class="w-full md:w-[400px] shrink-0">
			<div class="bg-white rounded-[var(--radius-lg)] overflow-hidden shadow-lg aspect-square">
				<img
					src={product.image}
					alt={product.name}
					class="w-full h-full object-cover"
					loading="lazy"
				/>
			</div>
		</div>

		<!-- Product Info -->
		<div class="flex flex-col gap-6 flex-1">
			<!-- Stock & Price -->
			<div class="space-y-2">
				<p
					class="text-lg font-semibold {isOutOfStock
						? 'text-[var(--color-gray-600)]'
						: isLowStock
							? 'text-[var(--color-accent)]'
							: 'text-[var(--color-gray-600)]'}"
				>
					{stockLabel}
				</p>
				<p class="text-4xl font-semibold text-[var(--color-black)]">
					{formatRupiah(displayPrice)}
				</p>
				{#if product.hargaDiskon && product.hargaDiskon < product.harga}
					<p class="text-lg text-[var(--color-gray-600)] line-through">
						{formatRupiah(product.harga)}
					</p>
				{/if}
			</div>

			<!-- Description -->
			<div class="space-y-2">
				<h3 class="text-xl font-bold text-[var(--color-gray-700)]">Description</h3>
				<p class="text-base text-[var(--color-gray-700)] leading-relaxed">
					{product.deskripsi || 'No description available.'}
				</p>
			</div>

			<!-- Category -->
			<div class="space-y-1">
				<p class="text-sm font-semibold text-[var(--color-gray-600)]">Category</p>
				<p class="text-base font-bold text-[var(--color-gray-700)]">{product.kategori}</p>
			</div>

			<!-- Add to Cart Button -->
			<div class="mt-auto">
				<Button
					variant="primary"
					size="lg"
					class="w-full h-14 text-base font-semibold shadow-lg"
					disabled={isOutOfStock}
					onclick={handleAddToCart}
				>
					{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
				</Button>
			</div>
		</div>
	</div>
</div>
