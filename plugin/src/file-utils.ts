import { readdirSync } from "fs";
import path from "path";

export function getAllFilePaths (folderPath: string) {
  let filePaths: string[] = [];

  const entries = readdirSync(folderPath, { withFileTypes: true });

  for (const entry of entries) {
    
    if(entry.name.includes('node_modules')) continue

    const entryPath = path.join(folderPath, entry.name);

    if (entry.isFile()) {
      filePaths.push(entryPath);
    } else if (entry.isDirectory()) {
      filePaths = filePaths.concat(getAllFilePaths(entryPath));
    }
  }
  return filePaths;
};