import fs from "fs";
import path from "path";
import admin from "firebase-admin";

// Try to load service account from file first
let serviceAccount: any = null;

try {
  const serviceAccountPath = path.resolve(
    __dirname,
    "./firebase-service-account.json"
  );
  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccountData = fs.readFileSync(serviceAccountPath, "utf8");
    serviceAccount = JSON.parse(serviceAccountData);
    console.log("✅ Loaded Firebase service account from file");
  } else {
    console.log(
      "⚠️ Service account file not found, will use environment variables."
    );
  }
} catch (error) {
  console.log(
    "⚠️ Service account file error, will use environment variables.",
    error
  );
}

// Initialize Firebase Admin only once
if (!admin.apps.length) {
  try {
    if (serviceAccount) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log("✅ Firebase Admin initialized with service account file");
    } else {
      // Validate environment variables
      if (
        !process.env.FIREBASE_PROJECT_ID ||
        !process.env.FIREBASE_CLIENT_EMAIL ||
        !process.env.FIREBASE_PRIVATE_KEY
      ) {
        throw new Error(
          "Missing Firebase environment variables. Please check FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY"
        );
      }
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        }),
      });
      console.log("✅ Firebase Admin initialized with environment variables");
    }
  } catch (error) {
    console.error("❌ Failed to initialize Firebase Admin:", error);
    throw error;
  }
}

// (Optional) helper to get the current app instance, if needed elsewhere
export const initializeApp = () => admin.app();

export default admin;
