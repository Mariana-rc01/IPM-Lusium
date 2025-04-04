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
      <Alert class="w-[350px]">
        <div class="flex flex-col gap-3">
          <div class="flex items-start gap-2">
            <AlertTriangle class="w-4 h-4 mt-[2px]" />
            <div>
              <AlertTitle class="leading-5">Aviso!</AlertTitle>
              <AlertDescription class="mt-1">
                {{ message }}
              </AlertDescription>
            </div>
          </div>
          <div class="flex justify-end gap-2 mt-2">
            <button
              class="px-3 py-1.5 text-sm rounded-md bg-gray-200 hover:bg-gray-300"
              @click="handleCancel"
            >
              Cancelar
            </button>
            <button
              class="px-3 py-1.5 text-sm rounded-md bg-emerald-500 text-white hover:bg-emerald-600"
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
