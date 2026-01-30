<script lang="ts">
	import type { Testimonial } from '$lib/types';
	import TestimonialCard from './TestimonialCard.svelte';

	interface Props {
		testimonials: Testimonial[];
		class?: string;
	}

	let { testimonials, class: className = '' }: Props = $props();
</script>

{#if testimonials.length > 0}
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 {className}">
		{#each testimonials as testimonial (testimonial.id)}
			<TestimonialCard {testimonial} />
		{/each}
	</div>
{:else}
	<div class="text-center py-12 text-[var(--color-gray-600)]">
		<p>Belum ada testimoni</p>
	</div>
{/if}
