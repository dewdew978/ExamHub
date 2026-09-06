/**
 * Exam References & Source Citations
 * Provides structured bibliographic references and educational source metadata
 * for all exam subjects on EXETIA.
 */

export const EXAM_REFERENCES = {
  // AWS Academy Modules
  'aws_aca_modules_50q': {
    primarySource: 'AWS Academy Cloud Architecting (ACA) — Modules 2-6',
    organization: 'Amazon Web Services (AWS Training & Certification)',
    curatedBy: 'lnwfilmSynthesis',
    references: [
      {
        title: 'AWS Academy Cloud Architecting Official Curriculum',
        author: 'AWS Training & Certification',
        desc: 'ครอบคลุมโมดูล 2-6: Storage Layer (S3, EFS), Compute (EC2, Lambda), Components Connection, Database (RDS, DynamoDB) และ Well-Architected Design',
        url: 'https://aws.amazon.com/training/awsacademy/'
      },
      {
        title: 'AWS Well-Architected Framework: Reliability, Performance & Security Pillars',
        author: 'AWS Architecture Center',
        desc: 'แนวทางการออกแบบระบบคลาวด์ตามเสาหลักความปลอดภัย ความเสถียร และความคุ้มค่า',
        url: 'https://aws.amazon.com/architecture/well-architected/'
      }
    ]
  },
  'aws_acf_modules_71q': {
    primarySource: 'AWS Academy Cloud Foundations (ACF) — Modules 1-8',
    organization: 'Amazon Web Services (AWS Training & Certification)',
    curatedBy: 'lnwfilmSynthesis',
    references: [
      {
        title: 'AWS Academy Cloud Foundations Official Curriculum',
        author: 'AWS Training & Certification',
        desc: 'ครอบคลุมโมดูล 1-8: Cloud Concepts, Security, Architecture, Compute, Storage, Database, Networking และ CloudWatch/Monitoring',
        url: 'https://aws.amazon.com/training/awsacademy/'
      },
      {
        title: 'AWS Certified Cloud Practitioner (CLF-C02) Exam Guide',
        author: 'Amazon Web Services',
        desc: 'คู่มือและขอบเขตข้อสอบการรับรองมาตรฐาน AWS Cloud Practitioner สากล',
        url: 'https://aws.amazon.com/certification/certified-cloud-practitioner/'
      }
    ]
  },
  'aws_cloud_foundations_60_items': {
    primarySource: 'AWS Cloud Foundations Mock Exam Guide (CLF-C02)',
    organization: 'Amazon Web Services (AWS)',
    references: [
      {
        title: 'AWS Certified Cloud Practitioner Official Exam Guide & Documentation',
        author: 'AWS Certification Team',
        desc: 'แนวข้อสอบพื้นฐาน Cloud, Shared Responsibility Model, IAM, S3, EC2, CloudFront และ Billing/Pricing',
        url: 'https://docs.aws.amazon.com/whitepapers/latest/aws-overview/introduction.html'
      },
      {
        title: 'Overview of Amazon Web Services & Security Whitepapers',
        author: 'Amazon Web Services',
        desc: 'เอกสารทางการว่าด้วยบริการหลัก สถาปัตยกรรมระดับสากล และโมเดลความปลอดภัยร่วม'
      }
    ]
  },
  'aws_cloud_analysis_60_items': {
    primarySource: 'AWS Cloud Solutions Architecture & Analytics (SAA-C03)',
    organization: 'Amazon Web Services (AWS Architecture Center)',
    references: [
      {
        title: 'AWS Certified Solutions Architect – Associate (SAA-C03) Exam Blueprint',
        author: 'Amazon Web Services',
        desc: 'การออกแบบสถาปัตยกรรม Multi-tier, Multi-Region, VPC Peering, NAT Gateway, DynamoDB Global Tables, S3 Intelligent-Tiering และ Backup Strategy',
        url: 'https://aws.amazon.com/certification/certified-solutions-architect-associate/'
      },
      {
        title: 'AWS Reference Architectures & Cloud Design Patterns',
        author: 'AWS Architecture Center',
        desc: 'สถาปัตยกรรมอ้างอิงและการออกแบบระบบที่มีความพร้อมใช้งานสูงและลดความหน่วง',
        url: 'https://aws.amazon.com/architecture/'
      }
    ]
  },

  // Data Warehousing
  'dw_hard_60': {
    primarySource: 'The Data Warehouse Toolkit & Enterprise Dimensional Modeling',
    organization: 'Kimball Group & Corporate Information Factory (Inmon)',
    references: [
      {
        title: 'The Data Warehouse Toolkit: The Definitive Guide to Dimensional Modeling (3rd Edition)',
        author: 'Ralph Kimball & Margy Ross (Wiley Publishing)',
        desc: 'แก่นทฤษฎี: Star Schema, Snowflake Schema, Fact Table Granularity, Conformed Dimensions, Bus Matrix และ Slowly Changing Dimensions (SCD Type 1-6)'
      },
      {
        title: 'Building the Data Warehouse (4th Edition)',
        author: 'W. H. Inmon (Wiley Publishing)',
        desc: 'สถาปัตยกรรม CIF (Corporate Information Factory), Hub-and-Spoke และ 3NF Enterprise Data Warehouse'
      }
    ]
  },
  'dw30': {
    primarySource: 'Data Warehouse & OLAP Systems Fundamentals',
    organization: 'Data Engineering & Business Intelligence Standards',
    references: [
      {
        title: 'The Data Warehouse Toolkit: Practical Dimensional Design',
        author: 'Ralph Kimball & Margy Ross',
        desc: 'หลักการเปรียบเทียบ OLTP vs OLAP, Star/Snowflake Schema, Fact Tables และ Dimensional Hierarchy'
      },
      {
        title: 'Data Warehousing, ETL Processes and Business Intelligence Principles',
        author: 'Academic Curriculum Series',
        desc: 'กระบวนการสกัด โอนย้าย และโหลดข้อมูล (ETL), การใช้ Surrogate Keys และการสร้าง Data Marts'
      }
    ]
  },

  // Data Science & Machine Learning
  'ds_ml_60q': {
    primarySource: 'Applied Machine Learning & Advanced Data Science',
    organization: 'Machine Learning & Pattern Recognition Academic Standards',
    references: [
      {
        title: 'Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow (3rd Edition)',
        author: 'Aurélien Géron (O\'Reilly Media)',
        desc: 'Supervised Learning, Unsupervised Learning, Ensemble Methods (Random Forest, Gradient Boosting), Clustering (K-Means, DBSCAN) และ Cross-Validation'
      },
      {
        title: 'Pattern Recognition and Machine Learning',
        author: 'Christopher M. Bishop (Springer)',
        desc: 'ทฤษฎีสถิติสำหรับปัญญาประดิษฐ์, การประเมินประสิทธิภาพโมเดล และ Bias-Variance Tradeoff'
      }
    ]
  },
  'ds_ml_calc_30q': {
    primarySource: 'Machine Learning Mathematical Foundations & Step-by-Step Calculations',
    organization: 'Applied Mathematics & Data Science Curriculum',
    references: [
      {
        title: 'Applied Machine Learning: Step-by-Step Calculation Workbook',
        author: 'Data Science Academic Series',
        desc: 'การคำนวณ Entropy, Information Gain ใน Decision Tree, Confusion Matrix (Precision, Recall, F1-Score), Euclidean/Manhattan Distance และ Linear/Logistic Regression Gradients'
      },
      {
        title: 'Mathematics for Machine Learning',
        author: 'Marc Peter Deisenroth, A. Aldo Faisal, Cheng Soon Ong (Cambridge University Press)',
        desc: 'พีชคณิตเชิงเส้น, แคลคูลัสเชิงอนุพันธ์หลายตัวแปร และความน่าจะเป็นสำหรับโมเดลการเรียนรู้ของเครื่อง',
        url: 'https://mml-book.github.io/'
      }
    ]
  },

  // Medical Image & Deep Learning
  'med_img_dl_30q': {
    primarySource: 'Deep Learning in Medical Image & Video Analysis',
    organization: 'Biomedical Imaging & Medical Informatics Standards',
    references: [
      {
        title: 'Digital Imaging and Communications in Medicine (DICOM) Standard Specifications',
        author: 'NEMA / DICOM Standards Committee',
        desc: 'มาตรฐานไฟล์ภาพการแพทย์ DICOM Header, Pixel Data, Modalities (CT, MRI, X-Ray) และการจัดการข้อมูลภาพทางคลินิก'
      },
      {
        title: 'Deep Learning for Medical Image Analysis',
        author: 'S. Kevin Zhou, Hayit Greenspan, Dinggang Shen (Academic Press)',
        desc: 'การประมวลผลภาพดิจิทัล (Digital Image Processing), รหัสวินิจฉัยโรค ICD-10 & DRG, Convolutional Neural Networks สำหรับภาพถ่ายรังสีวิทยา'
      }
    ]
  },

  // Intelligent System Development
  'isd_midterm_60_items': {
    primarySource: 'Intelligent System Development: CV, ML, DL & Git Version Control',
    organization: 'Computer Science & AI Engineering Curriculum',
    references: [
      {
        title: 'Pro Git (Second Edition) — Version Control & Workflow Management',
        author: 'Scott Chacon & Ben Straub (Apress)',
        desc: 'Git Branching, Merge Conflicts Resolution, Git Flow และการจัดการ Source Code ร่วมกันในทีม'
      },
      {
        title: 'Deep Learning (Adaptive Computation and Machine Learning series)',
        author: 'Ian Goodfellow, Yoshua Bengio, Aaron Courville (MIT Press)',
        desc: 'พื้นฐาน Computer Vision, Convolutional Networks (CNN), Recurrent Networks (RNN/LSTM), GAN และ Reinforcement Learning'
      }
    ]
  },
  'isd_midterm_hard_60': {
    primarySource: 'Intelligent System Development: Advanced Problem Solving & Analysis',
    organization: 'Computer Science & AI Engineering Curriculum',
    references: [
      {
        title: 'Deep Learning with Python (Second Edition)',
        author: 'François Chollet (Manning Publications)',
        desc: 'การวิเคราะห์สถาปัตยกรรม CNN เชิงลึก, Optimization Functions, Loss Surfaces, GAN Discriminator/Generator Dynamics และ Q-Learning'
      },
      {
        title: 'Pro Git: Advanced Branching, Rebase & Interactive Workflows',
        author: 'Scott Chacon (Apress)',
        desc: 'เทคนิคแก้ปัญหา Git ขั้นสูง: Rebase Conflicts, Detached HEAD, Git Stash และ Cherry-pick'
      }
    ]
  },

  // Data Visualization
  'dataviz': {
    primarySource: 'Data Visualization & Business Analytics Curriculum',
    organization: 'Business Intelligence & Visual Analytics Standards',
    references: [
      {
        title: 'The Visual Display of Quantitative Information (2nd Edition)',
        author: 'Edward R. Tufte (Graphics Press)',
        desc: 'หลักการออกแบบกราฟิกข้อมูล Data-to-Ink Ratio, การเลือกชนิดชาร์ต และการสื่อสารข้อมูลเชิงภาพ (Data Storytelling)'
      },
      {
        title: 'Definitive Guide to DAX: Business Intelligence with Microsoft Power BI',
        author: 'Alberto Ferrari & Marco Russo (Microsoft Press)',
        desc: 'การเขียน DAX Formulas, Calculated Measures, Evaluation Context และ Dashboard Modeling'
      }
    ]
  },

  // MIS
  'mis': {
    primarySource: 'Management Information Systems (Chapters 6, 7, 8)',
    organization: 'Information Systems Academic Series',
    references: [
      {
        title: 'Management Information Systems: Managing the Digital Firm (16th/17th Edition)',
        author: 'Kenneth C. Laudon & Jane P. Laudon (Pearson)',
        desc: 'บทที่ 6: รากฐาน Business Intelligence และระบบฐานข้อมูล, บทที่ 7: ระบบโทรคมนาคม อินเทอร์เน็ต และระบบเครือข่ายไร้สาย, บทที่ 8: ความมั่นคงปลอดภัยของระบบสารสนเทศ'
      }
    ]
  },
  'mis2': {
    primarySource: 'Management Information Systems & Knowledge Management (Chapters 9, 10)',
    organization: 'Information Systems Academic Series',
    references: [
      {
        title: 'Management Information Systems: Managing the Digital Firm',
        author: 'Kenneth C. Laudon & Jane P. Laudon (Pearson)',
        desc: 'บทที่ 9: Enterprise Applications (ERP, Supply Chain Management, CRM), บทที่ 10: พาณิชย์อิเล็กทรอนิกส์ (E-commerce) และตลาดดิจิทัล'
      },
      {
        title: 'Knowledge Management Systems & Decision Support Systems (DSS/AI)',
        author: 'Academic Curriculum Series',
        desc: 'กระบวนการตัดสินใจทางธุรกิจ (Decision Making), ระบบจัดการความรู้ (Knowledge Management) และการประยุกต์ใช้ AI ในองค์กร'
      }
    ]
  },
  'mis3': {
    primarySource: 'Management Information Systems (Chapter 11 — Building Information Systems)',
    organization: 'Information Systems Academic Series',
    references: [
      {
        title: 'Management Information Systems: Managing the Digital Firm',
        author: 'Kenneth C. Laudon & Jane P. Laudon (Pearson)',
        desc: 'บทที่ 11: การพัฒนาระบบสารสนเทศ — Systems Development Life Cycle (SDLC), ระเบียบวิธีแบบ Agile, การปรับปรุงกระบวนการทางธุรกิจ (BPR), Prototyping และการบริหารโครงการไอที'
      }
    ]
  },

  // Data Science Weekly Series (ds9 - ds14)
  'ds9': {
    primarySource: 'Data Science Week 9: Logical & Probabilistic Reasoning',
    organization: 'Data Science Curriculum Series',
    references: [
      {
        title: 'Artificial Intelligence: A Modern Approach (4th Edition)',
        author: 'Stuart Russell & Peter Norvig (Pearson)',
        desc: 'Propositional Logic, First-Order Logic, Inference Rules, Bayesian Probability และ Bayesian Belief Networks'
      }
    ]
  },
  'ds10': {
    primarySource: 'Data Science Week 10: Computer Vision & Digital Image Processing',
    organization: 'Data Science Curriculum Series',
    references: [
      {
        title: 'Digital Image Processing (4th Edition)',
        author: 'Rafael C. Gonzalez & Richard E. Woods (Pearson)',
        desc: 'การประมวลผลภาพดิจิทัล, Spatial Filtering, Convolution, Edge Detection, Color Spaces (RGB, HSV, Grayscale) และ Computer Vision Tasks'
      }
    ]
  },
  'ds11': {
    primarySource: 'Data Science Week 11: Natural Language Processing (NLP)',
    organization: 'Data Science Curriculum Series',
    references: [
      {
        title: 'Speech and Language Processing (3rd Edition)',
        author: 'Dan Jurafsky & James H. Martin (Stanford University)',
        desc: 'Text Preprocessing, Tokenization, Stopwords Removal, Stemming & Lemmatization, Bag-of-Words (BoW) และ TF-IDF Vectorization'
      }
    ]
  },
  'ds12': {
    primarySource: 'Data Science Week 12: Machine Learning Workflows & PyCaret',
    organization: 'Data Science Curriculum Series',
    references: [
      {
        title: 'Machine Learning Workflow & AutoML with PyCaret',
        author: 'Data Science Laboratory Series',
        desc: 'การเตรียมข้อมูล (Preprocessing), Classification, Regression, Clustering และการประเมินเปรียบเทียบโมเดลอัตโนมัติ'
      }
    ]
  },
  'ds13': {
    primarySource: 'Data Science Week 13: Model Evaluation & Performance Metrics',
    organization: 'Data Science Curriculum Series',
    references: [
      {
        title: 'Evaluating Machine Learning Models & Statistical Validation',
        author: 'Data Science Academic Series',
        desc: 'Confusion Matrix, Accuracy, Precision, Recall, F1-Score, ROC-AUC, MAE, MSE, RMSE, R-squared และ K-Fold Cross Validation'
      }
    ]
  },
  'ds14': {
    primarySource: 'Data Science Week 14: Model Deployment, MLOps & Responsible AI',
    organization: 'Data Science Curriculum Series',
    references: [
      {
        title: 'Building Machine Learning Powered Applications & Responsible AI',
        author: 'Emmanuel Ameisen (O\'Reilly Media)',
        desc: 'การบันทึกและแปลงโมเดล (Pickle/Joblib), Interactive Web UI ด้วย Gradio, MLOps Pipelines, Data Privacy และจริยธรรมปัญญาประดิษฐ์'
      }
    ]
  }
};

