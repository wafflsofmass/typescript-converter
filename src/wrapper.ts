const argsExtractor = `
    const argsExtractor = (...args) -> {
        let argStrings = [];
        for (let i = 0; i < arguments.length; i++) {
            let arg = arguments[i];
            if (typeof arg === 'object' && arg !== null) {
                
                try {
                    argStrings.push(JSON.stringify(arg));
                } catch (e) {
                    argStrings.push(arg.toString()); 
                }
            } else {
                argStrings.push(String(arg));
            }
        }
        return [\`\${argStrings.join(', ')}\`]
    }
`

const resultsExtractor = `
const resultsExtractor = (res) => {
    if (typeof res === 'object' && res !== null) {

        try {
            return JSON.stringify(res)
        } catch (e) {
            return res.toString()
        }
    } else {
        return String(res)
    }
}
`


const wrapper = ({ 
    functionName, 
    lambdaName, 
    argumentNames, 
    lineNumber, 
    fileName, 
    isAsync 
}: { 
    functionName: string, 
    lambdaName: string, 
    argumentNames: string, 
    lineNumber: string, 
    fileName: string, 
    isAsync: boolean 
}) => `
(${isAsync ? 'async ' : ' '}(...args) => {

    ${argsExtractor};
    ${resultsExtractor};
    const argString = argsExtractor(args);
    const results = await ${ functionName }(...args);
    const mutatedArgString = argsExtractor(args);
    const resultsString = resultsExtractor(results);
    await saveObjects({
        bucket: ${ lambdaName },
        key: ${ fileName }/${ functionName }/${ lineNumber },
        body: '[' + argString + ',' + mutatedArgString + ',' + resultsString + ']'
    });

    return results;
})(${ argumentNames });
`

export default wrapper