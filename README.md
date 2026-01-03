<h1 align="center">
  <a href="https://devollox.fun/">Modern Website</a>
</h1>

## About the Project

This is my personal portfolio website built with [Next.js](https://nextjs.org/).
It includes a real-time Signature guestbook, a detailed Uses page with tools and setup, a small blog, OAuth login (Google/GitHub) and light/dark themes. 

The project is still evolving, so if you spot any bugs, typos or have ideas for improvements, feel free to open an issue or pull request.

---

## Key Features

- **Real-time Signature Guestbook**  
  Visitors can leave signatures on the Signature page, which are stored in Firebase and appear instantly for everyone without a page reload.

- **Live Uses Reactions**  
  The Uses page lists your tools, stack, and workstation setup, and users can react to specific items. These reactions are tracked in Realtime Database so popularity and counts update live.

- **Real-time Presence on About**  
  The About page includes real-time cursor presence: each visitor’s cursor position and metadata are synced through Firebase so multiple users can see each other “live” on the page, creating a collaborative feel.

- **OAuth Authentication (Google & GitHub)**  
  Sign-in is handled via NextAuth with Google and GitHub providers, allowing authenticated features (like personalized signatures or future gated content) while keeping setup simple through environment variables.

- **Content & Navigation**  
  The site uses file-based routing and Markdown-backed blog posts to keep content easy to extend, plus a cmdk-powered command palette for quick keyboard navigation across pages and actions.

- **Theming & UX**  
  Light/dark themes, subtle animations, and a minimal layout make the portfolio feel modern and fast, while still being straightforward to run locally with a single `npm run dev` after configuring `.env.local` and Firebase rules.

---

## Getting this project up and running

1.  **Fork or Clone**

    Fork or clone this project from Github to get your own copy of it.

1.  **Installation**
     
    Once this is installed you can run `npm install` in your project directory to install dependencies.

    ```sh
    npm i --legacy-peer-deps
    ```

1.  **Start developing.**

    Navigate into your new site’s directory and start it up.

    ```sh
    npm run dev
    ```
    
---

## Setup Instructions

To run the project locally, you need to configure environment variables and Firebase.


### Create a Firebase project in [Firebase Console]([https://console.cloud.google.com/](https://console.firebase.google.com/)):

Obtain your API keys and configuration values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_DATABASE_URL=your-url-firebase
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id


Firebase Console → Project Settings → Service accounts → Firebase Admin SDK → Generate new private key
FIREBASE_PROJECT_ID=your-project-id           
FIREBASE_CLIENT_EMAIL=your-service-account-email  
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

> Important: `FIREBASE_PRIVATE_KEY` must be a single line with `\n` instead of actual line breaks, otherwise Firebase Admin will not initialize.

### Firebase Rules

<details>
  <summary>Show Firebase rules</summary>

  See full Firebase Realtime Database rules in  
 [FIREBASE-RULES.md](https://github.com/Devollox/Personal-WebSite/blob/main/FIREBASE-RULES.md)

</details>

### OAuth and External Services

Create OAuth applications in Google and GitHub:

- **Google OAuth:**
  - `GOOGLE_SECRET`
  - `GOOGLE_ID`

- **GitHub OAuth:**
  - `GITHUB_SECRET`
  - `GITHUB_ID`

**Setup Steps:**

1. Go to [Google Cloud Console](https://console.cloud.google.com/) and create an OAuth client.
2. Set authorized redirect URIs (e.g., `http://localhost:3000/api/auth/callback/...` for local development).
3. Copy your `Client ID` and `Client Secret`.
4. Add these to your `.env.local` file:

```env
GOOGLE_SECRET=your-google-secret
GOOGLE_ID=your-google-client-id
GITHUB_SECRET=your-github-secret
GITHUB_ID=your-github-client-id
```

### Firebase and Google redirect

```env
Local:
- http://localhost:3000/api/auth/callback/google
- http://localhost:3000/api/auth/callback/github

Production:
- https://www.devollox.fun/api/auth/callback/google
- https://www.devollox.fun/api/auth/callback/github
```

---
## Contributing

Contributions are welcome!  
See [CONTRIBUTING.md](./CONTRIBUTING.md) for details on setup, workflow and what kind of changes fit this project.
