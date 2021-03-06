import { clipboard } from "electron";
import crypto from "crypto";

import { isWin } from "@/common/env";
import { URL_PATH } from "@/common/url";
import { IMG_PATTERN } from ".";

export const testStrIsUrl = (raw: string) => {
  try {
    new URL(raw);
    return true;
  } catch (err) {
    return false;
  }
};

export const testStrIsImg = (raw: string) => {
  return raw.search(`.${IMG_PATTERN}([?|#]?)`) !== -1;
};

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
    isUrl = testStrIsUrl(text);
    // image link
    isImg = testStrIsImg(text);
  }

  return [isImg, isUrl, text];
};
