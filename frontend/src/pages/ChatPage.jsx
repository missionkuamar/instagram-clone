// ChatPage.jsx - Fully Responsive
import { setSelectedUser } from '@/features/auth/authSlice';
import axiosInstance from '@/services/axiosInstance';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MessageCircleCode, Menu, X, ArrowLeft, Send } from 'lucide-react';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setMessages } from '../features/chat/chatSlice';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Messages from './Messages';
import { toast } from 'sonner';

const ChatPage = () => {
  const [textMessage, setTextMessage] = useState('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  const { user, suggestedUsers, selectedUser } = useSelector(store => store.auth || {});
  const { onlineUsers, messages } = useSelector(store => store.chat || {});
  
  const dispatch = useDispatch();

  // ✅ Enhanced mobile detection with debounce
  useEffect(() => {
    let timeoutId;
    const checkMobile = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
      if (!isMobileView) {
        setIsMobileSidebarOpen(false);
      }
    };
    
    checkMobile();
    
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkMobile, 100);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // Close sidebar when selecting user on mobile
  useEffect(() => {
    if (isMobile && selectedUser) {
      setIsMobileSidebarOpen(false);
    }
  }, [selectedUser, isMobile]);

  // ✅ Fixed Send Message Handler
  const sendMessageHandler = async (receiverId) => {
    if (!textMessage.trim()) return;
    
    setIsSending(true);
    try {
      const res = await axiosInstance.post(`/message/send/${receiverId}`, 
        { textMessage: textMessage.trim() }, 
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );
      
      if (res.data.success) {
        dispatch(setMessages([...messages, res.data.newMessage]));
        setTextMessage("");
      }
    } catch (error) {
      console.error('Send message error:', error);
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null));
    };
  }, [dispatch]);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const handleBack = () => {
    dispatch(setSelectedUser(null));
    setIsMobileSidebarOpen(true);
  };

  return (
    // ✅ Safe area support
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
      
      {/* ✅ Mobile Menu Toggle - Improved touch target */}
      {isMobile && !selectedUser && (
        <button
          onClick={toggleMobileSidebar}
          className="fixed top-4 left-4 z-50 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg md:hidden active:scale-95 transition-transform"
          aria-label="Toggle chat menu"
          style={{ minHeight: '48px', minWidth: '48px' }}
        >
          <Menu size={22} className="text-gray-700 dark:text-gray-300" />
        </button>
      )}

      {/* ✅ Mobile Overlay with blur */}
      {isMobile && isMobileSidebarOpen && selectedUser && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* ✅ Enhanced Sidebar */}
      <section className={`
        fixed md:static
        inset-y-0 left-0
        w-[280px] sm:w-[320px] md:w-[340px]
        bg-white dark:bg-gray-900
        border-r border-gray-200 dark:border-gray-800
        transform transition-transform duration-300 ease-in-out
        z-50 md:z-auto
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
        flex flex-col
        h-full
        shadow-xl md:shadow-none
        safe-area-inset
      `}>
        {/* ✅ Sidebar Header - Better touch targets */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar className="w-10 h-10 md:w-11 md:h-11 flex-shrink-0">
              <AvatarImage src={user?.profilePicture} />
              <AvatarFallback className="bg-purple-500 text-white text-sm">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <h1 className="font-semibold text-gray-800 dark:text-white truncate text-sm sm:text-base">
                {user?.username || 'Chat'}
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {onlineUsers?.length || 0} online
              </p>
            </div>
          </div>
          {isMobile && (
            <button
              onClick={toggleMobileSidebar}
              className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition active:scale-95"
              style={{ minHeight: '44px', minWidth: '44px' }}
            >
              <X size={22} className="text-gray-500 dark:text-gray-400" />
            </button>
          )}
        </div>

        {/* ✅ User List - Improved touch targets */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 space-y-1.5">
          {suggestedUsers?.map((suggestedUser) => {
            const isOnline = onlineUsers?.includes(suggestedUser?._id);
            const isSelected = selectedUser?._id === suggestedUser?._id;
            
            return (
              <div
                key={suggestedUser?._id}
                onClick={() => dispatch(setSelectedUser(suggestedUser))}
                className={`
                  flex items-center gap-3 p-3 md:p-4 rounded-xl cursor-pointer
                  transition-all duration-200
                  hover:bg-gray-100 dark:hover:bg-gray-800
                  active:scale-[0.98] active:bg-gray-200 dark:active:bg-gray-700
                  ${isSelected ? 'bg-purple-50 dark:bg-purple-950/30 border-2 border-purple-500' : ''}
                `}
                style={{ minHeight: '64px' }}
              >
                <div className="relative flex-shrink-0">
                  <Avatar className="w-11 h-11 md:w-13 md:h-13">
                    <AvatarImage src={suggestedUser?.profilePicture} />
                    <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm">
                      {suggestedUser?.name?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className={`
                    absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-gray-900
                    ${isOnline ? 'bg-green-500' : 'bg-gray-400'}
                  `} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-gray-800 dark:text-white truncate text-sm md:text-base">
                      {suggestedUser?.name || suggestedUser?.username}
                    </span>
                    <span className={`text-xs font-medium whitespace-nowrap ${isOnline ? 'text-green-500' : 'text-gray-400'}`}>
                      {isOnline ? '● Online' : 'Offline'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {suggestedUser?.bio || 'No bio'}
                  </p>
                </div>
              </div>
            );
          })}
          
          {(!suggestedUsers || suggestedUsers.length === 0) && (
            <div className="text-center py-12 px-4">
              <MessageCircleCode className="w-14 h-14 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-base">No users to chat with</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Start following people to chat</p>
            </div>
          )}
        </div>

        {/* ✅ Sidebar Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
            <span>{suggestedUsers?.length || 0} contacts</span>
            <span>•</span>
            <span>{onlineUsers?.length || 0} online</span>
          </div>
        </div>
      </section>

      {/* ✅ Chat Area */}
      <div className="flex-1 flex flex-col h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
        {selectedUser ? (
          <>
            {/* ✅ Chat Header - Responsive */}
            <div className="flex items-center gap-2 md:gap-3 px-3 sm:px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm flex-shrink-0">
              {isMobile && (
                <button
                  onClick={handleBack}
                  className="p-3 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition active:scale-95"
                  style={{ minHeight: '44px', minWidth: '44px' }}
                >
                  <ArrowLeft size={22} className="text-gray-600 dark:text-gray-300" />
                </button>
              )}
              
              <Avatar className="w-10 h-10 sm:w-11 sm:h-11 flex-shrink-0">
                <AvatarImage src={selectedUser?.profilePicture} />
                <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  {selectedUser?.name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-gray-800 dark:text-white truncate text-sm sm:text-base">
                    {selectedUser?.name || selectedUser?.username}
                  </span>
                  <span className={`text-xs whitespace-nowrap ${onlineUsers?.includes(selectedUser?._id) ? 'text-green-500' : 'text-gray-400'}`}>
                    {onlineUsers?.includes(selectedUser?._id) ? 'Online' : 'Offline'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {selectedUser?.bio || 'No bio available'}
                </p>
              </div>

              <button className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition active:scale-95 hidden sm:block">
                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
              </button>
            </div>

            {/* ✅ Messages Area */}
            <Messages selectedUser={selectedUser} />

            {/* ✅ Enhanced Message Input - Fully Responsive */}
            <div className="flex-shrink-0 p-2 sm:p-3 md:p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 safe-area-bottom">
              <div className="flex items-end gap-2 max-w-4xl mx-auto">
                <div className="flex-1 relative">
                  <Input
                    value={textMessage}
                    onChange={(e) => setTextMessage(e.target.value)}
                    type="text"
                    className="w-full px-4 py-3 sm:py-4 pr-14 min-h-[48px] sm:min-h-[52px] bg-gray-100 dark:bg-gray-800 border-2 border-transparent focus:border-purple-500 dark:focus:border-purple-400 rounded-xl outline-none transition-all duration-200 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-base sm:text-sm"
                    placeholder={isSending ? "Sending..." : "Type a message..."}
                    disabled={isSending}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey && !isSending) {
                        e.preventDefault();
                        sendMessageHandler(selectedUser?._id);
                      }
                    }}
                  />
                  
                  {/* ✅ Send button inside input - Always visible on mobile */}
                  {textMessage.trim() && !isSending && (
                    <button
                      onClick={() => sendMessageHandler(selectedUser?._id)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
                      aria-label="Send message"
                      style={{ minHeight: '44px', minWidth: '44px' }}
                    >
                      <Send size={18} className="sm:w-5 sm:h-5" />
                    </button>
                  )}
                  
                  {isSending && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                
                {/* ✅ Desktop Send Button */}
                <Button
                  onClick={() => sendMessageHandler(selectedUser?._id)}
                  disabled={!textMessage.trim() || isSending}
                  className="hidden sm:flex px-6 sm:px-8 py-3 sm:py-4 min-h-[48px] sm:min-h-[52px] bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 text-sm sm:text-base"
                >
                  {isSending ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </div>
                  ) : (
                    'Send'
                  )}
                </Button>
              </div>
            </div>
          </>
        ) : (
          // ✅ Enhanced Empty State - Responsive
          <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
            <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full flex items-center justify-center mb-4 sm:mb-6">
              <MessageCircleCode className="w-10 h-10 sm:w-14 sm:h-14 md:w-20 md:h-20 text-purple-500 dark:text-purple-400" />
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2 sm:mb-3 text-center">
              Your messages
            </h1>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 text-center max-w-sm">
              Send a private message to start a chat with someone
            </p>
            {isMobile && suggestedUsers?.length > 0 && (
              <button
                onClick={toggleMobileSidebar}
                className="mt-6 sm:mt-8 px-6 sm:px-8 py-3 sm:py-4 min-h-[48px] text-sm sm:text-base bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95"
              >
                Start a conversation
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;