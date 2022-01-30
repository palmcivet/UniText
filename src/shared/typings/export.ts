/* html begin */
export type TExportHTML = {
  title: string;
};
/* html end */

/* pdf begin */

export type TPageSize = "A3" | "A4" | "A5" | "Legal" | "Letter" | "Tabloid" | "Custom";

export type TPageSizeNumber = {
  width: number;
  height: number;
};

export type TMarginCSS = {
  top: string;
  right: string;
  bottom: string;
  left: string;
};

export type TExportPDF = {
  landscape: boolean;
  pageSize: TPageSize | TPageSizeNumber;
  marginCSS: TMarginCSS;
};

/* pdf end */
