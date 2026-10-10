# 🎓 EduPulse - Full-Stack Student Management System

A modern, responsive, and deployment-ready **Student Management System** built with **HTML, Vanilla CSS, Vanilla JavaScript, Node.js, Express**, and **Supabase PostgreSQL**. Authenticated securely with **Student Registration Numbers, Bcrypt, and HTTP-Only JWT cookies**.

Designed for seamless deployment on **Vercel** serverless functions with a shared cloud database hosted on **Supabase**.

---

## 🌟 Key Features

- 🔐 **Secure Authentication**: Log in using a unique Student Registration Number (e.g. `REG2026001`) and password.
- 🛡️ **Bcrypt Password Protection**: Server-side password verification; plain-text passwords are never stored.
- 🍪 **HTTP-Only JWT Cookies**: Token-based authentication using HTTP-Only cookies for maximum security against XSS.
- 📊 **Student Dashboard**: Real-time view of cumulative GPA, enrolled courses, letter grades, attendance percentages, and profile details.
- 🗄️ **Supabase PostgreSQL DB**: Cloud-hosted relational database accessible 24/7 across devices and Vercel.
- 🚀 **Demo Mock Mode**: Works out of the box locally even before configuring Supabase environment variables.
- 🌓 **Dark & Light Mode**: Built-in visual theme switcher with local storage persistence.
- 📱 **Responsive Design**: Glassmorphism aesthetic tailored for desktop, tablet, and mobile screens.

---

## 🔑 Demo Student Credentials (For Testing)

| Registration Number | Password | Student Name | Department |
| :--- | :--- | :--- | :--- |
| **`REG2026001`** | `Password@123` | Alex Morgan | Computer Science & Engineering |
| **`REG2026002`** | `Student@456` | Sophia Chen | Data Science & AI |
| **`REG2026003`** | `Pass@789` | Marcus Vance | Information Technology |

---

## 📁 Project Structure

```
student-management-system/
├── api/
│   └── index.js              # Vercel Serverless Function entry point
├── database/
│   └── schema.sql            # Supabase PostgreSQL schema & seed script
├── public/
│   ├── css/
│   │   └── styles.css        # Custom Glassmorphism CSS design system
│   ├── js/
│   │   └── app.js            # Client SPA state & API fetch logic
│   └── index.html            # Main HTML UI (Login & Dashboard Tabs)
├── .env.example              # Environment variables template
├── package.json              # Project dependencies & scripts
├── server.js                 # Express server & API endpoints
├── vercel.json               # Vercel deployment configuration
└── README.md                 # Documentation
```

---

## 🛠️ Step-by-Step Setup Guide

### 1. Supabase Cloud Database Setup

1. Sign up / Log in to [Supabase](https://supabase.com).
2. Create a **New Project** (e.g., `student-management-db`).
3. Once the project is provisioned, navigate to the **SQL Editor** tab in the left sidebar.
4. Click **New Query**, copy the contents of [`database/schema.sql`](file:///d:/student%20management%20system/database/schema.sql), paste it into the editor, and click **Run**.
   *This creates the `students`, `courses`, and `attendance` tables, enables RLS, and inserts the seed demo data.*
5. Navigate to **Project Settings -> API** in Supabase and copy:
   - **Project URL** (`SUPABASE_URL`)
   - **Service Role Key** (`SUPABASE_SERVICE_ROLE_KEY`) *(Required for backend SQL operations)*

---

### 2. Local Development

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Open `.env` and fill in your Supabase credentials:
   ```env
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   JWT_SECRET=super_secret_jwt_key_student_management_2026
   PORT=3000
   NODE_ENV=development
   ```

3. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000`.

---

### 3. Deploying to Vercel

1. **Push to GitHub**:
   Initialize git and push your project to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Student Management System"
   git remote add origin https://github.com/your-username/student-management-system.git
   git branch -M main
   git push -u origin main
   ```

2. **Import Project into Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com).
   - Click **Add New -> Project** and select your GitHub repository.
   - Set Framework Preset to **Other** (Vercel automatically detects `vercel.json`).

3. **Add Environment Variables in Vercel**:
   Under **Environment Variables**, add:
   - `SUPABASE_URL`: `https://your-project-id.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY`: `your-supabase-service-role-key`
   - `JWT_SECRET`: `your_random_secure_jwt_secret`
   - `NODE_ENV`: `production`

4. Click **Deploy**!
   Your full-stack Student Management System will be live at a public URL (e.g. `https://student-management-system.vercel.app`).

---

## 🔒 Security Practices Implemented

- Password hashing using `bcryptjs` with salt factor 10.
- JWT tokens signed with server-side secrets and sent in `HttpOnly`, `SameSite=Lax` cookies.
- Server-side authorization checks for student data scoping (`/api/student/me`).
- Zero disclosure of database service keys to client-side code.

---

## 📄 License

Distributed under the MIT License.
