import { spawn } from "child_process";
import * as fse from "fs-extra";

const pandocCommand = "pandoc";

const getCommand = () => {
  return pandocCommand;
};

const pandoc = (from: string, to: string, ...args: Array<string>) => {
  const command = getCommand();
  const option = ["-s", from, "-t", to].concat(args);

  const converter = () =>
    new Promise((resolve, reject) => {
      const proc = spawn(command, option);
      proc.on("error", reject);
      let data = "";
      proc.stdout.on("data", (chunk) => {
        data += chunk.toString();
      });
      proc.stdout.on("end", () => resolve(data));
      proc.stdout.on("error", reject);
      proc.stdin.end();
    });

  converter.stream = (srcStream: any) => {
    const proc = spawn(command, option);
    srcStream.pipe(proc.stdin);
    return proc.stdout;
  };

  return converter;
};

export const exportToHtml = (el: string, title: string, style = "") => {
  const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <script src="https://cdn.jsdelivr.net/npm/katex-copytex@latest/dist/katex-copytex.min.js"></script>
    <style>${style}</style>
</head>
<body>
    ${el}
</body>
</html>`;

  return html;
};
