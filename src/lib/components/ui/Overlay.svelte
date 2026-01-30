<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		isOpen: boolean;
		title?: string;
		showCloseButton?: boolean;
		closable?: boolean;
		class?: string;
		onclose?: () => void;
		children: Snippet;
	}

	let {
		isOpen = false,
		title,
		showCloseButton = true,
		closable = true,
		class: className = '',
		onclose,
		children
	}: Props = $props();

	function handleBackdropClick(event: MouseEvent) {
		// Only close if closable and clicking on backdrop itself
		if (closable && event.target === event.currentTarget) {
			onclose?.();
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		// Only close on Escape if closable
		if (closable && event.key === 'Escape') {
			onclose?.();
		}
	}

	function handleCloseClick() {
		if (closable) {
			onclose?.();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen}
	<!-- Backdrop -->
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div
		class="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
		onclick={handleBackdropClick}
		onkeydown={handleKeydown}
		role="dialog"
		aria-modal="true"
		tabindex="-1"
		aria-labelledby={title ? 'overlay-title' : undefined}
	>
		<!-- Overlay Container -->
		<div
			class="bg-white rounded-[var(--radius-lg)] shadow-[0px_25px_50px_rgba(0,0,0,0.25)] w-full max-w-md {className}"
		>
			<!-- Header -->
			{#if title || showCloseButton}
				<div
					class="flex items-center justify-between px-4 py-4 border-b border-[var(--color-gray-300)]"
				>
					{#if title}
						<h2 id="overlay-title" class="text-xl font-bold text-[var(--color-gray-700)]">
							{title}
						</h2>
					{:else}
						<div></div>
					{/if}

					{#if showCloseButton}
						<button
							type="button"
							onclick={handleCloseClick}
							class="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[var(--color-gray-100)] transition-colors {closable
								? 'cursor-pointer'
								: 'cursor-not-allowed opacity-50'}"
							aria-label="Close"
							disabled={!closable}
						>
							<svg
								class="w-5 h-5 text-[var(--color-gray-700)]"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					{/if}
				</div>
			{/if}

			<!-- Content -->
			<div>
				{@render children()}
			</div>
		</div>
	</div>
{/if}
