import { Schema, model} from 'mongoose'

const user = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    roles: [{
        type: String,
        ref: 'Role'
    }]
})

export default model('users', user)