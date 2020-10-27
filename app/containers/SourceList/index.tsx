import React from 'react';
import { Creator } from '../../features/creator/Creator';
import { Source } from '../../features/source/Source';

export const SourceList: React.FC = () => {
  return <Source bottom={<Creator />} />;
};
