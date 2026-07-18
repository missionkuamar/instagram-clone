// components/search/UsersSearch.jsx - Complete Independent
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Search, X, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { searchUsers, setUsersQuery, setUsersPagination, setUsersFilters, clearUsers } from '../../features/search/searchSlice';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

const UsersSearch = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        users,
        usersLoading,
        usersError,
        usersPagination,
        usersQuery,
        usersFilters
    } = useSelector((state) => state?.search);

// console.log("usersPagination : ", usersPagination)
// console.log("usersPagination currentPerPage: ", usersPagination?.currentPage)
// console.log("usersPagination totalPages : ", usersPagination?.totalPages)
// console.log("usersPagination totalItems: ", usersPagination?.totalItems)
// console.log("usersPagination itemsPerPage: ", usersPagination?.itemsPerPage)


    const [localQuery, setLocalQuery] = useState(usersQuery || '');
    const [limit, setLimit] = useState(10);


    // Search handler
    const handleSearch = useCallback((searchQuery, page = 1) => {
        
        dispatch(setUsersQuery(searchQuery));
        dispatch(searchUsers({
            query: searchQuery,
            page,
            limit,
            sortBy: usersFilters?.sortBy,
            sortOrder: usersFilters?.sortOrder
        }));
    }, [dispatch, limit, usersFilters?.sortBy, usersFilters?.sortOrder]);


useEffect(() => {
    const timer = setTimeout(() => {

        handleSearch(localQuery, 1);

    }, 500);

    return () => clearTimeout(timer);

}, [localQuery, handleSearch]);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (localQuery?.trim()) {
                handleSearch(localQuery);
            } 
        }, 500);
        return () => clearTimeout(timer);
    }, [localQuery, handleSearch, dispatch]);



  useEffect(() => {
        dispatch(
            searchUsers({
                query: "",
                page: 1,
                limit: 10,
                sortBy: "createdAt",
                sortOrder: "desc",
            })
        );
    }, [dispatch]);



    // Sync with Redux query
    useEffect(() => {
        if (usersQuery) {
            setLocalQuery(usersQuery);
        }
    }, [usersQuery]);


  


    // Pagination
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= usersPagination?.totalPages) {
            handleSearch(localQuery, newPage);
        }
    };


    

    // Limit change
    const handleLimitChange = (newLimit) => {
    const parsedLimit = parseInt(newLimit);

    setLimit(parsedLimit);

    dispatch(setUsersPagination({
        itemsPerPage: parsedLimit,
        currentPage: 1,
    }));

    dispatch(searchUsers({
        query: localQuery,
        page: 1,
        limit: parsedLimit,
        sortBy: usersFilters?.sortBy,
        sortOrder: usersFilters?.sortOrder,
    }));
};

    // Sort change
    const handleSortChange = (field, value) => {
        dispatch(setUsersFilters({ [field]: value }));
        if (localQuery?.trim()) {
            handleSearch(localQuery, 1);
        }
    };

    // Render user card
    const renderUserCard = (user) => {
        if (!user) return null;
        return (
            <div
                key={user?._id}
                onClick={() => navigate(`/profile/${user?._id}`)}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl cursor-pointer transition-all border border-gray-100 dark:border-gray-800"
            >
                <Avatar className="w-12 h-12">
                    <AvatarImage src={user?.profilePicture} />
                    <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                        {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <p className="font-semibold text-gray-800 dark:text-white">{user?.username}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{user?.name || user?.fullName || 'No name'}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                        <span>{user?.followers?.length || 0} followers</span>
                        <span>{user?.following?.length || 0} following</span>
                    </div>
                </div>
                <Button variant="outline" size="sm">View Profile</Button>
            </div>
        );
    };

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    value={localQuery}
                    onChange={(e) => setLocalQuery(e.target.value)}
                    placeholder="Search users by username or name..."
                    className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:border-purple-500 outline-none transition"
                />
                {localQuery && (
                    <button
                        onClick={() => { setLocalQuery(''); dispatch(clearUsers()); }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                    >
                        <X size={16} className="text-gray-400" />
                    </button>
                )}
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <Select value={limit?.toString()} onValueChange={handleLimitChange}>
                        <SelectTrigger className="w-20 h-8 text-xs">
                            <SelectValue placeholder="10" />
                        </SelectTrigger>
                        <SelectContent
                            position="popper"
                            side="bottom"
                            sideOffset={5}
                            className="z-50 min-w-[80px] bg-white">
                            <SelectItem value="5">5</SelectItem>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        value={usersFilters?.sortBy}
                        onValueChange={(value) => handleSortChange('sortBy', value)}
                    >
                        <SelectTrigger className="w-28 h-8 text-xs">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent
                            position="popper"
                            side="bottom"
                            sideOffset={5}
                            className="z-50 min-w-[80px] bg-white">
                            <SelectItem value="createdAt">Date</SelectItem>
                            <SelectItem value="username">Username</SelectItem>
                            <SelectItem value="followers">Followers</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        value={usersFilters?.sortOrder}
                        onValueChange={(value) => handleSortChange('sortOrder', value)}
                    >
                        <SelectTrigger className="w-24 h-8 text-xs">
                            <SelectValue placeholder="Order" />
                        </SelectTrigger>
                        <SelectContent
                            position="popper"
                            side="bottom"
                            sideOffset={5}
                            className="z-50 min-w-[80px] bg-white">
                            <SelectItem value="desc">Desc</SelectItem>
                            <SelectItem value="asc">Asc</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Results */}
            {usersLoading ? (
                <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-20 rounded-xl" />
                    ))}
                </div>
            ) : localQuery && users?.length === 0 ? (
                <div className="text-center py-12">
                    <User size={40} className="mx-auto text-gray-400 mb-3" />
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No users found</h3>
                    <p className="text-gray-400 text-sm">Try different keywords</p>
                </div>
            ) : users?.length > 0 && (
                <>
                    <div className="text-sm text-gray-500">
                        Showing {users?.length} of {usersPagination?.totalItems} users
                    </div>
                    <div className="space-y-2">
                        {users?.map(renderUserCard)}
                    </div>

                    {/* Pagination */}
                    {usersPagination?.totalPages > 0 && (
                        <div className="flex items-center justify-center gap-2 pt-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(usersPagination?.currentPage - 1)}
                                disabled={usersPagination?.currentPage === 1 || usersLoading}
                            >
                                <ChevronLeft size={16} />
                            </Button>
                            <span className="text-sm">
                                Page {usersPagination?.currentPage} of {usersPagination?.totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(usersPagination?.currentPage + 1)}
                                disabled={usersPagination?.currentPage === usersPagination?.totalPages || usersLoading}
                            >
                                <ChevronRight size={16} />
                            </Button>
                        </div>
                    )}
                </>
            )}

            {usersError && (
                <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 rounded-lg text-red-600 text-sm">
                    {usersError}
                </div>
            )}
        </div>
    );
};

export default UsersSearch;