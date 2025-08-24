import ContentEditClient from './ContentEditClient';

export default function ContentEditor() {
  return <ContentEditClient />;
}

// Required for static export
export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' }
  ];
}