<script lang="ts">
	import type { CustomerInfo, CartItem } from '$lib/types';
	import { formatRupiah } from '$lib/utils/format';
	import Button from '$lib/components/ui/Button.svelte';
	import { PUBLIC_WHATSAPP_ADMIN_PHONE } from '$env/static/public';

	interface Props {
		items: CartItem[];
		onBack?: () => void;
		onSuccess?: () => void;
	}

	let { items, onBack, onSuccess }: Props = $props();

	let customerInfo = $state<CustomerInfo>({
		name: '',
		phone: '',
		address: ''
	});

	let errors = $state<Partial<Record<keyof CustomerInfo, string>>>({});

	const totalPrice = $derived(items.reduce((sum, item) => sum + item.price * item.quantity, 0));

	function validateForm(): boolean {
		const newErrors: Partial<Record<keyof CustomerInfo, string>> = {};

		if (!customerInfo.name.trim()) {
			newErrors.name = 'Full name is required';
		}

		if (!customerInfo.phone.trim()) {
			newErrors.phone = 'Phone number is required';
		} else if (!/^(08|\+62|62)\d{8,12}$/.test(customerInfo.phone.replace(/[\s-]/g, ''))) {
			newErrors.phone = 'Please enter a valid phone number';
		}

		if (!customerInfo.address.trim()) {
			newErrors.address = 'Delivery address is required';
		}

		errors = newErrors;
		return Object.keys(newErrors).length === 0;
	}

	function generateWhatsAppMessage(): string {
		const orderDate = new Date().toLocaleDateString('id-ID', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});

		let message = `🛒 *PESANAN BARU BAKERUU*\n`;
		message += `📅 ${orderDate}\n\n`;
		message += `👤 *DATA PELANGGAN*\n`;
		message += `Nama: ${customerInfo.name}\n`;
		message += `Telepon: ${customerInfo.phone}\n`;
		message += `Alamat: ${customerInfo.address}\n\n`;
		message += `📋 *DETAIL PESANAN*\n`;
		message += `────────────────────\n`;

		items.forEach((item, index) => {
			message += `${index + 1}. ${item.productName}\n`;
			message += `   ${item.quantity} x ${formatRupiah(item.price)} = ${formatRupiah(item.price * item.quantity)}\n`;
		});

		message += `────────────────────\n`;
		message += `💰 *TOTAL: ${formatRupiah(totalPrice)}*\n\n`;
		message += `Terima kasih telah berbelanja di Bakeruu! 🧁`;

		return encodeURIComponent(message);
	}

	function handleSubmit() {
		if (!validateForm()) return;

		const message = generateWhatsAppMessage();
		const whatsappUrl = `https://wa.me/${PUBLIC_WHATSAPP_ADMIN_PHONE}?text=${message}`;

		// Open WhatsApp in new tab
		window.open(whatsappUrl, '_blank');

		// Trigger success callback
		onSuccess?.();
	}
</script>

<div
	class="bg-[var(--color-gray-100)] rounded-2xl shadow-[0px_4px_6px_0px_rgba(0,0,0,0.1),0px_2px_4px_0px_rgba(0,0,0,0.1)] p-4 sm:p-6 flex flex-col gap-4 sm:gap-6"
>
	<!-- Title -->
	<h2 class="text-lg sm:text-xl lg:text-2xl font-bold text-[var(--color-gray-700)]">
		Customer Information
	</h2>

	<!-- Form -->
	<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="flex flex-col gap-4 sm:gap-5">
		<!-- Full Name -->
		<div class="flex flex-col gap-1.5 sm:gap-2">
			<label for="fullName" class="text-sm sm:text-base font-semibold text-[var(--color-gray-700)]">
				Full Name <span class="text-[var(--color-accent)]">*</span>
			</label>
			<input
				type="text"
				id="fullName"
				bind:value={customerInfo.name}
				placeholder="Enter your full name"
				class="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-[#d1d5dc] rounded-[10px] text-sm sm:text-base text-[var(--color-gray-800)] placeholder:text-[rgba(10,10,10,0.5)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
			/>
			{#if errors.name}
				<p class="text-xs sm:text-sm text-[var(--color-accent)]">{errors.name}</p>
			{/if}
		</div>

		<!-- Phone Number -->
		<div class="flex flex-col gap-1.5 sm:gap-2">
			<label for="phone" class="text-sm sm:text-base font-semibold text-[var(--color-gray-700)]">
				Phone Number <span class="text-[var(--color-accent)]">*</span>
			</label>
			<input
				type="tel"
				id="phone"
				bind:value={customerInfo.phone}
				placeholder="08xxxxxxxxxx"
				class="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-[#d1d5dc] rounded-[10px] text-sm sm:text-base text-[var(--color-gray-800)] placeholder:text-[rgba(10,10,10,0.5)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
			/>
			{#if errors.phone}
				<p class="text-xs sm:text-sm text-[var(--color-accent)]">{errors.phone}</p>
			{/if}
		</div>

		<!-- Delivery Address -->
		<div class="flex flex-col gap-1.5 sm:gap-2">
			<label for="address" class="text-sm sm:text-base font-semibold text-[var(--color-gray-700)]">
				Delivery Address <span class="text-[var(--color-accent)]">*</span>
			</label>
			<textarea
				id="address"
				bind:value={customerInfo.address}
				placeholder="Enter your complete delivery address"
				rows="4"
				class="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-[#d1d5dc] rounded-[10px] text-sm sm:text-base text-[var(--color-gray-800)] placeholder:text-[rgba(10,10,10,0.5)] focus:outline-none focus:border-[var(--color-accent)] transition-colors resize-none"
			></textarea>
			{#if errors.address}
				<p class="text-xs sm:text-sm text-[var(--color-accent)]">{errors.address}</p>
			{/if}
		</div>

		<!-- Submit Button -->
		<Button type="submit" variant="primary" size="lg" class="w-full rounded-[14px]">
			Send Order via WhatsApp
		</Button>
	</form>
</div>
