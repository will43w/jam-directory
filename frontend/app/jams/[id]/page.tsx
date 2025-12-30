import { notFound } from 'next/navigation';
import { getJamById } from '@/lib/services/jamService';
import { JamDetailPageClient } from './JamDetailPageClient';

interface JamDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function JamDetailPage({ params }: JamDetailPageProps) {
  const resolvedParams = await params;
  let jam = null;
  
  try {
    jam = await getJamById(resolvedParams.id);
  } catch (error) {
    // Service not implemented yet
    jam = null;
  }

  if (!jam) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <JamDetailPageClient jam={jam} />
      </div>
    </div>
  );
}

