# AI Pipeline Editor

A visual AI pipeline editor built with React and TypeScript that allows users to graphically compose AI pipelines by adding, connecting, and executing processing nodes. This is a take-home assignment submission for a Senior Frontend Engineer position.

## 🎯 Overview

This application provides an interactive web-based tool for building AI pipelines through a drag-and-drop interface. Users can:

- Fetch node types from an API-driven palette
- Drag nodes onto a canvas and position them freely
- Connect nodes to define data flow (output → input)
- Execute pipelines with simulated processing and visual feedback
- View execution logs in real-time

## ✨ Features

### Core Requirements (All Implemented)

- ✅ **API-Driven Node Palette**: Fetches node types from a mock FastAPI backend with loading states and error handling
- ✅ **Interactive Canvas**: Drag-and-drop nodes onto canvas with React Flow, smooth repositioning, and visual feedback
- ✅ **Node Connection System**:
  - Enforces output → input connections only
  - Prevents cycles, self-connections, and invalid connections
  - Each node has one input and one output
  - Visual connection lines with arrows
- ✅ **Pipeline Execution**:
  - Topological sort-based execution order
  - Sequential node processing with simulated delays
  - Real-time UI updates (idle → running → completed states)
  - Detailed execution logs with timestamps
- ✅ **Responsive Layout**:
  - Mobile-first design with drawer/sidebar navigation
  - Adaptive layout for different screen sizes
  - Smooth component reflow
- ✅ **Loading States & Error Handling**:
  - Loading indicators during API calls
  - Error messages for failed requests with retry logic
  - Disabled states during execution
  - Graceful error logging
- ✅ **Code Quality**:
  - TypeScript for type safety
  - Modular component architecture
  - Clear separation of concerns
  - Comprehensive test coverage

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.2 with TypeScript
- **Build Tool**: Vite 7.2
- **Node Editor**: React Flow 11.11
- **Styling**: Tailwind CSS 4.1 + DaisyUI
- **State Management**: React Context API + Custom Hooks
- **Testing**: Vitest + React Testing Library
- **Backend API**: FastAPI (Python) - Mock service
- **Icons**: Heroicons

## 📋 Prerequisites

- **Node.js**: v18+ (tested with v18+)
- **npm**: v9+ (or yarn/pnpm)
- **Docker**: v20+ (for containerized deployment)
- **Python**: v3.10+ (for running the mock API locally, if not using Docker)

## 🚀 Setup Instructions

### Method 1: Local Development (Without Docker)

This method runs the frontend and backend directly on your machine without containers.

#### 1. Clone the repository

```bash
git clone <repository-url>
cd ai-pipeline-editor
```

#### 2. Install frontend dependencies

```bash
npm install
```

#### 3. Start the backend API

**Option A: Using Python directly (Recommended for development):**

```bash
# Install Python dependencies
pip install fastapi uvicorn[standard]

# Run the FastAPI server
python app.py
```

**Option B: Using Docker for backend only:**

```bash
# Build the Docker image
docker build -t pipeline-api .

# Run the container
docker run -p 8000:8000 pipeline-api
```

The API will be available at `http://localhost:8000`

#### 4. Start the frontend development server

In a new terminal:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the port Vite assigns)

#### 5. Configure API URL (Optional)

If your API is running on a different host/port, create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:8000
```

---

### Method 2: Docker Deployment (Production-Ready)

This method containerizes both frontend and backend services for easy deployment.

#### Quick Start with Docker Compose (Recommended)

Run both services together with a single command:

```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode (background)
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

The frontend will be available at `http://localhost:3000` and the backend at `http://localhost:8000`.

#### Standalone Docker Containers

If you prefer to run containers individually:

**Frontend Container:**

```bash
# Build the frontend image
docker build -f Dockerfile.frontend -t pipeline-frontend .

# Run the container (API URL defaults to http://localhost:8000)
docker run -p 3000:80 pipeline-frontend

# Or with custom API URL at build time
docker build -f Dockerfile.frontend --build-arg VITE_API_BASE_URL=http://your-api-url:8000 -t pipeline-frontend .
docker run -p 3000:80 pipeline-frontend
```

The frontend will be available at `http://localhost:3000`.

**Backend Container:**

```bash
# Build the backend image
docker build -t pipeline-backend .

# Run the container
docker run -p 8000:8000 pipeline-backend
```

The API will be available at `http://localhost:8000`.

#### Environment Variables for Docker

For docker-compose, you can optionally create a `.env` file in the project root:

```env
# Frontend API Base URL (used at build time)
# Default: http://localhost:8000
VITE_API_BASE_URL=http://localhost:8000
```

**Note**: The `VITE_API_BASE_URL` is used at build time for the frontend. For docker-compose, the default (`http://localhost:8000`) works since both services are accessible from the host machine at those ports.

## 🧪 Testing

Run the test suite:

```bash
# Run tests in watch mode
npm test

# Run tests with UI
npm run test:ui

# Run tests once
npm test -- --run
```

Test coverage includes:

- Graph validation logic (cycle detection, connection rules)
- Execution order (topological sort)
- Pipeline execution hook
- Connection validation

## 📁 Project Structure

