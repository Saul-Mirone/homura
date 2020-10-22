import React from 'react';
import { Toolkit } from './Toolkit';

type ReaderProps = {
  post?: {
    content: string;
    date: string;
    sourceName: string;
    title: string;
  };
};

export const Reader: React.FC<ReaderProps> = ({ post }) => {

  return (
    <div className="w-4/6 flex flex-col bg-gray-200 h-screen">
      <Toolkit />

      <div className="container mx-auto prose p-5 thin-scroll">
        {post && (
          <>
            <hgroup>
              <small className="uppercase">{post.date}</small>
              <div className="leading-none">{post.sourceName}</div>
              <h1 className="mb-0">{post.title}</h1>
            </hgroup>
            <main dangerouslySetInnerHTML={{ __html: post.content }} />
          </>
        )}
      </div>
    </div>
  );
};
