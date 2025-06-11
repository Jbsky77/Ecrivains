export function countWords(text: string): number {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

export function formatWordCount(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
}

export function calculateProgress(current: number, goal: number): number {
  if (goal === 0) return 0;
  return Math.min((current / goal) * 100, 100);
}

export function getProgressColor(progress: number): string {
  if (progress >= 100) return 'text-green-600';
  if (progress >= 75) return 'text-blue-600';
  if (progress >= 50) return 'text-yellow-600';
  if (progress >= 25) return 'text-orange-600';
  return 'text-red-600';
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'in-progress':
      return 'bg-blue-100 text-blue-800';
    case 'published':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}