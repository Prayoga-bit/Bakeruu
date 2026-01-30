<script lang="ts">
	import './layout.css';
	import BakeruuLogo from '$lib/assets/Bakeruu.png';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={BakeruuLogo} />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
</svelte:head>

<div class="min-h-screen">
	{@render children()}
</div>
