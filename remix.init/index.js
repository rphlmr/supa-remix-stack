const { execSync } = require("child_process");
const crypto = require("crypto");
const fs = require("fs/promises");
const path = require("path");

const sort = require("sort-package-json");

function getRandomString(length) {
  return crypto.randomBytes(length).toString("hex");
}

async function main({ rootDirectory, isTypeScript }) {
  console.log(`🚀  Making something cool with this template ...`);

  if (!isTypeScript) {
    throw new Error("😌  Sorry, this template only supports TypeScript");
  }

  const PACKAGE_JSON_PATH = path.join(rootDirectory, "package.json");

  const DIR_NAME = path.basename(rootDirectory);
  const SUFFIX = getRandomString(2);
  const APP_NAME = (DIR_NAME + "-" + SUFFIX)
    // get rid of anything that's not allowed in an app name
    .replace(/[^a-zA-Z0-9-_]/g, "-");

  const [packageJson] = await Promise.all([
    fs.readFile(PACKAGE_JSON_PATH, "utf-8").then((s) => JSON.parse(s)),
  ]);

  const newPackageJson =
    JSON.stringify(sort({ ...packageJson, name: APP_NAME }), null, 2) + "\n";

  await Promise.all([
    fs.writeFile(PACKAGE_JSON_PATH, newPackageJson),
    fs.copyFile(
      path.join(rootDirectory, "remix.init", "gitignore"),
      path.join(rootDirectory, ".gitignore")
    ),
  ]);

  execSync("npm run format -- --loglevel warn", {
    stdio: "inherit",
    cwd: rootDirectory,
  });

  console.log(
    `Setup is complete. You're now ready to rock and roll 🤘

Start development with \`npm run dev\`
`.trim()
  );
}

module.exports = main;
