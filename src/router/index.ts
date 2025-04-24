import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/stores/user";
import LoginView from "@/views/LoginView.vue";
import ScheduleView from "@/views/ScheduleView.vue";
import UCScheduleView from "@/views/UCScheduleView.vue";
import TicketsView from "@/views/TicketsView.vue";
import ClassroomsView from "@/views/ClassroomsView.vue";
import StudentsView from "@/views/StudentsView.vue";
import HomeView from "@/views/HomeView.vue";
import AssignScheduleView from "@/views/AssignScheduleView.vue";
import ShiftEditView from "@/views/ShiftEditView.vue";
import ProfileView from "@/views/ProfileView.vue";
import CourseListView from "@/views/CourseListView.vue";
import NonAllocatedStudentsView from "@/views/NonAllocatedStudentsView.vue";

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
      path: "/schedule/:idStudent",
      name: "schedule",
      component: ScheduleView,
    },
    {
      path: "/uc-schedule/:idCourse",
      name: "uc-schedule",
      component: UCScheduleView,
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
      path: "/allocate/:idStudent",
      name: "allocate-schedule",
      component: AssignScheduleView,
    },
    {
      path: "/shifts/:idUC/:idShift",
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
    {
      path: "/students/non-allocated",
      name: "nonAllocatedStudentsList",
      component: NonAllocatedStudentsView,
    },
  ],
});

router.beforeEach((to, from, next) => {
    const userStore = useUserStore();
    if (!userStore.user && to.name !== "login") {
        next({ name: "login" });
    } else {
        next();
    }
});

export default router;
