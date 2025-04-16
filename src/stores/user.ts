import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null as {id: string, name: string, type: string} | null,
    }),
    actions: {
        setUser(user: {id: string, name: string, type: string}) {
            this.user = user;
        },
        clearUser() {
            this.user = null;
        },
    },
});