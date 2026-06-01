

const authService = require("../services/authService");
const blacklist = new Set(); // Example of an in-memory blacklist

// const signUp = async (req, res) => {
//   try {
//     const userData = req.body;
//     const user = await authService.signUp(userData);
//     res.status(201).json(user);
//   } catch (error) {
//     if (error.message === 'User with this email already exists') {
//       res.status(400).json({ error: error.message });
//     } else {
//       res.status(500).json({ error: error.message });
//     }
//   }
// };

const unifiedSignIn = async (req, res) => {
  try {
    const { email, userName, password } = req.body;
    const identifier = email || userName;
    const result = await authService.unifiedSignIn(identifier, password);
    res.status(200).json({
      status: true,
      message: "Login successfully",
      ...result
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message || "Login failed"
    });
  }
};

const signIn = async (req, res) => {
  try {
    const { userName, email, password, organizationId } = req.body;
    const loginIdentifier = userName || email;
    const resolvedOrganizationId =
      organizationId || process.env.DEFAULT_ORGANIZATION_ID || "SEED_ORG_001";
    const token = await authService.signIn(
      loginIdentifier,
      password,
      resolvedOrganizationId
    );
    res.status(200).json({ token });
  } catch (error) {
    if (error.message === "Invalid email or password") {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

const signOut = (req, res) => {
  try {
    console.log("logggggouuutttttt");
    const token = req.headers.authorization; // Assumes Bearer token in header
    console.log("logggggouuutttttt", token);
    if (!token) {
      return res.status(400).json({ error: "No token provided" });
    }

    if (isTokenBlacklisted(token)) {
      return res.status(400).json({ error: "Token is already blacklisted" });
    }

    // Blacklist the token
    const too = blacklist.add(token);
    console.log("blacklisttt", too);
    res.status(200).json({ message: "Signed out successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const isTokenBlacklisted = (token) => {
  return blacklist.has(token);
};

module.exports = {
  signIn,
  unifiedSignIn,
  signOut,
};
