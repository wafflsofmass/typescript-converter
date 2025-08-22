import { existsSync, readFileSync, writeFileSync } from "fs"

const storage = `
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
const s3 = new S3Client({ region: process?.env?.region || process?.env?.awsRegion || process?.env?.AWS_REGION || "us-east-1" });
export default async function pluginSendObjects({ 
    bucket: Bucket, 
    key: Key, 
    body: Body 
}) {
    await s3
        .send(new PutObjectCommand({ Bucket, Key, Body: JSON.stringify(Body) }))
        .then(obj => JSON.stringify(obj, null, 2))
        .catch(e => logger?.error(\`Error:\n\t\${e}\`) ?? console.error(\`Error:\n\t\${e}\`))
}
`

export default function addStorageFile(packageDir: string) {
    if(!existsSync(packageDir)) throw new Error('Directory must contain package.json')

    const packageManifest = readFileSync(packageDir, 'utf-8')

    const { main }: { main: string } = JSON.parse(packageManifest)

    const storageFunctionPath = main.replace(/\/[^\/]+$/, '/plugin-storage.js')
    
    writeFileSync(storageFunctionPath, storage)
}

