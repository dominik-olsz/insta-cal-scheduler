
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';

interface CalendarGridProps {
  selectedDate: Date | undefined;
  currentMonth: Date;
  onDateSelect: (date: Date | undefined) => void;
  onMonthChange: (month: Date) => void;
  getPostsForDate: (date: Date) => any[];
  hasPostsOnDate: (date: Date) => boolean;
}

const CalendarGrid = ({ 
  selectedDate, 
  currentMonth, 
  onDateSelect, 
  onMonthChange, 
  getPostsForDate, 
  hasPostsOnDate 
}: CalendarGridProps) => {
  return (
    <Card className="lg:col-span-2">
      <CardContent className="p-6">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateSelect}
          month={currentMonth}
          onMonthChange={onMonthChange}
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
                  <button 
                    {...dayProps}
                    onClick={(e) => {
                      console.log('Day clicked:', date.toISOString().split('T')[0]);
                      onDateSelect(date);
                      if (dayProps.onClick) {
                        dayProps.onClick(e);
                      }
                    }}
                    className={dayProps.className}
                  >
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
  );
};

export default CalendarGrid;
