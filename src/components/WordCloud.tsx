
import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import cloud from 'd3-cloud';
import { FormResponseType } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface WordCloudProps {
  formResponses: FormResponseType[];
}

interface Word {
  text: string;
  size: number;
}

interface CloudWord extends cloud.Word {
  size: number;
}

export function WordCloud({ formResponses }: WordCloudProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        const height = window.innerWidth < 768 ? 300 : 500;
        setDimensions({ width: width - 40, height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (!dimensions.width || !dimensions.height || !svgRef.current || formResponses.length === 0) return;

    // Process the words
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

    const words: Word[] = Array.from(wordMap.entries())
      .map(([text, value]) => ({
        text,
        size: Math.sqrt(value) * 20 + 10, // Scale the font size
      }))
      .sort((a, b) => b.size - a.size)
      .slice(0, 50);

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    // Create the layout
    const layout = cloud<CloudWord>()
      .size([dimensions.width, dimensions.height])
      .words(words)
      .padding(5)
      .rotate(() => 0)
      .fontSize(d => d.size)
      .on("end", draw);

    // Draw the word cloud
    function draw(words: CloudWord[]) {
      const svg = d3.select(svgRef.current);
      const g = svg
        .attr("width", dimensions.width)
        .attr("height", dimensions.height)
        .append("g")
        .attr("transform", `translate(${dimensions.width / 2},${dimensions.height / 2})`);

      const color = d3.scaleOrdinal<string>()
        .range(['#1e40af', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd']);

      g.selectAll("text")
        .data(words)
        .enter()
        .append("text")
        .style("font-size", d => `${d.size}px`)
        .style("font-family", "Inter")
        .style("font-weight", "bold")
        .style("fill", (_, i) => color(i.toString()))
        .attr("text-anchor", "middle")
        .attr("transform", d => `translate(${d.x},${d.y}) rotate(${d.rotate})`)
        .text(d => d.text || "")
        .style("cursor", "pointer")
        .on("mouseover", function() {
          d3.select(this)
            .transition()
            .duration(200)
            .style("opacity", 0.7);
        })
        .on("mouseout", function() {
          d3.select(this)
            .transition()
            .duration(200)
            .style("opacity", 1);
        });
    }

    layout.start();
  }, [dimensions, formResponses]);

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
            <svg ref={svgRef} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

