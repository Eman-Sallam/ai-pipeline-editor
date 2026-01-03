import {
  CircleStackIcon,
  Cog6ToothIcon,
  SparklesIcon,
  ArchiveBoxIcon,
} from '@heroicons/react/24/solid';
import type { ApiNodeType } from '../../../types/pipeline';

export type NodeTypeConfig = {
  Icon: typeof CircleStackIcon;
  bgColor: string;
  iconColor: string;
  borderColor: string;
  description: string;
};

// Mapping configuration for node types
export const NODE_TYPE_CONFIG: Record<string, NodeTypeConfig> = {
  'Data Source': {
    Icon: CircleStackIcon,
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
    borderColor: 'border-blue-600',
    description: 'Import data from various sources',
  },
  Transformer: {
    Icon: Cog6ToothIcon,
    bgColor: 'bg-orange-100',
    iconColor: 'text-orange-600',
    borderColor: 'border-orange-600',
    description: 'Transform and process data',
  },
  Model: {
    Icon: SparklesIcon,
    bgColor: 'bg-purple-100',
    iconColor: 'text-purple-600',
    borderColor: 'border-purple-600',
    description: 'Machine learning models',
  },
  Sink: {
    Icon: ArchiveBoxIcon,
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600',
    borderColor: 'border-green-600',
    description: 'Export data to destinations',
  },
};

// Default config for unknown node types
export const DEFAULT_CONFIG: NodeTypeConfig = {
  Icon: CircleStackIcon,
  bgColor: 'bg-gray-100',
  iconColor: 'text-gray-600',
  borderColor: 'border-gray-600',
  description: 'Node type',
};

// Map API response to UI format
export type NodeTypeWithUI = {
  id: string;
  name: string;
} & NodeTypeConfig;

/**
 * Maps API node type to UI format with styling configuration
 */
export function mapApiNodeToUI(apiNode: ApiNodeType): NodeTypeWithUI {
  const config = NODE_TYPE_CONFIG[apiNode.name] || DEFAULT_CONFIG;
  return {
    id: apiNode.id,
    name: apiNode.name,
    ...config,
  };
}
