import User from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const LoggedInUserID = req.user._id;
        const filteredUsers = await User.find({_id: {$ne: LoggedInUserID}}).select("-password");
        res.status(201).json(filteredUsers);

    } catch (error) {
        console.log("Error in getUserForSideBar: ", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}