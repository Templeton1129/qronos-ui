import { computed } from "vue";

export const useRatingFn = () => {
  // 最大回撤%（越小越好）
  const getDrawdownMeta = (val: number) => {
    if (val <= 10)
      return {
        label: "稳如老狗",
        icon: "pi pi-check-circle text-xs",
      };
    if (val <= 20) return { label: "小有波动", icon: "pi pi-shield text-xs" };
    if (val <= 30)
      return {
        label: "有点刺激",
        icon: "pi pi-exclamation-triangle text-xs",
      };
    return {
      label: "大起大落",
      icon: "pi pi-times-circle text-xs",
    };
  };

  // 年化%（越大越好）
  const getAnnualMeta = (val: number) => {
    if (val >= 50)
      return {
        label: "收益强劲",
        icon: "pi pi-arrow-up text-xs",
      };
    if (val >= 20)
      return {
        label: "还挺能赚",
        icon: "pi pi-thumbs-up text-xs",
      };
    if (val >= 0) return { label: "勉强保本", icon: "pi pi-equals text-xs" };
    return {
      label: "钱包失血",
      icon: "pi pi-arrow-down text-xs",
    };
  };

  // 24H收益率%（短期表现）
  const getDailyMeta = (val: number) => {
    if (val >= 5)
      return {
        label: "起飞节奏",
        icon: "pi pi-arrow-up text-xs",
      };
    if (val >= 1) return { label: "稳步上涨", icon: "pi pi-check text-xs" };
    if (val >= 0) return { label: "原地踏步", icon: "pi pi-equals text-xs" };
    return {
      label: "今天吃土",
      icon: "pi pi-arrow-down text-xs",
    };
  };

  return {
    getDrawdownMeta,
    getAnnualMeta,
    getDailyMeta,
  };
};
