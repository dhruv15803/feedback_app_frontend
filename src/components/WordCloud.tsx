import React, { useMemo, useEffect, useState } from 'react';
import ReactWordcloud from 'react-wordcloud';
import { FormResponseType } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface WordCloudProps {
  formResponses: FormResponseType[];
}

// interface Word {
//   text: string;
//   value: number;
// }

export function WordCloud({ formResponses }: WordCloudProps) {
  const [dimensions, setDimensions] = useState<[number, number]>([0, 0]);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Update dimensions on mount and window resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        // Adjust height based on screen size
        const height = window.innerWidth < 768 ? 300 : 500;
        setDimensions([width - 40, height]); // Subtract padding
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const words = useMemo(() => {
    const wordMap = new Map<string, number>();
    
    formResponses.forEach(response => {
      const text = `${response.field1_value} ${response.field2_value} ${response.field3_value}`;
      
      const words = text
        .toLowerCase()
        .split(/\s+/)
        .map(word => word.replace(/[^a-zA-Z]/g, ''))
        .filter(word => word.length > 3);
      
      words.forEach(word => {
        wordMap.set(word, (wordMap.get(word) || 0) + 1);
      });
    });

    return Array.from(wordMap.entries())
      .map(([text, value]) => ({
        text,
        value,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 50);
  }, [formResponses]);

  const options = {
    colors: [
      '#1e40af',
      '#2563eb',
      '#3b82f6',
      '#60a5fa',
      '#93c5fd',
    ],
    enableTooltip: true,
    deterministic: false,
    fontFamily: 'inter',
    fontSizes: [16, 60] as [number, number],
    fontStyle: 'normal',
    fontWeight: 'bold',
    padding: 3,
    rotations: window.innerWidth < 768 ? 0 : 2,
    rotationAngles: [0, 0] as [number, number],
    scale: 'sqrt' as 'linear' | 'log' | 'sqrt',
    spiral: 'rectangular' as 'archimedean' | 'rectangular', // Explicitly cast the type
    transitionDuration: 1000,
  };
  

  return (
    <Card className="w-full bg-blue-50/50 mb-8 overflow-hidden">
      <CardHeader className="bg-blue-100/50 border-b border-blue-200">
        <CardTitle className="text-xl font-semibold text-blue-600">
          Response Word Cloud
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="bg-transparent p-4 md:p-6" ref={containerRef}>
          <div className="min-h-[300px] md:min-h-[500px] w-full flex items-center justify-center">
            {dimensions[0] > 0 && (
              <ReactWordcloud 
                words={words} 
                options={options} 
                size={dimensions}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

