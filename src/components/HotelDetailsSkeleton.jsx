export default function HotelDetailsSkeleton() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Skeleton */}
      <div className="w-full h-[420px] bg-gray-300 animate-pulse" />

      <div className="max-w-7xl mx-auto px-6 py-10 grid lg:grid-cols-3 gap-10">
        {/* Left content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="h-8 w-1/2 bg-gray-300 rounded animate-pulse" />
          <div className="h-4 w-1/3 bg-gray-300 rounded animate-pulse" />

          <div className="space-y-3">
            <div className="h-4 w-full bg-gray-300 rounded animate-pulse" />
            <div className="h-4 w-full bg-gray-300 rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-gray-300 rounded animate-pulse" />
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-10 bg-gray-300 rounded animate-pulse"
              />
            ))}
          </div>
        </div>

        {/* Booking card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 space-y-4">
          <div className="h-6 w-1/2 bg-gray-300 rounded animate-pulse" />
          <div className="h-10 bg-gray-300 rounded animate-pulse" />
          <div className="h-10 bg-gray-300 rounded animate-pulse" />
          <div className="h-6 w-1/3 bg-gray-300 rounded animate-pulse" />
          <div className="h-12 bg-gray-300 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
