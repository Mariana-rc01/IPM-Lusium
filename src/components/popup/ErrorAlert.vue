<script setup lang="ts">
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertTriangle } from 'lucide-vue-next'
import { onClickOutside } from '@vueuse/core'
import { ref } from 'vue'

const props = defineProps({
    message: {
        type: String,
        required: true
    }
})

const emit = defineEmits(['close'])
const alertRef = ref(null)

onClickOutside(alertRef, () => {
    emit('close')
})
</script>

<template>
  <div ref="alertRef" class="fixed bottom-4 right-4 z-50">
    <Alert variant="destructive" class="cursor-pointer" @click="emit('close')">
      <div class="flex items-start gap-2"> <!-- Alteração aqui -->
        <AlertTriangle class="w-4 h-4 mt-[2px]" /> <!-- Ajuste de tamanho e margem -->
        <div>
          <AlertTitle class="leading-5">Erro!</AlertTitle> <!-- Ajuste de line-height -->
          <AlertDescription class="mt-1">
            {{ message }}
          </AlertDescription>
        </div>
      </div>
    </Alert>
  </div>
</template>
