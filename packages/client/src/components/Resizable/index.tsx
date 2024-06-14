import React, { useState, useEffect } from 'react';
import { ResizableBox, ResizableBoxProps } from 'react-resizable';
import './handles.css';

interface ResizableProps {
  direction: 'horizontal' | 'vertical';
};

export const Resizable: React.FC<ResizableProps> = ({ direction, children }) => {
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const [synchronizedWidth, setSynchronizedWidth] = useState(viewportWidth * 0.75);

  const maxEditorWidth = viewportWidth * 0.75;
  const minEditorWidth = viewportWidth * 0.2;

  const maxCodeCellHeight = viewportHeight * 0.9;
  const minCodeCellHeight = 40;

  let resizableBoxProps: ResizableBoxProps;

  if(direction === 'horizontal') {
    resizableBoxProps = {
      className: 'resize-horizontal',
      width: synchronizedWidth,
      height: Infinity,
      resizeHandles: ['e'],
      maxConstraints: [maxEditorWidth, Infinity],
      minConstraints: [minEditorWidth, Infinity],
      onResizeStop: (event, data) => {
        console.log('\nResizable component | onResizeStop | data ->',data);

        const resizableBoxInternalWidth = data.size.width;

        setSynchronizedWidth(resizableBoxInternalWidth);
      }
    };
  }else {
    resizableBoxProps = {
      width: Infinity,
      height: 300,
      resizeHandles: ['s'],
      maxConstraints: [Infinity, maxCodeCellHeight],
      minConstraints: [Infinity, minCodeCellHeight]
    };
  }

  useEffect(() => {
    let timer: any;

    const callback = () => {
      if(timer) {
        clearTimeout(timer);
      }

      timer = setTimeout(() => {
        setViewportWidth(window.innerWidth);

        setViewportHeight(window.innerHeight);

        if(synchronizedWidth > window.innerWidth * 0.75) {
          setSynchronizedWidth(window.innerWidth * 0.75);
        }
      }, 100);
    };

    window.addEventListener('resize', callback);

    return () => {
      window.removeEventListener('resize', callback);
    };
  }, [synchronizedWidth]);

  return (
    <ResizableBox {...resizableBoxProps}>
      {children}
    </ResizableBox>
  );
};
