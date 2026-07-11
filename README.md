# chatapp

A minimal real-time chat application built for fast, distraction-free messaging.

## Environment Variables

Create a `.env` file in the **project root** (same level as the `clientapp` and `server` directories) and add the following variables:

```env
MONGO_URI=Your_MONGO_URI
JWT_SECRET=Your_JWT_SECRET
JWT_TIMEOUT=Your_JWT_TIMEOUT
MAIL_USER=Your_MAIL_USER
MAIL_APP_PASSWORD=Your_MAIL_APP_PASSWORD
PORT=5000
OTP_EXPIRATION_MIN=5
TOKEN_EXPIRATION_MIN=5
AppName=JP Chat
```

### Project Structure

```text
project-root/
├── .env
├── clientapp/
├── server/
├── README.md
└── package.json
```

### Variable Description

| Variable               | Description                                          |
| ---------------------- | ---------------------------------------------------- |
| `MONGO_URI`            | MongoDB connection string.                           |
| `JWT_SECRET`           | Secret key used to sign JWT tokens.                  |
| `JWT_TIMEOUT`          | JWT token expiration time (e.g., `7d`, `24h`, `1h`). |
| `MAIL_USER`            | Email address used for sending OTP emails. (e.g., test@email.com)          |
| `MAIL_APP_PASSWORD`    | App password for the email account.                  |
| `PORT`                 | Server port (default: `5000`).                       |
| `OTP_EXPIRATION_MIN`   | OTP expiration time in minutes. (e.g., 5)                     |
| `TOKEN_EXPIRATION_MIN` | Password reset token expiration time in minutes. (e.g., 5)       |
| `AppName`              | Name of the application.                             |

> **Note:** Do not commit your `.env` file to version control. Ensure it is included in your `.gitignore`.

That's it! Have fun! 🎉

[![Watch the demo](https://raw.githubusercontent.com/jeelchheta/chatapp/refs/heads/main/video/chatapp.png)](https://github.com/jeelchheta/chatapp/blob/main/video/chatapp.mp4)