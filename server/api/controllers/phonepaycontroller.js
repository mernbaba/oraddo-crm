const crypto = require("crypto");
const axios = require("axios");
// const {salt_key, merchant_id} = require('./secret')
require("dotenv").config();

const salt_key = "05ad3adc-857d-439a-aff4-2ee07d9028f9";
const merchant_id = "M22YOQGB6C5LL";

const newPayment = async (req, res) => {
  try {
    console.log(req.body.type, "kjhgfghjkl");

    const merchantTransactionId = req.body.transactionId;
    const planId = req?.body?.planId?.id;
    const organizationId = req?.body?.organizationId;
    const data = {
      merchantId: merchant_id,
      merchantTransactionId: merchantTransactionId,
      merchantUserId: req.body.MUID,
      name: req.body.name,
      amount: req.body.amount * 100,
      // amount: 1 * 100,
      redirectUrl: planId ? `https://app.oraddo.com/api/status/${merchantTransactionId}/${planId}/${organizationId}` : `https://app.oraddo.com/api/status/${merchantTransactionId}`,
      redirectMode: "POST",
      mobileNumber: req.body.number,
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };
    console.log(data, "from phonepayyyyy");
    const payload = JSON.stringify(data);
    const payloadMain = Buffer.from(payload).toString("base64");
    const keyIndex = 1;
    const string = payloadMain + "/pg/v1/pay" + salt_key;
    const sha256 = crypto.createHash("sha256").update(string).digest("hex");
    const checksum = sha256 + "###" + keyIndex;

    const prod_URL = "https://api.phonepe.com/apis/hermes/pg/v1/pay";

    const options = {
      method: "POST",
      url: prod_URL,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
      },
      data: {
        request: payloadMain,
      },
    };

    axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
        console.log(response.data.data.instrumentResponse.redirectInfo.url);
        // return res.redirect(
        //  response.data.data.instrumentResponse.redirectInfo.url
        // );
        return res.status(200).json({
          route: response.data.data.instrumentResponse.redirectInfo.url,
        });
      })
      .catch(function (error) {
        console.error(error);
      });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
};

const checkStatus = async (req, res) => {
  console.log("Received params:", req.params);
  console.log("Received body:", req.body);

  const merchantTransactionId = req.params.transactionId;
  const merchantId = process.env.MERCHANT_ID || merchant_id;
  const organizationId = req.params.organizationId;
  const planId = req.params.planId;

  if (!merchantTransactionId || !merchantId) {
    return res
      .status(400)
      .json({ success: false, message: "Missing transactionId or merchantId" });
  }

  const keyIndex = 1;
  const string =
    `/pg/v1/status/${merchantId}/${merchantTransactionId}` + salt_key;
  const sha256 = crypto.createHash("sha256").update(string).digest("hex");
  const checksum = sha256 + "###" + keyIndex;

  const options = {
    method: "GET",
    url: `https://api.phonepe.com/apis/hermes/pg/v1/status/${merchantId}/${merchantTransactionId}`,
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      "X-VERIFY": checksum,
      "X-MERCHANT-ID": merchantId,
    },
  };

  const Satus = {
    method: "POST", // Changed from GET to POST to match the curl command
    url: "https://app.oraddo.com/api/organizationInvoice",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      organizationId: organizationId,
      planId: planId,
    }),
  };
  try {
    const response = await axios.request(options);
    console.log("PhonePe API Response:", response.data);

    if (response.data.success) {
      if (planId && organizationId) {
        const respons = await axios.request(Satus);
        console.log(respons, "lkjhgfdfghjk");
        return res.redirect(`https://app.oraddo.com/successrenwal`);
      } else {
        return res.redirect(`https://app.oraddo.com/success`);
      }
    } else {
      return res.redirect(`https://app.oraddo.com/failure`);
    }
  } catch (error) {
    console.error(
      "Payment status check failed:",
      error.response?.data || error.message
    );
    return res.status(500).json({
      success: false,
      message: "Error checking payment status",
      error: error.response?.data || error.message,
    });
  }
};

