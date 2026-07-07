import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function getFilesWithExtensions(dir, extensions) {
    let files = [];
    if (!fs.existsSync(dir)) {
        return files;
    }

    const items = fs.readdirSync(dir);
    items.forEach((item) => {
        const itemPath = path.join(dir, item);
        const stat = fs.statSync(itemPath);

        if (stat.isDirectory()) {
            const subFiles = getFilesWithExtensions(itemPath, extensions);
            files = files.concat(subFiles.map((file) => path.join(item, file)));
        }
        else if (extensions.some((ext) => item.endsWith(ext))) {
            files.push(item);
        }
    });

    return files;
}

function formatPartialPath(file) {
    const dirName = path.dirname(file);
    const fileName = path.basename(file);

    if (dirName === ".") {
        return fileName;
    }
    return `${dirName}/${fileName}`;
}

const metadataPath = path.join(rootDir, "metadata.json");
const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf8"));

const filesObj = {
    layouts: getFilesWithExtensions(path.join(rootDir, "layouts"), [".hbs", ".json"]),
    pages: getFilesWithExtensions(path.join(rootDir, "pages"), [".hbs", ".json"]),
    data: getFilesWithExtensions(path.join(rootDir, "data"), [".jsonc"]),
    partials: getFilesWithExtensions(path.join(rootDir, "partials"), [".hbs", ".json"]).map(formatPartialPath),
};

const newMetadata = {
    name: metadata.name,
    version: metadata.version,
    env: metadata.env,
    aspects: metadata?.aspects ?? [],
    editor: metadata.editor,
    files: filesObj,
};

fs.writeFileSync(metadataPath, JSON.stringify(newMetadata, null, 4), "utf8");
console.log("Updated metadata.json with current files");
