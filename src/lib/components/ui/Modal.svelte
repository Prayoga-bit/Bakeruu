<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		isOpen: boolean;
		title?: string;
		class?: string;
		onclose?: () => void;
		children: Snippet;
	}

	let { isOpen = false, title, class: className = '', onclose, children }: Props = $props();

	function handleBackdropClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			onclose?.();
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			onclose?.();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen}
	<!-- Backdrop -->
	<!-- svelte-ignore a11y_click_events_have_key_events a11y_interactive_supports_focus -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
		onclick={handleBackdropClick}
		role="dialog"
		aria-modal="true"
		aria-labelledby={title ? 'modal-title' : undefined}
	>
		<!-- Modal Container -->
		<div
			class="bg-white rounded-[var(--radius-lg)] max-h-[90vh] overflow-hidden shadow-lg w-full max-w-4xl {className}"
		>
			<!-- Header -->
			{#if title || onclose}
				<div
					class="flex items-center justify-between px-6 py-5 border-b border-[var(--color-gray-300)]"
				>
					{#if title}
						<h2 id="modal-title" class="text-2xl font-bold text-[var(--color-gray-700)]">
							{title}
						</h2>
					{:else}
						<div></div>
					{/if}

					{#if onclose}
						<button
							type="button"
							onclick={onclose}
							class="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[var(--color-gray-100)] transition-colors"
							aria-label="Close modal"
						>
							<svg class="w-6 h-6 text-[var(--color-gray-700)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					{/if}
				</div>
			{/if}

			<!-- Content -->
			<div class="overflow-y-auto max-h-[calc(90vh-80px)]">
				{@render children()}
			</div>
		</div>
	</div>
{/if}
