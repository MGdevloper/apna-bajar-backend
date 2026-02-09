//----------------->email we use brevo for transactional emails<-------------------------------


import SibApiV3Sdk from "sib-api-v3-sdk";
import dotenv from "dotenv";
dotenv.config();

// Configure API client
const client = SibApiV3Sdk.ApiClient.instance;
client.authentications["api-key"].apiKey = process.env.SMTP_API_KEY

// Transactional Email API
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// IMPORTANT: sender is REQUIRED
async function sendEmail(toEmail, name,subject, htmlContent) {
    const email = {
        sender: {
            email: "apnabazar343@gmail.com", // MUST be verified in Brevo
            name: "ApnaBazar"
        },
        to: [
            { email: toEmail, name: name }
        ],
        subject: subject,
        htmlContent: htmlContent
    }

    try {
        const response = await apiInstance.sendTransacEmail(email);
        console.log("✅ Email sent successfully");
        console.log(response);
    } catch (error) {
        console.error("❌ Brevo API error");
        console.error(error.response?.body || error);
    }
}

export default sendEmail;