```
ai-pipeline-editor/
├── src/
│   ├── api/              # API client and error handling
│   │   └── nodesApi.ts
│   ├── components/       # React components
│   │   ├── pipeline/     # Pipeline-specific components
│   │   │   ├── FlowCanvas.tsx
│   │   │   ├── PipelineNode.tsx
│   │   │   ├── ExecutionLog.tsx
│   │   │   └── nodePalette/  # Node palette components
│   │   └── shared/       # Shared UI components
│   ├── contexts/         # React Context providers
│   │   └── PipelineContext.tsx
│   ├── graph/            # Graph algorithms and validation
│   │   ├── execution.ts
│   │   ├── validation.ts
│   │   └── *.test.ts     # Test files
│   ├── hooks/            # Custom React hooks
│   │   └── usePipelineExecution.ts
│   ├── pages/            # Page components
│   │   └── EditorPage.tsx
│   ├── types/            # TypeScript type definitions
│   │   └── pipeline.ts
│   └── test/             # Test setup and utilities
├── app.py                # FastAPI mock backend
├── Dockerfile            # Docker config for API
├── openapi.yaml          # API specification
└── package.json
```

## 🏗️ Architecture & Design Decisions

### State Management

**Context API + Custom Hooks**: Used React Context API for global pipeline state (nodes, edges, execution state) combined with custom hooks (`usePipelineExecution`) for execution logic. This approach:

- Keeps state management simple and React-native
- Avoids external dependencies (Redux, Zustand, etc.)
- Provides clear separation between state and business logic
- Makes state accessible throughout the component tree

### Graph Algorithms

**Topological Sort (Kahn's Algorithm)**: Used for determining execution order:

- Ensures nodes execute in correct dependency order
- Handles branching pipelines correctly
- O(V + E) time complexity
- Detects cycles during validation (before execution)

**Cycle Detection (DFS)**: Implemented depth-first search to:

- Prevent cycles during connection creation
- Validate graph structure before execution
- Provide clear error messages to users

### Component Architecture

**Modular Design**: Components are organized by responsibility:

- **FlowCanvas**: Handles React Flow integration, drag-and-drop, connections
- **PipelineNode**: Custom node component with status visualization
- **NodePalette**: Manages API fetching, loading states, and node type display
- **ExecutionLog**: Displays execution logs with filtering and timestamps
- **PipelineContext**: Centralized state management

### Error Handling

**Layered Error Handling**:

1. **API Level**: Retry logic with exponential backoff in `nodesApi.ts`
2. **Validation Level**: Pre-execution graph validation
3. **Connection Level**: Real-time validation with user feedback (Toast notifications)
4. **Execution Level**: Try-catch blocks with detailed error logging

### UI/UX Decisions

**Responsive Design**:

- Mobile: Drawer-based node palette, bottom execution log
- Desktop: Sidebar node palette, right-side execution log
- Smooth transitions and touch-friendly interactions

**Visual Feedback**:

- Node status colors (idle: gray, running: blue, completed: green)
- Disabled states during execution
- Toast notifications for errors
- Loading skeletons for API calls

## 🔍 Key Implementation Details

### Connection Validation Rules

1. **Output → Input Only**: Enforced by React Flow handle types
2. **No Self-Connections**: Validated before edge creation
3. **One Input Per Node**: Each node accepts maximum one input connection
4. **One Output Per Node**: Each node accepts maximum one output connection
5. **No Cycles**: DFS-based cycle detection before connection creation

### Execution Flow

1. **Validation**: Check graph structure (empty, disconnected nodes, cycles)
2. **Reset**: Set all nodes to 'idle' status
3. **Topological Sort**: Determine execution order
4. **Sequential Execution**: Process nodes one by one with delays
5. **State Updates**: Update node status and logs in real-time
6. **Completion**: Mark execution as completed or error

### API Integration

- **Base URL**: Configurable via `VITE_API_BASE_URL` environment variable
- **Retry Logic**: 2 retries with exponential backoff
- **Error Types**: Custom `ApiError` class with status codes
- **Response Validation**: Type checking and structure validation

## ⚠️ Assumptions & Limitations

### Assumptions

1. **Node Types**: Fixed set of 4 node types (Data Source, Transformer, Model, Sink)
2. **Connection Rules**: Each node has exactly one input and one output
3. **Execution**: Sequential execution only (no parallel processing)
4. **Persistence**: No data persistence - pipeline state is in-memory only
5. **Browser Support**: Modern browsers with ES6+ support

### Limitations

1. **No Undo/Redo**: Pipeline changes cannot be undone
2. **No Node Deletion**: Users cannot delete nodes (can be added by clearing canvas)
3. **No Node Configuration**: Nodes cannot be configured with custom parameters
4. **No Save/Load**: Pipelines cannot be saved or loaded
5. **Single Execution**: Only one execution can run at a time
6. **No Parallel Execution**: Nodes execute sequentially even if they could run in parallel

### Future Enhancements (Out of Scope)

- Node deletion and editing
- Undo/redo functionality
- Pipeline save/load (localStorage or backend)
- Node configuration panels
- Parallel execution for independent nodes
- Export/import pipeline definitions (JSON)
- Node templates and presets
- Execution history and replay

## 📝 Development Scripts

```bash
# Development
npm run dev          # Start Vite dev server

# Building
npm run build        # Build for production

# Testing
npm test             # Run tests in watch mode
npm run test:ui      # Run tests with UI

# Linting
npm run lint         # Run ESLint

# Preview
npm run preview      # Preview production build
```

## 🐛 Troubleshooting

### API Connection Issues

If the frontend cannot connect to the API:

1. Verify the API is running: `curl http://localhost:8000/api/nodes`
2. Check CORS settings in `app.py`
3. Verify `VITE_API_BASE_URL` environment variable
4. Check browser console for errors

### Build Issues

If build fails:

1. Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
2. Check Node.js version: `node --version` (should be v18+)
3. Clear Vite cache: `rm -rf node_modules/.vite`

### Execution Issues

If pipeline execution fails:

1. Check browser console for errors
2. Verify all nodes are connected (no isolated nodes)
3. Ensure no cycles exist in the graph
4. Check execution logs for detailed error messages
