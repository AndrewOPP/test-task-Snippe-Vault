# Snippet Vault

Snippet Vault is a monorepo full-stack application for managing your code snippets, terminal commands, and notes.

Built with a **NestJS** backend, a **Next.js** frontend, and **MongoDB** for storage. The monorepo is managed using **Turborepo** and **pnpm workspaces**.

## 🛠 Tech Stack

- **Frontend:** Next.js, Tailwind CSS
- **Backend:** NestJS, Mongoose, MongoDB
- **Tooling:** TypeScript, pnpm, Turborepo, ESLint, Prettier

---

## ⚙️ Environment Variables

Before starting the app, you need to set up your environment variables.

1. **Backend (`backend/.env`)**
   Create a `.env` file in the `backend` directory.

```env
# backend/.env
# Use this for local MongoDB (e.g., via Docker) or replace with your MongoDB Atlas URI
MONGO_URI="mongodb://root:rootpassword@localhost:27017/snippet_db?authSource=admin"
```

2. **Frontend (`frontend/.env.local`)**
   Create a `.env.local` file in the `frontend` directory.

```env
# frontend/.env.local
# Points to the local NestJS server
NEXT_PUBLIC_API_URL="http://localhost:3002"
```

---

## 🚀 How to Run Locally (Development)

1. **Install dependencies**

```bash
pnpm install
```

2. **Start MongoDB**
   If you are using Docker, start your database container:

```bash
docker compose up -d mongo
```

_(If you have a local MongoDB instance installed, just make sure it's running)._

3. **Seed the database (Optional but recommended)**
   Generate 45 realistic mock snippets to test pagination and filtering:

```bash
pnpm --filter backend run seed
```

4. **Start the development servers**
   Run both the frontend and backend simultaneously with Turborepo:

```bash
pnpm turbo run dev
```

- **Frontend is available at:** `http://localhost:3000`
- **Backend API is available at:** `http://localhost:3002`

---

## 🔍 API Endpoints & Testing

Here are some examples of how to interact with the backend API. The base URL is `http://localhost:3002`.

### 1. Get all snippets (with pagination)

```http
GET /snippets?page=1&limit=10
```

### 2. Create a new snippet

```http
POST /snippets
Content-Type: application/json

{
  "title": "My Awesome React Hook",
  "content": "text",
  "type": "code",
  "tags": ["react", "typescript"]
}
```

### 3. Update an existing snippet

```http
PATCH /snippets/:id
Content-Type: application/json

{
  "title": "Updated Title"
}
```

### 4. Delete a snippet

```http
DELETE /snippets/:id
```

---

## 📦 How to Build and Run in Production

To deploy the application to a production environment, you need to build the optimized files first.

### 1. Build the application

Run the build command from the root. Turborepo will efficiently compile both the Next.js frontend and the NestJS backend.

```bash
pnpm build
```

### 2. Start the Production Servers

In a real-world scenario, you would use a process manager like **PM2** or **Docker**. To test the production build locally, open two terminal windows and run:

**Start Backend (NestJS):**

```bash
pnpm --filter backend start:prod
```

**Start Frontend (Next.js):**

```bash
pnpm --filter frontend start
```

```


```
