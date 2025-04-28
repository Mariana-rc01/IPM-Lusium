<template>
  <div class="border rounded-lg overflow-hidden bg-white">
    <!-- Weekday header -->
    <div class="grid grid-cols-[100px_1fr_1fr_1fr_1fr_1fr] border-b">
      <div class="p-4 border-r"></div>
      <div
        v-for="day in weekDays"
        :key="day"
        class="p-4 text-center font-semibold border-r last:border-r-0"
      >
        {{ day }}
      </div>
    </div>

    <!-- Time grid -->
    <div class="grid grid-cols-[100px_1fr_1fr_1fr_1fr_1fr]">
      <!-- Hour column -->
      <div class="col-start-1 col-end-2">
        <div
          v-for="hour in hours"
          :key="hour"
          class="border-r border-b last:border-b-0 h-[100px] flex items-center justify-center"
        >
          {{ hour }}
        </div>
      </div>

      <!-- Columns for each weekday -->
      <div
        v-for="(day, dayIndex) in weekDays"
        :key="day"
        class="relative border-r last:border-r-0"
      >
        <!-- Hour rows (grid background) -->
        <div
          v-for="hour in hours"
          :key="`grid-${day}-${hour}`"
          class="border-b last:border-b-0 h-[100px]"
        ></div>

        <!-- Class blocks para este dia -->
        <div
          v-for="(block, idx) in getBlocksForDay(dayIndex)"
          :key="`${day}-${idx}`"
          class="absolute border border-[#10B981] rounded-md bg-white flex flex-col justify-between transition"
          :class="{
            'cursor-pointer hover:shadow-md': isDirector && block.uc && block.shiftName
          }"
          :style="getBlockStyle(block)"
          @click="handleClick(block)"
        >
          <div class="flex flex-col items-center justify-center h-full">
            <div class="text-center font-bold">{{ block.name }}</div>
            <div class="text-center text-sm">{{ block.room }}</div>
            <div class="text-xs text-center mt-2">
              Lotação: {{ block.occupancy.current }} / {{ block.occupancy.total }}
              ({{ block.occupancy.percentage }}%)
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';

interface OccupancyInfo {
  current: number;
  total: number;
  percentage: number;
}

interface ClassBlock {
  uc?: string;
  shiftName?: string;
  name: string;
  room: string;
  day: number;
  startHour: string;
  endHour: string;
  occupancy: OccupancyInfo;
}

export default defineComponent({
  name: 'Timetable',
  props: {
    mode: {
      type: String as () => 'student' | 'teacher',
      default: 'student',
    },
    blocks: {
      type: Array as () => ClassBlock[],
      required: true,
    },
  },
  setup(props) {
    const router = useRouter();
    const userStore = useUserStore();
    const user = userStore.user;

    const isDirector = computed(() => user?.type === 'director');

    const weekDays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
    const hours = [
      '08:00','09:00','10:00','11:00','12:00',
      '13:00','14:00','15:00','16:00','17:00','18:00','19:00'
    ];

    const getBlocksForDay = (dayIndex: number) =>
      props.blocks.filter(b => b.day === dayIndex);

    const getBlockStyle = (block: ClassBlock) => {
      const start = hours.indexOf(block.startHour);
      const end = hours.indexOf(block.endHour);
      if (start < 0 || end < 0) return {};

      const top = start * 100;
      const height = (end - start) * 100;

      const overlapping = props.blocks.filter(b => {
        if (b.day !== block.day) return false;
        const s = hours.indexOf(b.startHour);
        const e = hours.indexOf(b.endHour);
        return start < e && end > s;
      });

      const sorted = overlapping.sort((a, b) =>
        a.startHour.localeCompare(b.startHour)
      );
      const idx = sorted.findIndex(
        b => b.shiftName === block.shiftName && b.room === block.room
      );
      const width = `calc(${100 / overlapping.length}% - 4px)`;
      const left = `calc(${idx * (100 / overlapping.length)}%)`;

      return { top: `${top}px`, height: `${height}px`, width, left };
    };

    const handleClick = (block: ClassBlock) => {
      if (isDirector.value && block.uc && block.shiftName) {
        router.push(`/shifts/${block.uc}/${block.shiftName}`);
      }
    };

    return {
      weekDays,
      hours,
      getBlocksForDay,
      getBlockStyle,
      handleClick,
      isDirector,
    };
  },
});
</script>
