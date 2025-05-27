
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Post {
  id: number;
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
  // Filter posts to only include those from the current month
  const currentMonthKey = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}`;
  console.log('Current month key for filtering:', currentMonthKey);
  
  const currentMonthPosts = Object.entries(scheduledPosts).filter(([dateKey]) => 
    dateKey.startsWith(currentMonthKey)
  );
  
  console.log('Filtered posts for current month:', currentMonthPosts);
  
  const totalPosts = currentMonthPosts.reduce((total, [_, posts]) => total + posts.length, 0);
  const activeDays = currentMonthPosts.filter(([_, posts]) => posts.length > 0).length;
  const maxPerDay = currentMonthPosts.length > 0 
    ? Math.max(...currentMonthPosts.map(([_, posts]) => posts.length)) 
    : 0;
  
  // Calculate success rate based on scheduled vs published posts for current month only
  const allCurrentMonthPosts = currentMonthPosts.flatMap(([_, posts]) => posts);
  const scheduledCount = allCurrentMonthPosts.filter(post => post.status === 'scheduled').length;
  const publishedCount = allCurrentMonthPosts.filter(post => post.status === 'published').length;
  const successRate = totalPosts > 0 ? Math.round(((scheduledCount + publishedCount) / totalPosts) * 100) : 0;

  console.log('Monthly overview stats:', { totalPosts, activeDays, maxPerDay, successRate });

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Monthly Overview - {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">{totalPosts}</p>
            <p className="text-sm text-purple-700">Total Posts</p>
          </div>
          <div className="text-center p-4 bg-pink-50 rounded-lg">
            <p className="text-2xl font-bold text-pink-600">{activeDays}</p>
            <p className="text-sm text-pink-700">Active Days</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <p className="text-2xl font-bold text-orange-600">{maxPerDay}</p>
            <p className="text-sm text-orange-700">Max per Day</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{successRate}%</p>
            <p className="text-sm text-green-700">Success Rate</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyOverview;
