"use client";
import localFont from "next/font/local";
import LoginForm from "./components/LoginForm";
import RegisterForm from "@/app/components/RegisterForm";
import { useEffect, useState } from "react";
import { removeToken, getToken } from "./../utils/auth";
import logo from '@/app/public/logo.png';
import Image from "next/image";
import creatpost from "@/app/public/createpost.png";
import searchIcon from "@/app/public/search.png";
import Link from "next/link";
import { post } from "../utils/request";
import { usePathname } from 'next/navigation';
import '../../styles/globals.css';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({ children }) {
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isRegisterOpen, setRegisterOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  const handleLoginSuccess = (user) => {
    setUserDetails(user);
    setIsLoggedIn(true);
    setLoginOpen(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserDetails({});
    removeToken();
  };

  useEffect(() => {
    const token = getToken();
    if (token) {
      const fetchUserDetails = async () => {
        try {
          const res = await post("/users/get-user-info", { token }, true);
          if (res.status === 200) {
            setUserDetails(res);
            setIsLoggedIn(true);
          }
        } catch (error) {
          console.log("请求用户信息时发生错误:", error);
        }
      };
      fetchUserDetails();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 600);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isOnCreatePostPage = pathname === '/createpost';

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <header className="flex items-center justify-center w-full py-2 border-b border-gray-300">
          <div className="flex items-center justify-between w-4/5 mx-auto">
            <div className="flex items-center">
              <Link href="/">
                <Image src={logo} alt="Logo" width={50} height={50} className="rounded-full" />
              </Link>
            </div>
            <div className="flex items-center flex-1 mx-5">
              <input type="text" placeholder="搜索..." className="flex-1 px-3 py-2 border border-gray-300 rounded" />
              <Link href="/search">
                <Image src={searchIcon} alt="搜索" width={30} height={30} className="ml-3 cursor-pointer" />
              </Link>
            </div>
            <div className="flex">
              {isLoggedIn ? (
                <div className="relative inline-block group">
                  <Link href="/userprofile">
                    <span className="px-4 py-2 group-hover:cursor-pointer">{userDetails.name}</span>
                  </Link>
                  <div className="absolute hidden w-48 p-4 bg-white border border-gray-300 shadow-md group-hover:block">
                    <p>邮箱: {userDetails.email}</p>
                    <p>身份: {userDetails.role}</p>
                  </div>
                  <button className="px-4 py-2 ml-2 text-white bg-blue-600 rounded" onClick={handleLogout}>
                    登出
                  </button>
                </div>
              ) : (
                <>
                  <button className="px-4 py-2 ml-2 text-white bg-blue-600 rounded" onClick={() => setLoginOpen(true)}>
                    登入
                  </button>
                  <button className="px-4 py-2 ml-2 text-white bg-blue-600 rounded" onClick={() => setRegisterOpen(true)}>
                    注册
                  </button>
                </>
              )}
            </div>
          </div>
        </header>

        {isLoginOpen && (
          <LoginForm
            isOpen={isLoginOpen}
            onClose={() => setLoginOpen(false)}
            onLoginSuccess={handleLoginSuccess}
          />
        )}

        {isRegisterOpen && (
          <RegisterForm 
            onClose={() => setRegisterOpen(false)} 
            onLoginSuccess={handleLoginSuccess}
          />
        )}

        {isLoggedIn && !isOnCreatePostPage && (
          <div className="fixed bottom-16 right-5 p-2 cursor-pointer">
            <Link href="/createpost">
              <Image src={creatpost} alt="发帖" width={40} height={40} />
            </Link>
          </div>
        )}

        {children}

        {isVisible && (
          <button onClick={scrollToTop} className="fixed bottom-5 right-5 flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full transition-colors duration-300 hover:bg-blue-700">
            ↑
          </button>
        )}
      </body>
    </html>
  );
}
