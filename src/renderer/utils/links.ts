import { clipboard } from "electron";
import crypto from "crypto";

import { isWin } from "@/common/env";
import { prefix } from "@/common/url";
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
    const { protocol, host, pathname } = new URL(raw);
    res = `${protocol}//${host}${pathname}`;
  } catch (err) {
    res = raw;
  }

  return res;
};

export const getClipboard = (
  dataSaver: (data: Buffer) => void
): [boolean, boolean, string] => {
  const available = clipboard.availableFormats();

  let text = "";
  let isImg = false;
  let isUrl = false;

  if (available.includes("image/png")) {
    // binary file or local file
    text = isWin
      ? clipboard.read("FileNameW").replace(new RegExp(String.fromCharCode(0), "g"), "")
      : clipboard.read("public.file-url");

    if (!text) {
      // binary image
      isImg = isUrl = true;
      const data = clipboard.readImage().toPNG();
      text =
        prefix +
        crypto
          .createHash("md5")
          .update(data)
          .digest("hex")
          .concat(".png");
      dataSaver(data);
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
