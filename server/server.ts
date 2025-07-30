// import express, { Request, Response, NextFunction } from "express";
// import cors from "cors";
// import * as dotenv from "dotenv";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import admin from "./utils/firebaseAdmin";
// import path from "path";
// import { networkInterfaces } from "os";

// dotenv.config();

// // ✅ Validate required environment variables
// const REQUIRED_ENV_VARS = [
//   "GEMINI_API_KEY",
//   "FIREBASE_PROJECT_ID",
//   "FIREBASE_CLIENT_EMAIL",
//   "FIREBASE_PRIVATE_KEY",
// ];

// REQUIRED_ENV_VARS.forEach((key) => {
//   if (!process.env[key]) {
//     console.error(`❌ Missing required environment variable: ${key}`);
//     process.exit(1);
//   }
// });

// const app = express();
// const port = process.env.PORT || 5000;
// const host = "0.0.0.0"; // Bind to all network interfaces for global access

// // Enhanced CORS configuration for global access
// const corsOptions = {
//   origin: function (
//     origin: string | undefined,
//     callback: (err: Error | null, allow?: boolean) => void
//   ) {
//     // Allow requests with no origin (like mobile apps, Postman, curl requests)
//     if (!origin) return callback(null, true);

//     // In production, you should restrict this to your actual frontend domains
//     // For development and global testing, allowing all origins
//     if (process.env.NODE_ENV === "production") {
//       // Add your production frontend URLs here
//       const allowedOrigins = [
//         "https://movie-ticket-frontend.onrender.com",
//         "http://localhost:5173/",
//         // Add more allowed origins as needed
//       ];

//       if (allowedOrigins.includes(origin)) {
//         return callback(null, true);
//       } else {
//         return callback(new Error("Not allowed by CORS"), false);
//       }
//     }

//     // Allow all origins in development
//     return callback(null, true);
//   },
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
//   allowedHeaders: [
//     "Content-Type",
//     "Authorization",
//     "X-Requested-With",
//     "Accept",
//     "Origin",
//     "Cache-Control",
//     "X-File-Name",
//   ],
//   optionsSuccessStatus: 200,
// };

// // Middleware
// app.use(cors(corsOptions));
// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// // Trust proxy for accurate IP addresses when behind reverse proxy
// app.set("trust proxy", true);

// // Security and logging middleware
// app.use((req: Request, res: Response, next: NextFunction) => {
//   // Security headers
//   res.setHeader("X-Content-Type-Options", "nosniff");
//   res.setHeader("X-Frame-Options", "DENY");
//   res.setHeader("X-XSS-Protection", "1; mode=block");
//   res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

//   // Request logging
//   const timestamp = new Date().toISOString();
//   const clientIP = req.ip || req.connection.remoteAddress || "unknown";
//   const userAgent = req.get("User-Agent") || "unknown";
//   console.log(
//     `[${timestamp}] ${req.method} ${req.url} - IP: ${clientIP} - User-Agent: ${userAgent}`
//   );

//   next();
// });

// // Auth middleware for token verification
// const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({ error: "Unauthorized - No token provided" });
//   }

//   const idToken = authHeader.split(" ")[1];

//   try {
//     const decodedToken = await admin.auth().verifyIdToken(idToken);
//     req.user = decodedToken;
//     next();
//   } catch (error) {
//     console.error("Error verifying token:", error);
//     return res.status(401).json({ error: "Invalid or expired token" });
//   }
// };

// // Extend Request interface to include user
// declare module "express" {
//   export interface Request {
//     user?: admin.auth.DecodedIdToken;
//   }
// }

// // Authentication Routes
// app.post(
//   "/api/auth/login",
//   verifyToken,
//   async (req: Request, res: Response) => {
//     try {
//       const { uid, email } = req.body;
//       const decodedToken = req.user!;

