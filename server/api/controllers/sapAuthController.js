const sapAuthservice  = require("../services/sapAuthservice");
const blacklist = new Set();



const SapsignUp = async (req, res) => {
  try {
    const userData = req.body;
    const user = await sapAuthservice.SapsignUp(userData);
    res.status(201).json(user);
  } catch (error) {
    if (error.message === 'User with this userId already exists') {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

const SapsignIn = async (req, res) => {
  try {
    const { email_id, password} = req.body;
    console.log("datatataaaa", email_id, password);
    const token = await sapAuthservice.SapsignIn(email_id, password);
    res.status(200).json({ token });
  } catch (error) {
    if (error.message === "Invalid email or password") {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

const SapsignOut = (req, res) => {
    console.log(req,"bvhvmbn");
    
  try {
    console.log("logggggouuutttttt");
    const token = req?.body?.headers?.Authorization; // Assumes Bearer token in header
    console.log("logggggouuutttttt", token);
    if (!token) {
      return res.status(400).json({ error: "No token provided" });
    }
    // if (SapisTokenBlacklisted(token)) {
    //   return res.status(400).json({ error: "Token is already blacklisted" });
    // }

    // Blacklist the token
    const too = blacklist.add(token);
    console.log("blacklisttt", too);
    res.status(200).json({ message: "Signed out successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const SapisTokenBlacklisted = (token) => {
    return blacklist.has(token);
  };

module.exports = {
    SapsignUp,
    SapsignIn,
    SapsignOut
}