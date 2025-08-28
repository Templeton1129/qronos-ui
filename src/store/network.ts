import { defineStore } from "pinia";

export const useNetworkStore = defineStore("network", {
  state: () => ({
    latency: 0, // 网络延迟(ms)
    requestStartTime: 0, // 请求开始时间
  }),
  actions: {
    setRequestStartTime() {
      this.requestStartTime = Date.now();
    },
    calculateLatency() {
      if (this.requestStartTime) {
        this.latency = Date.now() - this.requestStartTime;
      }
    },
  },
});
