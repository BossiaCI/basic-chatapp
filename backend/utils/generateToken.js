import jwt from 'jsonwebtoken'

const generateTokenAndSetCookie = (userID, res) => {
    const token = jwt.sign({ userID }, process.env.JWT_SECRET_KEY, { expiresIn: '15d' }) // 1 hour expiration

    res.cookie("jwt", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in MS
        httpOnly: true, // prevents client-side JS from accessing the cookie XSS attacks
        sameSite: "strict", // prevents CSRF attacks
        secure: process.env.NODE_ENV !== "development", // only send cookie over HTTPS
    })
}

export default generateTokenAndSetCookie;