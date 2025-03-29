import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../model/User.models.js';


dotenv.config();

export const protectroute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized access-no token provided" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized access-token verification failed" });
        }
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        req.user = user;
        next();
    } catch (error) {
        console.log("error in auth.middleware.js/protectroute", error);
        return res.status(500).json({ message: "Internal server error" });
    }

}