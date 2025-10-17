'use client'

import React, { useEffect } from 'react';

const TestContainer: React.FC = () => {

  useEffect(() => {
    // ComponentDidMount logic here
    import('../web-components/word-count.ts');
  }, []);

  return (
        // <div className="columns-3 gap-20 ...">
        //     <img className="aspect-3/2 ..." src="https://www.gstatic.com/webp/gallery/1.jpg" />
        //     <img className="aspect-square ..." src="https://www.gstatic.com/webp/gallery/1.jpg" />
        //     <img className="aspect-square ..." src="https://www.gstatic.com/webp/gallery/1.jpg" />
        // </div>
        <word-count></word-count>
    );
}

export default TestContainer;
