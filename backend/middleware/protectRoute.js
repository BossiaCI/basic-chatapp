import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized - NO TOKEN PROVIDED' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if(!decoded){
            return res.status(401).json({ error: 'Unauthorized - INVALID TOKEN' });
        }

        const user = await User.findById(decoded.userID).select("-password");

        if(!user) {
            return res.status(404).json({ error: 'Unauthorized - USER NOT FOUND' });
        }

        req.user = user;

        next();

    } catch (error) {
        console.log("Error in protectedRoute middleware: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

export default protectRoute;