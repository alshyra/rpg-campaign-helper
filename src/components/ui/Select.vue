<template>
  <div class="select-wrapper relative" ref="wrapperRef">
    <button
      type="button"
      class="select-trigger flex w-full items-center justify-between gap-2 px-3 py-2 text-left"
      :class="triggerClass"
      @click="toggle"
      @keydown.enter.prevent="toggle"
      @keydown.space.prevent="toggle"
      @keydown.escape="close"
      :aria-expanded="open"
      :aria-label="label"
    >
      <span v-if="selectedLabel" class="text-xs text-amber-200">{{ selectedLabel }}</span>
      <span v-else class="text-xs text-stone-500">{{ placeholder || '— Choisir —' }}</span>
      <svg
        class="h-3 w-3 transition-transform duration-200"
        :class="open ? 'rotate-180' : ''"
        viewBox="0 0 10 6"
        fill="none"
      >
        <path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
    <div v-if="open" class="select-dropdown absolute left-0 right-0 z-50 mt-1 overflow-hidden rounded-lg border" :class="dropdownClass">
        <button
          v-for="opt in options"
          :key="opt.value"
          type="button"
          class="select-option w-full px-3 py-2 text-left text-xs transition-colors"
          :class="modelValue === opt.value ? 'bg-amber-950/50 text-amber-300' : 'text-stone-400 hover:bg-white/5 hover:text-amber-200'"
          @click="select(opt.value)"
          @keydown.enter.prevent="select(opt.value)"
        >
          {{ opt.label }}
        </button>
      </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue"

defineOptions({ inheritAttrs: false })

export interface SelectOption {
  value: string
  label: string
}

const props = withDefaults(
  defineProps<{
    modelValue?: string
    options?: SelectOption[]
    placeholder?: string
    label?: string
    triggerClass?: string
    dropdownClass?: string
  }>(),
  {
    modelValue: "",
    options: () => [],
    placeholder: "",
    label: "",
    triggerClass: "",
    dropdownClass: "border-white/10 bg-stone-900",
  },
)

const emit = defineEmits<{
  "update:modelValue": [value: string]
}>()

const open = ref(false)
const wrapperRef = ref<HTMLElement | null>(null)

const selectedLabel = computed(() => {
  const opt = props.options.find(o => o.value === props.modelValue)
  return opt ? opt.label : ""
})

const toggle = () => {
  open.value = !open.value
}

const close = () => {
  open.value = false
}

const select = (value: string) => {
  emit("update:modelValue", value)
  open.value = false
}

const onClickOutside = (e: MouseEvent) => {
  if (wrapperRef.value && !wrapperRef.value.contains(e.target as Node)) {
    open.value = false
  }
}

watch(open, (val) => {
  if (val) {
    document.addEventListener("click", onClickOutside, { capture: true })
  } else {
    document.removeEventListener("click", onClickOutside, { capture: true })
  }
})
</script>

<style scoped>
.select-trigger {
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.25);
  cursor: pointer;
  font: inherit;
  color: inherit;
}

.select-trigger:hover {
  border-color: rgba(196, 147, 44, 0.3);
  background: rgba(0, 0, 0, 0.35);
}

.select-option {
  cursor: pointer;
  font: inherit;
}

.select-option:hover {
  background: rgba(255, 255, 255, 0.05);
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
