import { createRouter, createWebHistory } from "vue-router";
import LoginView from "@/views/LoginView.vue";
import StudentView from "@/views/StudentView.vue";
import TeacherView from "@/views/TeacherView.vue";
import TicketsView from "@/views/TicketsView.vue";
import ClassroomsView from "@/views/ClassroomsView.vue";
import StudentsView from "@/views/StudentsView.vue";
import HomeView from "@/views/HomeView.vue";
import AssignScheduleView from "@/views/AssignScheduleView.vue";
import ShiftEditView from "@/views/ShiftEditView.vue";
import ProfileView from "@/views/ProfileView.vue";
import CourseListView from "@/views/CourseListView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/login",
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/aluno",
      name: "student",
      component: StudentView,
    },
    {
      path: "/docente",
      name: "teacher",
      component: TeacherView,
    },
    {
      path: "/tickets",
      name: "tickets",
      component: TicketsView,
    },
    {
      path: "/classrooms",
      name: "classrooms",
      component: ClassroomsView,
    },
    {
      path: "/students",
      name: "students",
      component: StudentsView,
    },
    {
      path: "/alocar-horario",
      name: "allocate-schedule",
      component: AssignScheduleView,
    },
    {
      path: "/turnos",
      name: "shift",
      component: ShiftEditView,
    },
    {
      path: "/home",
      name: "home",
      component: HomeView,
    },
    {
      path: "/profile",
      name: "profile",
      component: ProfileView,
    },
    {
      path: "/courses",
      name: "coursesList",
      component: CourseListView,
    },
  ],
});

export default router;
