const jwt = require('jsonwebtoken')
const jwtAuthMiddleware = (req, res, next) => {

// first check request header has authorization or not
const authorization=req.headers.authorization
if(!authorization) {
    return res.status(401).json({message: 'You are not authenticated. OR Token not found'})
    }

    // Extract the jwt token from the request headers
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided.' }); 0
    }
    try {
        // Verify the jwt token
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // jwt.ver....ET) -> it return payload and now it save in decoded
        // Attach user information to the request object
        req.user = decoded; // or req.jwtPayload or req.userPayload or req.saras =
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token.' });
    }
}

// funtion to generate jwt token
const generateToken = (userData) => {
   // generate a new jwt token using the user data
    // const token = jwt.sign(userData, process.env.JWT_SECRET); // check spelling it's  JWT_SECRET not SECRET
 
    const token = jwt.sign(userData, process.env.JWT_SECRET,);// { expiresIn: 60 }); // or {expiresIn: '1m'}   60 mean sec , if we write 600 it mean 10 minute 
    return token; }

    module.exports ={jwtAuthMiddleware,generateToken}
