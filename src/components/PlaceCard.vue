<script setup lang="ts">
import type { PlaceCard } from '@/types';

const { card } = defineProps<{ card: PlaceCard }>();

const convertKeyIntoName = (key: string) => {
  switch (key) {
    case 'placeName':
      return 'Назва';
    case 'state':
      return 'Область';
    case 'country':
      return 'Країна';
    case 'district':
      return 'Регіон';
    case 'municipality':
      return 'Муніципалітет';
    case 'licence':
      return 'Ліцензія';
    default:
      return 'Назва';
  }
};
</script>
<template>
  <div class="rounded-xl border bg-background p-6 shadow-sm w-full max-w-md space-y-4">
    <h2 class="text-xl font-semibold tracking-tight">Інформація про населений пункт</h2>
    <ul class="space-y-2 text-sm text-muted-foreground">
      <template
        v-for="(value, key) in card"
        :key="key">
        <li v-if="value">
          <span class="font-medium text-foreground capitalize">
            {{ convertKeyIntoName(key) }}:
          </span>
          <span class="ml-2">{{ value }}</span>
        </li>
      </template>
    </ul>
  </div>
</template>
