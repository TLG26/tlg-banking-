const {
  Configuration,
  PlaidApi,
  PlaidEnvironments,
  Products,
  CountryCode,
} = require("plaid");

const configuration = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV || "sandbox"],
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
      "PLAID-SECRET": process.env.PLAID_SECRET,
    },
  },
});

const plaidClient = new PlaidApi(configuration);

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const response = await plaidClient.linkTokenCreate({
      user: {
        client_user_id: "tlg-test-user",
      },
      client_name: "TLG Banking",
      products: [Products.Auth],
      country_codes: [CountryCode.Us],
      language: "en",
    });

    return res.status(200).json({
      link_token: response.data.link_token,
    });
  } catch (error) {
    console.error(error.response?.data || error);
    return res.status(500).json({
  error: error.response?.data || error.message || "Unknown error",
