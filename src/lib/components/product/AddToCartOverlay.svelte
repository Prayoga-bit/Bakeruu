<script lang="ts">
	import type { Product } from '$lib/types';
	import { formatRupiah } from '$lib/utils/format';
	import Overlay from '$lib/components/ui/Overlay.svelte';
	import QuantitySelector from '$lib/components/ui/QuantitySelector.svelte';
	import { Button } from '$lib/components/ui';

	interface Props {
		product: Product | null;
		isOpen: boolean;
		closable?: boolean;
		onclose?: () => void;
		onconfirm?: (product: Product, quantity: number) => void;
	}

	let { product, isOpen = false, closable = true, onclose, onconfirm }: Props = $props();

	function handleClose() {
		onclose?.();
	}

	let quantity = $state(1);

	// Reset quantity when product changes
	$effect(() => {
		if (product) {
			quantity = 1;
		}
	});

	const totalPrice = $derived(product ? (product.hargaDiskon || product.harga) * quantity : 0);
	const maxQuantity = $derived(product?.stok || 1);
	const isLowStock = $derived(product && product.stok > 0 && product.stok <= 5);

	function handleQuantityChange(newValue: number) {
		quantity = newValue;
	}

	function handleConfirm() {
		if (product) {
			onconfirm?.(product, quantity);
		}
	}
</script>

<Overlay {isOpen} title="Add to Cart" closable={true} onclose={handleClose} showCloseButton={true}>
	{#if product}
		<div class="p-6 flex flex-col gap-6">
			<!-- Product Info -->
			<div class="flex gap-4">
				<!-- Product Image -->
				<div class="w-24 h-24 rounded-[10px] overflow-hidden shrink-0">
					<img
						src={product.image}
						alt={product.name}
						class="w-full h-full object-cover"
						loading="lazy"
					/>
				</div>

				<!-- Product Details -->
				<div class="flex flex-col gap-1 flex-1">
					<h3 class="text-lg font-semibold text-[var(--color-gray-700)]">
						{product.name}
					</h3>
					<p class="text-base font-semibold text-[var(--color-black)]">
						{formatRupiah(product.hargaDiskon || product.harga)}
					</p>
					<p
						class="text-sm {isLowStock
							? 'text-[var(--color-accent)]'
							: 'text-[var(--color-gray-600)]'}"
					>
						{#if product.stok <= 0}
							Stok Habis
						{:else if isLowStock}
							{product.stok} Tersisa
						{:else}
							Stok: {product.stok}
						{/if}
					</p>
				</div>
			</div>

			<!-- Quantity Selector -->
			<div class="flex flex-col gap-3">
				<span class="text-base font-semibold text-[var(--color-gray-700)]">Quantity</span>
				<QuantitySelector
					value={quantity}
					min={1}
					max={maxQuantity}
					onchange={handleQuantityChange}
				/>
			</div>

			<!-- Total Price -->
			<div class="bg-[var(--color-gray-100)] rounded-[10px] px-4 py-4">
				<div class="flex items-center justify-between">
					<span class="text-base font-semibold text-[var(--color-gray-700)]">Total</span>
					<span class="text-xl font-bold text-[var(--color-black)]">
						{formatRupiah(totalPrice)}
					</span>
				</div>
			</div>

			<!-- Confirm Button -->
			<Button
				variant="primary"
				size="lg"
				class="w-full h-14 text-base font-semibold shadow-lg"
				onclick={handleConfirm}
				disabled={product.stok <= 0}
			>
				Confirm Add to Cart
			</Button>
		</div>
	{/if}
</Overlay>
