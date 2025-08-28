export const uuidV4 = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const isMobileByRegExp = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

export const isWeixinOpen = () => {
  return /micromessenger/i.test(navigator.userAgent);
};

import AnsiToHtml from "ansi-to-html";
export const formatOutputLog = (text: string) => {
  const converter = new AnsiToHtml({
    fg: localStorage.getItem("themeMode") === "system" ? "#222" : "#e5e7eb", // 默认字体色
  });
  let html = converter.toHtml(text);
  // 保留换行和前导空格
  html = html
    .split("\n")
    .map((line) => {
      if (!line.trim()) {
        return '<span class="block leading-[0.5] h-0 text-xs"></span>';
      }
      const spaces = line.match(/^\s*/)?.[0]?.length || 0;
      const spaceString = "&nbsp;".repeat(spaces);
      return `<span class="block leading-5 whitespace-pre text-xs">${spaceString}${line.trimLeft()}</span>`;
    })
    .join("");

  return html;
};

let lastErrorTime = 0;
let lastErrorMsg = "";
export const emitGlobalError = (message: string) => {
  const now = Date.now();
  // 2秒内同样的错误不再弹窗
  if (message === lastErrorMsg && now - lastErrorTime < 2000) return;
  lastErrorTime = now;
  lastErrorMsg = message;
  window.dispatchEvent(
    new CustomEvent("global-error-toast", { detail: message })
  );
};

// 只留前后两个字符 其他的使用*进行隐藏
export const maskString = (str: string) => {
  if (!str || str.length <= 4) return str; // 太短不处理

  const firstTwo = str.slice(0, 2);
  const lastTwo = str.slice(-2);
  const middle = "*".repeat(str.length - 4);

  return `${firstTwo}${middle}${lastTwo}`;
};
