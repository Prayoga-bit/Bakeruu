<script lang="ts">
	interface Props {
		categories: string[];
		selected?: string;
		class?: string;
		onselect?: (category: string) => void;
	}

	let { categories, selected = 'All', class: className = '', onselect }: Props = $props();

	function handleSelect(category: string) {
		onselect?.(category);
	}
</script>

<div class="flex flex-wrap gap-2 {className}">
	{#each ['All', ...categories] as category}
		<button
			type="button"
			onclick={() => handleSelect(category)}
			class="px-4 py-2 rounded-[var(--radius-md)] font-semibold text-base transition-colors
				{selected === category
				? 'bg-[var(--color-accent)] text-white'
				: 'bg-[var(--color-gray-100)] text-[var(--color-gray-700)] hover:bg-[var(--color-gray-300)]'}"
		>
			{category}
		</button>
	{/each}
</div>
