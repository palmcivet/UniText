"use strict";

const fse = require("fs");
const { resolve } = require("path");
const checker = require("license-checker");

const additionalPackages = {};

const getLicenses = (root, dst) => {
  const callback = (err, packages) => {
    if (err) {
      console.log(`[ERROR] ${err}`);
      return;
    }

    console.log(checker.asSummary(packages));

    Object.assign(packages, additionalPackages);

    let summary = "";
    let licenseList = "";
    let index = 1;

    const addedKeys = {};

    Object.keys(packages).forEach((key) => {
      let packageName = key;

      const nameRegex = /(^.+)(?:@)/.exec(key);

      if (nameRegex && nameRegex[1]) {
        packageName = nameRegex[1];
      }

      if (addedKeys.hasOwnProperty(packageName)) {
        return;
      }

      addedKeys[packageName] = 1;

      const { licenses, licenseText } = packages[key];
      summary += `${index++}. ${packageName} (${licenses})\n`;
      licenseList += `# ${packageName} (${licenses})
  -------------------------------------------------\

  ${licenseText}
  \n\n
  `;
    });

    const output = `# Third Party Notices
  -------------------------------------------------

  This file contains all third-party packages that are bundled and shipped with UniText.

  -------------------------------------------------
  # Summary
  -------------------------------------------------

${summary}

  -------------------------------------------------
  # Licenses
  -------------------------------------------------

  ${licenseList}
  `;

    fse.writeFileSync(dst, output);
  };

  checker.init(
    {
      start: root,
      production: true,
      development: false,
      direct: true,
      excludePackages: "",
      json: true,
      onlyAllow:
        "Unlicense;WTFPL;ISC;MIT;BSD;ISC;Apache-2.0;MIT*;Apache;Apache*;BSD*;CC0-1.0;CC-BY-4.0;CC-BY-3.0",
      customPath: {
        licenses: "",
        licenseText: "none",
      },
    },
    callback
  );
};

if (module.filename === process.argv[1]) {
  const root = process.cwd();
  const dst = resolve(root, "dist", "THIRD-PARTY-LICENSES.txt");
  getLicenses(root, dst);
}

module.exports = { getLicenses };
