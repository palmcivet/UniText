import { isDev } from "@/common/env";
import { IWindowArgs } from "@/typings/main";

export const URL_PROTOCOL = "unitext://";

export const URL_HOST = isDev ? "http://localhost:9091" : `file://${__dirname}`;

export const URL_PATH = {
  IMG: `${URL_PROTOCOL}img/`,
  DOC: `${URL_PROTOCOL}doc/`,
};

export const buildUrl = (args: Record<keyof IWindowArgs, string>, env?: any): string => {
  const params = new URLSearchParams(args);

  return `${URL_HOST}/index.html?${params.toString()}`;
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
