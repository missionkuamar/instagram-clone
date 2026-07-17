// utils/fakeData.js

// ✅ Generate 30 Fake Users
export const generateFakeUsers = (count = 30) => {
    const firstNames = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Pranav', 'Darsh', 'Krishna', 'Shaurya',
        'Anaya', 'Diya', 'Ishita', 'Myra', 'Aanya', 'Sara', 'Riya', 'Kavya', 'Priya', 'Neha',
        'James', 'Emma', 'Olivia', 'Liam', 'Sophia', 'Mason', 'Isabella', 'Ethan', 'Mia', 'Noah'
    ];
    
    const lastNames = ['Sharma', 'Verma', 'Patel', 'Kumar', 'Singh', 'Reddy', 'Gupta', 'Joshi', 'Nair', 'Menon',
        'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'
    ];
    
    const bioOptions = [
        '✨ Dreamer | Creator | Innovator',
        '🚀 Building the future',
        '📸 Capturing moments',
        '💻 Code | Coffee | Creativity',
        '🌱 Growing everyday',
        '🎯 Living life with purpose',
        '🌟 Believer in magic',
        '📚 Book lover | Writer',
        '🎨 Art is my therapy',
        '🌍 Exploring the world',
        '💪 Fitness enthusiast',
        '🎵 Music is life',
        '🐱 Cat person | Dog lover',
        '🍕 Pizza is my love language',
        '✈️ Wanderlust | Traveler',
        '📷 Photography | Nature',
        '🧘‍♂️ Yoga | Mindfulness',
        '🎮 Gamer | Tech geek',
        '💼 Entrepreneur | Leader',
        '🎭 Drama | Theatre lover'
    ];

    const users = [];
    
    for (let i = 0; i < count; i++) {
        const firstName = firstNames[i % firstNames.length];
        const lastName = lastNames[i % lastNames.length];
        const username = `${firstName.toLowerCase()}${lastName.toLowerCase()}${Math.floor(Math.random() * 100)}`;
        
        users.push({
            _id: `user_${Date.now()}_${i}`,
            username: username,
            name: `${firstName} ${lastName}`,
            email: `${username}@example.com`,
            profilePicture: `https://i.pravatar.cc/150?img=${i + 1}`,
            bio: bioOptions[i % bioOptions.length],
            followers: Array.from({ length: Math.floor(Math.random() * 50) }, (_, idx) => `follower_${idx}`),
            following: Array.from({ length: Math.floor(Math.random() * 30) }, (_, idx) => `following_${idx}`),
            posts: Array.from({ length: Math.floor(Math.random() * 20) }, (_, idx) => `post_${idx}`),
            gender: Math.random() > 0.5 ? 'male' : 'female',
            createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString()
        });
    }
    
    return users;
};

