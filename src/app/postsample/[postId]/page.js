"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { post, get } from "../../../utils/request";
import { getUserId } from "../../../utils/auth";

const PostDetail = () => {
  const { postId } = useParams();
  const [postdata, setPostdata] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [toc, setToc] = useState([]); // 目录状态
  const [activeId, setActiveId] = useState(null); // 当前活动标题 ID

  useEffect(() => {
    let checkToken  = false
    //檢查本地是否有token
    const token = localStorage.getItem("token");
    //如果有token
    if (token) {
      checkToken = true
    }
    const fetchPost = async () => {
      try {
        const res = await get(`/posts/${postId}`, checkToken);
        setPostdata(res.post);
        setComments(res.comments);
        console.log("Comments:", res.comments);
        const recommendationsRes = await get(
          `/posts/recommendations/${postId}`,
          false
        );
        setRecommendations(recommendationsRes.recommendations);

        generateToc(res.post.content);
      } catch (error) {
        setError("Failed to load post and comments");
        console.log(error);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  //生成目录
  const generateToc = (content) => {
    if (!content) return;

    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const headings = Array.from(doc.querySelectorAll("h1, h2, h3")); // 识别 h1, h2, h3

    const tocItems = headings.map((heading, index) => {
      const id = `heading-${index}`; // 创建唯一 ID
      heading.setAttribute("id", id); // 为每个标题添加 ID
      return { text: heading.innerText, id: id, level: heading.tagName };
    });

    setToc(tocItems);

    setPostdata((prevPostData) => ({
      ...prevPostData,
      content: doc.body.innerHTML,
    }));
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await post(
        `/posts/${postId}/comments`,
        { content: comment.trim() },
        false
      );
      setComments((prevComments) => [data, ...prevComments]);
      setComment("");
    } catch (err) {
      setError(err.message);
      console.error("Comment submission error:", err);
    } finally {
      setLoading(false);
    }
  };

  //点赞评论
  const handleLikeComment = async (commentId) => {
    try {
      const updatedComment = await post(
        `/posts/${postId}/comments/${commentId}/like`,
        {},
        false
      );
      console.log("Like Response:", updatedComment);
      updateCommentState(updatedComment);
    } catch (err) {
      console.error("Like error:", err);
      setError("Failed to like comment");
    }
  };

  //踩评论
  const handleDislikeComment = async (commentId) => {
    try {
      const updatedComment = await post(
        `/posts/${postId}/comments/${commentId}/dislike`,
        {},
        false
      );
      console.log("Dislike Response:", updatedComment);
      updateCommentState(updatedComment); // 更新评论状态
    } catch (err) {
      console.error("Dislike error:", err);
      setError("Failed to dislike comment");
    }
  };

  //更新评论状态
  const updateCommentState = (updatedComment) => {
    setComments((prevComments) => {
      return prevComments.map((comment) =>
        comment._id === updatedComment._id
          ? {
              ...comment,
              likes: updatedComment.likes,
              dislikes: updatedComment.dislikes, // 确保更新 dislikes
              hasLiked: updatedComment.hasLiked,
              hasDisliked: updatedComment.hasDisliked,
            }
          : comment
      );
    });
  };

// 滚动到标题
const scrollToHeading = (id) => {
  const heading = document.getElementById(id);
  if (heading) {
    heading.scrollIntoView({ behavior: "smooth" });
    // 使用 setTimeout 确保在滚动结束后更新活动 ID
    setTimeout(() => {
      setActiveId(id); // 更新当前活动标题
    }, 500); // 500ms 是一个合理的时间，可以根据需要调整
  }
};



// 处理滚动事件，设置当前活动标题
useEffect(() => {
  const handleScroll = () => {
    const headings = toc.map((item) => document.getElementById(item.id));
    const scrollPosition = window.scrollY + 100; // 小调整，确保准确性
    let visibleHeading = null;

    headings.forEach((heading) => {
      const { top } = heading.getBoundingClientRect();
      if (top >= 0 && top <= window.innerHeight) {
        visibleHeading = heading.id; // 找到可视的标题
      }
    });

    if (visibleHeading) {
      setActiveId(visibleHeading); // 更新活动 ID
    }
  };

  window.addEventListener("scroll", handleScroll);
  return () => {
    window.removeEventListener("scroll", handleScroll);
  };
}, [toc]);



  if (!postdata) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-5 max-w-2xl">
      <div className="main-content flex flex-col">
        <div className="post-content mb-10">
          <h1 className="text-2xl font-bold">{postdata.title}</h1>
          {postdata.img_path && (
            <div className="image-container flex justify-center my-5">
              <img
                src={postdata.img_path}
                alt={postdata.title || "Post image"}
                className="post-image max-w-full rounded-lg"
              />
            </div>
          )}
          <div
            className="content"
            dangerouslySetInnerHTML={{ __html: postdata.content }}
          />
          <p className="post-date text-gray-500">
            Posted on: {new Date(postdata.Creation_time).toLocaleString()}
          </p>
          <div className="author-info font-semibold">
            <strong>发帖人:</strong> {postdata.user.username}
          </div>
        </div>

        {/* 留言部分 */}
        <div className="comment-section">
          <h3 className="text-xl font-semibold">留言</h3>
          <div className="comment-input-container mb-5">
            <textarea
              className="comment-input w-full p-3 border border-gray-300 rounded"
              placeholder="在此輸入您的評論..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              className="comment-button bg-green-500 text-white rounded px-4 py-2 mt-2 hover:bg-green-600 disabled:bg-gray-300"
              onClick={handleCommentSubmit}
              disabled={loading}
            >
              {loading ? "發表中..." : "發表"}
            </button>
          </div>

          <div className="comments-list">
  {comments.map((comment) => (
    <div key={comment._id} className="comment border-b border-gray-200 py-4">
      <h4 className="font-semibold">
        {comment.user.username}
        {comment.user._id === postdata.user._id && (
          <span className="post-owner-label text-green-600"> (樓主)</span>
        )}
      </h4>
      <p>{comment.content}</p>
      <p className="comment-date text-gray-500">
        在{" "}
        {new Date(comment.Creation_time)
          .toLocaleString("zh-CN", {
            hour12: true,
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })
          .replace(/\//g, "-")}{" "}
        發佈評論
      </p>
      <div className="comment-footer flex space-x-2 mt-2">
        <button
          className={`like-button border rounded px-2 py-1 ${
            comment.hasLiked ? "bg-blue-200" : "bg-transparent"
          }`}
          onClick={() => handleLikeComment(comment._id)}
        >
          👍 {comment.likes || 0}
        </button>
        <button
          className={`dislike-button border rounded px-2 py-1 ${
            comment.hasDisliked ? "bg-red-200" : "bg-transparent"
          }`}
          onClick={() => handleDislikeComment(comment._id)}
        >
          👎 {comment.dislikes || 0}
        </button>
      </div>
    </div>
  ))}
</div>


          {/* 推荐部分 */}
          <div className="recommendations-section mt-10">
            <h3 className="text-xl font-semibold">相关推荐</h3>
            <div className="recommendations-list flex flex-wrap gap-5">
              {recommendations.length > 0 ? (
                recommendations.map((rec) => (
                  <div key={rec._id} className="recommendation flex flex-col items-center">
                    <a
                      href={`/postsample/${rec._id}`}
                      className="recommendation-link"
                    >
                      <div className="recommendation-content flex">
                        <img
                          src={rec.img_path}
                          alt={rec.title}
                          className="rec-image w-48 rounded"
                        />
                        <div className="rec-text flex-1 ml-4">
                          <h4 className="font-semibold">{rec.title}</h4>
                          <p>相似度: {rec.similarity.toFixed(2)}</p>
                        </div>
                      </div>
                    </a>
                  </div>
                ))
              ) : (
                <p>没有找到相关推荐</p>
              )}
            </div>
          </div>
        </div>

{/* 固定目录部件 */}
{toc.length > 0 && (
  <div className="toc fixed right-20 top-24 w-60 max-h-80 overflow-y-auto p-3 border border-gray-300 rounded bg-white shadow-lg">
    <h3 className="text-xl font-semibold">目录</h3>
    <ul>
      {toc.map((item) => (
        <li key={item.id} className={`toc-item flex items-center ${activeId === item.id ? "font-bold" : ""} mb-2`}>
          {activeId === item.id && <span className="indicator text-blue-400 mr-2">•</span>} {/* 小圆点在左侧 */}
          <button
            className={`toc-link toc-${item.level.toLowerCase()} ${
              activeId === item.id ? "text-blue-600" : "text-black"
            } text-left w-full py-2`} // 每行文本居左并加大行高
            onClick={() => scrollToHeading(item.id)}
          >
            {item.text}
          </button>
        </li>
      ))}
    </ul>
  </div>
)}

      </div>
    </div>
  );
};

export default PostDetail;
