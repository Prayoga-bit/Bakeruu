<script lang="ts">
	import type { PageData } from './$types';
	import { Button } from '$lib/components/ui';
	import { ProductGrid } from '$lib/components/product';
	import { TestimonialList } from '$lib/components/testimonial';
	import { Header, Footer } from '$lib/components/layout';

	// Assets
	import croissantImage from '$lib/assets/croissant.png';
	import bakeryBucketsImage from '$lib/assets/bakery-buckets.png';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Bakeruu - Fresh Baked Daily with Love</title>
	<meta
		name="description"
		content="Crafting delicious memories with every bite. Fresh bakery products delivered to your door."
	/>
</svelte:head>

<!-- Header -->
<Header variant="transparent" />

<!-- Hero Section -->
<section class="relative bg-[var(--color-primary)] min-h-screen overflow-hidden">
	<!-- Background Text -->
	<div
		class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[var(--color-accent-light)] text-[18vw] font-black uppercase leading-[0.8] select-none pointer-events-none opacity-80"
	>
		<p>Crois</p>
		<p>sant!</p>
	</div>

	<!-- Hero Content -->
	<div class="container mx-auto px-10 relative z-10 min-h-screen flex flex-col">
		<!-- Main Hero Area -->
		<div class="flex-1 flex flex-col items-center justify-center pt-24 pb-8">
			<!-- Croissant Image - Centered and Bigger -->
			<div class="relative flex flex-col items-center">
				<img
					src={croissantImage}
					alt="Delicious Croissant"
					class="w-[600px] lg:w-[700px] h-auto rotate-[23deg] drop-shadow-2xl"
				/>

				<!-- Add to Cart CTA - Centered below image -->
				<div class="mt-8">
					<Button variant="cta" size="lg">
						<span>Add to cart</span>
						<span
							class="bg-[var(--color-accent)] rounded-full p-1.5 flex items-center justify-center"
						>
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 4v16m8-8H4"
								></path>
							</svg>
						</span>
					</Button>
				</div>
			</div>
		</div>

		<!-- Bottom Section: Text, Price Carousel, Thumbnails aligned -->
		<div class="pb-12 flex flex-col lg:flex-row items-end justify-between gap-8">
			<!-- Left: Description Text -->
			<div class="text-[var(--color-accent-light)] lg:w-1/3">
				<p class="text-xl leading-relaxed max-w-sm">
					Kenyangkan perut kamu dengan croissant yang renyah diluar dan lembut di dalam
				</p>
			</div>

			<!-- Center: Product Info Carousel -->
			<div class="flex items-center justify-center gap-8 lg:w-1/3">
				<button
					class="bg-white rounded-md p-2 hover:bg-[var(--color-gray-200)] transition-colors"
					aria-label="Previous"
				>
					<svg class="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"
						></path>
					</svg>
				</button>

				<div class="text-center">
					<h3 class="text-2xl font-bold text-[var(--color-gray-200)]">Flaky's Original</h3>
					<p class="text-xl font-bold text-white">Rp 10.000</p>
				</div>

				<button
					class="bg-white rounded-md p-2 hover:bg-[var(--color-gray-200)] transition-colors"
					aria-label="Next"
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"
						></path>
					</svg>
				</button>
			</div>

			<!-- Right: Product Thumbnails -->
			<div class="flex gap-4 lg:w-1/3 justify-end">
				{#each [1, 2, 3] as i}
					<div
						class="w-20 h-20 rounded-[var(--radius-md)] overflow-hidden shadow-md
							{i === 2 ? 'bg-[var(--color-accent-light)]' : 'bg-[var(--color-accent-lighter)]'}"
					>
						<img
							src={croissantImage}
							alt="Croissant thumbnail"
							class="w-full h-full object-cover"
						/>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

<!-- Recommendations Section -->
<section class="py-20 bg-white">
	<div class="container mx-auto px-10">
		<h2 class="text-4xl font-bold text-center text-[var(--color-black)] tracking-wide mb-12">
			Recommendations
		</h2>

		<ProductGrid products={data.featuredProducts} columns={4} />

		<div class="flex justify-center mt-12">
			<Button variant="outline" href="/products">
				<span>Explore More</span>
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"
					></path>
				</svg>
			</Button>
		</div>
	</div>
</section>

<!-- Choose Your Perfect Softness Section -->
<section class="py-20 border-t-2 border-b-2 border-[var(--color-accent)]">
	<div class="container mx-auto px-10">
		<div class="flex flex-col lg:flex-row items-center gap-16">
			<!-- Left Content -->
			<div class="lg:w-1/2 space-y-8">
				<h2 class="text-5xl lg:text-7xl font-bold text-[var(--color-gray-700)] leading-tight">
					Choose Your Perfect Softness
				</h2>

				<div class="space-y-4 text-[var(--color-gray-700)] text-lg">
					<p>
						Pick your favorite way to enjoy our bread!<br />
						Whether you're on the go or looking to indulge at home, we've got options for everyone.
					</p>

					<p>
						<strong>Classic Croissant - </strong>Buttery, flaky layers that melt in your mouth. Baked
						fresh daily with premium French butter.
					</p>

					<p>
						<strong>Artisan Sourdough - </strong>Naturally fermented for 48 hours, creating that perfect
						crust and tangy flavor.
					</p>

					<p>
						<strong>Sweet Indulgence - </strong>From chocolate danishes to cinnamon rolls, handcrafted
						pastries made with love.
					</p>

					<p>
						<strong>Custom Creations - </strong>We create custom cakes and pastries for your memorable
						occasions.
					</p>
				</div>

				<Button variant="outline" href="/products">
					<span>Explore More</span>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"
						></path>
					</svg>
				</Button>
			</div>

			<!-- Right: Bakery Buckets Image -->
			<div class="lg:w-1/2">
				<img
					src={bakeryBucketsImage}
					alt="Bakery Buckets"
					class="w-full h-auto rounded-lg drop-shadow-xl"
				/>
			</div>
		</div>
	</div>
</section>

<!-- Testimonials Section -->
<section class="py-20 bg-white">
	<div class="container mx-auto px-10">
		<h2 class="text-4xl font-bold text-center text-[var(--color-black)] tracking-wide mb-12">
			Our Happy Clients
		</h2>

		<TestimonialList testimonials={data.testimonials} />
	</div>
</section>

<!-- Footer -->
<Footer />
