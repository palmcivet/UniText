"use strict";

const axios = require("axios").default;
const chalk = require("chalk");
const jszip = require("jszip");
const path = require("node");
const fse = require("fs-extra");

const { BuildPath } = require("../config/environment");

const OK_LOG = chalk.bgGreen.white(" OKAY ") + " ";
const DONE_LOG = chalk.bgBlue.white(" DONE ") + " ";

const LIBRARY_PATH = path.join(BuildPath.public(), "library");

const KATEX_URL = "https://api.github.com/repos/KaTeX/KaTeX/releases/latest";
const SAVED_PATTERN = ["fonts", "katex.min.css"];

(async () => {
  const katexPath = path.join(LIBRARY_PATH, "katex");

  if (fse.existsSync(katexPath)) {
    fse.removeSync(katexPath);
  }

  /* fetch github release */
  console.info(`${OK_LOG} Fetch GitHub release`);
  const { data: jsonData } = await axios({
    method: "get",
    url: KATEX_URL,
    responseType: "json",
  });
  const { assets } = jsonData;
  console.info(DONE_LOG);

  /* download katex.zip */
  console.info(`${OK_LOG} Download katex.zip`);
  const { data: zipData } = await axios({
    method: "get",
    url: assets[1].browser_download_url || "",
    responseType: "arraybuffer",
    proxy: false,
  });
  const { files } = await jszip.loadAsync(zipData);
  console.info(DONE_LOG);

  /* save katex.zip */
  console.info(`${OK_LOG} Save katex.zip`);
  for (const filename of Object.keys(files)) {
    const dest = path.join(LIBRARY_PATH, filename);

    if (!SAVED_PATTERN.some((pattern) => filename.includes(pattern))) {
      continue;
    }

    if (files[filename].dir) {
      fse.ensureDirSync(dest);
    } else {
      files[filename].async("nodebuffer").then((content) => fse.writeFileSync(dest, content));
    }
  }
  console.info(DONE_LOG);
})();
