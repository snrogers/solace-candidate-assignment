import React, { FC } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AdvocatesSearchInputProps {
  onChange: (val: string) => void;
  isLoading: boolean;
  value: string;
}

const AdvocatesSearchInput: FC<AdvocatesSearchInputProps> = (props) => {
  const { isLoading, onChange, value } = props;

  const inputRef = React.useRef<HTMLInputElement>(null);
  const showClearButton = !!value && !isLoading;

  const clearInput = () => {
    onChange('');
    const input = inputRef.current;
    if (!input) return;

    input.value = '';
    input.focus();
  };

  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />

      <Input
        ref={inputRef}
        className="pl-8"
        placeholder="Search advocates..."
        onChange={(e) => onChange(e.target.value)}
      />

      {showClearButton && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1.5 h-7 w-7 p-0"
          onClick={clearInput}
        >
          <X className="h-4 w-4" />
        </Button>
      )}

      {isLoading && (
        <Loader2
          className="absolute right-2 top-2.5 h-4 w-4 animate-spin text-muted-foreground"
        />
      )}
    </div>
  );
}

export default AdvocatesSearchInput;
