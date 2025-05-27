import { useState } from 'react';
import { Calendar, Plus, Instagram, Settings, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PostScheduler from '@/components/PostScheduler';
import CalendarView from '@/components/CalendarView';
import AccountSettings from '@/components/AccountSettings';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isConnected, setIsConnected] = useState(false);

  // All scheduled posts data - same as in CalendarView
  const scheduledPosts = {
    '2025-05-28': [
      { 
        id: 1, 
        time: '09:00', 
        caption: 'Coffee and productivity ☕️ #coffee #morning #productivity', 
        status: 'scheduled',
        image: '/placeholder.svg'
      }
    ],
    '2025-05-29': [
      { 
        id: 2, 
        time: '18:00', 
        caption: 'Beautiful sunset at the beach 🌅 #sunset #beach #nature', 
        status: 'scheduled',
        image: '/placeholder.svg'
      },
      { 
        id: 3, 
        time: '20:30', 
        caption: 'Dinner with friends 🍽️ #foodie #friends #dinner', 
        status: 'scheduled',
        image: '/placeholder.svg'
      }
    ],
    '2025-05-31': [
      { 
        id: 4, 
        time: '12:00', 
        caption: 'End of May celebration 🎉 #may #celebration #month', 
        status: 'scheduled',
        image: '/placeholder.svg'
      }
    ]
  };

  // Get all upcoming posts sorted by date and time
  const getAllUpcomingPosts = () => {
    const allPosts = [];
    
    for (const [date, posts] of Object.entries(scheduledPosts)) {
      posts.forEach(post => {
        allPosts.push({
          ...post,
          scheduledFor: `${date} ${post.time}`,
          date: date
        });
      });
    }
    
    // Sort by date and time
    return allPosts.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateA.getTime() - dateB.getTime();
    });
  };

  const upcomingPosts = getAllUpcomingPosts();

  const renderContent = () => {
    switch (activeTab) {
      case 'calendar':
        return <CalendarView />;
      case 'create':
        return <PostScheduler />;
      case 'settings':
        return <AccountSettings isConnected={isConnected} setIsConnected={setIsConnected} />;
      default:
        return (
          <div className="space-y-6">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100">Total Posts</p>
                      <p className="text-2xl font-bold">{upcomingPosts.length}</p>
                    </div>
                    <Instagram className="h-8 w-8 text-purple-100" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-pink-500 to-orange-500 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-pink-100">Scheduled</p>
                      <p className="text-2xl font-bold">{upcomingPosts.length}</p>
                    </div>
                    <Calendar className="h-8 w-8 text-pink-100" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100">This Week</p>
                      <p className="text-2xl font-bold">{upcomingPosts.length}</p>
                    </div>
                    <Plus className="h-8 w-8 text-orange-100" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Connection Status */}
            {!isConnected && (
              <Card className="border-orange-200 bg-orange-50">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <Instagram className="h-8 w-8 text-orange-600" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-orange-800">Connect Your Instagram Account</h3>
                      <p className="text-orange-600">Connect your Instagram account to start scheduling posts</p>
                    </div>
                    <Button 
                      onClick={() => setActiveTab('settings')}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      Connect Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Upcoming Posts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>All Upcoming Posts</span>
                  {upcomingPosts.length > 0 && (
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      {upcomingPosts.length} post{upcomingPosts.length !== 1 ? 's' : ''}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {upcomingPosts.map((post) => (
                    <div key={post.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{post.caption}</p>
                        <p className="text-sm text-gray-500">
                          Scheduled for {new Date(`${post.date}T${post.time}`).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })} at {post.time}
                        </p>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {post.status}
                      </Badge>
                    </div>
                  ))}
                  
                  {upcomingPosts.length === 0 && (
                    <div className="text-center py-12">
                      <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No posts scheduled yet</p>
                      <Button 
                        onClick={() => setActiveTab('create')}
                        className="mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      >
                        Schedule Your First Post
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <Instagram className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                InstaScheduler
              </h1>
            </div>
            
            <nav className="flex space-x-1">
              <Button
                variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('dashboard')}
                className={activeTab === 'dashboard' ? 'bg-gradient-to-r from-purple-600 to-pink-600' : ''}
              >
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <Button
                variant={activeTab === 'calendar' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('calendar')}
                className={activeTab === 'calendar' ? 'bg-gradient-to-r from-purple-600 to-pink-600' : ''}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Calendar
              </Button>
              <Button
                variant={activeTab === 'create' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('create')}
                className={activeTab === 'create' ? 'bg-gradient-to-r from-purple-600 to-pink-600' : ''}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Post
              </Button>
              <Button
                variant={activeTab === 'settings' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('settings')}
                className={activeTab === 'settings' ? 'bg-gradient-to-r from-purple-600 to-pink-600' : ''}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;
