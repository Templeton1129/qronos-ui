export const uuidV4 = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const isMobileByRegExp = () => {
  return (
    /Android|iPhone|iPad|iPod|Windows Phone|HarmonyOS/i.test(
      navigator.userAgent
    ) ||
    (/(Macintosh)/.test(navigator.userAgent) && navigator.maxTouchPoints > 1)
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

export const downloadEncryptor = () => {
  // 创建加密工具文件内容
  const encryptorContent = `"""
pip install pycryptodome
"""
import base64
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
from Crypto.Random import get_random_bytes
from hashlib import sha256


class AESEncryptor:
    def __init__(self, key):
        """
        初始化加密器
        :param key: 可以是字符串或字节，自动处理为32字节密钥
        """
        # 将密钥转换为32字节的AES-256密钥
        if isinstance(key, str):
            key = key.encode('utf-8')
        self.key = self._normalize_key(key)

    def _normalize_key(self, key):
        """处理密钥长度不足或过长的情况"""
        # 如果密钥长度不足，使用SHA-256哈希扩展
        if len(key) < 32:
            return sha256(key).digest()
        # 如果密钥过长，截取前32字节
        return key[:32]

    def encrypt(self, plain_text):
        """
        加密字符串
        :param plain_text: 要加密的文本
        :return: Base64编码的加密字符串
        """
        # 将字符串编码为字节
        plain_bytes = plain_text.encode('utf-8')

        # 生成随机初始化向量(IV)
        iv = get_random_bytes(AES.block_size)

        # 创建AES加密器(CBC模式)
        cipher = AES.new(self.key, AES.MODE_CBC, iv)

        # 对数据进行PKCS#7填充并加密
        ciphertext = cipher.encrypt(pad(plain_bytes, AES.block_size))

        # 组合IV和密文，并Base64编码
        encrypted_data = iv + ciphertext
        return base64.b64encode(encrypted_data).decode('utf-8')

    def decrypt(self, encrypted_text):
        """
        解密字符串
        :param encrypted_text: Base64编码的加密字符串
        :return: 解密后的原始字符串
        """
        # Base64解码
        encrypted_data = base64.b64decode(encrypted_text)

        # 分离IV和密文
        iv = encrypted_data[:AES.block_size]
        ciphertext = encrypted_data[AES.block_size:]

        # 创建AES解密器
        cipher = AES.new(self.key, AES.MODE_CBC, iv)

        # 解密并移除填充
        decrypted_bytes = unpad(cipher.decrypt(ciphertext), AES.block_size)

        # 将字节解码为字符串
        return decrypted_bytes.decode('utf-8')


# 示例用法
if __name__ == "__main__":
    # 示例密钥（可以是任意长度）
    user_key = "cnsjknasln"  # 注意：实际应用中应从安全来源获取

    # 创建加密器
    encryptor = AESEncryptor(user_key)

    # 原始消息
    original_message = "123456"

    # A端加密
    encrypted = encryptor.encrypt(original_message)
    print(f"加密结果: {encrypted}")

    # B端解密
    decrypted = encryptor.decrypt(encrypted)
    print(f"解密结果: {decrypted}")

    # 验证结果
    print(f"原始与解密是否一致: {original_message == decrypted}")
`;

  // 创建Blob对象
  const blob = new Blob([encryptorContent], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  // 创建下载链接
  const link = document.createElement("a");
  link.href = url;
  link.download = "encryptor.py";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // 清理URL对象
  URL.revokeObjectURL(url);
};
