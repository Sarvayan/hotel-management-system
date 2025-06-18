import Guest from "../models/guestModel.js";
import guestBlacklist from "../models/guestBlacklistModel.js";

export const guestBlacklistAccount = async (req, res) => {
  try {
    const { email, reason } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    console.log(`Deleting guest with email: ${email} for reason: ${reason}`);

    const guest = await Guest.findOne({ email });

    if (!guest) {
      return res
        .status(404)
        .json({ success: false, message: "Guest not found" });
    }

    const existingBlacklistedGuest = await guestBlacklist.findOne({ email });

    if (existingBlacklistedGuest) {
      existingBlacklistedGuest.reason = reason;
      await existingBlacklistedGuest.save();
    } else {
      const guestBlackList = new guestBlacklist({
        fname: guest.fname,
        lname: guest.lname,
        address: guest.address,
        nic: guest.nic,
        phoneNumber: guest.phoneNumber,
        gender: guest.gender,
        email: guest.email,
        reason: reason,
        status: "Blacklisted",
      });
      await guestBlackList.save();
    }

    await Guest.deleteOne({ email });

    return res.json({
      success: true,
      message: "Guest account blacklisted and deleted successfully!",
    });
  } catch (error) {
    console.error("Error blacklisting guest account:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getBlacklistAccount = async (req, res) => {
  try {
    const blacklistGuests = await guestBlacklist.find();

    if (blacklistGuests.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No blacklisted guests found" });
    }

    res.status(200).json({ success: true, guests: blacklistGuests });
  } catch (error) {
    console.error("Error retrieving blacklisted guest data:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
