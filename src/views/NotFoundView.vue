<template>
    <div class="flex min-h-screen flex-col items-center justify-center bg-white p-4">
      <div class="w-full max-w-md rounded-lg border border-[#e6f7f0] bg-white shadow-lg">
        <div class="rounded-t-lg border-b border-[#e6f7f0] bg-[#00573F] p-4">
          <h2 class="text-xl font-semibold text-white">Página não encontrada</h2>
        </div>
        <div class="p-6">
          <div class="flex flex-col items-center space-y-6 text-center">
            <div class="relative h-48 w-48">
              <div class="absolute bottom-0 left-1/2 h-4 w-16 -translate-x-1/2 transform rounded-full bg-gray-200 opacity-70 blur-sm bounce-shadow"></div>
              <div class="absolute bottom-6 left-1/2 h-24 w-24 -translate-x-1/2 transform rounded-full bg-pink-300 shadow-lg bounce" ref="character">
                <div class="absolute left-3 top-5 h-6 w-6 rounded-full bg-white">
                  <div class="absolute left-1.5 top-1.5 h-3 w-3 rounded-full bg-pink-900" :style="{ transform: `translate(${leftEyeX}px, ${leftEyeY}px)` }"></div>
                </div>
                <div class="absolute right-3 top-5 h-6 w-6 rounded-full bg-white">
                  <div class="absolute left-1.5 top-1.5 h-3 w-3 rounded-full bg-pink-900" :style="{ transform: `translate(${rightEyeX}px, ${rightEyeY}px)` }"></div>
                </div>
                <div class="absolute bottom-7 left-1/2 h-5 w-10 -translate-x-1/2 transform">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 8" width="100%" height="100%">
                    <path d="M2,2 Q12,-2 22,2" fill="none" stroke="#d6409f" stroke-width="1.5" stroke-linecap="round"/>
                  </svg>
                </div>
                <div class="absolute bottom-6 left-3 h-3 w-3 rounded-full bg-pink-400 opacity-60"></div>
                <div class="absolute bottom-6 right-3 h-3 w-3 rounded-full bg-pink-400 opacity-60"></div>
              </div>
            </div>

            <div class="space-y-3">
              <h2 class="text-3xl font-bold text-[#00573F]">Oops! 404</h2>
              <p class="text-gray-600">Parece que estás na página errada!</p>
              <p class="text-[#00573F]">O nosso AImiguinho está a dizer-te olá...</p>
            </div>

            <router-link
              to="/home"
              class="mt-4 inline-flex items-center gap-2 rounded-md bg-[#00573F] px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-[#004030] focus:outline-none focus:ring-2 focus:ring-[#00573F] focus:ring-offset-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="m12 19-7-7 7-7" />
                <path d="M19 12H5" />
              </svg>
              Voltar à página inicial
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </template>

  <script setup>
  import { ref, onMounted } from "vue"

  const leftEyeX = ref(1.5)
  const leftEyeY = ref(1.5)
  const rightEyeX = ref(1.5)
  const rightEyeY = ref(1.5)

  const character = ref(null)

  const trackMouse = (event) => {
    if (!character.value) return

    const characterRect = character.value.getBoundingClientRect()
    const characterCenterX = characterRect.left + characterRect.width / 2
    const characterCenterY = characterRect.top + characterRect.height / 2

    const leftEyeCenterX = characterCenterX - 9
    const leftEyeCenterY = characterCenterY - 7
    const rightEyeCenterX = characterCenterX + 9
    const rightEyeCenterY = characterCenterY - 7

    const mouseX = event.clientX
    const mouseY = event.clientY

    const leftEyeAngle = Math.atan2(mouseY - leftEyeCenterY, mouseX - leftEyeCenterX)
    const rightEyeAngle = Math.atan2(mouseY - rightEyeCenterY, mouseX - rightEyeCenterX)

    const maxRadius = 2.5

    leftEyeX.value = 1.5 + Math.cos(leftEyeAngle) * maxRadius
    leftEyeY.value = 1.5 + Math.sin(leftEyeAngle) * maxRadius
    rightEyeX.value = 1.5 + Math.cos(rightEyeAngle) * maxRadius
    rightEyeY.value = 1.5 + Math.sin(rightEyeAngle) * maxRadius
  }
  onMounted(() => {
    leftEyeX.value = 1.5
    leftEyeY.value = 1.5
    rightEyeX.value = 1.5
    rightEyeY.value = 1.5

    window.addEventListener("mousemove", trackMouse)
  })
  </script>

  <style scoped>
  .bounce {
    animation: bounce 2s infinite;
  }

  @keyframes bounce {
    0%, 100% {
      transform: translateY(0) translateX(-50%);
    }
    50% {
      transform: translateY(-20px) translateX(-50%);
    }
  }

  .bounce-shadow {
    animation: bounce-shadow 2s infinite;
  }

  @keyframes bounce-shadow {
    0%, 100% {
      transform: translateX(-50%) scale(1);
      opacity: 0.7;
    }
    50% {
      transform: translateX(-50%) scale(0.8);
      opacity: 0.5;
    }
  }
  </style>