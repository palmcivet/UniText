import { spawn } from "child_process";

function getCommand() {
  return "pandoc";
}

export function execPandoc(from: string, to: string, ...args: Array<string>) {
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
}
