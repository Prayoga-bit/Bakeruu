<script lang="ts">
	interface Props {
		value: number;
		min?: number;
		max?: number;
		disabled?: boolean;
		onchange?: (value: number) => void;
	}

	let { value = 1, min = 1, max = 99, disabled = false, onchange }: Props = $props();

	const canDecrement = $derived(value > min && !disabled);
	const canIncrement = $derived(value < max && !disabled);

	function decrement() {
		if (canDecrement) {
			const newValue = value - 1;
			onchange?.(newValue);
		}
	}

	function increment() {
		if (canIncrement) {
			const newValue = value + 1;
			onchange?.(newValue);
		}
	}
</script>

<div class="flex items-center gap-4">
	<!-- Decrement Button -->
	<button
		type="button"
		onclick={decrement}
		disabled={!canDecrement}
		class="w-10 h-10 rounded-[10px] flex items-center justify-center transition-colors
			{canDecrement
			? 'bg-[var(--color-gray-300)] hover:bg-[var(--color-gray-200)] cursor-pointer'
			: 'bg-[var(--color-gray-300)] opacity-50 cursor-not-allowed'}"
		aria-label="Decrease quantity"
	>
		<svg class="w-5 h-5 text-[var(--color-gray-700)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
		</svg>
	</button>

	<!-- Quantity Display -->
	<span class="w-10 text-center text-2xl font-bold text-[var(--color-gray-700)]">
		{value}
	</span>

	<!-- Increment Button -->
	<button
		type="button"
		onclick={increment}
		disabled={!canIncrement}
		class="w-10 h-10 rounded-[10px] flex items-center justify-center transition-colors
			{canIncrement
			? 'bg-[var(--color-gray-300)] hover:bg-[var(--color-gray-200)] cursor-pointer'
			: 'bg-[var(--color-gray-300)] opacity-50 cursor-not-allowed'}"
		aria-label="Increase quantity"
	>
		<svg class="w-5 h-5 text-[var(--color-gray-700)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
		</svg>
	</button>
</div>
