<script setup lang="ts">
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertTriangle } from 'lucide-vue-next'
import { onClickOutside } from '@vueuse/core'
import { ref } from 'vue'

const props = defineProps<{
  message: string
}>()

const emit = defineEmits(['save', 'cancel'])
const alertRef = ref(null)
const isClosing = ref(false)

onClickOutside(alertRef, () => {
  handleCancel()
})

function handleCancel() {
  isClosing.value = true
  setTimeout(() => {
    emit('cancel')
  }, 500)
}

function handleSave() {
  isClosing.value = true
  setTimeout(() => {
    emit('save')
  }, 500)
}
</script>

<template>
  <transition name="slide-right">
    <div v-if="!isClosing" ref="alertRef" class="fixed bottom-4 right-4 z-50">
      <Alert class="w-[500px] min-h-[200px] p-6 border-2 border-red-200">
        <div class="flex flex-col gap-4">
          <div class="flex items-start gap-4">
            <AlertTriangle class="w-8 h-8 text-red-500" />
            <div>
              <AlertTitle class="leading-6 text-lg font-semibold text-red-500">Aviso!</AlertTitle>
              <AlertDescription class="mt-2 text-gray-700">
                {{ message }}
              </AlertDescription>
            </div>
          </div>
          <div class="flex justify-end gap-4 mt-4">
            <button
              class="px-4 py-2 text-sm rounded-md bg-gray-200 hover:bg-gray-300"
              @click="handleCancel"
            >
              Cancelar
            </button>
            <button
              class="px-4 py-2 text-sm rounded-md bg-red-500 text-white hover:bg-emerald-600"
              @click="handleSave"
            >
              Guardar
            </button>
          </div>
        </div>
      </Alert>
    </div>
  </transition>
</template>

<style>
.slide-right-enter-active, .slide-right-leave-active {
  transition: transform 0.5s ease-in-out, opacity 0.5s ease-in-out;
}

.slide-right-enter-from, .slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
