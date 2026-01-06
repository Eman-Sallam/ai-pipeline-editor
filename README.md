# AI Pipeline Editor

A visual AI pipeline editor built with React and TypeScript that allows users to graphically compose AI pipelines by adding, connecting, and executing processing nodes.

---

## 🎯 Overview

This application provides an interactive web-based tool for building AI pipelines through a drag-and-drop interface. Users can:

- Fetch node types from an API-driven palette
- Drag nodes onto a canvas and position them freely
- Connect nodes to define data flow (output → input)
- Execute pipelines with simulated processing
- View execution logs and execution progress in real time

---

## ✨ Features

### Core Requirements (All Implemented)

- ✅ **API-Driven Node Palette**
  - Fetches node types from a mock FastAPI backend
  - Loading and error states are handled gracefully
- ✅ **Interactive Canvas**
  - Drag-and-drop nodes using React Flow
  - Visual connections with arrows indicating data flow
- ✅ **Node Connection Rules**
  - Output → input connections only
  - No self-connections
  - No cycles
  - Each node has **one input and one output** (branching is
    intentionally disallowed)
- ✅ **Pipeline Execution Simulation**
  - Execution order determined using topological sort
  - Nodes execute sequentially with simulated delays
  - Visual node status updates (idle → running → completed)
  - Execution logs with timestamps
- ✅ **Responsive Layout**
  - Adapts to different screen sizes
  - Considered a UX enhancement beyond core requirements
- ✅ **Loading States & Error Handling**:
  - Loading indicators during API calls
  - Error messages for failed requests
  - Disabled states during execution
  - Graceful error logging
- ✅ **Testing**
  - Unit tests for graph validation, execution logic, and hooks
  - Deterministic execution logic to ensure stable tests
- ✅ **Code Quality**:
  - TypeScript for type safety
  - Clear separation of concerns
  - Includes unit tests for graph validation and execution logic

---

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.2 with TypeScript
- **Build Tool**: Vite 7.2
- **Node Editor**: React Flow 11.11
- **Styling**: Tailwind CSS 4.1 + DaisyUI
- **State Management**: React Context API + Custom Hooks
- **Testing**: Vitest + React Testing Library
- **Backend API**: FastAPI (Python) - Mock service
- **Containerization**: Docker + Docker Compose
- **Icons**: Heroicons

---

## 📋 Prerequisites

- **Node.js**: v18+ (tested with v18+)
- **npm**: v9+ (or yarn/pnpm)
- **Docker**: v20+ (for containerized deployment)
- **Python**: v3.10+ (for running the mock API locally, if not using Docker)

---

## 🚀 Setup Instructions

### Option 1: Local Development (Without Docker)

#### 1. Clone the repository

```bash
git clone https://github.com/Eman-Sallam/ai-pipeline-editor.git
cd ai-pipeline-editor
```

#### 2. Install frontend dependencies

```bash
npm install
```

#### 3. Start the mock API

**Option A: Using Python**

```bash
python -m pip install fastapi "uvicorn[standard]"
python -m uvicorn app:app --reload
```

**Note**: If `python` is not available, use `python3` instead:

```bash
python3 -m pip install fastapi "uvicorn[standard]"
python3 -m uvicorn app:app --reload
```

**Option B: Using Docker (Backend only)**

```bash
docker build -f Dockerfile.api -t pipeline-api .
docker run -p 8000:8000 pipeline-api
```

The API will be available at: **http://localhost:8000**

#### 4. Start the frontend

```bash
npm run dev
```

Frontend will be available at: http://localhost:5173

---

### Option 2: Dockerized Setup (Recommended)

Run both frontend and backend using Docker Compose:

```bash
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

#### Important: API Base URL Configuration

The `VITE_API_BASE_URL` environment variable is injected at **build time** (not runtime). Since requests are executed by the browser, use `http://localhost:8000`.

Default value: `http://localhost:8000`

#### Docker Files

