import { useState, useEffect, useMemo } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ArrowLeft, 
  HelpCircle, 
  FileText, 
  Bug, 
  Sparkles, 
  Search, 
  RefreshCw, 
  Download, 
  Trash2, 
  Check, 
  X, 
  Eye, 
  Edit3, 
  BookOpen, 
  ShieldCheck, 
  Inbox, 
  Plus, 
  Copy, 
  Upload, 
  Save, 
  RotateCcw, 
  ChevronRight, 
  Activity, 
  Layers, 
  BarChart3, 
  Zap, 
  LogOut,
  Menu,
  GraduationCap 
} from 'lucide-react';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { supabase } from '../lib/supabase';

// Issue types config matching Report.jsx & FAQ.jsx
const ISSUE_TYPES_MAP = {
  wrong_answer: { label: 'เฉลยผิด / คำตอบไม่ถูกต้อง', icon: AlertTriangle, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.12)' },
  wrong_translation: { label: 'คำแปล / ภาษาไทยผิดพลาด', icon: FileText, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)' },
  bug_system: { label: 'บั๊ก / ระบบแสดงผลผิดพลาด', icon: Bug, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.12)' },
  suggestion: { label: 'ข้อเสนอแนะ / ปรับปรุง', icon: Sparkles, color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)' },
  request_exam: { label: 'ขอเพิ่มวิชา / ข้อสอบใหม่ (Needs)', icon: BookOpen, color: '#0070f3', bg: 'rgba(0, 112, 243, 0.12)' },
  suggest_feature: { label: 'เสนอแนะฟีเจอร์ใหม่ (Needs)', icon: Sparkles, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)' },
  report_bug: { label: 'แจ้งปัญหา / บั๊ก (Needs)', icon: Bug, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.12)' },
  general_feedback: { label: 'ข้อเสนอแนะทั่วไป (Needs)', icon: HelpCircle, color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)' },
  other: { label: 'อื่นๆ', icon: HelpCircle, color: '#888888', bg: 'rgba(136, 136, 136, 0.12)' }
};

// Status definitions
const STATUS_CONFIG = {
  pending: {
    label: 'รอตรวจสอบ',
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.12)',
    border: 'rgba(245, 158, 11, 0.3)',
    icon: Clock
  },
  investigating: {
    label: 'กำลังตรวจ',
    color: '#3b82f6',
    bg: 'rgba(59, 130, 246, 0.12)',
    border: 'rgba(59, 130, 246, 0.3)',
    icon: Eye
  },
  resolved: {
    label: 'แก้ไขแล้ว',
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.12)',
    border: 'rgba(16, 185, 129, 0.3)',
    icon: CheckCircle2
  },
  dismissed: {
    label: 'ปิดเรื่อง',
    color: '#888888',
    bg: 'rgba(136, 136, 136, 0.12)',
    border: 'rgba(136, 136, 136, 0.3)',
    icon: X
  }
};

const renderTextWithMath = (text) => {
  if (typeof text !== 'string') return text;
  const parts = text.split('$');
  return parts.map((part, index) => {
    if (index % 2 === 1) {
      return <InlineMath key={index} math={part} />;
    }
    return <span key={index}>{part}</span>;
  });
};

