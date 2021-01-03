import React from 'react';
import { List } from '../../features/list/List';
import { Mode } from '../../features/mode/Mode';

export const ArticleList: React.FC = () => {
  return <List header={<Mode />} />;
};
