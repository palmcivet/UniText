import { isDev } from "@/common/env";
import { IWindowArgs } from "@/typings/main";

export const prefix = "unitext://";

export const buildUrl = (args: Record<keyof IWindowArgs, string>, env?: any): string => {
  const baseUrl = isDev
    ? "http://localhost:9091/index.html"
    : `file://${__dirname}/index.html`;

  const params = new URLSearchParams(args);

  return `${baseUrl}?${params.toString()}`;
};

export const parseUrl = (): IWindowArgs => {
  const params = new URLSearchParams(window.location.search);

  return {
    wid: Number(params.get("wid")),
    lang: Number(params.get("lang")),
    type: Number(params.get("type")),
    conf: params.get("conf") as string,
    proj: params.get("proj") as string,
  };
};
