import { isDev } from "@/common/env";
import { IWindowArgs } from "@/typings/main";

export const URL_PROTOCOL = "unitext://";

export const URL_PATH = {
  IMG: `${URL_PROTOCOL}img/`,
  DOC: `${URL_PROTOCOL}doc/`,
};

export const buildUrl = (args: Record<keyof IWindowArgs, string>, env?: any): string => {
  const baseUrl = isDev
    ? "http://localhost:9091/index.html"
    : `${URL_PROTOCOL}${__dirname}/index.html`;

  const params = new URLSearchParams(args);

  return `${baseUrl}?${params.toString()}`;
};

export const parseUrl = (): IWindowArgs => {
  const params = new URLSearchParams(window.location.search);

  return {
    wid: Number(params.get("wid")),
    lang: Number(params.get("lang")),
    type: Number(params.get("type")),
    proj: params.get("proj") as string,
  };
};
