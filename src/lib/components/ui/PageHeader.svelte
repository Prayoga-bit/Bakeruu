<script lang="ts">
	interface Props {
		title: string;
		subtitle?: string;
	}

	let { title, subtitle }: Props = $props();
</script>

<div class="bg-[var(--color-primary)] pt-24 pb-12">
	<div class="container mx-auto px-8">
		<div class="max-w-4xl">
			<h1 class="text-5xl font-bold text-[var(--color-cream)] mb-4">{title}</h1>
			{#if subtitle}
				<p class="text-lg text-[var(--color-cream)] opacity-90">{subtitle}</p>
			{/if}
		</div>
	</div>
</div>
