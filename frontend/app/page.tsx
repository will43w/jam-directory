import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redirect to a default city or show city selector
  // For now, redirect to a placeholder - this can be updated later
  redirect('/london/jazz-jams');
}
