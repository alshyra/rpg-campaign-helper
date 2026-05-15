<template>
  <article class="rounded-2xl border border-white/5 bg-stone-900/40 p-4">
    <div class="mb-3 flex items-center justify-between">
      <h3 class="m-0 text-[10px] font-black uppercase tracking-widest text-amber-500">Grimoire</h3>
      <IconButton
        square
        class="rounded-full p-2"
        :class="showForm ? 'bg-red-500/20 text-red-500 rotate-45' : 'bg-amber-500/10 text-amber-500'"
        @click="showForm = !showForm"
      >
        <Plus class="h-5 w-5" :stroke-width="2.2" />
      </IconButton>
    </div>

    <div v-if="showForm" class="mb-4 grid gap-2">
      <FormField v-model="draft.name" placeholder="Nom du sort" />
      <FormField v-model="draft.description" type="textarea" placeholder="Description" rows="2" />
      <div class="grid grid-cols-2 gap-2">
        <FormField v-model="draft.difficulty" placeholder="Difficulté" />
        <FormField v-model="draft.ingredients" placeholder="Ingrédients" />
      </div>
      <Button variant="primary" class="w-full py-2 text-sm" @click="addSpell">Ajouter</Button>
    </div>

    <div v-if="spells.length === 0" class="py-4 text-center text-xs italic text-stone-600">
      Aucun sort
    </div>

    <div v-else class="grid gap-2">
      <div v-for="spell in spells" :key="spell.id" class="group rounded-xl border border-white/5 bg-black/30 p-3">
        <div class="flex items-start justify-between gap-2">
          <div>
            <h4 class="m-0 font-bold text-amber-100">{{ spell.name }}</h4>
            <p v-if="spell.difficulty || spell.ingredients" class="m-0 mt-0.5 text-[10px] text-stone-500">
              {{ spell.difficulty ? `Difficulté ${spell.difficulty}` : "" }}{{ spell.difficulty && spell.ingredients ? " · " : "" }}{{ spell.ingredients ? spell.ingredients : "" }}
            </p>
          </div>
          <IconButton square ghost class="h-6 w-6 p-0 text-stone-600 opacity-0 transition-all group-hover:opacity-100 hover:text-red-500!" @click="removeSpell(spell.id)">
            <X class="h-3.5 w-3.5" />
          </IconButton>
        </div>
        <p v-if="spell.description" class="m-0 mt-2 text-xs leading-relaxed text-stone-400">{{ spell.description }}</p>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { Plus, X } from "@lucide/vue"
import { computed, reactive, ref } from "vue"

import { useCharacterStore } from "../../../stores/character"
import type { WfrpSystemData, WfrpSpell } from "../types"
import Button from "../../../components/ui/Button.vue"
import FormField from "../../../components/ui/FormField.vue"
import IconButton from "../../../components/ui/IconButton.vue"

const characterStore = useCharacterStore()
const systemData = computed(() => characterStore.getSystemData<WfrpSystemData>())
const spells = computed(() => systemData.value?.spells ?? [])

const showForm = ref(false)
const draft = reactive({
  name: "", description: "", difficulty: "", ingredients: "",
})

const makeId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 10)}`

const addSpell = () => {
  if (!draft.name.trim()) return
  const current = systemData.value?.spells ?? []
  characterStore.updateSystemData<WfrpSystemData>({
    spells: [...current, {
      id: makeId("spell"),
      name: draft.name.trim(),
      description: draft.description.trim(),
      difficulty: draft.difficulty.trim() || undefined,
      ingredients: draft.ingredients.trim() || undefined,
    }],
  })
  draft.name = ""; draft.description = ""; draft.difficulty = ""; draft.ingredients = ""
  showForm.value = false
}

const removeSpell = (id: string) => {
  const current = systemData.value?.spells ?? []
  characterStore.updateSystemData<WfrpSystemData>({
    spells: current.filter((s) => s.id !== id),
  })
}
</script>
