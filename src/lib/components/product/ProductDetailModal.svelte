<script lang="ts">
	import type { Product } from '$lib/types';
	import Modal from '$lib/components/ui/Modal.svelte';
	import ProductDetail from './ProductDetail.svelte';

	interface Props {
		product: Product | null;
		isOpen: boolean;
		onclose?: () => void;
		onAddToCart?: (product: Product) => void;
	}

	let { product, isOpen = false, onclose, onAddToCart }: Props = $props();
</script>

<Modal {isOpen} title={product?.name} {onclose}>
	{#if product}
		<ProductDetail {product} {onAddToCart} />
	{/if}
</Modal>
