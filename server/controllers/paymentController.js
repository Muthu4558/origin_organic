import qs from "querystring";
import { encrypt, decrypt } from "../utils/ccavenueCrypto.js";

export const createCCAvenueOrder = async (req, res) => {
  try {
    const { orderId, amount, name, email, phone } = req.body;

    const merchantData = {
      merchant_id: process.env.CCAVENUE_MERCHANT_ID, // MUST MATCH PANEL
      order_id: orderId,
      currency: "INR",
      amount: amount.toFixed(2),
      redirect_url: `${process.env.BASE_URL}/api/payment/ccavenue-response`,
      cancel_url: `${process.env.BASE_URL}/api/payment/ccavenue-response`,
      billing_name: name,
      billing_email: email,
      billing_tel: phone,
    };

    const encryptedData = encrypt(
      qs.stringify(merchantData),
      process.env.CCAVENUE_WORKING_KEY
    );

    res.json({
      encRequest: encryptedData,
      accessCode: process.env.CCAVENUE_ACCESS_CODE,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "CCAvenue order failed" });
  }
};

export const ccavenueResponse = async (req, res) => {
  try {
    const decrypted = decrypt(
      req.body.encResp,
      process.env.CCAVENUE_WORKING_KEY
    );

    const data = qs.parse(decrypted);

    if (data.order_status === "Success") {
      return res.redirect(`${process.env.FRONTEND_URL}/thankyou`);
    }

    return res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
  } catch (err) {
    console.error(err);
    return res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
  }
};