//       // Verify token matches the provided user data
//       if (decodedToken.uid !== uid || decodedToken.email !== email) {
//         return res.status(403).json({ error: "Token mismatch" });
//       }

//       // Get user record from Firebase Admin
//       const userRecord = await admin.auth().getUser(decodedToken.uid);

//       // Check if email is verified
//       if (!userRecord.emailVerified) {
//         return res.status(403).json({
//           error: "Email not verified",
//           message: "Please verify your email before logging in",
//         });
//       }

//       return res.status(200).json({
//         message: "Login successful",
//         user: {
//           uid: userRecord.uid,
//           email: userRecord.email,
//           displayName: userRecord.displayName,
//           emailVerified: userRecord.emailVerified,
//           lastSignInTime: userRecord.metadata.lastSignInTime,
//         },
//       });
//     } catch (error) {
//       console.error("Error in login route:", error);
//       return res.status(500).json({ error: "Internal server error" });
//     }
//   }
// );

// app.post("/api/auth/sync", verifyToken, async (req: Request, res: Response) => {
//   try {
//     const { uid, email } = req.body;
//     const decodedToken = req.user!;

//     if (decodedToken.uid !== uid || decodedToken.email !== email) {
//       return res.status(403).json({ error: "Token mismatch" });
//     }

//     return res.status(200).json({ message: "User synced successfully" });
//   } catch (error) {
//     console.error("Error in sync route:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// });

// // Data arrays (unchanged from original)
// const concerts = [
//   {
//     id: "1",
//     name: "Arijit Singh Live",
//     date: "2025-08-10",
//     time: "19:30",
//     venue: "Gachibowli Stadium",
//     city: "Hyderabad",
//     image: "/images/arijit.jpg",
//     price: 1499,
//   },
//   {
//     id: "2",
//     name: "Prateek Kuhad India Tour",
//     date: "2025-09-02",
//     time: "20:00",
//     venue: "Phoenix Arena",
//     city: "Bengaluru",
//     image: "/images/prateek.jpg",
//     price: 1199,
//   },
// ];

// const sports = [
//   {
//     id: "1",
//     title: "IPL Final 2025",
//     date: "2025-05-28",
//     location: "Ahmedabad",
//     image:
//       "https://th.bing.com/th/id/OIP.m47FmnxFZsbPVArqMP8LDwHaD4?w=342&h=180&c=7&r=0&o=7&dpr=1.4&pid=1.7&rm=3",
//   },
//   {
//     id: "2",
//     title: "Pro Kabaddi League",
//     date: "2025-07-15",
//     location: "Hyderabad",
//     image:
//       "https://bsmedia.business-standard.com/_media/bs/img/article/2024-03/01/full/1709308983-723.jpg?im=FeatureCrop,size=(803,452)",
//   },
//   {
//     id: "3",
//     title: "Indian Super League",
//     date: "2025-10-10",
//     location: "Goa",
//     image:
//       "https://th.bing.com/th/id/OIP.oEWtYY30Wa821BpA8Nu32QHaEK?w=295&h=180&c=7&r=0&o=7&dpr=1.4&pid=1.7&rm=3",
//   },
// ];

// const theatreAndArts = [
//   {
//     id: "1",
//     title: "Shakespeare's Hamlet - Live Play",
//     date: "2025-08-28",
//     location: "Mumbai",
//     image:
//       "https://th.bing.com/th/id/OIP.gOEMNyUr5IGHdotrrywUhQHaDQ?w=342&h=154&c=7&r=0&o=5&dpr=1.4&pid=1.7",
//     type: "Theatre",
//   },
//   {
//     id: "2",
//     title: "Indian Classical Dance Show",
//     date: "2025-09-05",
//     location: "Chennai",
//     image:
//       "https://th.bing.com/th/id/OIP.NxzX5rl30wqLCt8SKaTNIAHaE8?w=270&h=180&c=7&r=0&o=7&dpr=1.4&pid=1.7&rm=3",
//     type: "Art",
//   },
//   {
//     id: "3",
//     title: "Modern Art Exhibition - Colours of Mind",
//     date: "2025-09-15",
//     location: "Delhi",
//     image:
//       "https://static.theprint.in/wp-content/uploads/2023/05/ANI-20230514095742.jpg",
//     type: "Art",
//   },
//   {
//     id: "4",
//     title: "Stand-up Comedy Night",
//     date: "2025-09-20",
//     location: "Bangalore",
//     image:
//       "https://tse2.mm.bing.net/th/id/OIP.hjTXYQg8cfU7nmXJ0QsGNgHaED?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
//     type: "Theatre",
//   },
// ];

