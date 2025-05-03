import { defineStore } from 'pinia';

export const useSidebarStateStore = defineStore('sidebarState', {
  state: () => ({
    isOpen: JSON.parse(localStorage.getItem('sidebarState') || 'false'),
    activeTab: localStorage.getItem('sidebarActiveTab') || 'tab1',
  }),
  actions: {
    toggle() {
      this.isOpen = !this.isOpen;
      localStorage.setItem('sidebarState', JSON.stringify(this.isOpen));
    },
    open() {
      this.isOpen = true;
      localStorage.setItem('sidebarState', JSON.stringify(this.isOpen));
    },
    close() {
      this.isOpen = false;
      localStorage.setItem('sidebarState', JSON.stringify(this.isOpen));
    },
    setActiveTab(tab: string) {
      this.activeTab = tab;
      localStorage.setItem('sidebarActiveTab', tab);
    }
  },
});
