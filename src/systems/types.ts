import type { Component } from "vue"

export interface SystemComponents {
  CharacterWizard: Component
  ProfileSection: Component
  HealthSection?: Component
  SkillsSection?: Component
  SpellsSection?: Component
  InventorySection?: Component
  NotesSection?: Component
}

export interface SystemDefinition<S = unknown> {
  id: string
  name: string
  description: string
  components: SystemComponents
  createBlankState: () => S
  migrate?: (data: unknown) => S
}
