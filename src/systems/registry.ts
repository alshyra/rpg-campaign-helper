import { computed } from "vue"
import type { ComputedRef, Ref } from "vue"
import type { SystemDefinition } from "./types"

const systems = new Map<string, SystemDefinition>()

export function defineSystem<S>(def: SystemDefinition<S>): SystemDefinition<S> {
  systems.set(def.id, def)
  return def
}

export function getRegisteredSystems(): SystemDefinition[] {
  return Array.from(systems.values())
}

export function useSystemComponents(systemId: Ref<string | null> | ComputedRef<string | null>) {
  const id = computed(() => systemId.value)
  const system = computed(() => {
    const found = systems.get(id.value ?? "generic")
    if (!found) {
      throw new Error(`Système inconnu : ${id.value}`)
    }
    return found
  })
  const components = computed(() => system.value.components)
  return components
}
