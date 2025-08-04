<script setup lang="ts">
import { Search } from 'lucide-vue-next';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  useSidebar,
} from '@/components/ui/sidebar';
import { Check } from 'lucide-vue-next';
import { cn } from '@/lib/utils';
import {
  Combobox,
  ComboboxAnchor,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxList,
} from '@/components/ui/combobox';
import { ChevronLeft } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';

import { storeToRefs } from 'pinia';
import { usePlacesStore } from '@/stores';
import { useMarkerFocus } from '@/composables';
import { useMapControl } from '@/composables';
import PlaceCard from './PlaceCard.vue';
import { ScrollArea } from '@/components/ui/scroll-area';
import { nextTick, ref, watch } from 'vue';
import { computed } from 'vue';

const { toggleSidebar, isMobile } = useSidebar();
const { places, isMarkerSelected, selectedPlaceInfoCard } = storeToRefs(usePlacesStore());
const { clearSelection } = usePlacesStore();

const { markerFocus } = useMarkerFocus();
const { fitMapToAllMarkers } = useMapControl();

const resetActiveMarker = () => {
  clearSelection();
  fitMapToAllMarkers();

  if (isMobile.value) {
    toggleSidebar();
  }
};

const listRef = ref<HTMLElement | null>(null);
const isOpen = ref(false);
const comboboxListTop = ref<number>(0);

const comboboxListHeight = computed(() => {
  if (comboboxListTop.value > 0) {
    const percentage = Math.floor(100 - (comboboxListTop.value / window.innerHeight) * 100 - 2.5);
    return { maxHeight: `${percentage}vh` };
  }

  return { maxHeight: '75vh' };
});

watch(isOpen, async (value) => {
  if (value) {
    await nextTick();
    requestAnimationFrame(() => {
      const rectlistRef = listRef.value?.getBoundingClientRect();
      if (rectlistRef) {
        comboboxListTop.value = rectlistRef.top;
      }
    });
  }
});
</script>

<template>
  <Sidebar>
    <SidebarContent class="justify-between">
      <SidebarGroup v-if="isMarkerSelected && selectedPlaceInfoCard">
        <PlaceCard :card="selectedPlaceInfoCard" />
      </SidebarGroup>
      <SidebarGroup v-if="!isMarkerSelected">
        <SidebarGroupLabel class="font-bold">Cities</SidebarGroupLabel>
        <!-- combobox -->
        <SidebarGroupContent>
          <Combobox
            v-model:open="isOpen"
            by="label">
            <ComboboxAnchor class="w-full">
              <div class="relative w-full max-w-sm items-center">
                <ComboboxInput
                  class="pl-2"
                  :display-value="(val) => val?.label ?? ''"
                  placeholder="Select city..." />
                <span class="absolute start-0 inset-y-0 flex items-center justify-center px-3">
                  <Search class="size-4 text-muted-foreground" />
                </span>
              </div>
            </ComboboxAnchor>

            <ComboboxList>
              <div
                ref="listRef"
                class="absolute"
                style="visibility: hidden; pointer-events: none"></div>
              <ComboboxEmpty> Місце не знайдено. </ComboboxEmpty>
              <ScrollArea
                :style="comboboxListHeight"
                class="p-0 rounded-md border overflow-y-auto">
                <ComboboxGroup class="">
                  <ComboboxItem
                    v-for="place in places"
                    :key="place.id"
                    :value="place"
                    @click="markerFocus(place)">
                    {{ place.placeName }}

                    <ComboboxItemIndicator>
                      <Check :class="cn('ml-auto h-4 w-4')" />
                    </ComboboxItemIndicator>
                  </ComboboxItem>
                </ComboboxGroup>
              </ScrollArea>
            </ComboboxList>
          </Combobox>
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarGroup v-if="isMarkerSelected">
        <Button
          class="w-full cursor-pointer"
          variant="outline"
          size="icon"
          @click="resetActiveMarker">
          <ChevronLeft class="w-4 h-4" /><span>Назад</span>
        </Button>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
</template>
