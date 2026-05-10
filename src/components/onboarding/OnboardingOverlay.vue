<template>
  <Teleport to="body">
    <transition name="fade">
      <div
        v-if="isVisible"
        class="onboarding fixed inset-0 z-[60] grid place-items-center px-3.5 py-5"
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
      >
        <div class="onboarding__backdrop"></div>
        <section
          class="onboarding__panel relative grid w-[min(100%,480px)] max-h-[calc(100dvh-2.5rem)] overflow-y-auto gap-5 rounded-[28px] border border-(--line-strong) bg-[linear-gradient(180deg,rgba(39,28,21,0.98),rgba(20,15,11,0.98))] px-5 py-6 shadow-[0_30px_80px_rgba(0,0,0,0.48)]"
        >
          <!-- Étape d'intro -->
          <transition
            name="slide"
            mode="out-in"
          >
            <div
              v-if="currentStep === 0"
              key="intro"
              class="grid gap-3"
            >
              <p class="onboarding__eyebrow">Premier lancement</p>
              <h2
                id="onboarding-title"
                class="onboarding__title"
              >
                Bienvenue dans rpg-player-helper
              </h2>
              <p class="m-0 leading-relaxed text-(--text-soft)">
                Une fiche de personnage mobile-first, entièrement locale, pensée pour suivre ton perso sans base de
                données.
              </p>
            </div>

            <!-- Étapes features -->
            <div
              v-else
              :key="steps[currentStep - 1].id"
              class="grid gap-3"
            >
              <div
                class="onboarding__feature-icon grid h-12 w-12 place-items-center rounded-2xl border border-[rgba(221,187,123,0.15)] bg-white/3 text-amber-400"
              >
                <svg
                  viewBox="0 0 24 24"
                  class="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                  v-html="steps[currentStep - 1].icon"
                  aria-hidden="true"
                />
              </div>
              <h2
                :id="currentStep === 1 ? 'onboarding-title' : undefined"
                class="onboarding__title"
              >
                {{ steps[currentStep - 1].title }}
              </h2>
              <p class="m-0 leading-relaxed text-(--text-soft)">
                {{ steps[currentStep - 1].desc }}
              </p>
            </div>
          </transition>

          <!-- Indicateur de progression -->
          <div class="flex items-center justify-center gap-1.5">
            <button
              v-for="(_, i) in totalSteps"
              :key="i"
              type="button"
              class="h-1.5 rounded-full transition-all duration-300"
              :class="i === currentStep ? 'w-5 bg-amber-500' : 'w-1.5 bg-white/15'"
              :aria-label="`Aller à l'étape ${i + 1}`"
              @click="currentStep = i"
            />
          </div>

          <!-- Actions -->
          <div class="onboarding__actions grid grid-cols-2 gap-2.5">
            <button
              class="secondary-button"
              type="button"
              @click="dismiss(false)"
            >
              Passer
            </button>
            <button
              class="primary-button"
              type="button"
              @click="currentStep < totalSteps - 1 ? currentStep++ : dismiss(true)"
            >
              {{ currentStep < totalSteps - 1 ? "Suivant" : "Commencer" }}
            </button>
          </div>
        </section>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

const STORAGE_KEY = "rpg-player-helper::onboarding-seen";
const isVisible = ref(false);
const currentStep = ref(0);

const steps = [
  {
    id: "profil",
    title: "Profil",
    desc: "Consulte et modifie en direct l'identité, les statistiques et les compétences de ton personnage.",
    icon: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  },
  {
    id: "inventaire",
    title: "Inventaire",
    desc: "Ajoute, retire et ajuste rapidement la quantité de tes objets pendant la partie.",
    icon: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
  },
  {
    id: "notes",
    title: "Notes",
    desc: "Journal de session, indices, PNJ et rappels toujours disponibles hors ligne.",
    icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>',
  },
  {
    id: "sauvegarde",
    title: "Sauvegarde",
    desc: "Exporte ou réimporte un JSON pour garder une copie de ton personnage, sans compte ni serveur.",
    icon: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v14a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>',
  },
];

const totalSteps = steps.length + 1; // intro + 4 features

onMounted(() => {
  isVisible.value = window.localStorage.getItem(STORAGE_KEY) !== "true";
});

const dismiss = (remember: boolean) => {
  if (remember) {
    window.localStorage.setItem(STORAGE_KEY, "true");
  }
  isVisible.value = false;
};
</script>

<style scoped>
/* Backdrop */
.onboarding__backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.72);
  backdrop-filter: blur(4px);
}

/* Overlay fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Step slide */
.slide-enter-active,
.slide-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.slide-enter-from {
  opacity: 0;
  transform: translateX(16px);
}
.slide-leave-to {
  opacity: 0;
  transform: translateX(-16px);
}

/* Eyebrow */
.onboarding__eyebrow {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--gold);
}

.onboarding__title {
  margin: 0;
  font-family: var(--serif);
  font-size: 1.45rem;
  line-height: 1.2;
  color: var(--text);
}
</style>
