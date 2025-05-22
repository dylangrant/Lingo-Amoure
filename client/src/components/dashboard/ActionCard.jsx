import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ThumbsDown, ThumbsUp } from 'lucide-react';
import { cn, getLoveLanguageColor, getLoveLanguageIcon, getTierInfo } from '@/lib/utils';

export default function ActionCard({ action, onSchedule, onRate }) {
  const [isScheduling, setIsScheduling] = useState(false);
  const [hasRated, setHasRated] = useState(false);
  
  const { effortText, duration } = getTierInfo(action.tier);
  const iconClass = getLoveLanguageColor(action.loveLanguage);
  const iconName = getLoveLanguageIcon(action.loveLanguage);
  
  const handleSchedule = () => {
    setIsScheduling(true);
    onSchedule(action.id)
      .finally(() => setIsScheduling(false));
  };
  
  const handleLike = () => {
    if (!hasRated) {
      setHasRated(true);
      onRate(action.id, 'liked');
    }
  };
  
  const handleDislike = () => {
    if (!hasRated) {
      setHasRated(true);
      onRate(action.id, 'disliked');
    }
  };
  
  return (
    <Card className="rounded-xl shadow-sm overflow-hidden mb-4">
      <CardContent className="p-0">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-start">
            <div className={cn("rounded-lg p-2 mr-3", iconClass)}>
              <span className="material-icons text-white">{iconName}</span>
            </div>
            <div className="flex-grow">
              <h3 className="font-medium text-neutral-dark">{action.description}</h3>
              <div className="mt-1 flex items-center">
                <span className={cn("inline-block px-2 py-1 rounded text-xs text-white mr-2", iconClass)}>
                  {action.loveLanguage}
                </span>
                <span className="text-xs text-neutral-medium">{effortText} • {duration}</span>
              </div>
              {action.productLink && (
                <a 
                  href={action.productLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-primary mt-1 inline-block hover:underline"
                >
                  View product
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="px-4 py-3 bg-gray-50 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="text-neutral-medium hover:text-primary"
            onClick={handleSchedule}
            disabled={isScheduling}
          >
            <Calendar className="h-4 w-4 mr-1" />
            <span>Schedule</span>
          </Button>
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="icon"
              className="rounded-full hover:bg-gray-200 text-neutral-medium"
              onClick={handleDislike}
              disabled={hasRated}
            >
              <ThumbsDown className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="rounded-full hover:bg-gray-200 text-neutral-medium"
              onClick={handleLike}
              disabled={hasRated}
            >
              <ThumbsUp className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