// // Public API Routes (unchanged logic, added error handling)
// app.get("/api/concerts", (req: Request, res: Response) => {
//   try {
//     res.status(200).json({
//       success: true,
//       data: concerts,
//       count: concerts.length,
//     });
//   } catch (error) {
//     console.error("Error fetching concerts:", error);
//     res.status(500).json({
//       success: false,
//       error: "Internal server error",
//       message: "Failed to fetch concerts",
//     });
//   }
// });

// app.get("/api/concerts/:id", (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const concert = concerts.find((c) => c.id === id);

//     if (concert) {
//       res.status(200).json({
//         success: true,
//         data: concert,
//       });
//     } else {
//       res.status(404).json({
//         success: false,
//         error: "Concert not found",
//         message: `Concert with ID ${id} does not exist`,
//       });
//     }
//   } catch (error) {
//     console.error("Error fetching concert:", error);
//     res.status(500).json({
//       success: false,
//       error: "Internal server error",
//       message: "Failed to fetch concert details",
//     });
//   }
// });

// app.get("/api/sports", (req: Request, res: Response) => {
//   try {
//     res.status(200).json({
//       success: true,
//       data: sports,
//       count: sports.length,
//     });
//   } catch (error) {
//     console.error("Error fetching sports:", error);
//     res.status(500).json({
//       success: false,
//       error: "Internal server error",
//       message: "Failed to fetch sports events",
//     });
//   }
// });

// app.get("/api/sports/:id", (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const event = sports.find((e) => e.id === id);

//     if (event) {
//       res.status(200).json({
//         success: true,
//         data: event,
//       });
//     } else {
//       res.status(404).json({
//         success: false,
//         error: "Sports event not found",
//         message: `Sports event with ID ${id} does not exist`,
//       });
//     }
//   } catch (error) {
//     console.error("Error fetching sports event:", error);
//     res.status(500).json({
//       success: false,
//       error: "Internal server error",
//       message: "Failed to fetch sports event details",
//     });
//   }
// });

// // FIXED: Changed route path from /api/theatres-arts to /api/theatre-arts (singular)
// app.get("/api/theatre-arts", (req: Request, res: Response) => {
//   try {
//     res.status(200).json({
//       success: true,
//       data: theatreAndArts,
//       count: theatreAndArts.length,
//     });
//   } catch (error) {
//     console.error("Error fetching theatre and arts:", error);
//     res.status(500).json({
//       success: false,
//       error: "Internal server error",
//       message: "Failed to fetch theatre and arts events",
//     });
//   }
// });

// // FIXED: Changed route path from /api/theatres-arts/:id to /api/theatre-arts/:id (singular)
// app.get("/api/theatre-arts/:id", (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     console.log("/api/theatre-arts/:id requested with id:", id);
//     const event = theatreAndArts.find((e) => e.id === id);

//     if (event) {
//       res.status(200).json({
//         success: true,
//         data: event,
//       });
//     } else {
//       res.status(404).json({
//         success: false,
//         error: "Theatre/Art event not found",
//         message: `Theatre/Art event with ID ${id} does not exist`,
//       });
//     }
//   } catch (error) {
//     console.error("Error fetching theatre/art event:", error);
//     res.status(500).json({
//       success: false,
//       error: "Internal server error",
//       message: "Failed to fetch theatre/art event details",
//     });
//   }
// });

