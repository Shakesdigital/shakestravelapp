// Generate static params for static export
export async function generateStaticParams() {
  // For static export, generate params for known experiences
  // In production, this would fetch from your API
  const experienceIds = ['1', '2', '3', '4', '5']; // Add your actual experience IDs

  return experienceIds.map((id) => ({
    id: id,
  }));
}

export default function ExperienceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}