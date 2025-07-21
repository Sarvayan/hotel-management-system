import bcrypt from "bcrypt";
import Guest from "../models/guestModel.js";

export const guestRegistration = async (req, res) => {
  try {
    const email = req.cookies.email;

    if (!email) {
      return res.status(401).send("Unauthorized access: Email cookie missing");
    }

    const { fname, lname, address, nic, phoneNumber, gender } = req.body;

    if (!fname || !lname || !address || !nic || !phoneNumber || !gender) {
      return res.status(400).send("All fields are required");
    }

    const newGuest = new Guest({
      email,
      fname,
      lname,
      address,
      nic,
      phoneNumber,
      gender,
      status: "Active",
      role: "User",
    });

    await newGuest.save();

    console.log("Guest registered successfully:", email);
    res.status(201).send(true);
  } catch (err) {
    console.error("Error registering guest:", err);
    res.status(500).send("Guest registration failed");
  }
};

export const getDashboard = (req, res) => {
  const email = req.cookies.email;

  if (!email) {
    return res.send("Unauthorized access");
  }

  Guest.findOne({ email: email })
    .then(function (retdata) {
      res.send(retdata);
    })
    .catch(function () {
      res.send("Error retrieving user data");
    });
};

export const updateGuest = (req, res) => {
  const email = req.cookies.email;

  Guest.findOneAndUpdate(
    { email: email },
    {
      fname: req.body.fname,
      lname: req.body.lname,
      address: req.body.address,
      phoneNumber: req.body.phonenum,
      gender: req.body.gender,
    },
    { new: true }
  )
    .then((updatedGuest) => {
      if (updatedGuest) {
        console.log("Guest Updated Successfully");
        res.send(true);
      } else {
        console.log("Guest Not Found");
        res.send("Guest Not Found");
      }
    })
    .catch((error) => {
      console.log("Error updating guest:", error);
      res.send("Error updating guest");
    });
};

export const newPassword = (req, res) => {
  const email = req.cookies.email;
  const { password } = req.body;

  Guest.findOne({ email })
    .then((user) => {
      if (!user) {
        console.log("User not found");
        return res.send("User not found");
      }
      bcrypt
        .compare(password, user.password)
        .then((isMatch) => {
          if (!isMatch) {
            console.log("New password cannot be the same as old password");
            return res.send("New password cannot be the same as old password");
          }

          bcrypt
            .hash(password, 10)
            .then((hashedPassword) => {
              return Guest.findOneAndUpdate(
                { email },
                { password: hashedPassword },
                { new: true }
              );
            })
            .then(() => {
              console.log("Password updated successfully");
              res.send(true);
            })
            .catch((err) => {
              console.error("Error updating password:", err);
              res.send("Error updating password");
            });
        })
        .catch((err) => {
          console.error("Error comparing passwords:", err);
          res.send("Error comparing passwords");
        });
    })
    .catch((err) => {
      console.error("Error fetching user:", err);
      res.send("Error fetching user");
    });
};

export const findGuest = async (req, res) => {
  try {
    const guestId = req.params.id;
    console.log(guestId);

    if (!guestId) {
      return res.send("Guest ID is required");
    }

    const guest = await Guest.findById(guestId);

    if (!guest) {
      return res.send("Guest not found");
    }

    res.status(200).json({ success: true, guest });
  } catch (error) {
    console.error("Error retrieving guest data:", error);
    res.send("Server error");
  }
};

export const getGuest = async (req, res) => {
  try {
    let { page, limit, search, roomNo, date } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 5;

    const query = {};

    if (search) {
      query.$or = [
        { fname: { $regex: search, $options: "i" } },
        { lname: { $regex: search, $options: "i" } },
      ];
    }
    if (roomNo) {
      query.roomNo = roomNo;
    }
    if (date) {
      query.date = date;
    }

    const totalCustomers = await Guest.countDocuments(query);
    const guests = await Guest.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    return res.json({
      success: true,
      retdata: guests || [],
      totalPages: Math.ceil(totalCustomers / limit),
      totalGuests: totalCustomers,
      currentPage: page,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const checkGuest = async (req, res) => {
  try {
    const email = req.cookies.email;
    console.log(email);

    if (!email) {
      return res.send("Unauthorized access");
    }

    const existingGuest = await Guest.findOne({ email: email });

    if (existingGuest.fname) {
      console.log("false");
      return res.send(true);
    }
  } catch (error) {
    console.error("Error during checking guest:", error);
    res.send("Checking guest failed");
  }
};

export const logoutGuest = (req, res) => {
  res.clearCookie("email");
  return res
    .status(200)
    .send({ success: true, message: "Logged out successfully" });
};
