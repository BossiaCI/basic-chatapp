import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';
import generateTokenAndSetCookie from '../utils/generateToken.js';

export const SignUp = async (req, res) => {
    try {
        const { fullName, username, email, password, confirmPassword, gender } = req.body;
        console.log(fullName, username, email, password, confirmPassword, gender);

        if(password != confirmPassword){
            return res.status(400).json({error: "Passwords don't match"})
        }

        const user = await User.findOne({ email });

        if(user) {
            return res.status(400).json({error: "Email already exists"})
        }

        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`

        // hash password line
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const newUser = new User({
            fullName,
            username,
            email,
            password:hashedPassword,
            gender,
            profilePicture: gender == 'male' ? boyProfilePic : girlProfilePic,
            });

        if(newUser){
            // Generate JWT token
            generateTokenAndSetCookie(newUser, res);

            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                email: newUser.email,
                profilePicture: newUser.profilePicture,
                gender: newUser.gender
            });
        } else {
            console.log("Invalid user data");
            res.status(400).json({error: "Failed to create new user or Invalid user data"});
        }

    } catch (error) {
        console.log("Error in Signup controller", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
};

export const Login = async (req, res) => {
   try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const isPassWordCorrect = await bcryptjs.compare(password, user?.password || "");

    if(!user || !isPassWordCorrect){
        console.log("Invalid email or password");
        return res.status(401).json({error: "Invalid email or password"});
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture
    });

   } catch (error) {
    console.log("Error in Login controller", error.message);
    res.status(500).json({error: "Internal Server Error"});
   }
};

export const Logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({message: "Logged out successfully"});
    } catch (error) {
        console.log("Error in Logout controller", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
};

