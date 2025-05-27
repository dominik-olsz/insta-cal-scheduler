
import { useState, useEffect } from 'react';
import CalendarHeader from './calendar/CalendarHeader';
import CalendarGrid from './calendar/CalendarGrid';
import PostsList from './calendar/PostsList';
import MonthlyOverview from './calendar/MonthlyOverview';
import { usePosts } from '@/hooks/usePosts';

// Use the database Post type from usePosts hook
interface CalendarPost {
  id: string;
  time: string;
  caption: string;
  status: string;
  image: string;
}

const CalendarView = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { posts, loading, createPost, deletePost } = usePosts();

  // Convert database posts to the format expected by the calendar components
  const [scheduledPosts, setScheduledPosts] = useState<Record<string, CalendarPost[]>>({});

  useEffect(() => {
    if (posts.length > 0) {
      const postsMap: Record<string, CalendarPost[]> = {};
      
      posts.forEach(post => {
        const date = new Date(post.scheduled_for);
        const dateString = date.toISOString().split('T')[0];
        const time = date.toTimeString().slice(0, 5);
        
        if (!postsMap[dateString]) {
          postsMap[dateString] = [];
        }
        
        postsMap[dateString].push({
          id: post.id,
          time: time,
          caption: post.caption,
          status: post.status,
          image: post.image_url || '/placeholder.svg'
        });
      });
      
      setScheduledPosts(postsMap);
    }
  }, [posts]);

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

  const handleAddPost = async (post: Omit<CalendarPost, 'id'>, date: Date) => {
    try {
      // Combine date and time for scheduling
      const [hours, minutes] = post.time.split(':');
      const scheduledDate = new Date(date);
      scheduledDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      await createPost({
        caption: post.caption,
        scheduledFor: scheduledDate.toISOString(),
      });
      
      console.log('Post created successfully');
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleEditPost = async (postId: string, updatedPost: Partial<CalendarPost>, date: Date) => {
    // This would integrate with the real post editing
    console.log('Edit post:', postId, updatedPost, 'for date:', date);
    // TODO: Implement edit functionality when available in usePosts
  };

  const handleDeletePost = async (postId: string, date: Date) => {
    try {
      await deletePost(postId);
      console.log('Post deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading calendar...</p>
      </div>
    );
  }

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

      <MonthlyOverview scheduledPosts={scheduledPosts} currentMonth={currentMonth} />
    </div>
  );
};

export default CalendarView;