// ✅ Generate 30 Fake Posts
export const generateFakePosts = (count = 30) => {
    const captions = [
        'Beautiful day to be alive! 🌅',
        'Just finished an amazing project 💻',
        'Coffee and code, my favorite combination ☕',
        'Exploring new horizons 🌍',
        'Feeling grateful for this moment 🙏',
        'Life is beautiful when you see it from the right angle ✨',
        'Creating memories that last forever 📸',
        'The journey continues... 🚀',
        'Simplicity is the ultimate sophistication 🌟',
        'Dream big, work hard, stay humble 💪',
        'Adventure awaits! 🌄',
        'Find joy in the little things 🌸',
        'Be the change you wish to see 🌈',
        'Keep going, you\'re almost there! 🎯',
        'Embrace the chaos 🌀',
        'Stay true to yourself 🌺',
        'Every day is a new beginning 🌅',
        'Choose happiness 😊',
        'Let your dreams take flight 🦋',
        'Gratitude is the best attitude 🙌',
        'Make it happen! ⚡',
        'You are enough, just as you are 💫',
        'Spread kindness like confetti 🎉',
        'Take the leap of faith 🦅',
        'Believe in yourself 🌟',
        'Create your own sunshine ☀️',
        'Life is a beautiful struggle 🌹',
        'Never stop learning 📚',
        'Be fearless in pursuit of your dreams 🏹',
        'Love deeply, live fully ❤️'
    ];

    const imageUrls = [
        'https://picsum.photos/seed/1/400/400',
        'https://picsum.photos/seed/2/400/400',
        'https://picsum.photos/seed/3/400/400',
        'https://picsum.photos/seed/4/400/400',
        'https://picsum.photos/seed/5/400/400',
        'https://picsum.photos/seed/6/400/400',
        'https://picsum.photos/seed/7/400/400',
        'https://picsum.photos/seed/8/400/400',
        'https://picsum.photos/seed/9/400/400',
        'https://picsum.photos/seed/10/400/400',
        'https://picsum.photos/seed/11/400/400',
        'https://picsum.photos/seed/12/400/400',
        'https://picsum.photos/seed/13/400/400',
        'https://picsum.photos/seed/14/400/400',
        'https://picsum.photos/seed/15/400/400',
        'https://picsum.photos/seed/16/400/400',
        'https://picsum.photos/seed/17/400/400',
        'https://picsum.photos/seed/18/400/400',
        'https://picsum.photos/seed/19/400/400',
        'https://picsum.photos/seed/20/400/400',
        'https://picsum.photos/seed/21/400/400',
        'https://picsum.photos/seed/22/400/400',
        'https://picsum.photos/seed/23/400/400',
        'https://picsum.photos/seed/24/400/400',
        'https://picsum.photos/seed/25/400/400',
        'https://picsum.photos/seed/26/400/400',
        'https://picsum.photos/seed/27/400/400',
        'https://picsum.photos/seed/28/400/400',
        'https://picsum.photos/seed/29/400/400',
        'https://picsum.photos/seed/30/400/400'
    ];

    const usernames = [
        'adventurer_01', 'creative_soul', 'tech_guru', 'nature_lover', 'dream_chaser',
        'art_enthusiast', 'code_master', 'food_explorer', 'travel_junkie', 'fitness_freak',
        'music_maker', 'book_worm', 'photography_fan', 'yoga_practitioner', 'gamer_pro',
        'entrepreneur_life', 'movie_buff', 'science_nerd', 'history_lover', 'language_learner',
        'fashion_stylist', 'dance_moves', 'poetry_writer', 'mindfulness_guide', 'tech_innovator',
        'sports_fanatic', 'animal_rescuer', 'plant_parent', 'space_explorer', 'ocean_lover'
    ];

    const posts = [];
    
    for (let i = 0; i < count; i++) {
        const likesCount = Math.floor(Math.random() * 50) + 10;
        const commentsCount = Math.floor(Math.random() * 20) + 5;
        
        posts.push({
            _id: `post_${Date.now()}_${i}`,
            caption: captions[i % captions.length],
            image: imageUrls[i % imageUrls.length],
            author: {
                _id: `user_${i}`,
                username: usernames[i % usernames.length],
                profilePicture: `https://i.pravatar.cc/150?img=${i + 1}`,
                name: `User ${i + 1}`
            },
            likes: Array.from({ length: likesCount }, (_, idx) => `liked_user_${idx}`),
            comments: Array.from({ length: commentsCount }, (_, idx) => ({
                _id: `comment_${i}_${idx}`,
                text: `Comment ${idx + 1} on post ${i + 1}`,
                author: {
                    _id: `comment_user_${idx}`,
                    username: `commenter${idx}`,
                    profilePicture: `https://i.pravatar.cc/150?img=${idx + 50}`
                },
                createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
            })),
            createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString()
        });
    }
    
    return posts;
};

// ✅ Combine both for easy import
export const fakeData = {
    users: generateFakeUsers(30),
    posts: generateFakePosts(30)
};

export default fakeData;