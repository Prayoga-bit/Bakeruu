<script lang="ts">
	import { page } from '$app/stores';
	import { cartItemCount } from '$lib/stores/cart';
	import { browser } from '$app/environment';
	import Logo from './Logo.svelte';

	interface NavItem {
		label: string;
		href: string;
	}

	interface Props {
		variant?: 'transparent' | 'solid';
		class?: string;
	}

	let { variant = 'transparent', class: className = '' }: Props = $props();

	// Scroll state for background visibility
	let isScrolled = $state(false);
	
	// Mobile menu state
	let isMobileMenuOpen = $state(false);

	function toggleMobileMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
	}

	function closeMobileMenu() {
		isMobileMenuOpen = false;
	}

	$effect(() => {
		if (browser) {
			const handleScroll = () => {
				isScrolled = window.scrollY > 50;
			};
			window.addEventListener('scroll', handleScroll, { passive: true });
			return () => window.removeEventListener('scroll', handleScroll);
		}
	});

	const navItems: NavItem[] = [
		{ label: 'Home', href: '/' },
		{ label: 'Products', href: '/products' },
		{ label: 'Delivery', href: '/delivery' }
	];

	// Background class based on variant and scroll state
	const bgClass = $derived.by(() => {
		if (variant === 'solid') return 'bg-[var(--color-primary)]';
		if (isScrolled) return 'bg-[var(--color-primary)]/95 backdrop-blur-sm';
		return 'bg-transparent';
	});

	function isActive(href: string, pathname: string): boolean {
		if (href === '/') return pathname === '/';
		return pathname.startsWith(href);
	}
</script>

<header class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 {bgClass} {className}">
	<nav class="container mx-auto px-10 py-6">
		<div class="flex items-center justify-between">
			<!-- Logo -->
			<Logo />

			<!-- Navigation Links -->
			<div class="hidden md:flex items-center gap-6">
				{#each navItems as item}
					<a
						href={item.href}
						class="text-[var(--color-cream)] text-xl font-black transition-colors hover:text-white
							{isActive(item.href, $page.url.pathname) ? 'border-b-2 border-[var(--color-cream)]' : ''}"
					>
						{item.label}
					</a>
				{/each}
			</div>

			<!-- Cart Icon -->
			<a
				href="/cart"
				class="relative text-[var(--color-cream)] hover:text-white transition-colors"
				aria-label="Shopping Cart"
			>
				<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
					/>
				</svg>
				{#if $cartItemCount > 0}
					<span
						class="absolute -top-2 -right-2 bg-[var(--color-accent)] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
					>
						{$cartItemCount > 99 ? '99+' : $cartItemCount}
					</span>
				{/if}
			</a>

			<!-- Mobile Menu Button -->
			<button 
				class="md:hidden text-[var(--color-cream)] p-2" 
				aria-label="Menu"
				aria-expanded={isMobileMenuOpen}
				onclick={toggleMobileMenu}
			>
				{#if isMobileMenuOpen}
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				{:else}
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
					</svg>
				{/if}
			</button>
		</div>

		<!-- Mobile Menu Dropdown -->
		{#if isMobileMenuOpen}
			<div class="md:hidden bg-[var(--color-primary)]/95 backdrop-blur-sm border-t border-[var(--color-cream)]/20">
				<div class="flex flex-col py-4 px-4 gap-2">
					{#each navItems as item}
						<a
							href={item.href}
							onclick={closeMobileMenu}
							class="text-[var(--color-cream)] text-base font-semibold py-3 px-4 rounded-lg transition-colors hover:bg-[var(--color-cream)]/10
								{isActive(item.href, $page.url.pathname) ? 'bg-[var(--color-cream)]/10' : ''}"
						>
							{item.label}
						</a>
					{/each}
				</div>
			</div>
		{/if}
	</nav>
</header>