// // Initialize Gemini AI
// const API_KEY = process.env.GEMINI_API_KEY;
// if (!API_KEY) {
//   console.error("❌ GEMINI_API_KEY is not set in environment variables");
//   console.error(
//     "Please set GEMINI_API_KEY in your .env file or environment variables"
//   );
//   process.exit(1);
// }

// const genAI = new GoogleGenerativeAI(API_KEY);

// // Chat endpoint
// app.post("/chat", async (req: Request, res: Response) => {
//   const { message } = req.body;

//   if (!message || typeof message !== "string" || message.trim().length === 0) {
//     return res.status(400).json({
//       success: false,
//       error: "Message is required",
//       message: "Please provide a valid message",
//     });
//   }

//   try {
//     const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
//     const result = await model.generateContent(`
// You are an AI assistant integrated into a movie ticket booking web application called "SHOWTIMEGO". Help users with questions related to:
// - Movie listings and show timings
// - Concert bookings and details
// - Sports event bookings
// - Theatre and arts events
// - Booking availability and ticket pricing
// - General app navigation

// Keep responses conversational, polite, and helpful. Answer only based on the app's features and scope. If a user asks something out of scope (e.g., international bookings, movie reviews, etc.), politely redirect them back to the app's features.

// Here is the latest user query:
// "${message.trim()}"
// `);

//     const text = result.response.text();
//     res.status(200).json({
//       success: true,
//       reply: text,
//       timestamp: new Date().toISOString(),
//     });
//   } catch (error) {
//     console.error("Gemini API error:", error);
//     res.status(500).json({
//       success: false,
//       error: "AI chat service temporarily unavailable",
//       message: "Something went wrong with AI chat. Please try again.",
//     });
//   }
// });

// // Root endpoint
// app.get("/", (req: Request, res: Response) => {
//   res.status(200).json({
//     message: "🎬 SHOWTIMEGO API Server",
//     status: "Running",
//     version: "1.0.0",
//     environment: process.env.NODE_ENV || "development",
//     timestamp: new Date().toISOString(),
//     endpoints: {
//       health: "/health",
//       concerts: {
//         list: "/api/concerts",
//         details: "/api/concerts/:id",
//       },
//       sports: {
//         list: "/api/sports",
//         details: "/api/sports/:id",
//       },
//       theatreArts: {
//         list: "/api/theatre-arts",
//         details: "/api/theatre-arts/:id",
//       },
//       chat: "/chat",
//       auth: {
//         login: "/api/auth/login (POST)",
//         sync: "/api/auth/sync (POST)",
//       },
//     },
//   });
// });

// // Health check endpoint
// app.get("/health", (req: Request, res: Response) => {
//   const healthData = {
//     status: "OK",
//     timestamp: new Date().toISOString(),
//     uptime: Math.floor(process.uptime()),
//     environment: process.env.NODE_ENV || "development",
//     version: "1.0.0",
//     memory: {
//       used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + " MB",
//       total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + " MB",
//     },
//     services: {
//       firebase: "Connected",
//       gemini: API_KEY ? "Connected" : "Not configured",
//     },
//   };

//   res.status(200).json(healthData);
// });

// // 404 handler - FIXED: Named the wildcard parameter to comply with Express 5 / path-to-regexp requirements
// app.use("/*catchAll", (req: Request, res: Response) => {
//   res.status(404).json({
//     success: false,
//     error: "Endpoint not found",
//     message: `The requested endpoint ${req.method} ${req.originalUrl} does not exist`,
//     availableEndpoints: [
//       "GET /",
//       "GET /health",
//       "GET /api/concerts",
//       "GET /api/concerts/:id",
//       "GET /api/sports",
//       "GET /api/sports/:id",
//       "GET /api/theatre-arts",
//       "GET /api/theatre-arts/:id",
//       "POST /chat",
//       "POST /api/auth/login",
//       "POST /api/auth/sync",
//     ],
//   });
// });

