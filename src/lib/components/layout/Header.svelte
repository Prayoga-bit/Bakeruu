<script lang="ts">
	import Logo from './Logo.svelte';

	interface NavItem {
		label: string;
		href: string;
		active?: boolean;
	}

	interface Props {
		variant?: 'transparent' | 'solid';
		class?: string;
	}

	let { variant = 'transparent', class: className = '' }: Props = $props();

	const navItems: NavItem[] = [
		{ label: 'Home', href: '/', active: true },
		{ label: 'Products', href: '/products' },
		{ label: 'Delivery', href: '/delivery' }
	];

	const bgClass = variant === 'transparent' ? 'bg-transparent' : 'bg-[var(--color-primary)]';
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
							{item.active ? 'border-b-2 border-[var(--color-cream)]' : ''}"
					>
						{item.label}
					</a>
				{/each}
			</div>

			<!-- Cart Icon -->
			<a href="/cart" class="text-[var(--color-cream)] hover:text-white transition-colors">
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
