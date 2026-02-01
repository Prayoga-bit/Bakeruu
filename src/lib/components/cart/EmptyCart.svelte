<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';

	interface Props {
		onStartShopping?: () => void;
	}

	let { onStartShopping }: Props = $props();
</script>

<div class="flex flex-col items-center justify-center py-12 sm:py-16 px-4">
	<!-- Empty Cart Icon -->
	<div class="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mb-4 sm:mb-6">
		<svg
			viewBox="0 0 96 96"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			class="w-full h-full text-[var(--color-gray-300)]"
		>
			<rect x="16" y="24" width="64" height="56" rx="8" stroke="currentColor" stroke-width="4" />
			<path d="M32 24V20C32 14.4772 36.4772 10 42 10H54C59.5228 10 64 14.4772 64 20V24" stroke="currentColor" stroke-width="4" />
			<path d="M40 44C40 47.3137 42.6863 50 46 50C49.3137 50 52 47.3137 52 44" stroke="currentColor" stroke-width="4" stroke-linecap="round" />
		</svg>
	</div>

	<!-- Title -->
	<h2 class="text-lg sm:text-xl lg:text-2xl font-bold text-[var(--color-gray-700)] mb-1.5 sm:mb-2">
		Your cart is empty
	</h2>

	<!-- Description -->
	<p class="text-sm sm:text-base text-[#4a5565] mb-4 sm:mb-6 text-center">
		Add some delicious items to get started!
	</p>

	<!-- CTA Button -->
	{#if onStartShopping}
		<Button variant="primary" size="md" onclick={onStartShopping}>
			Start Shopping
		</Button>
	{:else}
		<Button variant="primary" size="md" href="/products">
			Start Shopping
		</Button>
	{/if}
</div>
