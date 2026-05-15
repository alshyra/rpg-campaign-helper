<template>
  <div class="profile-section">
    <NoCharacterEmpty v-if="!character" />

    <template v-else>
      <section class="profile-section__layout grid grid-row-3 gap-2.5">
        <article class="profile-identity rounded-2xl p-2.5">
          <div class="profile-identity__hero">
            <div class="profile-identity__avatar-shell">
              <div class="profile-identity__avatar">
                <img
                  v-if="character.profile.avatarDataUrl"
                  :src="character.profile.avatarDataUrl"
                  :alt="`Portrait de ${character.profile.characterName || 'personnage'}`"
                />
                <span v-else>{{ (character.profile.characterName || "?").slice(0, 1).toUpperCase() }}</span>
              </div>
            </div>

            <StatsRadar
              class="profile-identity__radar"
              :stats="character.stats"
            />

            <section class="profile-identity__mobile-table" aria-label="Caractéristiques">
              <ul class="profile-identity__mobile-grid">
                <li
                  v-for="stat in character.stats"
                  :key="`mobile-${stat.key}`"
                  class="profile-identity__mobile-item"
                >
                  <span class="profile-identity__mobile-label">{{ stat.label }}</span>
                  <strong class="profile-identity__mobile-value">{{ stat.value >= 0 ? `+${stat.value}` : stat.value }}</strong>
                </li>
              </ul>
            </section>
          </div>
        </article>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia"
import { computed } from "vue"

import NoCharacterEmpty from "../../../components/character/NoCharacterEmpty.vue"
import StatsRadar from "../../../components/profile/StatsRadar.vue"
import { useCharacterStore } from "../../../stores/character"

const characterStore = useCharacterStore()
const { state } = storeToRefs(characterStore)

const character = computed(() => state.value)
</script>

<style scoped>
.profile-section {
  min-height: calc(100dvh - 12.5rem);
}

.profile-section__layout {
  align-content: start;
  align-items: start;
  grid-auto-rows: max-content;
}

.profile-identity__hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: stretch;
  gap: 10px;
}

.profile-identity__avatar-shell {
  min-width: 0;
}

.profile-identity__avatar {
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 24px;
  overflow: hidden;
  background: radial-gradient(circle at 30% 25%, rgba(170, 96, 29, 0.55), rgba(56, 33, 20, 0.72));
  color: #fcd98e;
  display: grid;
  place-items: center;
  font-family: var(--serif);
  font-size: 1.7rem;
  font-weight: 700;
  box-shadow: inset 0 0 0 1px rgba(255, 210, 140, 0.12), 0 10px 18px rgba(0, 0, 0, 0.35);
}

.profile-identity__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.profile-identity__radar {
  min-width: 0;
  aspect-ratio: 1 / 1;
}

.profile-identity__radar :deep(.app-card) {
  width: 100%;
  height: 100%;
  padding: 0.6rem;
}

.profile-identity__radar :deep(.radar-chart) {
  max-width: 90%;
}

.profile-identity__mobile-table {
  display: none;
}

.profile-identity__mobile-title {
  margin: 0 0 6px;
  font-size: 0.62rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-soft);
}

.profile-identity__mobile-grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 6px;
}

.profile-identity__mobile-item {
  border: 1px solid rgba(221, 187, 123, 0.3);
  border-radius: 10px;
  background: linear-gradient(180deg, rgba(96, 61, 38, 0.56), rgba(54, 32, 20, 0.62));
  box-shadow:
    inset 0 0 0 1px rgba(221, 187, 123, 0.2),
    0 3px 10px rgba(0, 0, 0, 0.18);
  padding: 5px 6px;
  display: grid;
  gap: 1px;
}

.profile-identity__mobile-label {
  display: block;
  font-size: 0.62rem;
  color: var(--text-soft);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-align: center;
  line-height: 1;
}

.profile-identity__mobile-value {
  display: block;
  font-family: var(--serif);
  font-size: 1.02rem;
  font-weight: 700;
  color: var(--gold);
  line-height: 1;
  text-align: center;
}

@media (max-width: 640px) {
  .profile-section__layout {
    gap: 0;
  }

  .profile-identity__hero {
    grid-template-columns: 1.55fr 0.45fr;
    gap: 6px;
    align-items: stretch;
  }

  .profile-identity__radar {
    display: none;
  }

  .profile-identity__avatar-shell {
    min-width: 0;
  }

  .profile-identity__avatar {
    aspect-ratio: 6 / 5;
  }

  .profile-identity__mobile-table {
    display: block;
    min-width: 0;
    border-radius: 12px;
    background: rgba(24, 17, 13, 0.42);
    padding: 4px;
  }

  .profile-identity__mobile-grid {
    grid-template-columns: 1fr;
    gap: 3px;
    justify-items: center;
  }

  .profile-identity__mobile-item {
    padding: 3px 5px;
    width: 84%;
    max-width: 5.6rem;
  }
}
</style>
