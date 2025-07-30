// import fs from "fs";
// import path from "path";
// import admin from "firebase-admin";

// // Try to load service account from file first
// let serviceAccount: any = null;

// try {
//   const serviceAccountPath = path.resolve(
//     __dirname,
//     "./firebase-service-account.json"
//   );
//   if (fs.existsSync(serviceAccountPath)) {
//     const serviceAccountData = fs.readFileSync(serviceAccountPath, "utf8");
//     serviceAccount = JSON.parse(serviceAccountData);
//     console.log("✅ Loaded Firebase service account from file");
//   } else {
//     console.log(
//       "⚠️ Service account file not found, will use environment variables."
//     );
//   }
// } catch (error) {
//   console.log(
//     "⚠️ Service account file error, will use environment variables.",
//     error
//   );
// }

// // Initialize Firebase Admin only once
// if (!admin.apps.length) {
//   try {
//     if (serviceAccount) {
//       admin.initializeApp({
//         credential: admin.credential.cert(serviceAccount),
//       });
//       console.log("✅ Firebase Admin initialized with service account file");
//     } else {
//       // Validate environment variables
//       if (
//         !process.env.FIREBASE_PROJECT_ID ||
//         !process.env.FIREBASE_CLIENT_EMAIL ||
//         !process.env.FIREBASE_PRIVATE_KEY
//       ) {
//         throw new Error(
//           "Missing Firebase environment variables. Please check FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY"
//         );
//       }
//       admin.initializeApp({
//         credential: admin.credential.cert({
//           projectId: process.env.FIREBASE_PROJECT_ID,
//           clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
//           privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
//         }),
//       });
//       console.log("✅ Firebase Admin initialized with environment variables");
//     }
//   } catch (error) {
//     console.error("❌ Failed to initialize Firebase Admin:", error);
//     throw error;
//   }
// }

// // (Optional) helper to get the current app instance, if needed elsewhere
// export const initializeApp = () => admin.app();

// export default admin;

import admin from "firebase-admin";
import fs from "fs";
import path from "path";

// Interface for service account structure
interface ServiceAccount {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
}

// Check if Firebase Admin is already initialized
if (!admin.apps.length) {
  try {
    let initialized = false;

    // Method 1: Try environment variables first (recommended for production)
    if (
      process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY
    ) {
      // Validate environment variables
      const projectId = process.env.FIREBASE_PROJECT_ID.trim();
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL.trim();
      const privateKey = process.env.FIREBASE_PRIVATE_KEY;

      if (!projectId || !clientEmail || !privateKey) {
        throw new Error("Firebase environment variables are empty or invalid");
      }

      // Format private key properly - handle both escaped and unescaped newlines
      const formattedPrivateKey = privateKey
        .replace(/\\n/g, "\n")
        .replace(/"/g, "")
        .trim();

      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey: formattedPrivateKey,
        }),
      });

      console.log("✅ Firebase Admin initialized with environment variables");
      initialized = true;
    }

    // Method 2: Try service account file (for local development)
    if (!initialized) {
      const serviceAccountPath = path.resolve(
        __dirname,
        "./firebase-service-account.json"
      );

      if (fs.existsSync(serviceAccountPath)) {
        try {
          const serviceAccountData = fs.readFileSync(
            serviceAccountPath,
            "utf8"
          );
          const serviceAccount: ServiceAccount = JSON.parse(serviceAccountData);

          // Validate service account structure
          if (
            !serviceAccount.project_id ||
            !serviceAccount.client_email ||
            !serviceAccount.private_key
          ) {
            throw new Error("Invalid service account file structure");
          }

          admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
          });

          console.log(
            "✅ Firebase Admin initialized with local service account file"
          );
          initialized = true;
        } catch (fileError) {
          console.error("❌ Error reading service account file:", fileError);
          throw new Error(`Failed to parse service account file: ${fileError}`);
        }
      }
    }

    // Method 3: Try require() as fallback (for different project structures)
    if (!initialized) {
      try {
        const serviceAccount = require("./firebase-service-account.json");

        // Validate required fields
        if (
          !serviceAccount.project_id ||
          !serviceAccount.client_email ||
          !serviceAccount.private_key
        ) {
          throw new Error("Service account file missing required fields");
        }

        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });

        console.log(
          "✅ Firebase Admin initialized with required service account file"
        );
        initialized = true;
      } catch (requireError) {
        console.log("⚠️ Could not require service account file:", requireError);
      }
    }

    // If none of the methods worked, throw an error
    if (!initialized) {
      throw new Error(`
❌ Firebase Admin initialization failed. Please ensure one of the following:

1. Environment Variables (Recommended for production):
   - FIREBASE_PROJECT_ID
   - FIREBASE_CLIENT_EMAIL  
   - FIREBASE_PRIVATE_KEY

2. Service Account File (For local development):
   - Place 'firebase-service-account.json' in the utils/ directory
   - Or ensure the file is accessible via require()

Current environment variables status:
- FIREBASE_PROJECT_ID: ${
        process.env.FIREBASE_PROJECT_ID ? "✅ Set" : "❌ Missing"
      }
- FIREBASE_CLIENT_EMAIL: ${
        process.env.FIREBASE_CLIENT_EMAIL ? "✅ Set" : "❌ Missing"
      }
- FIREBASE_PRIVATE_KEY: ${
        process.env.FIREBASE_PRIVATE_KEY ? "✅ Set" : "❌ Missing"
      }

Service account file status:
- Path: ${path.resolve(__dirname, "./firebase-service-account.json")}
- Exists: ${
        fs.existsSync(
          path.resolve(__dirname, "./firebase-service-account.json")
        )
          ? "✅ Yes"
          : "❌ No"
      }
      `);
    }
  } catch (error) {
    console.error("❌ Critical Firebase Admin initialization error:", error);
    process.exit(1); // Exit the process since Firebase is critical
  }
} else {
  console.log("ℹ️ Firebase Admin was already initialized");
}

// Export helper functions
export const getFirebaseApp = () => {
  if (!admin.apps.length) {
    throw new Error("Firebase Admin is not initialized");
  }
  return admin.app();
};

export const isFirebaseInitialized = () => {
  return admin.apps.length > 0;
};

// Verify the connection works
export const verifyFirebaseConnection = async (): Promise<boolean> => {
  try {
    // Try to access Firebase Auth to verify connection
    await admin.auth().listUsers(1);
    console.log("✅ Firebase connection verified successfully");
    return true;
  } catch (error) {
    console.error("❌ Firebase connection verification failed:", error);
    return false;
  }
};

export default admin;
