import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import StudentView from '@/views/StudentView.vue'
import TeacherView from '@/views/TeacherView.vue'
import TicketsView from '@/views/TicketsView.vue'
import ShiftEditView from '@/views/ShiftEditView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'login',
        component: LoginView
    },
    {
        path: '/aluno',
        name: 'student',
        component: StudentView
    },
    {
        path: '/docente',
        name: 'teacher',
        component: TeacherView
    },
    {
        path: '/tickets',
        name: 'tickets',
        component: TicketsView
    },
    {
        path: '/turnos',
        name: 'shift',
        component: ShiftEditView,
    }
    ]
})

export default router