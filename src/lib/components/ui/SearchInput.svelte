<script lang="ts">
	interface Props {
		value?: string;
		placeholder?: string;
		class?: string;
		debounceMs?: number;
		oninput?: (value: string) => void;
	}

	let {
		value = '',
		placeholder = 'Search...',
		class: className = '',
		debounceMs = 200,
		oninput
	}: Props = $props();

	let timeoutId: ReturnType<typeof setTimeout> | null = null;

	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement;

		if (timeoutId) {
			clearTimeout(timeoutId);
		}

		timeoutId = setTimeout(() => {
			oninput?.(target.value);
		}, debounceMs);
	}

	// Cleanup on component destroy
	$effect(() => {
		return () => {
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
		};
	});
</script>

<div class="relative {className}">
	<!-- Search Icon -->
	<div class="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-gray-600)]">
		<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
			></path>
		</svg>
	</div>

	<input
		type="text"
		{value}
		{placeholder}
		oninput={handleInput}
		class="w-full pl-10 pr-4 py-3 border border-[var(--color-gray-300)] rounded-[var(--radius-md)]
			text-base text-[var(--color-gray-800)] placeholder:text-[rgba(10,10,10,0.5)]
			focus:outline-none focus:border-[var(--color-accent)] transition-colors"
	/>
</div>
