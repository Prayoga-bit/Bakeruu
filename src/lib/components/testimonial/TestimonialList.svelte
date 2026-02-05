<script lang="ts">
	import type { Testimonial } from '$lib/types';
	import TestimonialCard from './TestimonialCard.svelte';
	import { onMount } from 'svelte';

	interface Props {
		testimonials: Testimonial[];
		class?: string;
	}

	let { testimonials, class: className = '' }: Props = $props();
	
	// Triple testimonials for seamless infinite scroll
	let duplicatedTestimonials = $derived([...testimonials, ...testimonials, ...testimonials]);
	
	let carouselElement: HTMLDivElement;
	let isPaused = $state(false);
	let scrollPosition = $state(0);
	let animationFrame: number;

	onMount(() => {
		const scroll = () => {
			if (!isPaused && carouselElement) {
				scrollPosition -= 1; // Adjust speed here (higher = faster)
				
				// Get the width of one set of testimonials
				const itemWidth = 400 + 24; // card width + gap
				const singleSetWidth = itemWidth * testimonials.length;
				
				// Reset position seamlessly when first set is fully scrolled
				if (Math.abs(scrollPosition) >= singleSetWidth) {
					scrollPosition = 0;
				}
				
				carouselElement.style.transform = `translateX(${scrollPosition}px)`;
			}
			animationFrame = requestAnimationFrame(scroll);
		};
		
		animationFrame = requestAnimationFrame(scroll);
		
		return () => {
			if (animationFrame) {
				cancelAnimationFrame(animationFrame);
			}
		};
	});
</script>

{#if testimonials.length > 0}
	<div class="testimonial-carousel-container {className}">
		<div 
			class="testimonial-carousel"
			bind:this={carouselElement}
			onmouseenter={() => isPaused = true}
			onmouseleave={() => isPaused = false}
		>
			{#each duplicatedTestimonials as testimonial, index (testimonial.id + '-' + index)}
				<div class="testimonial-item">
					<TestimonialCard {testimonial} />
				</div>
			{/each}
		</div>
	</div>
{:else}
	<div class="text-center py-12 text-[var(--color-gray-600)]">
		<p>Belum ada testimoni</p>
	</div>
{/if}

<style>
	.testimonial-carousel-container {
		overflow: hidden;
		width: 100%;
		position: relative;
	}

	.testimonial-carousel {
		display: flex;
		gap: 1.5rem;
		will-change: transform;
	}

	.testimonial-item {
		flex: 0 0 auto;
		width: 400px;
		max-width: 90vw;
	}
</style>
