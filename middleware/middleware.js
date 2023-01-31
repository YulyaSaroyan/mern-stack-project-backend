import jwt from "jsonwebtoken"

import { secretObj } from "../config.js"

export default function (req, res, next) {
    if (req.method === "OPTIONS") {
        next()
    }

    try {
        const token = req.headers.authorization.split(' ')[1]
        if (!token) {
            return res.status(403).json({message: 'user is not authorized'})
        }
        const decodedData = jwt.verify(token, secretObj.secret)
        req.user = decodedData
        next()
    } catch (error) {
        return res.status(403).json({message: 'user is not authorized'})
    }
}
