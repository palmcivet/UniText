const fs = require("fs");
const path = require("path");

const readJSON = async (path) => {
  if (!fs.existsSync(path)) {
    console.error("File not exist");
    return;
  }

  let res = null;

  try {
    res = fs.readFileSync(path, { encoding: "utf8" });
    try {
      return JSON.parse(res);
    } catch (e) {
      console.error("Parsing failed");
      console.error(e);
    }
  } catch (e) {
    console.error("Loading failed");
    console.error(e);
    return;
  }
};

const parseTheme = (input) => {
  const res = {
    base: "vs",
    inherit: true,
    rules: [],
    colors: {},
  };

  if (!input.hasOwnProperty("type")) {
    return res;
  } else {
    if (input.type === "dark") {
      res["base"] = "vs-dark";
    } else if (input.type === "light") {
      res["base"] = "vs";
    } else {
      res["base"] = "hc-black";
    }
  }

  if (!input.hasOwnProperty("tokenColors")) {
    return res;
  } else {
    if (!input.tokenColors instanceof Array) {
      return res;
    }

    const { tokenColors } = input;

    tokenColors.forEach((item) => {
      const sub = {};

      if (item.scope instanceof Array) {
        sub["token"] = item.scope.join(", ");
      } else {
        sub["token"] = item.scope;
      }

      if (item.settings.fontStyle && item.settings.fontStyle !== "normal") {
        sub["fontStyle"] = item.settings.fontStyle;
      }

      res.rules.push({
        foreground: item.settings.foreground,
        ...sub,
      });
    });
  }

  if (!input.hasOwnProperty("colors")) {
    return res;
  } else {
    const { colors } = input;
    if (typeof colors !== "object") {
      return res;
    }
    for (const key in colors) {
      if (key.indexOf("editor") !== -1) {
        res.colors[key] = colors[key];
      }
    }
  }

  return res;
};

(async (argv) => {
  if (argv.length === 2) {
    console.log("Missing input file");
    console.log("Usage: node themePorting.js <one-dark-pro.json>");
    return;
  }

  const prefix = path.dirname(argv[1]);
  const inPath = path.normalize(path.join(prefix, argv[2]));
  const outPath = path.join(prefix, `out-${new Date().getTime()}.json`);

  const data = await readJSON(inPath);

  const res = parseTheme(data);

  fs.writeFileSync(outPath, JSON.stringify(res));
})(process.argv);
