<script lang="ts">
	import type { PageData } from './$types';
	import type { Product } from '$lib/types';
	import { Button } from '$lib/components/ui';
	import { ProductGrid, AddToCartOverlay } from '$lib/components/product';
	import { TestimonialList } from '$lib/components/testimonial';
	import { Header, Footer } from '$lib/components/layout';
	import { cartStore } from '$lib/stores/cart';
	import { formatRupiah } from '$lib/utils/format';

	// Assets
	import croissantImage from '$lib/assets/croissant.png';
	import bakeryBucketsImage from '$lib/assets/bakery-buckets.png';

	let { data }: { data: PageData } = $props();

	// Best seller carousel state
	let currentBestSellerIndex = $state(0);
	const bestSellers = $derived(data.bestSellers || []);
	const currentBestSeller = $derived(bestSellers[currentBestSellerIndex] || null);
	const hasBestSellers = $derived(bestSellers.length > 0);

	function nextBestSeller() {
		if (bestSellers.length > 0) {
			currentBestSellerIndex = (currentBestSellerIndex + 1) % bestSellers.length;
		}
	}

	function prevBestSeller() {
		if (bestSellers.length > 0) {
			currentBestSellerIndex = (currentBestSellerIndex - 1 + bestSellers.length) % bestSellers.length;
		}
	}

	// Add to cart overlay state
	let cartProduct = $state<Product | null>(null);
	let isCartOverlayOpen = $state(false);

	function handleAddToCart(product: Product) {
		cartProduct = product;
		isCartOverlayOpen = true;
	}

	function handleHeroAddToCart() {
		if (currentBestSeller) {
			handleAddToCart(currentBestSeller);
		}
	}

	function handleConfirmAddToCart(product: Product, quantity: number) {
		cartStore.addItem(product, quantity);
		isCartOverlayOpen = false;
		cartProduct = null;
	}

	function handleCloseCartOverlay() {
		isCartOverlayOpen = false;
		cartProduct = null;
	}

	// Generate background text from category
	const backgroundText = $derived.by(() => {
		if (!currentBestSeller?.kategori) return { line1: 'Bake', line2: 'ruu!' };
		const category = currentBestSeller.kategori.toUpperCase();
		// Split into two parts roughly in the middle
		const midPoint = Math.ceil(category.length / 2);
		const line1 = category.slice(0, midPoint);
		const line2 = category.slice(midPoint) + '!';
		return { line1, line2 };
	});
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
	<!-- Background Text from Category -->
	<div
		class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[var(--color-accent-light)] text-[clamp(3rem,15vw,12rem)] md:text-[clamp(4rem,18vw,14rem)] font-black uppercase leading-[0.8] select-none pointer-events-none opacity-80 whitespace-nowrap"
	>
		<p>{backgroundText.line1}</p>
		<p>{backgroundText.line2}</p>
	</div>

	<!-- Hero Content -->
	<div class="container mx-auto px-4 sm:px-6 lg:px-10 relative z-10 min-h-screen flex flex-col">
		<!-- Main Hero Area -->
		<div class="flex-1 flex flex-col items-center justify-center pt-24 pb-8">
			<!-- Product Image - Responsive with aspect ratio -->
			<div class="relative flex flex-col items-center w-full max-w-2xl">
				{#if hasBestSellers && currentBestSeller}
					<div class="w-[60vw] sm:w-[50vw] md:w-[40vw] lg:w-[35vw] max-w-lg aspect-square flex items-center justify-center overflow-visible">
						<img
							src={currentBestSeller.image}
							alt={currentBestSeller.name}
							class="w-full h-full object-contain drop-shadow-2xl scale-110 lg:scale-125"
						/>
					</div>
				{:else}
					<div class="w-[60vw] sm:w-[50vw] md:w-[40vw] lg:w-[35vw] max-w-lg aspect-square flex items-center justify-center overflow-visible">
						<img
							src={croissantImage}
							alt="Delicious Croissant"
							class="w-full h-full object-contain drop-shadow-2xl scale-110 lg:scale-125"
						/>
					</div>
				{/if}

				<!-- Add to Cart CTA - Centered below image -->
				<div class="mt-6 sm:mt-8">
					<Button variant="cta" size="lg" onclick={handleHeroAddToCart} disabled={!hasBestSellers}>
						<span>Add to cart</span>
						<span
							class="bg-[var(--color-accent)] rounded-full p-1.5 flex items-center justify-center"
						>
							<svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
		<div class="pb-8 sm:pb-12 flex flex-col lg:flex-row items-center lg:items-end justify-between gap-6 sm:gap-8">
			<!-- Left: Description Text -->
			<div class="text-[var(--color-accent-light)] lg:w-1/3 text-center lg:text-left">
				<p class="text-base sm:text-xl leading-relaxed max-w-sm mx-auto lg:mx-0">
					{#if currentBestSeller}
						{currentBestSeller.deskripsi || 'Kenyangkan perut kamu dengan produk terbaik kami'}
					{:else}
						Kenyangkan perut kamu dengan croissant yang renyah diluar dan lembut di dalam
					{/if}
				</p>
			</div>

			<!-- Center: Product Info Carousel -->
			<div class="flex items-center justify-center gap-4 sm:gap-8 lg:w-1/3">
				<button
					onclick={prevBestSeller}
					disabled={bestSellers.length <= 1}
					class="bg-white rounded-md p-1.5 sm:p-2 hover:bg-[var(--color-gray-200)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					aria-label="Previous"
				>
					<svg class="w-3 h-3 sm:w-4 sm:h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"
						></path>
					</svg>
				</button>

				<div class="text-center min-w-[140px] sm:min-w-[180px]">
					{#if currentBestSeller}
						<h3 class="text-lg sm:text-2xl font-bold text-[var(--color-gray-200)]">{currentBestSeller.name}</h3>
						<p class="text-base sm:text-xl font-bold text-white">
							{formatRupiah(currentBestSeller.hargaDiskon ?? currentBestSeller.harga)}
						</p>
					{:else}
						<h3 class="text-lg sm:text-2xl font-bold text-[var(--color-gray-200)]">Best Seller</h3>
						<p class="text-base sm:text-xl font-bold text-white">Coming Soon</p>
					{/if}
				</div>

				<button
					onclick={nextBestSeller}
					disabled={bestSellers.length <= 1}
					class="bg-white rounded-md p-1.5 sm:p-2 hover:bg-[var(--color-gray-200)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					aria-label="Next"
				>
					<svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"
						></path>
					</svg>
				</button>
			</div>

			<!-- Right: Product Thumbnails -->
			<div class="flex gap-2 sm:gap-4 lg:w-1/3 justify-center lg:justify-end">
				{#if bestSellers.length > 0}
					{#each bestSellers.slice(0, 3) as product, i}
						<button
							onclick={() => { currentBestSellerIndex = i; }}
							class="w-14 h-14 sm:w-20 sm:h-20 rounded-[var(--radius-md)] overflow-hidden shadow-md transition-all cursor-pointer
								{i === currentBestSellerIndex ? 'ring-2 ring-white scale-105' : 'opacity-70 hover:opacity-100'}"
						>
							<img
								src={product.image}
								alt={product.name}
								class="w-full h-full object-cover"
							/>
						</button>
					{/each}
				{:else}
					{#each [1, 2, 3] as i}
						<div
							class="w-14 h-14 sm:w-20 sm:h-20 rounded-[var(--radius-md)] overflow-hidden shadow-md
								{i === 2 ? 'bg-[var(--color-accent-light)]' : 'bg-[var(--color-accent-lighter)]'}"
						>
							<img
								src={croissantImage}
								alt="Croissant thumbnail"
								class="w-full h-full object-cover"
							/>
						</div>
					{/each}
				{/if}
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

		<ProductGrid products={data.featuredProducts} columns={4} onaddtocart={handleAddToCart} />

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

<!-- Add to Cart Overlay -->
<AddToCartOverlay
	product={cartProduct}
	isOpen={isCartOverlayOpen}
	onconfirm={handleConfirmAddToCart}
	onclose={handleCloseCartOverlay}
/>

<!-- Footer -->
<Footer />
