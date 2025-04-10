<script setup lang="ts">
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from '@/components/ui/button'
</script>

<template>
    <div class="container mx-auto p-4 max-w-7xl">
        <div class="w-full grid grid-cols-1 lg:grid-cols-5">
            <h1 class="col-span-1 text-2xl text-center font-bold mb-12 lg:mb-1">Perfil</h1>
            <div class="col-span-4 flex-1 flex justify-center">
                <div class="grid grid-cols-1 lg:grid-cols-2 grid-rows-5 gap-10">
                    <div class="flex items-start row-span-2 gap-10">
                        <div class="flex flex-col items-start gap-3">
                            <h1 class="text-xl font-bold text-emerald-500">Nome</h1>
                            <h1 class="text-xl font-bold text-emerald-500">Email</h1>
                            <h1 class="text-xl font-bold text-emerald-500">Idade</h1>
                            <h1 class="text-xl font-bold text-emerald-500">Localização</h1>
                            <h1 class="text-xl font-bold text-emerald-500">Profissão</h1>
                        </div>
                        <div class="flex flex-col items-start gap-3">
                            <h1 class="text-xl">João Costa Ferreira</h1>
                            <h1 class="text-xl">a96862@alunos.uminho.pt</h1>
                            <h1 class="text-xl">18 anos</h1>
                            <h1 class="text-xl">Braga</h1>
                            <h1 class="text-xl">Estudante</h1>
                        </div>
                    </div>
                    <div class="grid grid-cols-4 row-span-4 gap-3 max-w-xl">
                        <h1 class="text-xl font-bold text-emerald-500">Objetivos</h1>
                        <h1 class="text-xl col-span-3">Realizar o curso. Ter um horário de acordo com o que lhe convém.</h1>
                        <h1 class="text-xl font-bold text-emerald-500">Desafios</h1>
                        <h1 class="text-xl col-span-3">Adaptar-se e compreender o funcionamento do curso na universidade.</h1>
                        <h1 class="text-xl font-bold text-emerald-500">Soluções</h1>
                        <h1 class="text-xl col-span-3">Perguntar aos colegas que conhece.</h1>
                        <h1 class="text-xl font-bold text-emerald-500">Citação</h1>
                        <h1 class="text-xl col-span-3">"Ainda não percebi bem como funciona isto dos turnos, espero não ficar com um horário cheio de buracos. Disseram-me que era bom se não tivesse aulas na quinta de manhã."</h1>
                    </div>
                    <div class="row-span-3 mx-auto lg:mx-0">
                        <Avatar class="h-64 w-64">
                            <AvatarImage src="/avatars/01.png" alt="@shadcn" />
                            <AvatarFallback>SC</AvatarFallback>
                        </Avatar>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex justify-center mt-24 lg:mt-0 lg:justify-end">

          <router-link
            to="/schedule"
          >
            <Button type="submit" :disabled="isLoading" class="text-md bg-[#059669] hover:bg-[#047857] transition-colors">
                Ver Horário
            </Button>
          </router-link>
        </div>
    </div>
</template>

