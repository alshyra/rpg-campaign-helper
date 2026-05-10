<template>
	<div class="app-shell relative mx-auto min-h-screen w-full max-w-140 px-5 pb-28 pt-3">
    <div class="app-shell__glow app-shell__glow--top"></div>
    <div class="app-shell__glow app-shell__glow--bottom"></div>
		<header v-if="showHeader" class="app-topbar sticky top-0 z-50 -mx-5 mb-4 grid grid-cols-[40px_1fr_40px] items-center gap-3 border-b border-white/5 bg-black/60 px-5 py-4 backdrop-blur-md">
			<!-- Gauche : icône home (masqué sur /persos) -->
			<button v-if="route.name !== 'persos'" class="icon-button icon-button--square" type="button" aria-label="Retour accueil" @click="goHome">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					<path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z" />
					<path d="M9 21V12h6v9" />
				</svg>
			</button>
			<div v-else class="w-10" />

			<!-- Centre : titre deux lignes -->
			<div class="app-topbar__title-block text-center">
				<p class="app-topbar__eyebrow m-0 text-[10px] font-black uppercase leading-tight tracking-[0.3em] text-amber-600">{{ eyebrow }}</p>
				<p class="m-0 mt-0.5 font-(family-name:--serif) text-xl leading-none tracking-wide text-amber-100">{{ title }}</p>
			</div>

			<!-- Droite : roue paramètres (masquée sur /parametres) -->
			<button v-if="route.name !== 'parametres'" class="icon-button icon-button--square app-topbar__settings" type="button" aria-label="Ouvrir les paramètres" @click="goToSettings">
				<svg viewBox="0 0 24 24" aria-hidden="true">
					<path d="M10.5 2h3l.6 2.3c.5.2 1 .4 1.5.7l2.1-1.1 2.1 2.1-1.1 2.1c.3.5.5 1 .7 1.5l2.3.6v3l-2.3.6c-.2.5-.4 1-.7 1.5l1.1 2.1-2.1 2.1-2.1-1.1c-.5.3-1 .5-1.5.7l-.6 2.3h-3l-.6-2.3c-.5-.2-1-.4-1.5-.7l-2.1 1.1-2.1-2.1 1.1-2.1c-.3-.5-.5-1-.7-1.5L2 13.5v-3l2.3-.6c.2-.5.4-1 .7-1.5L3.9 6.3 6 4.2l2.1 1.1c.5-.3 1-.5 1.5-.7z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" />
					<circle cx="12" cy="12" r="2.8" fill="none" stroke="currentColor" stroke-width="1.6" />
				</svg>
			</button>
			<div v-else class="w-10" />
		</header>

    <main class="app-shell__content grid gap-4.5">
      <slot />
    </main>

    <BottomNav v-if="showBottomNav" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import BottomNav from './BottomNav.vue'
import { useCharacterStore } from '../../stores/character'

const characterStore = useCharacterStore()
const { hasCharacter, state } = storeToRefs(characterStore)
const route = useRoute()
const router = useRouter()

const characterName = computed(() => state.value?.profile.characterName || '')

const eyebrow = computed(() => {
	if (route.name === 'persos') return 'Compendium'
	if (route.name === 'parametres') return 'Système'
	return 'Aventurier'
})

const title = computed(() => {
	if (route.name === 'persos') return 'Mes Héros'
	if (route.name === 'parametres') return 'Réglages'
	return characterName.value || 'Héros'
})

const showHeader = computed(() => route.name !== 'character-tunnel')
const showBottomNav = computed(() =>
	hasCharacter.value &&
	!['character-tunnel', 'persos', 'parametres'].includes(route.name as string)
)

const goHome = () => {
  router.push('/persos')
}

const goToSettings = () => {
  router.push('/parametres')
}
</script>
<style scoped>
.app-shell__glow {
	position: fixed;
	width: 220px;
	height: 220px;
	border-radius: 999px;
	pointer-events: none;
	filter: blur(40px);
	opacity: 0.45;
}

.app-shell__glow--top {
	top: -90px;
	right: -40px;
	background: rgba(180, 110, 30, 0.18);
}

.app-shell__glow--bottom {
	bottom: 30px;
	left: -80px;
	background: rgba(140, 88, 40, 0.16);
}

.app-topbar__title {
	border: 0;
	padding: 0;
	background: transparent;
	color: var(--text-soft);
	font-family: var(--serif);
	font-size: 1rem;
	cursor: pointer;
}

.app-topbar__title:hover {
	color: var(--gold);
}
</style>
