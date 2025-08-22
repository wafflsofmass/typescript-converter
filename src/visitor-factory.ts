import * as t from "@babel/types";
import { NodePath } from '@babel/traverse';
import wrapper from "./wrapper";
import { parseExpression } from "@babel/parser";

function getIdentifierChain(node: any ): string {
    if (node.type === "Identifier") {
        return node.name;
    }
    if (node.type === "MemberExpression") {
        //@ts-ignore
        const objectChain = getIdentifierChain(node.object);
        const propertyChain = node.property.type === "Identifier"
            ? node.property.name
            //@ts-ignore
            : getIdentifierChain(node.property);
        return `${objectChain}.${propertyChain}`;
    }
    return "";
}

export default class VisitorFactory {
    importSource: string;
    importSpecifier: string;

    constructor(
        importSource: string, 
        importSpecifier: string
    ) {
        this.importSource = importSource;
        this.importSpecifier = importSpecifier;
    }

    importAlreadyExists(
        { node }: { node: t.Program }
    ) {
        return node.body.some(node => t.isImportDeclaration(node) && node.source.value === this.importSource)
    }

    createImport() {
        return t.importDeclaration(
            [t.importDefaultSpecifier(t.identifier(this.importSpecifier))],
            t.stringLiteral(this.importSource)
        )
    }

    extractParameterNames(node: t.CallExpression): string[] {
        const params: string[] = [];
        node.arguments.forEach(arg => {
            if (t.isIdentifier(arg)) params.push(arg.name);
        });
        return params;
    }

    extractFunctionName(node: t.CallExpression): string | undefined {
        return getIdentifierChain(node.callee);
    }

    extractWrapperArgs({ node }: { node: t.CallExpression }) {
        return {
            argumentNames: this.extractParameterNames(node),
            functionName: this.extractFunctionName(node) ?? '',
            lineNumber: `${node.loc?.start.line}`
        }
    }

    addToStartOfNode(path: NodePath<t.Program>) {
        path.unshiftContainer('body', this.createImport());
    }

    createVisitor(lambdaName: string, fileName: string) {
        const self = this;
        return {
            Program(path: NodePath<t.Program>) {
                if (!self.importAlreadyExists(path)) self.addToStartOfNode(path);
            },
            CallExpression(path: NodePath<t.CallExpression>) {
                path.replaceWith(parseExpression(wrapper({
                    ...self.extractWrapperArgs(path),
                    lambdaName,
                    fileName
                })));
                path.skip();
            }
        };
    }
}
