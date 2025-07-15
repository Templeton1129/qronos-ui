import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    isBoundGA: true as boolean,
  }),
  actions: {
    setIsBoundGA(val: boolean) {
      this.isBoundGA = val;
    },
  },
});
