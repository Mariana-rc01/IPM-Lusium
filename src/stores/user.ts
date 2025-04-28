import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: JSON.parse(localStorage.getItem("user") || "null"),
  }),
  actions: {
    setUser(user: any) {
      this.user = user;
      localStorage.setItem("user", JSON.stringify(user));
    },
    clearUser() {
      this.user = null;
      localStorage.removeItem("user");
    },
  },
});