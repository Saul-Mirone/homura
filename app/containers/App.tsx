import React from 'react';
import { Container } from '../components/Container';
import { ArticleList } from './ArticleList';
import { ArticleReader } from './ArticleReader';
import { SourceBar } from './SourceBar';

export const App: React.FC = () => {
  return (
    <Container>
      <SourceBar />
      <ArticleList />
      <ArticleReader />
    </Container>
  );
};
