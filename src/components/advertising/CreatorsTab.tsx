import { memo, useMemo } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Creator } from '../types';
import { CreatorCard } from './CreatorCard';

interface CreatorsTabProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: string[];
  filteredCreators: Creator[];
  calculateCPM: (adPrice: number, avgViews: number) => string;
  onOrderClick: (creator: Creator) => void;
}

export const CreatorsTab = memo(({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories,
  filteredCreators,
  calculateCPM,
  onOrderClick
}: CreatorsTabProps) => {
  return (
    <div className="space-y-4">
      <Card className="bg-card/50 backdrop-blur-lg border-primary/30 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search creators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-background/50"
              icon={<Icon name="Search" size={18} />}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCreators.map(creator => (
          <CreatorCard
            key={creator.id}
            creator={creator}
            calculateCPM={calculateCPM}
            onOrderClick={onOrderClick}
          />
        ))}
        {filteredCreators.length === 0 && (
          <Card className="col-span-full bg-card/50 backdrop-blur-lg border-primary/30 p-8">
            <div className="text-center">
              <Icon name="Search" size={48} className="mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No creators found matching your criteria</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
});

CreatorsTab.displayName = 'CreatorsTab';
