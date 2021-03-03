import { clipboard } from "electron";
import crypto from "crypto";

import { isWin } from "@/common/env";
import { IMG_PATTERN } from "@/renderer/utils";

export const filterUrl = (raw: string) => {
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
  dataSaver: (data: Buffer) => void,
  isFilter: boolean = true
) => {
  const available = clipboard.availableFormats();

  let text = "";

  if (available.includes("image/png")) {
    // binary or local file
    text = isWin
      ? clipboard.read("FileNameW").replace(new RegExp(String.fromCharCode(0), "g"), "")
      : clipboard.read("public.file-url");

    if (!text) {
      // binary image
      const data = clipboard.readImage().toPNG();
      text = crypto
        .createHash("md5")
        .update(data)
        .digest("hex")
        .concat(".png");
      dataSaver(data);
    }
  } else {
    // text
    text = clipboard.readText();

    if (isFilter && text.search(IMG_PATTERN) !== -1) {
      // image
      text = filterUrl(text);
    }
  }

  return text;
};
