import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { InfinitePostList } from "~/components/InfinitePostList";
import { NewPostForm } from "~/components/NewPostForm";
import { api } from "~/utils/api";

const TABS = ["RECENT", "FOLLOWING"] as const;

const Home: NextPage = () => {
  const [selectedTab, setSelectedTab] =
    useState<(typeof TABS)[number]>("RECENT");
  const session = useSession();
  return (
    <>
      <header className="sticky top-0 z-10 border-b bg-white pt-2">
        <h1 className="mb-2 px-4 text-2xl font-extrabold">Home</h1>
        {session.status === "authenticated" && (
          <div className="flex">
            {TABS.map((tab) => {
              return (
                <button
                  key={tab}
                  className={`flex-grow p-2 text-xl hover:bg-gray-200 focus-visible:bg-gray-200 ${
                    tab === selectedTab
                      ? "border-b-4 border-b-blue-500 font-extrabold"
                      : ""
                  }`}
                  onClick={() => setSelectedTab(tab)}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        )}
      </header>
      <NewPostForm />
      {selectedTab === "RECENT" ? <RecentPosts /> : <FollowingPosts />}
    </>
  );
};

function RecentPosts() {
  const posts = api.post.infiniteFeed.useInfiniteQuery(
    {},
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  return (
    <InfinitePostList
      posts={posts.data?.pages.flatMap((page) => page.data)}
      isError={posts.isError}
      isLoading={posts.isLoading}
      hasMore={posts.hasNextPage}
      fetchNewPosts={posts.fetchNextPage}
    />
  );
}

function FollowingPosts() {
  const posts = api.post.infiniteFeed.useInfiniteQuery(
    { onlyFollowing: true },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  return (
    <InfinitePostList
      posts={posts.data?.pages.flatMap((page) => page.data)}
      isError={posts.isError}
      isLoading={posts.isLoading}
      hasMore={posts.hasNextPage}
      fetchNewPosts={posts.fetchNextPage}
    />
  );
}

export default Home;
