import React from 'react';
import { SourceList } from '../../features/source/SourceList';
import { SourceOperationBar } from '../../features/source/SourceOperationBar';

export const SourceBar: React.FC = () => {
  return <SourceList bottom={<SourceOperationBar />} />;
};
