import { BrowserRouter, Route, Routes } from "react-router";
import SignPageIn from "./pages/SignPageIn";
import SignPageUp from "./pages/SignPageUp";
import ChatAppPage from "./pages/ChatAppPage";
import { Toaster } from "sonner";
import "./App.css";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { useEffect } from "react";
import { useThemeStore } from "@/stores/useThemeStore";
import { useChatStore } from "@/stores/useChatStore";
import { useAuthStore } from "./stores/useAuthStore";
import { useSocketStore } from "./stores/useSocketStore";
function App() {
  const { isDark, setTheme } = useThemeStore();
  const {accessToken} = useAuthStore();
  const {connectSocket, disconnectSocket} = useSocketStore();
  useEffect(() => {
    setTheme(isDark);
    if(useAuthStore.getState().accessToken){
      useChatStore.getState().fetchConversation();
    }
  }, [isDark]);
  useEffect(()=>{
    if(accessToken){
      connectSocket();
    }
    return () => disconnectSocket();
  },[accessToken])
  return (
    <>
      <Toaster richColors />
      <BrowserRouter>
        <Routes>
          {/* public route */}
          <Route path="/sign-in" element={<SignPageIn />} />
          <Route path="/sign-up" element={<SignPageUp />} />

          {/* private route */}
          <Route element={<ProtectedRoute />}>
            <Route path="/chat" element={<ChatAppPage />} />
            <Route path="/" element={<ChatAppPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
