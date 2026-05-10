<template>
  <section class="grid gap-4 rounded-3xl border border-amber-500/30 bg-stone-900/80 p-6">
    <div class="flex items-center justify-between">
      <h3 class="m-0 text-[10px] font-black uppercase tracking-widest text-amber-400">
        {{ spell?.id ? "Modifier le sort" : "Nouveau sort" }}
      </h3>
      <IconButton
        ghost
        square
        class="h-8 w-8 p-0 text-stone-500 hover:text-white"
        @click="$emit('cancel')"
      >
        <X class="h-4 w-4" :stroke-width="2" />
      </IconButton>
    </div>

    <form class="grid gap-3" @submit.prevent="submit">
      <FormField
        v-model="form.name"
        label="Nom du sort"
        placeholder="Ex: Boule de feu"
        required
      />

      <FormField
        v-model="form.school"
        label="École de magie"
        placeholder="Ex: Évocation"
        required
      />

      <FormField
        v-model="form.description"
        label="Description"
        type="textarea"
        placeholder="Détaille les effets du sort..."
        required
      />

      <Button
        type="submit"
        variant="primary"
        class="w-full gap-2 py-3 font-black text-black transition-all hover:bg-amber-500 active:scale-[0.98]"
      >
        <Wand2 class="h-5 w-5" :stroke-width="2.2" />
        {{ spell?.id ? "METTRE À JOUR" : "AJOUTER AU GRIMOIRE" }}
      </Button>
    </form>
  </section>
</template>

<script setup lang="ts">
import { Wand2, X } from "@lucide/vue";
import { reactive, watch } from "vue";

import Button from "../ui/Button.vue";
import FormField from "../ui/FormField.vue";
import IconButton from "../ui/IconButton.vue";
import type { Spell } from "../../types/character";

const props = defineProps<{
  spell?: Spell | null;
}>();

const emit = defineEmits<{
  save: [spell: Spell | Omit<Spell, "id">];
  cancel: [];
}>();

const form = reactive({
  name: "",
  school: "",
  description: "",
});

watch(
  () => props.spell,
  (newSpell) => {
    if (newSpell) {
      form.name = newSpell.name;
      form.school = newSpell.school;
      form.description = newSpell.description;
    } else {
      form.name = "";
      form.school = "";
      form.description = "";
    }
  },
  { immediate: true },
);

const submit = () => {
  if (props.spell?.id) {
    emit("save", {
      id: props.spell.id,
      ...form,
    });
  } else {
    emit("save", form);
  }
};
</script>

<style scoped>
input,
textarea {
  color: inherit;
}
</style>
