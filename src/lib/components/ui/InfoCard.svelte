<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		icon?: Snippet;
		class?: string;
		children: Snippet;
	}

	let { title, icon, class: className = '', children }: Props = $props();
</script>

<div
	class="bg-[var(--color-gray-100)] rounded-[var(--radius-lg)] shadow-[var(--shadow-card)] p-8 {className}"
>
	<!-- Header -->
	<div class="flex items-center gap-3 mb-6">
		{#if icon}
			<div
				class="w-12 h-12 bg-[var(--color-accent)] rounded-[10px] flex items-center justify-center"
			>
				{@render icon()}
			</div>
		{/if}
		<h2 class="text-2xl font-bold text-[var(--color-gray-700)]">{title}</h2>
	</div>

	<!-- Content -->
	<div class="text-[var(--color-gray-700)]">
		{@render children()}
	</div>
</div>
