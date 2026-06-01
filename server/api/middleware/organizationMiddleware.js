// const jwt = require("jsonwebtoken");
// const Register = require("../models/organizationSignUp");



// const OrgMiddleware = (req, res, next) => {
//     const token = req.headers.authorization?.split(' ')[1];
//     if (!token) {
//       return res.status(401).json({ message: 'Unauthorized' });
//     }
  
//     try {
//       const decoded = jwt.verify(token, 'your-secret-key');
//       req.adminId = decoded.adminId;
//       next();
//     } catch {
//       return res.status(401).json({ message: 'Unauthorized' });
//     }
//   };

//   module.exports={OrgMiddleware}



const jwt = require("jsonwebtoken");
const Register = require("../models/organizationSignUp");

const OrgMiddleware = async (req, res, next) => {
  let token;
console.log(req,'kkkkkkkkkkkkk');

  // Log the authorization header for debugging
  console.log("Authorization Header:", req.headers.authorization);

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Decode the token to get the adminId
      const decoded = jwt.verify(token, "your-secret-key");
      console.log("Decoded Token:", decoded);

      // Fetch the user from the database
      const user = await Register.findOne({
        where: {id: decoded.adminId }, // Use the proper query based on your ORM
      });
      console.log("User Found:", user);

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      // Attach the user object to the request for future use
      req.user = user;

      // Proceed to the next middleware or route
      next();
    } catch (error) {
      console.error("Token Validation Error:", error.message);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = { OrgMiddleware };

