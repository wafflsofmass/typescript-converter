import replace from "./function-replacer";
import addStorageFile from "./storage-function";
import { getAllFilePaths } from "./file-utils";
import { writeFileSync } from "fs";
import VisitorFactory from "./visitor-factory";

export default function plugin({
  baseDirectory,
  lambdaName,
  importSource = 'plugin-storage',
  importSpecifier = 'pluginSendObjects',
}: {
  baseDirectory: string,
  lambdaName: string,
  importSource?: string,
  importSpecifier?: string,
}) {

  const allFilePaths = getAllFilePaths(baseDirectory)
  const factory = new VisitorFactory(importSource, importSpecifier)
  addStorageFile(baseDirectory)
  allFilePaths.forEach(filePath => writeFileSync(filePath, replace(
    lambdaName, 
    filePath, 
    factory
  )))
}