module.exports = {
  newPayment,
  checkStatus,
};

// const crypto = require('crypto');
// const axios = require('axios');
// require('dotenv').config();

// const RETRY_LIMIT = 5; // Maximum retry attempts
// const RETRY_DELAY_BASE = 1000; // Base delay in ms

// const newPayment = async (req, res) => {
//     try {
//         const merchantTransactionId = req.body.transactionId;
//         const data = {
//             merchantId: process.env.merchant_id,
//             merchantTransactionId: merchantTransactionId,
//             merchantUserId: req.body.MUID,
//             name: req.body.name,
//             amount: req.body.amount * 100,
//             redirectUrl: `https://app.oraddo.com/api/status/${merchantTransactionId}`,
//             redirectMode: 'POST',
//             mobileNumber: req.body.number,
//             paymentInstrument: {
//                 type: 'PAY_PAGE',
//             },
//         };

//         const payload = JSON.stringify(data);
//         const payloadMain = Buffer.from(payload).toString('base64');
//         const keyIndex = 1;
//         const string = payloadMain + '/pg/v1/pay' + process.env.salt_key;
//         const sha256 = crypto.createHash('sha256').update(string).digest('hex');
//         const checksum = sha256 + '###' + keyIndex;

//         const prod_URL = 'https://api.phonepe.com/apis/hermes/pg/v1/pay';
//         const options = {
//             method: 'POST',
//             url: prod_URL,
//             headers: {
//                 accept: 'application/json',
//                 'Content-Type': 'application/json',
//                 'X-VERIFY': checksum,
//             },
//             data: {
//                 request: payloadMain,
//             },
//         };

//         // Retry logic with exponential backoff
//         const retryRequest = async (attempt = 1) => {
//             try {
//                 const response = await axios.request(options);
//                 console.log(response.data);
//                 return res.redirect(response.data.data.instrumentResponse.redirectInfo.url);
//             } catch (error) {
//                 if (error.response && error.response.status === 429 && attempt <= RETRY_LIMIT) {
//                     console.warn(`Retrying request (${attempt}/${RETRY_LIMIT})...`);
//                     const delay = RETRY_DELAY_BASE * Math.pow(2, attempt); // Exponential backoff
//                     await new Promise((resolve) => setTimeout(resolve, delay));
//                     return retryRequest(attempt + 1);
//                 } else {
//                     console.error('Request failed:', error.message);
//                     throw error;
//                 }
//             }
//         };

//         await retryRequest();
//     } catch (error) {
//         res.status(500).send({
//             message: error.message,
//             success: false,
//         });
//     }
// };

// const checkStatus = async(req, res) => {
//     const merchantTransactionId = res.req.body.transactionId
//     const merchantId = res.req.body.merchantId

//     const keyIndex = 1;
//     const string = `/pg/v1/status/${merchantId}/${merchantTransactionId}` + process.env.salt_key;
//     const sha256 = crypto.createHash('sha256').update(string).digest('hex');
//     const checksum = sha256 + "###" + keyIndex;

//     const options = {
//     method: 'GET',
//     url: `https://api.phonepe.com/apis/hermes/pg/v1/status/${merchantId}/${merchantTransactionId}`,
//     headers: {
//         accept: 'application/json',
//         'Content-Type': 'application/json',
//         'X-VERIFY': checksum,
//         'X-MERCHANT-ID': `${merchantId}`
//     }
//     };

//     // CHECK PAYMENT TATUS
//     axios.request(options).then(async(response) => {
//         if (response.data.success === true) {
//             const url = `http://localhost:5173/AdminDashboard`
//             return res.redirect(url)
//         } else {
//             const url = `http://localhost:5173/EmpDashboard`
//             return res.redirect(url)
//         }
//     })
//     .catch((error) => {
//         console.error(error);
//     });
// };

// module.exports = {
//     newPayment,
//     checkStatus
// }