// // Global error handler
// app.use((error: Error, req: Request, res: Response, _next: NextFunction) => {
//   console.error("❌ Unhandled error:", error);
//   res.status(500).json({
//     success: false,
//     error: "Internal server error",
//     message:
//       process.env.NODE_ENV === "development"
//         ? error.message
//         : "Something went wrong",
//   });
// });

// // Declare server variable before using it
// import { Server } from "http";
// let server: Server;

// // Graceful shutdown handlers
// const gracefulShutdown = (signal: string) => {
//   console.log(`\n📡 Received ${signal}. Shutting down gracefully...`);
//   if (server) {
//     server.close(() => {
//       console.log("✅ HTTP server closed.");
//       process.exit(0);
//     });

//     // Force close after 30 seconds
//     setTimeout(() => {
//       console.error(
//         "❌ Could not close connections in time, forcefully shutting down"
//       );
//       process.exit(1);
//     }, 30000);
//   } else {
//     process.exit(0);
//   }
// };

// process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
// process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// // Start the server
// server = app.listen(Number(port), host, () => {
//   console.log("\n🚀 SHOWTIMEGO Server Started Successfully!");
//   console.log("═══════════════════════════════════════════");
//   console.log(`📍 Server URL: http://${host}:${port}`);
//   console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
//   console.log(`🏥 Health Check: http://${host}:${port}/health`);
//   console.log(`🤖 Chat Endpoint: http://${host}:${port}/chat`);
//   console.log("═══════════════════════════════════════════");

//   // Display network interfaces
//   console.log("\n📡 Network Interfaces:");
//   const nets = networkInterfaces();
//   Object.keys(nets).forEach((name) => {
//     nets[name]?.forEach((net) => {
//       if (net.family === "IPv4" && !net.internal) {
//         console.log(`   🌐 ${name}: http://${net.address}:${port}`);
//       }
//     });
//   });

//   console.log(
//     "\n✅ Server is ready to accept connections from anywhere in the world!"
//   );
// });

// // Handle server startup errors
// server.on("error", (error: NodeJS.ErrnoException) => {
//   if (error.syscall !== "listen") {
//     throw error;
//   }

//   const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

//   switch (error.code) {
//     case "EACCES":
//       console.error(`❌ ${bind} requires elevated privileges`);
//       process.exit(1);
//       break;
//     case "EADDRINUSE":
//       console.error(`❌ ${bind} is already in use`);
//       console.log(`💡 Try using a different port: PORT=3001 npm start`);
//       process.exit(1);
//       break;
//     default:
//       throw error;
//   }
// });

// export default app;

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import admin from "./utils/firebaseAdmin";
import path from "path";
import { networkInterfaces } from "os";

dotenv.config();

const REQUIRED_ENV_VARS = [
  "GEMINI_API_KEY",
  "FIREBASE_PROJECT_ID",
  "FIREBASE_CLIENT_EMAIL",
  "FIREBASE_PRIVATE_KEY",
];

REQUIRED_ENV_VARS.forEach((key) => {
  if (!process.env[key]) {
    console.error(`❌ Missing required environment variable: ${key}`);
    process.exit(1);
  }
});

const app = express();
const port = process.env.PORT || 5000;
const host = "0.0.0.0";

