<script lang="ts">
	import type { CartItem } from '$lib/types';
	import { formatRupiah } from '$lib/utils/format';
	import Button from '$lib/components/ui/Button.svelte';

	interface Props {
		items: CartItem[];
		variant?: 'cart' | 'checkout';
		onCheckout?: () => void;
	}

	let { items, variant = 'cart', onCheckout }: Props = $props();

	const totalItems = $derived(items.reduce((sum, item) => sum + item.quantity, 0));
	const totalPrice = $derived(items.reduce((sum, item) => sum + item.price * item.quantity, 0));
</script>

<div
	class="bg-[var(--color-gray-100)] rounded-2xl shadow-[0px_4px_6px_0px_rgba(0,0,0,0.1),0px_2px_4px_0px_rgba(0,0,0,0.1)] p-4 sm:p-6 flex flex-col gap-4 sm:gap-6"
>
	<!-- Title -->
	<h2 class="text-lg sm:text-xl lg:text-2xl font-bold text-[var(--color-gray-700)]">
		Order Summary
	</h2>

	{#if variant === 'checkout'}
		<!-- Checkout: Show item list -->
		<div class="flex flex-col gap-3 sm:gap-4">
			{#each items as item (item.productId)}
				<div class="flex justify-between gap-2">
					<div class="flex flex-col flex-1 min-w-0">
						<p class="text-sm sm:text-base font-semibold text-[var(--color-gray-700)] truncate">
							{item.productName}
						</p>
						<p class="text-xs sm:text-sm text-[#4a5565]">
							{item.quantity} x {formatRupiah(item.price)}
						</p>
					</div>
					<p class="text-sm sm:text-base font-semibold text-[var(--color-gray-700)] shrink-0">
						{formatRupiah(item.price * item.quantity)}
					</p>
				</div>
			{/each}
		</div>
	{:else}
		<!-- Cart: Show item count and total -->
		<div class="flex justify-between items-center">
			<p class="text-sm sm:text-base text-[var(--color-gray-700)]">
				Items ({totalItems})
			</p>
			<p class="text-sm sm:text-base font-semibold text-[var(--color-gray-700)]">
				{formatRupiah(totalPrice)}
			</p>
		</div>
	{/if}

	<!-- Divider and Total -->
	<div class="border-t border-[#d1d5dc] pt-3 sm:pt-4 flex justify-between items-center">
		<p class="text-base sm:text-lg lg:text-xl font-bold text-[var(--color-gray-700)]">
			Total
		</p>
		<p class="text-lg sm:text-xl lg:text-2xl font-bold text-[var(--color-accent)]">
			{formatRupiah(totalPrice)}
		</p>
	</div>

	<!-- Checkout Button (only show in cart variant) -->
	{#if variant === 'cart' && onCheckout}
		<Button variant="primary" size="lg" onclick={onCheckout} class="w-full rounded-[14px]">
			Proceed to Checkout
		</Button>
	{/if}
</div>
