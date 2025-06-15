import { google } from "googleapis";

let oauth2Client = null;

export const getOAuth2Client = () => {
  if (!oauth2Client) {
    oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      "http://localhost:8000/api/v1/users/google/login"
    );
  }
  return oauth2Client;
};
