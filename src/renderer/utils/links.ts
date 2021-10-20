import { clipboard } from "electron";
import crypto from "crypto";

import { isWin } from "@/shared/env";
import { URL_PATH } from "@/shared/url";
import { IMG_IN_URL_PATTERN } from ".";

/**
 * 验证标准 URL
 * @param raw 字符串
 * @returns boolean
 */
export const validateUrl = (raw: string) => {
  try {
    new URL(raw);
    return true;
  } catch (err) {
    return false;
  }
};

/**
 * 清洗 URL
 * @param raw 字符串
 * @returns boolean
 */
export const cleanUrl = (raw: string) => {
  let res;

  try {
    const { origin, protocol, host, pathname } = new URL(raw);
    res = origin === "null" ? `${protocol}${host}${pathname}` : `${origin}${pathname}`;
  } catch (err) {
    res = raw;
  }

  return res;
};

export const getClipboard = (
  dataSaver: (url: string, data: Buffer) => void
): [boolean, boolean, string] => {
  let text = "";
  let isImg = false;
  let isUrl = false;

  const available = clipboard.availableFormats();

  if (available.includes("image/png")) {
    // binary file or local file
    text = isWin
      ? clipboard.read("FileNameW").replace(new RegExp(String.fromCharCode(0), "g"), "")
      : clipboard.read("public.file-url");

    if (!text) {
      // binary image
      const data = clipboard.readImage().toPNG();

      isImg = isUrl = true;
      text =
        URL_PATH.IMG +
        crypto
          .createHash("md5")
          .update(data)
          .digest("hex")
          .concat(".png");

      dataSaver(text, data);
    }
  } else {
    // text
    text = clipboard.readText();
    // link
    isUrl = validateUrl(text);
    // image link
    isImg = IMG_IN_URL_PATTERN.test(text);
  }

  return [isImg, isUrl, text];
};