export default function AdminDashboard({ subjects = [], user = null, onBack, initialTab = 'overview' }) {
  const [currentNav, setCurrentNav] = useState(initialTab); // 'overview' | 'exams' | 'reports' | 'scores'
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // ==========================================
  // 1. REPORT INBOX STATE
  // ==========================================
  const [reports, setReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [refreshingReports, setRefreshingReports] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [editingReport, setEditingReport] = useState(null);
  const [deleteConfirmReport, setDeleteConfirmReport] = useState(null);
  const [adminNotes, setAdminNotes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('examhub_admin_notes') || '{}');
    } catch {
      return {};
    }
  });

  // ==========================================
  // 2. EXAM MANAGEMENT STATE
  // ==========================================
  const [selectedExamId, setSelectedExamId] = useState(null);
  const [loadedExamData, setLoadedExamData] = useState(null);
  const [loadingExam, setLoadingExam] = useState(false);
  const [examSearchQuery, setExamSearchQuery] = useState('');
  const [examYearFilter, setExamYearFilter] = useState('all');
  const [questionSearchQuery, setQuestionSearchQuery] = useState('');
  
  // Question Editor Modal
  const [editingQuestionIndex, setEditingQuestionIndex] = useState(null); // null = closed, -1 = new question, >= 0 = edit index
  const [questionFormData, setQuestionFormData] = useState({
    q: '',
    choices: ['', '', '', ''],
    answer: 0,
    explain: ''
  });

  // Bulk Import Modal
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState('');

  // New Exam Modal
  const [showNewExamModal, setShowNewExamModal] = useState(false);
  const [newExamForm, setNewExamForm] = useState({
    id: '',
    name: '',
    category: 'General',
    icon: '📝',
    color: '#0070f3',
    desc: '',
    year: 3,
    type: 'Midterm'
  });

  // Scores History State
  const [userScoreLogs, setUserScoreLogs] = useState([]);
  const [loadingScores, setLoadingScores] = useState(false);

  // Fetch Reports
  const fetchReports = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshingReports(true);
    else setLoadingReports(true);

    try {
      let dbReports = [];
      try {
        const { data, error } = await supabase
          .from('reports')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) dbReports = data;
      } catch (err) {
        console.warn("Supabase query error:", err);
      }

      const localReports = JSON.parse(localStorage.getItem('examhub_user_reports') || '[]');
      const localNeeds = JSON.parse(localStorage.getItem('examhub_user_needs') || '[]');
      const localStatusMap = JSON.parse(localStorage.getItem('examhub_report_statuses') || '{}');

      const reportsMap = new Map();
      [...localReports, ...localNeeds].forEach(r => {
        reportsMap.set(r.id, {
          ...r,
          status: localStatusMap[r.id] || r.status || 'pending'
        });
      });
      dbReports.forEach(r => {
        reportsMap.set(r.id, {
          ...r,
          status: localStatusMap[r.id] || r.status || 'pending'
        });
      });

      const combined = Array.from(reportsMap.values());
      combined.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));

      setReports(combined);
      if (isManualRefresh) showToast(`อัปเดตข้อมูลแล้ว (${combined.length} รายการ)`);
    } catch (err) {
      console.error("Failed to fetch reports:", err);
      showToast('ไม่สามารถดึงข้อมูลรีพอร์ตได้');
    } finally {
      setLoadingReports(false);
      setRefreshingReports(false);
    }
  };

  // Fetch Score Logs
  const fetchScoreLogs = async () => {
    setLoadingScores(true);
    try {
      const { data, error } = await supabase
        .from('user_scores')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (!error && data) {
        setUserScoreLogs(data);
      }
    } catch (err) {
      console.warn("Error fetching score logs:", err);
    } finally {
      setLoadingScores(false);
    }
  };

  useEffect(() => {
    fetchReports();
    fetchScoreLogs();
  }, []);

  // Update Report Status
  const handleUpdateStatus = async (reportId, newStatus, newAdminNote = null) => {
    try {
      const localStatusMap = JSON.parse(localStorage.getItem('examhub_report_statuses') || '{}');
      localStatusMap[reportId] = newStatus;
      localStorage.setItem('examhub_report_statuses', JSON.stringify(localStatusMap));

      if (newAdminNote !== null) {
        const updatedNotes = { ...adminNotes, [reportId]: newAdminNote };
        setAdminNotes(updatedNotes);
        localStorage.setItem('examhub_admin_notes', JSON.stringify(updatedNotes));
      }

      try {
        await supabase
          .from('reports')
          .update({ status: newStatus })
          .eq('id', reportId);
      } catch (err) {
        console.warn("Supabase update skipped/failed:", err);
      }

      setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: newStatus } : r));
      showToast(`เปลี่ยนสถานะเป็น "${STATUS_CONFIG[newStatus]?.label || newStatus}" แล้ว`);
      setEditingReport(null);
    } catch (err) {
      console.error("Error updating status:", err);
      showToast('เกิดข้อผิดพลาดในการอัปเดตสถานะ');
    }
  };

  // Delete Report
  const handleDeleteReport = async (reportId) => {
    try {
      try {
        await supabase.from('reports').delete().eq('id', reportId);
      } catch (err) {
        console.warn("Supabase delete failed:", err);
      }

      const localReports = JSON.parse(localStorage.getItem('examhub_user_reports') || '[]');
      const filteredLocal = localReports.filter(r => r.id !== reportId);
      localStorage.setItem('examhub_user_reports', JSON.stringify(filteredLocal));

      setReports(prev => prev.filter(r => r.id !== reportId));
      setDeleteConfirmReport(null);
      showToast('ลบรายการรีพอร์ตเรียบร้อยแล้ว');
    } catch (err) {
      console.error("Error deleting report:", err);
      showToast('เกิดข้อผิดพลาดในการลบ');
    }
  };

  // Load Exam Questions (from LocalStorage Custom or Bundled JSON)
  const loadExamDetails = async (examId, targetQuestionNumber = null) => {
    setSelectedExamId(examId);
    setLoadingExam(true);
    setQuestionSearchQuery('');

    try {
      const subjectMeta = subjects.find(s => s.id === examId) || {};
      let examData = null;

      // 1. Check custom saved exam in localStorage
      const customKey = `examhub_custom_exam_${examId}`;
      const saved = localStorage.getItem(customKey);
      if (saved) {
        try {
          examData = JSON.parse(saved);
        } catch (e) {
          console.warn("Error parsing local exam:", e);
        }
      }

      // 2. Fallback to bundle file
      if (!examData) {
        try {
          const mod = await import(`../data/${examId}.json`);
          examData = mod.default;
        } catch (err) {
          console.error("Failed to load local JSON file:", err);
          examData = {
            id: examId,
            name: subjectMeta.name || examId,
            category: subjectMeta.category || 'General',
            questions: []
          };
        }
      }

      const merged = {
        ...subjectMeta,
        ...examData,
        isCustomModified: !!saved
      };

      setLoadedExamData(merged);

      // If requested to open a specific question editor directly
      if (targetQuestionNumber && merged.questions) {
        const qIdx = parseInt(targetQuestionNumber, 10) - 1;
        if (merged.questions[qIdx]) {
          openQuestionEditor(qIdx, merged.questions[qIdx]);
        }
      }
    } catch (err) {
      console.error("Failed loading exam details:", err);
      showToast('ไม่สามารถโหลดข้อมูลชุดข้อสอบนี้ได้');
    } finally {
      setLoadingExam(false);
    }
  };

  // Save Exam Data (to LocalStorage & State)
  const saveExamData = (updatedData) => {
    const examId = updatedData.id || selectedExamId;
    const customKey = `examhub_custom_exam_${examId}`;
    
    // Save to localStorage
    const toStore = {
      id: updatedData.id,
      name: updatedData.name,
      category: updatedData.category,
      desc: updatedData.desc,
      icon: updatedData.icon,
      color: updatedData.color,
      questions: updatedData.questions
    };
    localStorage.setItem(customKey, JSON.stringify(toStore));

    setLoadedExamData({
      ...updatedData,
      isCustomModified: true
    });

    showToast(`บันทึกชุดข้อสอบ "${updatedData.name}" เรียบร้อย (${updatedData.questions.length} ข้อ)`);
  };

  // Reset Exam Data to Default from JSON file
  const handleResetExamToDefault = async (examId) => {
    if (!window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการรีเซ็ตข้อสอบ "${loadedExamData?.name}" กลับเป็นค่าเริ่มต้นจากไฟล์ JSON?`)) {
      return;
    }

    const customKey = `examhub_custom_exam_${examId}`;
    localStorage.removeItem(customKey);

    try {
      const mod = await import(`../data/${examId}.json`);
      const originalData = mod.default;
      const subjectMeta = subjects.find(s => s.id === examId) || {};
      setLoadedExamData({
        ...subjectMeta,
        ...originalData,
        isCustomModified: false
      });
      showToast('รีเซ็ตข้อสอบกลับเป็นค่าเริ่มต้นเรียบร้อย');
    } catch (err) {
      console.error("Failed reset:", err);
      showToast('เกิดข้อผิดพลาดในการรีเซ็ต');
    }
  };

  // Download Exam JSON File
  const handleDownloadExamJSON = (examData) => {
    if (!examData) return;
    const exportObj = {
      id: examData.id,
      category: examData.category,
      name: examData.name,
      icon: examData.icon || '📝',
      color: examData.color || '#0070f3',
      iconBg: examData.iconBg || 'rgba(0, 112, 243, 0.15)',
      desc: examData.desc || '',
      questions: examData.questions || []
    };

    const jsonString = JSON.stringify(exportObj, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${examData.id}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`ดาวน์โหลดไฟล์ ${examData.id}.json เรียบร้อย`);
  };

  // Copy Exam JSON to Clipboard
  const handleCopyExamJSON = (examData) => {
    if (!examData) return;
    const exportObj = {
      id: examData.id,
      category: examData.category,
      name: examData.name,
      icon: examData.icon || '📝',
      color: examData.color || '#0070f3',
      iconBg: examData.iconBg || 'rgba(0, 112, 243, 0.15)',
      desc: examData.desc || '',
      questions: examData.questions || []
    };
    navigator.clipboard.writeText(JSON.stringify(exportObj, null, 2));
    showToast('คัดลอก JSON ลงในคลิปบอร์ดแล้ว');
  };

  // Question Editor Handlers
  const openQuestionEditor = (index, question = null) => {
    setEditingQuestionIndex(index);
    if (question) {
      setQuestionFormData({
        q: question.q || '',
        choices: question.choices ? [...question.choices] : ['', '', '', ''],
        answer: typeof question.answer === 'number' ? question.answer : 0,
        explain: question.explain || ''
      });
    } else {
      setQuestionFormData({
        q: '',
        choices: ['', '', '', ''],
        answer: 0,
        explain: ''
      });
    }
  };

  const handleSaveQuestion = () => {
    if (!questionFormData.q.trim()) {
      alert('กรุณากรอกคำถาม');
      return;
    }

    const filteredChoices = questionFormData.choices.filter(c => c.trim() !== '');
    if (filteredChoices.length < 2) {
      alert('กรุณากรอกตัวเลือกอย่างน้อย 2 ข้อ');
      return;
    }

    const updatedQuestion = {
      q: questionFormData.q.trim(),
      choices: questionFormData.choices.map(c => c.trim()),
      answer: questionFormData.answer >= questionFormData.choices.length ? 0 : questionFormData.answer,
      explain: questionFormData.explain.trim()
    };

    const currentQuestions = [...(loadedExamData.questions || [])];

    if (editingQuestionIndex === -1) {
      currentQuestions.push(updatedQuestion);
    } else if (editingQuestionIndex >= 0) {
      currentQuestions[editingQuestionIndex] = updatedQuestion;
    }

    const updatedExam = {
      ...loadedExamData,
      questions: currentQuestions
    };

    saveExamData(updatedExam);
    setEditingQuestionIndex(null);
  };

  const handleDeleteQuestion = (index) => {
    if (!window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบคำถามข้อที่ ${index + 1}?`)) {
      return;
    }
    const currentQuestions = [...(loadedExamData.questions || [])];
    currentQuestions.splice(index, 1);
    const updatedExam = {
      ...loadedExamData,
      questions: currentQuestions
    };
    saveExamData(updatedExam);
  };

  const handleDuplicateQuestion = (index) => {
    const currentQuestions = [...(loadedExamData.questions || [])];
    const targetQ = currentQuestions[index];
    const duplicated = {
      ...targetQ,
      q: `${targetQ.q} (คัดลอก)`,
      choices: [...targetQ.choices]
    };
    currentQuestions.splice(index + 1, 0, duplicated);
    const updatedExam = {
      ...loadedExamData,
      questions: currentQuestions
    };
    saveExamData(updatedExam);
  };

  const handleMoveQuestion = (fromIdx, toIdx) => {
    if (toIdx < 0 || toIdx >= (loadedExamData?.questions?.length || 0)) return;
    const currentQuestions = [...(loadedExamData.questions || [])];
    const [moved] = currentQuestions.splice(fromIdx, 1);
    currentQuestions.splice(toIdx, 0, moved);
    const updatedExam = {
      ...loadedExamData,
      questions: currentQuestions
    };
    saveExamData(updatedExam);
  };

  // Bulk Import Parser
  const handleProcessImport = () => {
    setImportError('');
    if (!importText.trim()) {
      setImportError('กรุณากรอกข้อมูลข้อสอบ');
      return;
    }

    try {
      if (importText.trim().startsWith('[') || importText.trim().startsWith('{')) {
        const parsed = JSON.parse(importText);
        let importedQuestions = [];
        if (Array.isArray(parsed)) {
          importedQuestions = parsed;
        } else if (parsed.questions && Array.isArray(parsed.questions)) {
          importedQuestions = parsed.questions;
        }

        if (importedQuestions.length > 0) {
          const sanitized = importedQuestions.map(q => ({
            q: q.q || q.question || '',
            choices: q.choices || q.options || [],
            answer: typeof q.answer === 'number' ? q.answer : 0,
            explain: q.explain || q.explanation || ''
          })).filter(q => q.q && q.choices.length > 0);

          const currentQuestions = [...(loadedExamData.questions || []), ...sanitized];
          saveExamData({ ...loadedExamData, questions: currentQuestions });
          setShowImportModal(false);
          setImportText('');
          showToast(`นำเข้าข้อสอบสำเร็จ ${sanitized.length} ข้อ`);
          return;
        }
      }

      const lines = importText.split('\n');
      const questionsList = [];
      let currentQ = null;

      for (let rawLine of lines) {
        const line = rawLine.trim();
        if (!line) continue;

        const qMatch = line.match(/^(\d+[.)]|ข้อ\s*\d+|Q\d+[:.)])\s*(.+)/i);
        if (qMatch) {
          if (currentQ && currentQ.q && currentQ.choices.length >= 2) {
            questionsList.push(currentQ);
          }
          currentQ = {
            q: qMatch[2].trim(),
            choices: [],
            answer: 0,
            explain: ''
          };
          continue;
        }

        const choiceMatch = line.match(/^([A-Da-dก-ง1-4][.)])\s*(.+)/);
        if (choiceMatch && currentQ) {
          currentQ.choices.push(choiceMatch[2].trim());
          continue;
        }

        const ansMatch = line.match(/^(เฉลย|คำตอบ|Answer|Ans):\s*([A-Da-dก-ง1-4])/i);
        if (ansMatch && currentQ) {
          const letter = ansMatch[2].toUpperCase();
          let idx = 0;
          if (letter === 'A' || letter === '1' || letter === 'ก') idx = 0;
          else if (letter === 'B' || letter === '2' || letter === 'ข') idx = 1;
          else if (letter === 'C' || letter === '3' || letter === 'ค') idx = 2;
          else if (letter === 'D' || letter === '4' || letter === 'ง') idx = 3;
          currentQ.answer = idx;
          continue;
        }

        const expMatch = line.match(/^(คำอธิบาย|เหตุผล|Explanation|Explain):\s*(.+)/i);
        if (expMatch && currentQ) {
          currentQ.explain = expMatch[2].trim();
          continue;
        }

        if (currentQ) {
          if (currentQ.choices.length === 0) {
            currentQ.q += ' ' + line;
          } else {
            currentQ.explain = currentQ.explain ? `${currentQ.explain} ${line}` : line;
          }
        }
      }

      if (currentQ && currentQ.q && currentQ.choices.length >= 2) {
        questionsList.push(currentQ);
      }

      if (questionsList.length === 0) {
        setImportError('ไม่พบรูปแบบคำถามและตัวเลือกที่รองรับ กรุณาตรวจสอบข้อความที่วาง');
        return;
      }

      const currentQuestions = [...(loadedExamData.questions || []), ...questionsList];
      saveExamData({ ...loadedExamData, questions: currentQuestions });
      setShowImportModal(false);
      setImportText('');
      showToast(`นำเข้าข้อสอบสำเร็จ ${questionsList.length} ข้อ`);
    } catch (err) {
      console.error("Import parse error:", err);
      setImportError('เกิดข้อผิดพลาดในการแปลงข้อมูล: ' + err.message);
    }
  };

  // Jump from Report Inbox to Question Editor
  const handleEditReportedQuestion = (subjectId, questionNumber) => {
    setCurrentNav('exams');
    loadExamDetails(subjectId, questionNumber);
  };

  // Computed Reports Metrics
  const reportStats = useMemo(() => {
    const total = reports.length;
    const pending = reports.filter(r => (r.status || 'pending') === 'pending').length;
    const investigating = reports.filter(r => r.status === 'investigating').length;
    const resolved = reports.filter(r => r.status === 'resolved').length;
    const dismissed = reports.filter(r => r.status === 'dismissed').length;
    return { total, pending, investigating, resolved, dismissed };
  }, [reports]);

  // Total questions count across all subjects
  const totalQuestionsSum = useMemo(() => {
    return subjects.reduce((acc, sub) => acc + (sub.questionCount || 0), 0);
  }, [subjects]);

  // Filtered Reports
  const filteredReports = useMemo(() => {
    return reports.filter(r => {
      const currentStatus = r.status || 'pending';
      if (statusFilter !== 'all' && currentStatus !== statusFilter) return false;
      if (typeFilter !== 'all' && r.issue_type !== typeFilter) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchId = (r.id || '').toLowerCase().includes(query);
        const matchDesc = (r.description || '').toLowerCase().includes(query);
        const matchSubject = (r.subject_name || '').toLowerCase().includes(query);
        const matchEmail = (r.contact_email || '').toLowerCase().includes(query);
        const matchQNum = String(r.question_number || '') === query;
        if (!matchId && !matchDesc && !matchSubject && !matchEmail && !matchQNum) return false;
      }
      return true;
    });
  }, [reports, statusFilter, typeFilter, searchQuery]);

  // Filtered Exams List
  const filteredExams = useMemo(() => {
    return subjects.filter(exam => {
      if (examYearFilter !== 'all' && String(exam.year) !== examYearFilter) return false;
      if (examSearchQuery.trim()) {
        const q = examSearchQuery.toLowerCase().trim();
        const matchName = (exam.name || '').toLowerCase().includes(q);
        const matchCat = (exam.category || '').toLowerCase().includes(q);
        const matchId = (exam.id || '').toLowerCase().includes(q);
        if (!matchName && !matchCat && !matchId) return false;
      }
      return true;
    });
  }, [subjects, examYearFilter, examSearchQuery]);

  // Year statistics for tab badges
  const yearStats = useMemo(() => {
    const stats = { all: subjects.length, '2': 0, '3': 0 };
    subjects.forEach(s => {
      const yr = String(s.year || '3');
      stats[yr] = (stats[yr] || 0) + 1;
    });
    return stats;
  }, [subjects]);

  // Group filtered exams by year
  const examsGroupedByYear = useMemo(() => {
    const groups = {};
    filteredExams.forEach(exam => {
      const yr = exam.year ? String(exam.year) : '3';
      if (!groups[yr]) groups[yr] = [];
      groups[yr].push(exam);
    });

    const sortedYears = Object.keys(groups).sort((a, b) => Number(a) - Number(b));
    return sortedYears.map(yr => {
      const examsInYr = groups[yr];
      const totalQ = examsInYr.reduce((acc, e) => acc + (e.questionCount || 0), 0);
      const uniqueCats = [...new Set(examsInYr.map(e => e.category))];
      return {
        year: yr,
        exams: examsInYr,
        totalQuestions: totalQ,
        categories: uniqueCats
      };
    });
  }, [filteredExams]);

  // Filtered Questions in Selected Exam
  const filteredQuestions = useMemo(() => {
    if (!loadedExamData?.questions) return [];
    if (!questionSearchQuery.trim()) return loadedExamData.questions;

    const q = questionSearchQuery.toLowerCase().trim();
    return loadedExamData.questions.filter((item, idx) => {
      const matchNum = String(idx + 1) === q;
      const matchQ = (item.q || '').toLowerCase().includes(q);
      const matchChoices = (item.choices || []).some(c => c.toLowerCase().includes(q));
      const matchExplain = (item.explain || '').toLowerCase().includes(q);
      return matchNum || matchQ || matchChoices || matchExplain;
    });
  }, [loadedExamData, questionSearchQuery]);

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'var(--bg)',
      color: 'var(--text)',
      fontFamily: 'var(--font-sans)',
      position: 'relative'
    }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: '#09090b',
          color: '#f4f4f5',
          border: '1px solid #27272a',
          padding: '0.75rem 1.25rem',
          borderRadius: '10px',
          boxShadow: '0 12px 32px rgba(0,0,0,0.5)',
          fontSize: '0.875rem',
          fontWeight: 500,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <CheckCircle2 size={16} color="#10b981" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SIDEBAR NAVIGATION (Flux AgentOps Left Rail)                               */}
      {/* ========================================================================= */}
      <aside style={{
        width: '260px',
        flexShrink: 0,
        borderRight: '1px solid var(--border-color)',
        background: 'var(--surface)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1rem',
        position: 'sticky',
        top: 0,
        height: '100vh',
        zIndex: 50
      }} className={sidebarOpen ? 'mobile-sidebar-open' : 'mobile-sidebar-closed'}>
        <div>
          {/* Brand & Workspace Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', padding: '0.25rem 0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                boxShadow: '0 2px 8px rgba(99, 102, 241, 0.4)'
              }}>
                <Zap size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.9375rem', fontWeight: 700, letterSpacing: '-0.3px', lineHeight: 1.2 }}>
                  ExamOps
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Workspace Admin
                </div>
              </div>
            </div>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.6875rem',
              fontWeight: 600,
              padding: '0.2rem 0.5rem',
              borderRadius: '999px',
              background: 'rgba(16, 185, 129, 0.12)',
              color: '#10b981',
              border: '1px solid rgba(16, 185, 129, 0.25)'
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
              <span>LIVE</span>
            </div>
          </div>

          {/* Quick Search Bar */}
          <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
            <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text"
              placeholder="ค้นหาด่วน..."
              value={examSearchQuery}
              onChange={(e) => {
                setExamSearchQuery(e.target.value);
                if (currentNav !== 'exams') setCurrentNav('exams');
              }}
              style={{
                width: '100%',
                padding: '0.45rem 2rem 0.45rem 2.2rem',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: 'var(--surface-hover)',
                color: 'var(--text)',
                fontSize: '0.8125rem',
                fontFamily: 'var(--font-sans)',
                outline: 'none'
              }}
            />
            <kbd style={{
              position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)',
              fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-muted)', background: 'var(--surface)',
              border: '1px solid var(--border-color)', padding: '0.1rem 0.35rem', borderRadius: '4px'
            }}>/</kbd>
          </div>

          {/* Navigation Section 1: CORE WORKSPACE */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', padding: '0 0.5rem 0.5rem' }}>
              WORKSPACE
            </div>
            
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {/* Item: Overview */}
              <button
                onClick={() => {
                  setCurrentNav('overview');
                  setSelectedExamId(null);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.6rem 0.75rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: currentNav === 'overview' ? 'var(--surface-hover)' : 'transparent',
                  color: currentNav === 'overview' ? 'var(--text)' : 'var(--text-muted)',
                  fontWeight: currentNav === 'overview' ? 600 : 400,
                  fontSize: '0.875rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  borderLeft: currentNav === 'overview' ? '3px solid var(--accent)' : '3px solid transparent'
                }}
              >
                <Activity size={16} color={currentNav === 'overview' ? 'var(--accent)' : 'currentColor'} />
                <span style={{ flex: 1 }}>แดชบอร์ด (Overview)</span>
              </button>

              {/* Item: Exams Management */}
              <button
                onClick={() => {
                  setCurrentNav('exams');
                  setSelectedExamId(null);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.6rem 0.75rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: currentNav === 'exams' ? 'var(--surface-hover)' : 'transparent',
                  color: currentNav === 'exams' ? 'var(--text)' : 'var(--text-muted)',
                  fontWeight: currentNav === 'exams' ? 600 : 400,
                  fontSize: '0.875rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  borderLeft: currentNav === 'exams' ? '3px solid var(--accent)' : '3px solid transparent'
                }}
              >
                <BookOpen size={16} color={currentNav === 'exams' ? 'var(--accent)' : 'currentColor'} />
                <span style={{ flex: 1 }}>จัดการข้อสอบ (Exams)</span>
                <span style={{
                  fontSize: '0.6875rem',
                  padding: '0.1rem 0.4rem',
                  borderRadius: '999px',
                  background: 'var(--surface)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-muted)'
                }}>
                  {subjects.length}
                </span>
              </button>

              {/* Item: Report Inbox */}
              <button
                onClick={() => {
                  setCurrentNav('reports');
                  setSelectedExamId(null);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.6rem 0.75rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: currentNav === 'reports' ? 'var(--surface-hover)' : 'transparent',
                  color: currentNav === 'reports' ? 'var(--text)' : 'var(--text-muted)',
                  fontWeight: currentNav === 'reports' ? 600 : 400,
                  fontSize: '0.875rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  borderLeft: currentNav === 'reports' ? '3px solid #f59e0b' : '3px solid transparent'
                }}
              >
                <Inbox size={16} color={currentNav === 'reports' ? '#f59e0b' : 'currentColor'} />
                <span style={{ flex: 1 }}>กล่องรีพอร์ต (Inbox)</span>
                {reportStats.pending > 0 ? (
                  <span style={{
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    padding: '0.1rem 0.45rem',
                    borderRadius: '999px',
                    background: '#f59e0b',
                    color: 'white'
                  }}>
                    {reportStats.pending}
                  </span>
                ) : (
                  <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>0</span>
                )}
              </button>

              {/* Item: Score Runs & Analytics */}
              <button
                onClick={() => {
                  setCurrentNav('scores');
                  setSelectedExamId(null);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.6rem 0.75rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: currentNav === 'scores' ? 'var(--surface-hover)' : 'transparent',
                  color: currentNav === 'scores' ? 'var(--text)' : 'var(--text-muted)',
                  fontWeight: currentNav === 'scores' ? 600 : 400,
                  fontSize: '0.875rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  borderLeft: currentNav === 'scores' ? '3px solid var(--accent)' : '3px solid transparent'
                }}
              >
                <BarChart3 size={16} color={currentNav === 'scores' ? 'var(--accent)' : 'currentColor'} />
                <span style={{ flex: 1 }}>ประวัติการสอบ (Runs)</span>
              </button>
            </nav>
          </div>

          {/* Navigation Section 2: QUICK ACTIONS */}
          <div>
            <div style={{ fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', padding: '0 0.5rem 0.5rem' }}>
              QUICK ACTIONS
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <button 
                onClick={() => setShowNewExamModal(true)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem',
                  borderRadius: '6px', border: '1px dashed var(--border-color)', background: 'transparent',
                  color: 'var(--text-muted)', fontSize: '0.8125rem', cursor: 'pointer', textAlign: 'left'
                }}
              >
                <Plus size={14} />
                <span>+ สร้างชุดข้อสอบใหม่</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Bottom: User Profile & Exit */}
        <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.5rem',
            borderRadius: '8px',
            background: 'var(--surface-hover)',
            marginBottom: '0.75rem'
          }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: '0.8125rem'
            }}>
              {user?.email?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, truncate: true, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.email || 'Admin'}
              </div>
              <div style={{ fontSize: '0.6875rem', color: '#10b981', fontWeight: 600 }}>
                Super Admin
              </div>
            </div>
          </div>

          <button
            onClick={onBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              width: '100%',
              padding: '0.5rem',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              background: 'transparent',
              color: 'var(--text)',
              fontSize: '0.8125rem',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            <LogOut size={14} />
            <span>กลับสู่หน้าผู้เรียน</span>
          </button>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* MAIN CONTENT AREA                                                         */}
      {/* ========================================================================= */}
      <main style={{
        flex: 1,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflowY: 'auto',
        background: 'var(--bg)'
      }}>
        {/* Top Header Bar (Breadcrumbs & Global Actions) */}
        <header style={{
          height: '56px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.5rem',
          background: 'var(--surface)',
          position: 'sticky',
          top: 0,
          zIndex: 40
        }}>
          {/* Breadcrumbs & Mobile Trigger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem' }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'transparent',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                padding: '0.35rem',
                color: 'var(--text)',
                cursor: 'pointer'
              }}
              className="admin-mobile-toggle"
              aria-label="Toggle Sidebar"
            >
              <Menu size={16} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>ExamOps</span>
              <span style={{ color: 'var(--border-color)' }}>/</span>
              <span style={{ color: 'var(--text-muted)' }}>Admin</span>
              <span style={{ color: 'var(--border-color)' }}>/</span>
              <span style={{ fontWeight: 600, color: 'var(--text)' }}>
                {currentNav === 'overview' && 'แดชบอร์ดภาพรวม (Overview)'}
                {currentNav === 'exams' && (loadedExamData ? loadedExamData.name : 'จัดการชุดข้อสอบ (Exams)')}
                {currentNav === 'reports' && 'กล่องรายงานปัญหา (Report Inbox)'}
                {currentNav === 'scores' && 'ประวัติการสอบ (Runs)'}
              </span>
            </div>
          </div>

          {/* Right Header Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button 
              className="btn btn-outline"
              onClick={() => {
                fetchReports(true);
                fetchScoreLogs();
              }}
              style={{ fontSize: '0.8125rem', padding: '0.35rem 0.65rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <RefreshCw size={13} className={refreshingReports ? 'animate-spin' : ''} />
              <span>รีเฟรช</span>
            </button>
          </div>
        </header>

        {/* Content Container */}
        <div style={{ padding: '1.75rem 2rem 4rem', maxWidth: '1280px', width: '100%', margin: '0 auto' }}>
          
          {/* ========================================================================= */}
          {/* VIEW 1: OVERVIEW (Flux AgentOps Style Hero & Stat Frames)                 */}
          {/* ========================================================================= */}
          {currentNav === 'overview' && (
            <div className="animate-fade-in">
              {/* Header Title Section */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, letterSpacing: '-0.5px' }}>
                      Exam Operations & Health
                    </h1>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                      fontSize: '0.6875rem', fontWeight: 600, color: '#10b981',
                      background: 'rgba(16,185,129,0.1)', padding: '0.15rem 0.5rem', borderRadius: '999px'
                    }}>
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#10b981' }} />
                      Supabase Sync
                    </span>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>
                    ภาพรวมระบบข้อสอบ สถิติคำถาม และรายงานปัญหาที่ต้องตรวจสอบ
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    className="btn btn-primary"
                    onClick={() => {
                      setCurrentNav('exams');
                      setShowNewExamModal(true);
                    }}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem' }}
                  >
                    <Plus size={16} />
                    <span>สร้างวิชาใหม่</span>
                  </button>
                </div>
              </div>

              {/* Top 4 Elevated Stat Frame Panels (AgentOps style) */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
                gap: '1rem', 
                marginBottom: '2rem' 
              }}>
                {/* Frame 1: Total Exams */}
                <div 
                  onClick={() => setCurrentNav('exams')}
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.borderColor = '#6366f1'}
                  onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                >
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    background: '#6366f1', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '1rem', boxShadow: '0 2px 8px rgba(99,102,241,0.3)'
                  }}>
                    <BookOpen size={18} />
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                    ชุดข้อสอบในระบบ (Catalog)
                  </div>
                  <div style={{ fontSize: '1.875rem', fontWeight: 700, margin: '0.25rem 0', letterSpacing: '-0.5px' }}>
                    {subjects.length} <span style={{ fontSize: '0.875rem', fontWeight: 400, color: 'var(--text-muted)' }}>วิชา</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <CheckCircle2 size={13} /> 100% พร้อมใช้งาน
                  </div>
                </div>

                {/* Frame 2: Total Questions */}
                <div 
                  onClick={() => setCurrentNav('exams')}
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.borderColor = '#10b981'}
                  onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                >
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    background: '#10b981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '1rem', boxShadow: '0 2px 8px rgba(16,185,129,0.3)'
                  }}>
                    <Layers size={18} />
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                    คลังคำถามทั้งหมด (Question Bank)
                  </div>
                  <div style={{ fontSize: '1.875rem', fontWeight: 700, margin: '0.25rem 0', letterSpacing: '-0.5px' }}>
                    {totalQuestionsSum} <span style={{ fontSize: '0.875rem', fontWeight: 400, color: 'var(--text-muted)' }}>ข้อ</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    พร้อมเฉลย & สูตร KaTeX
                  </div>
                </div>

                {/* Frame 3: Pending Reports */}
                <div 
                  onClick={() => setCurrentNav('reports')}
                  style={{
                    background: 'var(--surface)',
                    border: reportStats.pending > 0 ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid var(--border-color)',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.borderColor = '#f59e0b'}
                  onMouseOut={(e) => e.currentTarget.style.borderColor = reportStats.pending > 0 ? 'rgba(245, 158, 11, 0.4)' : 'var(--border-color)'}
                >
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    background: '#f59e0b', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '1rem', boxShadow: '0 2px 8px rgba(245,158,11,0.3)'
                  }}>
                    <Clock size={18} />
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                    ปัญหารอตรวจสอบ (Pending Backlog)
                  </div>
                  <div style={{ fontSize: '1.875rem', fontWeight: 700, margin: '0.25rem 0', color: reportStats.pending > 0 ? '#f59e0b' : 'inherit', letterSpacing: '-0.5px' }}>
                    {reportStats.pending} <span style={{ fontSize: '0.875rem', fontWeight: 400, color: 'var(--text-muted)' }}>เรื่อง</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    จากทั้งหมด {reportStats.total} รายงาน
                  </div>
                </div>

                {/* Frame 4: Exam Runs */}
                <div 
                  onClick={() => setCurrentNav('scores')}
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                  onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                >
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    background: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '1rem', boxShadow: '0 2px 8px rgba(59,130,246,0.3)'
                  }}>
                    <BarChart3 size={18} />
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                    ประวัติการทำข้อสอบ (Runs Log)
                  </div>
                  <div style={{ fontSize: '1.875rem', fontWeight: 700, margin: '0.25rem 0', letterSpacing: '-0.5px' }}>
                    {userScoreLogs.length}+ <span style={{ fontSize: '0.875rem', fontWeight: 400, color: 'var(--text-muted)' }}>ครั้ง</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#10b981' }}>
                    ซิงค์กับ Supabase user_scores
                  </div>
                </div>
              </div>

              {/* Two Column Grid: Recent Incidents vs Exam Quick Access */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
                {/* Left Panel: Recent Incident Backlog */}
                <div style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <AlertTriangle size={16} color="#f59e0b" />
                      <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, margin: 0 }}>
                        รายการแจ้งปัญหาล่าสุด (Recent Reports)
                      </h3>
                    </div>
                    <button 
                      onClick={() => setCurrentNav('reports')}
                      style={{ fontSize: '0.75rem', color: 'var(--accent)', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 500 }}
                    >
                      ดูทั้งหมด →
                    </button>
                  </div>

                  {reports.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                      <CheckCircle2 size={32} style={{ color: '#10b981', margin: '0 auto 0.5rem', opacity: 0.8 }} />
                      <div>ไม่มีรายงานปัญหาค้างในระบบ</div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                      {reports.slice(0, 5).map(rep => {
                        const statusConfig = STATUS_CONFIG[rep.status || 'pending'] || STATUS_CONFIG.pending;
                        return (
                          <div 
                            key={rep.id}
                            style={{
                              padding: '0.75rem 0.875rem',
                              borderRadius: '8px',
                              background: 'var(--surface-hover)',
                              border: '1px solid var(--border-color)',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              gap: '0.75rem'
                            }}
                          >
                            <div style={{ minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.2rem' }}>
                                <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{rep.subject_name}</span>
                                {rep.question_number && (
                                  <span style={{ fontSize: '0.6875rem', background: 'rgba(0,112,243,0.1)', color: 'var(--accent)', padding: '0.1rem 0.35rem', borderRadius: '4px' }}>
                                    ข้อ {rep.question_number}
                                  </span>
                                )}
                              </div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                "{rep.description}"
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                              <span style={{
                                fontSize: '0.6875rem', fontWeight: 600, padding: '0.15rem 0.45rem',
                                borderRadius: '6px', background: statusConfig.bg, color: statusConfig.color
                              }}>
                                {statusConfig.label}
                              </span>

                              {rep.subject_id && rep.question_number && (
                                <button
                                  onClick={() => handleEditReportedQuestion(rep.subject_id, rep.question_number)}
                                  className="btn btn-primary"
                                  style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                                  title="แก้ไขข้อนี้ทันที"
                                >
                                  แก้ไข
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Right Panel: Exam Catalog Quick Access */}
                <div style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <BookOpen size={16} color="var(--accent)" />
                      <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, margin: 0 }}>
                        รายวิชายอดนิยม (Exam Catalog)
                      </h3>
                    </div>
                    <button 
                      onClick={() => setCurrentNav('exams')}
                      style={{ fontSize: '0.75rem', color: 'var(--accent)', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 500 }}
                    >
                      ดูทั้งหมด ({subjects.length}) →
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {subjects.slice(0, 5).map(sub => (
                      <div 
                        key={sub.id}
                        onClick={() => {
                          setCurrentNav('exams');
                          loadExamDetails(sub.id);
                        }}
                        style={{
                          padding: '0.65rem 0.875rem',
                          borderRadius: '8px',
                          background: 'var(--surface-hover)',
                          border: '1px solid var(--border-color)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                          <span style={{ fontSize: '1.125rem' }}>{sub.icon || '📝'}</span>
                          <div>
                            <div style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{sub.name}</div>
                            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{sub.category} • ปี {sub.year}</div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent)' }}>
                            {sub.questionCount} ข้อ
                          </span>
                          <ChevronRight size={14} color="var(--text-muted)" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 2: EXAMS MANAGEMENT                                                  */}
          {/* ========================================================================= */}
          {currentNav === 'exams' && (
            <div className="animate-fade-in">
              {!selectedExamId ? (
                /* 2A. EXAM LIST */
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div>
                      <h1 style={{ fontSize: '1.375rem', fontWeight: 700, margin: 0, letterSpacing: '-0.5px' }}>
                        จัดการชุดข้อสอบและเฉลย (Exam Catalog)
                      </h1>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>
                        เพิ่มข้อสอบ แก้ไขตัวเลือก ปรับเปลี่ยนเฉลยคำตอบ หรือนำเข้าข้อสอบจาก AI
                      </p>
                    </div>

                    <button 
                      className="btn btn-primary"
                      onClick={() => setShowNewExamModal(true)}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem' }}
                    >
                      <Plus size={16} />
                      <span>สร้างชุดข้อสอบใหม่</span>
                    </button>
                  </div>

                  {/* Filter & Year Toolbar */}
                  <div style={{
                    display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between',
                    background: 'var(--surface)', padding: '0.75rem 1rem', borderRadius: '10px',
                    border: '1px solid var(--border-color)', marginBottom: '1.5rem'
                  }}>
                    {/* Year Tabs with Badges */}
                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => setExamYearFilter('all')}
                        style={{
                          padding: '0.45rem 0.85rem', borderRadius: '6px',
                          border: examYearFilter === 'all' ? '1px solid var(--accent)' : '1px solid var(--border-color)',
                          background: examYearFilter === 'all' ? 'rgba(0,112,243,0.12)' : 'transparent',
                          color: examYearFilter === 'all' ? 'var(--accent)' : 'var(--text)',
                          fontSize: '0.8125rem', fontWeight: examYearFilter === 'all' ? 600 : 500,
                          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem'
                        }}
                      >
                        <span>ทุกชั้นปี</span>
                        <span style={{
                          fontSize: '0.6875rem', padding: '0.05rem 0.4rem', borderRadius: '10px',
                          background: examYearFilter === 'all' ? 'var(--accent)' : 'var(--surface-hover)',
                          color: examYearFilter === 'all' ? 'white' : 'var(--text-muted)'
                        }}>
                          {yearStats.all}
                        </span>
                      </button>

                      <button
                        onClick={() => setExamYearFilter('2')}
                        style={{
                          padding: '0.45rem 0.85rem', borderRadius: '6px',
                          border: examYearFilter === '2' ? '1px solid #10b981' : '1px solid var(--border-color)',
                          background: examYearFilter === '2' ? 'rgba(16, 185, 129, 0.12)' : 'transparent',
                          color: examYearFilter === '2' ? '#10b981' : 'var(--text)',
                          fontSize: '0.8125rem', fontWeight: examYearFilter === '2' ? 600 : 500,
                          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem'
                        }}
                      >
                        <GraduationCap size={14} color={examYearFilter === '2' ? '#10b981' : 'var(--text-muted)'} />
                        <span>ชั้นปีที่ 2</span>
                        <span style={{
                          fontSize: '0.6875rem', padding: '0.05rem 0.4rem', borderRadius: '10px',
                          background: examYearFilter === '2' ? '#10b981' : 'var(--surface-hover)',
                          color: examYearFilter === '2' ? 'white' : 'var(--text-muted)'
                        }}>
                          {yearStats['2'] || 0}
                        </span>
                      </button>

                      <button
                        onClick={() => setExamYearFilter('3')}
                        style={{
                          padding: '0.45rem 0.85rem', borderRadius: '6px',
                          border: examYearFilter === '3' ? '1px solid #6366f1' : '1px solid var(--border-color)',
                          background: examYearFilter === '3' ? 'rgba(99, 102, 241, 0.12)' : 'transparent',
                          color: examYearFilter === '3' ? '#6366f1' : 'var(--text)',
                          fontSize: '0.8125rem', fontWeight: examYearFilter === '3' ? 600 : 500,
                          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem'
                        }}
                      >
                        <GraduationCap size={14} color={examYearFilter === '3' ? '#6366f1' : 'var(--text-muted)'} />
                        <span>ชั้นปีที่ 3</span>
                        <span style={{
                          fontSize: '0.6875rem', padding: '0.05rem 0.4rem', borderRadius: '10px',
                          background: examYearFilter === '3' ? '#6366f1' : 'var(--surface-hover)',
                          color: examYearFilter === '3' ? 'white' : 'var(--text-muted)'
                        }}>
                          {yearStats['3'] || 0}
                        </span>
                      </button>
                    </div>

                    {/* Search Input */}
                    <div style={{ flex: '1 1 220px', maxWidth: '340px', position: 'relative' }}>
                      <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input 
                        type="text"
                        placeholder="ค้นหาชื่อวิชา หรือหมวดหมู่..."
                        value={examSearchQuery}
                        onChange={(e) => setExamSearchQuery(e.target.value)}
                        style={{
                          width: '100%', padding: '0.45rem 0.75rem 0.45rem 2.2rem',
                          borderRadius: '6px', border: '1px solid var(--border-color)',
                          background: 'var(--surface-hover)', color: 'var(--text)',
                          fontSize: '0.8125rem', fontFamily: 'var(--font-sans)', outline: 'none'
                        }}
                      />
                      {examSearchQuery && (
                        <button
                          onClick={() => setExamSearchQuery('')}
                          style={{
                            position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)',
                            background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.6875rem'
                          }}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Grouped Exams Content */}
                  {examsGroupedByYear.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3.5rem 1rem', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                      <Search size={36} style={{ color: 'var(--text-muted)', margin: '0 auto 0.75rem', opacity: 0.5 }} />
                      <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>ไม่พบชุดข้อสอบที่ค้นหา</h3>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>ลองค้นหาด้วยคำสำคัญอื่น หรือเปลี่ยนตัวกรองชั้นปี</p>
                      <button className="btn btn-outline" onClick={() => { setExamSearchQuery(''); setExamYearFilter('all'); }}>
                        ล้างการค้นหา
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                      {examsGroupedByYear.map(group => {
                        const isYear2 = group.year === '2';
                        const themeColor = isYear2 ? '#10b981' : '#6366f1';
                        const themeBg = isYear2 ? 'rgba(16, 185, 129, 0.08)' : 'rgba(99, 102, 241, 0.08)';
                        const themeBorder = isYear2 ? 'rgba(16, 185, 129, 0.25)' : 'rgba(99, 102, 241, 0.25)';

                        return (
                          <div key={group.year} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {/* Year Header Banner */}
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              flexWrap: 'wrap',
                              gap: '0.75rem',
                              padding: '0.875rem 1.25rem',
                              background: themeBg,
                              border: `1px solid ${themeBorder}`,
                              borderRadius: '12px'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{
                                  width: '36px', height: '36px', borderRadius: '8px',
                                  background: 'var(--surface)', color: themeColor,
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  boxShadow: '0 2px 4px rgba(0,0,0,0.06)'
                                }}>
                                  <GraduationCap size={20} />
                                </div>
                                <div>
                                  <div style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span>ข้อสอบชั้นปีที่ {group.year} (Year {group.year})</span>
                                  </div>
                                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    {group.exams.length} รายวิชา • รวม {group.totalQuestions} ข้อสอบ
                                  </div>
                                </div>
                              </div>

                              <div style={{
                                padding: '0.25rem 0.75rem',
                                borderRadius: '20px',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                background: themeColor,
                                color: 'white',
                                letterSpacing: '0.02em'
                              }}>
                                ชั้นปี {group.year}
                              </div>
                            </div>

                            {/* Year Exams Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                              {group.exams.map(exam => {
                                const customKey = `examhub_custom_exam_${exam.id}`;
                                const isModified = !!localStorage.getItem(customKey);

                                return (
                                  <div 
                                    key={exam.id}
                                    onClick={() => loadExamDetails(exam.id)}
                                    style={{
                                      background: 'var(--surface)',
                                      border: isModified ? '1px solid var(--accent)' : '1px solid var(--border-color)',
                                      borderRadius: '12px',
                                      padding: '1.25rem',
                                      cursor: 'pointer',
                                      display: 'flex',
                                      flexDirection: 'column',
                                      justifyContent: 'space-between',
                                      position: 'relative',
                                      transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                                    }}
                                  >
                                    {isModified && (
                                      <span style={{
                                        position: 'absolute', top: '12px', right: '12px',
                                        fontSize: '0.625rem', fontWeight: 700,
                                        background: 'rgba(0,112,243,0.12)', color: 'var(--accent)',
                                        padding: '0.15rem 0.45rem', borderRadius: '4px'
                                      }}>
                                        LOCAL EDITED
                                      </span>
                                    )}

                                    <div>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.75rem' }}>
                                        <div style={{
                                          width: '36px', height: '36px', borderRadius: '8px',
                                          background: exam.iconBg || 'rgba(0, 112, 243, 0.1)',
                                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem'
                                        }}>
                                          {exam.icon || '📚'}
                                        </div>
                                        <div>
                                          <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                                            {exam.category}
                                          </span>
                                        </div>
                                      </div>

                                      <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '0.35rem', lineHeight: 1.4 }}>
                                        {exam.name}
                                      </h3>
                                      <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', lineHeight: 1.4, marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                        {exam.desc || 'ชุดข้อสอบจำลอง'}
                                      </p>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                                      <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: themeColor }}>
                                        {exam.questionCount} ข้อสอบ
                                      </span>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                        <span>เปิดจัดการ</span>
                                        <ChevronRight size={14} />
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                /* 2B. SPECIFIC EXAM QUESTION MANAGER */
                <div>
                  {/* Top Exam Navigation Bar */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                    <button 
                      className="btn btn-outline"
                      onClick={() => {
                        setSelectedExamId(null);
                        setLoadedExamData(null);
                      }}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem' }}
                    >
                      <ArrowLeft size={14} /> ย้อนกลับรายวิชา
                    </button>

                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      <button 
                        className="btn btn-primary"
                        onClick={() => openQuestionEditor(-1)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem' }}
                      >
                        <Plus size={15} />
                        <span>เพิ่มข้อสอบใหม่ (+1)</span>
                      </button>

                      <button 
                        className="btn btn-outline"
                        onClick={() => setShowImportModal(true)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem' }}
                        title="นำเข้าข้อสอบจาก AI หรือ JSON"
                      >
                        <Upload size={13} />
                        <span>นำเข้า (Import)</span>
                      </button>

                      <button 
                        className="btn btn-outline"
                        onClick={() => handleDownloadExamJSON(loadedExamData)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem' }}
                        title="ดาวน์โหลด JSON"
                      >
                        <Download size={13} />
                        <span>ดาวน์โหลด JSON</span>
                      </button>

                      <button 
                        className="btn btn-outline"
                        onClick={() => handleCopyExamJSON(loadedExamData)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem' }}
                        title="คัดลอกโค้ด JSON ทั้งหมด"
                      >
                        <Copy size={13} />
                        <span>คัดลอก JSON</span>
                      </button>

                      {loadedExamData?.isCustomModified && (
                        <button 
                          className="btn btn-outline"
                          onClick={() => handleResetExamToDefault(selectedExamId)}
                          style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem', color: '#ef4444' }}
                          title="รีเซ็ตเป็นค่าเริ่มต้น"
                        >
                          <RotateCcw size={13} />
                          <span>รีเซ็ตค่าเดิม</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Exam Info Card */}
                  {loadingExam ? (
                    <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                      <div className="spinner" style={{ width: '36px', height: '36px', border: '3px solid var(--border-color)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>กำลังโหลดคำถาม...</p>
                    </div>
                  ) : loadedExamData && (
                    <div>
                      <div style={{
                        background: 'var(--surface)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '12px',
                        padding: '1.25rem',
                        marginBottom: '1.25rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '1rem'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                          <div style={{
                            width: '42px', height: '42px', borderRadius: '10px',
                            background: loadedExamData.iconBg || 'rgba(0,112,243,0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.375rem'
                          }}>
                            {loadedExamData.icon || '📝'}
                          </div>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0 }}>
                                {loadedExamData.name}
                              </h2>
                              {loadedExamData.isCustomModified && (
                                <span style={{ fontSize: '0.625rem', fontWeight: 700, background: 'rgba(0,112,243,0.12)', color: 'var(--accent)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                                  LOCAL SAVED
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              หมวดหมู่: {loadedExamData.category} • ไฟล์: <code>{selectedExamId}.json</code>
                            </div>
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent)', lineHeight: 1 }}>
                            {loadedExamData.questions?.length || 0}
                          </div>
                          <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>ข้อสอบทั้งหมด</div>
                        </div>
                      </div>

                      {/* Question Search & Jump Nav */}
                      <div style={{
                        background: 'var(--surface)', padding: '0.65rem 0.875rem', borderRadius: '8px',
                        border: '1px solid var(--border-color)', marginBottom: '1.25rem', display: 'flex', gap: '0.75rem', alignItems: 'center'
                      }}>
                        <Search size={14} style={{ color: 'var(--text-muted)' }} />
                        <input 
                          type="text"
                          placeholder="ค้นหาข้อที่, คำถาม, ตัวเลือก หรือคำเฉลย..."
                          value={questionSearchQuery}
                          onChange={(e) => setQuestionSearchQuery(e.target.value)}
                          style={{
                            flex: 1, border: 'none', background: 'transparent',
                            color: 'var(--text)', fontSize: '0.8125rem', fontFamily: 'var(--font-sans)', outline: 'none'
                          }}
                        />
                        {questionSearchQuery && (
                          <button onClick={() => setQuestionSearchQuery('')} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.75rem' }}>
                            ล้างค้นหา
                          </button>
                        )}
                      </div>

                      {/* Questions List */}
                      {filteredQuestions.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                          <FileText size={32} style={{ color: 'var(--text-muted)', margin: '0 auto 0.5rem', opacity: 0.5 }} />
                          <div style={{ fontSize: '0.9375rem', fontWeight: 600 }}>ไม่พบคำถาม</div>
                          <button className="btn btn-primary" onClick={() => openQuestionEditor(-1)} style={{ marginTop: '0.75rem' }}>
                            + เพิ่มข้อสอบข้อแรก
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                          {filteredQuestions.map((qItem, index) => {
                            const origIdx = loadedExamData.questions.indexOf(qItem);
                            const displayIdx = origIdx >= 0 ? origIdx : index;

                            return (
                              <div 
                                key={displayIdx}
                                style={{
                                  background: 'var(--surface)',
                                  border: '1px solid var(--border-color)',
                                  borderRadius: '10px',
                                  padding: '1.25rem'
                                }}
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                  <span style={{
                                    fontSize: '0.75rem', fontWeight: 700,
                                    background: 'var(--surface-hover)', border: '1px solid var(--border-color)',
                                    color: 'var(--text)', padding: '0.2rem 0.55rem', borderRadius: '6px'
                                  }}>
                                    ข้อที่ {displayIdx + 1}
                                  </span>

                                  <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                                    <button 
                                      className="btn btn-outline"
                                      onClick={() => handleMoveQuestion(displayIdx, displayIdx - 1)}
                                      disabled={displayIdx === 0}
                                      style={{ padding: '0.25rem 0.45rem', fontSize: '0.6875rem' }}
                                      title="เลื่อนขึ้น"
                                    >
                                      ▲
                                    </button>
                                    <button 
                                      className="btn btn-outline"
                                      onClick={() => handleMoveQuestion(displayIdx, displayIdx + 1)}
                                      disabled={displayIdx === loadedExamData.questions.length - 1}
                                      style={{ padding: '0.25rem 0.45rem', fontSize: '0.6875rem' }}
                                      title="เลื่อนลง"
                                    >
                                      ▼
                                    </button>
                                    <button 
                                      className="btn btn-outline"
                                      onClick={() => handleDuplicateQuestion(displayIdx)}
                                      style={{ padding: '0.25rem 0.45rem', fontSize: '0.75rem' }}
                                      title="คัดลอกข้อนี้"
                                    >
                                      <Copy size={13} />
                                    </button>
                                    <button 
                                      className="btn btn-primary"
                                      onClick={() => openQuestionEditor(displayIdx, qItem)}
                                      style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                                    >
                                      <Edit3 size={13} />
                                      <span>แก้ไข</span>
                                    </button>
                                    <button 
                                      className="btn btn-outline"
                                      onClick={() => handleDeleteQuestion(displayIdx)}
                                      style={{ padding: '0.25rem 0.45rem', fontSize: '0.75rem', color: '#ef4444' }}
                                      title="ลบข้อนี้"
                                    >
                                      <Trash2 size={13} />
                                    </button>
                                  </div>
                                </div>

                                <div style={{ fontSize: '0.9375rem', fontWeight: 600, lineHeight: 1.5, marginBottom: '0.875rem' }}>
                                  {renderTextWithMath(qItem.q)}
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.4rem', marginBottom: '0.75rem' }}>
                                  {(qItem.choices || []).map((choice, cIdx) => {
                                    const isCorrect = cIdx === qItem.answer;
                                    return (
                                      <div 
                                        key={cIdx}
                                        style={{
                                          padding: '0.5rem 0.75rem',
                                          borderRadius: '6px',
                                          border: isCorrect ? '1px solid #10b981' : '1px solid var(--border-color)',
                                          background: isCorrect ? 'rgba(16, 185, 129, 0.1)' : 'var(--surface-hover)',
                                          fontSize: '0.8125rem',
                                          display: 'flex',
                                          alignItems: 'flex-start',
                                          gap: '0.5rem'
                                        }}
                                      >
                                        <span style={{ fontWeight: 700, color: isCorrect ? '#10b981' : 'var(--text-muted)' }}>
                                          {String.fromCharCode(65 + cIdx)}.
                                        </span>
                                        <span style={{ flex: 1, fontWeight: isCorrect ? 600 : 400 }}>
                                          {renderTextWithMath(choice)}
                                        </span>
                                        {isCorrect && <Check size={13} color="#10b981" />}
                                      </div>
                                    );
                                  })}
                                </div>

                                {qItem.explain && (
                                  <div style={{
                                    background: 'rgba(0, 112, 243, 0.06)',
                                    border: '1px solid rgba(0, 112, 243, 0.15)',
                                    padding: '0.6rem 0.85rem',
                                    borderRadius: '6px',
                                    fontSize: '0.75rem',
                                    color: 'var(--text)'
                                  }}>
                                    <span style={{ fontWeight: 600, color: 'var(--accent)', marginRight: '0.35rem' }}>
                                      💡 เฉลย:
                                    </span>
                                    <span>{renderTextWithMath(qItem.explain)}</span>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 3: REPORT INBOX (Incidents Management)                                */}
          {/* ========================================================================= */}
          {currentNav === 'reports' && (
            <div className="animate-fade-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <h1 style={{ fontSize: '1.375rem', fontWeight: 700, margin: 0, letterSpacing: '-0.5px' }}>
                    กล่องรายงานปัญหา (Incident Backlog)
                  </h1>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>
                    ตรวจสอบและแก้ไขข้อสอบที่ผู้ใช้รายงานเข้ามา พร้อมอัปเดตสถานะ
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    className="btn btn-outline"
                    onClick={() => fetchReports(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem' }}
                  >
                    <RefreshCw size={13} className={refreshingReports ? 'animate-spin' : ''} />
                    <span>รีเฟรชข้อมูล</span>
                  </button>
                </div>
              </div>

              {/* Filter Pills */}
              <div style={{
                display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center',
                background: 'var(--surface)', padding: '0.75rem 1rem', borderRadius: '10px',
                border: '1px solid var(--border-color)', marginBottom: '1.25rem'
              }}>
                <div style={{ flex: '1 1 220px', position: 'relative' }}>
                  <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    type="text"
                    placeholder="ค้นหารหัส, รายละเอียด, วิชา, อีเมล..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%', padding: '0.45rem 0.75rem 0.45rem 2.2rem',
                      borderRadius: '6px', border: '1px solid var(--border-color)',
                      background: 'var(--surface-hover)', color: 'var(--text)',
                      fontSize: '0.8125rem', fontFamily: 'var(--font-sans)', outline: 'none'
                    }}
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{
                    padding: '0.45rem 0.65rem', borderRadius: '6px', border: '1px solid var(--border-color)',
                    background: 'var(--surface-hover)', color: 'var(--text)', fontSize: '0.8125rem', fontFamily: 'var(--font-sans)', outline: 'none'
                  }}
                >
                  <option value="all">ทุกสถานะ ({reports.length})</option>
                  <option value="pending">⏳ รอตรวจสอบ ({reportStats.pending})</option>
                  <option value="investigating">🔍 กำลังตรวจ ({reportStats.investigating})</option>
                  <option value="resolved">✅ แก้ไขแล้ว ({reportStats.resolved})</option>
                  <option value="dismissed">🚫 ปิดเรื่อง ({reportStats.dismissed})</option>
                </select>

                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  style={{
                    padding: '0.45rem 0.65rem', borderRadius: '6px', border: '1px solid var(--border-color)',
                    background: 'var(--surface-hover)', color: 'var(--text)', fontSize: '0.8125rem', fontFamily: 'var(--font-sans)', outline: 'none'
                  }}
                >
                  <option value="all">ทุกประเภทปัญหา</option>
                  {Object.entries(ISSUE_TYPES_MAP).map(([k, v]) => (
                    <option key={k} value={k}>{v.label}</option>
                  ))}
                </select>
              </div>

              {/* Reports List */}
              {loadingReports ? (
                <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                  <div className="spinner" style={{ width: '36px', height: '36px', border: '3px solid var(--border-color)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>กำลังโหลดรายงานปัญหา...</p>
                </div>
              ) : filteredReports.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3.5rem 1rem', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <ShieldCheck size={36} style={{ color: 'var(--text-muted)', margin: '0 auto 0.5rem', opacity: 0.5 }} />
                  <div style={{ fontSize: '0.9375rem', fontWeight: 600 }}>ไม่พบรายงานปัญหาที่ตรงกับตัวกรอง</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                  {filteredReports.map(rep => {
                    const statusConfig = STATUS_CONFIG[rep.status || 'pending'] || STATUS_CONFIG.pending;
                    const issueType = ISSUE_TYPES_MAP[rep.issue_type] || ISSUE_TYPES_MAP.other;
                    const TypeIcon = issueType.icon;
                    const adminNote = adminNotes[rep.id];

                    return (
                      <div 
                        key={rep.id}
                        style={{
                          background: 'var(--surface)',
                          border: `1px solid ${statusConfig.border}`,
                          borderRadius: '10px',
                          padding: '1.25rem',
                          position: 'relative'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                            <span style={{
                              fontSize: '0.75rem', fontWeight: 600, padding: '0.15rem 0.5rem',
                              borderRadius: '4px', background: statusConfig.bg, color: statusConfig.color
                            }}>
                              {statusConfig.label}
                            </span>

                            <span style={{
                              fontSize: '0.75rem', fontWeight: 500, padding: '0.15rem 0.5rem',
                              borderRadius: '4px', background: issueType.bg, color: issueType.color,
                              display: 'inline-flex', alignItems: 'center', gap: '0.25rem'
                            }}>
                              <TypeIcon size={12} />
                              <span>{issueType.label}</span>
                            </span>

                            <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                              {rep.id}
                            </span>
                          </div>

                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {new Date(rep.created_at).toLocaleDateString('th-TH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
                          <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{rep.subject_name || 'ไม่ระบุวิชา'}</span>
                          {rep.question_number && (
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, background: 'rgba(0,112,243,0.1)', color: 'var(--accent)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                              ข้อที่ {rep.question_number}
                            </span>
                          )}
                        </div>

                        <div style={{
                          background: 'var(--surface-hover)', padding: '0.75rem 0.875rem', borderRadius: '6px',
                          border: '1px solid var(--border-color)', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '0.75rem'
                        }}>
                          {rep.description}
                        </div>

                        {adminNote && (
                          <div style={{
                            background: 'rgba(16, 185, 129, 0.08)', borderLeft: '3px solid #10b981',
                            padding: '0.5rem 0.75rem', borderRadius: '4px', fontSize: '0.75rem', marginBottom: '0.75rem'
                          }}>
                            <strong>บันทึกแอดมิน:</strong> {adminNote}
                          </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            ผู้ส่ง: {rep.contact_email || 'ผู้ใช้ทั่วไป'}
                          </span>

                          <div style={{ display: 'flex', gap: '0.4rem' }}>
                            {rep.subject_id && rep.question_number && (
                              <button 
                                className="btn btn-primary"
                                onClick={() => handleEditReportedQuestion(rep.subject_id, rep.question_number)}
                                style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                              >
                                <Edit3 size={12} />
                                <span>แก้ไขโจทย์ข้อนี้</span>
                              </button>
                            )}

                            <button 
                              className="btn btn-outline"
                              onClick={() => setEditingReport(rep)}
                              style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                            >
                              เปลี่ยนสถานะ
                            </button>

                            <button 
                              className="btn btn-outline"
                              onClick={() => setDeleteConfirmReport(rep)}
                              style={{ fontSize: '0.75rem', padding: '0.3rem 0.5rem', color: '#ef4444' }}
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 4: SCORES & RUNS LOG                                                 */}
          {/* ========================================================================= */}
          {currentNav === 'scores' && (
            <div className="animate-fade-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <h1 style={{ fontSize: '1.375rem', fontWeight: 700, margin: 0, letterSpacing: '-0.5px' }}>
                    ประวัติการสอบสะสม (Exam Runs & Scores)
                  </h1>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>
                    รายการการทำข้อสอบล่าสุดของผู้ใช้งานจากฐานข้อมูล Supabase
                  </p>
                </div>

                <button 
                  className="btn btn-outline"
                  onClick={fetchScoreLogs}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem' }}
                >
                  <RefreshCw size={13} className={loadingScores ? 'animate-spin' : ''} />
                  <span>รีเฟรช</span>
                </button>
              </div>

              {loadingScores ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                  <div className="spinner" style={{ width: '32px', height: '32px', border: '3px solid var(--border-color)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 0.75rem' }} />
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>กำลังโหลดข้อมูล...</p>
                </div>
              ) : userScoreLogs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <BarChart3 size={32} style={{ color: 'var(--text-muted)', margin: '0 auto 0.5rem', opacity: 0.5 }} />
                  <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>ยังไม่มีประวัติการส่งข้อสอบ</div>
                </div>
              ) : (
                <div style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '120px 1fr 120px 160px',
                    padding: '0.75rem 1rem',
                    background: 'var(--surface-hover)',
                    borderBottom: '1px solid var(--border-color)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: 'var(--text-muted)'
                  }}>
                    <span>รหัสผู้ใช้</span>
                    <span>ชุดข้อสอบ (Exam)</span>
                    <span>คะแนนที่ได้</span>
                    <span>วันที่สอบ</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {userScoreLogs.map((log, idx) => (
                      <div 
                        key={log.id || idx}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '120px 1fr 120px 160px',
                          padding: '0.75rem 1rem',
                          borderBottom: '1px solid var(--border-color)',
                          fontSize: '0.8125rem',
                          alignItems: 'center'
                        }}
                      >
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {(log.user_id || '').substring(0, 8)}...
                        </span>
                        <span style={{ fontWeight: 500 }}>
                          {log.exam_id}
                        </span>
                        <span style={{ fontWeight: 700, color: '#10b981' }}>
                          {log.score} คะแนน
                        </span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                          {new Date(log.created_at).toLocaleDateString('th-TH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      {/* ========================================================================= */}
      {/* 3. QUESTION EDITOR MODAL                                                  */}
      {/* ========================================================================= */}
      {editingQuestionIndex !== null && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)',
          zIndex: 220, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1rem'
        }}>
          <div style={{
            background: 'var(--surface)',
            maxWidth: '800px', width: '100%', maxHeight: '92vh',
            display: 'flex', flexDirection: 'column', borderRadius: '14px',
            border: '1px solid var(--border-color)',
            overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.4)'
          }}>
            <div style={{
              padding: '1.125rem 1.25rem',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Edit3 size={16} color="var(--accent)" />
                {editingQuestionIndex === -1 
                  ? `เพิ่มข้อสอบใหม่ (ข้อที่ ${(loadedExamData?.questions?.length || 0) + 1})`
                  : `แก้ไขข้อสอบข้อที่ ${editingQuestionIndex + 1}`
                }
              </h3>
              <button onClick={() => setEditingQuestionIndex(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '1.25rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                  โจทย์คำถาม (รองรับ $KaTeX Math$) <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="กรุณากรอกโจทย์คำถาม..."
                  value={questionFormData.q}
                  onChange={(e) => setQuestionFormData({ ...questionFormData, q: e.target.value })}
                  style={{
                    width: '100%', padding: '0.65rem', borderRadius: '6px',
                    border: '1px solid var(--border-color)', background: 'var(--surface-hover)',
                    color: 'var(--text)', fontSize: '0.875rem', fontFamily: 'var(--font-sans)', outline: 'none'
                  }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
                    ตัวเลือก (Choices) — เลือกวงกลมข้อที่ถูกต้อง <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setQuestionFormData({ ...questionFormData, choices: [...questionFormData.choices, ''] })}
                    style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text)', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    + เพิ่มตัวเลือก
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {questionFormData.choices.map((choice, idx) => {
                    const isSelected = questionFormData.answer === idx;
                    return (
                      <div 
                        key={idx}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '0.5rem',
                          padding: '0.4rem 0.65rem', borderRadius: '6px',
                          border: isSelected ? '1px solid #10b981' : '1px solid var(--border-color)',
                          background: isSelected ? 'rgba(16, 185, 129, 0.08)' : 'var(--surface-hover)'
                        }}
                      >
                        <input 
                          type="radio"
                          name="q_ans_radio"
                          checked={isSelected}
                          onChange={() => setQuestionFormData({ ...questionFormData, answer: idx })}
                          style={{ cursor: 'pointer', accentColor: '#10b981' }}
                        />
                        <span style={{ fontWeight: 700, fontSize: '0.8125rem', color: isSelected ? '#10b981' : 'var(--text)' }}>
                          {String.fromCharCode(65 + idx)}.
                        </span>
                        <input 
                          type="text"
                          value={choice}
                          onChange={(e) => {
                            const newC = [...questionFormData.choices];
                            newC[idx] = e.target.value;
                            setQuestionFormData({ ...questionFormData, choices: newC });
                          }}
                          style={{
                            flex: 1, padding: '0.35rem 0.5rem', borderRadius: '4px',
                            border: '1px solid var(--border-color)', background: 'var(--surface)',
                            color: 'var(--text)', fontSize: '0.8125rem', fontFamily: 'var(--font-sans)', outline: 'none'
                          }}
                        />
                        {questionFormData.choices.length > 2 && (
                          <button
                            type="button"
                            onClick={() => {
                              const newC = questionFormData.choices.filter((_, i) => i !== idx);
                              const newA = questionFormData.answer >= newC.length ? 0 : questionFormData.answer;
                              setQuestionFormData({ ...questionFormData, choices: newC, answer: newA });
                            }}
                            style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                  คำอธิบายเฉลย (Explanation)
                </label>
                <textarea
                  rows={2}
                  placeholder="อธิบายเหตุผลของเฉลย..."
                  value={questionFormData.explain}
                  onChange={(e) => setQuestionFormData({ ...questionFormData, explain: e.target.value })}
                  style={{
                    width: '100%', padding: '0.65rem', borderRadius: '6px',
                    border: '1px solid var(--border-color)', background: 'var(--surface-hover)',
                    color: 'var(--text)', fontSize: '0.8125rem', fontFamily: 'var(--font-sans)', outline: 'none'
                  }}
                />
              </div>

              {/* Student Preview Box */}
              <div style={{
                background: 'var(--surface-hover)', border: '1px solid var(--border-color)',
                borderRadius: '8px', padding: '0.75rem', fontSize: '0.8125rem'
              }}>
                <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--accent)', marginBottom: '0.35rem' }}>
                  ตัวอย่างการแสดงผลจริง (Live Preview):
                </div>
                <div style={{ fontWeight: 600, marginBottom: '0.4rem' }}>
                  {questionFormData.q ? renderTextWithMath(questionFormData.q) : '(ยังไม่มีคำถาม)'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  {questionFormData.choices.map((c, idx) => (
                    <div key={idx} style={{ color: idx === questionFormData.answer ? '#10b981' : 'var(--text)', fontWeight: idx === questionFormData.answer ? 600 : 400 }}>
                      {String.fromCharCode(65 + idx)}. {c ? renderTextWithMath(c) : '(ว่าง)'} {idx === questionFormData.answer && '✓ (เฉลย)'}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{
              padding: '0.875rem 1.25rem', borderTop: '1px solid var(--border-color)',
              display: 'flex', justifyContent: 'flex-end', gap: '0.5rem'
            }}>
              <button className="btn btn-outline" onClick={() => setEditingQuestionIndex(null)}>ยกเลิก</button>
              <button className="btn btn-primary" onClick={handleSaveQuestion}>
                <Save size={14} /> บันทึกข้อสอบ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. BULK IMPORT MODAL                                                      */}
      {/* ========================================================================= */}
      {showImportModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)',
          zIndex: 220, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1rem'
        }}>
          <div style={{
            background: 'var(--surface)', maxWidth: '650px', width: '100%', maxHeight: '90vh',
            borderRadius: '14px', border: '1px solid var(--border-color)', overflow: 'hidden',
            display: 'flex', flexDirection: 'column'
          }}>
            <div style={{ padding: '1.125rem 1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Upload size={16} color="var(--accent)" /> นำเข้าข้อสอบแบบชุด (Bulk AI Import)
              </h3>
              <button onClick={() => setShowImportModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '1.25rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: 0 }}>
                วางข้อความข้อสอบจาก ChatGPT/Gemini หรือ JSON Array ระบบจะแปลงให้อัตโนมัติ:
              </p>

              {importError && (
                <div style={{ padding: '0.5rem 0.75rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '6px', fontSize: '0.8125rem' }}>
                  {importError}
                </div>
              )}

              <textarea 
                rows={9}
                placeholder={`1. ข้อสอบคำถามคืออะไร?
A. ตัวเลือก 1
B. ตัวเลือก 2
C. ตัวเลือก 3
D. ตัวเลือก 4
เฉลย: B
คำอธิบาย: ...`}
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                style={{
                  width: '100%', padding: '0.65rem', borderRadius: '6px',
                  border: '1px solid var(--border-color)', background: 'var(--surface-hover)',
                  color: 'var(--text)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', outline: 'none'
                }}
              />
            </div>

            <div style={{ padding: '0.875rem 1.25rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button className="btn btn-outline" onClick={() => setShowImportModal(false)}>ยกเลิก</button>
              <button className="btn btn-primary" onClick={handleProcessImport}>
                <Upload size={14} /> นำเข้าข้อมูล
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. NEW EXAM MODAL                                                         */}
      {/* ========================================================================= */}
      {showNewExamModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)',
          zIndex: 220, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1rem'
        }}>
          <div style={{
            background: 'var(--surface)', maxWidth: '520px', width: '100%',
            borderRadius: '14px', border: '1px solid var(--border-color)', overflow: 'hidden'
          }}>
            <div style={{ padding: '1.125rem 1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Plus size={16} color="var(--accent)" /> สร้างชุดข้อสอบใหม่
              </h3>
              <button onClick={() => setShowNewExamModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const cleanId = newExamForm.id.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');
              const newExamObj = {
                id: cleanId,
                name: newExamForm.name.trim(),
                category: newExamForm.category.trim() || 'General',
                icon: newExamForm.icon || '📝',
                color: newExamForm.color || '#0070f3',
                iconBg: `${newExamForm.color || '#0070f3'}26`,
                desc: newExamForm.desc.trim(),
                year: parseInt(newExamForm.year, 10) || 3,
                type: newExamForm.type || 'Midterm',
                questions: []
              };
              localStorage.setItem(`examhub_custom_exam_${cleanId}`, JSON.stringify(newExamObj));
              setShowNewExamModal(false);
              showToast(`สร้างวิชา "${newExamObj.name}" สำเร็จ`);
              loadExamDetails(cleanId);
            }} style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <div>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>
                  รหัส ID (เช่น ai_intro_30q) <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input 
                  type="text"
                  required
                  placeholder="เช่น ai_intro_30q"
                  value={newExamForm.id}
                  onChange={(e) => setNewExamForm({ ...newExamForm, id: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--surface-hover)', color: 'var(--text)', fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>
                  ชื่อชุดข้อสอบ <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input 
                  type="text"
                  required
                  placeholder="เช่น Artificial Intelligence Midterm"
                  value={newExamForm.name}
                  onChange={(e) => setNewExamForm({ ...newExamForm, name: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--surface-hover)', color: 'var(--text)', fontSize: '0.8125rem', fontFamily: 'var(--font-sans)', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>หมวดหมู่</label>
                  <input 
                    type="text"
                    placeholder="เช่น Data Science"
                    value={newExamForm.category}
                    onChange={(e) => setNewExamForm({ ...newExamForm, category: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--surface-hover)', color: 'var(--text)', fontSize: '0.8125rem', fontFamily: 'var(--font-sans)', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>ชั้นปี</label>
                  <select
                    value={newExamForm.year}
                    onChange={(e) => setNewExamForm({ ...newExamForm, year: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--surface-hover)', color: 'var(--text)', fontSize: '0.8125rem', fontFamily: 'var(--font-sans)', outline: 'none' }}
                  >
                    <option value={2}>ปี 2</option>
                    <option value={3}>ปี 3</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowNewExamModal(false)}>ยกเลิก</button>
                <button type="submit" className="btn btn-primary">+ สร้างชุดข้อสอบ</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. EDIT STATUS MODAL                                                      */}
      {/* ========================================================================= */}
      {editingReport && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
          zIndex: 220, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1rem'
        }}>
          <div style={{
            background: 'var(--surface)', maxWidth: '480px', width: '100%',
            borderRadius: '12px', border: '1px solid var(--border-color)', padding: '1.25rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>อัปเดตสถานะรีพอร์ต</h3>
              <button onClick={() => setEditingReport(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
              {Object.entries(STATUS_CONFIG).map(([k, cfg]) => (
                <button
                  key={k}
                  onClick={() => handleUpdateStatus(editingReport.id, k, adminNotes[editingReport.id] || '')}
                  style={{
                    padding: '0.65rem', borderRadius: '6px',
                    border: (editingReport.status || 'pending') === k ? `2px solid ${cfg.color}` : '1px solid var(--border-color)',
                    background: (editingReport.status || 'pending') === k ? cfg.bg : 'transparent',
                    color: (editingReport.status || 'pending') === k ? cfg.color : 'var(--text)',
                    fontWeight: 600, fontSize: '0.8125rem', fontFamily: 'var(--font-sans)', cursor: 'pointer'
                  }}
                >
                  {cfg.label}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-outline" onClick={() => setEditingReport(null)}>ปิด</button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. DELETE CONFIRM MODAL                                                   */}
      {/* ========================================================================= */}
      {deleteConfirmReport && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
          zIndex: 220, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1rem'
        }}>
          <div style={{
            background: 'var(--surface)', maxWidth: '400px', width: '100%',
            borderRadius: '12px', border: '1px solid var(--border-color)', padding: '1.5rem', textAlign: 'center'
          }}>
            <Trash2 size={32} color="#ef4444" style={{ margin: '0 auto 0.75rem' }} />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem' }}>ยืนยันลบรายงาน</h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              ต้องการลบรายงานรหัส <code>{deleteConfirmReport.id}</code> ออกจากระบบ?
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
              <button className="btn btn-outline" onClick={() => setDeleteConfirmReport(null)}>ยกเลิก</button>
              <button className="btn btn-primary" style={{ background: '#ef4444', borderColor: '#ef4444', color: 'white' }} onClick={() => handleDeleteReport(deleteConfirmReport.id)}>
                ยืนยันลบ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
