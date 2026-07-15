// Messages.jsx - Fixed Auto Scroll
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import useGetAllMessage from '../hooks/useGetAllMessage';
import useRealTimeMessage from '../hooks/useRealtimeMessage';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';

const Messages = () => {
  const [isTyping, setIsTyping] = useState(false);
  
  useGetAllMessage();
  useRealTimeMessage();
  
  const { user } = useSelector((state) => state.auth);
  const { messages, selectedUser } = useSelector((state) => state.chat);
  
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Auto-scroll to bottom on new messages - FIXED
  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }
    };

    // Small delay to ensure DOM is updated
    const timeoutId = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeoutId);
  }, [messages]);

  // Also scroll on initial load
  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({
          behavior: "auto",
          block: "end",
        });
      }
    };

    // Initial scroll after messages load
    if (messages && messages.length > 0) {
      const timeoutId = setTimeout(scrollToBottom, 200);
      return () => clearTimeout(timeoutId);
    }
  }, [messages?.length]);

  // Group messages by date
  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach(message => {
      const date = new Date(message.createdAt || message.timestamp || Date.now());
      const dateKey = date.toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(message);
    });
    return groups;
  };

  const groupedMessages = groupMessagesByDate(messages || []);

  // Format date header
  const formatDateHeader = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long',
        month: 'long', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  return (
    <div 
      ref={messagesContainerRef}
      className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950 p-3 sm:p-4 space-y-4"
      style={{ 
        height: 'calc(100vh - 130px)', // Adjust based on your header + input height
        overflowY: 'auto'
      }}
    >
      {messages && messages.length > 0 ? (
        Object.entries(groupedMessages).map(([dateKey, dateMessages]) => (
          <div key={dateKey} className="space-y-3">
            {/* Date Separator */}
            <div className="flex justify-center">
              <span className="px-4 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-800 rounded-full">
                {formatDateHeader(dateKey)}
              </span>
            </div>

            {/* Messages for this date */}
            {dateMessages.map((message, index) => {
              const isSender = message.senderId === user?._id;
              const showAvatar = !isSender && (
                index === 0 || 
                dateMessages[index - 1]?.senderId !== message.senderId
              );
              
              return (
                <div
                  key={message._id || index}
                  className={`flex ${isSender ? 'justify-end' : 'justify-start'} items-end gap-2`}
                >
                  {/* Sender Avatar */}
                  {!isSender && (
                    <div className={`flex-shrink-0 ${showAvatar ? 'block' : 'invisible'}`}>
                      <Avatar className="w-8 h-8">
                        <AvatarImage 
                          src={selectedUser?.profilePicture} 
                          alt={selectedUser?.name}
                        />
                        <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                          {selectedUser?.name?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  )}

                  {/* Message Container */}
                  <div className={`
                    flex flex-col max-w-[85%] sm:max-w-[75%] md:max-w-[70%] lg:max-w-[60%]
                    ${isSender ? 'items-end' : 'items-start'}
                  `}>
                    {/* Message Bubble */}
                    <div
                      className={`
                        relative px-4 py-2.5 rounded-2xl
                        ${isSender 
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-none' 
                          : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-bl-none shadow-sm'
                        }
                        break-words
                        transition-all duration-200
                      `}
                    >
                      <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                        {message.message || message.textMessage || message.text}
                      </p>
                      
                      {/* Message Timestamp */}
                      <span className={`
                        text-[10px] mt-1 block
                        ${isSender 
                          ? 'text-purple-200/80' 
                          : 'text-gray-400 dark:text-gray-500'
                        }
                      `}>
                        {formatDistanceToNow(new Date(message.createdAt || message.timestamp || Date.now()), { 
                          addSuffix: true 
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Read Receipt (for sender) */}
                  {isSender && (
                    <div className="flex-shrink-0 self-end mb-1">
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {message.read ? '✓✓' : '✓'}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))
      ) : (
        // Empty State
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
          <div className="w-20 h-20 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            No messages yet
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-sm">
            Send a message to start the conversation
          </p>
        </div>
      )}

      {/* Typing Indicator */}
      {isTyping && (
        <div className="flex justify-start items-center gap-2">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
              {selectedUser?.name?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="bg-white dark:bg-gray-800 px-4 py-2.5 rounded-2xl rounded-bl-none shadow-sm">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      )}

      {/* Scroll anchor - FIXED */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default Messages;