import replace from "./function-replacer";
import { getAllFilePaths } from "./file-utils";
import { writeFileSync } from "fs";

// const [arg1, arg1V, arg2, arg2V] = process.argv.slice(-4)

// const args = {
//   [arg1]: arg1V,
//   [arg2]: arg2V
// }

export default function plugin(
  baseDirectory: string, 
  lambdaName: string
) {
    getAllFilePaths(baseDirectory).forEach(filePath => writeFileSync(filePath, replace(lambdaName, filePath)))
}