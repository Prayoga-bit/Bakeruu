<script lang="ts">
	import type { CartItem } from '$lib/types';
	import { formatRupiah } from '$lib/utils/format';

	interface Props {
		item: CartItem;
		onUpdateQuantity?: (productId: string, quantity: number) => void;
		onRemove?: (productId: string) => void;
	}

	let { item, onUpdateQuantity, onRemove }: Props = $props();

	const subtotal = $derived(item.price * item.quantity);
	const canDecrement = $derived(item.quantity > 1);

	function handleDecrement() {
		if (canDecrement) {
			onUpdateQuantity?.(item.productId, item.quantity - 1);
		}
	}

	function handleIncrement() {
		onUpdateQuantity?.(item.productId, item.quantity + 1);
	}

	function handleRemove() {
		onRemove?.(item.productId);
	}
</script>

<div
	class="bg-[var(--color-gray-100)] rounded-2xl shadow-[0px_4px_6px_0px_rgba(0,0,0,0.1),0px_2px_4px_0px_rgba(0,0,0,0.1)] p-6"
>
	<div class="flex gap-4">
		<!-- Product Image -->
		<div class="w-32 h-32 shrink-0 rounded-[10px] overflow-hidden">
			<img
				src={item.image}
				alt={item.productName}
				class="w-full h-full object-cover"
			/>
		</div>

		<!-- Product Details -->
		<div class="flex-1 flex flex-col gap-3">
			<!-- Header: Name & Delete Button -->
			<div class="flex items-start justify-between">
				<div class="flex flex-col gap-1">
					<h3 class="text-xl font-bold text-[var(--color-gray-700)]">
						{item.productName}
					</h3>
					<p class="text-base font-semibold text-[var(--color-gray-800)]">
						{formatRupiah(item.price)}
					</p>
				</div>

				<!-- Delete Button -->
				<button
					type="button"
					onclick={handleRemove}
					class="p-2 rounded-[10px] hover:bg-[var(--color-gray-200)] transition-colors cursor-pointer"
					aria-label="Remove item"
				>
					<svg class="w-5 h-5 text-[var(--color-accent)]" viewBox="0 0 20 20" fill="currentColor">
						<path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
					</svg>
				</button>
			</div>

			<!-- Quantity Selector -->
			<div class="flex items-center gap-4">
				<button
					type="button"
					onclick={handleDecrement}
					disabled={!canDecrement}
					class="w-8 h-8 rounded-[10px] flex items-center justify-center transition-colors
						{canDecrement
						? 'bg-white hover:bg-[var(--color-gray-200)] cursor-pointer'
						: 'bg-white opacity-50 cursor-not-allowed'}"
					aria-label="Decrease quantity"
				>
					<svg class="w-4 h-4 text-[var(--color-gray-700)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
					</svg>
				</button>

				<span class="w-8 text-center text-lg font-bold text-[var(--color-gray-700)]">
					{item.quantity}
				</span>

				<button
					type="button"
					onclick={handleIncrement}
					class="w-8 h-8 rounded-[10px] flex items-center justify-center bg-white hover:bg-[var(--color-gray-200)] transition-colors cursor-pointer"
					aria-label="Increase quantity"
				>
					<svg class="w-4 h-4 text-[var(--color-gray-700)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
					</svg>
				</button>
			</div>

			<!-- Subtotal -->
			<p class="text-xl font-bold text-[var(--color-gray-700)]">
				Subtotal: {formatRupiah(subtotal)}
			</p>
		</div>
	</div>
</div>
