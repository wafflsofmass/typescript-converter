import * as t from "@babel/types";
import * as fs from 'node:fs';
import generate from "@babel/generator";
import traverse from '@babel/traverse';
import wrapper from "./wrapper";
import { parse, parseExpression } from "@babel/parser";

function importAlreadyExists(
    node: t.Program, 
    importSource: string = 'plugin-storage'
) {
    return node.body.some(node => t.isImportDeclaration(node) && node.source.value === importSource)
}

function createImport(
    importSource: string = 'plugin-storage', 
    importSpecifier: string = 'pluginSendObjects'
) {
    return t.importDeclaration(
                    [t.importDefaultSpecifier(t.identifier(importSource))], 
                    t.stringLiteral(importSpecifier)
                )
}

export default function replace(
    lambdaName: string, 
    filePath: string, 
    importSource: string = 'plugin-storage', 
    importSpecifier: string = 'pluginSendObjects'
) {

    const code = fs.readFileSync(filePath, 'utf-8')
    const fileName = filePath.split('/').pop() ?? ''
    const ast = parse(code, { sourceType: 'module', plugins: ['typescript'] })

    traverse(ast, {
        Program(path) {
            if (!importAlreadyExists(path.node, importSource)) {
                path.unshiftContainer('body', createImport(importSource, importSpecifier));
            }
        },
        CallExpression(path) {
            const data = {
                //Might need fixed
                argumentNames: path.node.arguments.toString(),
                functionName: path.node.loc?.identifierName ?? '',
                lineNumber: `${path.node.loc?.start.line}`,
                isAsync: t.isAwaitExpression(path.parent),
                lambdaName, fileName
            }

            path.replaceWith(parseExpression(wrapper(data)))
        }
    })

    return generate(ast, { retainLines: true }, code).code
}

