import JWT from 'jsonwebtoken'

export const requireSignIn = async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(200).json({ success: false, message: 'Please login to Continue' })
    }
    const { id } = JWT.verify(req.headers.authorization, process.env.JWT_SECRET)
    if (id) {
        req.userId = id
        next()
    } else {
        return res.status(200).json({ success: false, message: 'invalid access' })
    }
}
