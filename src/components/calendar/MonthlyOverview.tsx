
import { Calendar, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Post {
  id: string;
  time: string;
  caption: string;
  status: string;
  image: string;
}

interface MonthlyOverviewProps {
  scheduledPosts: Record<string, Post[]>;
  currentMonth: Date;
}

const MonthlyOverview = ({ scheduledPosts, currentMonth }: MonthlyOverviewProps) => {
  // Calculate stats for the current month
  const currentMonthPosts = Object.entries(scheduledPosts)
    .filter(([dateString]) => {
      const date = new Date(dateString);
      return date.getMonth() === currentMonth.getMonth() && 
             date.getFullYear() === currentMonth.getFullYear();
    })
    .flatMap(([_, posts]) => posts);

  const totalPosts = currentMonthPosts.length;
  const scheduledPosts_count = currentMonthPosts.filter(post => post.status === 'scheduled').length;
  const publishedPosts = currentMonthPosts.filter(post => post.status === 'published').length;
  const failedPosts = currentMonthPosts.filter(post => post.status === 'failed').length;

  // Get upcoming posts (next 7 days)
  const today = new Date();
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  const upcomingPosts = Object.entries(scheduledPosts)
    .filter(([dateString]) => {
      const date = new Date(dateString);
      return date >= today && date <= nextWeek;
    })
    .flatMap(([dateString, posts]) => 
      posts.map(post => ({ ...post, date: dateString }))
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            <span>{monthName} Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{totalPosts}</div>
              <div className="text-sm text-gray-600">Total Posts</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{scheduledPosts_count}</div>
              <div className="text-sm text-gray-600">Scheduled</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{publishedPosts}</div>
              <div className="text-sm text-gray-600">Published</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{failedPosts}</div>
              <div className="text-sm text-gray-600">Failed</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {upcomingPosts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-purple-600" />
              <span>Upcoming Posts</span>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                Next 7 days
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingPosts.map((post) => (
                <div key={post.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <Calendar className="h-3 w-3 text-gray-500" />
                      <span className="text-sm font-medium">
                        {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <Clock className="h-3 w-3 text-gray-500" />
                      <span className="text-sm text-gray-600">{post.time}</span>
                    </div>
                    <p className="text-sm text-gray-700 truncate">{post.caption}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        post.status === 'scheduled' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        post.status === 'published' ? 'bg-green-50 text-green-700 border-green-200' :
                        'bg-red-50 text-red-700 border-red-200'
                      }`}
                    >
                      {post.status === 'published' && <CheckCircle className="h-3 w-3 mr-1" />}
                      {post.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MonthlyOverview;
