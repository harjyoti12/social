import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SkeletonLoader = () => {
  return (
    <div className="flex h-screen bg-black text-white">
      {/* Sidebar */}
      <div className="w-1/4 h-full p-4 flex flex-col gap-4 border-r border-gray-700">
        <Skeleton height={40} width="80%" borderRadius={8} />
        <Skeleton height={30} width="60%" borderRadius={8} />
        <Skeleton height={30} width="50%" borderRadius={8} />
        <Skeleton height={30} width="70%" borderRadius={8} />
        <Skeleton height={30} width="40%" borderRadius={8} />
      </div>

      {/* Main Feed */}
      <div className="flex-1 p-6">
        <h1 className="text-xl font-bold mb-6">
          <Skeleton width="40%" height={30} />
        </h1>
        {/* Posts */}
        <div className="flex flex-col gap-6">
          {/* Single Post Skeleton */}
          <div className="p-4 bg-gray-800 rounded-lg">
            <div className="flex items-center gap-4 mb-4">
              <Skeleton circle={true} height={50} width={50} />
              <div>
                <Skeleton width="50%" height={20} />
                <Skeleton width="30%" height={15} />
              </div>
            </div>
            <Skeleton width="100%" height={20} />
            <Skeleton width="80%" height={20} />
            <Skeleton className="mt-4" height={200} borderRadius={12} />
          </div>

          {/* Repeat for multiple posts */}
          <div className="p-4 bg-gray-800 rounded-lg">
            <div className="flex items-center gap-4 mb-4">
              <Skeleton circle={true} height={50} width={50} />
              <div>
                <Skeleton width="50%" height={20} />
                <Skeleton width="30%" height={15} />
              </div>
            </div>
            <Skeleton width="100%" height={20} />
            <Skeleton width="80%" height={20} />
            <Skeleton className="mt-4" height={200} borderRadius={12} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
