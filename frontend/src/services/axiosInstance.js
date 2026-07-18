import axios from "axios";
import { toast } from "sonner";

const API_BASE_URL = "http://localhost:8000/api/v1";
//https://instagram-clone-3r60.onrender.com
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 15000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// ============================
// REQUEST INTERCEPTOR
// ============================

axiosInstance.interceptors.request.use(
  (config) => {
    // console.group("🚀 AXIOS REQUEST");

    // console.log("Method:", config.method?.toUpperCase());
    // console.log("Base URL:", config.baseURL);
    // console.log("URL:", config.url);
    // console.log("Full URL:", `${config.baseURL}${config.url}`);
    // console.log("Headers:", config.headers);
    // console.log("With Credentials:", config.withCredentials);
    // console.log("Timeout:", config.timeout);

    if (config.data instanceof FormData) {
      //console.log("Body: FormData");
      delete config.headers["Content-Type"];
    } else {
      //console.log("Body:", config.data);
    }

    console.groupEnd();

    return config;
  },
  (error) => {
    console.group("❌ REQUEST ERROR");
     console.error(error);
     console.groupEnd();
    return Promise.reject(error);
  }
);

// ============================
// RESPONSE INTERCEPTOR
// ============================

axiosInstance.interceptors.response.use(
  (response) => {
    // console.group("✅ RESPONSE");

    // console.log("Status:", response.status);
    // console.log("Status Text:", response.statusText);
    // console.log("URL:", response.config.url);
    // console.log("Data:", response.data);

     console.groupEnd();

    return response;
  },

  (error) => {
    console.group("❌ AXIOS ERROR");

    // console.log("Message:", error.message);
    // console.log("Code:", error.code);
    // console.log("Name:", error.name);

    if (error.config) {
      // console.log("Method:", error.config.method);
      // console.log("URL:", error.config.baseURL + error.config.url);
      // console.log("Headers:", error.config.headers);
    }

    if (error.response) {
      // console.log("========== SERVER RESPONSE ==========");
      // console.log("Status:", error.response.status);
      // console.log("Status Text:", error.response.statusText);
      // console.log("Headers:", error.response.headers);
      // console.log("Data:", error.response.data);

      toast.error(error.response.data?.message || "Server Error");
    }

    else if (error.request) {
      // console.log("========== REQUEST SENT ==========");
      // console.log(error.request);

      // console.log("readyState:", error.request.readyState);
      // console.log("status:", error.request.status);
      // console.log("response:", error.request.response);
      // console.log("responseText:", error.request.responseText);

      toast.error("Network Error");
    }

    else {
      // console.log("========== AXIOS CONFIG ERROR ==========");
      console.error(error);

      toast.error(error.message);
    }

    console.groupEnd();

    return Promise.reject(error);
  }
);

export default axiosInstance;