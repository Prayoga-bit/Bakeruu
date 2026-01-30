<script lang="ts">
	interface Props {
		label: string;
		value: string;
		showBorder?: boolean;
	}

	let { label, value, showBorder = true }: Props = $props();
</script>

<div
	class="flex items-center justify-between py-2 {showBorder
		? 'border-b border-[var(--color-gray-300)]'
		: ''}"
>
	<span class="text-base text-[var(--color-gray-700)]">{label}</span>
	<span class="text-base font-bold text-[var(--color-gray-700)]">{value}</span>
</div>
