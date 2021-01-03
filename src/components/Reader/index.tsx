import React from 'react';
import homura from '../../../assets/homura.png';

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

    {post ? (
      <div className="thin-scroll">
        <div className="container mx-auto prose p-5">
          <hgroup>
            <small className="uppercase">{post.date}</small>
            <div className="leading-none">{post.sourceName}</div>
            <h1 className="mb-0">{post.title}</h1>
          </hgroup>
          <base href={post.link} />
          {/* eslint-disable-next-line react/no-danger */}
          <main dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </div>
    ) : (
      <div className="w-full h-full flex items-center justify-center select-none">
        <div className="w-40">
          <img className="opacity-75" alt="homura" src={homura} />
        </div>
      </div>
    )}
  </div>
);
