<script lang="ts">
	import { page } from '$app/stores';
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

	const navItems: NavItem[] = [
		{ label: 'Home', href: '/' },
		{ label: 'Products', href: '/products' },
		{ label: 'Delivery', href: '/delivery' }
	];

	const bgClass = $derived(variant === 'transparent' ? 'bg-transparent' : 'bg-[var(--color-primary)]');

	function isActive(href: string, pathname: string): boolean {
		if (href === '/') return pathname === '/';
		return pathname.startsWith(href);
	}
</script>

<header class="fixed top-0 left-0 right-0 z-50 {bgClass} {className}">
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
				class="text-[var(--color-cream)] hover:text-white transition-colors"
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
			</a>

			<!-- Mobile Menu Button -->
			<button class="md:hidden text-[var(--color-cream)]" aria-label="Menu">
				<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 6h16M4 12h16M4 18h16"
					/>
				</svg>
			</button>
		</div>
	</nav>
</header>
