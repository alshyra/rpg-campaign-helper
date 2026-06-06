<template>
  <AppCard v-bind="$attrs">
    <div class="grid h-full place-items-center">
      <svg
        viewBox="0 0 260 260"
        class="w-full"
        :class="compact ? 'max-w-62' : 'max-w-80'"
        role="img"
        aria-label="Radar des caractéristiques"
      >
        <g transform="translate(130 130)">
          <polygon
            v-for="ring in rings"
            :key="ring"
            :points="ringPoints(ring)"
            class="fill-none stroke-[rgba(220,183,116,0.14)] [stroke-width:1]"
          />
          <line
            v-for="axis in axes"
            :key="axis.key"
            x1="0"
            y1="0"
            :x2="axis.x"
            :y2="axis.y"
            class="fill-none stroke-[rgba(220,183,116,0.14)] [stroke-width:1]"
          />
          <polygon
            :points="valuePoints"
            class="fill-[rgba(210,160,51,0.18)] stroke-(--gold) [stroke-width:2]"
          />
          <circle
            v-for="axis in valueAxes"
            :key="axis.key"
            :cx="axis.x"
            :cy="axis.y"
            r="4"
            class="fill-(--gold)"
          />
          <text
            v-for="valueLabel in valueLabels"
            :key="`${valueLabel.key}-value`"
            :x="valueLabel.x"
            :y="valueLabel.y"
            text-anchor="middle"
            class="fill-(--gold) font-bold"
            :class="compact ? 'text-[10px]' : 'text-[11px]'"
          >
            {{ valueLabel.value }}
          </text>
          <text
            v-for="label in labels"
            :key="label.key"
            :x="label.x"
            :y="label.y"
            text-anchor="middle"
            class="fill-(--text-soft)"
            :class="compact ? 'text-[10px]' : 'text-xs'"
          >
            {{ label.label }}
          </text>
        </g>
      </svg>
    </div>
  </AppCard>
</template>

<script setup lang="ts">
import { computed } from "vue";

import type { Stat } from "../../types/character";
import AppCard from "../ui/AppCard.vue";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    stats: Stat[];
    compact?: boolean;
  }>(),
  {
    compact: false,
  },
);

const compact = computed(() => props.compact);

const radius = 76;
const rings = [0.2, 0.4, 0.6, 0.8, 1];

const angleFor = (index: number) => (Math.PI * 2 * index) / props.stats.length - Math.PI / 2;

const pointFor = (index: number, scale: number) => {
  const angle = angleFor(index);
  return {
    x: Math.cos(angle) * radius * scale,
    y: Math.sin(angle) * radius * scale,
  };
};

const ringPoints = (scale: number) =>
  props.stats
    .map((_, index) => {
      const point = pointFor(index, scale);
      return `${point.x},${point.y}`;
    })
    .join(" ");

const normalize = (value: number) => (value + 5) / 10;

const axes = computed(() =>
  props.stats.map((stat, index) => ({
    key: stat.key,
    ...pointFor(index, 1),
  })),
);

const valueAxes = computed(() =>
  props.stats.map((stat, index) => ({
    key: stat.key,
    ...pointFor(index, normalize(stat.value)),
  })),
);

const labels = computed(() =>
  props.stats.map((stat, index) => {
    const point = pointFor(index, 1.22);
    return {
      key: stat.key,
      label: stat.label,
      x: point.x,
      y: point.y,
    };
  }),
);

const formatValue = (value: number) => (value >= 0 ? `+${value}` : `${value}`);

const valueLabels = computed(() =>
  props.stats.map((stat, index) => {
    const labelScale = Math.max(0, Math.min(1.12, normalize(stat.value) + 0.11));
    const point = pointFor(index, labelScale);
    return {
      key: stat.key,
      value: formatValue(stat.value),
      x: point.x,
      y: point.y,
    };
  }),
);

const valuePoints = computed(() =>
  props.stats
    .map((stat, index) => {
      const point = pointFor(index, normalize(stat.value));
      return `${point.x},${point.y}`;
    })
    .join(" "),
);
</script>
<style scoped></style>
