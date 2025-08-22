import replace from "./function-replacer";
import addStorageFile from "./storage-function";
import { getAllFilePaths } from "./file-utils";
import { writeFileSync } from "fs";

export default function plugin({
  baseDirectory,
  lambdaName,
  importSource,
  importSpecifier,
}: {
  baseDirectory: string,
  lambdaName: string,
  importSource: string,
  importSpecifier: string,
}) {

  const allFilePaths = getAllFilePaths(baseDirectory)
  const packageJsonPaths = allFilePaths.filter(path => /package.json$/.test(path))

  packageJsonPaths.forEach(addStorageFile)
  allFilePaths.forEach(filePath => writeFileSync(filePath, replace(lambdaName, filePath, importSource, importSpecifier)))
}