import admin from "firebase-admin";


if (!admin.apps.length) {
  let params: any = {};
  if (
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
  ) {
    params = {
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }),
    };
    console.log("✅ Firebase Admin initialized with environment variables");
  } else {
    try {
      const serviceAccount = require("./firebase-service-account.json");
      params = { credential: admin.credential.cert(serviceAccount) };
      console.log(
        "✅ Firebase Admin initialized with local service account file"
      );
    } catch (err) {
      console.error(
        "❌ No firebase-service-account.json and missing env vars. Cannot initialize Firebase Admin."
      );
      throw err;
    }
  }
  admin.initializeApp(params);
}

export default admin;
