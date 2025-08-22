import replace from "./function-replacer";
import { getAllFilePaths } from "./file-utils";
import { writeFileSync } from "fs";

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
  getAllFilePaths(baseDirectory).forEach(filePath => writeFileSync(filePath, replace(lambdaName, filePath, importSource, importSpecifier)))
}