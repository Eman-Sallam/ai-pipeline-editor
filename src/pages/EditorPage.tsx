import EditorHeader from '../components/shared/EditorHeader';
import NodePalette from '../components/pipeline/NodePalette';
import FlowCanvas from '../components/pipeline/FlowCanvas';
import ExecutionLog from '../components/pipeline/ExecutionLog';

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
