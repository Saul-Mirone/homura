import React from 'react';

type ReaderProps = {
  post?: {
    content: string;
    date: string;
    sourceName: string;
    link: string;
    title: string;
  };
  toolkit: JSX.Element | null;
};

export const Reader: React.FC<ReaderProps> = ({ post, toolkit }) => (
  <div className="w-4/6 flex flex-col bg-gray-200 h-screen">
    {post && toolkit}

    <div className="thin-scroll">
      <div className="container mx-auto prose p-5">
        {post && (
          <>
            <hgroup>
              <small className="uppercase">{post.date}</small>
              <div className="leading-none">{post.sourceName}</div>
              <h1 className="mb-0">{post.title}</h1>
            </hgroup>
            <base href={post.link} />
            {/* eslint-disable-next-line react/no-danger */}
            <main dangerouslySetInnerHTML={{ __html: post.content }} />
          </>
        )}
      </div>
    </div>
  </div>
);
