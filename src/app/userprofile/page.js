"use client"
// app/user/page.js

import PostItem from '@/app/components/PostItem';
import Image from 'next/image';
import usericon from '@/app/image/usericon.jpeg';
import image1 from '@/app/image/image1.jpg'
import { useState } from 'react';
import Link from 'next/link';
import styles from '@/app/components/style.module.css';
import clsx from 'clsx'; 

export default function UserProfile() {
  const [images, setImages] = useState([
    usericon,
    // 添加更多图片路径
  ]);

  const user = {
    avatar: usericon,
    postCount: 10,
    bio: '大家好，我是河北彩伽。皆さんこんにちは、河北蔡佳です。',
    posts: [
      { id: 1, title: '初次見面，河北蔡佳です', image: usericon },
      { id: 2, title: '京都之旅', image: image1 },
      { id: 3, title: '分享我的旅行经历', image: '/path/to/image3.jpg' },
      { id: 4, title: '我的旅行計畫', image: '/path/to/image4.jpg' },
      { id: 5, title: '下一步的學習', image: '/path/to/image5.jpg' },
      { id: 6, title: '喜歡的食物', image: '/path/to/image6.jpg' },
      { id: 7, title: '健身日記', image: '/path/to/image7.jpg' },
      { id: 8, title: '我的寵物', image: '/path/to/image8.jpg' },
      { id: 9, title: '最近的活動', image: '/path/to/image9.jpg' },
    ],
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ textAlign: 'center' }}>
        <Image 
          src={user.avatar} 
          alt="User Icon" 
          width={300} 
          height={200} 
        />
        <h2>用戶帖子</h2>
        <p>{user.bio}</p>
      </div>
      <h3>曾经出过的帖子:</h3>
      <div>
        {user.posts.map(post => (
          <Link key={post.id} href="/postsample" className={styles.link}>
            <div className={clsx(styles.post)}>
              <h3>{post.title}</h3> {/* 顯示帖子名稱 */}
              <Image 
                src={post.image} // 使用上載的圖片路徑
                alt={`Image for ${post.title}`} // 圖片的替代文本
                width={100} // 設定適當的寬度
                height={75} // 設定適當的高度
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}