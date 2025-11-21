import { defineStore } from "pinia";

export const useStrategyStore = defineStore("strategy", {
  state: () => ({
    isEncryption: false,
  }),
  actions: {
    setIsEncryption(val: boolean) {
      this.isEncryption = val;
    },
  },
});
