<script lang="ts">
	import BakeruuLogo from '$lib/assets/Bakeruu.png';

	interface Props {
		variant?: 'light' | 'dark';
		class?: string;
	}

	let { variant = 'light', class: className = '' }: Props = $props();
</script>

<a href="/" class="flex items-center gap-2 {className}">
	<img src={BakeruuLogo} alt="Bakeruu" class="h-10 w-auto" />
</a>
