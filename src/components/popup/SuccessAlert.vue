<script setup lang="ts">
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Rocket } from 'lucide-vue-next'
import { onClickOutside } from '@vueuse/core'
import { ref, onMounted } from 'vue'

const props = defineProps({
    message: {
        type: String,
        required: true
    }
})

const emit = defineEmits(['close'])
const alertRef = ref(null)
const isClosing = ref(false)

onMounted(() => {
    setTimeout(() => {
        closeWithAnimation()
    }, 5000)
})

onClickOutside(alertRef, () => {
    closeWithAnimation()
})

function closeWithAnimation() {
    isClosing.value = true
    setTimeout(() => {
        emit('close')
    }, 500)
}
</script>

<style>
.slide-right-enter-active, .slide-right-leave-active {
  transition: transform 0.5s ease-in-out, opacity 0.5s ease-in-out;
}

.slide-right-enter-from, .slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>

<template>
  <transition name="slide-right">
    <div v-if="!isClosing" ref="alertRef" class="fixed bottom-4 right-4 z-50">
      <Alert class="cursor-pointer" @click="closeWithAnimation">
        <div class="flex items-start gap-2">
          <Rocket class="w-4 h-4" />
          <div>
            <AlertTitle class="leading-5">Sucesso!</AlertTitle>
            <AlertDescription class="mt-1 pe-[150px]">
              {{ message }}
            </AlertDescription>
          </div>
        </div>
      </Alert>
    </div>
  </transition>
</template>
