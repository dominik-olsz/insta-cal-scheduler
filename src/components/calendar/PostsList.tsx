
import { useState } from 'react';
import { Instagram, Clock, Edit, Trash2, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface Post {
  id: number;
  time: string;
  caption: string;
  status: string;
  image: string;
}

interface PostsListProps {
  selectedDate: Date | undefined;
  posts: Post[];
  onAddPost: (post: Omit<Post, 'id'>, date: Date) => void;
  onEditPost: (postId: number, updatedPost: Partial<Post>, date: Date) => void;
  onDeletePost: (postId: number, date: Date) => void;
}

const PostsList = ({ selectedDate, posts, onAddPost, onEditPost, onDeletePost }: PostsListProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [formData, setFormData] = useState({
    time: '',
    caption: '',
    status: 'scheduled'
  });
  const { toast } = useToast();

  const resetForm = () => {
    setFormData({
      time: '',
      caption: '',
      status: 'scheduled'
    });
  };

  const handleAddPost = () => {
    if (!selectedDate || !formData.time || !formData.caption) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    onAddPost({
      time: formData.time,
      caption: formData.caption,
      status: formData.status,
      image: '/placeholder.svg'
    }, selectedDate);

    toast({
      title: "Post Added",
      description: "Your post has been added successfully",
    });

    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEditPost = () => {
    if (!selectedDate || !editingPost || !formData.time || !formData.caption) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    onEditPost(editingPost.id, {
      time: formData.time,
      caption: formData.caption,
      status: formData.status
    }, selectedDate);

    toast({
      title: "Post Updated",
      description: "Your post has been updated successfully",
    });

    resetForm();
    setIsEditDialogOpen(false);
    setEditingPost(null);
  };

  const handleDeletePost = (postId: number) => {
    if (!selectedDate) return;
    
    onDeletePost(postId, selectedDate);
    
    toast({
      title: "Post Deleted",
      description: "Your post has been deleted successfully",
    });
  };

  const openEditDialog = (post: Post) => {
    setEditingPost(post);
    setFormData({
      time: post.time,
      caption: post.caption,
      status: post.status
    });
    setIsEditDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Instagram className="h-5 w-5 text-purple-600" />
            <span>
              {selectedDate 
                ? selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                : 'Select a date'
              }
            </span>
            {posts.length > 0 && (
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                {posts.length} post{posts.length !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          {selectedDate && (
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Post
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Post</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="caption">Caption</Label>
                    <Textarea
                      id="caption"
                      placeholder="Write your Instagram caption..."
                      value={formData.caption}
                      onChange={(e) => setFormData(prev => ({ ...prev, caption: e.target.value }))}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleAddPost} className="flex-1">Add Post</Button>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="flex-1">Cancel</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex-shrink-0"></div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-3 w-3 text-gray-500" />
                        <Badge variant="secondary" className="bg-purple-100 text-purple-800 text-xs">
                          {post.time}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0"
                          onClick={() => openEditDialog(post)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                          onClick={() => handleDeletePost(post.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-700 line-clamp-3 mb-2">{post.caption}</p>
                    
                    <div className="flex items-center justify-between">
                      <Badge 
                        variant="outline" 
                        className="text-xs bg-green-50 text-green-700 border-green-200"
                      >
                        ● {post.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Instagram className="h-8 w-8 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No posts scheduled</p>
              {selectedDate && (
                <Button 
                  size="sm" 
                  className="mt-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  onClick={() => setIsAddDialogOpen(true)}
                >
                  Add Post
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-time">Time</Label>
              <Input
                id="edit-time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="edit-caption">Caption</Label>
              <Textarea
                id="edit-caption"
                placeholder="Write your Instagram caption..."
                value={formData.caption}
                onChange={(e) => setFormData(prev => ({ ...prev, caption: e.target.value }))}
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleEditPost} className="flex-1">Update Post</Button>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="flex-1">Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default PostsList;
