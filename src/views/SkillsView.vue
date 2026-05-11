<template>
  <div class="stack-xl grid gap-6">
    <NoCharacterEmpty v-if="!character" />
    <template v-else>
      <div class="flex items-center justify-between px-2">
        <h2 class="m-0 font-(family-name:--serif) text-2xl italic text-amber-100">Compétences</h2>
        <IconButton
          square
          class="rounded-full p-2 transition-all"
          :class="showForm ? 'bg-red-500/20 text-red-500 rotate-45' : 'bg-amber-500/10 text-amber-500'"
          @click="toggleForm"
        >
          <Plus class="h-6 w-6" :stroke-width="2.2" />
        </IconButton>
      </div>

      <section
        v-if="showForm"
        class="grid gap-4 rounded-3xl border border-amber-500/30 bg-stone-900/80 p-6"
      >
        <h3 class="m-0 text-[10px] font-black uppercase tracking-widest text-amber-400">
          {{ editingSkill ? "Modifier une compétence" : "Nouvelle compétence" }}
        </h3>
        <FormField
          v-model="draft.name"
          label="Nom"
          placeholder="Ex: Pistage"
        />
        <FormField
          v-model="draft.category"
          label="Catégorie"
          placeholder="Ex: Exploration"
        />
        <StatsStepper
          :model-value="draft.value"
          label="Valeur"
          :min="0"
          :max="10"
          @update:model-value="(v) => (draft.value = Number(v))"
        />
        <div class="grid grid-cols-2 gap-2.5 max-[420px]:grid-cols-1">
          <Button
            variant="secondary"
            type="button"
            @click="closeForm"
          >
            Annuler
          </Button>
          <Button
            variant="primary"
            type="button"
            @click="saveSkill"
          >
            {{ editingSkill ? "Enregistrer" : "Ajouter" }}
          </Button>
        </div>
      </section>

      <div
        v-if="skills.length === 0"
        class="rounded-3xl border-2 border-dashed border-white/5 py-12 text-center text-stone-600"
      >
        <Swords class="mx-auto mb-2 h-12 w-12 opacity-20" :stroke-width="1.2" />
        <p class="text-sm italic">Aucune compétence... Ouvre le formulaire pour en ajouter.</p>
      </div>

      <section class="grid gap-3">
        <article
          v-for="skill in skills"
          :key="skill.id"
          class="grid grid-cols-[1fr_auto] items-center gap-3 rounded-2xl border border-white/5 bg-stone-900/40 p-4"
        >
          <div>
            <h4 class="m-0 font-bold text-amber-100">{{ skill.name || "Compétence" }}</h4>
            <p class="m-0 mt-0.5 text-[10px] uppercase tracking-tighter text-stone-500">{{ skill.category || "Général" }}</p>
          </div>
          <div class="flex items-center gap-2">
            <strong class="rounded-lg border border-amber-500/25 bg-black/30 px-3 py-1.5 font-mono text-lg font-black text-amber-500">
              {{ skill.value > 0 ? `+${skill.value}` : skill.value }}
            </strong>
            <IconButton
              square
              class="h-8 w-8 rounded-lg border-transparent bg-transparent p-0 text-stone-400 transition-all hover:bg-white/5 hover:text-amber-400"
              @click="editSkill(skill)"
              aria-label="Modifier la compétence"
            >
              <Pencil class="h-4 w-4" :stroke-width="2" />
            </IconButton>
            <IconButton
              square
              class="h-8 w-8 rounded-lg border-transparent bg-transparent p-0 text-stone-400 transition-all hover:bg-white/5 hover:text-red-500"
              @click="deleteSkill(skill.id)"
              aria-label="Supprimer la compétence"
            >
              <Trash2 class="h-4 w-4" :stroke-width="2" />
            </IconButton>
          </div>
        </article>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { Pencil, Plus, Swords, Trash2 } from "@lucide/vue";
import { storeToRefs } from "pinia";
import { computed, reactive, ref } from "vue";

import NoCharacterEmpty from "../components/character/NoCharacterEmpty.vue";
import Button from "../components/ui/Button.vue";
import FormField from "../components/ui/FormField.vue";
import IconButton from "../components/ui/IconButton.vue";
import StatsStepper from "../components/ui/StatStepper.vue";
import { useCharacterStore } from "../stores/character";
import type { Skill } from "../types/character";

const characterStore = useCharacterStore();
const { state } = storeToRefs(characterStore);

const character = computed(() => state.value);
const skills = computed(() => state.value?.skills ?? []);

const showForm = ref(false);
const editingSkill = ref<Skill | null>(null);

const draft = reactive({
  name: "",
  category: "",
  value: 0,
});

const resetDraft = () => {
  draft.name = "";
  draft.category = "";
  draft.value = 0;
};

const toggleForm = () => {
  if (showForm.value) {
    closeForm();
    return;
  }
  showForm.value = true;
};

const closeForm = () => {
  showForm.value = false;
  editingSkill.value = null;
  resetDraft();
};

const editSkill = (skill: Skill) => {
  draft.name = skill.name;
  draft.category = skill.category;
  draft.value = skill.value;
  editingSkill.value = skill;
  showForm.value = true;
};

const saveSkill = () => {
  const payload = {
    name: draft.name.trim(),
    category: draft.category.trim(),
    value: Math.max(0, Math.min(10, Number(draft.value))),
  };

  if (!payload.name) {
    return;
  }

  if (editingSkill.value) {
    characterStore.updateSkill(editingSkill.value.id, payload);
  } else {
    characterStore.addSkill(payload);
  }

  closeForm();
};

const deleteSkill = (id: string) => {
  const confirmed = window.confirm("Supprimer cette compétence ?");
  if (confirmed) {
    characterStore.removeSkill(id);
  }
};
</script>
