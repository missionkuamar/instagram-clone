const fakePosts = [
    {
        _id: "1",
        image: "https://images.unsplash.com/photo-1682687220742-aba19b74f2d5?w=500",
        caption: "Beautiful sunset at the beach! 🌅 #nature #sunset",
        likes: ["user1", "user2", "user3", "user4"],
        comments: [
            {
                _id: "c1",
                text: "Amazing view! 😍",
                author: {
                    _id: "user2",
                    username: "johndoe",
                    profilePicture: "https://randomuser.me/api/portraits/men/1.jpg"
                }
            },
            {
                _id: "c2",
                text: "Where is this?",
                author: {
                    _id: "user3",
                    username: "janedoe",
                    profilePicture: "https://randomuser.me/api/portraits/women/1.jpg"
                }
            }
        ],
        author: {
            _id: "user1",
            username: "alexjohnson",
            profilePicture: "https://randomuser.me/api/portraits/men/2.jpg"
        },
        createdAt: "2024-01-15T10:30:00Z"
    },
    {
        _id: "2",
        image: "https://images.unsplash.com/photo-1682687221038-404670d09c0a?w=500",
        caption: "Morning coffee ritual ☕✨ #coffeetime",
        likes: ["user2", "user5", "user7"],
        comments: [
            {
                _id: "c3",
                text: "Love the mug!",
                author: {
                    _id: "user5",
                    username: "coffeelover",
                    profilePicture: "https://randomuser.me/api/portraits/women/2.jpg"
                }
            }
        ],
        author: {
            _id: "user2",
            username: "emilywils",
            profilePicture: "https://randomuser.me/api/portraits/women/3.jpg"
        },
        createdAt: "2024-01-14T08:15:00Z"
    },
    {
        _id: "3",
        image: "https://images.unsplash.com/photo-1682695797873-aa4cb6edd613?w=500",
        caption: "Adventures in the mountains 🏔️✨ #hiking",
        likes: ["user1", "user3", "user4", "user6", "user8"],
        comments: [
            {
                _id: "c4",
                text: "Incredible view!",
                author: {
                    _id: "user6",
                    username: "mountainlover",
                    profilePicture: "https://randomuser.me/api/portraits/men/3.jpg"
                }
            },
            {
                _id: "c5",
                text: "Adding to my bucket list!",
                author: {
                    _id: "user8",
                    username: "travelbug",
                    profilePicture: "https://randomuser.me/api/portraits/women/4.jpg"
                }
            }
        ],
        author: {
            _id: "user3",
            username: "mikebrown",
            profilePicture: "https://randomuser.me/api/portraits/men/4.jpg"
        },
        createdAt: "2024-01-13T14:20:00Z"
    },
    {
        _id: "4",
        image: "https://images.unsplash.com/photo-1682695794947-17061dc284dd?w=500",
        caption: "City lights at night 🌃✨ #nightlife",
        likes: ["user4", "user7", "user9"],
        comments: [
            {
                _id: "c6",
                text: "Beautiful shot!",
                author: {
                    _id: "user7",
                    username: "nightowl",
                    profilePicture: "https://randomuser.me/api/portraits/men/5.jpg"
                }
            }
        ],
        author: {
            _id: "user4",
            username: "sarahconnor",
            profilePicture: "https://randomuser.me/api/portraits/women/5.jpg"
        },
        createdAt: "2024-01-12T20:45:00Z"
    },
    {
        _id: "5",
        image: "https://images.unsplash.com/photo-1682695796954-bad0d6f59ffc?w=500",
        caption: "Delicious homemade pasta! 🍝 #cooking #foodie",
        likes: ["user1", "user5", "user8", "user10"],
        comments: [
            {
                _id: "c7",
                text: "Recipe please! 🙏",
                author: {
                    _id: "user10",
                    username: "foodlover",
                    profilePicture: "https://randomuser.me/api/portraits/women/6.jpg"
                }
            },
            {
                _id: "c8",
                text: "Looks amazing!",
                author: {
                    _id: "user5",
                    username: "coffeelover",
                    profilePicture: "https://randomuser.me/api/portraits/women/2.jpg"
                }
            }
        ],
        author: {
            _id: "user5",
            username: "chefmarco",
            profilePicture: "https://randomuser.me/api/portraits/men/6.jpg"
        },
        createdAt: "2024-01-11T12:00:00Z"
    },
    {
        _id: "6",
        image: "https://images.unsplash.com/photo-1682695795557-20ef131c6e3a?w=500",
        caption: "Beach vibes 🏖️🌊 #summer",
        likes: ["user2", "user6", "user9"],
        comments: [],
        author: {
            _id: "user6",
            username: "beachbum",
            profilePicture: "https://randomuser.me/api/portraits/women/7.jpg"
        },
        createdAt: "2024-01-10T16:30:00Z"
    },
    {
        _id: "7",
        image: "https://images.unsplash.com/photo-1682695796030-6bdef4c1a555?w=500",
        caption: "My new puppy! 🐶❤️ #dogsofinstagram",
        likes: ["user1", "user3", "user4", "user5", "user7", "user8"],
        comments: [
            {
                _id: "c9",
                text: "So cute! 😍",
                author: {
                    _id: "user3",
                    username: "mikebrown",
                    profilePicture: "https://randomuser.me/api/portraits/men/4.jpg"
                }
            },
            {
                _id: "c10",
                text: "What's the name?",
                author: {
                    _id: "user8",
                    username: "travelbug",
                    profilePicture: "https://randomuser.me/api/portraits/women/4.jpg"
                }
            }
        ],
        author: {
            _id: "user7",
            username: "puppylove",
            profilePicture: "https://randomuser.me/api/portraits/women/8.jpg"
        },
        createdAt: "2024-01-09T09:15:00Z"
    },
    {
        _id: "8",
        image: "https://images.unsplash.com/photo-1682695796349-4da2e4a2e0c7?w=500",
        caption: "Gym motivation! 💪 #fitness",
        likes: ["user2", "user6", "user10"],
        comments: [],
        author: {
            _id: "user8",
            username: "fitlife",
            profilePicture: "https://randomuser.me/api/portraits/men/7.jpg"
        },
        createdAt: "2024-01-08T18:00:00Z"
    },
    {
        _id: "9",
        image: "https://images.unsplash.com/photo-1707343848873-d6a063b2e5b9?w=500",
        caption: "Work from home setup 🖥️ #remotework",
        likes: ["user1", "user4", "user7", "user9"],
        comments: [
            {
                _id: "c11",
                text: "Clean setup!",
                author: {
                    _id: "user4",
                    username: "sarahconnor",
                    profilePicture: "https://randomuser.me/api/portraits/women/5.jpg"
                }
            }
        ],
        author: {
            _id: "user9",
            username: "techgeek",
            profilePicture: "https://randomuser.me/api/portraits/men/8.jpg"
        },
        createdAt: "2024-01-07T11:30:00Z"
    },
    {
        _id: "10",
        image: "https://images.unsplash.com/photo-1707343843982-f61da0c6b7a2?w=500",
        caption: "Birthday celebrations! 🎂🎉",
        likes: ["user3", "user5", "user8", "user10"],
        comments: [
            {
                _id: "c12",
                text: "Happy birthday! 🎈",
                author: {
                    _id: "user5",
                    username: "coffeelover",
                    profilePicture: "https://randomuser.me/api/portraits/women/2.jpg"
                }
            },
            {
                _id: "c13",
                text: "Have a great day!",
                author: {
                    _id: "user10",
                    username: "foodlover",
                    profilePicture: "https://randomuser.me/api/portraits/women/6.jpg"
                }
            }
        ],
        author: {
            _id: "user10",
            username: "birthdaygirl",
            profilePicture: "https://randomuser.me/api/portraits/women/9.jpg"
        },
        createdAt: "2024-01-06T15:45:00Z"
    },
    {
        _id: "11",
        image: "https://images.unsplash.com/photo-1707343843698-7b4c9b9b9e8d?w=500",
        caption: "Art gallery visit 🎨🖼️ #artlover",
        likes: ["user2", "user6", "user9"],
        comments: [],
        author: {
            _id: "user11",
            username: "artenthusiast",
            profilePicture: "https://randomuser.me/api/portraits/women/10.jpg"
        },
        createdAt: "2024-01-05T13:20:00Z"
    },
    {
        _id: "12",
        image: "https://images.unsplash.com/photo-1707343844371-3f1d4b3b3b9e?w=500",
        caption: "Late night coding 💻🌙 #developer",
        likes: ["user1", "user4", "user7", "user8"],
        comments: [
            {
                _id: "c14",
                text: "Same here! 🚀",
                author: {
                    _id: "user8",
                    username: "travelbug",
                    profilePicture: "https://randomuser.me/api/portraits/women/4.jpg"
                }
            }
        ],
        author: {
            _id: "user12",
            username: "coderlife",
            profilePicture: "https://randomuser.me/api/portraits/men/9.jpg"
        },
        createdAt: "2024-01-04T23:59:00Z"
    },
    {
        _id: "13",
        image: "https://images.unsplash.com/photo-1707343844567-6b8e0f2c1a3d?w=500",
        caption: "Plant parent life 🌱🪴 #plants",
        likes: ["user3", "user5", "user10"],
        comments: [],
        author: {
            _id: "user13",
            username: "plantmom",
            profilePicture: "https://randomuser.me/api/portraits/women/11.jpg"
        },
        createdAt: "2024-01-03T10:00:00Z"
    },
    {
        _id: "14",
        image: "https://images.unsplash.com/photo-1707343845123-8d8b9e5f2c4b?w=500",
        caption: "Concert night! 🎸🎤 #livemusic",
        likes: ["user1", "user2", "user6", "user9", "user11"],
        comments: [
            {
                _id: "c15",
                text: "Who's performing?",
                author: {
                    _id: "user11",
                    username: "artenthusiast",
                    profilePicture: "https://randomuser.me/api/portraits/women/10.jpg"
                }
            },
            {
                _id: "c16",
                text: "Looks awesome!",
                author: {
                    _id: "user6",
                    username: "beachbum",
                    profilePicture: "https://randomuser.me/api/portraits/women/7.jpg"
                }
            }
        ],
        author: {
            _id: "user14",
            username: "musicfan",
            profilePicture: "https://randomuser.me/api/portraits/men/10.jpg"
        },
        createdAt: "2024-01-02T21:30:00Z"
    },
    {
        _id: "15",
        image: "https://images.unsplash.com/photo-1707343845987-3c1d5d8e2f1b?w=500",
        caption: "Road trip adventures! 🚗🗺️ #travel",
        likes: ["user4", "user7", "user12"],
        comments: [],
        author: {
            _id: "user15",
            username: "wanderlust",
            profilePicture: "https://randomuser.me/api/portraits/women/12.jpg"
        },
        createdAt: "2024-01-01T08:45:00Z"
    },
    {
        _id: "16",
        image: "https://images.unsplash.com/photo-1707343846225-8c9d8e2f1c3d?w=500",
        caption: "New year, new goals! 🎯✨ #2024",
        likes: ["user1", "user3", "user5", "user8", "user10", "user13"],
        comments: [
            {
                _id: "c17",
                text: "Let's get it! 💪",
                author: {
                    _id: "user13",
                    username: "plantmom",
                    profilePicture: "https://randomuser.me/api/portraits/women/11.jpg"
                }
            }
        ],
        author: {
            _id: "user16",
            username: "newyearvibes",
            profilePicture: "https://randomuser.me/api/portraits/men/11.jpg"
        },
        createdAt: "2024-01-01T00:01:00Z"
    },
    {
        _id: "17",
        image: "https://images.unsplash.com/photo-1707343846456-7c1d2e1a5b3f?w=500",
        caption: "Baking cookies! 🍪😋 #sweets",
        likes: ["user2", "user9", "user14"],
        comments: [],
        author: {
            _id: "user17",
            username: "bakerlady",
            profilePicture: "https://randomuser.me/api/portraits/women/13.jpg"
        },
        createdAt: "2023-12-31T14:15:00Z"
    },
    {
        _id: "18",
        image: "https://images.unsplash.com/photo-1707343846689-3d1e2a8b6c4f?w=500",
        caption: "Snow day! ❄️☃️ #winter",
        likes: ["user5", "user11", "user15"],
        comments: [
            {
                _id: "c18",
                text: "So beautiful!",
                author: {
                    _id: "user15",
                    username: "wanderlust",
                    profilePicture: "https://randomuser.me/api/portraits/women/12.jpg"
                }
            }
        ],
        author: {
            _id: "user18",
            username: "snowqueen",
            profilePicture: "https://randomuser.me/api/portraits/women/14.jpg"
        },
        createdAt: "2023-12-30T11:30:00Z"
    },
    {
        _id: "19",
        image: "https://images.unsplash.com/photo-1707343846891-2c1d5e8a7b9c?w=500",
        caption: "Gaming setup upgrade 🎮🕹️ #gamer",
        likes: ["user1", "user6", "user12", "user16"],
        comments: [
            {
                _id: "c19",
                text: "What games do you play?",
                author: {
                    _id: "user16",
                    username: "newyearvibes",
                    profilePicture: "https://randomuser.me/api/portraits/men/11.jpg"
                }
            }
        ],
        author: {
            _id: "user19",
            username: "gamerpro",
            profilePicture: "https://randomuser.me/api/portraits/men/12.jpg"
        },
        createdAt: "2023-12-29T19:00:00Z"
    },
    {
        _id: "20",
        image: "https://images.unsplash.com/photo-1707343847123-4c1d2f5b9a8e?w=500",
        caption: "Meditation and mindfulness 🧘‍♀️✨ #selfcare",
        likes: ["user3", "user8", "user13", "user17"],
        comments: [
            {
                _id: "c20",
                text: "Need this energy!",
                author: {
                    _id: "user17",
                    username: "bakerlady",
                    profilePicture: "https://randomuser.me/api/portraits/women/13.jpg"
                }
            },
            {
                _id: "c21",
                text: "Peaceful vibes 🙏",
                author: {
                    _id: "user8",
                    username: "travelbug",
                    profilePicture: "https://randomuser.me/api/portraits/women/4.jpg"
                }
            }
        ],
        author: {
            _id: "user20",
            username: "zenmaster",
            profilePicture: "https://randomuser.me/api/portraits/men/13.jpg"
        },
        createdAt: "2023-12-28T07:30:00Z"
    }
];

export default fakePosts;