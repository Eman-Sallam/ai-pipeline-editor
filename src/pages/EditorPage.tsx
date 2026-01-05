import { useState } from 'react';
import { PipelineProvider } from '../contexts/PipelineContext';
import EditorHeader from '../components/shared/EditorHeader';
import NodePalette from '../components/pipeline/NodePalette';
import FlowCanvas from '../components/pipeline/FlowCanvas';
import ExecutionLog from '../components/pipeline/ExecutionLog';

const EditorPage = () => {
  const [isNodePaletteOpen, setIsNodePaletteOpen] = useState(false);

  const toggleNodePalette = () => {
    setIsNodePaletteOpen((prev) => !prev);
  };

  const closeNodePalette = () => {
    setIsNodePaletteOpen(false);
  };

  return (
    <PipelineProvider>
      <div className='h-screen flex flex-col bg-base-100'>
        {/* Header */}
        <EditorHeader onMenuClick={toggleNodePalette} />

        {/* Main content area */}
        <div className='flex-1 flex flex-col md:flex-row overflow-hidden relative'>
          {/* Left Panel - Node Palette (drawer on mobile, sidebar on desktop) */}
          <NodePalette isOpen={isNodePaletteOpen} onClose={closeNodePalette} />

          {/* Center Panel - Flow Canvas (full width on mobile, behind drawer) */}
          <div className='flex-1 flex flex-col overflow-hidden absolute inset-0 md:relative md:inset-auto'>
            <FlowCanvas />

            {/* Bottom Panel - Execution Log (small section at bottom on mobile, right sidebar on desktop) */}
            <div className='md:hidden border-t border-base-300'>
              <ExecutionLog />
            </div>
          </div>

          {/* Right Panel - Execution Log (desktop only) */}
          <div className='hidden md:block relative z-10'>
            <ExecutionLog />
          </div>
        </div>
      </div>
    </PipelineProvider>
  );
};

export default EditorPage;
