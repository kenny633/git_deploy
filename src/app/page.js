"use client";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [postData, setPostData] = useState([]);
  const [visiblePosts, setVisiblePosts] = useState(12);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("http://localhost:3001/posts/");
      const data = await response.json();
      setPostData(data);
    }

    fetchData();
  }, []);

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollTop + windowHeight >= documentHeight - 100 && !loading) {
      loadMorePosts();
    }
  };

  const loadMorePosts = () => {
    setLoading(true);
    setTimeout(() => {
      setVisiblePosts((prev) => prev + 12);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loading]);

  return (
    <div className="flex flex-col items-center p-5 max-w-[1400px] mx-auto">
      <Head>
        <title>旅遊論壇</title>
        <meta name="description" content="旅遊論壇主頁" />
      </Head>

      <nav className="flex justify-center my-5">
        <Link href="/explore">
          <button className="mx-2 px-4 py-2 bg-gray-300 rounded">探索</button>
        </Link>
        <Link href="/popular">
          <button className="mx-2 px-4 py-2 bg-gray-300 rounded">熱門討論</button>
        </Link>
        <Link href="/region">
          <button className="mx-2 px-4 py-2 bg-gray-300 rounded">地區/國家</button>
        </Link>
      </nav>

      <main className="w-full">
        <h2 className="my-5 text-xl font-semibold">最新帖子</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 w-full">
          {[...postData]
            .sort((a, b) => new Date(b.Creation_time) - new Date(a.Creation_time))
            .slice(0, visiblePosts)
            .map((post) => (
              <Link key={post._id} href={`/postsample/${post._id}`}>
                <div className="bg-gray-100 p-4 border border-gray-300 rounded shadow-lg hover:shadow-2xl animation-slideInUp">
                  {post.img_path && (
                    <div className="w-full h-[300px] overflow-hidden mb-2 rounded-lg">
                      <img
                        src={post.img_path}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  )}
                  <h3 className="text-lg font-medium overflow-hidden overflow-ellipsis whitespace-nowrap">
                    {post.title.length > 20 ? `${post.title.substring(0, 20)}...` : post.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {new Date(post.Creation_time).toLocaleString(undefined, {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </p>
                </div>
              </Link>
            ))}
        </div>

        {loading && (
          <div className="flex justify-center my-5">
            <p className="text-lg text-gray-600">加载中...</p>
          </div>
        )}
      </main>
    </div>
  );
}
