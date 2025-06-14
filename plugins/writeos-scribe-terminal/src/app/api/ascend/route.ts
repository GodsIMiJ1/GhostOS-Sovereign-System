import { NextRequest, NextResponse } from 'next/server';

interface AscendRequest {
  content: string;
  action: 'enhance' | 'summarize' | 'format' | 'analyze';
  context?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { content, action, context }: AscendRequest = await request.json();

    if (!content || !action) {
      return NextResponse.json(
        { success: false, error: 'Content and action are required' },
        { status: 400 }
      );
    }

    // Enhanced AI processing simulation - Phase II
    const processedResult = await processContent(content, action, context);

    return NextResponse.json({
      success: true,
      message: `Scroll ${action} completed successfully`,
      originalContent: content,
      processedContent: processedResult.content,
      suggestions: processedResult.suggestions,
      metadata: {
        action,
        wordCount: content.split(/\s+/).length,
        processingTime: processedResult.processingTime,
        timestamp: new Date().toISOString(),
      }
    });
  } catch (error) {
    console.error('Ascend API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to ascend scroll' },
      { status: 500 }
    );
  }
}

async function processContent(content: string, action: string, context?: string) {
  const startTime = Date.now();

  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

  let processedContent = content;
  let suggestions: string[] = [];

  switch (action) {
    case 'enhance':
      processedContent = enhanceContent(content);
      suggestions = [
        'Consider adding more descriptive language',
        'Break up long paragraphs for better readability',
        'Add transitions between sections'
      ];
      break;

    case 'summarize':
      processedContent = summarizeContent(content);
      suggestions = [
        'Key points have been extracted',
        'Consider expanding on the most important ideas',
        'Review for completeness'
      ];
      break;

    case 'format':
      processedContent = formatContent(content);
      suggestions = [
        'Markdown formatting applied',
        'Headers and structure improved',
        'Consider adding code blocks where appropriate'
      ];
      break;

    case 'analyze':
      const analysis = analyzeContent(content);
      processedContent = analysis.report;
      suggestions = analysis.suggestions;
      break;

    default:
      suggestions = ['Unknown action requested'];
  }

  return {
    content: processedContent,
    suggestions,
    processingTime: Date.now() - startTime
  };
}

function enhanceContent(content: string): string {
  // Simple enhancement simulation
  return content
    .replace(/\b(good|nice|great)\b/gi, (match) => {
      const alternatives = {
        'good': 'excellent',
        'nice': 'remarkable',
        'great': 'outstanding'
      };
      return alternatives[match.toLowerCase() as keyof typeof alternatives] || match;
    })
    .replace(/\. ([A-Z])/g, '. \n\n$1'); // Add paragraph breaks
}

function summarizeContent(content: string): string {
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const keyPoints = sentences.slice(0, Math.max(3, Math.floor(sentences.length / 3)));

  return `# Summary\n\n${keyPoints.map((point, i) => `${i + 1}. ${point.trim()}.`).join('\n')}`;
}

function formatContent(content: string): string {
  return content
    .replace(/^([A-Z][^.!?]*[.!?])\s*$/gm, '# $1') // Convert standalone sentences to headers
    .replace(/(\d+)\.\s+([^\n]+)/g, '- **$2**') // Convert numbered lists to bullet points
    .replace(/([A-Z][A-Z\s]+):/g, '## $1') // Convert ALL CAPS labels to headers
    .replace(/`([^`]+)`/g, '`$1`'); // Preserve existing code formatting
}

function analyzeContent(content: string) {
  const wordCount = content.split(/\s+/).length;
  const sentenceCount = content.split(/[.!?]+/).length - 1;
  const paragraphCount = content.split(/\n\s*\n/).length;
  const avgWordsPerSentence = Math.round(wordCount / sentenceCount);

  const readabilityScore = calculateReadabilityScore(wordCount, sentenceCount);

  const report = `# Content Analysis Report

## Statistics
- **Word Count:** ${wordCount}
- **Sentences:** ${sentenceCount}
- **Paragraphs:** ${paragraphCount}
- **Average Words per Sentence:** ${avgWordsPerSentence}
- **Readability Score:** ${readabilityScore}/100

## Content Structure
${analyzeStructure(content)}

## Recommendations
${generateRecommendations(wordCount, avgWordsPerSentence, readabilityScore)}`;

  return {
    report,
    suggestions: [
      `Document contains ${wordCount} words`,
      `Average sentence length: ${avgWordsPerSentence} words`,
      `Readability score: ${readabilityScore}/100`
    ]
  };
}

function calculateReadabilityScore(wordCount: number, sentenceCount: number): number {
  // Simplified readability calculation
  const avgWordsPerSentence = wordCount / sentenceCount;
  let score = 100;

  if (avgWordsPerSentence > 20) score -= 20;
  if (avgWordsPerSentence > 25) score -= 20;
  if (avgWordsPerSentence > 30) score -= 20;

  return Math.max(0, score);
}

function analyzeStructure(content: string): string {
  const hasHeaders = /^#+\s/.test(content);
  const hasLists = /^[-*+]\s/.test(content);
  const hasCode = /```/.test(content);

  const structure = [];
  if (hasHeaders) structure.push('✅ Headers present');
  if (hasLists) structure.push('✅ Lists used');
  if (hasCode) structure.push('✅ Code blocks included');

  return structure.length > 0 ? structure.join('\n') : '⚠️ Consider adding structure with headers and lists';
}

function generateRecommendations(wordCount: number, avgWords: number, readability: number): string {
  const recommendations = [];

  if (wordCount < 100) recommendations.push('- Consider expanding the content');
  if (avgWords > 25) recommendations.push('- Break up long sentences for clarity');
  if (readability < 60) recommendations.push('- Simplify language for better readability');
  if (wordCount > 1000) recommendations.push('- Consider breaking into multiple sections');

  return recommendations.length > 0 ? recommendations.join('\n') : '- Content structure looks good!';
}
