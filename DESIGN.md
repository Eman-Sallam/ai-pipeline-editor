# Design Write-Up – AI Pipeline Editor

## Overview

This document describes the design decisions and implementation approach behind the AI
Pipeline Editor frontend.

The goal of the project is to build a visual pipeline editor that allows users to compose,
connect, and execute processing nodes through an interactive UI. The focus is on frontend
architecture, execution logic correctness, and predictable behavior rather than real AI
computation.

---

## High-Level Architecture

The application is structured around three main concerns:

1. **UI Layer**

   - Node palette
   - Flow canvas
   - Execution logs

2. **Graph Logic**

   - Connection validation
   - Cycle detection
   - Execution ordering

3. **Execution Logic**
   - Sequential execution
   - Node state updates
   - Log generation

This separation keeps the core logic independent from UI rendering and easy to test.

---

## Technology Choices

### React + TypeScript

React with TypeScript was chosen to ensure strong typing and maintainability. Type safety
helped avoid mismatches between node data, edges, and execution logic, especially during
validation and execution.

### React Flow

React Flow was used to handle graph rendering and interaction, including:

- Drag-and-drop node positioning
- Source/target connection semantics
- Custom connection validation hooks

Custom canvas or SVG-based solutions were avoided to prevent unnecessary complexity.

---

## Graph & Connection Design

The pipeline is modeled as a directed graph where nodes represent processing steps and edges
represent data flow.

To align with the task constraints, the following rules are enforced:

- Output → input connections only
- No self-connections
- No cycles
- Each node has **one input and one output** (branching is intentionally disallowed)

Connections that violate these rules are rejected immediately to prevent invalid pipelines.

### Handle Direction Validation

React Flow already enforces source-to-target connections at the handle level. As a result,
invalid connections such as output → output or input → input are prevented by default.
Additional validation logic focuses only on enforcing task-specific rules rather than
duplicating built-in behavior.

---

## Execution Simulation Logic

Pipeline execution is simulated to visualize behavior rather than process real data.

The execution flow is:

1. Validate the pipeline structure
2. Determine execution order using topological sort
3. Execute nodes sequentially with simulated delays
4. Update node status and emit execution logs

Sequential execution was chosen because it matches the linear pipeline constraint and
provides clear visual feedback during execution.

### Preventing Graph Mutations During Execution

While the pipeline is executing, interactions with the flow canvas are intentionally
disabled. This includes node dragging, deletion, and creating new connections.

This prevents the user from modifying the graph during execution, which could lead to an
inconsistent or undefined execution state. Once execution completes (or fails),
interactions are re-enabled.

---

## Execution Logs Design

Execution logs are grouped by pipeline run, where each execution has its own log section.
This helps users clearly distinguish between different runs without mixing log entries.

New log entries are displayed at the top of the list (most recent first). This decision was
made to reduce excessive scrolling and allow users to immediately see the latest execution
state without searching through older logs.

This approach keeps the log panel focused on what is currently happening, while still
preserving previous execution context for reference.

---

## State Management Approach

React Flow manages node and edge state within the canvas.

Execution state and logs are managed using React Context API combined with custom hooks.
External state management libraries (e.g., Redux, Zustand) were intentionally avoided since
the state scope is limited and tightly coupled to the pipeline editor.

This keeps the implementation simple, predictable, and easy to test.

A synchronous execution lock is used to prevent concurrent pipeline executions.

---

## UI / UX Decisions

The UI is intentionally minimal and focused on pipeline construction:

- Clear visual feedback for node execution states
- Simple loading and error indicators
- Responsive layout as a lightweight UX enhancement

On smaller screens, the node palette is displayed as a side drawer instead of occupying a
large portion of the viewport. This preserves canvas space and maintains usability on
mobile devices.

---

## Error Handling & Validation

Error handling focuses on the core requirements of the task:

- Invalid pipelines (empty, disconnected, or cyclic) are blocked before execution
- Execution errors are reflected through node status updates and logs
- API loading errors are surfaced with clear user feedback

Complex recovery mechanisms were intentionally avoided.

---

## Testing Strategy

Testing focuses on core logic rather than UI rendering:

- Connection validation rules
- Cycle detection
- Topological sorting
- Execution order correctness

Execution logic was designed to be deterministic to avoid flaky tests.

---

## Trade-offs & Limitations

- Execution is simulated and not tied to real backend processing
- Pipelines are not persisted
- Node configuration is intentionally minimal

These trade-offs keep the solution aligned with the scope of the task.

---

## Final Notes

The design prioritizes clarity, correctness, and predictable behavior. Design decisions were
made based on practical constraints and hands-on experimentation rather than theoretical
completeness.
