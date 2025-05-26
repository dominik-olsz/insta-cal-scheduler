
import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Instagram } from 'lucide-react';

const CalendarView = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Mock scheduled posts data
  const scheduledPosts = {
    '2024-05-27': [
      { id: 1, time: '18:00', caption: 'Beautiful sunset at the beach 🌅' },
      { id: 2, time: '20:30', caption: 'Dinner with friends 🍽️' }
    ],
    '2024-05-28': [
      { id: 3, time: '09:00', caption: 'Coffee and productivity ☕️' }
    ],
    '2024-05-30': [
      { id: 4, time: '15:00', caption: 'Weekend vibes 🌟' },
      { id: 5, time: '19:00', caption: 'Movie night 🎬' }
    ]
  };

  const getPostsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return scheduledPosts[dateString as keyof typeof scheduledPosts] || [];
  };

  const hasPostsOnDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return scheduledPosts[dateString as keyof typeof scheduledPosts]?.length > 0;
  };

  const selectedDatePosts = selectedDate ? getPostsForDate(selectedDate) : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Content Calendar</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium px-4">
            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              className="rounded-md border-0"
              modifiers={{
                hasPost: (date) => hasPostsOnDate(date)
              }}
              modifiersStyles={{
                hasPost: {
                  background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
                  color: 'white',
                  borderRadius: '50%'
                }
              }}
            />
          </CardContent>
        </Card>

        {/* Selected Date Posts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Instagram className="h-5 w-5 text-purple-600" />
              <span>
                {selectedDate 
                  ? selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  : 'Select a date'
                }
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedDatePosts.length > 0 ? (
                selectedDatePosts.map((post) => (
                  <div key={post.id} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                        {post.time}
                      </Badge>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2">{post.caption}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Instagram className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No posts scheduled</p>
                  <Button 
                    size="sm" 
                    className="mt-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    Add Post
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">12</p>
              <p className="text-sm text-purple-700">Total Posts</p>
            </div>
            <div className="text-center p-4 bg-pink-50 rounded-lg">
              <p className="text-2xl font-bold text-pink-600">8</p>
              <p className="text-sm text-pink-700">This Week</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">15</p>
              <p className="text-sm text-orange-700">Next Week</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">92%</p>
              <p className="text-sm text-green-700">Success Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarView;
