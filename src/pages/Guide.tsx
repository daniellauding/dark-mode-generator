import { BookOpen, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import guideContent from '../../DARK-MODE-GUIDE.md?raw';

export function Guide() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-dark-400 hover:text-dark-200 transition-colors mb-8 cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span className="text-sm">Back to home</span>
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            <BookOpen size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-dark-100">Dark Mode Guide</h1>
            <p className="text-sm text-dark-400">Best practices for beautiful dark UIs</p>
          </div>
        </div>

        {/* Markdown content */}
        <article className="guide-prose">
          <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
            {guideContent}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  );
}
