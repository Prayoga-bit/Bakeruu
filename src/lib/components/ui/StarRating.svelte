<script lang="ts">
	interface Props {
		rating: number;
		maxRating?: number;
		size?: 'sm' | 'md' | 'lg';
		class?: string;
	}

	let { rating, maxRating = 5, size = 'md', class: className = '' }: Props = $props();

	const sizes = {
		sm: 'w-4 h-4',
		md: 'w-6 h-6',
		lg: 'w-8 h-8'
	};

	const stars = $derived(
		Array.from({ length: maxRating }, (_, i) => ({
			filled: i < rating,
			index: i
		}))
	);
</script>

<div class="flex items-center gap-0.5 {className}">
	{#each stars as star (star.index)}
		<svg
			class="{sizes[size]} {star.filled
				? 'text-[var(--color-accent)]'
				: 'text-gray-300'} fill-current"
			viewBox="0 0 24 24"
		>
			<path
				d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
			/>
		</svg>
	{/each}
</div>
