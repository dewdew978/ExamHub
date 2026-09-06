import { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Check, 
  Copy, 
  ExternalLink, 
  Edit3, 
  Pin, 
  BookOpen, 
  Clock, 
  X, 
  Globe, 
  LayoutGrid, 
  GitCommit, 
  ArrowLeft 
} from 'lucide-react';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import Navbar from './Navbar';
import DotGridBackground from './DotGridBackground';
import { getBlogs, formatBlogDate, BLOG_CATEGORIES } from '../lib/blogs';

// Markdown renderer supporting KaTeX formulas, headers, bold, code, lists, blockquotes, links
function renderMarkdownContent(content) {
  if (!content) return null;

  const lines = content.split('\n');
  const elements = [];
  let inCodeBlock = false;
  let codeBuffer = [];

  const renderInline = (text) => {
    if (!text) return null;

    // Split KaTeX math $...$
    const mathParts = text.split('$');
    return mathParts.map((part, pIdx) => {
      if (pIdx % 2 === 1) {
        try {
          return <InlineMath key={`math-${pIdx}`} math={part} />;
        } catch {
          return <code key={`math-fallback-${pIdx}`}>${part}$</code>;
        }
      }

      // Format bold, italic, inline code, and links
      const inlineTokens = [];
      let remaining = part;
      let k = 0;

      while (remaining.length > 0) {
        // Link: [text](url)
        const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/);
        if (linkMatch) {
          inlineTokens.push(
            <a 
              key={`link-${k++}`} 
              href={linkMatch[2]} 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ color: 'var(--accent)', textDecoration: 'underline', textUnderlineOffset: '3px' }}
            >
              {linkMatch[1]}
            </a>
          );
          remaining = remaining.slice(linkMatch[0].length);
          continue;
        }

        // Inline Code: `code`
        const codeMatch = remaining.match(/^`([^`]+)`/);
        if (codeMatch) {
          inlineTokens.push(
            <code 
              key={`code-${k++}`} 
              style={{
                background: 'var(--surface-hover)',
                border: '1px solid var(--border-color)',
                borderRadius: '4px',
                padding: '0.15rem 0.4rem',
                fontSize: '0.85em',
                fontFamily: 'monospace',
                color: 'var(--accent)'
              }}
            >
              {codeMatch[1]}
            </code>
          );
          remaining = remaining.slice(codeMatch[0].length);
          continue;
        }

        // Bold: **text**
        const boldMatch = remaining.match(/^\*\*([^*]+)\*\*/);
        if (boldMatch) {
          inlineTokens.push(<strong key={`bold-${k++}`}>{boldMatch[1]}</strong>);
          remaining = remaining.slice(boldMatch[0].length);
          continue;
        }

        // Italic: *text*
        const italicMatch = remaining.match(/^\*([^*]+)\*/);
        if (italicMatch) {
          inlineTokens.push(<em key={`italic-${k++}`}>{italicMatch[1]}</em>);
          remaining = remaining.slice(italicMatch[0].length);
          continue;
        }

        // Plain text token until next markdown special character
        const nextSpecial = remaining.search(/(\[|`|\*)/);
        if (nextSpecial === -1) {
          inlineTokens.push(remaining);
          break;
        } else if (nextSpecial === 0) {
          inlineTokens.push(remaining[0]);
          remaining = remaining.slice(1);
        } else {
          inlineTokens.push(remaining.slice(0, nextSpecial));
          remaining = remaining.slice(nextSpecial);
        }
      }

      return <span key={`text-${pIdx}`}>{inlineTokens}</span>;
    });
  };

  lines.forEach((line, index) => {
    // Code block toggle
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <pre 
            key={`codeblock-${index}`} 
            style={{
              background: 'var(--surface-hover)',
              border: '1px solid var(--border-color)',
              padding: '1rem',
              borderRadius: '10px',
              overflowX: 'auto',
              fontSize: '0.85rem',
              fontFamily: 'monospace',
              margin: '0.75rem 0',
              lineHeight: 1.5
            }}
          >
            <code>{codeBuffer.join('\n')}</code>
          </pre>
        );
        codeBuffer = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      return;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      return;
    }

    const trimmed = line.trim();

    // Empty line
    if (!trimmed) {
      elements.push(<div key={`sp-${index}`} style={{ height: '0.65rem' }} />);
      return;
    }

    // Horizontal Rule
    if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
      elements.push(
        <hr 
          key={`hr-${index}`} 
          style={{ 
            border: 'none', 
            borderTop: '1px solid var(--border-divider)', 
            margin: '1.5rem 0' 
          }} 
        />
      );
      return;
    }

    // Headers
    if (trimmed.startsWith('### ')) {
      elements.push(
        <h3 key={index} style={{ fontSize: '1.25rem', fontWeight: 700, margin: '1.25rem 0 0.5rem', color: 'var(--text)' }}>
          {renderInline(trimmed.slice(4))}
        </h3>
      );
      return;
    }
    if (trimmed.startsWith('## ')) {
      elements.push(
        <h2 key={index} style={{ fontSize: '1.45rem', fontWeight: 800, margin: '1.5rem 0 0.65rem', color: 'var(--text)' }}>
          {renderInline(trimmed.slice(3))}
        </h2>
      );
      return;
    }
    if (trimmed.startsWith('# ')) {
      elements.push(
        <h1 key={index} style={{ fontSize: '1.75rem', fontWeight: 900, margin: '1.75rem 0 0.75rem', color: 'var(--text)' }}>
          {renderInline(trimmed.slice(2))}
        </h1>
      );
      return;
    }

    // Blockquote
    if (trimmed.startsWith('> ')) {
      elements.push(
        <blockquote 
          key={index} 
          style={{
            borderLeft: '4px solid var(--accent)',
            margin: '0.75rem 0',
            padding: '0.5rem 1rem',
            background: 'color-mix(in srgb, var(--accent) 6%, transparent)',
            borderRadius: '0 8px 8px 0',
            color: 'var(--text-muted)',
            fontStyle: 'italic'
          }}
        >
          {renderInline(trimmed.slice(2))}
        </blockquote>
      );
      return;
    }

    // Bullet List
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      elements.push(
        <li key={index} style={{ margin: '0.3rem 0 0.3rem 1.25rem', lineHeight: 1.6, color: 'var(--text)' }}>
          {renderInline(trimmed.slice(2))}
        </li>
      );
      return;
    }

    // Numbered List
    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
    if (numMatch) {
      elements.push(
        <li key={index} value={numMatch[1]} style={{ margin: '0.3rem 0 0.3rem 1.25rem', lineHeight: 1.6, color: 'var(--text)' }}>
          {renderInline(numMatch[2])}
        </li>
      );
      return;
    }

    // Normal Paragraph
    elements.push(
      <p key={index} style={{ margin: '0.5rem 0', lineHeight: 1.7, color: 'var(--text)', fontSize: '0.95rem' }}>
        {renderInline(trimmed)}
      </p>
    );
  });

  return elements;
}