- **`Dockerfile`** – Frontend (Vite → Nginx, multi-stage build)
- **`Dockerfile.api`** – Backend (FastAPI)
- **`docker-compose.yml`** – Defines and runs the frontend and backend services

---

## 🧪 Testing

Run all tests:

```bash
npm test
```

Test coverage includes: - Graph validation (cycles, invalid
connections) - Execution order (topological sort) - Pipeline execution
hook - Connection validation rules

---

## 📁 Project Structure

    src/
    ├── api/            # API client
    ├── components/     # UI components
    ├── contexts/       # React Context
    ├── graph/          # Graph algorithms & validation
    ├── hooks/          # Custom hooks
    ├── pages/          # Page-level components
    ├── types/          # Type definitions
    └── test/           # Test setup

---

## 🏗️ Architecture & Design Decisions

### State Management

The application uses **React Context** for shared pipeline state (nodes,
edges, execution status) and **custom hooks** for business logic. This
keeps the solution lightweight and avoids unnecessary external state
libraries.

---

### Graph Algorithms

- **Topological Sort** Used to determine a valid
  execution order for nodes.

- **Cycle Detection (DFS)** Prevents invalid pipelines before
  execution.

Both algorithms run in linear time relative to graph size.

---

### Component Architecture

**Modular Design**: Components are organized by responsibility:

- **FlowCanvas**: Handles React Flow integration, drag-and-drop, connections
- **PipelineNode**: Custom node component with status visualization
- **NodePalette**: Manages API fetching, loading states, and node type display
- **ExecutionLog**: Displays execution logs with filtering and timestamps
- **PipelineContext**: Centralized state management

---

### Error Handling

Error handling focuses strictly on the task requirements:

- **API Errors**: Failed node-type fetches are surfaced with clear
  messages and retry options
- **Validation Errors**: Invalid pipelines (empty, disconnected,
  cyclic) are blocked before execution
- **Execution Errors**: Errors during execution are logged and
  reflected in execution status

All errors are visible through execution logs and UI state changes.

---

### UI / UX

- Clean and minimal interface focused on the pipeline-building workflow
- Clear visual feedback for node execution states (idle, running, completed, error)
- Basic loading and error states for API requests and execution
- Responsive layout that adapts to different screen sizes as a lightweight UX enhancement

---

## 🔍 Key Implementation Details

### Connection Validation Rules

1. **Output → Input Only**: Enforced by React Flow handle types
2. **No Self-Connections**: Validated before edge creation
3. **One Input Per Node**: Each node accepts maximum one input connection
4. **One Output Per Node**: Each node accepts maximum one output connection
5. **No Cycles**: DFS-based cycle detection before connection creation

---

### Execution Flow

1. **Validation**: Check graph structure (empty, disconnected nodes, cycles)
2. **Reset**: Set all nodes to 'idle' status
3. **Topological Sort**: Determine execution order
4. **Sequential Execution**: Process nodes one by one with delays
5. **State Updates**: Update node status and logs in real-time
6. **Completion**: Mark execution as completed or error

---

### API Integration

- **Base URL**: Configurable via `VITE_API_BASE_URL` environment variable
- **Retry Logic**: Basic retry logic for failed requests (UX enhancement)
- **Error Types**: Custom `ApiError` class with status codes
- **Response Validation**: Type checking and structure validation

---

## ⚠️ Assumptions & Limitations

- The pipeline is **linear** (no branching / merging).
- Each node has **one input and one output**.
- Node execution is **simulated** (no real AI models).
- Validation prevents:
  - self-loops
  - multiple inputs/outputs
  - cycles

---

## 📝 Development Scripts

```bash
# Development
npm run dev          # Start Vite dev server

# Building
npm run build        # Build for production

# Testing
npm test             # Run tests in watch mode
```

---

### Environment Configuration

The project includes a `.env.example` file to document the required environment variables.
By default, the frontend is configured to connect to the local mock API at `http://localhost:8000` for local development.
