import { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  Plus, 
  Search, 
  RefreshCw, 
  Edit3, 
  Trash2, 
  Pin, 
  CheckCircle2, 
  Clock, 
  FileText, 
  ExternalLink, 
  Save, 
  X, 
  Play,
  Image as ImageIcon
} from 'lucide-react';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { 
  getBlogs, 
  saveBlogPost, 
  deleteBlogPost, 
  formatBlogDate, 
  BLOG_CATEGORIES 
} from '../lib/blogs';

// Markdown renderer for live preview inside admin modal
function renderPreviewMarkdown(content) {
  if (!content) return <span style={{ color: 'var(--text-muted)' }}>ไม่มีเนื้อหา...</span>;

  const lines = content.split('\n');
  const elements = [];
  let inCode = false;
  let codeBuffer = [];

  const renderInline = (str) => {
    if (!str) return null;
    const mathParts = str.split('$');
    return mathParts.map((part, pIdx) => {
      if (pIdx % 2 === 1) {
        try {
          return <InlineMath key={`pmath-${pIdx}`} math={part} />;
        } catch {
          return <code key={`pmath-err-${pIdx}`}>${part}$</code>;
        }
      }
      return <span key={`ptxt-${pIdx}`}>{part}</span>;
    });
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('```')) {
      if (inCode) {
        elements.push(
          <pre key={`pre-${idx}`} style={{ background: 'var(--surface-hover)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.8rem', overflowX: 'auto' }}>
            <code>{codeBuffer.join('\n')}</code>
          </pre>
        );
        codeBuffer = [];
        inCode = false;
      } else {
        inCode = true;
      }
      return;
    }

    if (inCode) {
      codeBuffer.push(line);
      return;
    }

    if (trimmed.startsWith('### ')) {
      elements.push(<h4 key={idx} style={{ fontSize: '1.05rem', fontWeight: 700, margin: '1rem 0 0.35rem' }}>{renderInline(trimmed.slice(4))}</h4>);
      return;
    }
    if (trimmed.startsWith('## ')) {
      elements.push(<h3 key={idx} style={{ fontSize: '1.2rem', fontWeight: 800, margin: '1.25rem 0 0.45rem' }}>{renderInline(trimmed.slice(3))}</h3>);
      return;
    }
    if (trimmed.startsWith('# ')) {
      elements.push(<h2 key={idx} style={{ fontSize: '1.4rem', fontWeight: 800, margin: '1.5rem 0 0.5rem' }}>{renderInline(trimmed.slice(2))}</h2>);
      return;
    }
    if (trimmed.startsWith('> ')) {
      elements.push(<blockquote key={idx} style={{ borderLeft: '3px solid var(--accent)', margin: '0.75rem 0', padding: '0.25rem 0.75rem', color: 'var(--text-muted)' }}>{renderInline(trimmed.slice(2))}</blockquote>);
      return;
    }
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      elements.push(<li key={idx} style={{ marginLeft: '1rem', marginBottom: '0.2rem', fontSize: '0.875rem' }}>{renderInline(trimmed.slice(2))}</li>);
      return;
    }
    if (!trimmed) {
      elements.push(<div key={idx} style={{ height: '0.5rem' }} />);
      return;
    }
    elements.push(<p key={idx} style={{ margin: '0.35rem 0', lineHeight: 1.6, fontSize: '0.875rem' }}>{renderInline(trimmed)}</p>);
  });

  return elements;
}

