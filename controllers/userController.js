const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  try {
    const { name, mobile_no, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);

    console.log(req.body);

    const user = new User({
      name,
      mobile_no,
      email,
      password: hashedPassword,
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile_no: user.mobile_no,
      },
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile_no: user.mobile_no,
      },
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

exports.createUser = async (req, res) => {
  try {
    console.log(req.body);

    const user = new User(req.body);
    await user.save();

    return res.status(201).json({
      message: "User created successfully",
      user: user,
    });
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error
      let field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        message: `${field} already exists.`,
      });
    } else {
      return res.status(400).json({
        message: error.message,
      });
    }
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.json(user);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Delete the user if found
    await User.findByIdAndDelete(id);
    return res.status(200).json({
      message: "User deleted Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});

    return res.status(200).json({
      message: users,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

exports.searchUserByName = async (req, res) => {
  try {
    const users = await User.find({ name: new RegExp(req.query.name, "i") });

    return res.status(200).json({
      message: users,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// exports.followUser = async (req, res) => {
//   const { userId } = req.params;
//   const { currentUserId } = req.body;

//   try {
//     const currentUser = await User.findById(currentUserId);
//     if (!currentUser) {
//       return res.status(404).json({ message: "Current user not found" });
//     }

//     const targetUser = await User.findById(userId);
//     if (!targetUser) {
//       return res.status(404).json({ message: "Target user not found" });
//     }

//     if (currentUser.following.includes(userId)) {
//       return res.status(400).json({ message: "Already following this user" });
//     }

//     currentUser.following.push(userId);
//     await currentUser.save();

//     targetUser.followers.push(currentUserId);
//     await targetUser.save();

//     return res.status(200).json({ message: "User followed successfully" });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };

// exports.unfollowUser = async (req, res) => {
//   const { userId } = req.params;
//   const { currentUserId } = req.body;

//   try {
//     const currentUser = await User.findById(currentUserId);
//     if (!currentUser) {
//       return res.status(404).json({ message: "Current user not found" });
//     }

//     const targetUser = await User.findById(userId);
//     if (!targetUser) {
//       return res.status(404).json({ message: "Target user not found" });
//     }

//     if (!currentUser.following.includes(userId)) {
//       return res
//         .status(400)
//         .json({ message: "User is not currently being followed" });
//     }

//     currentUser.following = currentUser.following.filter(
//       (id) => id.toString() !== userId
//     );
//     await currentUser.save();

//     targetUser.followers = targetUser.followers.filter(
//       (id) => id.toString() !== currentUserId
//     );
//     await targetUser.save();

//     return res.status(200).json({ message: "User unfollowed successfully" });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };
