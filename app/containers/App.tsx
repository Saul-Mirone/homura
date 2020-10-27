import React from 'react';
import { Container } from '../components/Container';
import { ArticleList } from './ArticleList';
import { ArticleReader } from './ArticleReader';
import { SourceList } from './SourceList';

export const App: React.FC = () => {
  return (
    <Container>
      <SourceList />
      <ArticleList />
      <ArticleReader />
    </Container>
  );
};
