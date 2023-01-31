import { S3Client, PutObjectCommand, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3'
import fs from "fs"
import dotenv from 'dotenv'

dotenv.config()

const region = process.env.region
const Bucket = process.env.BUCKET
const accessKeyId = process.env.aws_access_key_id
const secretAccessKey = process.env.aws_secret_access_key

export const s3 = new S3Client({ 
    credentials: {
        accessKeyId,
        secretAccessKey
    }, 
    region,
})

export const uploadToS3 = async (file) => {

    const key = file.filename
    const fileStream = fs.createReadStream(file.path);

    const command = new PutObjectCommand({ 
        Bucket, 
        Key: 'newimages/' + key,
        Body: fileStream,
        ContentType: file.mimetype
    })

    try {
        await s3.send(command)
        return { key }
    } catch (error) {
        return { error }
    }
}

export const getFromS3 = async (prefix) => {
    const command = new ListObjectsV2Command({
        Bucket,
        Prefix: prefix
    })

    const { Contents = [] } = await s3.send(command)

    return Contents.map(image => image.Key)
}

export const getPresignedUrls = async () => {
    try {
        const imageKeys = await getFromS3('newimages')

        const presignedUrls = await Promise.all(imageKeys.map(key => {
            return {
                imgUrl: 'https://d37izk13u4d9jy.cloudfront.net/' + key,
                _id: key
            }
        }))
        return { presignedUrls }
    } catch (error) {
        return { error }
    }
}