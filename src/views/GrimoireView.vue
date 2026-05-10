<template>
  <div class="stack-xl grid gap-6">
    <!-- Header avec toggle -->
    <div class="flex items-center justify-between px-2">
      <h2 class="m-0 font-(family-name:--serif) text-2xl italic text-amber-100">Grimoire</h2>
      <IconButton
        square
        class="rounded-full p-2 transition-all"
        :class="showAddForm ? 'bg-red-500/20 text-red-500 rotate-45' : 'bg-amber-500/10 text-amber-500'"
        @click="showAddForm = !showAddForm"
      >
        <Plus class="h-6 w-6" :stroke-width="2.2" />
      </IconButton>
    </div>

    <!-- Formulaire ajout (collapsible) -->
    <SpellForm
      v-if="showAddForm"
      :spell="editingSpell"
      @save="saveSpell"
      @cancel="closeForm"
    />

    <!-- État vide -->
    <div
      v-if="spells.length === 0"
      class="rounded-3xl border-2 border-dashed border-white/5 py-12 text-center text-stone-600"
    >
      <Wand2 class="mx-auto mb-2 h-12 w-12 opacity-20" :stroke-width="1.2" />
      <p class="text-sm italic">Aucun sort... Lance le formulaire pour en ajouter un.</p>
    </div>

    <!-- Liste des sorts -->
    <SpellsList
      v-else
      :spells="spells"
      @edit="editSpell"
      @delete="deleteSpell"
    />
  </div>
</template>

<script setup lang="ts">
import { Plus, Wand2 } from "@lucide/vue";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";

import SpellForm from "../components/spells/SpellForm.vue";
import SpellsList from "../components/spells/SpellsList.vue";
import IconButton from "../components/ui/IconButton.vue";
import { useCharacterStore } from "../stores/character";
import type { Spell } from "../types/character";

const characterStore = useCharacterStore();
const { state } = storeToRefs(characterStore);

const spells = computed(() => state.value?.spells ?? []);

const showAddForm = ref(false);
const editingSpell = ref<Spell | null>(null);

const editSpell = (spell: Spell) => {
  editingSpell.value = spell;
  showAddForm.value = true;
};

const deleteSpell = (id: string) => {
  const confirmed = window.confirm("Supprimer ce sort ?");
  if (confirmed) {
    characterStore.removeSpell(id);
  }
};

const saveSpell = (spell: Spell | Omit<Spell, "id">) => {
  if ("id" in spell) {
    characterStore.updateSpell(spell.id, {
      name: spell.name,
      school: spell.school,
      description: spell.description,
    });
  } else {
    characterStore.addSpell(spell);
  }
  closeForm();
};

const closeForm = () => {
  showAddForm.value = false;
  editingSpell.value = null;
};
</script>
