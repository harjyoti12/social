import { Models } from "appwrite";
import { useState } from "react";
import GridPostList from "@/components/shared/GridPostList";
import { useGetCurrentUser } from "@/lib/react-query/queriesAndMutations";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";


const Saved = () => {
  const { data: currentUser, isPending, isError } = useGetCurrentUser();
  const [activeTab, setActiveTab] = useState("posts");
  const savedPosts =
    currentUser?.save
      ?.map((savePost: Models.Document) => ({
        ...savePost.post,
        creator: {
          imageUrl: currentUser.imageUrl,
          name: currentUser.name,
        },
        uniqueId: savePost.$id, // Ensure each saved post has a unique key
      }))
      .reverse() || [];

  return (
    <div className="saved-container">
      <div className="flex gap-2 w-full max-w-5xl">
        <img
          src="/assets/icons/save.svg"
          width={36}
          height={36}
          alt="edit"
          className="invert-white"
        />
        <h2 className="h3-bold md:h2-bold text-left w-full">Saved Posts</h2>
      </div>

      <div className="flex justify-between w-full max-w-5xl mt-10 mb-7">
        <Tabs defaultValue="posts">
          <TabsList className="flex max-w-5xl w-full bg-dark-3">
            <TabsTrigger
              value="posts"
              onClick={() => setActiveTab("posts")}
              className={cn(
                "px-10 py-2 flex items-center gap-2 rounded-md",
                activeTab === "posts" && "bg-dark-4"
              )}
            >
              <img
                src="/assets/icons/posts.svg"
                width={18}
                height={18}
                alt="posts"
              />
              <span className="hidden md:inline">Posts</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* 🔹 Loading & Error States */}
      {isPending && (
        <p className="text-center text-gray-400">Loading saved posts...</p>
      )}
      {isError && (
        <p className="text-center text-red-500">Failed to load saved posts.</p>
      )}

<div className="w-full flex justify-center max-w-5xl gap-9">
         {activeTab === "posts" && savedPosts.length > 0 ? (
          <GridPostList posts={savedPosts} showStats={false} />
        ) : (
          <p className="text-light-4">No saved items available.</p>
        )}
      </div>
    </div>
  );
};

export default Saved;

