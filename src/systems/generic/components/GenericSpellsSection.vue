<template>
  <div class="stack-xl grid gap-6">
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

    <section
      v-if="showAddForm"
      class="grid gap-4 rounded-3xl border border-amber-500/30 bg-stone-900/80 p-6"
    >
      <div class="flex items-center justify-between">
        <h3 class="m-0 text-[10px] font-black uppercase tracking-widest text-amber-400">
          {{ editingSpell?.id ? "Modifier le sort" : "Nouveau sort" }}
        </h3>
        <IconButton
          ghost
          square
          class="h-8 w-8 p-0 text-stone-500 hover:text-white"
          @click="closeForm"
        >
          <X class="h-4 w-4" :stroke-width="2" />
        </IconButton>
      </div>

      <form class="grid gap-3" @submit.prevent="saveSpell">
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
          {{ editingSpell?.id ? "METTRE À JOUR" : "AJOUTER AU GRIMOIRE" }}
        </Button>
      </form>
    </section>

    <div
      v-if="spells.length === 0"
      class="rounded-3xl border-2 border-dashed border-white/5 py-12 text-center text-stone-600"
    >
      <Wand2 class="mx-auto mb-2 h-12 w-12 opacity-20" :stroke-width="1.2" />
      <p class="text-sm italic">Aucun sort... Lance le formulaire pour en ajouter un.</p>
    </div>

    <div
      v-else
      class="grid gap-3"
    >
      <article
        v-for="spell in spells"
        :key="spell.id"
        class="group rounded-2xl border border-white/5 bg-stone-900/40 p-5 transition-all hover:border-amber-500/30 hover:bg-stone-800/60"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1">
            <div class="flex items-baseline gap-2">
              <h4 class="m-0 text-lg font-bold text-amber-100 group-hover:text-amber-400">
                {{ spell.name }}
              </h4>
              <span class="text-xs text-stone-500">{{ spell.school }}</span>
            </div>
            <p class="m-0 mt-2 leading-relaxed text-(--text-soft)">
              {{ spell.description }}
            </p>
          </div>

          <div class="flex gap-2 shrink-0">
            <IconButton
              type="button"
              ghost
              square
              :size="16"
              @click="editSpell(spell)"
              aria-label="Modifier le sort"
            >
              <Pencil class="h-4 w-4" :stroke-width="1.8" />
            </IconButton>
            <IconButton
              type="button"
              ghost
              square
              :size="16"
              @click="deleteSpell(spell.id)"
              aria-label="Supprimer le sort"
            >
              <Trash2 class="h-4 w-4" :stroke-width="1.8" />
            </IconButton>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Pencil, Plus, Trash2, Wand2, X } from "@lucide/vue"
import { computed, reactive, ref } from "vue"

import { useCharacterStore } from "../../../stores/character"
import type { Spell } from "../../../types/character"
import type { GenericSystemData } from "../types"
import Button from "../../../components/ui/Button.vue"
import FormField from "../../../components/ui/FormField.vue"
import IconButton from "../../../components/ui/IconButton.vue"

const characterStore = useCharacterStore()
const systemData = computed(() => characterStore.getSystemData<GenericSystemData>())

const spells = computed(() => systemData.value?.spells ?? [])

const showAddForm = ref(false)
const editingSpell = ref<Spell | null>(null)

const form = reactive({
  name: "",
  school: "",
  description: "",
})

const makeId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 10)}`

const editSpell = (spell: Spell) => {
  form.name = spell.name
  form.school = spell.school
  form.description = spell.description
  editingSpell.value = spell
  showAddForm.value = true
}

const closeForm = () => {
  showAddForm.value = false
  editingSpell.value = null
  form.name = ""
  form.school = ""
  form.description = ""
}

const saveSpell = () => {
  if (!form.name.trim() || !form.school.trim() || !form.description.trim()) return

  const payload = {
    name: form.name.trim(),
    school: form.school.trim(),
    description: form.description.trim(),
  }

  const current = systemData.value?.spells ?? []

  if (editingSpell.value) {
    characterStore.updateSystemData<GenericSystemData>({
      spells: current.map((s) => (s.id === editingSpell.value!.id ? { ...s, ...payload } : s)),
    })
  } else {
    characterStore.updateSystemData<GenericSystemData>({
      spells: [{ ...payload, id: makeId("spell") }, ...current],
    })
  }

  closeForm()
}

const deleteSpell = (id: string) => {
  const confirmed = window.confirm("Supprimer ce sort ?")
  if (confirmed) {
    const current = systemData.value?.spells ?? []
    characterStore.updateSystemData<GenericSystemData>({
      spells: current.filter((s) => s.id !== id),
    })
  }
}
</script>
