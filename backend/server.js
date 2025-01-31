require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const crypto=require("crypto");
const helmet=require("helmet");
const app = express();

// Middleware

// app.use(
//     helmet.contentSecurityPolicy({
//         directives: {
//           defaultSrc: ["'self'"], // Only allow same-origin content
//           scriptSrc: [
//             "'self'", 
//             "https://trustedsource.com",  // Add external script sources
//             "https://cdnjs.cloudflare.com", // Example for libraries (e.g., Bootstrap, jQuery)
//             "'unsafe-inline'" // If using inline scripts in React (remove if unnecessary)
//           ],
//           styleSrc: [
//             "'self'", 
//             "'unsafe-inline'", // Required if using inline styles (e.g., Styled Components in React)
//             "https://fonts.googleapis.com" // Example for Google Fonts
//           ],
//           fontSrc: ["'self'", "https://fonts.gstatic.com"], // Allow external fonts
//           imgSrc: ["'self'", "data:", "https://your-image-cdn.com"], // Allow images from self + CDN
//           connectSrc: [
//             "'self'", 
//             "https://your-api.com", // Allow API requests
//             "ws://localhost:3000", // Allow WebSocket for chatbot
//           ],
//           objectSrc: ["'none'"], // Disallow embedding objects (Flash, etc.)
//           frameSrc: ["'none'"], // Block iframes (unless you embed YouTube, etc.)
//         },
//       })
// );

app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://trustedsource.com"],
        objectSrc: ["'none'"],
      },
    })
  );
app.use(cors({
    origin: "http://localhost:3000", // Update for frontend URL
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

const sessionStore={}
const generateSessionId=()=> crypto.randomUUID();
const storeSession=(sessionId,jwt)=>{
    sessionStore[sessionId]=jwt;
}
const getSession=(sessionId)=>sessionStore[sessionId];

app.post("/login",(req,res)=>{
    const jwt="shiva";
    const sessionId=generateSessionId();
    storeSession(sessionId,jwt);
    res.cookie("sessionId",sessionId,{
        httpOnly:true,
        secure:true,
        sameSite:"Strict"
    });
    res.json({message:"Login Successful"});
})

// Get cookie route
app.get("/dashboard", (req, res) => {
    const sessionId = req.cookies.sessionId;
    if (!sessionId) {
        return res.status(401).json({ message: "Unauthorized access" });
    }
    const jwt=getSession(sessionId);
    if (!jwt) return res.status(401).json({ error: "Invalid session" });

    res.json({ message:"dashboard" });
});
app.post("/logout",(req,res)=>{
    const sessionId=req.cookies.sessionId;
    if(!sessionId) return res.json({message:"Please Logn"});
    if(sessionId) delete sessionStore[sessionId];
    res.clearCookie("sessionId");
    res.json({ message: "Logged out successfully" });

})

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
