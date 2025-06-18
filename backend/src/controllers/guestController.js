import bcrypt from "bcrypt";
import Guest from "../models/guestModel.js";

export const signupGuest = async (req, res) => {
  try {
    const { email, password } = req.body;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newGuest = new Guest({
      email,
      password: hashedPassword,
      status: "Active",
      role: "User",
    });

    await newGuest.save();
    console.log("Guest Added To The Database Successfully");
    res.send(true);
  } catch (error) {
    console.error("Error during signup:", error);
    res.send("Error during signup");
  }
};

export const loginGuest = (req, res) => {
  console.log("Received email:", req.body.email);
  console.log("Received password:", req.body.password);

  Guest.findOne({ email: req.body.email })
    .select("+password")
    .then((user) => {
      if (!user) {
        console.log("User not found");
        return res
          .status(404)
          .send({ success: false, message: "User not found" });
      }

      console.log("Retrieved email:", user.email);
      bcrypt
        .compare(req.body.password, user.password)
        .then((match) => {
          if (!match) {
            console.log("Incorrect password");
            return res
              .status(401)
              .send({ success: false, message: "Incorrect password" });
          }

          res.cookie("email", user.email, {
            httpOnly: true,
            secure: false,
            sameSite: "Lax",
          });

          console.log("User found and authenticated");
          console.log(req.cookies.email);

          return res.status(200).send({
            success: true,
            message: "Login successful",
            user: {
              role: user.role, // Assuming user object has a role field
            },
          });
        })
        .catch((err) => {
          console.error("Error comparing passwords:", err);
          res
            .status(500)
            .send({ success: false, message: "Error comparing passwords" });
        });
    })
    .catch((err) => {
      console.error("Database operation was unsuccessful:", err);
      res.status(500).send({
        success: false,
        message: "Database operation was unsuccessful",
      });
    });
};

export const otpGuest = (req, res) => {
  console.log("Received email:", req.body.email);

  Guest.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        console.log("User not found");
        return res.send("User not found");
      } else {
        res.send(true);
      }

      console.log("Retrieved email:", user.email);
    })
    .catch((err) => {
      console.error("Database operation was unsuccessful:", err);
      res.send("Database operation was unsuccessful");
    });
};

export const guestRegistration = async (req, res) => {
  try {
    const email = req.cookies.email;

    if (!email) {
      return res.send("Unauthorized access");
    }

    const existingGuest = await Guest.findOne({ email });

    if (!existingGuest) {
      return res.send("Guest not found");
    }

    const { fname, lname, address, nic, phonenum, gender } = req.body;

    existingGuest.fname = fname;
    existingGuest.lname = lname;
    existingGuest.address = address;
    existingGuest.nic = nic;
    existingGuest.phoneNumber = phonenum;
    existingGuest.gender = gender;

    // Save the updated guest details
    await existingGuest.save();

    console.log("Guest details updated successfully:", email);
    res.send(true);
  } catch (err) {
    console.error("Error updating guest details:", err);
    res.send("Guest update failed");
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
    console.log(existingGuest.fname);
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
