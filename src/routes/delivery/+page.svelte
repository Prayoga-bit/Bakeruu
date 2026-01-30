<script lang="ts">
	import Header from '$lib/components/layout/Header.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import {
		PageHeader,
		InfoCard,
		OrderStep,
		FeeRow,
		InfoAlert
	} from '$lib/components/ui';

	// Delivery data - can be moved to a constants file or CMS later
	const deliveryAreas = [
		'Sweet Town City Center',
		'Downtown District',
		'North Valley Area',
		'South Hills Region',
		'East Park Zone',
		'West Garden District'
	];

	const deliveryFees = [
		{ label: 'Within 5 km', value: 'Rp 10.000' },
		{ label: '5 - 10 km', value: 'Rp 15.000' },
		{ label: '10 - 15 km', value: 'Rp 20.000' },
		{ label: 'Above 15 km', value: 'Contact Us' }
	];

	const orderSteps = [
		'Browse our products and add items to your cart',
		'Review your order and proceed to checkout',
		'Fill in your delivery details (name, phone, address)',
		'Send your order via WhatsApp to confirm',
		"We'll confirm your order and estimated delivery time"
	];
</script>

<svelte:head>
	<title>Delivery Information | Bakeruu</title>
	<meta
		name="description"
		content="Everything you need to know about Bakeruu's delivery service - areas, times, fees, and how to order."
	/>
</svelte:head>

<Header />

<PageHeader
	title="Delivery Information"
	subtitle="Everything you need to know about our delivery service"
/>

<main class="bg-white py-12">
	<div class="container mx-auto px-8">
		<!-- Info Cards Grid 2x2 -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
			<!-- Delivery Areas -->
			<InfoCard title="Delivery Areas">
				{#snippet icon()}
					<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
						/>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
						/>
					</svg>
				{/snippet}

				<p class="text-base leading-relaxed mb-4">
					We deliver to the following areas within Sweet Town and surrounding districts:
				</p>

				<ul class="space-y-2 mb-6 ml-2">
					{#each deliveryAreas as area}
						<li class="text-base flex items-center gap-2">
							<span class="w-1.5 h-1.5 bg-[var(--color-gray-600)] rounded-full"></span>
							{area}
						</li>
					{/each}
				</ul>

				<p class="text-sm text-[var(--color-gray-600)]">
					For areas outside these zones, please contact us for special arrangements.
				</p>
			</InfoCard>

			<!-- Delivery Times -->
			<InfoCard title="Delivery Times">
				{#snippet icon()}
					<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
				{/snippet}

				<div class="space-y-4">
					<div>
						<h3 class="font-bold text-base mb-2">Standard Delivery</h3>
						<p class="text-base">Monday - Saturday: 9:00 AM - 8:00 PM</p>
						<p class="text-base">Sunday: 10:00 AM - 6:00 PM</p>
					</div>

					<div>
						<h3 class="font-bold text-base mb-2">Estimated Delivery</h3>
						<p class="text-base leading-relaxed">
							Orders placed before 2:00 PM will be delivered the same day. Orders after 2:00 PM
							will be delivered the next business day.
						</p>
					</div>

					<InfoAlert
						highlight="Rush Delivery:"
						text="Available for urgent orders with additional fees. Contact us directly."
					/>
				</div>
			</InfoCard>

			<!-- Delivery Fees -->
			<InfoCard title="Delivery Fees">
				{#snippet icon()}
					<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
				{/snippet}

				<div class="space-y-1 mb-4">
					{#each deliveryFees as fee, i}
						<FeeRow label={fee.label} value={fee.value} showBorder={i < deliveryFees.length - 1} />
					{/each}
				</div>

				<InfoAlert
					highlight="Free Delivery:"
					text="For orders above Rp 100.000 within 10 km radius!"
				/>
			</InfoCard>

			<!-- How to Order -->
			<InfoCard title="How to Order">
				{#snippet icon()}
					<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
						/>
					</svg>
				{/snippet}

				<div class="space-y-3">
					{#each orderSteps as step, i}
						<OrderStep step={i + 1} text={step} />
					{/each}
				</div>
			</InfoCard>
		</div>
	</div>
</main>

<Footer />
