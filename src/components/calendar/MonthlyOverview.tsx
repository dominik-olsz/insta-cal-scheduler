
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
}

const MonthlyOverview = ({ scheduledPosts }: MonthlyOverviewProps) => {
  const totalPosts = Object.values(scheduledPosts).flat().length;
  const activeDays = Object.keys(scheduledPosts).filter(date => scheduledPosts[date].length > 0).length;
  const maxPerDay = Math.max(...Object.values(scheduledPosts).map(posts => posts.length), 0);
  
  // Calculate success rate based on scheduled vs published posts
  const scheduledCount = Object.values(scheduledPosts).flat().filter(post => post.status === 'scheduled').length;
  const publishedCount = Object.values(scheduledPosts).flat().filter(post => post.status === 'published').length;
  const successRate = totalPosts > 0 ? Math.round(((scheduledCount + publishedCount) / totalPosts) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Overview</CardTitle>
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
