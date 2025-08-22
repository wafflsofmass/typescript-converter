import replace from "./function-replacer";
import { getAllFilePaths } from "./file-utils";
import { writeFileSync } from "fs";

export default function plugin(
  baseDirectory: string, 
  lambdaName: string
) {
    getAllFilePaths(baseDirectory).forEach(filePath => writeFileSync(filePath, replace(lambdaName, filePath)))
}