import { defineStore } from 'pinia';

export const useMarkedTicketStore = defineStore('markedTicket', {
    state: () => ({
        markedTicketId: localStorage.getItem('markedTicketId') as string | null,
    }),
    getters: {
        getMarkedTicketId: (state) => state.markedTicketId,
    },
    actions: {
        setMarkedTicketId(ticketId: string) {
            this.markedTicketId = ticketId;
            localStorage.setItem('markedTicketId', ticketId);
        },
        clearMarkedTicketId() {
            console.log('Clearing marked ticket ID');
            this.markedTicketId = null;
            localStorage.removeItem('markedTicketId');
        },
    },
});