export default function AdminBlogManager({ user, onOpenPublicBlog }) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all'); // all | published | draft | pinned

  // Editor Modal State
  const [editingBlog, setEditingBlog] = useState(null); // null = closed, object = open
  const [previewTab, setPreviewTab] = useState('write'); // 'write' | 'preview'
  const [saving, setSaving] = useState(false);

  // Delete Confirm Modal
  const [deleteConfirmBlog, setDeleteConfirmBlog] = useState(null);

  // Toast
  const [toast, setToast] = useState('');
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const loadBlogs = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      const data = await getBlogs({ includeDrafts: true });
      setBlogs(data);
    } catch (err) {
      console.error('Error loading blogs in admin:', err);
      showToast('โหลดข่าวสารไม่สำเร็จ ใช้ข้อมูลสำรอง');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  // Keyboard shortcut: Escape to close active modals
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (deleteConfirmBlog) setDeleteConfirmBlog(null);
        else if (editingBlog) setEditingBlog(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editingBlog, deleteConfirmBlog]);

  // Filtered
  const filteredBlogs = useMemo(() => {
    return blogs.filter((b) => {
      const matchCat = categoryFilter === 'all' || b.category === categoryFilter;
      const matchStatus = 
        statusFilter === 'all' ? true :
        statusFilter === 'published' ? b.published :
        statusFilter === 'draft' ? !b.published :
        statusFilter === 'pinned' ? b.pinned : true;

      const q = searchQuery.toLowerCase().trim();
      const matchQuery = !q ||
        b.title?.toLowerCase().includes(q) ||
        b.description?.toLowerCase().includes(q) ||
        b.content?.toLowerCase().includes(q) ||
        b.version_tag?.toLowerCase().includes(q);

      return matchCat && matchStatus && matchQuery;
    });
  }, [blogs, categoryFilter, statusFilter, searchQuery]);

  // Quick Stats
  const stats = useMemo(() => {
    return {
      total: blogs.length,
      published: blogs.filter((b) => b.published).length,
      drafts: blogs.filter((b) => !b.published).length,
      pinned: blogs.filter((b) => b.pinned).length
    };
  }, [blogs]);

  // Open New Blog Form
  const handleOpenNew = () => {
    setEditingBlog({
      id: '',
      title: '',
      slug: '',
      description: '',
      content: `### 🌟 สรุปใจความสำคัญ

เขียนเนื้อหาของข่าวสารหรือการอัปเดตที่นี่...

- **ประเด็นที่ 1**: รายละเอียดฟีเจอร์หรือการอัปเดต
- **ประเด็นที่ 2**: ข้อมูลเพิ่มเติมที่น่าสนใจ

---

### 💡 ข้อมูลเพิ่มเติม
สามารถใส่ข้อความเน้นย้ำ สูตรคณิตศาสตร์ $E=mc^2$ หรือบล็อกโค้ดได้ตามต้องการ`,
      category: 'feature',
      version_tag: '',
      author_name: user?.user_metadata?.nickname || user?.email?.split('@')[0] || 'EXETIA Team',
      author_avatar: user?.user_metadata?.avatar_emoji || '🚀',
      author_role: 'Admin / Core Team',
      cover_url: '',
      media_type: 'image',
      source_name: '',
      source_url: '',
      published: true,
      pinned: false,
      read_time: '2 นาที',
      published_at: new Date().toISOString()
    });
    setPreviewTab('write');
  };

  // Open Edit Form
  const handleOpenEdit = (blog) => {
    setEditingBlog({ ...blog });
    setPreviewTab('write');
  };

  // Save Blog (Insert or Update)
  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (!editingBlog.title.trim()) {
      showToast('กรุณาระบุหัวข้อข่าวสาร');
      return;
    }

    setSaving(true);
    try {
      const isNew = !editingBlog.id;
      await saveBlogPost(editingBlog);
      showToast(isNew ? 'สร้างโพสต์ข่าวสารใหม่เรียบร้อย' : 'บันทึกการแก้ไขข่าวสารสำเร็จ');
      setEditingBlog(null);
      await loadBlogs();
    } catch (err) {
      console.error('Save blog error:', err);
      showToast('เกิดข้อผิดพลาดในการบันทึก');
    } finally {
      setSaving(false);
    }
  };

  // Quick Toggle Published
  const handleTogglePublished = async (blog) => {
    const updated = { ...blog, published: !blog.published };
    try {
      await saveBlogPost(updated);
      showToast(updated.published ? 'เผยแพร่ข่าวนี้แล้ว' : 'เปลี่ยนเป็นฉบับร่างแล้ว');
      loadBlogs();
    } catch (err) {
      console.error('Toggle published error:', err);
      showToast('ไม่สามารถเปลี่ยนสถานะได้');
    }
  };

  // Quick Toggle Pinned
  const handleTogglePinned = async (blog) => {
    const updated = { ...blog, pinned: !blog.pinned };
    try {
      await saveBlogPost(updated);
      showToast(updated.pinned ? 'ปักหมุดข่าวนี้แล้ว' : 'ยกเลิกการปักหมุดแล้ว');
      loadBlogs();
    } catch (err) {
      console.error('Toggle pinned error:', err);
      showToast('ไม่สามารถเปลี่ยนสถานะปักหมุดได้');
    }
  };

  // Confirm Delete
  const handleDelete = async () => {
    if (!deleteConfirmBlog) return;
    const targetId = deleteConfirmBlog.id;
    try {
      // 1. Instant optimistic UI update
      setBlogs(prev => prev.filter(b => String(b.id) !== String(targetId)));
      setDeleteConfirmBlog(null);
      showToast('ลบข่าวสารเรียบร้อย');

      // 2. Delete from LocalStorage and Supabase
      const res = await deleteBlogPost(targetId);
      if (res && res.error) {
        showToast('ข้อผิดพลาดจากฐานข้อมูล: ' + res.error);
      }

      // 3. Refresh list to ensure consistency
      await loadBlogs();
    } catch (err) {
      console.error('Delete blog error:', err);
      showToast('ไม่สามารถลบข่าวสารได้');
      await loadBlogs();
    }
  };

  // Markdown Quick Insert Toolbar
  const insertFormatting = (prefix, suffix = '') => {
    const textarea = document.getElementById('admin-blog-textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const oldText = textarea.value;
    const selected = oldText.substring(start, end);

    const newText = oldText.substring(0, start) + prefix + selected + suffix + oldText.substring(end);
    setEditingBlog(prev => ({ ...prev, content: newText }));

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 50);
  };

  return (
    <div className="admin-blog-manager animate-fade-in">
      <style>{`
        .admin-blog-stat-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .admin-blog-stat-card {
          background: var(--surface);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 1.25rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .admin-blog-stat-card:hover {
          transform: translateY(-2px);
          border-color: var(--accent);
          box-shadow: 0 8px 24px rgba(0,0,0,0.06);
        }
        .admin-blog-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
          margin-bottom: 1.5rem;
        }
        .admin-blog-table {
          width: 100%;
          border-collapse: collapse;
        }
        .admin-blog-table th {
          text-align: left;
          padding: 0.85rem 1rem;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--text-muted);
          border-bottom: 1px solid var(--border-color);
          background: var(--surface-hover);
        }
        .admin-blog-table td {
          padding: 1rem;
          border-bottom: 1px solid var(--border-color);
          font-size: 0.875rem;
          vertical-align: middle;
        }
        .admin-blog-table tr:hover {
          background: var(--surface-hover);
        }
        .admin-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.25rem;
        }
        .admin-modal-dialog {
          background: var(--surface);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          max-width: 880px;
          width: 100%;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.4);
        }
        .admin-modal-header {
          padding: 1.15rem 1.5rem;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--surface);
          flex-shrink: 0;
        }
        .admin-modal-body {
          padding: 1.5rem;
          overflow-y: auto;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .admin-modal-footer {
          padding: 1rem 1.5rem;
          border-top: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--surface);
          flex-shrink: 0;
        }
        .admin-form-group {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .admin-label {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--text);
        }
        .admin-input {
          width: 100%;
          padding: 0.55rem 0.75rem;
          border-radius: 8px;
          border: 1px solid var(--border-color);
          background: var(--bg);
          color: var(--text);
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .admin-input:focus {
          border-color: var(--accent);
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
        }
      `}</style>

      {/* Toast Alert (Fixed to bottom-right of screen) */}
      {toast && typeof document !== 'undefined' && createPortal(
        <div 
          role="status"
          aria-live="polite"
          style={{
            position: 'fixed',
            bottom: '1.5rem',
            right: '1.5rem',
            background: 'var(--text)',
            color: 'var(--bg)',
            padding: '0.75rem 1.25rem',
            borderRadius: '10px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.25)',
            zIndex: 999999,
            fontWeight: 600,
            fontSize: '0.875rem',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            letterSpacing: '-0.2px',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          {toast}
        </div>,
        document.body
      )}

      {/* Section Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, letterSpacing: '-0.5px' }}>
              จัดการข่าวสาร & บล็อก (Blog & Changelog)
            </h1>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
              fontSize: '0.6875rem', fontWeight: 600, color: '#10b981',
              background: 'rgba(16,185,129,0.1)', padding: '0.15rem 0.5rem', borderRadius: '999px'
            }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#10b981' }} />
              Live Sync
            </span>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>
            เขียนและจัดการไทม์ไลน์ข่าวสาร อัปเดตฟีเจอร์ใหม่ และประกาศสำหรับผู้ใช้งาน EXETIA
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {onOpenPublicBlog && (
            <button 
              className="btn btn-outline"
              onClick={onOpenPublicBlog}
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.875rem' }}
            >
              <ExternalLink size={15} />
              <span>เปิดดูหน้าข่าวสารจริง</span>
            </button>
          )}

          <button 
            className="btn btn-primary"
            onClick={handleOpenNew}
            style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem' }}
          >
            <Plus size={16} />
            <span>สร้างข่าวสารใหม่</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Metric Panels */}
      <div className="admin-blog-stat-grid">
        <div 
          className="admin-blog-stat-card"
          onClick={() => setStatusFilter('all')}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 500 }}>ข่าวทั้งหมด</span>
            <FileText size={18} color="var(--accent)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{stats.total}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>รวมฉบับร่าง & เผยแพร่</div>
        </div>

        <div 
          className="admin-blog-stat-card"
          onClick={() => setStatusFilter('published')}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 500 }}>เผยแพร่แล้ว (Live)</span>
            <CheckCircle2 size={18} color="#10b981" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10b981' }}>{stats.published}</div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.25rem' }}>แสดงบนหน้าเว็บทันที</div>
        </div>

        <div 
          className="admin-blog-stat-card"
          onClick={() => setStatusFilter('draft')}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 500 }}>ฉบับร่าง (Drafts)</span>
            <Clock size={18} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f59e0b' }}>{stats.drafts}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>ซ่อนจากสายตาผู้ใช้</div>
        </div>

        <div 
          className="admin-blog-stat-card"
          onClick={() => setStatusFilter('pinned')}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 500 }}>ปักหมุดข่าวเด่น</span>
            <Pin size={18} color="#8b5cf6" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#8b5cf6' }}>{stats.pinned}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>แสดงด้านบนสุดของไทม์ไลน์</div>
        </div>
      </div>

      {/* Toolbar: Search, Filters, Refresh */}
      <div className="admin-blog-toolbar">
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flex: 1, minWidth: '280px' }}>
          <div style={{
            position: 'relative', flex: 1, maxWidth: '380px',
            background: 'var(--surface)', border: '1px solid var(--border-color)',
            borderRadius: '8px', display: 'flex', alignItems: 'center', padding: '0 0.75rem'
          }}>
            <Search size={15} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="ค้นหาตามชื่อ, เนื้อหา, หรือเวอร์ชัน..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none', background: 'transparent', outline: 'none',
                padding: '0.5rem 0.5rem', fontSize: '0.85rem', color: 'var(--text)', width: '100%'
              }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={14} />
              </button>
            )}
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{
              padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)',
              background: 'var(--surface)', color: 'var(--text)', fontSize: '0.8125rem', outline: 'none'
            }}
          >
            <option value="all">ทุกหมวดหมู่</option>
            <option value="feature">✨ ฟีเจอร์ใหม่</option>
            <option value="exam">📚 ข้อสอบใหม่</option>
            <option value="system">⚡ อัปเดตระบบ</option>
            <option value="announcement">🔔 ประกาศ</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)',
              background: 'var(--surface)', color: 'var(--text)', fontSize: '0.8125rem', outline: 'none'
            }}
          >
            <option value="all">ทุกสถานะ</option>
            <option value="published">เผยแพร่แล้ว (Published)</option>
            <option value="draft">ฉบับร่าง (Drafts)</option>
            <option value="pinned">ปักหมุด (Pinned)</option>
          </select>
        </div>

        <button
          className="btn btn-outline"
          onClick={() => loadBlogs(true)}
          style={{ fontSize: '0.8125rem', padding: '0.45rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
        >
          <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
          <span>รีเฟรช</span>
        </button>
      </div>

      {/* Blog List Table / Container */}
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border-color)',
        borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
      }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--text-muted)' }}>
            <div className="animate-spin" style={{ display: 'inline-block', width: '28px', height: '28px', border: '3px solid var(--border-color)', borderTopColor: 'var(--accent)', borderRadius: '50%', marginBottom: '0.75rem' }} />
            <p style={{ margin: 0, fontSize: '0.875rem' }}>กำลังซิงค์ข้อมูลบล็อก...</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--text-muted)' }}>
            <FileText size={40} style={{ opacity: 0.4, margin: '0 auto 0.75rem' }} />
            <p style={{ fontWeight: 600, fontSize: '0.95rem', margin: '0 0 0.5rem' }}>ไม่พบรายการข่าวสาร</p>
            <button className="btn btn-primary" onClick={handleOpenNew} style={{ fontSize: '0.8125rem' }}>
              + เขียนข่าวสารแรก
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-blog-table">
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>สื่อ</th>
                  <th>หัวข้อ & รายละเอียด</th>
                  <th>หมวดหมู่</th>
                  <th>เวอร์ชัน</th>
                  <th>วันที่เผยแพร่</th>
                  <th>สถานะ</th>
                  <th>ปักหมุด</th>
                  <th style={{ textAlign: 'right' }}>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {filteredBlogs.map((b) => {
                  const catConfig = BLOG_CATEGORIES[b.category] || BLOG_CATEGORIES.feature;
                  const isVideo = b.media_type === 'video' || (b.cover_url && b.cover_url.endsWith('.mp4'));

                  return (
                    <tr key={b.id}>
                      {/* Media indicator */}
                      <td>
                        <div style={{
                          width: '36px', height: '36px', borderRadius: '8px', background: 'var(--surface-hover)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-color)',
                          overflow: 'hidden'
                        }}>
                          {b.cover_url ? (
                            isVideo ? <Play size={14} color="var(--accent)" /> : <ImageIcon size={14} color="#10b981" />
                          ) : (
                            <FileText size={14} color="var(--text-muted)" />
                          )}
                        </div>
                      </td>

                      {/* Title & Desc */}
                      <td style={{ maxWidth: '340px' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text)', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                          <span>{b.title}</span>
                          {b.source_name && (
                            <span style={{
                              fontSize: '0.6875rem', fontWeight: 500, color: 'var(--text-muted)',
                              background: 'var(--surface-hover)', border: '1px solid var(--border-color)',
                              padding: '0.1rem 0.45rem', borderRadius: '4px'
                            }}>
                              🔗 {b.source_name}
                            </span>
                          )}
                        </div>
                        <div style={{
                          fontSize: '0.75rem', color: 'var(--text-muted)',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                        }}>
                          {b.description || 'ไม่มีคำโปรย'}
                        </div>
                      </td>

                      {/* Category */}
                      <td>
                        <span style={{
                          fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.55rem',
                          borderRadius: '999px', background: catConfig.bg, color: catConfig.color
                        }}>
                          {catConfig.label}
                        </span>
                      </td>

                      {/* Version */}
                      <td>
                        <span style={{
                          fontFamily: 'monospace', fontSize: '0.75rem',
                          background: 'rgba(0,112,243,0.1)', color: 'var(--accent)',
                          padding: '0.1rem 0.45rem', borderRadius: '4px'
                        }}>
                          {b.version_tag || '-'}
                        </span>
                      </td>

                      {/* Date */}
                      <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                        {formatBlogDate(b.published_at || b.created_at)}
                      </td>

                      {/* Status Toggle */}
                      <td>
                        <button
                          onClick={() => handleTogglePublished(b)}
                          style={{
                            background: b.published ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                            color: b.published ? '#10b981' : '#f59e0b',
                            border: `1px solid ${b.published ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                            padding: '0.2rem 0.55rem', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 600,
                            cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.25rem'
                          }}
                          title="คลิกเพื่อสลับสถานะ"
                        >
                          {b.published ? <CheckCircle2 size={11} /> : <Clock size={11} />}
                          <span>{b.published ? 'เผยแพร่' : 'แบบร่าง'}</span>
                        </button>
                      </td>

                      {/* Pinned Toggle */}
                      <td>
                        <button
                          onClick={() => handleTogglePinned(b)}
                          style={{
                            background: b.pinned ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                            color: b.pinned ? '#8b5cf6' : 'var(--text-muted)',
                            border: b.pinned ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid var(--border-color)',
                            padding: '0.2rem 0.55rem', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 600,
                            cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.25rem'
                          }}
                          title="คลิกเพื่อปักหมุด"
                        >
                          <Pin size={11} />
                          <span>{b.pinned ? 'ปักหมุด' : 'ปกติ'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                          <button
                            onClick={() => handleOpenEdit(b)}
                            className="btn btn-outline"
                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                            title="แก้ไขโพสต์"
                          >
                            <Edit3 size={13} />
                            <span>แก้ไข</span>
                          </button>
                          <button
                            onClick={() => setDeleteConfirmBlog(b)}
                            className="btn btn-outline"
                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', color: 'var(--error)' }}
                            title="ลบโพสต์"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ========================================================== */}
      {/* BLOG EDITOR MODAL                                          */}
      {/* ========================================================== */}
      {/* ========================================================== */}
      {/* BLOG EDITOR MODAL (Portaled to document.body)              */}
      {/* ========================================================== */}
      {editingBlog && typeof document !== 'undefined' && createPortal(
        <div 
          className="admin-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditingBlog(null);
          }}
        >
          <div 
            className="admin-modal-dialog animate-fade-in"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-modal-title"
          >
            {/* Modal Header */}
            <div className="admin-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  background: 'rgba(59, 130, 246, 0.12)', color: 'var(--accent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Edit3 size={18} />
                </div>
                <div>
                  <h3 id="admin-modal-title" style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
                    {editingBlog.id ? 'แก้ไขโพสต์ข่าวสาร' : 'สร้างโพสต์ข่าวสารใหม่'}
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    รองรับ Markdown, KaTeX สูตรคณิตศาสตร์, รูปภาพ และวิดีโอ MP4
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setEditingBlog(null)}
                style={{
                  background: 'transparent', border: 'none', color: 'var(--text-muted)',
                  cursor: 'pointer', padding: '0.4rem', borderRadius: '8px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
                title="ปิด (Esc)"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', margin: 0 }}>
              <div className="admin-modal-body">
                
                {/* Section 1: ข้อมูลหลัก */}
                <div className="admin-form-group">
                  <label className="admin-label">
                    หัวข้อข่าวสาร (Title) <span style={{ color: 'var(--error)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingBlog.title}
                    onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })}
                    placeholder="เช่น เปิดตัวฟีเจอร์ใหม่ หรือ อัปเดตคลังข้อสอบ..."
                    className="admin-input"
                    style={{ fontSize: '1rem', fontWeight: 600, padding: '0.65rem 0.85rem' }}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">
                    URL Slug (เว้นว่างไว้ระบบจะสร้างให้อัตโนมัติ)
                  </label>
                  <input
                    type="text"
                    value={editingBlog.slug}
                    onChange={(e) => setEditingBlog({ ...editingBlog, slug: e.target.value })}
                    placeholder="เช่น examhub-new-feature"
                    className="admin-input"
                    style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}
                  />
                </div>

                {/* 3-Col Meta: Category, Version, Read time */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem' }}>
                  <div className="admin-form-group">
                    <label className="admin-label">หมวดหมู่ (Category)</label>
                    <select
                      value={editingBlog.category}
                      onChange={(e) => setEditingBlog({ ...editingBlog, category: e.target.value })}
                      className="admin-input"
                    >
                      <option value="feature">✨ ฟีเจอร์ใหม่ (Feature)</option>
                      <option value="exam">📚 ข้อสอบใหม่ (New Exam)</option>
                      <option value="system">⚡ อัปเดตระบบ (System)</option>
                      <option value="announcement">🔔 ประกาศ (Announcement)</option>
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">เวอร์ชัน Tag (ถ้ามี)</label>
                    <input
                      type="text"
                      value={editingBlog.version_tag || ''}
                      onChange={(e) => setEditingBlog({ ...editingBlog, version_tag: e.target.value })}
                      placeholder="เช่น v1.5.0"
                      className="admin-input"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">เวลาในการอ่านโดยประมาณ</label>
                    <input
                      type="text"
                      value={editingBlog.read_time || ''}
                      onChange={(e) => setEditingBlog({ ...editingBlog, read_time: e.target.value })}
                      placeholder="เช่น 2 นาที"
                      className="admin-input"
                    />
                  </div>
                </div>

                {/* Author Info */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem' }}>
                  <div className="admin-form-group">
                    <label className="admin-label">ชื่อผู้เขียน (Author Name)</label>
                    <input
                      type="text"
                      value={editingBlog.author_name || ''}
                      onChange={(e) => setEditingBlog({ ...editingBlog, author_name: e.target.value })}
                      placeholder="EXETIA Team"
                      className="admin-input"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">อิโมจิประจำตัวผู้เขียน</label>
                    <input
                      type="text"
                      value={editingBlog.author_avatar || ''}
                      onChange={(e) => setEditingBlog({ ...editingBlog, author_avatar: e.target.value })}
                      placeholder="🚀, 🎓, ⚡"
                      className="admin-input"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">บทบาท/ตำแหน่งผู้เขียน</label>
                    <input
                      type="text"
                      value={editingBlog.author_role || ''}
                      onChange={(e) => setEditingBlog({ ...editingBlog, author_role: e.target.value })}
                      placeholder="Admin / Core Team"
                      className="admin-input"
                    />
                  </div>
                </div>

                {/* Cover Media & Media Type */}
                <div className="admin-form-group">
                  <label className="admin-label">URL สื่อประกอบหน้าปก (รูปภาพ หรือ วิดีโอ MP4)</label>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <input
                      type="url"
                      value={editingBlog.cover_url || ''}
                      onChange={(e) => {
                        const url = e.target.value;
                        const isVid = url.endsWith('.mp4') || url.endsWith('.webm');
                        setEditingBlog({
                          ...editingBlog,
                          cover_url: url,
                          media_type: isVid ? 'video' : (editingBlog.media_type === 'none' ? 'image' : editingBlog.media_type)
                        });
                      }}
                      placeholder="https://images.unsplash.com/... หรือ https://cdn.magicui.design/blog-demo.mp4"
                      className="admin-input"
                      style={{ flex: 1, minWidth: '220px' }}
                    />
                    <select
                      value={editingBlog.media_type || 'image'}
                      onChange={(e) => setEditingBlog({ ...editingBlog, media_type: e.target.value })}
                      className="admin-input"
                      style={{ width: 'auto', minWidth: '150px' }}
                    >
                      <option value="image">รูปภาพ (Image)</option>
                      <option value="video">วิดีโอวนซ้ำ (Video MP4)</option>
                      <option value="none">ไม่ใส่สื่อ</option>
                    </select>
                  </div>

                  {editingBlog.cover_url && editingBlog.media_type !== 'none' && (
                    <div style={{
                      marginTop: '0.5rem', padding: '0.5rem 0.75rem', borderRadius: '10px',
                      background: 'var(--surface-hover)', border: '1px solid var(--border-color)',
                      display: 'flex', alignItems: 'center', gap: '0.75rem'
                    }}>
                      {editingBlog.media_type === 'video' ? (
                        <video
                          src={editingBlog.cover_url}
                          autoPlay loop muted playsInline
                          style={{ width: '70px', height: '44px', objectFit: 'cover', borderRadius: '6px', background: '#000' }}
                        />
                      ) : (
                        <img
                          src={editingBlog.cover_url}
                          alt="Preview"
                          style={{ width: '70px', height: '44px', objectFit: 'cover', borderRadius: '6px', background: 'var(--bg)' }}
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      )}
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        <strong>พรีวิวสื่อ:</strong> ลิงก์เชื่อมต่อถูกต้องและพร้อมแสดงผล
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="admin-form-group">
                  <label className="admin-label">คำโปรยสั้น (Description / Excerpt)</label>
                  <textarea
                    rows={2}
                    value={editingBlog.description || ''}
                    onChange={(e) => setEditingBlog({ ...editingBlog, description: e.target.value })}
                    placeholder="สรุปเนื้อหาสั้นๆ 1-2 บรรทัด เพื่อแสดงบนการ์ดในหน้าข่าวสาร..."
                    className="admin-input"
                    style={{ resize: 'vertical', lineHeight: 1.5 }}
                  />
                </div>

                {/* Source Name & URL */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.85rem' }}>
                  <div className="admin-form-group">
                    <label className="admin-label">ชื่อแหล่งที่มา / อ้างอิง (Source Name)</label>
                    <input
                      type="text"
                      value={editingBlog.source_name || ''}
                      onChange={(e) => setEditingBlog({ ...editingBlog, source_name: e.target.value })}
                      placeholder="เช่น AWS Blog, Facebook ภาควิชา, GitHub"
                      className="admin-input"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">ลิงก์ต้นทาง / URL อ้างอิง (Source URL)</label>
                    <input
                      type="url"
                      value={editingBlog.source_url || ''}
                      onChange={(e) => setEditingBlog({ ...editingBlog, source_url: e.target.value })}
                      placeholder="https://example.com/original-news"
                      className="admin-input"
                    />
                  </div>
                </div>

                {/* Toggles */}
                <div style={{
                  display: 'flex', gap: '1.25rem', flexWrap: 'wrap',
                  padding: '0.75rem 1rem', borderRadius: '10px',
                  background: 'var(--surface-hover)', border: '1px solid var(--border-color)'
                }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                    <input
                      type="checkbox"
                      checked={editingBlog.published}
                      onChange={(e) => setEditingBlog({ ...editingBlog, published: e.target.checked })}
                      style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                    <span style={{ fontWeight: 500 }}>เผยแพร่ทันที (Published)</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                    <input
                      type="checkbox"
                      checked={editingBlog.pinned}
                      onChange={(e) => setEditingBlog({ ...editingBlog, pinned: e.target.checked })}
                      style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                    <span style={{ fontWeight: 500 }}>ปักหมุดข่าวเด่น (Pinned)</span>
                  </label>
                </div>

                {/* Markdown Content Editor */}
                <div style={{ marginTop: '0.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <button
                        type="button"
                        onClick={() => setPreviewTab('write')}
                        className={`btn ${previewTab === 'write' ? 'btn-primary' : 'btn-outline'}`}
                        style={{ padding: '0.35rem 0.85rem', fontSize: '0.775rem' }}
                      >
                        ✏️ เขียนเนื้อหา (Markdown)
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewTab('preview')}
                        className={`btn ${previewTab === 'preview' ? 'btn-primary' : 'btn-outline'}`}
                        style={{ padding: '0.35rem 0.85rem', fontSize: '0.775rem' }}
                      >
                        👁️ ดูตัวอย่างสด (Live Preview)
                      </button>
                    </div>

                    {previewTab === 'write' && (
                      <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                        <button type="button" onClick={() => insertFormatting('### ')} className="btn btn-outline" style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem' }}>H3</button>
                        <button type="button" onClick={() => insertFormatting('**', '**')} className="btn btn-outline" style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem', fontWeight: 700 }}>B</button>
                        <button type="button" onClick={() => insertFormatting('*', '*')} className="btn btn-outline" style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem', fontStyle: 'italic' }}>I</button>
                        <button type="button" onClick={() => insertFormatting('- ')} className="btn btn-outline" style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem' }}>List</button>
                        <button type="button" onClick={() => insertFormatting('`', '`')} className="btn btn-outline" style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem', fontFamily: 'monospace' }}>Code</button>
                        <button type="button" onClick={() => insertFormatting('> ')} className="btn btn-outline" style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem' }}>Quote</button>
                        <button type="button" onClick={() => insertFormatting('$', '$')} className="btn btn-outline" style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem' }}>KaTeX</button>
                      </div>
                    )}
                  </div>

                  {previewTab === 'write' ? (
                    <textarea
                      id="admin-blog-textarea"
                      rows={12}
                      value={editingBlog.content}
                      onChange={(e) => setEditingBlog({ ...editingBlog, content: e.target.value })}
                      className="admin-input"
                      style={{
                        minHeight: '260px',
                        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                        fontSize: '0.875rem',
                        lineHeight: 1.6,
                        resize: 'vertical'
                      }}
                      placeholder="เขียนเนื้อหาแบบ Markdown ที่นี่..."
                    />
                  ) : (
                    <div style={{
                      minHeight: '260px', padding: '1.25rem', borderRadius: '8px',
                      border: '1px solid var(--border-color)', background: 'var(--bg)',
                      overflowY: 'auto', lineHeight: 1.6
                    }}>
                      {renderPreviewMarkdown(editingBlog.content)}
                    </div>
                  )}
                </div>

              </div>

              {/* Modal Footer */}
              <div className="admin-modal-footer">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: '0.75rem', fontWeight: 600,
                    padding: '0.25rem 0.65rem', borderRadius: '999px',
                    background: editingBlog.published ? 'rgba(16, 185, 129, 0.12)' : 'rgba(234, 179, 8, 0.12)',
                    color: editingBlog.published ? '#10b981' : '#eab308'
                  }}>
                    {editingBlog.published ? '● เผยแพร่แล้ว' : '○ ฉบับร่าง (Draft)'}
                  </span>
                  {editingBlog.pinned && (
                    <span style={{
                      fontSize: '0.75rem', fontWeight: 600,
                      padding: '0.25rem 0.65rem', borderRadius: '999px',
                      background: 'rgba(59, 130, 246, 0.12)', color: '#3b82f6'
                    }}>
                      ปักหมุด
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => setEditingBlog(null)}
                    style={{ padding: '0.5rem 1.1rem', fontSize: '0.85rem' }}
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving}
                    style={{ padding: '0.5rem 1.35rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <Save size={16} />
                    <span>{saving ? 'กำลังบันทึก...' : (editingBlog.id ? 'บันทึกการแก้ไข' : 'สร้างข่าวสาร')}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ========================================================== */}
      {/* DELETE CONFIRM MODAL (Portaled to document.body)            */}
      {/* ========================================================== */}
      {deleteConfirmBlog && typeof document !== 'undefined' && createPortal(
        <div 
          className="admin-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setDeleteConfirmBlog(null);
          }}
        >
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border-color)',
            borderRadius: '16px', maxWidth: '420px', width: '100%', padding: '1.75rem', textAlign: 'center',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.35)'
          }} className="animate-fade-in">
            <Trash2 size={40} color="var(--error)" style={{ margin: '0 auto 1rem', opacity: 0.8 }} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              ยืนยันการลบข่าวสาร?
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              ต้องการลบโพสต์ <strong>"{deleteConfirmBlog.title}"</strong> ใช่หรือไม่? การกระทำนี้ไม่สามารถยกเลิกได้
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                className="btn btn-outline"
                onClick={() => setDeleteConfirmBlog(null)}
              >
                ยกเลิก
              </button>
              <button
                className="btn btn-primary"
                style={{ background: 'var(--error)', borderColor: 'var(--error)', color: '#fff' }}
                onClick={handleDelete}
              >
                ยืนยันลบข่าว
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
