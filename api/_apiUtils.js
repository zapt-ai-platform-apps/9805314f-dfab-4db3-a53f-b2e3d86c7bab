import Sentry from "./_sentry.js";

export async function authenticateUser(req) {
  try {
    // For now, we'll just use a dummy user ID since we don't have auth implemented
    // In a real app, you'd validate tokens from auth headers
    console.log("Authenticating user for API request");
    return { id: 'user-1' };
  } catch (error) {
    console.error("Authentication error:", error);
    Sentry.captureException(error);
    throw new Error('Authentication failed');
  }
}