<template>
  <div class="grid gap-6">
    <!-- Header avec toggle -->
    <div class="flex items-center justify-between px-2">
      <h2 class="m-0 font-(family-name:--serif) text-2xl italic text-amber-100">Sac à dos</h2>
      <IconButton
        square
        class="rounded-full p-2 transition-all"
        :class="showAddForm ? 'bg-red-500/20 text-red-500 rotate-45' : 'bg-amber-500/10 text-amber-500'"
        @click="showAddForm = !showAddForm"
      >
        <svg
          viewBox="0 0 24 24"
          class="h-6 w-6"
          fill="none"
          stroke="currentColor"
          stroke-width="2.2"
          stroke-linecap="round"
          aria-hidden="true"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      </IconButton>
    </div>

    <!-- Formulaire ajout (collapsible) -->
    <section
      v-if="showAddForm"
      class="grid gap-4 rounded-3xl border border-amber-500/30 bg-stone-900/80 p-6"
    >
      <div class="flex items-center justify-between">
        <h3 class="m-0 text-[10px] font-black uppercase tracking-widest text-amber-400">Nouvel Objet</h3>
        <IconButton
          ghost
          square
          class="h-8 w-8 p-0 text-stone-500 hover:text-white"
          @click="showAddForm = false"
        >
          <svg
            viewBox="0 0 24 24"
            class="h-4 w-4"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            aria-hidden="true"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </IconButton>
      </div>
      <FormField
        v-model="draft.name"
        placeholder="Nom..."
        class="inventory-field"
      />
      <FormField
        v-model="draft.details"
        placeholder="Détails (poids, effet...)"
        class="inventory-field"
      />
      <Button
        variant="primary"
        class="w-full gap-2 py-3 font-black text-black transition-all hover:bg-amber-500 active:scale-[0.98]"
        @click="submitItem"
      >
        <svg
          viewBox="0 0 24 24"
          class="h-5 w-5"
          fill="none"
          stroke="currentColor"
          stroke-width="2.2"
          stroke-linecap="round"
          aria-hidden="true"
        >
          <path
            d="M21 16V8a2 2 0 0 0-1-1.73L13 2.27a2 2 0 0 0-2 0L4 6.27A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73L11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
          />
          <path d="M12 8v4M12 16h.01" />
        </svg>
        AJOUTER AU SAC
      </Button>
    </section>

    <!-- État vide -->
    <div
      v-if="items.length === 0"
      class="rounded-3xl border-2 border-dashed border-white/5 py-12 text-center text-stone-600"
    >
      <svg
        viewBox="0 0 24 24"
        class="mx-auto mb-2 h-12 w-12 opacity-20"
        fill="none"
        stroke="currentColor"
        stroke-width="1.2"
        stroke-linecap="round"
        aria-hidden="true"
      >
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <path d="M3 6h18M16 10a4 4 0 0 1-8 0" />
      </svg>
      <p class="text-sm italic">Le sac est vide...</p>
    </div>

    <!-- Liste des objets -->
    <section class="grid gap-3">
      <div
        v-for="item in items"
        :key="item.id"
        class="flex items-center justify-between rounded-2xl border border-white/5 bg-stone-900/40 p-4"
      >
        <div class="flex-1">
          <h4 class="m-0 font-bold text-amber-100">{{ item.name }}</h4>
          <p
            v-if="item.details"
            class="m-0 mt-0.5 text-[10px] uppercase tracking-tighter text-stone-500"
          >
            {{ item.details }}
          </p>
        </div>
        <!-- Contrôle quantité -->
        <div class="flex items-center gap-1 rounded-xl border border-white/5 bg-black/40 p-1">
          <IconButton
            square
            class="h-8 w-8 rounded-lg border-transparent bg-transparent p-0 text-stone-400 transition-all hover:bg-white/5"
            :class="item.quantity === 1 ? 'hover:text-red-500' : 'hover:text-red-400'"
            @click="decrement(item)"
          >
            <!-- Trash si qty=1, Minus sinon -->
            <svg
              v-if="item.quantity === 1"
              viewBox="0 0 24 24"
              class="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              aria-hidden="true"
            >
              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            <svg
              v-else
              viewBox="0 0 24 24"
              class="h-4 w-4"
              fill="none"
              stroke="currentColor"
              stroke-width="2.2"
              stroke-linecap="round"
              aria-hidden="true"
            >
              <path d="M5 12h14" />
            </svg>
          </IconButton>
          <span class="w-8 text-center font-mono font-black text-amber-500">{{ item.quantity }}</span>
          <IconButton
            square
            class="h-8 w-8 rounded-lg border-transparent bg-transparent p-0 text-stone-400 transition-all hover:bg-white/5 hover:text-emerald-500"
            @click="emit('quantity', item.id, item.quantity + 1)"
          >
            <svg
              viewBox="0 0 24 24"
              class="h-4 w-4"
              fill="none"
              stroke="currentColor"
              stroke-width="2.2"
              stroke-linecap="round"
              aria-hidden="true"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </IconButton>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";

import type { InventoryItem } from "../../types/character";
import Button from "../ui/Button.vue";
import FormField from "../ui/FormField.vue";
import IconButton from "../ui/IconButton.vue";

defineProps<{
  items: InventoryItem[];
}>();

const emit = defineEmits<{
  add: [item: Omit<InventoryItem, "id">];
  remove: [id: string];
  quantity: [id: string, quantity: number];
}>();

const showAddForm = ref(false);

const draft = reactive({
  name: "",
  details: "",
  quantity: 1,
});

const submitItem = () => {
  if (!draft.name.trim()) {
    return;
  }

  emit("add", {
    name: draft.name.trim(),
    details: draft.details.trim(),
    quantity: Math.max(1, draft.quantity),
  });

  draft.name = "";
  draft.details = "";
  showAddForm.value = false;
};

const decrement = (item: InventoryItem) => {
  if (item.quantity <= 1) {
    emit("remove", item.id);
    return;
  }

  emit("quantity", item.id, item.quantity - 1);
};
</script>

<style scoped>
.inventory-field :deep(input) {
  border-color: rgb(255 255 255 / 0.1);
  background: rgb(0 0 0 / 0.6);
  color: rgb(254 243 199 / 1);
  padding: 0.75rem 1rem;
}

.inventory-field :deep(input)::placeholder {
  color: rgb(87 83 78 / 1);
}

.inventory-field :deep(input:focus) {
  border-color: rgb(245 158 11 / 1);
  outline: none;
}
</style>
