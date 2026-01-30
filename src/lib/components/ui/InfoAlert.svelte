<script lang="ts">
	interface Props {
		highlight?: string;
		text: string;
		variant?: 'default' | 'accent';
	}

	let { highlight, text, variant = 'default' }: Props = $props();
</script>

<div class="bg-[var(--color-accent-light)] rounded-[10px] px-4 py-4">
	<p class="text-sm text-[var(--color-gray-700)]">
		{#if highlight}
			<span class="font-medium">{highlight}</span>
		{/if}
		{text}
	</p>
</div>
