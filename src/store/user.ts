import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    isBoundGA: true as boolean,
    version: "0.5.4",
  }),
  actions: {
    setIsBoundGA(val: boolean) {
      this.isBoundGA = val;
    },
  },
});
