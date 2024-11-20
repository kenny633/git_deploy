import { getToken } from "./auth";
const apiBaseURL = "http://localhost:3001";
async function request(url, options = {}, needToken = true) {
  // 设置默认请求头
  options.headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (needToken) {
    // 如果有 token，添加到请求头中
    const token = getToken();
    if (token) {
      options.headers["Authorization"] = `Bearer ${token}`;
    }
  }
  try {
    const response = await fetch(`${apiBaseURL}${url}`, options);
    // 根据响应码处理对应的错误 2xx 成功 4xx 客户端错误 5xx 服务端错误
    // if (response.status !== 200) {
    // }
    if (!response.ok) {
      throw new Error("请求错误！");
    }
    // 返回解析后的 JSON 数据
    return response.json();
  } catch (error) {
    // console.error("请求错误:", error);
    // return new Promise.reject(error);
    // 打印请求哪条api出错
    console.log('请求哪条api出错:', url);
    console.log('请求失败:', error);
  }
}

// 封装 GET 请求
export function get(url, needToken = true) {
  return request(url, {
    method: "GET",
    needToken,
  });
}

// 封装 POST 请求
export function post(url, data, needToken = true) {
  return request(url, {
    method: "POST",
    body: JSON.stringify(data),
    needToken,
  });
}

// 封装 PUT 请求
export function put(url, data, needToken = true) {
  return request(url, {
    method: "PUT",
    body: JSON.stringify(data),
    needToken,
  });
}

// 封装 DELETE 请求
export function del(url, needToken = true) {
  return request(url, {
    method: "DELETE",
    needToken,
  });
}
