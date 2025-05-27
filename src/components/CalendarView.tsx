
import { useState } from 'react';
import CalendarHeader from './calendar/CalendarHeader';
import CalendarGrid from './calendar/CalendarGrid';
import PostsList from './calendar/PostsList';
import MonthlyOverview from './calendar/MonthlyOverview';

interface Post {
  id: number;
  time: string;
  caption: string;
  status: string;
  image: string;
}

const CalendarView = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Mock scheduled posts data - updated to 2025 dates
  const [scheduledPosts, setScheduledPosts] = useState<Record<string, Post[]>>({
    '2025-05-27': [
      { 
        id: 1, 
        time: '18:00', 
        caption: 'Beautiful sunset at the beach 🌅 #sunset #beach #nature', 
        status: 'scheduled',
        image: '/placeholder.svg'
      },
      { 
        id: 2, 
        time: '20:30', 
        caption: 'Dinner with friends 🍽️ #foodie #friends #dinner', 
        status: 'scheduled',
        image: '/placeholder.svg'
      }
    ],
    '2025-05-28': [
      { 
        id: 3, 
        time: '09:00', 
        caption: 'Coffee and productivity ☕️ #coffee #morning #productivity', 
        status: 'scheduled',
        image: '/placeholder.svg'
      }
    ],
    '2025-05-30': [
      { 
        id: 4, 
        time: '15:00', 
        caption: 'Weekend vibes 🌟 #weekend #relax #goodvibes', 
        status: 'scheduled',
        image: '/placeholder.svg'
      },
      { 
        id: 5, 
        time: '19:00', 
        caption: 'Movie night 🎬 #movies #entertainment #friday', 
        status: 'scheduled',
        image: '/placeholder.svg'
      }
    ],
    '2025-05-31': [
      { 
        id: 6, 
        time: '12:00', 
        caption: 'Lunch break special 🥗 #healthy #lunch #nutrition', 
        status: 'scheduled',
        image: '/placeholder.svg'
      }
    ],
    '2025-06-01': [
      { 
        id: 7, 
        time: '16:00', 
        caption: 'New month, new goals! 🎯 #goals #motivation #june', 
        status: 'scheduled',
        image: '/placeholder.svg'
      }
    ],
    '2025-06-05': [
      { 
        id: 8, 
        time: '14:00', 
        caption: 'Thursday vibes 💪 #thursday #motivation #work', 
        status: 'scheduled',
        image: '/placeholder.svg'
      }
    ]
  });

  const getPostsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    console.log('Getting posts for date:', dateString);
    const posts = scheduledPosts[dateString] || [];
    console.log('Found posts:', posts);
    return posts;
  };

  const hasPostsOnDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    const hasPosts = scheduledPosts[dateString]?.length > 0;
    console.log('Date:', dateString, 'has posts:', hasPosts);
    return hasPosts;
  };

  const selectedDatePosts = selectedDate ? getPostsForDate(selectedDate) : [];
  console.log('Selected date:', selectedDate?.toISOString().split('T')[0]);
  console.log('Selected date posts:', selectedDatePosts);

  const handleDateSelect = (date: Date | undefined) => {
    console.log('Date selected:', date?.toISOString().split('T')[0]);
    setSelectedDate(date);
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleAddPost = (post: Omit<Post, 'id'>, date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    const newPost = {
      ...post,
      id: Date.now() // Simple ID generation
    };
    
    setScheduledPosts(prev => ({
      ...prev,
      [dateString]: [...(prev[dateString] || []), newPost]
    }));
  };

  const handleEditPost = (postId: number, updatedPost: Partial<Post>, date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    
    setScheduledPosts(prev => ({
      ...prev,
      [dateString]: prev[dateString]?.map(post => 
        post.id === postId ? { ...post, ...updatedPost } : post
      ) || []
    }));
  };

  const handleDeletePost = (postId: number, date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    
    setScheduledPosts(prev => ({
      ...prev,
      [dateString]: prev[dateString]?.filter(post => post.id !== postId) || []
    }));
  };

  return (
    <div className="space-y-6">
      <CalendarHeader 
        currentMonth={currentMonth}
        onPreviousMonth={handlePreviousMonth}
        onNextMonth={handleNextMonth}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <CalendarGrid
          selectedDate={selectedDate}
          currentMonth={currentMonth}
          onDateSelect={handleDateSelect}
          onMonthChange={setCurrentMonth}
          getPostsForDate={getPostsForDate}
          hasPostsOnDate={hasPostsOnDate}
        />

        <PostsList
          selectedDate={selectedDate}
          posts={selectedDatePosts}
          onAddPost={handleAddPost}
          onEditPost={handleEditPost}
          onDeletePost={handleDeletePost}
        />
      </div>

      <MonthlyOverview scheduledPosts={scheduledPosts} />
    </div>
  );
};

export default CalendarView;
