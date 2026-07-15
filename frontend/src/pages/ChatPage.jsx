// ChatPage.jsx - Fixed Message Sending
import { setSelectedUser } from '@/features/auth/authSlice';
import axiosInstance from '@/services/axiosInstance';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MessageCircleCode, Menu, X, ArrowLeft, Send } from 'lucide-react';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setMessages,} from '../features/chat/chatSlice';
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

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileSidebarOpen(false);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close sidebar when selecting user on mobile
  useEffect(() => {
    if (isMobile && selectedUser) {
      setIsMobileSidebarOpen(false);
    }
  }, [selectedUser, isMobile]);

  // ✅ FIXED: Send Message Handler with better error handling
   const sendMessageHandler = async (receiverId) => {
        try {
            const res = await axiosInstance.post(`/message/send/${receiverId}`, { textMessage }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setMessages([...messages, res.data.newMessage]));
                setTextMessage("");
            }
        } catch (error) {
            console.log(error);
        }
    }

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
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      {/* Mobile Menu Toggle */}
      {isMobile && !selectedUser && (
        <button
          onClick={toggleMobileSidebar}
          className="fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg md:hidden"
          aria-label="Toggle chat menu"
        >
          <Menu size={20} className="text-gray-700 dark:text-gray-300" />
        </button>
      )}

      {/* Mobile Overlay */}
      {isMobile && isMobileSidebarOpen && selectedUser && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <section className={`
        fixed md:static
        inset-y-0 left-0
        w-72 sm:w-80
        bg-white dark:bg-gray-900
        border-r border-gray-200 dark:border-gray-800
        transform transition-transform duration-300 ease-in-out
        z-40
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
        flex flex-col
        h-full
        shadow-xl md:shadow-none
      `}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src={user?.profilePicture} />
              <AvatarFallback className="bg-purple-500 text-white text-xs">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <h1 className="font-semibold text-gray-800 dark:text-white truncate">
              {user?.username || 'Chat'}
            </h1>
          </div>
          {isMobile && (
            <button
              onClick={toggleMobileSidebar}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
            >
              <X size={20} className="text-gray-500 dark:text-gray-400" />
            </button>
          )}
        </div>

        {/* User List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {suggestedUsers?.map((suggestedUser) => {
            const isOnline = onlineUsers?.includes(suggestedUser?._id);
            const isSelected = selectedUser?._id === suggestedUser?._id;
            
            return (
              <div
                key={suggestedUser?._id}
                onClick={() => dispatch(setSelectedUser(suggestedUser))}
                className={`
                  flex items-center gap-3 p-3 rounded-xl cursor-pointer
                  transition-all duration-200
                  hover:bg-gray-100 dark:hover:bg-gray-800
                  ${isSelected ? 'bg-purple-50 dark:bg-purple-950/30 border-2 border-purple-500' : ''}
                `}
              >
                <div className="relative">
                  <Avatar className="w-12 h-12">
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
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-800 dark:text-white truncate">
                      {suggestedUser?.name || suggestedUser?.username}
                    </span>
                    <span className={`text-xs font-medium ${isOnline ? 'text-green-500' : 'text-gray-400'}`}>
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
            <div className="text-center py-12">
              <MessageCircleCode className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No users to chat with</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">Start following people to chat</p>
            </div>
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
            <span>{suggestedUsers?.length || 0} contacts</span>
            <span>•</span>
            <span>{onlineUsers?.length || 0} online</span>
          </div>
        </div>
      </section>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col h-screen bg-gray-50 dark:bg-gray-950">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm flex-shrink-0">
              {isMobile && (
                <button
                  onClick={handleBack}
                  className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                >
                  <ArrowLeft size={20} className="text-gray-600 dark:text-gray-300" />
                </button>
              )}
              
              <Avatar className="w-10 h-10">
                <AvatarImage src={selectedUser?.profilePicture} />
                <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  {selectedUser?.name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-800 dark:text-white truncate">
                    {selectedUser?.name || selectedUser?.username}
                  </span>
                  <span className={`text-xs ${onlineUsers?.includes(selectedUser?._id) ? 'text-green-500' : 'text-gray-400'}`}>
                    {onlineUsers?.includes(selectedUser?._id) ? 'Online' : 'Offline'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {selectedUser?.bio || 'No bio available'}
                </p>
              </div>

              <div className="flex items-center gap-1">
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition">
                  <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Messages */}
            <Messages selectedUser={selectedUser} />

            {/* Message Input */}
            <div className="flex-shrink-0 p-3 sm:p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-end gap-2 max-w-4xl mx-auto">
                <div className="flex-1 relative">
                  <Input
                    value={textMessage}
                    onChange={(e) => setTextMessage(e.target.value)}
                    type="text"
                    className="w-full px-4 py-3 pr-14 bg-gray-100 dark:bg-gray-800 border-2 border-transparent focus:border-purple-500 dark:focus:border-purple-400 rounded-xl outline-none transition-all duration-200 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                    placeholder={isSending ? "Sending..." : "Type a message..."}
                    disabled={isSending}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessageHandler(selectedUser?._id);
                      }
                    }}
                  />
                  {/* Send button inside input */}
                  {textMessage.trim() && !isSending && (
                    <button
                      onClick={() => sendMessageHandler(selectedUser?._id)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                      aria-label="Send message"
                    >
                      <Send size={18} />
                    </button>
                  )}
                  {isSending && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                {/* Desktop Send Button */}
                <Button
                  onClick={() => sendMessageHandler(selectedUser?._id)}
                  disabled={!textMessage.trim() || isSending}
                  className="hidden sm:flex px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                >
                  {isSending ? 'Sending...' : 'Send'}
                </Button>
              </div>
            </div>
          </>
        ) : (
          // Empty State
          <div className="flex-1 flex flex-col items-center justify-center p-4">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full flex items-center justify-center mb-4">
              <MessageCircleCode className="w-12 h-12 sm:w-16 sm:h-16 text-purple-500 dark:text-purple-400" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Your messages
            </h1>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 text-center max-w-sm">
              Send a private message to start a chat with someone
            </p>
            {isMobile && suggestedUsers?.length > 0 && (
              <button
                onClick={toggleMobileSidebar}
                className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
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