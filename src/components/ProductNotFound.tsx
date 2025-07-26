import React from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface ProductNotFoundProps {
  query?: string;
  suggestions?: string[];
  onSearch?: (query: string) => void;
  onRetry?: () => void;
  className?: string;
}

export const ProductNotFound: React.FC<ProductNotFoundProps> = ({
  query,
  suggestions = [],
  onSearch,
  onRetry,
  className = "",
}) => {
  const handleSuggestionClick = (suggestion: string) => {
    if (onSearch) {
      onSearch(suggestion);
    }
  };

  return (
    <div className={`mt-10 w-full ${className} font-light`}>
      <div className="bg-card border border-walmart-true-blue/50 rounded-lg shadow-sm p-6 space-y-6">
        {/* Main Message */}
        <div className="text-center space-y-3">
          <div className="w-12 h-12 bg-muted/50 rounded-full flex items-center justify-center mx-auto">
            <Search className="w-5 h-5 text-foreground/80" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              No products found
            </h2>
            {query && (
              <p className="text-sm text-foreground/80">
                No results for "{query}"
              </p>
            )}
            <p className="text-xs text-foreground/80">
              Try adjusting your search terms
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center">
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="flex-1 max-w-32"
            >
              Try Again
            </Button>
          )}
          <Button
            size="sm"
            onClick={() => onSearch && onSearch("")}
            className="flex-1 max-w-32"
          >
            Browse All
          </Button>
        </div>

        {/* Search Suggestions */}
        {suggestions.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs font-normal text-foreground/80 text-center">
              Try these suggestions:
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestions.slice(0, 4).map((suggestion, index) => (
                <Button
                  key={index}
                  variant="secondary"
                  size="sm"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="text-xs h-7 px-3 font-light border-border"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