const corsOptions = {
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) {
    if (!origin) return callback(null, true);

    if (process.env.NODE_ENV === "production") {
      const allowedOrigins = [
        "https://movie-ticket-frontend.onrender.com",
        "http://localhost:5173/",
      ];

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"), false);
      }
    }

    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
    "Cache-Control",
    "X-File-Name",
  ],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.set("trust proxy", true);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  // Request logging - FIXED: Declare timestamp properly
  const requestTimestamp = new Date().toISOString();
  const clientIP = req.ip || req.connection.remoteAddress || "unknown";
  const userAgent = req.get("User-Agent") || "unknown";

  console.log(
    `[${requestTimestamp}] ${req.method} ${req.url} - IP: ${clientIP} - User-Agent: ${userAgent}`
  );

  next();
});

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized - No token provided" });
  }

  const idToken = authHeader.split(" ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

declare module "express" {
  export interface Request {
    user?: admin.auth.DecodedIdToken;
  }
}

app.post(
  "/api/auth/login",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const { uid, email } = req.body;
      const decodedToken = req.user!;

      if (decodedToken.uid !== uid || decodedToken.email !== email) {
        return res.status(403).json({ error: "Token mismatch" });
      }

      const userRecord = await admin.auth().getUser(decodedToken.uid);

      if (!userRecord.emailVerified) {
        return res.status(403).json({
          error: "Email not verified",
          message: "Please verify your email before logging in",
        });
      }

      return res.status(200).json({
        message: "Login successful",
        user: {
          uid: userRecord.uid,
          email: userRecord.email,
          displayName: userRecord.displayName,
          emailVerified: userRecord.emailVerified,
          lastSignInTime: userRecord.metadata.lastSignInTime,
        },
      });
    } catch (error) {
      console.error("Error in login route:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

app.post("/api/auth/sync", verifyToken, async (req: Request, res: Response) => {
  try {
    const { uid, email } = req.body;
    const decodedToken = req.user!;

    if (decodedToken.uid !== uid || decodedToken.email !== email) {
      return res.status(403).json({ error: "Token mismatch" });
    }

    return res.status(200).json({ message: "User synced successfully" });
  } catch (error) {
    console.error("Error in sync route:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

const concerts = [
  {
    id: "1",
    name: "Arijit Singh Live",
    date: "2025-08-10",
    time: "19:30",
    venue: "Gachibowli Stadium",
    city: "Hyderabad",
    image: "/images/arijit.jpg",
    price: 1499,
  },
  {
    id: "2",
    name: "Prateek Kuhad India Tour",
    date: "2025-09-02",
    time: "20:00",
    venue: "Phoenix Arena",
    city: "Bengaluru",
    image: "/images/prateek.jpg",
    price: 1199,
  },
];

const sports = [
  {
    id: "1",
    title: "IPL Final 2025",
    date: "2025-05-28",
    location: "Ahmedabad",
    image:
      "https://th.bing.com/th/id/OIP.m47FmnxFZsbPVArqMP8LDwHaD4?w=342&h=180&c=7&r=0&o=7&dpr=1.4&pid=1.7&rm=3",
  },
  {
    id: "2",
    title: "Pro Kabaddi League",
    date: "2025-07-15",
    location: "Hyderabad",
    image:
      "https://bsmedia.business-standard.com/_media/bs/img/article/2024-03/01/full/1709308983-723.jpg?im=FeatureCrop,size=(803,452)",
  },
  {
    id: "3",
    title: "Indian Super League",
    date: "2025-10-10",
    location: "Goa",
    image:
      "https://th.bing.com/th/id/OIP.oEWtYY30Wa821BpA8Nu32QHaEK?w=295&h=180&c=7&r=0&o=7&dpr=1.4&pid=1.7&rm=3",
  },
];

const theatreAndArts = [
  {
    id: "1",
    title: "Shakespeare's Hamlet - Live Play",
    date: "2025-08-28",
    location: "Mumbai",
    image:
      "https://th.bing.com/th/id/OIP.gOEMNyUr5IGHdotrrywUhQHaDQ?w=342&h=154&c=7&r=0&o=5&dpr=1.4&pid=1.7",
    type: "Theatre",
  },
  {
    id: "2",
    title: "Indian Classical Dance Show",
    date: "2025-09-05",
    location: "Chennai",
    image:
      "https://th.bing.com/th/id/OIP.NxzX5rl30wqLCt8SKaTNIAHaE8?w=270&h=180&c=7&r=0&o=7&dpr=1.4&pid=1.7&rm=3",
    type: "Art",
  },
  {
    id: "3",
    title: "Modern Art Exhibition - Colours of Mind",
    date: "2025-09-15",
    location: "Delhi",
    image:
      "https://static.theprint.in/wp-content/uploads/2023/05/ANI-20230514095742.jpg",
    type: "Art",
  },
  {
    id: "4",
    title: "Stand-up Comedy Night",
    date: "2025-09-20",
    location: "Bangalore",
    image:
      "https://tse2.mm.bing.net/th/id/OIP.hjTXYQg8cfU7nmXJ0QsGNgHaED?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    type: "Theatre",
  },
];

app.get("/api/concerts", (req: Request, res: Response) => {
  try {
    res.status(200).json({
      success: true,
      data: concerts,
      count: concerts.length,
    });
  } catch (error) {
    console.error("Error fetching concerts:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      message: "Failed to fetch concerts",
    });
  }
});

app.get("/api/concerts/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const concert = concerts.find((c) => c.id === id);

    if (concert) {
      res.status(200).json({
        success: true,
        data: concert,
      });
    } else {
      res.status(404).json({
        success: false,
        error: "Concert not found",
        message: `Concert with ID ${id} does not exist`,
      });
    }
  } catch (error) {
    console.error("Error fetching concert:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      message: "Failed to fetch concert details",
    });
  }
});

app.get("/api/sports", (req: Request, res: Response) => {
  try {
    res.status(200).json({
      success: true,
      data: sports,
      count: sports.length,
    });
  } catch (error) {
    console.error("Error fetching sports:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      message: "Failed to fetch sports events",
    });
  }
});

app.get("/api/sports/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const event = sports.find((e) => e.id === id);

    if (event) {
      res.status(200).json({
        success: true,
        data: event,
      });
    } else {
      res.status(404).json({
        success: false,
        error: "Sports event not found",
        message: `Sports event with ID ${id} does not exist`,
      });
    }
  } catch (error) {
    console.error("Error fetching sports event:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      message: "Failed to fetch sports event details",
    });
  }
});

