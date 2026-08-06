export default function TaskSkeleton() {
  return (
    <div className="bg-white p-4 rounded-lg shadow animate-pulse">
      <div className="h-4 bg-gray-300 rounded mb-3 w-3/4"></div>
      <div className="h-3 bg-gray-300 rounded mb-2 w-full"></div>
      <div className="h-3 bg-gray-300 rounded mb-3 w-1/2"></div>
      <div className="h-8 bg-gray-300 rounded"></div>
    </div>
  );
}