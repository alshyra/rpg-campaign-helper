<template>
  <Teleport to="body">
    <transition name="fade">
      <div v-if="isVisible" class="onboarding fixed inset-0 z-20 grid place-items-end px-3.5 pb-7 pt-5" role="dialog" aria-modal="true" aria-labelledby="onboarding-title">
        <div class="onboarding__backdrop"></div>
        <section class="onboarding__panel relative grid w-[min(100%,540px)] gap-4 rounded-[28px] border border-(--line-strong) bg-[linear-gradient(180deg,rgba(39,28,21,0.98),rgba(20,15,11,0.98))] px-4.5 py-5.5 shadow-[0_30px_80px_rgba(0,0,0,0.48)]">
          <p class="onboarding__eyebrow">Premier lancement</p>
          <h2 id="onboarding-title" class="onboarding__title">Bienvenue dans rpg-player-helper</h2>
          <p class="onboarding__intro m-0 leading-relaxed text-(--text-soft)">
            Une fiche de personnage mobile-first, entièrement locale, pensée pour suivre ton perso sans base de données.
          </p>

          <div class="onboarding__steps grid gap-3">
            <article class="grid gap-1 rounded-2xl border border-[rgba(221,187,123,0.08)] bg-white/3 px-3.5 py-3">
              <strong>Profil</strong>
              <p>Identité, points de vie, statistiques et compétences modifiables en direct.</p>
            </article>
            <article class="grid gap-1 rounded-2xl border border-[rgba(221,187,123,0.08)] bg-white/3 px-3.5 py-3">
              <strong>Inventaire</strong>
              <p>Ajoute, retire et ajuste rapidement tes objets pendant la partie.</p>
            </article>
            <article class="grid gap-1 rounded-2xl border border-[rgba(221,187,123,0.08)] bg-white/3 px-3.5 py-3">
              <strong>Notes</strong>
              <p>Journal de session, indices, PNJ et rappels toujours disponibles hors ligne.</p>
            </article>
            <article class="grid gap-1 rounded-2xl border border-[rgba(221,187,123,0.08)] bg-white/3 px-3.5 py-3">
              <strong>Sauvegarde</strong>
              <p>Exporte ou réimporte un JSON pour garder une copie de ton personnage.</p>
            </article>
          </div>

          <div class="onboarding__actions grid grid-cols-2 gap-2.5 max-[420px]:grid-cols-1">
            <button class="secondary-button" type="button" @click="dismiss(false)">Plus tard</button>
            <button class="primary-button" type="button" @click="dismiss(true)">Entrer dans l'app</button>
          </div>
        </section>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const STORAGE_KEY = 'rpg-player-helper::onboarding-seen'
const isVisible = ref(false)

onMounted(() => {
  isVisible.value = window.localStorage.getItem(STORAGE_KEY) !== 'true'
})

const dismiss = (remember: boolean) => {
  if (remember) {
    window.localStorage.setItem(STORAGE_KEY, 'true')
  }
  isVisible.value = false
}
</script>