app.get("/api/theatre-arts", (req: Request, res: Response) => {
  try {
    res.status(200).json({
      success: true,
      data: theatreAndArts,
      count: theatreAndArts.length,
    });
  } catch (error) {
    console.error("Error fetching theatre and arts:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      message: "Failed to fetch theatre and arts events",
    });
  }
});

app.get("/api/theatre-arts/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log("/api/theatre-arts/:id requested with id:", id);
    const event = theatreAndArts.find((e) => e.id === id);

    if (event) {
      res.status(200).json({
        success: true,
        data: event,
      });
    } else {
      res.status(404).json({
        success: false,
        error: "Theatre/Art event not found",
        message: `Theatre/Art event with ID ${id} does not exist`,
      });
    }
  } catch (error) {
    console.error("Error fetching theatre/art event:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      message: "Failed to fetch theatre/art event details",
    });
  }
});

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error("❌ GEMINI_API_KEY is not set in environment variables");
  console.error(
    "Please set GEMINI_API_KEY in your .env file or environment variables"
  );
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

app.post("/chat", async (req: Request, res: Response) => {
  const { message } = req.body;

  if (!message || typeof message !== "string" || message.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: "Message is required",
      message: "Please provide a valid message",
    });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    const result = await model.generateContent(`
You are an AI assistant integrated into a movie ticket booking web application called "SHOWTIMEGO". Help users with questions related to:
- Movie listings and show timings
- Concert bookings and details
- Sports event bookings
- Theatre and arts events
- Booking availability and ticket pricing
- General app navigation

Keep responses conversational, polite, and helpful. Answer only based on the app's features and scope. If a user asks something out of scope (e.g., international bookings, movie reviews, etc.), politely redirect them back to the app's features.

Here is the latest user query:
"${message.trim()}"
`);

    const text = result.response.text();
    res.status(200).json({
      success: true,
      reply: text,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Gemini API error:", error);
    res.status(500).json({
      success: false,
      error: "AI chat service temporarily unavailable",
      message: "Something went wrong with AI chat. Please try again.",
    });
  }
});

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "🎬 SHOWTIMEGO API Server",
    status: "Running",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
    endpoints: {
      health: "/health",
      concerts: {
        list: "/api/concerts",
        details: "/api/concerts/:id",
      },
      sports: {
        list: "/api/sports",
        details: "/api/sports/:id",
      },
      theatreArts: {
        list: "/api/theatre-arts",
        details: "/api/theatre-arts/:id",
      },
      chat: "/chat",
      auth: {
        login: "/api/auth/login (POST)",
        sync: "/api/auth/sync (POST)",
      },
    },
  });
});

