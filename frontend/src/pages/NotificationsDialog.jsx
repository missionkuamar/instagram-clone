// NotificationsDialog.jsx - Fixed Version with Accessibility
import React, { useEffect, useRef } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription  // ✅ Import DialogDescription
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageCircle, UserPlus, Bell, X, Trash2 } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { markNotificationsAsRead, clearAllNotifications } from '../features/rtnslice/notification.js';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const NotificationsDialog = ({ open, setOpen }) => {
    const { likeNotification } = useSelector((store) => store.realTimeNotification);
  //  console.log(likeNotification);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    // ✅ Use ref to prevent multiple dispatches
    const hasMarkedRead = useRef(false);

    // ✅ Mark notifications as read when dialog opens - with proper dependency
    useEffect(() => {
        if (open && likeNotification?.length > 0 && !hasMarkedRead.current) {
            const unreadExists = likeNotification.some(notif => !notif.read);
            if (unreadExists) {
                dispatch(markNotificationsAsRead());
                hasMarkedRead.current = true;
            }
        }
        
        // ✅ Reset the flag when dialog closes
        if (!open) {
            hasMarkedRead.current = false;
        }
    }, [open, dispatch, likeNotification]);

    const getNotificationIcon = (type) => {
        switch(type) {
            case 'like':
                return <Heart size={18} className="text-red-500" />;
            case 'comment':
                return <MessageCircle size={18} className="text-blue-500" />;
            case 'follow':
                return <UserPlus size={18} className="text-green-500" />;
            default:
                return <Bell size={18} className="text-purple-500" />;
        }
    };

    const handleNotificationClick = (notification) => {
        if (notification.postId) {
            navigate(`/post/${notification.postId}`);
        } else if (notification.userId) {
            navigate(`/profile/${notification.userId}`);
        }
        setOpen(false);
    };

    const getNotificationText = (notification) => {
        const username = notification?.username || notification?.fromUser?.username || 'Someone';
        switch(notification.type) {
            case 'like':
                return `${username} liked your post`;
            case 'comment':
                return `${username} commented on your post`;
            case 'follow':
                return `${username} started following you`;
            default:
                return `${username} interacted with your post`;
        }
    };

    const handleClearAll = () => {
        if (window.confirm('Clear all notifications?')) {
            dispatch(clearAllNotifications());
        }
    };

    // ✅ Safe check for notifications
    const notifications = likeNotification || [];
    const hasNotifications = notifications.length > 0;
    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent 
                className="sm:max-w-md max-h-[80vh] bg-white dark:bg-gray-900"
                aria-describedby="notification-dialog-description" // ✅ Add aria-describedby
            >
                <DialogHeader className="border-b border-gray-200 dark:border-gray-800 pb-3">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-xl font-bold dark:text-white">
                            Notifications
                            {unreadCount > 0 && (
                                <span className="ml-2 text-sm bg-red-500 text-white px-2 py-0.5 rounded-full">
                                    {unreadCount}
                                </span>
                            )}
                        </DialogTitle>
                        <div className="flex items-center gap-2">
                            {hasNotifications && (
                                <button
                                    onClick={handleClearAll}
                                    className="p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition text-red-500"
                                    title="Clear all notifications"
                                    aria-label="Clear all notifications" // ✅ Add aria-label
                                >
                                    <Trash2 size={18} />
                                </button>
                            )}
                            <button
                                onClick={() => setOpen(false)}
                                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                                aria-label="Close notifications" // ✅ Add aria-label
                            >
                                <X size={20} className="text-gray-500 dark:text-gray-400" />
                            </button>
                        </div>
                    </div>
                </DialogHeader>

                {/* ✅ Add DialogDescription for accessibility */}
                <DialogDescription id="notification-dialog-description" className="sr-only">
                    {hasNotifications 
                        ? `You have ${notifications.length} notifications, ${unreadCount} unread` 
                        : 'No notifications available'
                    }
                </DialogDescription>

                <div className="flex-1 overflow-y-auto py-2 space-y-1">
                    {!hasNotifications ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Bell size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
                            <p className="text-gray-500 dark:text-gray-400 font-medium">
                                No notifications yet
                            </p>
                            <p className="text-sm text-gray-400 dark:text-gray-500">
                                When someone interacts with your posts, you'll see it here
                            </p>
                        </div>
                    ) : (
                        [...notifications].reverse().map((notification, index) => {
                            // ✅ Safe access with fallbacks
                            const notifId = notification?._id || notification?.id || `notif-${index}`;
                            const isUnread = !notification?.read;
                            const username = notification?.username || notification?.fromUser?.username || 'Someone';
                            const profilePic = notification?.profilePicture || notification?.fromUser?.profilePicture;
                            
                            return (
                                <div
                                    key={notifId}
                                    onClick={() => handleNotificationClick(notification)}
                                    className={`
                                        flex items-start gap-3 p-3 rounded-lg cursor-pointer
                                        transition-all duration-200
                                        ${isUnread 
                                            ? 'bg-purple-50 dark:bg-purple-950/30 border-l-4 border-purple-500' 
                                            : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                                        }
                                    `}
                                    role="button" // ✅ Add role for accessibility
                                    tabIndex={0} // ✅ Make keyboard accessible
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            handleNotificationClick(notification);
                                        }
                                    }}
                                >
                                    <Avatar className="w-10 h-10 flex-shrink-0">
                                        <AvatarImage src={profilePic} alt={`${username}'s avatar`} />
                                        <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                                            {username.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <p className={`
                                                text-sm ${isUnread 
                                                    ? 'font-semibold dark:text-white' 
                                                    : 'text-gray-700 dark:text-gray-300'
                                                }
                                            `}>
                                                {getNotificationText(notification)}
                                            </p>
                                            <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap mt-0.5">
                                                {formatDistanceToNow(new Date(notification?.createdAt || Date.now()), { 
                                                    addSuffix: true 
                                                })}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-gray-400 dark:text-gray-500 capitalize">
                                                {notification?.type || 'notification'}
                                            </span>
                                            {isUnread && (
                                                <span className="w-2 h-2 bg-purple-500 rounded-full" />
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex-shrink-0 mt-1">
                                        {getNotificationIcon(notification?.type)}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {hasNotifications && (
                    <div className="border-t border-gray-200 dark:border-gray-800 pt-3 mt-2">
                        <p className="text-xs text-center text-gray-400 dark:text-gray-500">
                            {notifications.length} notification{notifications.length > 1 ? 's' : ''}
                            {unreadCount > 0 && 
                                ` • ${unreadCount} unread`
                            }
                        </p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default NotificationsDialog;