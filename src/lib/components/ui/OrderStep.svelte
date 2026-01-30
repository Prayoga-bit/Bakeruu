<script lang="ts">
	interface Props {
		step: number;
		text: string;
	}

	let { step, text }: Props = $props();
</script>

<div class="flex items-center gap-3">
	<div
		class="w-6 h-6 bg-[var(--color-accent)] rounded-full flex items-center justify-center shrink-0"
	>
		<span class="text-sm font-bold text-white">{step}</span>
	</div>
	<p class="text-base text-[var(--color-gray-700)]">{text}</p>
</div>
