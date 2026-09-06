import { supabase } from './supabase';

export const BLOG_CATEGORIES = {
  all: { label: 'ทั้งหมด', color: 'var(--accent)', bg: 'rgba(0, 112, 243, 0.1)' },
  feature: { label: 'ฟีเจอร์ใหม่', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' },
  exam: { label: 'ข้อสอบใหม่', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
  system: { label: 'อัปเดตระบบ', color: '#0070f3', bg: 'rgba(0, 112, 243, 0.1)' },
  announcement: { label: 'ประกาศ', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' }
};

export const INITIAL_BLOGS = [
  {
    id: 'dw-advanced-60q-release',
    slug: 'dw-advanced-60q-release',
    title: 'เพิ่มชุดข้อสอบใหม่: DW Advanced Comprehensive Exam (60 ข้อ)',
    description: 'รวบรวมแนวข้อสอบวิชา Data Warehousing ระดับชั้นปีที่ 3 ครอบคลุม 3NF, Dimensional Model, Surrogate Keys, SCD Type 1-6 พร้อมตัดช้อยส์ลวงที่เดาง่ายออก',
    category: 'exam',
    version_tag: 'v1.4.2',
    author_name: 'Data Team',
    author_avatar: '📊',
    author_role: 'Curriculum Lead',
    cover_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    media_type: 'image',
    source_name: 'EXETIA Curriculum',
    source_url: '',
    published: true,
    pinned: false,
    read_time: '3 นาที',
    published_at: '2026-09-01T10:30:00.000Z',
    content: `### 🎯 ต้อนรับสอบปลายภาคด้วยคลังข้อสอบ DW คุณภาพสูง

ทีมงานได้เพิ่มชุดข้อสอบใหม่ล่าสุด **Data Warehouse Hard (60 ข้อ)** เพื่อให้นักศึกษาชั้นปีที่ 3 ได้ฝึกทำโจทย์ที่มีระดับความยากและซับซ้อนใกล้เคียงข้อสอบจริงมากที่สุด

### 📌 ประเด็นสำคัญที่ครอบคลุมในชุดนี้:

1. **สถาปัตยกรรม Data Warehouse**: เปรียบเทียบความแตกต่างเชิงลึกระหว่าง *Inmon (Corporate Information Factory)* และ *Kimball (Dimensional Data Warehouse)*
2. **Dimensional Modeling**: การออกแบบ Star Schema, Snowflake Schema, Fact Table Granularity และ Conformed Dimensions
3. **Surrogate Key vs Natural Key**: เหตุผลและความสำคัญในการใช้ Surrogate Key ในมิติข้อมูล
4. **Slowly Changing Dimensions (SCD)**: ตัวอย่างสถานการณ์จริงของการจัดการ Type 1, 2, 3, 4, และ 6
5. **Hierarchies & Traps**: การรับมือกับ Ragged, Unbalanced Hierarchies และ Chasm Trap ใน Data Warehouse

> **💡 เคล็ดลับการทำข้อสอบ**: ข้อสอบชุดนี้ไม่มีช้อยส์ลวงแบบ "ถูกทุกข้อ" หรือ "ไม่มีข้อใดถูก" ทุกตัวเลือกถูกออกแบบมาเพื่อทดสอบความเข้าใจแก่นทฤษฎีอย่างแท้จริง ขอให้ทุกคนตั้งใจอ่านโจทย์และทบทวนให้ดีครับ!`
  },
  {
    id: 'aws-cloud-exam-update',
    slug: 'aws-cloud-exam-update',
    title: 'อัปเกรดข้อสอบ AWS Cloud Analytics & Architecture สู่ 62 ข้อ',
    description: 'เพิ่มข้อสอบเข้มข้นเกี่ยวกับ S3 Intelligent-Tiering, DynamoDB Global Tables, VPC NAT Gateway และ Predictive Auto Scaling',
    category: 'exam',
    version_tag: 'v1.4.0',
    author_name: 'Cloud Instructor',
    author_avatar: '☁️',
    author_role: 'Cloud Architect',
    cover_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    media_type: 'image',
    source_name: 'AWS Architecture Blog',
    source_url: 'https://aws.amazon.com/blogs/architecture/',
    published: true,
    pinned: false,
    read_time: '2 นาที',
    published_at: '2026-08-25T09:00:00.000Z',
    content: `### 🚀 เจาะลึก Cloud Solution Architecture ให้แม่นยำยิ่งขึ้น

ข้อสอบชุด **AWS Cloud Analytics & Architecture** ได้รับการปรับปรุงครั้งใหญ่ โดยเพิ่มคำถามแนววิเคราะห์เชิงลึกอีก 5 ข้อ พร้อมปรับช้อยส์ลวงให้สมจริงตามมาตรฐาน AWS Certified Solutions Architect

### 🔑 หัวข้อข้อสอบที่เพิ่มเข้ามาใหม่:

- **S3 Storage Optimization**: เจาะลึกการเลือก Tier ด้วย *S3 Intelligent-Tiering* vs *Lifecycle Policies* สำหรับข้อมูลที่มี Pattern การเข้าถึงไม่แน่นอน
- **High Availability & Low Latency**: การคอนฟิก *DynamoDB Global Tables* แบบ Multi-Region Active-Active
- **Networking & Security**: การทำความเข้าใจโครงสร้าง VPC Subnet, Route Tables, Internet Gateway และ NAT Gateway
- **Scalability**: การใช้งาน *Predictive Scaling* ร่วมกับ Target Tracking Scaling Policies บน EC2 Auto Scaling Groups

สามารถเข้าไปฝึกทำได้แล้ววันนี้ในคลังข้อสอบหมวดหมู่ **Cloud Technology Infrastructure** ครับ!`
  }
];

const LOCAL_STORAGE_KEY = 'examhub_blog_posts';
const DELETED_STORAGE_KEY = 'examhub_deleted_blog_ids';

export function getDeletedBlogIds() {
  try {
    const raw = localStorage.getItem(DELETED_STORAGE_KEY);
    return new Set(raw ? JSON.parse(raw).map(String) : []);
  } catch {
    return new Set();
  }
}

export function addDeletedBlogId(id) {
  try {
    const strId = String(id);
    const deleted = getDeletedBlogIds();
    deleted.add(strId);
    localStorage.setItem(DELETED_STORAGE_KEY, JSON.stringify(Array.from(deleted)));
  } catch (e) {
    console.warn('Failed to record deleted blog id:', e);
  }
}

export function removeDeletedBlogId(id) {
  try {
    const strId = String(id);
    const deleted = getDeletedBlogIds();
    deleted.delete(strId);
    localStorage.setItem(DELETED_STORAGE_KEY, JSON.stringify(Array.from(deleted)));
  } catch (e) {
    console.warn('Failed to unmark deleted blog id:', e);
  }
}

/**
 * Fetch all blogs from Supabase or fallback to LocalStorage/Default
 */
export async function getBlogs({ includeDrafts = false } = {}) {
  const deletedIds = getDeletedBlogIds();

  // 1. Fetch from Supabase
  let dbBlogs = null;
  try {
    let query = supabase.from('blogs').select('*').order('published_at', { ascending: false });
    if (!includeDrafts) {
      query = query.eq('published', true);
    }
    const { data, error } = await query;
    if (!error && Array.isArray(data)) {
      dbBlogs = data;
      // Sync fresh data to localStorage for offline access
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
      } catch (e) {
        console.warn('LocalStorage save error:', e);
      }
    }
  } catch (err) {
    console.warn('Supabase blogs fetch error (fallback to local storage):', err);
  }

  // 2. Authoritative list resolution
  let allList = [];
  if (dbBlogs !== null) {
    // Supabase connected: Database is the authoritative source of truth!
    allList = dbBlogs.filter((b) => !deletedIds.has(String(b.id)));
  } else {
    // Offline fallback: Use LocalStorage, then INITIAL_BLOGS
    let localBlogs = [];
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (raw) localBlogs = JSON.parse(raw);
    } catch {}

    if (localBlogs.length > 0) {
      allList = localBlogs.filter((b) => !deletedIds.has(String(b.id)));
    } else {
      allList = INITIAL_BLOGS.filter((b) => !deletedIds.has(String(b.id)));
    }
  }

  if (!includeDrafts) {
    allList = allList.filter((b) => b.published !== false);
  }

  // Sort: pinned first, then by published_at desc
  allList.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.published_at || b.created_at || 0) - new Date(a.published_at || a.created_at || 0);
  });

  return allList;
}

