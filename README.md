# Linear Clone

A high-fidelity clone of [Linear.app](https://linear.app/), built to replicate its premium UI/UX, speed, and core issue tracking functionalities. This project demonstrates sophisticated frontend engineering with Next.js 14, real-time data synchronization using Supabase, and AI-powered features.

![Linear Clone Screenshot](linear_clone.png)

## ✨ Key Features

### 🎨 Premium UI/UX
-   **Pixel-Perfect Design**: Meticulously crafted interface matching Linear's dark mode aesthetic.
-   **Glassmorphism & Blur Effects**: Modern visual depth using backdrop filters and subtle transparencies.
-   **Micro-interactions**: Smooth transitions, hover states, and animations powered by standard CSS and Tailwind.
-   **Keyboard First**: Optimized for power users with keyboard shortcuts support.

### 🛠 Project & Issue Management
-   **Workspaces & Projects**: Create multiple projects with custom colors, keys, and descriptions.
-   **Issue Tracking**: Full lifecycle management (Backlog, Todo, In Progress, Done, Canceled).
-   **Views**:
    -   **List View**: Dense, information-rich list for scanning multiple issues.
    -   **Board View (Kanban)**: Drag-and-drop interface for visual workflow management.
-   **Issue Details**: Modal view for editing titles, descriptions, status, priority, and assignees.
-   **Filtering & Sorting**: Group issues by status, priority, or project.

### ⚡ Real-time Collaboration
-   **Live Updates**: Changes to issues (creation, status updates, assignment) are reflected instantly across all clients using **Supabase Realtime**.
-   **Optimistic UI**: Interface updates immediately before the server confirms, ensuring a "snappy" feel.

### 🤖 AI Integration (Powered by Gemini)
-   **Smart Analysis**: Analyze issue descriptions to automatically suggest priorities and complexity scores.
-   **Insight Generation**: Get AI-generated summaries and reasoning for issue triage.

### 👥 Team Management
-   **Project Members**: Add team members to specific projects during creation.
-   **Assignees**: Dynamic assignee dropdowns filtered by project membership.
-   **Authentication**: Secure email/password login and session management via Supabase Auth.

## 🏗 Tech Stack

-   **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server Actions)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Drag & Drop**: [dnd-kit](https://dndkit.com/)
-   **AI**: [Google Gemini API](https://deepmind.google/technologies/gemini/)

## 🚀 Getting Started

### Prerequisites
-   Node.js 18+
-   npm, yarn, or bun
-   A Supabase project

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
    Create a `.env.local` file in the root directory and add your Supabase and Gemini credentials:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    GEMINI_API_KEY=your_gemini_api_key
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open-sourced under the MIT License.
