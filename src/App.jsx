import { useState, useEffect, useCallback, useRef, lazy, Suspense } from 'react';
import Landing from './components/Landing';
import PageLoader from './components/PageLoader';

// Every view except the landing page is split into its own chunk and loaded on demand,
// so heavy libraries (KaTeX, Recharts) and the admin tools stay out of the first load.
const AboutUs = lazy(() => import('./components/AboutUs'));
const FAQ = lazy(() => import('./components/FAQ'));
const Home = lazy(() => import('./components/Home'));
const Exam = lazy(() => import('./components/Exam'));
const ExamIntro = lazy(() => import('./components/ExamIntro'));
const Pattern = lazy(() => import('./components/Pattern').then((m) => ({ default: m.Pattern })));
const Schedule = lazy(() => import('./components/Schedule'));
const Login = lazy(() => import('./components/Login'));
const ResetPassword = lazy(() => import('./components/ResetPassword'));
const ScoreHistory = lazy(() => import('./components/ScoreHistory'));
const Report = lazy(() => import('./components/Report'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const UserSettings = lazy(() => import('./components/UserSettings'));
const TermsOfService = lazy(() => import('./components/TermsOfService'));
const Blog = lazy(() => import('./components/Blog'));
import PWAInstallPrompt from './components/PWAInstallPrompt';
import { Sun, Moon, LogIn, LogOut, History as HistoryIcon, AlertTriangle, Menu, ShieldAlert, User, ChevronRight, Search } from 'lucide-react';
import Sidebar from './components/shell/Sidebar';
import CommandMenu from './components/shell/CommandMenu';
import GateState from './components/shell/GateState';
import { supabase, checkIsAdmin } from './lib/supabase';
import { getVisibleSubjects, isAdminPractice } from './lib/adminPractice';
import { loadExamCatalog, loadExam } from './lib/examRepository';
import './index.css';

const getViewFromPath = (pathname) => {
  const path = (pathname || '').toLowerCase().replace(/\/$/, '') || '/';
  if (path === '/' || path === '/landing' || path === '/landingpage') return 'landing';
  if (path === '/home') return 'home';
  if (path === '/blog' || path === '/news' || path === '/changelog' || path === '/updates') return 'blog';
  if (path === '/about' || path === '/aboutus') return 'about';
  if (path === '/faq' || path === '/faqs' || path === '/help') return 'faq';
  if (path === '/terms' || path === '/termsofservice' || path === '/privacy') return 'terms';
  if (path === '/login') return 'login';
  if (path === '/reset-password' || path === '/resetpassword') return 'reset-password';
  if (path === '/schedule') return 'schedule';
  if (path === '/history') return 'history';
  if (path === '/report') return 'report';
  if (path === '/settings') return 'settings';
  if (path === '/admin' || path === '/admin_reports') return 'admin_reports';
  return 'landing';
};

const getPathFromView = (view) => {
  switch (view) {
    case 'landing': return '/';
    case 'home': return '/home';
    case 'blog': return '/blog';
    case 'about': return '/about';
    case 'faq': return '/faq';
    case 'terms': return '/terms';
    case 'login': return '/login';
    case 'reset-password': return '/reset-password';
    case 'schedule': return '/schedule';
    case 'history': return '/history';
    case 'report': return '/report';
    case 'settings': return '/settings';
    case 'admin_reports': return '/admin';
    default: return null;
  }
};

function App() {
  const [currentView, setCurrentView] = useState(() => {
    if (typeof window !== 'undefined') {
      return getViewFromPath(window.location.pathname);
    }
    return 'landing';
  });
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showCommand, setShowCommand] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [examProgressData, setExamProgressData] = useState(null);
  const [reportInitialData, setReportInitialData] = useState(null);
  const [totalScore, setTotalScore] = useState(0);
  const [categoryScores, setCategoryScores] = useState({});
  const [showChart, setShowChart] = useState(false);
  
  const [subjectCatalog, setSubjects] = useState([]);
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [authRevision, setAuthRevision] = useState(0);
  const catalogRequest = useRef(0);
  const examRequest = useRef(0);
  const mounted = useRef(true);
  const currentUser = useRef(user);
  currentUser.current = user;
  const subjects = getVisibleSubjects(subjectCatalog, user);
  const [examLoadError, setExamLoadError] = useState('');
  const [loading, setLoading] = useState(true);
  const [authRequiredMessage, setAuthRequiredMessage] = useState('');
  
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Warm the exam library chunks while the landing page is idle so "start" opens instantly
  useEffect(() => {
    if (currentView !== 'landing') return;
    const prefetch = () => {
      import('./components/Home');
      import('./components/ExamIntro');
    };
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(prefetch, { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(prefetch, 2500);
    return () => clearTimeout(id);
  }, [currentView]);

  // ⌘K / Ctrl+K opens the quick switcher anywhere in the app
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowCommand(open => !open);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Sync browser URL bar with current view
  useEffect(() => {
    const targetPath = getPathFromView(currentView);
    if (targetPath && window.location.pathname !== targetPath) {
      window.history.pushState({ view: currentView }, '', targetPath);
    }
  }, [currentView]);

  // Handle browser Back / Forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const view = getViewFromPath(window.location.pathname);
      setCurrentView(view);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update document.title and meta description dynamically based on view
  useEffect(() => {
    const pageMeta = {
      landing: {
        title: 'EXETIA | คลังข้อสอบและแบบฝึกหัดออนไลน์ (Data Science, Cloud, AI & MIS)',
        desc: 'แพลตฟอร์มฝึกทำข้อสอบออนไลน์สำหรับนักศึกษาและสายไอที สรุปแนวข้อสอบ Data Science, AI & Cloud พร้อมเฉลยละเอียดเชิงลึก ช่วยเพิ่มความมั่นใจก่อนลงสนามสอบจริง'
      },
      home: {
        title: 'คลังข้อสอบทั้งหมด | EXETIA',
        desc: 'รวมชุดข้อสอบและแบบฝึกหัด Data Science, Machine Learning, AWS Cloud, Intelligent Systems และ MIS ฝึกทำฟรีพร้อมเฉลยละเอียด'
      },
      blog: {
        title: 'ข่าวสาร & อัปเดตระบบ | EXETIA Blog',
        desc: 'ติดตามข่าวสาร ฟีเจอร์ใหม่ อัปเดตระบบ และบทความเทคโนโลยีการสอบจากทีมงาน EXETIA'
      },
      about: {
        title: 'เกี่ยวกับเรา | EXETIA',
        desc: 'ทำความรู้จักกับ EXETIA แพลตฟอร์มคลังข้อสอบออนไลน์เพื่อพัฒนาทักษะด้านไอทีและการศึกษา'
      },
      faq: {
        title: 'คำถามที่พบบ่อย (FAQ) | EXETIA',
        desc: 'รวมข้อสงสัยและคำถามที่พบบ่อยเกี่ยวกับการใช้งานแพลตฟอร์ม การทำข้อสอบ และระบบสมาชิก EXETIA'
      },
      schedule: {
        title: 'ตารางสอบและกำหนดการ | EXETIA',
        desc: 'ตรวจสอบตารางสอบและกำหนดการสำคัญต่างๆ บนแพลตฟอร์ม EXETIA'
      },
      terms: {
        title: 'ข้อกำหนดการใช้งานและนโยบายความเป็นส่วนตัว | EXETIA',
        desc: 'ข้อตกลง เงื่อนไขการให้บริการ และนโยบายการคุ้มครองข้อมูลส่วนบุคคลของ EXETIA'
      },
      login: {
        title: 'เข้าสู่ระบบ / สมัครสมาชิก | EXETIA',
        desc: 'เข้าสู่ระบบบัญชี EXETIA เพื่อบันทึกประวัติการทำข้อสอบ ดูสถิติคลิกเดียว'
      },
      report: {
        title: 'แจ้งปัญหาข้อสอบ | EXETIA',
        desc: 'ส่งรายงานข้อผิดพลาดของโจทย์ คำตอบ หรือระบบข้อสอบแก่ผู้ดูแลระบบ EXETIA'
      }
    };

    const currentMeta = pageMeta[currentView];
    if (currentMeta) {
      document.title = currentMeta.title;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', currentMeta.desc);
      }
    }
  }, [currentView]);

  const refreshCatalog = useCallback(async () => {
    const request = ++catalogRequest.current;
    try {
      const catalog = await loadExamCatalog(supabase);
      if (mounted.current && request === catalogRequest.current) {
        setSubjects(catalog);
        setExamLoadError('');
      }
    } catch (error) {
      if (mounted.current && request === catalogRequest.current) {
        console.error('Error loading exam catalog:', error);
        setExamLoadError(error.message || 'ไม่สามารถโหลดคลังข้อสอบได้');
      }
    } finally {
      if (mounted.current && request === catalogRequest.current) setLoading(false);
    }
  }, []);

  // Resolve authentication before requesting the RLS-filtered catalog.
  useEffect(() => {
    let active = true;
    let receivedAuthEvent = false;
    let recoveringPassword = false;
    mounted.current = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      receivedAuthEvent = true;
      const nextUser = session?.user || null;
      currentUser.current = nextUser;
      // Invalidate pending responses immediately, including an admin request at sign-out.
      catalogRequest.current += 1;
      examRequest.current += 1;
      setSubjects([]);
      setUser(nextUser);
      setAuthReady(true);
      setAuthRevision(revision => revision + 1);
      if (event === 'PASSWORD_RECOVERY') {
        recoveringPassword = true;
        setCurrentView('reset-password');
      }
    });

    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (!active) return;
      if (error) throw error;
      if (!receivedAuthEvent) {
        currentUser.current = session?.user || null;
        setUser(session?.user || null);
        setAuthReady(true);
      }
      if (!recoveringPassword && session?.user && (window.location.pathname === '/' || window.location.pathname === '')) {
        setCurrentView('home');
      }
    }).catch(error => {
      if (!active) return;
      console.error('Error resolving authentication:', error);
      setExamLoadError(error.message || 'ไม่สามารถตรวจสอบสถานะการเข้าสู่ระบบได้');
      setLoading(false);
    });

    return () => {
      active = false;
      mounted.current = false;
      catalogRequest.current += 1;
      examRequest.current += 1;
      subscription.unsubscribe();
    };
  }, []);

  // Keep Supabase calls outside the synchronous auth callback.
  useEffect(() => {
    if (!authReady) return;
    refreshCatalog();
    if (user) {
      loadUserScores(user.id);
    } else {
      setTotalScore(0);
      setCategoryScores({});
    }
  }, [authReady, authRevision, user, refreshCatalog]);

  const loadUserScores = async (userId) => {
    const request = catalogRequest.current;
    try {
      const { data: scores, error } = await supabase
        .from('user_scores')
        .select('score, exam_id, exams(category)')
        .eq('user_id', userId);

      if (error) throw error;
      
      let total = 0;
      let categories = {};
      
      if (scores) {
        scores.forEach(s => {
          total += s.score;
          const cat = s.exams?.category;
          if (cat) {
            categories[cat] = (categories[cat] || 0) + s.score;
          }
        });
      }
      
      if (mounted.current && request === catalogRequest.current) {
        setTotalScore(total);
        setCategoryScores(categories);
      }
    } catch (err) {
      console.error("Error loading scores:", err);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const startExam = async (subjectId, resumeData = null) => {
    setExamLoadError('');
    const request = ++examRequest.current;
    try {
      const subjectMeta = subjects.find(subject => subject.id === subjectId);
      if (isAdminPractice(subjectId, subjectMeta) && !checkIsAdmin(currentUser.current)) return;
      if (subjectMeta?.requiresAuth && !currentUser.current) {
        setAuthRequiredMessage(`กรุณาเข้าสู่ระบบก่อนเพื่อทำข้อสอบชุด "${subjectMeta.name}"`);
        setCurrentView('login');
        return;
      }

      const examData = await loadExam(supabase, subjectId, { requireQuestions: true });
      if (!mounted.current || request !== examRequest.current) return;
      const fullSubject = {
        ...examData,
        adminOnly: isAdminPractice(subjectId, examData),
      };
      if (fullSubject.adminOnly && !checkIsAdmin(currentUser.current)) return;
      if (fullSubject.requiresAuth && !currentUser.current) {
        setAuthRequiredMessage(`กรุณาเข้าสู่ระบบก่อนเพื่อทำข้อสอบชุด "${fullSubject.name}"`);
        setCurrentView('login');
        return;
      }

      setSelectedSubject(fullSubject);
      if (resumeData && !fullSubject.adminOnly) {
        setExamProgressData(resumeData);
        setCurrentView('exam');
      } else {
        setExamProgressData(null);
        setCurrentView('examIntro');
      }
    } catch (err) {
      if (!mounted.current || request !== examRequest.current) return;
      console.error('Failed to load exam data:', err);
      setExamLoadError(err.message || 'ไม่สามารถโหลดข้อสอบได้');
    }
  };

  const goHome = () => {
    setCurrentView('home');
    setSelectedSubject(null);
    setExamProgressData(null);
    setReportInitialData(null);
    setShowMobileMenu(false);
  };

  const openReport = (data = null) => {
    setReportInitialData(data);
    setCurrentView('report');
    setShowMobileMenu(false);
  };

  const addScore = async (score) => {
    if (selectedSubject?.adminOnly) return;
    setTotalScore((prev) => prev + score);
    if (selectedSubject) {
      setCategoryScores(prev => ({
        ...prev,
        [selectedSubject.category]: (prev[selectedSubject.category] || 0) + score
      }));
    }

    if (user && selectedSubject) {
      try {
        const { error } = await supabase
          .from('user_scores')
          .insert([
            { user_id: user.id, exam_id: selectedSubject.id, score }
          ]);
        
        if (error) throw error;
      } catch (err) {
        console.error("Error saving score:", err);
      }
    }
  };
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const isAdmin = checkIsAdmin(user);

  // Remove private exam content from the rendered view when the admin signs out.
  useEffect(() => {
    if (!isAdmin && selectedSubject?.adminOnly) {
      setSelectedSubject(null);
      setExamProgressData(null);
      setCurrentView('home');
    }
  }, [isAdmin, selectedSubject]);

  const allCategories = [...new Set(subjects.map(s => s.category))];
  
  const chartData = allCategories.map(category => {
    let shortName = category;
    if (category.includes('Intelligent System')) shortName = 'ISD';
    else if (category.includes('Data Visualization')) shortName = 'Data Viz';
    else if (category.includes('Medical Image')) shortName = 'Med Image';
    else shortName = category.split(' ')[0];

    return {
      skill: shortName,
      score: (categoryScores[category] || 0) * 10
    };
  });

  if (loading) {
    return <PageLoader />;
  }

  // Standalone Landing Page before entering Home
  if (currentView === 'landing') {
    return (
      <Landing 
        subjects={subjects}
        totalQuestions={subjects.reduce((sum, s) => sum + s.questionCount, 0)}
        user={user}
        onStart={() => setCurrentView('home')}
        onLogin={() => setCurrentView('login')}
        onNavigateAbout={() => setCurrentView('about')}
        onNavigateFaq={() => setCurrentView('faq')}
        onNavigateTerms={() => setCurrentView('terms')}
        onNavigateBlog={() => setCurrentView('blog')}
      />
    );
  }

  // Standalone Blog & Changelog Page
  if (currentView === 'blog') {
    return (
      <Blog 
        user={user}
        isAdmin={isAdmin}
        onHome={() => setCurrentView('landing')}
        onStart={() => setCurrentView('home')}
        onLogin={() => setCurrentView('login')}
        onNavigateAbout={() => setCurrentView('about')}
        onNavigateFaq={() => setCurrentView('faq')}
        onOpenAdminBlog={() => setCurrentView('admin_reports')}
      />
    );
  }

  // Standalone About Us Page
  if (currentView === 'about') {
    return (
      <AboutUs 
        subjects={subjects}
        user={user}
        onStart={() => setCurrentView('home')}
        onLogin={() => setCurrentView('login')}
        onHome={() => setCurrentView('landing')}
        onNavigateFaq={() => setCurrentView('faq')}
        onNavigateTerms={() => setCurrentView('terms')}
        onNavigateBlog={() => setCurrentView('blog')}
      />
    );
  }

  // Standalone FAQ & Needs Page
  if (currentView === 'faq') {
    return (
      <FAQ 
        onHome={() => setCurrentView('home')}
        onNavigateLanding={() => setCurrentView('landing')}
        onNavigateAbout={() => setCurrentView('about')}
        onNavigateTerms={() => setCurrentView('terms')}
        onNavigateBlog={() => setCurrentView('blog')}
        onLogin={() => setCurrentView('login')}
        user={user}
      />
    );
  }

  // Standalone Terms of Service & Privacy Policy Page
  if (currentView === 'terms') {
    return (
      <TermsOfService 
        user={user}
        onStart={() => setCurrentView('home')}
        onLogin={() => setCurrentView('login')}
        onHome={() => setCurrentView('landing')}
        onNavigateAbout={() => setCurrentView('about')}
        onNavigateFaq={() => setCurrentView('faq')}
        onNavigateBlog={() => setCurrentView('blog')}
      />
    );
  }

  // Hide header on login view
  if (currentView === 'login') {
    return (
 <Suspense fallback={<PageLoader />}>
          <Login 
            authRequiredMessage={authRequiredMessage}
            onLogin={(user) => {
              setUser(user);
              setAuthRequiredMessage('');
              setCurrentView('home');
            }} 
            onClose={() => {
              setAuthRequiredMessage('');
              setCurrentView(user ? 'home' : 'landing');
            }} // Guest mode / Back to Landing
          />
        </Suspense>
    );
  }

  // Standalone Reset Password Page
  if (currentView === 'reset-password') {
    return (
 <Suspense fallback={<PageLoader />}>
          <ResetPassword 
            onSuccess={(updatedUser) => {
              if (updatedUser) setUser(updatedUser);
              setCurrentView('home');
            }}
            onBackToLogin={() => setCurrentView('login')}
          />
        </Suspense>
    );
  }

  // Full-Screen Flux-AgentOps Style Admin Dashboard
  if (currentView === 'admin_reports' && isAdmin) {
    return (
      <AdminDashboard 
        subjects={subjects} 
        user={user} 
        onCatalogChange={refreshCatalog}
        onBack={goHome} 
      />
    );
  }

  const viewTitles = {
    home: 'คลังข้อสอบ', schedule: 'ตารางสอบ', history: 'ประวัติคะแนน', report: 'แจ้งข้อสอบผิด / ปัญหา',
    settings: 'ข้อมูลส่วนตัว & ตั้งค่า', admin_reports: 'แดชบอร์ดผู้ดูแล',
  };
  const crumbs = ['examIntro', 'exam'].includes(currentView) && selectedSubject
    ? [{ label: 'คลังข้อสอบ', onClick: goHome }, { label: selectedSubject.name }]
    : [{ label: viewTitles[currentView] || 'EXETIA' }];

  return (
    <div className={`shell${showMobileMenu ? ' nav-open' : ''}`}>
      <Sidebar
        currentView={currentView}
        user={user}
        isAdmin={isAdmin}
        theme={theme}
        totalScore={totalScore}
        examCount={subjects.length}
        onNavigate={(view) => (view === 'home' ? goHome() : setCurrentView(view))}
        onOpenChart={() => setShowChart(true)}
        onOpenReport={() => openReport()}
        onOpenSearch={() => setShowCommand(true)}
        onToggleTheme={toggleTheme}
        onLogout={() => setShowLogoutConfirm(true)}
        onLogin={() => setCurrentView('login')}
        onClose={showMobileMenu ? () => setShowMobileMenu(false) : undefined}
      />
      <div className="sidebar-overlay" onClick={() => setShowMobileMenu(false)} />

      <div className="shell-main">
        <header className="topbar">
          <button type="button" className="btn btn-ghost btn-icon topbar-menu" onClick={() => setShowMobileMenu(true)} aria-label="เปิดเมนู">
            <Menu size={18} />
          </button>
          <nav className="crumbs" aria-label="ตำแหน่งปัจจุบัน">
            {crumbs.map((c, i) => (
              <span key={i} style={{ display: 'contents' }}>
                {i > 0 && <ChevronRight size={14} className="sep" />}
                {c.onClick ? <button type="button" onClick={c.onClick}>{c.label}</button> : <span className="current">{c.label}</span>}
              </span>
            ))}
          </nav>
          <button type="button" className="btn btn-ghost btn-sm hide-sm" onClick={() => setShowCommand(true)} style={{ color: 'var(--text-subtle)' }}>
            <Search size={14} /> ค้นหา <span className="kbd">⌘K</span>
          </button>
          <button type="button" className="btn btn-ghost btn-icon btn-sm" onClick={() => setShowCommand(true)} aria-label="ค้นหา" style={{ display: 'none' }} />
          <button type="button" className="btn btn-ghost btn-icon" onClick={toggleTheme} aria-label="สลับธีม" title={theme === 'dark' ? 'โหมดสว่าง' : 'โหมดมืด'}>
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          {!user && (
            <button type="button" className="btn btn-primary btn-sm" onClick={() => setCurrentView('login')}>
              <LogIn size={14} /> เข้าสู่ระบบ
            </button>
          )}
        </header>

      <main className="main-content">
        {examLoadError && (
          <div role="alert" style={{ margin: '1rem auto 0', maxWidth: 1180, padding: '0 2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0.85rem', borderRadius: 8, background: 'var(--error-soft)', color: 'var(--error)', fontSize: '0.8125rem' }}>
              <AlertTriangle size={15} /> {examLoadError}
            </div>
          </div>
        )}
        <Suspense fallback={<PageLoader inline />}>
        {currentView === 'home' && (
          <Home 
            subjects={subjects} 
            onSelectSubject={startExam} 
            onResumeExam={(progress) => startExam(progress.subjectId, progress)}
            user={user}
            onRequireLogin={(subject) => {
              setAuthRequiredMessage(`กรุณาเข้าสู่ระบบก่อนเพื่อทำข้อสอบชุด "${subject?.name || ''}"`);
              setCurrentView('login');
            }}
            onOpenReport={openReport}
          />
        )}
        {currentView === 'examIntro' && selectedSubject && (!selectedSubject.adminOnly || isAdmin) && (
          <ExamIntro 
            subject={selectedSubject} 
            onBack={goHome} 
            onStart={() => {
              setExamProgressData(null);
              setCurrentView('exam');
            }}
            onResume={(resumeData) => {
              setExamProgressData(selectedSubject.adminOnly ? null : resumeData);
              setCurrentView('exam');
            }}
          />
        )}
        {currentView === 'exam' && selectedSubject && (!selectedSubject.adminOnly || isAdmin) && (
          <Exam 
            subject={selectedSubject} 
            onBack={goHome} 
            onComplete={addScore} 
            onReport={openReport}
            initialProgress={examProgressData}
          />
        )}
        {currentView === 'schedule' && (
          <Schedule />
        )}
        {currentView === 'history' && user && (
          <ScoreHistory user={user} />
        )}
        {currentView === 'history' && !user && (
          <GateState icon={HistoryIcon} title="เข้าสู่ระบบเพื่อดูประวัติคะแนน" text="ประวัติการทำข้อสอบและพัฒนาการของคุณจะถูกบันทึกไว้ในบัญชี" primary={{ label: 'เข้าสู่ระบบ', onClick: () => setCurrentView('login') }} />
        )}
        {currentView === 'report' && (
          <Report 
            subjects={subjects} 
            initialData={reportInitialData} 
            user={user} 
            onBack={goHome} 
            onOpenAdminReports={isAdmin ? () => setCurrentView('admin_reports') : null}
          />
        )}
        {currentView === 'admin_reports' && isAdmin && (
          <AdminDashboard 
            subjects={subjects} 
            user={user} 
            onCatalogChange={refreshCatalog}
            onBack={goHome} 
            onSelectSubject={startExam}
          />
        )}
        {currentView === 'admin_reports' && !user && (
          <GateState icon={ShieldAlert} title="เฉพาะผู้ดูแลระบบ" text="หน้านี้จำกัดสิทธิ์เฉพาะผู้ดูแลระบบ กรุณาเข้าสู่ระบบด้วยบัญชี Admin" primary={{ label: 'เข้าสู่ระบบ', onClick: () => setCurrentView('login') }} secondary={{ label: 'กลับสู่คลังข้อสอบ', onClick: goHome }} />
        )}
        {currentView === 'admin_reports' && user && !isAdmin && (
          <GateState icon={ShieldAlert} tone="error" title="คุณไม่มีสิทธิ์เข้าถึงหน้านี้" text={`บัญชี ${user.email} ไม่ใช่บัญชีผู้ดูแลระบบ จึงไม่สามารถดูรายการรายงานปัญหาได้`} primary={{ label: 'กลับสู่คลังข้อสอบ', onClick: goHome }} />
        )}
        {currentView === 'settings' && user && (
          <UserSettings 
            user={user} 
            onBack={goHome} 
            onUserUpdated={(updatedUser) => setUser(updatedUser)} 
            totalScore={totalScore}
            theme={theme}
            onToggleTheme={toggleTheme}
            onSignOut={() => {
              setUser(null);
              setTotalScore(0);
              setCategoryScores({});
              goHome();
            }}
            onResetScores={() => {
              setTotalScore(0);
              setCategoryScores({});
            }}
            onAccountDeleted={() => {
              setUser(null);
              setTotalScore(0);
              setCategoryScores({});
              goHome();
            }}
          />
        )}
        {currentView === 'settings' && !user && (
          <GateState icon={User} title="กรุณาเข้าสู่ระบบ" text="เข้าสู่ระบบเพื่อจัดการข้อมูลส่วนตัวและตั้งค่าการใช้งาน" primary={{ label: 'เข้าสู่ระบบ', onClick: () => setCurrentView('login') }} />
        )}
        </Suspense>
      </main>
      </div>

      {showCommand && (
        <CommandMenu
          subjects={subjects}
          onClose={() => setShowCommand(false)}
          onSelectSubject={startExam}
          onNavigate={(view) => (view === 'home' ? goHome() : view === 'report' ? openReport() : setCurrentView(view))}
        />
      )}

      {showChart && (
        <Suspense fallback={null}>
          <Pattern data={chartData} onClose={() => setShowChart(false)} />
        </Suspense>
      )}

      {showLogoutConfirm && (
        <div className="modal-backdrop" onClick={() => setShowLogoutConfirm(false)}>
          <div className="modal" role="alertdialog" aria-label="ยืนยันการออกจากระบบ" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="tile" style={{ background: 'var(--error-soft)', color: 'var(--error)', boxShadow: 'none' }}><LogOut size={16} /></span>
              <div>
                <div className="modal-title">ออกจากระบบ?</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: 2 }}>คุณจะออกจากบัญชี {user?.email} บนอุปกรณ์นี้</div>
              </div>
            </div>
            <div className="modal-footer" style={{ marginTop: '1rem' }}>
              <button type="button" className="btn" onClick={() => setShowLogoutConfirm(false)}>ยกเลิก</button>
              <button type="button" className="btn btn-danger" onClick={() => { setShowLogoutConfirm(false); handleLogout(); }}>ออกจากระบบ</button>
            </div>
          </div>
        </div>
      )}

      <PWAInstallPrompt />
    </div>
  );
}

export default App;
