
import { Instagram, Clock, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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
}

const PostsList = ({ selectedDate, posts }: PostsListProps) => {
  return (
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
          {posts.length > 0 && (
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              {posts.length} post{posts.length !== 1 ? 's' : ''}
            </Badge>
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
  );
};

export default PostsList;
