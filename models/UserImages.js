import { Schema, model, ObjectId} from 'mongoose'

const userImage = new Schema({
    imgUrl: {
        type: String,
        required: true
    },
    userId: {
        type: ObjectId,
        required: true
    }
})

export default model('userImages', userImage)