app.get("/health", (req: Request, res: Response) => {
  const healthData = {
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV || "development",
    version: "1.0.0",
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + " MB",
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + " MB",
    },
    services: {
      firebase: "Connected",
      gemini: API_KEY ? "Connected" : "Not configured",
    },
  };

  res.status(200).json(healthData);
});

// 404 handler (correct wildcard syntax)
app.use("*", (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
    message: `The requested endpoint ${req.method} ${req.originalUrl} does not exist`,
    availableEndpoints: [
      "GET /",
      "GET /health",
      "GET /api/concerts",
      "GET /api/concerts/:id",
      "GET /api/sports",
      "GET /api/sports/:id",
      "GET /api/theatre-arts",
      "GET /api/theatre-arts/:id",
      "POST /chat",
      "POST /api/auth/login",
      "POST /api/auth/sync",
    ],
  });
});

app.use((error: Error, req: Request, res: Response, _next: NextFunction) => {
  console.error("❌ Unhandled error:", error);
  res.status(500).json({
    success: false,
    error: "Internal server error",
    message:
      process.env.NODE_ENV === "development"
        ? error.message
        : "Something went wrong",
  });
});

import { Server } from "http";
let server: Server;

const gracefulShutdown = (signal: string) => {
  console.log(`\n📡 Received ${signal}. Shutting down gracefully...`);
  if (server) {
    server.close(() => {
      console.log("✅ HTTP server closed.");
      process.exit(0);
    });

    setTimeout(() => {
      console.error(
        "❌ Could not close connections in time, forcefully shutting down"
      );
      process.exit(1);
    }, 30000);
  } else {
    process.exit(0);
  }
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

server = app.listen(Number(port), host, () => {
  console.log("\n🚀 SHOWTIMEGO Server Started Successfully!");
  console.log("═══════════════════════════════════════════");
  console.log(`📍 Server URL: http://${host}:${port}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🏥 Health Check: http://${host}:${port}/health`);
  console.log(`🤖 Chat Endpoint: http://${host}:${port}/chat`);
  console.log("═══════════════════════════════════════════");

  console.log("\n📡 Network Interfaces:");
  const nets = networkInterfaces();
  Object.keys(nets).forEach((name) => {
    nets[name]?.forEach((net) => {
      if (net.family === "IPv4" && !net.internal) {
        console.log(`   🌐 ${name}: http://${net.address}:${port}`);
      }
    });
  });

  console.log(
    "\n✅ Server is ready to accept connections from anywhere in the world!"
  );
});

server.on("error", (error: NodeJS.ErrnoException) => {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  switch (error.code) {
    case "EACCES":
      console.error(`❌ ${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(`❌ ${bind} is already in use`);
      console.log(`💡 Try using a different port: PORT=3001 npm start`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});

export default app;
