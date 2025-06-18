import twilio from "twilio";

const accountSid = "AC51578e1fc74ba1ba51dcbc38a4c5f03e";
const authToken = "9a957786837e70d9eae40b5ca5cf0a4f";
const twilioPhone = "+15089802894";

const client = twilio(accountSid, authToken);

export const sendSMS = async (req, res) => {
  const { phoneNumber, message } = req.body;
  console.log(phoneNumber)
  console.log(message)
  
  try {
    await client.messages.create({
      body: message,
      from: twilioPhone,
      to: phoneNumber,
    });

    res.json({ success: true, message: "SMS sent successfully" });
  } catch (error) {
    console.error("Twilio error:", error);

    console.error("Error message:", error.message);
    res.status(500).json({
      success: false,
      message: "Twilio Error",
      error: error.message,
    });
  }
};
