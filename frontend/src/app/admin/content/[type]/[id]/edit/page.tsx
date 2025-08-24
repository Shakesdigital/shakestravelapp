import React from 'react';
import ContentTypeEditClient from './ContentTypeEditClient';

// Generate static params for build
export function generateStaticParams() {
  const types = ['pages', 'articles', 'media'];
  const ids = ['1', '2', '3'];
  
  return types.flatMap(type => 
    ids.map(id => ({
      type,
      id,
    }))
  );
}

export default function ContentTypeEdit() {
  return <ContentTypeEditClient />;
}