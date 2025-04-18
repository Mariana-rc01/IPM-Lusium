<template>
      <div class="border rounded-lg overflow-hidden bg-white">
        <!-- Weekday header -->
        <div class="grid grid-cols-[100px_1fr_1fr_1fr_1fr_1fr] border-b">
          <div class="p-4 border-r"></div>
          <div v-for="day in weekDays" :key="day" class="p-4 text-center font-semibold border-r last:border-r-0">
            {{ day }}
          </div>
        </div>

        <!-- Time grid -->
        <div class="grid grid-cols-[100px_1fr_1fr_1fr_1fr_1fr]">
          <!-- Hour column -->
          <div class="col-start-1 col-end-2">
            <div v-for="hour in hours" :key="hour" class="border-r border-b last:border-b-0 h-[100px] flex items-center justify-center">
              {{ hour }}
            </div>
          </div>

          <!-- Columns for each weekday -->
          <div
            v-for="(day, dayIndex) in weekDays"
            :key="day"
            class="relative border-r last:border-r-0"
          >
            <!-- Hour rows (just to create the grid) -->
            <div v-for="hour in hours" :key="`grid-${day}-${hour}`" class="border-b last:border-b-0 h-[100px]"></div>

            <!-- Class blocks for this day -->
            <div
              v-for="(block, blockIndex) in getBlocksForDay(dayIndex)"
              :key="`${day}-${blockIndex}`"
              class="absolute border border-[#10B981] rounded-md bg-white flex flex-col justify-between"
              :style="getBlockStyle(block)"
            >
              <!-- Centered content -->
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

<script setup lang="ts">

interface OccupancyInfo {
  current: number;
  total: number;
  percentage: number;
}

interface ClassBlock {
  name: string;
  room: string;
  day: number; // 0-4 for Monday-Friday
  startHour: string;
  endHour: string;
  occupancy: OccupancyInfo;
}

interface TimetableProps {
  mode: 'student' | 'teacher';
  blocks: ClassBlock[];
}

const props = withDefaults(defineProps<TimetableProps>(), {
  mode: 'student',
});

const weekDays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
const hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];

// Function to get blocks for a specific day
const getBlocksForDay = (dayIndex: number) => {
  return props.blocks.filter(block => block.day === dayIndex);
};

// Function to calculate the position and size of a block based on start and end hours
const getBlockStyle = (block: ClassBlock) => {
  const startIndex = hours.indexOf(block.startHour);
  const endIndex = hours.indexOf(block.endHour);

  if (startIndex === -1 || endIndex === -1) {
    console.error(`Invalid hour for block ${block.name}`);
    return {};
  }

  const top = startIndex * 100;
  const height = (endIndex - startIndex) * 100;

  const overlappingBlocks = props.blocks.filter(b => {
    if (b.day !== block.day) return false;

    const bStart = hours.indexOf(b.startHour);
    const bEnd = hours.indexOf(b.endHour);

    return (
      (startIndex < bEnd && endIndex > bStart)
    );
  });

  const sortedBlocks = overlappingBlocks.sort((a, b) => a.startHour.localeCompare(b.startHour));

  const indexInOverlap = sortedBlocks.findIndex(b => b.name === block.name && b.room === block.room);
  const blockWidth = 100 / overlappingBlocks.length;
  const width = `calc(${blockWidth}% - 4px)`;
  const left = `calc(${indexInOverlap * blockWidth}%)`;

  return {
    top: `${top}px`,
    height: `${height}px`,
    width,
    left,
  };
};

</script>