/**
 * Resolves the reference data for any subject (preset or custom)
 */
export function getSubjectReferenceData(subject) {
  if (!subject) return null;

  // Normalize stringified JSON references if coming from Supabase or text storage
  let rawRefs = subject.references;
  if (typeof rawRefs === 'string') {
    try {
      rawRefs = JSON.parse(rawRefs);
    } catch {
      rawRefs = null;
    }
  }

  // If rawRefs is an object containing references array and metadata
  if (rawRefs && typeof rawRefs === 'object' && !Array.isArray(rawRefs)) {
    return {
      primarySource: rawRefs.primarySource || rawRefs.primary_source || subject.primarySource || subject.primary_source || subject.source || subject.name,
      organization: rawRefs.organization || subject.organization || 'คลังข้อสอบ EXETIA',
      curatedBy: rawRefs.curatedBy || rawRefs.curated_by || subject.curatedBy || subject.curated_by || '',
      references: Array.isArray(rawRefs.references) ? rawRefs.references : []
    };
  }

  // 1. Direct custom reference array in subject
  if (rawRefs && Array.isArray(rawRefs) && rawRefs.length > 0) {
    return {
      primarySource: subject.primarySource || subject.primary_source || subject.source || subject.name,
      organization: subject.organization || 'คลังข้อสอบ EXETIA',
      curatedBy: subject.curatedBy || subject.curated_by || '',
      references: rawRefs
    };
  }

  // Direct primarySource / organization without references array
  if (subject.primarySource || subject.primary_source) {
    return {
      primarySource: subject.primarySource || subject.primary_source,
      organization: subject.organization || 'คลังข้อสอบ EXETIA',
      curatedBy: subject.curatedBy || subject.curated_by || '',
      references: [
        {
          title: subject.primarySource || subject.primary_source,
          author: subject.curatedBy || subject.curated_by || 'ผู้จัดทำ / คณาจารย์ผู้สอน',
          desc: 'แหล่งที่มาและเอกสารอ้างอิงประกอบชุดข้อสอบ'
        }
      ]
    };
  }

  if (subject.source || subject.reference) {
    return {
      primarySource: subject.source || subject.reference,
      organization: subject.organization || 'คลังข้อสอบ EXETIA',
      curatedBy: subject.curatedBy || subject.curated_by || '',
      references: [
        {
          title: subject.source || subject.reference,
          author: subject.author || 'ผู้จัดทำ / คณาจารย์ผู้สอน',
          desc: subject.sourceDesc || 'แหล่งที่มาและเอกสารอ้างอิงประกอบชุดข้อสอบ'
        }
      ]
    };
  }

  // 2. Preset subject reference lookup
  if (EXAM_REFERENCES[subject.id]) {
    return EXAM_REFERENCES[subject.id];
  }

  // 3. Category-based fallback
  const category = (subject.category || '').toLowerCase();
  if (category.includes('cloud') || category.includes('aws')) {
    return {
      primarySource: 'AWS Documentation & Certification Curriculum',
      organization: 'Amazon Web Services (AWS)',
      references: [
        {
          title: 'AWS Certified Exam Guides & Official Technical Documentation',
          author: 'Amazon Web Services',
          desc: 'เอกสารคู่มือทางเทคนิคและสถาปัตยกรรมระบบคลาวด์มาตรฐาน AWS'
        }
      ]
    };
  }

  if (category.includes('data science') || category.includes('machine learning')) {
    return {
      primarySource: 'Applied Data Science & Machine Learning Academic Curriculum',
      organization: 'Academic Data Science Standards',
      references: [
        {
          title: 'Machine Learning & Statistical Data Analysis Principles',
          author: 'Data Science Faculty Curriculum',
          desc: 'หลักสูตรและเอกสารวิชาการด้านการเรียนรู้ของเครื่องและการวิเคราะห์ข้อมูล'
        }
      ]
    };
  }

  if (category.includes('warehouse') || category.includes('olap')) {
    return {
      primarySource: 'Enterprise Data Warehouse & Dimensional Modeling Standards',
      organization: 'Kimball / Inmon Academic Standards',
      references: [
        {
          title: 'The Data Warehouse Toolkit: Practical Dimensional Design',
          author: 'Ralph Kimball & Margy Ross',
          desc: 'หลักการออกแบบคลังข้อมูล Star Schema, Snowflake Schema และกระบวนการ ETL'
        }
      ]
    };
  }

  // 4. General fallback
  return {
    primarySource: `หลักสูตรและแนวข้อสอบรายวิชา ${subject.name}`,
    organization: 'EXETIA Academic Curriculum Lead',
    references: [
      {
        title: `เอกสารและคู่มือการเรียนการสอนรายวิชา ${subject.name}`,
        author: 'ทีมงานฝ่ายวิชาการ EXETIA',
        desc: 'จัดทำและเรียบเรียงขึ้นตามมาตรฐานหลักสูตรระดับอุดมศึกษาเพื่อการทบทวนเชิงลึก'
      }
    ]
  };
}
