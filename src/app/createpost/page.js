"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { getToken } from "../../utils/auth";
import Quill from "quill";
import 'quill/dist/quill.snow.css';

const Post = () => {
  const router = useRouter();
  const [coverImage, setCoverImage] = useState(null);
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [text, setText] = useState("");
  const [loadingImage, setLoadingImage] = useState(false); // 新增状态
  const quillRef = useRef(null);
  const quillInstance = useRef(null); // 用于持久化 Quill 实例

  useEffect(() => {
    const quill = new Quill(quillRef.current, {
      theme: 'snow',
      modules: {
        toolbar: [
          [{ 'header': [1, 2, false] }],
          ['bold', 'italic', 'underline'],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          ['link', 'image'],
          ['clean'],
        ],
      },
    });

    // 监听文本变化事件，更新状态
    quill.on('text-change', () => {
      const html = quill.root.innerHTML;
      setText(html); // 这里将 text 更新为 Quill 编辑器的内容
    });

    // 设置图片上传处理器
    quill.getModule('toolbar').addHandler('image', () => {
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('accept', 'image/*');
      input.onchange = async (event) => {
        const file = event.target.files[0];
        if (file) {
          setLoadingImage(true); // 开始加载
          const formData = new FormData();
          formData.append("image", file);

          try {
            const uploadResponse = await fetch("http://localhost:3001/upload", {
              method: "POST",
              body: formData,
            });

            if (uploadResponse.ok) {
              const uploadResult = await uploadResponse.json();
              const imageUrl = uploadResult.imageUrl;
              const range = quill.getSelection();
              quill.insertEmbed(range.index, 'image', imageUrl);
              quill.setSelection(range.index + 1);
            } else {
              alert("图片上传失败");
            }
          } catch (error) {
            console.error("上传失败:", error);
            alert("上传失败，请重试");
          } finally {
            setLoadingImage(false); // 结束加载
          }
        }
      };
      input.click();
    });

    quillInstance.current = quill; // 将实例存储在引用中

    return () => {
      quill.off('text-change');
      quill.enable(false);
      quillInstance.current = null; // 清空引用中的实例
    };
  }, []);

  const handleCoverImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert("请输标题");
      return;
    }

    if (!text.trim()) {
      alert("请输内容");
      return;
    }

    try {
      setIsSubmitting(true);
      let coverImagePath = null;
      if (coverImage) {
        const formData = new FormData();
        const coverBlob = await fetch(coverImage).then((r) => r.blob());
        formData.append("image", coverBlob);

        const coverUploadResponse = await fetch("http://localhost:3001/upload", {
          method: "POST",
          body: formData,
        });

        if (coverUploadResponse.ok) {
          const coverUploadResult = await coverUploadResponse.json();
          coverImagePath = coverUploadResult.imageUrl;
        }
      }

      const token = getToken();
      const postData = {
        title,
        content: text,
        img_path: coverImagePath,
      };

      const response = await fetch("http://localhost:3001/posts/create-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      });

      const responseText = await response.text();
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        throw new Error("Invalid server response");
      }

      if (!response.ok) {
        throw new Error(result.message || "Failed to create post");
      }
      const postId = result.postId || result._id;
      window.location.href = `/postsample/${postId}`;
    } catch (error) {
      alert(`发布失败: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const token = getToken();
    if (!token) {
      alert("请先登录");
      router.push("/");
    }
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.leftPanel}>
        <h2>上传封面图片</h2>
        <input type="file" accept="image/*" onChange={handleCoverImageUpload} />
        {coverImage && <img src={coverImage} alt="Uploaded Cover" style={styles.image} />}
      </div>
      <div style={styles.rightPanel}>
        <h2>输入内容</h2>
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="输入标题..."
          style={styles.input}
        />
        <div ref={quillRef} style={styles.quill} />
        {loadingImage && <div style={styles.loading}>图片加载中...</div>} {/* 加载提示 */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          style={styles.button}
        >
          {isSubmitting ? "发布中..." : "发布帖子"}
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "space-between",
    padding: "20px",
  },
  leftPanel: {
    flex: 1,
    marginRight: "10px",
  },
  rightPanel: {
    flex: 2,
    marginLeft: "10px",
  },
  image: {
    marginTop: "10px",
    maxWidth: "100%",
    height: "auto",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  quill: {
    marginTop: "10px",
    height: "300px", // 确保编辑器高度合适
  },
  loading: {
    margin: "10px 0",
    color: "orange", // 加载提示的颜色
    fontSize: "16px",
  },
};

export default Post;
