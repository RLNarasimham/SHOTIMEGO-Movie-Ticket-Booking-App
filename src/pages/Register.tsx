import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Film, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import { auth } from "../config/firebase";

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setError("");
      setLoading(true);

      console.log("🚀 Creating user account...");

      // Create user account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      console.log("✅ User created successfully:", userCredential.user.uid);

      // Update profile with display name
      await updateProfile(userCredential.user, {
        displayName: formData.displayName,
      });

      console.log("✅ Profile updated with display name");

      // Send email verification with custom settings
      try {
        await sendEmailVerification(userCredential.user, {
          url: `${window.location.origin}/login?verified=true`, // Custom redirect URL
          handleCodeInApp: false, // This ensures the verification is handled by Firebase
        });
        console.log("✅ Verification email sent successfully");
      } catch (emailError) {
        console.error("❌ Error sending verification email:", emailError);
        // Don't throw error here - account is still created successfully
        console.log("⚠️ Account created but verification email failed to send");
      }

      // IMPORTANT: Sign out the user immediately after registration
      // This prevents them from being logged in before email verification
      await signOut(auth);
      console.log("✅ User signed out after registration");

      // Don't sync with backend until they verify email and login properly
      // Backend sync will happen during login instead

      setSuccess(true);

      // Redirect to login after 5 seconds
      setTimeout(() => navigate("/login"), 5000);
    } catch (error: any) {
      console.error("❌ Registration failed:", error);

      // Handle specific Firebase auth errors
      if (error.code === "auth/email-already-in-use") {
        setError(
          "This email is already registered. Please use a different email or try logging in."
        );
      } else if (error.code === "auth/weak-password") {
        setError("Password is too weak. Please choose a stronger password.");
      } else if (error.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (error.code === "auth/operation-not-allowed") {
        setError(
          "Email/password accounts are not enabled. Please contact support."
        );
      } else {
        setError(
          error.message || "Failed to create account. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (success && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (success && countdown === 0) {
      navigate("/login");
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [success, countdown, navigate]);

  if (success) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
        style={{ paddingTop: "10rem", paddingBottom: "9rem" }}
      >
        <div className="max-w-md w-full">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-8 text-center dark:bg-gray-800/95">
            <div className="flex justify-center items-center space-x-2 mb-4">
              <Film className="h-10 w-10 text-green-500" />
              <span className="text-2xl font-bold bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text text-transparent">
                Success!
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Account Created Successfully!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We've sent a verification email to{" "}
              <strong className="text-gray-900 dark:text-white">
                {formData.email}
              </strong>
            </p>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Important:</strong> You must verify your email before
                you can sign in. Please check your email (including spam/junk
                folder) and click the verification link.
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Next Steps:</strong>
                <br />
                1. Check your email for verification link
                <br />
                2. Click the verification link
                <br />
                3. Return to login page and sign in
              </p>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Redirecting to login page in {countdown} seconds...
            </p>
            <Link
              to="/login"
              className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Go to Login Now
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-2xl p-8">
          <div className="text-center dark:text-white">
            <div className="flex justify-center items-center space-x-2 mb-4">
              <Film className="h-10 w-10 text-red-500" />
              <span className="text-2xl font-bold bg-gradient-to-r from-red-500 to-purple-600 bg-clip-text text-transparent">
                SHOWTIMEGO
              </span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Create Account
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Join us to book your favorite movies
            </p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/40 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg mt-4">
              {error}
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="displayName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                >
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    id="displayName"
                    name="displayName"
                    type="text"
                    required
                    value={formData.displayName}
                    onChange={handleChange}
                    className="pl-10 w-full px-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 w-full px-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 pr-10 w-full px-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="pl-10 pr-10 w-full px-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold py-3 rounded-lg transition-colors focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:bg-red-700 dark:hover:bg-red-800 dark:disabled:bg-red-900"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            <div className="text-center">
              <span className="text-gray-600 dark:text-gray-300">
                Already have an account?{" "}
              </span>
              <Link
                to="/login"
                className="text-red-600 hover:text-red-700 font-semibold dark:text-red-400 dark:hover:text-red-300"
              >
                Sign in here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
