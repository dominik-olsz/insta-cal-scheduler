
import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Instagram, Clock, Edit, Trash2 } from 'lucide-react';

const CalendarView = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Mock scheduled posts data - enhanced with more details
  const scheduledPosts = {
    '2024-05-27': [
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
    '2024-05-28': [
      { 
        id: 3, 
        time: '09:00', 
        caption: 'Coffee and productivity ☕️ #coffee #morning #productivity', 
        status: 'scheduled',
        image: '/placeholder.svg'
      }
    ],
    '2024-05-30': [
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
    '2024-05-31': [
      { 
        id: 6, 
        time: '12:00', 
        caption: 'Lunch break special 🥗 #healthy #lunch #nutrition', 
        status: 'scheduled',
        image: '/placeholder.svg'
      }
    ],
    '2024-06-01': [
      { 
        id: 7, 
        time: '16:00', 
        caption: 'New month, new goals! 🎯 #goals #motivation #june', 
        status: 'scheduled',
        image: '/placeholder.svg'
      }
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
                  position: 'relative'
                }
              }}
              components={{
                Day: ({ date, displayMonth, ...dayProps }) => {
                  const postsCount = getPostsForDate(date).length;
                  const hasPost = postsCount > 0;
                  
                  return (
                    <div className="relative">
                      <button {...dayProps}>
                        {date.getDate()}
                        {hasPost && (
                          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                            <div className="flex space-x-0.5">
                              {Array.from({ length: Math.min(postsCount, 3) }).map((_, i) => (
                                <div
                                  key={i}
                                  className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                                />
                              ))}
                              {postsCount > 3 && (
                                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                              )}
                            </div>
                          </div>
                        )}
                      </button>
                    </div>
                  );
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
              {selectedDatePosts.length > 0 && (
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  {selectedDatePosts.length} post{selectedDatePosts.length !== 1 ? 's' : ''}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {selectedDatePosts.length > 0 ? (
                selectedDatePosts.map((post) => (
                  <div key={post.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-start space-x-3">
                      {/* Post image preview */}
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
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-500 hover:text-red-700">
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
              <p className="text-2xl font-bold text-purple-600">
                {Object.values(scheduledPosts).flat().length}
              </p>
              <p className="text-sm text-purple-700">Total Posts</p>
            </div>
            <div className="text-center p-4 bg-pink-50 rounded-lg">
              <p className="text-2xl font-bold text-pink-600">
                {Object.keys(scheduledPosts).length}
              </p>
              <p className="text-sm text-pink-700">Active Days</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">
                {Math.max(...Object.values(scheduledPosts).map(posts => posts.length))}
              </p>
              <p className="text-sm text-orange-700">Max per Day</p>
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
