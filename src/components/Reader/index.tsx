import React from 'react';
import homura from '../../../assets/homura.png';
import './style.pcss';

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

export const Reader: React.FC<ReaderProps> = ({ post, toolkit }) => {
    const postContainer = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
        postContainer.current?.scrollTo(0, 0);
    }, [post]);

    return (
        <div className="reader-container">
            {post && toolkit}

            {post ? (
                <div ref={postContainer} className="thin-scroll">
                    <div className="reader-post">
                        <hgroup>
                            <small>{post.date}</small>
                            <div>{post.sourceName}</div>
                            <h1>{post.title}</h1>
                        </hgroup>
                        <base href={post.link} />
                        <main dangerouslySetInnerHTML={{ __html: post.content }} />
                    </div>
                </div>
            ) : (
                <div className="reader-empty">
                    <div>
                        <img alt="homura" src={homura} />
                    </div>
                </div>
            )}
        </div>
    );
};
