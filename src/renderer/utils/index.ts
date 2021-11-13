import { URL_PATH } from "@/shared/constant";

export const IMG_FORMAT = "(png|jpg|jpeg|bmp|ico|gif|svg|tif|tga)";

export const BLANK_PATTERN = /^[\s|\n]+$/g;

export const FRONT_MATTER_PATTERN = /^(-{3,}|;{3,})\n([\s\S]+?)\n\1(?:$|\n([\s\S]*)$)/;

export const IMG_IN_URL_PATTERN = new RegExp(`.${IMG_FORMAT}([?|#]?)`);

export const IMG_AS_RESOURCE_PATTERN = new RegExp(
  `((http(s)?:\/\/)|(${URL_PATH.IMG}))` + "(w*)(.w*)+([a-zA-Z0-9@:%_-~#?&=+./])*"
);

export const PATH_SEPARATE = "/";
