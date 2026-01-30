<script lang="ts">
	import type { Testimonial } from '$lib/types';
	import { StarRating } from '$lib/components/ui';

	interface Props {
		testimonial: Testimonial;
		class?: string;
	}

	let { testimonial, class: className = '' }: Props = $props();
</script>

<div
	class="bg-[var(--color-cream-light)] rounded-[var(--radius-lg)] p-8 shadow-[var(--shadow-card)] flex flex-col gap-6 {className}"
>
	<!-- Header: Avatar + Name + Type -->
	<div class="flex items-center gap-4">
		<!-- Avatar Placeholder -->
		<div
			class="w-16 h-16 rounded-full bg-[var(--color-gray-300)] flex items-center justify-center text-2xl font-bold text-[var(--color-gray-600)] overflow-hidden"
		>
			{testimonial.nama.charAt(0).toUpperCase()}
		</div>

		<!-- Name and Type -->
		<div>
			<h4 class="font-bold text-lg text-[var(--color-gray-700)]">
				{testimonial.nama}
			</h4>
			<p class="text-[var(--color-primary)] text-sm">
				{testimonial.tipe}
			</p>
		</div>
	</div>

	<!-- Star Rating -->
	<StarRating rating={testimonial.bintang} size="md" />

	<!-- Comment -->
	<p class="text-[var(--color-gray-600)] leading-relaxed">
		"{testimonial.komentar}"
	</p>
</div>
