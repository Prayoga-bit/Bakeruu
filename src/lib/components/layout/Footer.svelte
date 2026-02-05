<script lang="ts">
	import logo from '$lib/assets/Bakeruu.png';

	interface FooterLink {
		label: string;
		href: string;
	}

	interface FooterSection {
		title: string;
		links: FooterLink[];
	}

	const quickLinks: FooterSection = {
		title: 'Quick Links',
		links: [
			{ label: 'Home', href: '/' },
			{ label: 'Products', href: '/products' },
			{ label: 'Delivery Info', href: '/delivery' }
		]
	};


	const contactInfo = [
		'123 Bakery Street',
		'Sweet Town, ST 12345',
		'Phone: (555) 123-4567',
		'Email: hello@bakeruu.com'
	];
</script>

<footer class="bg-[var(--color-primary)] text-[var(--color-cream)] pt-16 pb-8">
	<div class="container mx-auto px-10">
		<!-- Main Footer Content -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:gap-32 gap-8 mb-12">
			<!-- Brand Section -->
			<div>
				<img src={logo} alt="Bakeruu Logo" class="w-32 mb-4" />
				<p class="opacity-90 leading-relaxed">
					Crafting delicious memories with every bite since 2020. Fresh baked daily with love.
				</p>
			</div>

			<!-- Quick Links -->
			<div>
				<h4 class="font-bold text-xl mb-5">{quickLinks.title}</h4>
				<ul class="space-y-2">
					{#each quickLinks.links as link}
						<li>
							<a href={link.href} class="hover:text-white transition-colors">
								{link.label}
							</a>
						</li>
					{/each}
				</ul>
			</div>

			<!-- Contact Us -->
			<div>
				<h4 class="font-bold text-xl mb-5">Contact Us</h4>
				<ul class="space-y-2">
					{#each contactInfo as info}
						<li>{info}</li>
					{/each}
				</ul>
			</div>
		</div>

		<!-- Divider -->
		<div class="border-t border-[var(--color-cream)]/30 pt-8">
			<p class="text-center opacity-90">© 2026 Bakeruu. All rights reserved.</p>
		</div>
	</div>
</footer>
