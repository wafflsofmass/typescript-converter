import replace from "./function-replacer";
import { getAllFilePaths } from "./file-utils";
import { writeFileSync } from "fs";
import addStorageFile from "./storage-function";

// const [arg1, arg1V, arg2, arg2V] = process.argv.slice(-4)

// const args = {
//   [arg1]: arg1V,
//   [arg2]: arg2V
//   [arg3]: arg3V
//   [arg4]: arg4V
// }

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