/**
 * Save a blog post (Create or Update)
 */
export async function saveBlogPost(blog) {
  const now = new Date().toISOString();
  const preparedBlog = {
    ...blog,
    id: blog.id || `blog-${Date.now()}`,
    slug: blog.slug || (blog.title || 'post').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `post-${Date.now()}`,
    source_name: (blog.source_name || '').trim(),
    source_url: (blog.source_url || '').trim(),
    updated_at: now,
    published_at: blog.published_at || now,
    created_at: blog.created_at || now
  };

  // Remove from deleted list if it was previously marked as deleted
  removeDeletedBlogId(preparedBlog.id);

  // 1. Save to local storage for instant offline availability
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    let localList = raw ? JSON.parse(raw) : [];
    const idx = localList.findIndex((b) => String(b.id) === String(preparedBlog.id));
    if (idx >= 0) {
      localList[idx] = preparedBlog;
    } else {
      localList.unshift(preparedBlog);
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localList));
  } catch (e) {
    console.warn('Failed to cache blog locally:', e);
  }

  // 2. Sync to Supabase
  let savedData = preparedBlog;
  try {
    const { data, error } = await supabase
      .from('blogs')
      .upsert(preparedBlog, { onConflict: 'id' })
      .select()
      .single();

    if (!error && data) {
      savedData = data;
    }
  } catch (err) {
    console.warn('Supabase upsert blog warning:', err);
  }

  // 3. Dispatch change event
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('exetia-blogs-changed', { detail: { savedBlog: savedData } }));
  }

  return { success: true, data: savedData };
}

/**
 * Delete a blog post
 */
export async function deleteBlogPost(id) {
  if (!id) return { success: false };
  const strId = String(id);

  // 1. Permanently record as deleted so it never resurrects locally
  addDeletedBlogId(strId);

  // 2. Remove from local storage
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const localList = JSON.parse(raw).filter((b) => String(b.id) !== strId);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localList));
    }
  } catch (e) {
    console.warn('LocalStorage blog delete error:', e);
  }

  // 3. Remove from Supabase
  let supabaseError = null;
  try {
    const { error } = await supabase.from('blogs').delete().eq('id', strId);
    if (error) {
      console.warn('Supabase delete error:', error);
      supabaseError = error.message;
    }
  } catch (err) {
    console.warn('Supabase delete blog warning:', err);
    supabaseError = err.message;
  }

  // 4. Notify app components that blogs have changed
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('exetia-blogs-changed', { detail: { deletedId: strId } }));
  }

  return { success: !supabaseError, error: supabaseError };
}

/**
 * Format date for display
 */
export function formatBlogDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;

  const monthsTh = [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
    'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
  ];

  const day = d.getDate();
  const month = monthsTh[d.getMonth()];
  const year = d.getFullYear() + 543; // Buddhist Era

  return `${day} ${month} ${year}`;
}