export default function Blog({
  user = null,
  isAdmin = false,
  onHome,
  onStart,
  onLogin,
  onNavigateAbout,
  onNavigateFaq,
  onOpenAdminBlog
}) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' (Magic UI default) | 'timeline'
  const [activeArticleModal, setActiveArticleModal] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const [isDark, setIsDark] = useState(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Fetch blogs on mount & listen for real-time changes
  useEffect(() => {
    let isMounted = true;
    const fetchAll = async () => {
      setLoading(true);
      try {
        const data = await getBlogs({ includeDrafts: false });
        if (isMounted) setBlogs(data);
      } catch (err) {
        console.error('Error fetching blogs:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchAll();

    const handleBlogsChanged = () => {
      fetchAll();
    };
    window.addEventListener('exetia-blogs-changed', handleBlogsChanged);

    return () => { 
      isMounted = false; 
      window.removeEventListener('exetia-blogs-changed', handleBlogsChanged);
    };
  }, []);

  // Tag counts calculation
  const tagCounts = useMemo(() => {
    const counts = { all: blogs.length };
    blogs.forEach((b) => {
      const cat = b.category || 'feature';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [blogs]);

  // Filtered list
  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const matchCat = selectedCategory === 'all' || blog.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery = !q || 
        blog.title?.toLowerCase().includes(q) ||
        blog.description?.toLowerCase().includes(q) ||
        blog.content?.toLowerCase().includes(q) ||
        blog.version_tag?.toLowerCase().includes(q) ||
        blog.source_name?.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [blogs, selectedCategory, searchQuery]);

  const handleCopyLink = (blog) => {
    const url = `${window.location.origin}/blog#${blog.slug || blog.id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(blog.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="blog-page-root animate-fade-in">
      <style>{`
        .blog-page-root {
          width: 100%;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background-color: var(--bg);
          color: var(--text);
          position: relative;
        }

        /* Magic UI Hero with Canvas Grid */
        .blog-magic-hero {
          position: relative;
          border-bottom: 1px solid var(--border-color);
          padding: 6.5rem 1.5rem 2.5rem;
          min-height: 250px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          overflow: hidden;
        }
        .blog-magic-canvas-mask {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 230px;
          z-index: 0;
          mask-image: linear-gradient(to top, transparent 15%, black 90%);
          -webkit-mask-image: linear-gradient(to top, transparent 15%, black 90%);
          pointer-events: none;
        }
        .blog-magic-hero-inner {
          position: relative;
          z-index: 10;
          max-width: 1280px;
          width: 100%;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .blog-magic-title {
          font-size: clamp(2.2rem, 5vw, 3.25rem);
          font-weight: 700;
          letter-spacing: -0.04em;
          margin: 0 0 0.5rem 0;
          color: var(--text);
          line-height: 1.15;
        }
        .blog-magic-subtitle {
          font-size: clamp(0.95rem, 2vw, 1.125rem);
          color: var(--text-muted);
          margin: 0;
          line-height: 1.5;
        }

        /* Magic UI Tag Filter Pills */
        .blog-magic-filter-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .blog-magic-pills {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .magic-tag-pill {
          height: 32px;
          display: inline-flex;
          align-items: center;
          padding-left: 0.75rem;
          padding-right: 0.35rem;
          border-radius: 8px;
          border: 1px solid var(--border-color);
          background: var(--surface);
          color: var(--text);
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s ease;
          user-select: none;
        }
        .magic-tag-pill:hover {
          background: var(--surface-hover);
          border-color: var(--border-divider);
        }
        .magic-tag-pill.active {
          background: var(--text);
          color: var(--bg);
          border-color: var(--text);
          font-weight: 600;
        }
        .magic-tag-count {
          margin-left: 0.5rem;
          font-size: 0.72rem;
          border-radius: 6px;
          height: 20px;
          min-width: 20px;
          padding: 0 0.35rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: color-mix(in srgb, var(--surface) 50%, var(--border-color));
          color: var(--text-muted);
          border: 1px solid var(--border-color);
        }
        .magic-tag-pill.active .magic-tag-count {
          background: var(--bg);
          color: var(--text);
          border-color: transparent;
        }

        /* Search & View Mode Switcher */
        .blog-magic-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        .blog-magic-search {
          position: relative;
          width: 260px;
        }
        @media (max-width: 640px) {
          .blog-magic-search {
            width: 100%;
          }
        }
        .blog-magic-search input {
          width: 100%;
          height: 34px;
          padding: 0 1.85rem 0 2rem;
          border-radius: 8px;
          border: 1px solid var(--border-color);
          background: var(--surface);
          color: var(--text);
          font-size: 0.85rem;
          outline: none;
          transition: border-color 0.15s ease;
        }
        .blog-magic-search input:focus {
          border-color: var(--accent);
        }
        .blog-magic-search .search-icon {
          position: absolute;
          left: 0.65rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          pointer-events: none;
        }
        .blog-magic-search .clear-btn {
          position: absolute;
          right: 0.5rem;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
        }

        .blog-view-toggle {
          display: inline-flex;
          align-items: center;
          background: var(--surface);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 2px;
          gap: 2px;
        }
        .blog-view-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.3rem 0.6rem;
          border-radius: 6px;
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--text-muted);
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .blog-view-btn.active {
          background: var(--surface-hover);
          color: var(--text);
          box-shadow: 0 1px 3px rgba(0,0,0,0.06);
        }

        /* Magic UI Signature Grid */
        .blog-magic-grid-container {
          max-width: 1280px;
          width: 100%;
          margin: 0 auto;
          padding: 2.5rem 1.5rem 6rem;
        }
        .blog-magic-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          background: transparent;
        }
        .blog-magic-grid.grid-2-items {
          grid-template-columns: repeat(2, 1fr);
          max-width: 860px;
          margin: 0 auto;
        }
        .blog-magic-grid.grid-1-item {
          grid-template-columns: minmax(0, 460px);
          justify-content: center;
        }
        @media (max-width: 1024px) {
          .blog-magic-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 640px) {
          .blog-magic-grid,
          .blog-magic-grid.grid-2-items {
            grid-template-columns: 1fr;
          }
        }

        /* Magic UI Blog Card */
        .magic-blog-card {
          background: var(--surface);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          cursor: pointer;
          transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
          position: relative;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
        }
        .magic-blog-card:hover {
          transform: translateY(-3px);
          border-color: var(--accent);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
        }

        .magic-card-media-wrap {
          position: relative;
          width: 100%;
          height: 200px;
          overflow: hidden;
          background: color-mix(in srgb, var(--surface) 60%, var(--border-color));
        }
        .magic-card-media-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.35s ease;
        }
        .magic-blog-card:hover .magic-card-media-img {
          transform: scale(1.05);
        }
        .magic-card-media-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .magic-card-media-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at 50% 50%, color-mix(in srgb, var(--accent) 15%, transparent), transparent 70%);
        }

        .magic-card-badges {
          position: absolute;
          top: 0.85rem;
          left: 0.85rem;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          z-index: 2;
        }
        .magic-card-category-pill {
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.2rem 0.6rem;
          border-radius: 999px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          backdrop-filter: blur(8px);
        }
        .magic-pin-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.72rem;
          font-weight: 700;
          color: #f59e0b;
          background: rgba(245, 158, 11, 0.18);
          border: 1px solid rgba(245, 158, 11, 0.35);
          padding: 0.15rem 0.55rem;
          border-radius: 999px;
          backdrop-filter: blur(8px);
        }

        .magic-card-content {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          flex: 1;
        }
        .magic-card-title {
          font-size: 1.22rem;
          font-weight: 600;
          line-height: 1.35;
          color: var(--text);
          margin: 0;
          letter-spacing: -0.02em;
          transition: color 0.15s ease;
        }
        .magic-blog-card:hover .magic-card-title {
          text-decoration: underline;
          text-underline-offset: 4px;
        }
        .magic-card-desc {
          font-size: 0.875rem;
          color: var(--text-muted);
          line-height: 1.55;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .magic-card-footer {
          margin-top: auto;
          padding-top: 1rem;
          border-top: 1px solid var(--border-divider);
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .magic-card-author {
          display: flex;
          align-items: center;
          gap: 0.45rem;
        }
        .magic-card-date {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .magic-source-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--text-muted);
          background: color-mix(in srgb, var(--surface) 75%, var(--border-color));
          border: 1px solid var(--border-color);
          padding: 0.15rem 0.5rem;
          border-radius: 999px;
          text-decoration: none;
          transition: all 0.15s ease;
        }
        a.magic-source-pill:hover {
          color: var(--accent);
          border-color: var(--accent);
          background: color-mix(in srgb, var(--accent) 12%, transparent);
        }

        /* Timeline Layout Fallback */
        .blog-timeline-wrap {
          max-width: 1000px;
          width: 100%;
          margin: 0 auto;
          padding: 2.5rem 1.5rem 6rem;
        }
        .blog-timeline-item {
          display: grid;
          grid-template-columns: 220px 48px 1fr;
          margin-bottom: 4rem;
        }
        @media (max-width: 860px) {
          .blog-timeline-item {
            grid-template-columns: 36px 1fr;
            gap: 1rem;
            margin-bottom: 3rem;
          }
          .blog-tl-sidebar {
            grid-column: 2 / 3;
            text-align: left !important;
            padding: 0 !important;
          }
          .blog-tl-rail {
            grid-column: 1 / 2;
            grid-row: 1 / 3;
          }
          .blog-tl-card {
            grid-column: 2 / 3;
          }
        }
        .blog-tl-sidebar {
          text-align: right;
          padding-top: 0.25rem;
          padding-right: 1rem;
        }
        .blog-tl-rail {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .blog-tl-node {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: var(--surface);
          border: 2px solid var(--accent);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
        }
        .blog-tl-node-inner {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--accent);
        }
        .blog-tl-line {
          position: absolute;
          top: 24px;
          bottom: -4rem;
          width: 2px;
          background: var(--border-divider);
        }
        .blog-timeline-item:last-child .blog-tl-line {
          display: none;
        }
        .blog-tl-card {
          background: var(--surface);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 1.75rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.03);
          transition: border-color 0.2s ease, transform 0.2s ease;
        }
        .blog-tl-card:hover {
          border-color: var(--accent);
          transform: translateY(-2px);
        }

        /* Modal Full Article Reader */
        .blog-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.65);
          backdrop-filter: blur(10px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }
        .blog-modal-container {
          background: var(--surface);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          max-width: 860px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 24px 70px rgba(0,0,0,0.3);
          display: flex;
          flex-direction: column;
          position: relative;
        }
        .blog-modal-header {
          position: sticky;
          top: 0;
          background: color-mix(in srgb, var(--surface) 92%, transparent);
          backdrop-filter: blur(16px);
          padding: 1.15rem 1.75rem;
          border-bottom: 1px solid var(--border-divider);
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 20;
        }
        .blog-modal-body {
          padding: 2rem 2.25rem 3rem;
        }
        @media (max-width: 600px) {
          .blog-modal-body {
            padding: 1.5rem;
          }
        }
        .blog-source-callout {
          margin-top: 2.5rem;
          padding: 1.25rem 1.5rem;
          border-radius: 16px;
          background: color-mix(in srgb, var(--surface) 60%, var(--border-color));
          border: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }
      `}</style>

      {/* Floating Navbar */}
      <Navbar
        user={user}
        onBrand={onHome}
        onStart={onStart}
        onLogin={onLogin}
        onStartGuest={onStart}
        links={[
          { label: 'หน้าแรก', onClick: onHome },
          { label: 'คลังข้อสอบ', onClick: onStart },
          { label: 'ข่าวสาร & อัปเดต', active: true },
          { label: 'คำถามที่พบบ่อย', onClick: onNavigateFaq },
          { label: 'เกี่ยวกับเรา', onClick: onNavigateAbout }
        ]}
      />

      {/* Magic UI Hero Header */}
      <header className="blog-magic-hero">
        <div className="blog-magic-canvas-mask">
          <DotGridBackground 
            dotSize={2.8} 
            gap={22} 
            baseColor={isDark ? '#475569' : '#cbd5e1'} 
            activeColor="#0070f3" 
          />
        </div>

        <div className="blog-magic-hero-inner">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 className="blog-magic-title">EXETIA Blog</h1>
              <p className="blog-magic-subtitle">Latest news, updates, and learning insights from EXETIA.</p>
            </div>

            {isAdmin && onOpenAdminBlog && (
              <button
                onClick={onOpenAdminBlog}
                className="btn btn-outline"
                style={{
                  borderRadius: '999px',
                  padding: '0.55rem 1.25rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  background: 'var(--surface)',
                  border: '1px solid var(--border-color)'
                }}
              >
                <Edit3 size={15} style={{ color: 'var(--accent)' }} />
                <span>จัดการข่าวสาร (Admin)</span>
              </button>
            )}
          </div>

          {/* Magic UI Tag Filter & Search Toolbar */}
          <div className="blog-magic-filter-bar">
            {/* Tag Pills with counts */}
            <div className="blog-magic-pills">
              <button
                className={`magic-tag-pill ${selectedCategory === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('all')}
              >
                <span>All</span>
                <span className="magic-tag-count">{tagCounts.all || 0}</span>
              </button>
              {Object.entries(BLOG_CATEGORIES).filter(([k]) => k !== 'all').map(([catKey, cat]) => (
                <button
                  key={catKey}
                  className={`magic-tag-pill ${selectedCategory === catKey ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(catKey)}
                >
                  <span>{cat.label}</span>
                  <span className="magic-tag-count">{tagCounts[catKey] || 0}</span>
                </button>
              ))}
            </div>

            {/* Actions: Search & View Switcher */}
            <div className="blog-magic-actions">
              <div className="blog-magic-search">
                <Search size={14} className="search-icon" />
                <input
                  type="text"
                  placeholder="ค้นหาบทความหรือหัวข้อ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="clear-btn">
                    <X size={14} />
                  </button>
                )}
              </div>

              <div className="blog-view-toggle">
                <button
                  className={`blog-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  title="ตารางการ์ด (Magic UI Blog Grid)"
                >
                  <LayoutGrid size={14} />
                  <span>Grid</span>
                </button>
                <button
                  className={`blog-view-btn ${viewMode === 'timeline' ? 'active' : ''}`}
                  onClick={() => setViewMode('timeline')}
                  title="ไทม์ไลน์ (Changelog Timeline)"
                >
                  <GitCommit size={14} />
                  <span>Timeline</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 1rem', color: 'var(--text-muted)' }}>
            <div className="animate-spin" style={{ display: 'inline-block', width: '32px', height: '32px', border: '3px solid var(--border-color)', borderTopColor: 'var(--accent)', borderRadius: '50%', marginBottom: '1rem' }} />
            <p style={{ fontSize: '0.925rem' }}>กำลังโหลดบทความและข่าวสาร...</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center', padding: '3.5rem 1.5rem', background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            <BookOpen size={44} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem', opacity: 0.5 }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>ไม่พบบทความข่าวสาร</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              ลองเปลี่ยนคำค้นหาหรือเลือกหมวดหมู่อื่นเพื่อดูรายการข่าวสาร
            </p>
            {searchQuery && (
              <button 
                className="btn btn-outline" 
                onClick={() => setSearchQuery('')}
                style={{ marginTop: '1.25rem', borderRadius: '999px', fontSize: '0.85rem' }}
              >
                ล้างการค้นหา
              </button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          /* =======================================================
             MAGIC UI 3-COLUMN BLOG GRID
             ======================================================= */
          <div className="blog-magic-grid-container">
            <div className={`blog-magic-grid ${filteredBlogs.length === 2 ? 'grid-2-items' : filteredBlogs.length === 1 ? 'grid-1-item' : ''}`}>
              {filteredBlogs.map((blog) => {
                const catConfig = BLOG_CATEGORIES[blog.category] || BLOG_CATEGORIES.feature;
                const isVideo = blog.media_type === 'video' || (blog.cover_url && blog.cover_url.endsWith('.mp4'));

                return (
                  <article
                    key={blog.id}
                    className="magic-blog-card"
                    onClick={() => setActiveArticleModal(blog)}
                  >
                    {/* Media Thumbnail */}
                    <div className="magic-card-media-wrap">
                      {blog.cover_url ? (
                        isVideo ? (
                          <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            src={blog.cover_url}
                            className="magic-card-media-video"
                          />
                        ) : (
                          <img
                            src={blog.cover_url}
                            alt={blog.title}
                            className="magic-card-media-img"
                            loading="lazy"
                          />
                        )
                      ) : (
                        <div className="magic-card-media-placeholder">
                          <span style={{ fontSize: '2.5rem' }}>{blog.author_avatar || '🎓'}</span>
                        </div>
                      )}

                      {/* Badges on image */}
                      <div className="magic-card-badges">
                        <span 
                          className="magic-card-category-pill"
                          style={{ background: catConfig.bg, color: catConfig.color }}
                        >
                          {catConfig.label}
                        </span>

                        {blog.pinned && (
                          <span className="magic-pin-badge">
                            <Pin size={11} />
                            <span>ปักหมุด</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="magic-card-content">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                        {blog.version_tag && (
                          <span 
                            style={{ 
                              fontSize: '0.72rem', 
                              fontWeight: 700, 
                              fontFamily: 'monospace', 
                              padding: '0.12rem 0.5rem', 
                              borderRadius: '999px', 
                              background: 'rgba(0,112,243,0.1)', 
                              color: 'var(--accent)',
                              border: '1px solid rgba(0,112,243,0.2)'
                            }}
                          >
                            {blog.version_tag}
                          </span>
                        )}

                        {(blog.source_name || blog.source_url) && (
                          blog.source_url ? (
                            <a
                              href={blog.source_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="magic-source-pill"
                              title={`ที่มา: ${blog.source_name || blog.source_url}`}
                            >
                              <Globe size={11} />
                              <span>{blog.source_name || 'ต้นทาง'}</span>
                              <ExternalLink size={10} style={{ opacity: 0.7 }} />
                            </a>
                          ) : (
                            <span className="magic-source-pill">
                              <Globe size={11} />
                              <span>{blog.source_name}</span>
                            </span>
                          )
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="magic-card-title">
                        {blog.title}
                      </h3>

                      {/* Description */}
                      {blog.description && (
                        <p className="magic-card-desc">
                          {blog.description}
                        </p>
                      )}

                      {/* Card Footer: Date, Author & Read Time */}
                      <div className="magic-card-footer">
                        <div className="magic-card-author">
                          <span style={{ fontSize: '1rem' }}>{blog.author_avatar || '🎓'}</span>
                          <div>
                            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text)' }}>
                              {blog.author_name || 'EXETIA'}
                            </div>
                            <time className="magic-card-date">
                              {formatBlogDate(blog.published_at || blog.created_at)}
                            </time>
                          </div>
                        </div>

                        {blog.read_time && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem' }}>
                            <Clock size={11} />
                            <span>{blog.read_time}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        ) : (
          /* =======================================================
             TIMELINE VIEW (CHANGELOG FORMAT)
             ======================================================= */
          <div className="blog-timeline-wrap">
            {filteredBlogs.map((blog) => {
              const catConfig = BLOG_CATEGORIES[blog.category] || BLOG_CATEGORIES.feature;
              const isVideo = blog.media_type === 'video' || (blog.cover_url && blog.cover_url.endsWith('.mp4'));

              return (
                <article key={blog.id} className="blog-timeline-item">
                  {/* Left: Date & Author */}
                  <div className="blog-tl-sidebar">
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.35rem' }}>
                      {formatBlogDate(blog.published_at || blog.created_at)}
                    </div>
                    {blog.version_tag && (
                      <span 
                        style={{ 
                          display: 'inline-block',
                          fontSize: '0.75rem', 
                          fontWeight: 700, 
                          fontFamily: 'monospace', 
                          padding: '0.15rem 0.55rem', 
                          borderRadius: '999px', 
                          background: 'rgba(0,112,243,0.1)', 
                          color: 'var(--accent)',
                          border: '1px solid rgba(0,112,243,0.2)',
                          marginBottom: '0.4rem'
                        }}
                      >
                        {blog.version_tag}
                      </span>
                    )}
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {blog.author_avatar} {blog.author_name}
                    </div>
                  </div>

                  {/* Center: Rail */}
                  <div className="blog-tl-rail">
                    <div className="blog-tl-node">
                      <div className="blog-tl-node-inner" />
                    </div>
                    <div className="blog-tl-line" />
                  </div>

                  {/* Right: Card */}
                  <div className="blog-tl-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                      <span 
                        className="magic-card-category-pill"
                        style={{ background: catConfig.bg, color: catConfig.color }}
                      >
                        {catConfig.label}
                      </span>

                      {blog.pinned && (
                        <span className="magic-pin-badge">
                          <Pin size={11} />
                          <span>ปักหมุด</span>
                        </span>
                      )}

                      {(blog.source_name || blog.source_url) && (
                        blog.source_url ? (
                          <a
                            href={blog.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="magic-source-pill"
                          >
                            <Globe size={11} />
                            <span>{blog.source_name || 'ต้นทาง'}</span>
                            <ExternalLink size={10} style={{ opacity: 0.7 }} />
                          </a>
                        ) : (
                          <span className="magic-source-pill">
                            <Globe size={11} />
                            <span>{blog.source_name}</span>
                          </span>
                        )
                      )}
                    </div>

                    <h2 
                      style={{ fontSize: '1.45rem', fontWeight: 800, margin: '0 0 0.5rem', color: 'var(--text)', cursor: 'pointer' }}
                      onClick={() => setActiveArticleModal(blog)}
                    >
                      {blog.title}
                    </h2>

                    {blog.description && (
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, margin: '0 0 1.25rem' }}>
                        {blog.description}
                      </p>
                    )}

                    {blog.cover_url && (
                      <div style={{ borderRadius: '12px', overflow: 'hidden', marginBottom: '1.25rem', maxHeight: '380px' }}>
                        {isVideo ? (
                          <video autoPlay loop muted playsInline src={blog.cover_url} style={{ width: '100%', display: 'block' }} />
                        ) : (
                          <img src={blog.cover_url} alt={blog.title} style={{ width: '100%', display: 'block', objectFit: 'cover' }} />
                        )}
                      </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginTop: '1rem' }}>
                      <button
                        onClick={() => setActiveArticleModal(blog)}
                        className="btn btn-outline"
                        style={{ borderRadius: '999px', fontSize: '0.8rem', padding: '0.4rem 0.95rem' }}
                      >
                        <span>อ่านฉบับเต็ม</span>
                        <ExternalLink size={12} />
                      </button>

                      <button
                        onClick={() => handleCopyLink(blog)}
                        className="btn btn-outline"
                        style={{ borderRadius: '999px', fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
                      >
                        {copiedId === blog.id ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
                        <span>{copiedId === blog.id ? 'คัดลอกแล้ว' : 'แชร์'}</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {/* Full Article Reader Modal (Fumadocs / Magic UI Style) */}
      {activeArticleModal && (
        <div className="blog-modal-backdrop" onClick={() => setActiveArticleModal(null)}>
          <div className="blog-modal-container animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="blog-modal-header">
              <button
                onClick={() => setActiveArticleModal(null)}
                className="btn btn-outline"
                style={{
                  borderRadius: '999px',
                  padding: '0.35rem 0.85rem',
                  fontSize: '0.8rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <ArrowLeft size={14} />
                <span>ย้อนกลับ</span>
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  onClick={() => handleCopyLink(activeArticleModal)}
                  className="btn btn-outline"
                  style={{ borderRadius: '999px', padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                >
                  {copiedId === activeArticleModal.id ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                  <span>{copiedId === activeArticleModal.id ? 'คัดลอกแล้ว' : 'คัดลอกลิงก์'}</span>
                </button>
                <button
                  onClick={() => setActiveArticleModal(null)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '0.35rem',
                    borderRadius: '50%'
                  }}
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="blog-modal-body">
              {/* Badges row */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <span 
                  className="magic-card-category-pill"
                  style={{ 
                    background: BLOG_CATEGORIES[activeArticleModal.category]?.bg || 'rgba(0,112,243,0.1)', 
                    color: BLOG_CATEGORIES[activeArticleModal.category]?.color || 'var(--accent)' 
                  }}
                >
                  {BLOG_CATEGORIES[activeArticleModal.category]?.label || 'อัปเดต'}
                </span>

                {activeArticleModal.version_tag && (
                  <span 
                    style={{ 
                      fontSize: '0.75rem', 
                      fontWeight: 700, 
                      fontFamily: 'monospace', 
                      padding: '0.15rem 0.6rem', 
                      borderRadius: '999px', 
                      background: 'rgba(0,112,243,0.1)', 
                      color: 'var(--accent)',
                      border: '1px solid rgba(0,112,243,0.2)'
                    }}
                  >
                    {activeArticleModal.version_tag}
                  </span>
                )}

                {(activeArticleModal.source_name || activeArticleModal.source_url) && (
                  activeArticleModal.source_url ? (
                    <a
                      href={activeArticleModal.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="magic-source-pill"
                      title={`เปิดดูต้นทาง: ${activeArticleModal.source_name || activeArticleModal.source_url}`}
                    >
                      <Globe size={11} />
                      <span>ที่มา: {activeArticleModal.source_name || 'ต้นทาง'}</span>
                      <ExternalLink size={10} style={{ opacity: 0.7 }} />
                    </a>
                  ) : (
                    <span className="magic-source-pill">
                      <Globe size={11} />
                      <span>ที่มา: {activeArticleModal.source_name}</span>
                    </span>
                  )
                )}
              </div>

              {/* Title */}
              <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.4rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '1rem', lineHeight: 1.25 }}>
                {activeArticleModal.title}
              </h1>

              {/* Meta: Author & Date */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-divider)' }}>
                <span style={{ fontSize: '1.5rem' }}>{activeArticleModal.author_avatar || '🚀'}</span>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{activeArticleModal.author_name} ({activeArticleModal.author_role || 'Core Team'})</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {formatBlogDate(activeArticleModal.published_at || activeArticleModal.created_at)} · {activeArticleModal.read_time || '3 นาที'}
                  </div>
                </div>
              </div>

              {/* Description */}
              {activeArticleModal.description && (
                <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '2rem' }}>
                  {activeArticleModal.description}
                </p>
              )}

              {/* Media */}
              {activeArticleModal.cover_url && (
                <div style={{ borderRadius: '16px', overflow: 'hidden', marginBottom: '2rem' }}>
                  {activeArticleModal.media_type === 'video' || activeArticleModal.cover_url.endsWith('.mp4') ? (
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      src={activeArticleModal.cover_url}
                      style={{ width: '100%', display: 'block' }}
                    />
                  ) : (
                    <img
                      src={activeArticleModal.cover_url}
                      alt={activeArticleModal.title}
                      style={{ width: '100%', display: 'block', objectFit: 'cover' }}
                    />
                  )}
                </div>
              )}

              {/* Markdown Content */}
              <div style={{ lineHeight: 1.8 }}>
                {renderMarkdownContent(activeArticleModal.content)}
              </div>

              {/* Reference / Source Callout */}
              {(activeArticleModal.source_name || activeArticleModal.source_url) && (
                <div className="blog-source-callout">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <Globe size={16} style={{ color: 'var(--accent)' }} />
                      <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text)' }}>
                        แหล่งที่มา & ข้อมูลอ้างอิง:
                      </span>
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        {activeArticleModal.source_name || 'บทความภายนอก'}
                      </span>
                    </div>

                    {activeArticleModal.source_url && (
                      <a
                        href={activeArticleModal.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline"
                        style={{
                          fontSize: '0.8rem',
                          padding: '0.35rem 0.85rem',
                          borderRadius: '999px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          textDecoration: 'none'
                        }}
                      >
                        <span>เปิดอ่านต้นฉบับ</span>
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer (Magic UI Style) */}
      <footer style={{ borderTop: '1px solid var(--border-divider)', padding: '2rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <span>© 2026 EXETIA. All rights reserved.</span>
          <span style={{ fontSize: '0.8rem' }}>พัฒนาด้วย ❤️ เพื่อการเรียนรู้ที่ดีกว่าของทุกคน</span>
        </div>
      </footer>
    </div>
  );
}
