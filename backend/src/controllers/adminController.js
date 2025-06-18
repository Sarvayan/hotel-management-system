import bcrypt from "bcrypt";
import Admin from "../models/adminModel.js";

export const Signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newAdmin = new Admin({
      email,
      password: hashedPassword,
      status: "Active",
      role: "Admin",
    });

    await newAdmin.save();
    console.log("Admin Added To The Database Successfully");
    res.send(true);
  } catch (error) {
    console.error("Error during signup:", error);
    res.send("Error during signup");
  }
};

/* export const Login = async (req, res) => {
  const { password } = req.body;
  console.log(password)

  try {
    const admin = await Admin.findOne();

    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const isMatch = bcrypt.compare(password, admin.password);
    console.log(admin.password);

    if (!isMatch){
        console.log("Reek")
return res.status(401).json({ message: "Invalid voice password" });

    }
      

    res.cookie("email", admin.email, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
    });

    res.json({ message: "Login successful via voice" });
    console.log("Rock")
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
}; */

export const Login = (req, res) => {
  console.log("Received password:", req.body.password);

  Admin.findOne()

    .then((admin) => {
      if (!admin) {
        console.log("Admin not found");
        return res
          .status(404)
          .send({ success: false, message: "Admin not found" });
      }

      console.log("Retrieved email:", admin.email);
      bcrypt
        .compare(req.body.password, admin.password)
        .then((match) => {
          if (!match) {
            console.log("Incorrect password");
            return res
              .status(401)
              .send({ success: false, message: "Incorrect password" });
          }

          res.cookie("email", admin.email, {
            httpOnly: true,
            secure: false,
            sameSite: "Lax",
          });

          console.log("Admin found and authenticated");
          console.log(req.cookies.email);

          return res.status(200).send({
            success: true,
            message: "Login successful",
            user: {
              role: admin.role,
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
