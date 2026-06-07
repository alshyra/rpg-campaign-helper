<template>
  <section class="grid gap-6">
    <div class="flex items-center justify-between px-2">
      <h2 class="m-0 font-(family-name:--serif) text-2xl italic text-amber-100">Inventaire</h2>
    </div>

    <InventoryMoneyPanel />
    <InventoryEquipmentPanel />
    <InventoryWeaponsPanel />
    <InventoryArmorPanel />
  </section>
</template>

<script setup lang="ts">
import InventoryMoneyPanel from "./InventoryMoneyPanel.vue";
import InventoryEquipmentPanel from "./InventoryEquipmentPanel.vue";
import InventoryWeaponsPanel from "./InventoryWeaponsPanel.vue";
import InventoryArmorPanel from "./InventoryArmorPanel.vue";
</script>
