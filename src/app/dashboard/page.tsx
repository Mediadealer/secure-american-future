import { redirect } from 'next/navigation';

export default function DashboardPage() {
  // Redirect to root - all functionality now on single page
  redirect('/');
}
