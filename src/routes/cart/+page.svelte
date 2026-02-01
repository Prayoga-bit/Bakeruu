<script lang="ts">
	import { goto } from '$app/navigation';
	import { cartStore, cartSummary } from '$lib/stores/cart';
	import { EmptyCart, CartItemCard, OrderSummary, CheckoutForm } from '$lib/components/cart';

	// State: 'cart' | 'checkout'
	let view = $state<'cart' | 'checkout'>('cart');

	// Get reactive cart data
	const cart = $derived($cartSummary);
	const isEmpty = $derived(cart.items.length === 0);

	function handleBackToShopping() {
		goto('/products');
	}

	function handleBackToCart() {
		view = 'cart';
	}

	function handleUpdateQuantity(productId: string, quantity: number) {
		cartStore.updateQuantity(productId, quantity);
	}

	function handleRemoveItem(productId: string) {
		cartStore.removeItem(productId);
	}

	function handleCheckout() {
		view = 'checkout';
	}

	function handleOrderSuccess() {
		// Clear the cart after successful order
		cartStore.clear();
		view = 'cart';
	}
</script>

<svelte:head>
	<title>{view === 'checkout' ? 'Checkout' : 'Shopping Cart'} - Bakeruu</title>
</svelte:head>

<main class="min-h-screen bg-white">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<!-- Back Button -->
		<button
			type="button"
			onclick={view === 'checkout' ? handleBackToCart : handleBackToShopping}
			class="flex items-center gap-2 text-[var(--color-accent)] text-sm sm:text-base font-semibold mb-6 sm:mb-8 hover:opacity-80 transition-opacity cursor-pointer"
		>
			<svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
			</svg>
			{view === 'checkout' ? 'Back to Cart' : 'Back to Shopping'}
		</button>

		{#if isEmpty && view === 'cart'}
			<!-- Empty Cart State -->
			<EmptyCart onStartShopping={handleBackToShopping} />
		{:else if view === 'checkout'}
			<!-- Checkout View -->
			<h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--color-gray-700)] mb-6 sm:mb-8">
				Checkout
			</h1>

			<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
				<!-- Customer Information Form -->
				<CheckoutForm
					items={cart.items}
					onBack={handleBackToCart}
					onSuccess={handleOrderSuccess}
				/>

				<!-- Order Summary -->
				<OrderSummary items={cart.items} variant="checkout" />
			</div>
		{:else}
			<!-- Cart View -->
			<h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--color-gray-700)] mb-6 sm:mb-8">
				Shopping Cart
			</h1>

			<div class="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
				<!-- Cart Items -->
				<div class="lg:col-span-2 flex flex-col gap-4">
					{#each cart.items as item (item.productId)}
						<CartItemCard
							{item}
							onUpdateQuantity={handleUpdateQuantity}
							onRemove={handleRemoveItem}
						/>
					{/each}
				</div>

				<!-- Order Summary Sidebar -->
				<div class="lg:col-span-1">
					<div class="sticky top-8">
						<OrderSummary items={cart.items} variant="cart" onCheckout={handleCheckout} />
					</div>
				</div>
			</div>
		{/if}
	</div>
</main>
