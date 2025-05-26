
import { useState } from 'react';
import { Calendar, Clock, Image, Type } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const PostScheduler = () => {
  const [caption, setCaption] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const { toast } = useToast();

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

  const handleSchedulePost = () => {
    if (!caption || !scheduledDate || !scheduledTime) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Post Scheduled!",
      description: `Your post has been scheduled for ${scheduledDate} at ${scheduledTime}`,
    });

    // Reset form
    setCaption('');
    setScheduledDate('');
    setScheduledTime('');
    setImage(null);
    setImagePreview('');
  };

  const suggestedTimes = [
    { time: '09:00', label: 'Morning', emoji: '🌅' },
    { time: '12:00', label: 'Lunch', emoji: '🌞' },
    { time: '18:00', label: 'Evening', emoji: '🌆' },
    { time: '21:00', label: 'Night', emoji: '🌙' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Create New Post</h2>
        <Badge variant="secondary" className="bg-purple-100 text-purple-800">
          Draft
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Post Creation Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Type className="h-5 w-5 text-purple-600" />
              <span>Post Content</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
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
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="mt-2 min-h-[120px]"
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-500">
                  {caption.length}/2200 characters
                </span>
                <Badge variant="outline" className="text-xs">
                  {caption.split(' ').filter(word => word.startsWith('#')).length} hashtags
                </Badge>
              </div>
            </div>

            {/* Scheduling */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="mt-2"
                />
              </div>
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
                    onClick={() => setScheduledTime(timeSlot.time)}
                    className="justify-start"
                  >
                    <span className="mr-2">{timeSlot.emoji}</span>
                    {timeSlot.time} - {timeSlot.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <Button
                onClick={handleSchedulePost}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Post
              </Button>
              <Button variant="outline" className="flex-1">
                Save Draft
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Image className="h-5 w-5 text-purple-600" />
              <span>Preview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
              {/* Instagram Post Header */}
              <div className="flex items-center space-x-3 p-4 border-b">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
                <div>
                  <p className="font-semibold text-sm">your_username</p>
                  <p className="text-xs text-gray-500">
                    {scheduledDate && scheduledTime
                      ? `Scheduled for ${new Date(`${scheduledDate}T${scheduledTime}`).toLocaleDateString()}`
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
                  {caption || 'Your caption will appear here...'}
                </p>
              </div>
            </div>

            {/* Scheduling Info */}
            {scheduledDate && scheduledTime && (
              <div className="mt-4 p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-800">
                    Scheduled for {new Date(`${scheduledDate}T${scheduledTime}`).toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PostScheduler;
