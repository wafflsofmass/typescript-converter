import * as fs from 'node:fs';
import generate from "@babel/generator";
import traverse from '@babel/traverse';
import { parse } from "@babel/parser";
import VisitorFactory from './visitor-factory';

export default function replace(
    lambdaName: string,
    filePath: string,
    factory: VisitorFactory
) {

    const code = fs.readFileSync(filePath, 'utf-8')

    const fileName = filePath.split('/').pop() ?? ''
    const ast = parse(code, { sourceType: 'module', plugins: ['typescript'] })
    const visitor = factory.createVisitor(lambdaName, fileName)

    traverse(ast, visitor)

    return generate(ast, { retainLines: true }, code).code
}

