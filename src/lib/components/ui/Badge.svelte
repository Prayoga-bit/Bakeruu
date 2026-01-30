<script lang="ts">
	interface Props {
		text?: string;
		variant?: 'discount' | 'stock' | 'category';
		class?: string;
	}

	let { text = '', variant = 'discount', class: className = '' }: Props = $props();

	const variants = {
		discount: 'bg-[var(--color-accent)] text-white',
		stock: 'bg-[var(--color-accent-light)] text-[var(--color-accent)]',
		category: 'bg-[var(--color-gray-100)] text-[var(--color-gray-700)]'
	};
</script>

<span
	class="inline-flex items-center px-2 py-1 text-sm font-medium rounded-[var(--radius-sm)] {variants[
		variant
	]} {className}"
>
	{text}
</span>
