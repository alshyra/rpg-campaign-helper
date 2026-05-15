<template>
  <article class="rounded-2xl border border-white/5 bg-stone-900/40 p-4">
    <div class="mb-3 flex items-center justify-between">
      <h3 class="m-0 text-[10px] font-black uppercase tracking-widest text-amber-500">Compétences</h3>
      <IconButton
        square
        class="rounded-full p-2"
        :class="showForm ? 'bg-red-500/20 text-red-500 rotate-45' : 'bg-amber-500/10 text-amber-500'"
        @click="showForm = !showForm"
      >
        <Plus class="h-5 w-5" :stroke-width="2.2" />
      </IconButton>
    </div>

    <div v-if="showForm" class="mb-4 flex gap-2">
      <FormField v-model="draftName" placeholder="Ex: Focalisation" class="flex-1" @keydown.enter="addSkill" />
      <FormField v-model="draftValue" type="number" placeholder="%" class="w-20" @keydown.enter="addSkill" />
    </div>

    <div v-if="skillEntries.length === 0" class="py-4 text-center text-xs italic text-stone-600">
      Aucune compétence
    </div>

    <div v-else class="grid gap-1">
      <div
        v-for="[name, value] in skillEntries"
        :key="name"
        class="group flex items-center justify-between rounded-xl px-3 py-2 transition-colors hover:bg-white/5"
      >
        <span class="text-sm text-amber-100">{{ name }}</span>
        <div class="flex items-center gap-2">
          <span class="w-8 text-right font-mono font-black text-amber-500">{{ value }}%</span>
          <IconButton
            square
            ghost
            class="h-6 w-6 p-0 text-stone-600 opacity-0 transition-all group-hover:opacity-100 hover:text-red-500!"
            @click="removeSkill(name)"
          >
            <X class="h-3.5 w-3.5" />
          </IconButton>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { Plus, X } from "@lucide/vue"
import { computed, ref } from "vue"

import { useCharacterStore } from "../../../stores/character"
import type { WfrpSystemData } from "../types"
import FormField from "../../../components/ui/FormField.vue"
import IconButton from "../../../components/ui/IconButton.vue"

const characterStore = useCharacterStore()
const systemData = computed(() => characterStore.getSystemData<WfrpSystemData>())

const skillEntries = computed(() => Object.entries(systemData.value?.skills ?? {}))

const showForm = ref(false)
const draftName = ref("")
const draftValue = ref(30)

const addSkill = () => {
  if (!draftName.value.trim()) return
  const current = systemData.value?.skills ?? {}
  characterStore.updateSystemData<WfrpSystemData>({
    skills: { ...current, [draftName.value.trim()]: Number(draftValue.value) },
  })
  draftName.value = ""
  draftValue.value = 30
  showForm.value = false
}

const removeSkill = (name: string) => {
  const current = { ...(systemData.value?.skills ?? {}) }
  delete current[name]
  characterStore.updateSystemData<WfrpSystemData>({ skills: current })
}
</script>
