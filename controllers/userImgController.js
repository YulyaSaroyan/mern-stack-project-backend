import UserImages from "../models/UserImages.js"
// import { getPresignedUrls, uploadToS3 } from "../s3.js"

class userImgController {
    async createImg(req, res) {
        try {
            const { id } = req.user
            const { files } = req
            const userImages = await Promise.all(files.map(async (file) => {
            
                // const { error } = await uploadToS3(file)
                if(error) return res.status(500).json({message: error.message})

                const userImage = new UserImages({
                    userId: id,
                    imgUrl: process.env.HOST + file.path
                })
                await userImage.save()
                return userImage
            }))
            return res.json(userImages)
        } catch (error) {
            res.status(400).json({message: 'Image upload Error'})
        }
    }

    async getUserImgs(req, res) {
        try {
            const { id } = req.user
            const userImages = await UserImages.find({userId: id})
            
            // const { error, presignedUrls } = await getPresignedUrls()

            if (error) return res.status(400).json({ message: error.message })

            return res.json(userImages)
        } catch (error) {   
            res.status(400).json({message: 'Image upload Error'})
        }
    }
}

export default new userImgController()