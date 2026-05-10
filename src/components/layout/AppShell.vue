<template>
  <div class="app-shell relative mx-auto min-h-screen w-full max-w-140 px-4 pb-28 pt-3">
    <div class="app-shell__glow app-shell__glow--top"></div>
    <div class="app-shell__glow app-shell__glow--bottom"></div>
    <header v-if="showHeader" class="app-topbar mb-3 grid grid-cols-[auto_1fr_auto] items-center gap-3">
      <button class="secondary-button" type="button" @click="goHome">Accueil</button>
      <button class="app-topbar__title" type="button" @click="goHome">{{ title }}</button>
      <button class="icon-button icon-button--square app-topbar__settings" type="button" aria-label="Ouvrir les paramètres" @click="goToSettings">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M10.5 2h3l.6 2.3c.5.2 1 .4 1.5.7l2.1-1.1 2.1 2.1-1.1 2.1c.3.5.5 1 .7 1.5l2.3.6v3l-2.3.6c-.2.5-.4 1-.7 1.5l1.1 2.1-2.1 2.1-2.1-1.1c-.5.3-1 .5-1.5.7l-.6 2.3h-3l-.6-2.3c-.5-.2-1-.4-1.5-.7l-2.1 1.1-2.1-2.1 1.1-2.1c-.3-.5-.5-1-.7-1.5L2 13.5v-3l2.3-.6c.2-.5.4-1 .7-1.5L3.9 6.3 6 4.2l2.1 1.1c.5-.3 1-.5 1.5-.7z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" />
          <circle cx="12" cy="12" r="2.8" fill="none" stroke="currentColor" stroke-width="1.6" />
        </svg>
      </button>
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

const title = computed(() => state.value?.profile.characterName || 'Campagnes')
const showHeader = computed(() => hasCharacter.value && route.name !== 'character-tunnel')
const showBottomNav = computed(() => hasCharacter.value && route.name !== 'character-tunnel')

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
