import EditorHeader from '../components/EditorHeader';
import NodePalette from '../components/NodePalette';
import FlowCanvas from '../components/FlowCanvas';
import ExecutionLog from '../components/ExecutionLog';

const EditorPage = () => {
  return (
    <div className='h-screen flex flex-col bg-base-100'>
      {/* Header */}
      <EditorHeader />

      {/* Main content area with three panels */}
      <div className='flex-1 flex flex-col md:flex-row overflow-hidden'>
        {/* Left Panel - Node Palette */}
        <NodePalette />

        {/* Center Panel - Flow Canvas */}
        <FlowCanvas />

        {/* Right Panel - Execution Log */}
        <ExecutionLog />
      </div>
    </div>
  );
};

export default EditorPage;
