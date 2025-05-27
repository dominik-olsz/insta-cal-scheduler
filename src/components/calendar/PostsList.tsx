import { useState } from 'react';
import { Instagram, Clock, Edit, Trash2, Plus, Image, Type, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface Post {
  id: string;
  time: string;
  caption: string;
  status: string;
  image: string;
}

interface PostsListProps {
  selectedDate: Date | undefined;
  posts: Post[];
  onAddPost: (post: Omit<Post, 'id'>, date: Date) => void;
  onEditPost: (postId: string, updatedPost: Partial<Post>, date: Date) => void;
  onDeletePost: (postId: string, date: Date) => void;
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
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const { toast } = useToast();

  const suggestedTimes = [
    { time: '09:00', label: 'Morning', emoji: '🌅' },
    { time: '12:00', label: 'Lunch', emoji: '🌞' },
    { time: '18:00', label: 'Evening', emoji: '🌆' },
    { time: '21:00', label: 'Night', emoji: '🌙' }
  ];

  const resetForm = () => {
    setFormData({
      time: '',
      caption: '',
      status: 'scheduled'
    });
    setImage(null);
    setImagePreview('');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
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
      image: imagePreview || '/placeholder.svg'
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

  const handleDeletePost = (postId: string) => {
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
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-2">
                    <Type className="h-5 w-5 text-purple-600" />
                    <span>Add New Post</span>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      Draft
                    </Badge>
                  </DialogTitle>
                </DialogHeader>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Post Creation Form */}
                  <div className="space-y-6">
                    {/* Image Upload */}
                    <div>
                      <Label htmlFor="image">Image</Label>
                      <div className="mt-2">
                        <input
                          id="image"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                        <label
                          htmlFor="image"
                          className="cursor-pointer block w-full h-48 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 transition-colors"
                        >
                          {imagePreview ? (
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                              <Image className="h-8 w-8 mb-2" />
                              <span className="text-sm">Click to upload image</span>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>

                    {/* Caption */}
                    <div>
                      <Label htmlFor="caption">Caption</Label>
                      <Textarea
                        id="caption"
                        placeholder="Write your Instagram caption here... Use #hashtags and @mentions"
                        value={formData.caption}
                        onChange={(e) => setFormData(prev => ({ ...prev, caption: e.target.value }))}
                        className="mt-2 min-h-[120px]"
                      />
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-gray-500">
                          {formData.caption.length}/2200 characters
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {formData.caption.split(' ').filter(word => word.startsWith('#')).length} hashtags
                        </Badge>
                      </div>
                    </div>

                    {/* Time */}
                    <div>
                      <Label htmlFor="time">Time</Label>
                      <Input
                        id="time"
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                        className="mt-2"
                      />
                    </div>

                    {/* Suggested Times */}
                    <div>
                      <Label>Suggested Times</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {suggestedTimes.map((timeSlot) => (
                          <Button
                            key={timeSlot.time}
                            variant="outline"
                            size="sm"
                            onClick={() => setFormData(prev => ({ ...prev, time: timeSlot.time }))}
                            className="justify-start"
                          >
                            <span className="mr-2">{timeSlot.emoji}</span>
                            {timeSlot.time} - {timeSlot.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="space-y-4">
                    <div>
                      <Label className="flex items-center space-x-2">
                        <Image className="h-4 w-4 text-purple-600" />
                        <span>Preview</span>
                      </Label>
                    </div>
                    <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
                      {/* Instagram Post Header */}
                      <div className="flex items-center space-x-3 p-4 border-b">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
                        <div>
                          <p className="font-semibold text-sm">your_username</p>
                          <p className="text-xs text-gray-500">
                            {selectedDate && formData.time
                              ? `Scheduled for ${selectedDate.toLocaleDateString()}`
                              : 'Not scheduled yet'
                            }
                          </p>
                        </div>
                      </div>

                      {/* Image Preview */}
                      <div className="aspect-square bg-gray-100 flex items-center justify-center">
                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="Post preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-center text-gray-400">
                            <Image className="h-12 w-12 mx-auto mb-2" />
                            <p className="text-sm">Image preview</p>
                          </div>
                        )}
                      </div>

                      {/* Caption Preview */}
                      <div className="p-4">
                        <p className="text-sm">
                          <span className="font-semibold">your_username</span>{' '}
                          {formData.caption || 'Your caption will appear here...'}
                        </p>
                      </div>
                    </div>

                    {/* Scheduling Info */}
                    {selectedDate && formData.time && (
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-purple-600" />
                          <span className="text-sm font-medium text-purple-800">
                            Scheduled for {new Date(`${selectedDate.toISOString().split('T')[0]}T${formData.time}`).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 mt-6">
                  <Button onClick={handleAddPost} className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Post
                  </Button>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="flex-1">
                    Cancel
                  </Button>
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
    </Card>
  );
};

export default PostsList;
