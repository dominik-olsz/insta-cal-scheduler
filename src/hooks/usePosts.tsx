
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Post {
  id: string;
  caption: string;
  image_url?: string;
  scheduled_for: string;
  status: string;
  created_at: string;
  instagram_account_id?: string;
}

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchPosts = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', user.id)
        .order('scheduled_for', { ascending: true });

      if (error) {
        console.error('Error fetching posts:', error);
      } else {
        setPosts(data || []);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [user]);

  const createPost = async (postData: {
    caption: string;
    scheduledFor: string;
    instagramAccountId?: string;
  }) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase.functions.invoke('schedule-post', {
      body: {
        caption: postData.caption,
        scheduledFor: postData.scheduledFor,
        instagramAccountId: postData.instagramAccountId,
      },
    });

    if (error) throw error;
    
    // Refresh posts after creating
    await fetchPosts();
    return data;
  };

  const deletePost = async (postId: string) => {
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId)
      .eq('user_id', user.id);

    if (error) throw error;
    
    // Refresh posts after deleting
    await fetchPosts();
  };

  return {
    posts,
    loading,
    createPost,
    deletePost,
    refreshPosts: fetchPosts,
  };
};
