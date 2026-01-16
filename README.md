# Linear Clone

A high-fidelity, high-performance clone of [Linear.app](https://linear.app/), built to replicate its premium UI/UX, keyboard-first workflow, and core issue tracking functionalities. This project demonstrates sophisticated frontend engineering with **Next.js 15**, real-time data synchronization using **Supabase**, and experimental AI integration with **Google Gemini**.

![Linear Clone Screenshot](linear_clone.png)

## ✨ Key Features

### 🎮 Command Menu (`Cmd+K`)
 The heart of the power-user experience. Access global actions from anywhere in the app.
- **Global Access**: Press `Cmd+K` (Mac) or `Ctrl+K` (Windows) instantly.
- **Navigation**:
    - **"Go to Projects"**: Clear filters and return to project selection.
    - **"Switch to Board View"**: Instantly toggle to Kanban mode.
    - **"Switch to List View"**: Return to the dense list view.
    - *Note: Navigation preserves your active project context automatically.*
- **Actions**:
    - **"Create Issue" (`C`)**: Open the global creation modal.
    - **"Show Active Issues"**: Filter current view to Todo/In Progress.
    - **"Log Out"**: Securely end your session.

### 🤖 AI-Powered Workflow (Gemini)
Integrated intelligence to speed up issue creation and triage.
- **Smart Autofill**: Type a simple title (e.g., "Fix login bug"), click **"Auto-fill"**, and watch the AI agent:
    - Draft a detailed markdown description.
    - Triage the priority (e.g., "High").
    - Suggest the initial status.
- **Batch Prioritization**: (Experimental) Select multiple backlog issues and ask AI to identify the most critical ones.

### 🛠 Project & Issue Management
- **Workspaces & Projects**: Multi-project architecture with custom keys and colors.
- **Issue Tracking**: Full CRUD with optimistic UI updates.
- **Views**:
    - **List View**: Information-dense, scannable rows.
    - **Board View (Kanban)**: Drag-and-drop workflow management using `@dnd-kit`.
- **Filtering**: Instant clients-side filtering for Active/Backlog items.

### ⚡ Real-time Collaboration
- **Live Sync**: Changes (status updates, new issues) reflect instantly on all connected clients via **Supabase Realtime**.
- **Optimistic UI**: Interactions (like dragging a card) update visually *before* the server confirmation, ensuring zero-latency feel.

### 🎨 Premium UI/UX
- **Pixel-Perfect Design**: Dark mode aesthetic matching Linear's specific color palette.
- **Glassmorphism**: Backdrop blurs on modals, sidebars, and toasts.
- **Keyboard First**: Every major action has a shortcut.
    - `C`: Create Issue
    - `Cmd+K`: Command Menu
    - `Esc`: Close modals
- **Responsive**: Fluid layout adapting to different screen sizes.

---

## 🏗 Tech Stack

-   **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Server Actions)
-   **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Custom Design System)
-   **Database**: [Supabase](https://supabase.com/) (PostgreSQL + Realtime)
-   **Auth**: Supabase Auth
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Drag & Drop**: [@dnd-kit](https://dndkit.com/)
-   **AI**: [Google Gemini API](https://deepmind.google/technologies/gemini/)
-   **UI Components**: [cmdk](https://cmdk.paco.me/) (Command Menu)

---

## 🚀 Getting Started

### Prerequisites
-   Node.js 18+
-   A Supabase project (Free Tier works)
-   Google Gemini API Key

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Arnav020/Linear-Clone.git
    cd Linear-Clone
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables**
    Create a `.env.local` file in the root directory:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    // Google Gemini API Key required for AI features
    GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_key
    ```
    *(Note: `GOOGLE_GENERATIVE_AI_API_KEY` is server-side only)*

4.  **Run the development server**
    ```bash
    npm run dev
    ```

5.  Open [https://linear-clone-blue.vercel.app/](https://linear-clone-blue.vercel.app/).

---

## 📄 License
This project is open-sourced under the MIT License.
