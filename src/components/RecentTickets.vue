<script setup lang="ts">
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
</script>

<template>
  <div class="space-y-8">
    <div class="flex items-center">
      <Avatar class="h-9 w-9">
        <AvatarImage src="/avatars/01.png" alt="Avatar" />
        <AvatarFallback>AS</AvatarFallback>
      </Avatar>
      <div class="ml-4 space-y-1">
        <p class="text-sm font-medium leading-none text-emerald-900">
          Afonso Dionísio Santos
        </p>
        <p class="text-sm text-muted-foreground">
          a104276@alunos.uminho.pt
        </p>
      </div>
      <div class="ml-auto font-medium">
        23/02/2025
      </div>
    </div>
    <div class="flex items-center">
      <Avatar class="flex h-9 w-9 items-center justify-center space-y-0 border">
        <AvatarImage src="/avatars/02.png" alt="Avatar" />
        <AvatarFallback>AP</AvatarFallback>
      </Avatar>
      <div class="ml-4 space-y-1">
        <p class="text-sm font-medium leading-none text-emerald-900">
          Ana Margarida Campos Pires
        </p>
        <p class="text-sm text-muted-foreground">
          a96060@alunos.uminho.pt
        </p>
      </div>
      <div class="ml-auto font-medium">
        23/02/2025
      </div>
    </div>
    <div class="flex items-center">
      <Avatar class="h-9 w-9">
        <AvatarImage src="/avatars/03.png" alt="Avatar" />
        <AvatarFallback>JC</AvatarFallback>
      </Avatar>
      <div class="ml-4 space-y-1">
        <p class="text-sm font-medium leading-none text-emerald-900">
          José Francisco Creissac Freitas Campos
        </p>
        <p class="text-sm text-muted-foreground">
          jfc@di.uminho.pt
        </p>
      </div>
      <div class="ml-auto font-medium">
        22/02/2025
      </div>
    </div>
    <div class="flex items-center">
      <Avatar class="h-9 w-9">
        <AvatarImage src="/avatars/04.png" alt="Avatar" />
        <AvatarFallback>PP</AvatarFallback>
      </Avatar>
      <div class="ml-4 space-y-1">
        <p class="text-sm font-medium leading-none text-emerald-900">
          Pedro Figueiredo Pereira
        </p>
        <p class="text-sm text-muted-foreground">
          a104082@alunos.uminho.pt
        </p>
      </div>
      <div class="ml-auto font-medium">
        22/02/2025
      </div>
    </div>
    <div class="flex items-center">
      <Avatar class="h-9 w-9">
        <AvatarImage src="/avatars/05.png" alt="Avatar" />
        <AvatarFallback>OB</AvatarFallback>
      </Avatar>
      <div class="ml-4 space-y-1">
        <p class="text-sm font-medium leading-none text-emerald-900">
          Orlando Manuel Oliveira Belo
        </p>
        <p class="text-sm text-muted-foreground">
          obelo@di.uminho.pt
        </p>
      </div>
      <div class="ml-auto font-medium">
        21/02/2025
      </div>
    </div>
  </div>
</template>