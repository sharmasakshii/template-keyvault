import React from 'react';
const Heading = ({ level, content, spanText, paragraphText, style, className, children }: any) => {
    const headingLevel = Math.min(Math.max(parseInt(level, 10) || 1, 1), 6);
    const HeadingIndex = `h${headingLevel}` as keyof React.JSX.IntrinsicElements;

    return (
        <HeadingIndex className={className} style={style}>
            {children}
            {content}
            {spanText && <span>{" "}{spanText}</span>}
            {paragraphText && <p>{paragraphText}</p>}
        </HeadingIndex>
    );
};

export default Heading;