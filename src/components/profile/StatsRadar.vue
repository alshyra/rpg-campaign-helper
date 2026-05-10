<template>
  <AppCard>
    <div class="radar-card grid place-items-center">
      <svg
        viewBox="0 0 260 260"
        class="radar-chart w-full max-w-80"
        role="img"
        aria-label="Radar des caractéristiques"
      >
        <g transform="translate(130 130)">
          <polygon
            v-for="ring in rings"
            :key="ring"
            :points="ringPoints(ring)"
            class="radar-chart__ring"
          />
          <line
            v-for="axis in axes"
            :key="axis.key"
            x1="0"
            y1="0"
            :x2="axis.x"
            :y2="axis.y"
            class="radar-chart__axis"
          />
          <polygon
            :points="valuePoints"
            class="radar-chart__shape"
          />
          <circle
            v-for="axis in valueAxes"
            :key="axis.key"
            :cx="axis.x"
            :cy="axis.y"
            r="4"
            class="radar-chart__dot"
          />
          <text
            v-for="valueLabel in valueLabels"
            :key="`${valueLabel.key}-value`"
            :x="valueLabel.x"
            :y="valueLabel.y"
            class="radar-chart__value"
          >
            {{ valueLabel.value }}
          </text>
          <text
            v-for="label in labels"
            :key="label.key"
            :x="label.x"
            :y="label.y"
            class="radar-chart__label"
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

const props = defineProps<{
  stats: Stat[];
}>();

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
<style scoped>
.radar-chart__ring,
.radar-chart__axis {
  fill: none;
  stroke: rgba(220, 183, 116, 0.14);
  stroke-width: 1;
}

.radar-chart__shape {
  fill: rgba(210, 160, 51, 0.18);
  stroke: var(--gold);
  stroke-width: 2;
}

.radar-chart__dot {
  fill: var(--gold);
}

.radar-chart__label {
  fill: var(--text-soft);
  font-size: 12px;
  text-anchor: middle;
}

.radar-chart__value {
  fill: var(--gold);
  font-size: 11px;
  font-weight: 700;
  text-anchor: middle;
}
</style>
