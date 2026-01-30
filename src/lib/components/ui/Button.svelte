<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		variant?: 'primary' | 'outline' | 'ghost' | 'cta';
		size?: 'sm' | 'md' | 'lg';
		href?: string;
		disabled?: boolean;
		class?: string;
		onclick?: () => void;
		children: Snippet;
	}

	let {
		variant = 'primary',
		size = 'md',
		href,
		disabled = false,
		class: className = '',
		onclick,
		children
	}: Props = $props();

	const baseStyles = `
		inline-flex items-center justify-center gap-2
		font-semibold transition-all duration-200
		disabled:opacity-50 disabled:cursor-not-allowed
	`;

	const variants = {
		primary: `
			bg-[var(--color-accent)] text-white
			hover:bg-[var(--color-accent-hover)]
			shadow-[var(--shadow-md)]
		`,
		outline: `
			border-2 border-[var(--color-accent)] text-[var(--color-accent)]
			hover:bg-[var(--color-accent)] hover:text-white
			shadow-[var(--shadow-md)]
		`,
		ghost: `
			text-[var(--color-accent)]
			hover:bg-[var(--color-accent-lighter)]
		`,
		cta: `
			bg-[rgba(234,0,0,0.25)] text-white
			shadow-[var(--shadow-md)]
			hover:bg-[rgba(234,0,0,0.35)]
		`
	};

	const sizes = {
		sm: 'px-3 py-2 text-sm rounded-[var(--radius-md)]',
		md: 'px-4 py-3 text-base rounded-[var(--radius-md)]',
		lg: 'px-6 py-4 text-lg rounded-[var(--radius-full)]'
	};

	const combinedClass = $derived(`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`);
</script>

{#if href}
	<a {href} class={combinedClass}>
		{@render children()}
	</a>
{:else}
	<button type="button" {disabled} {onclick} class={combinedClass}>
		{@render children()}
	</button>
{/if}
