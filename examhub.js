const subjects = [
  {
    id: 'mis',
    category: 'MIS',
    name: 'MIS บทที่ 6,7,8',
    icon: '🗄️',
    color: '#f97316',
    iconBg: 'rgba(249,115,22,0.15)',
    desc: 'Database · Supply Chain · CRM · Data Mining',
    questions: [
      { q: 'ข้อใดต่อไปนี้เกิดขึ้นเมื่อแอตทริบิวต์เดียวกันในไฟล์ข้อมูลที่เกี่ยวข้องมีค่าต่างกัน', choices: ['Data redundancy', 'Data duplication', 'Data dependence', 'Data inconsistency'], answer: 3, explain: 'Data inconsistency เกิดจากข้อมูลชุดเดียวกันถูกจัดเก็บไว้หลายที่แล้วอัปเดตไม่ครบ ทำให้ค่าไม่ตรงกัน' },
      { q: 'Data mining ช่วยให้ผู้ใช้สามารถทำสิ่งใด', choices: ['เปรียบเทียบข้อมูลธุรกรรมในช่วงหลายปี', 'ค้นหาความสัมพันธ์ที่ซ่อนอยู่ในข้อมูล', 'รับคำตอบออนไลน์สำหรับคำถามเฉพาะกิจ', 'สรุปข้อมูลจำนวนมากให้เป็นรายงานขนาดเล็ก'], answer: 1, explain: 'หัวใจหลักของ Data Mining คือการขุดหาความรู้ (Knowledge Discovery) และค้นหาความสัมพันธ์ที่มองไม่เห็นด้วยตาเปล่า' },
      { q: 'ความผันผวนของคำสั่งซื้อที่มากขึ้นตามลำดับขั้นของห่วงโซ่อุปทาน เรียกว่าอะไร', choices: ['network effect', 'Just-in-time', 'bullwhip effect', 'safety stock'], answer: 2, explain: 'Bullwhip Effect คือความผันผวนที่ขยายใหญ่ขึ้นตามลำดับในห่วงโซ่อุปทาน แม้ความต้องการปลายทางจะนิ่ง' },
      { q: 'ข้อใดไม่ใช่ความแตกต่างระหว่าง Data mining และ OLAP', choices: ['Data mining เปิดเผยความสัมพันธ์ที่ซ่อนอยู่', 'OLAP ใช้วิเคราะห์ข้อมูลหลายมิติ', 'OLAP สามารถเจาะลึกข้อมูลเพื่อแสดงรายละเอียด', 'Data mining ไม่ใช้ในการวิเคราะห์ข้อมูล'], answer: 3, explain: 'ข้อนี้ผิด เพราะ Data Mining คือเครื่องมือหลักในการวิเคราะห์ข้อมูลเชิงลึก ไม่ใช่ว่าไม่ใช้วิเคราะห์' },
      { q: 'ในห่วงโซ่อุปทาน ข้อใดหมายถึงซัพพลายเออร์ของบริษัท และซัพพลายเออร์ของซัพพลายเออร์', choices: ['ซัพพลายเชนภายในของซัพพลายเออร์', 'ห่วงโซ่อุปทานโลจิสติกส์', 'Downstream supply chain', 'Upstream supply chain'], answer: 3, explain: 'Upstream Supply Chain คือส่วนต้นน้ำ ได้แก่ ซัพพลายเออร์และซัพพลายเออร์ของซัพพลายเออร์ทั้งหมด' },
      { q: 'ทั้งหมดต่อไปนี้เป็นปัญหากับระบบไฟล์แบบดั้งเดิม ยกเว้นข้อใด', choices: ['Data inconsistency', 'ไม่สามารถพัฒนาแอพพลิเคชั่นเฉพาะฝ่ายปฏิบัติงาน', 'ขาดความยืดหยุ่นในการสร้าง ad-hoc reports', 'Poor security'], answer: 1, explain: 'ระบบไฟล์เดิมสร้างมาเพื่อฝ่ายปฏิบัติงานเฉพาะทางอยู่แล้ว ปัญหาคือคุยกับฝ่ายอื่นไม่ได้ ไม่ใช่พัฒนาไม่ได้' },
      { q: 'MongoDB และ SimpleDB เป็นตัวอย่างของข้อใด', choices: ['Open source databases', 'SQL databases', 'NoSQL databases', 'Cloud databases'], answer: 2, explain: 'MongoDB และ SimpleDB เป็น NoSQL databases ที่ไม่ใช้โครงสร้างตารางแบบ relational' },
      { q: 'ข้อใดไม่ใช่มูลค่าทางธุรกิจของระบบ Supply Chain Management ที่มีประสิทธิผล', choices: ['ผลิตภัณฑ์ออกสู่ตลาดเร็วขึ้น', 'การลดต้นทุน', 'อุปทานตรงกับความต้องการ', 'เพิ่มระดับสินค้าคงคลัง'], answer: 3, explain: 'ระบบ SCM ที่ดีควรลดสินค้าคงคลังที่ไม่จำเป็น (Optimal Inventory) ไม่ใช่เพิ่มสินค้าคงคลัง' },
      { q: 'ข้อใดช่วยให้บริษัทสามารถคาดการณ์ความต้องการและพัฒนาแผนการจัดหาและการผลิตได้', choices: ['Supply chain demand system', 'Supply chain delivery system', 'Supply chain execution system', 'Supply chain planning system'], answer: 3, explain: 'Supply Chain Planning System ช่วยวางแผนและคาดการณ์ความต้องการเพื่อพัฒนาแผนการจัดหาและการผลิต' },
      { q: 'ข้อใดต่อไปนี้ไม่เป็นความจริงเกี่ยวกับ Enterprise System', choices: ['ช่วยให้บริษัทตอบสนองการขอข้อมูลได้อย่างรวดเร็ว', 'ข้อมูลมีรูปแบบมาตรฐานที่เป็นที่ยอมรับทั้งองค์กร', 'ไม่มีเครื่องมือวิเคราะห์เพื่อประเมินประสิทธิภาพองค์กร', 'ให้ข้อมูลทั่วทั้งบริษัทเพื่อช่วยผู้จัดการตัดสินใจ'], answer: 2, explain: 'ในความเป็นจริง Enterprise Systems (เช่น ERP) มีโมดูลวิเคราะห์และ Dashboard ให้ผู้บริหารเสมอ' },
      { q: 'OLAP ช่วยให้ทำสิ่งใด', choices: ['สนับสนุนการวิเคราะห์ข้อมูลจากหลากหลายมุมมองหรือหลายมิติ', 'ดูมุมมองของข้อมูลทั้งทางตรรกะและทางกายภาพ', 'จัดทำแผนภาพความสัมพันธ์ของข้อมูล', 'Normalize ข้อมูล'], answer: 0, explain: 'OLAP (Online Analytical Processing) สนับสนุนการวิเคราะห์ข้อมูลหลายมิติ (Multidimensional Analysis)' },
      { q: 'ข้อใดสร้างความสับสนให้กับข้อมูลเมื่อสร้างระบบสารสนเทศที่รวมข้อมูลจากแหล่งต่างๆ', choices: ['Batch processing', 'Data redundancy', 'Data independence', 'Online processing'], answer: 1, explain: 'Data redundancy ทำให้เกิดความสับสนเมื่อรวมข้อมูลจากหลายแหล่ง เพราะข้อมูลเดียวกันอาจมีหลายค่า' },
      { q: 'การวัดจำนวนลูกค้าที่หยุดใช้หรือซื้อผลิตภัณฑ์หรือบริการจากบริษัท เรียกว่า', choices: ['Switching costs', 'Churn rate', 'Customer lifetime value', 'Switch rate'], answer: 1, explain: 'Churn rate คืออัตราการสูญเสียลูกค้า วัดจากจำนวนลูกค้าที่หยุดใช้บริการในช่วงเวลาหนึ่ง' },
      { q: 'ข้อใดหมายถึงนโยบายและกระบวนการในการจัดการความสมบูรณ์และความปลอดภัยของข้อมูลในองค์กร', choices: ['Data governance', 'DBMS', 'Data auditing', 'Data quality'], answer: 0, explain: 'Data governance คือการกำกับดูแลข้อมูล ครอบคลุมนโยบาย กระบวนการ และมาตรฐานการจัดการข้อมูลขององค์กร' },
      { q: 'แอปพลิเคชัน Operational CRM มีเครื่องมือสำหรับสิ่งต่อไปนี้ทั้งหมด ยกเว้น', choices: ['Sales force automation', 'Call center support', 'Marketing automation', 'Calculating Customer lifetime value'], answer: 3, explain: 'การคำนวณ Customer Lifetime Value (CLV) เป็นหน้าที่ของ Analytical CRM ไม่ใช่ Operational CRM' },
      { q: 'ต่อไปนี้เป็นเทคโนโลยีที่ใช้วิเคราะห์และจัดการ Big Data ยกเว้นข้อใด', choices: ['Microsoft Access', 'NoSQL', 'In-memory computing', 'Hadoop'], answer: 0, explain: 'Microsoft Access เป็น Database ขนาดเล็กสำหรับงาน Desktop ไม่เหมาะกับการจัดการ Big Data' },
      { q: 'เครื่องมือใดใช้วิเคราะห์ข้อมูลขนาดใหญ่ที่ไม่มีโครงสร้าง เช่น อีเมลและการตอบแบบสำรวจ เพื่อค้นหารูปแบบ', choices: ['OLAP', 'Text mining', 'In-memory computing', 'Clustering'], answer: 1, explain: 'Text mining วิเคราะห์ข้อมูลข้อความ (Unstructured data) เพื่อค้นหารูปแบบและความสัมพันธ์ที่ซ่อนอยู่' },
      { q: 'ความไม่แน่นอนในห่วงโซ่อุปทานมักนำไปสู่ข้อใด', choices: ['เพิ่มสินค้าคงคลังในทุกระดับ', 'การผลิตลดลง', 'การลดลงของ safety stocks', 'Bullwhip effect'], answer: 0, explain: 'ความไม่แน่นอนทำให้แต่ละระดับในห่วงโซ่เก็บสินค้าคงคลังสำรองมากขึ้นเพื่อป้องกันความเสี่ยง' },
      { q: 'โดยทั่วไประบบ CRM จะจัดหาซอฟต์แวร์สำหรับการขาย การบริการลูกค้า และข้อใด', choices: ['Marketing', 'Account management', 'Advertising', 'Human resources'], answer: 0, explain: 'ระบบ CRM หลักๆ รองรับ 3 ด้าน ได้แก่ Sales, Customer Service และ Marketing' },
      { q: 'ที่ระบบไฟล์แบบดั้งเดิมไม่สามารถตอบสนองต่อความต้องการข้อมูลที่ไม่ได้คาดการณ์ได้ทันท่วงที เป็นตัวอย่างของปัญหาใด', choices: ['Program-data dependence', 'Lack of flexibility', 'Lack of data sharing', 'Data redundancy'], answer: 1, explain: 'Lack of flexibility คือข้อจำกัดที่ระบบไฟล์เดิมไม่สามารถตอบสนองคำถาม ad-hoc หรือความต้องการข้อมูลใหม่ที่ไม่ได้วางแผนไว้' },
      { q: 'ข้อใดไม่เกี่ยวข้องกับ Push-based model (build-to-stock)', choices: ['ผลิตตามความต้องการ', 'สินค้าถูกผลิตตามตารางโดยไม่คำนึงถึงสถานะปัจจุบัน', 'สินค้าอุปโภคบริโภคทั่วไปและอาหารกระป๋อง', 'สินค้าที่มีความต้องการคงที่คาดการณ์ได้ง่าย'], answer: 0, explain: '"ผลิตตามความต้องการ" คือลักษณะของ Pull-based model (build-to-order) ไม่ใช่ Push-based model' },
      { q: 'การจัดจำหน่ายและการจัดส่งผลิตภัณฑ์ไปยังผู้ค้าปลีกเป็นส่วนหนึ่งของข้อใด', choices: ['Downstream supply chain', 'ห่วงโซ่อุปทานภายนอก', 'Upstream supply chain', 'ส่วนกลางของห่วงโซ่อุปทาน'], answer: 0, explain: 'Downstream Supply Chain คือส่วนปลายน้ำ ครอบคลุมการกระจายสินค้าและจัดส่งไปยังผู้ค้าปลีกและลูกค้า' },
      { q: 'โดยทั่วไปผลิตภัณฑ์ CRM หลักๆ จะมีความสามารถทั้งหมดดังต่อไปนี้ ยกเว้นข้อใด', choices: ['การจัดการความพึงพอใจของลูกค้า', 'การจัดการเรื่องการส่งของคืน', 'ศูนย์บริการและแผนกช่วยเหลือ', 'การจัดหาวัตถุดิบในการผลิต'], answer: 3, explain: 'การจัดหาวัตถุดิบในการผลิตเป็นหน้าที่ของระบบ SCM หรือ ERP ไม่ใช่ CRM' },
      { q: '"การทำนายระดับผลการศึกษา (สูง/กลาง/ต่ำ) ของนักศึกษา" ควรใช้เทคนิค Data mining ใด', choices: ['Associations', 'Classifications', 'Clustering', 'Forecasting'], answer: 1, explain: 'Classifications ใช้เมื่อต้องการจำแนกข้อมูลออกเป็นกลุ่มที่กำหนดไว้ล่วงหน้า เช่น สูง/กลาง/ต่ำ' },
      { q: 'คุณต้องการแยกประเภทอีเมลว่าเป็น spam หรือไม่ ควรใช้ Data mining โมเดลใด', choices: ['Identify clusters', 'Classify data', 'Create a forecast', 'ไม่มีข้อใดถูก'], answer: 1, explain: 'การแยก spam/ไม่ spam เป็นโจทย์จำแนกประเภท (Classification) เพราะผลลัพธ์มีสองกลุ่มชัดเจน' }
    ]
  },
  {
    id: 'mis2',
    category: 'MIS',
    name: 'MIS & KM (บทที่ 9-10)',
    icon: '🧠',
    color: '#a855f7',
    iconBg: 'rgba(168,85,247,0.15)',
    desc: 'Decision Making · AI · Knowledge Management',
    questions: [
      { q: 'การตัดสินใจประเภทใดที่คำนวณค่าจ้างขั้นต้นสำหรับคนงานรายชั่วโมง', choices: ['ไม่มีโครงสร้าง (Unstructured decision)', 'มีโครงสร้าง (Structured decision)', 'กึ่งโครงสร้าง (Semistructured decision)', 'ชัดเจน (Explicit decision)'], answer: 1, explain: 'การคำนวณค่าจ้างมีสูตรแน่นอน (ชั่วโมงทำงาน x อัตราจ้าง) จึงเป็น Structured decision ที่มีขั้นตอนชัดเจน' },
      { q: 'Siri ของ Apple เป็นตัวอย่างของข้อใด', choices: ['Neural networks', 'Augmented reality', 'Data mining', 'Intelligent agents'], answer: 3, explain: 'Siri เป็นซอฟต์แวร์ที่ทำหน้าที่เป็น Intelligent agent เพื่อช่วยเหลือผู้ใช้ตามคำสั่งเสียง' },
      { q: 'การตัดสินใจว่าจะเปิดการขายสินค้าในตลาดใหม่ คือแอฟริกาหรือไม่ เป็นการตัดสินใจประเภทใด', choices: ['มีโครงสร้าง (Structured decision)', 'ไม่มีโครงสร้าง (Unstructured decision)', 'การตัดสินใจที่กำหนดไว้ล่วงหน้า (Programmed Decisions)', 'ชัดเจน (Explicit decision)'], answer: 1, explain: 'การบุกตลาดใหม่มีความเสี่ยงและปัจจัยไม่แน่นอนสูง ต้องใช้ดุลยพินิจ จึงเป็น Unstructured decision' },
      { q: 'การนำวัตถุ 3D ไฟล์วิดีโอ หรือกราฟิก มาซ้อนเข้ากับโลกแห่งความจริง เรียกว่าอะไร', choices: ['Augmented reality (AR)', 'Expert system', 'Computer-Aided Design', 'Knowledge Work System'], answer: 0, explain: 'AR คือการนำข้อมูลเสมือนไปทับซ้อนบนภาพสภาพแวดล้อมจริงผ่านกล้องหรืออุปกรณ์' },
      { q: 'ข้อใดไม่ใช่ Tacit knowledge (ความรู้ในตัวคน)', choices: ['Skill, Personal Talent', 'Know How', 'Experience, Innovative', 'Textbook, Report'], answer: 3, explain: 'ตำราและรายงานจัดเป็น Explicit knowledge เพราะถูกบันทึกออกมาเป็นลายลักษณ์อักษรแล้ว' },
      { q: 'ข้อใดต่อไปนี้ไม่ได้กล่าวถึงมิติของความรู้ในองค์กร', choices: ['เป็นไปตามบริบทและใช้ได้เฉพาะสถานการณ์ที่เกี่ยวข้อง', 'มันไม่มีตัวตน', 'อยู่ภายใต้กฎหมายว่าด้วยการลดผลตอบแทน (Diminishing returns)', 'ถูกฝังอยู่ในวัฒนธรรมของบริษัท'], answer: 2, explain: 'ความรู้เป็นทรัพยากรที่ยิ่งใช้ยิ่งเพิ่มพูน (Increasing returns) ไม่ได้ลดน้อยลงเหมือนทรัพยากรทางกายภาพ' },
      { q: 'ข้อใดไม่ใช่เอกสารแบบไม่มีโครงสร้าง (Unstructured documents)', choices: ['แบบสอบถามวัดความพึงพอใจ 5 ระดับ', 'Memo', 'Contract สัญญา', 'Article บทความ'], answer: 0, explain: 'แบบสอบถามที่มีระดับคะแนน (1-5) มีโครงสร้างที่แน่นอน สามารถประมวลผลเชิงปริมาณได้ทันที' },
      { q: 'ซอฟต์แวร์ที่ทำงานอัตโนมัติเพื่อดำเนินงานเฉพาะสำหรับผู้ใช้ โดยไม่มีมนุษย์แทรกแซงโดยตรง คือข้อใด', choices: ['Intelligent agents', 'Intelligent techniques', 'Business intelligence', 'AI hybrid systems'], answer: 0, explain: 'Intelligent agents คือซอฟต์แวร์ที่ทำงานแทนมนุษย์โดยอัตโนมัติในงานเฉพาะด้าน' },
      { q: 'ข้อใดต่อไปนี้ไม่ใช่องค์ประกอบหลักใน BI environment', choices: ['Managerial users and methods', 'Organizational culture', 'User interface', 'Data from the business environment'], answer: 1, explain: 'วัฒนธรรมองค์กรเป็นปัจจัยภายนอกที่ส่งผลกระทบ แต่ไม่ใช่ส่วนประกอบเชิงเทคนิคหลักของระบบ BI' },
      { q: 'ข้อใดต่อไปนี้ไม่ถูกจัดเป็น Knowledge Work System (KWS)', choices: ['CAD system', '3D visualization system', 'AR applications', 'Expert system'], answer: 3, explain: 'Expert system เป็นระบบผู้เชี่ยวชาญเพื่อช่วยตัดสินใจ ส่วน KWS คือเครื่องมือที่ช่วยให้คนทำงานสร้างความรู้ใหม่' },
      { q: 'เทคโนโลยีที่ช่วยในการ "เผยแพร่" ความรู้คือข้อใด', choices: ['Machine learning', 'Database', 'Portals', 'Robotics'], answer: 2, explain: 'Portal ทำหน้าที่เป็นช่องทางกลางในการเข้าถึงและกระจายข้อมูลสู่คนในองค์กร' },
      { q: 'ประเภทของระบบการจัดการความรู้ 3 ประเภทหลักคือข้อใด', choices: ['MIS, DSS, and TPS', 'CRM, SCM, and CAD', 'DBMS, DSS, and ECM', 'Enterprise-wide KMS, KWS, and intelligent techniques'], answer: 3, explain: 'การแบ่งประเภทหลักของ KM Systems ตามมาตรฐานตำรา MIS คือ Enterprise-wide KMS, KWS และ Intelligent techniques' },
      { q: 'ข้อใดกล่าวถูกต้องที่สุดเกี่ยวกับลำดับชั้นข้อมูล', choices: ['Information เป็นข้อมูลดิบ', 'Data เป็น knowledge ที่ผ่านการประมวลผล', 'Wisdom เป็น data ที่นำไปใช้แก้ปัญหาได้', 'Knowledge เป็น information ที่ได้รับการวิเคราะห์และนำไปใช้'], answer: 3, explain: 'ลำดับชั้นที่ถูกต้องคือ Data → Information → Knowledge → Wisdom' },
      { q: 'ข้อใดคือเทคนิคอัจฉริยะ (Intelligent technique)', choices: ['Digital asset management', 'Neural network', 'CAD', 'Augmented reality'], answer: 1, explain: 'Neural network เป็นเทคนิค AI ที่เลียนแบบโครงข่ายประสาทมนุษย์ จัดเป็น Intelligent technique' },
      { q: 'ความเชี่ยวชาญของสมาชิกที่ไม่ได้ทำเป็นเอกสาร เรียกว่าอะไร', choices: ['Information', 'Data', 'Experience', 'Tacit knowledge'], answer: 3, explain: 'ความรู้ที่ฝังอยู่ในตัวบุคคลและไม่ได้บันทึกเป็นเอกสาร คือ Tacit Knowledge' },
      { q: 'ระบบสารสนเทศสำหรับผู้มีหน้าที่สร้างความรู้ใหม่ให้กับบริษัท คือข้อใด', choices: ['Knowledge Work Systems (KWS)', 'Learning Management Systems (LMS)', 'Enterprise-wide knowledge management systems', 'Wikis'], answer: 0, explain: 'KWS ออกแบบมาเฉพาะสำหรับกลุ่มวิศวกร นักวิทยาศาสตร์ หรือผู้ออกแบบที่สร้างความรู้ใหม่' },
      { q: 'การตัดสินใจเกี่ยวกับกิจกรรมวันต่อวัน (Day-to-day) หมายถึงข้อใด', choices: ['Business intelligence', 'Analytical intelligence', 'Operational intelligence', 'Production intelligence'], answer: 2, explain: 'กิจกรรมการปฏิบัติงานรายวันจัดอยู่ในระดับ Operational intelligence' },
      { q: 'ข้อใดคือคุณลักษณะของ Executive Support Systems (ESS)', choices: ['สนับสนุนการตัดสินใจอย่างมีโครงสร้าง', 'มีความสามารถในการเจาะลึกลง (drill-down) ไปในรายละเอียด', 'รวมข้อมูลจากระบบต่างๆ ได้ยาก', 'ขับเคลื่อนโดยข้อมูลดิบเท่านั้น'], answer: 1, explain: 'ESS ช่วยให้ผู้บริหารดูภาพรวมและเจาะลึกดูรายละเอียด (Drill-down) ได้เมื่อพบความผิดปกติ' },
      { q: 'การตัดสินใจที่ไม่มีวิธีแก้ไขชัดเจน และไม่เป็นไปตามเกณฑ์ที่รู้ล่วงหน้า คือข้อใด', choices: ['มีโครงสร้าง (Structured decision)', 'ไม่มีโครงสร้าง (Unstructured decision)', 'กึ่งโครงสร้าง (Semistructured decision)', 'ชัดเจน (Explicit decision)'], answer: 1, explain: 'เป็นนิยามของ Unstructured decision ในสถานการณ์ใหม่หรือไม่คุ้นเคย ต้องใช้ดุลยพินิจมาก' },
      { q: 'ข้อใดไม่ใช่หนึ่งในมิติหลักของความรู้', choices: ['ความรู้เป็นทรัพย์สินขององค์กร', 'ความรู้มีรูปแบบที่แตกต่างกัน', 'ความรู้มีที่ตั้ง', 'ความรู้เป็นอมตะ (Knowledge is timeless)'], answer: 3, explain: 'ความรู้สามารถล้าสมัยได้ตามกาลเวลาและเทคโนโลยีที่เปลี่ยนไป จึงไม่เป็นอมตะ' }
    ]
  },
  {
    id: 'mis3',
    category: 'MIS',
    name: 'MIS บทที่ 11',
    icon: '⚙️',
    color: '#14b8a6',
    iconBg: 'rgba(20,184,166,0.15)',
    desc: 'SDLC · Agile · BPR · Project Management',
    questions: [
      { q: 'ระดับการเปลี่ยนแปลงองค์กรด้วย IT ระดับใดมีความเสี่ยงต่ำที่สุด', choices: ['Business Process Redesign (BPR)', 'Paradigm Shift', 'Rationalization', 'Automation'], answer: 3, explain: 'Automation คือการใช้ IT ช่วยงานที่ทำซ้ำๆ ให้เร็วขึ้น มีความเสี่ยงต่ำที่สุดเพราะไม่ได้เปลี่ยนโครงสร้างองค์กร' },
      { q: 'ระดับการเปลี่ยนแปลงองค์กรด้วย IT ระดับใดมีความเสี่ยงสูงที่สุด', choices: ['Automation', 'Rationalization', 'Business Process Redesign', 'Paradigm Shift'], answer: 3, explain: 'Paradigm Shift คือการเปลี่ยนนิยามหรือโมเดลธุรกิจขององค์กรใหม่ทั้งหมด จึงมีความเสี่ยงและผลตอบแทนสูงที่สุด' },
      { q: 'ขั้นตอนใดใน SDLC ที่มีหน้าที่วิเคราะห์ปัญหาของระบบเดิมและกำหนดความต้องการของระบบใหม่', choices: ['Systems Design', 'Programming', 'Systems Analysis', 'Testing'], answer: 2, explain: 'Systems Analysis คือขั้นตอนแรกที่วิเคราะห์ปัญหาระบบเดิมและกำหนด Requirements ของระบบใหม่' },
      { q: 'ขั้นตอน Conversion ใน SDLC หมายถึงอะไร', choices: ['การเขียนโปรแกรมจากข้อกำหนดที่ออกแบบ', 'การทดสอบว่าระบบทำงานถูกต้อง', 'การเลิกใช้ระบบเก่าและเริ่มใช้ระบบใหม่', 'การออกแบบโครงสร้างทางเทคนิค'], answer: 2, explain: 'Conversion คือขั้นตอนการเปลี่ยนผ่านจากระบบเดิมไปสู่ระบบใหม่ ซึ่งอาจทำแบบ Parallel, Pilot, Phased หรือ Direct cutover' },
      { q: 'การทดสอบประเภทใดที่ให้ผู้ใช้งานจริงเป็นคนทดสอบว่าระบบตรงตามความต้องการหรือไม่', choices: ['Unit Test', 'System Test', 'Acceptance Test', 'Integration Test'], answer: 2, explain: 'Acceptance Test คือการทดสอบโดยผู้ใช้งานจริงเพื่อยืนยันว่าระบบตรงตามความต้องการของธุรกิจก่อนนำไปใช้จริง' },
      { q: 'Prototyping แตกต่างจาก SDLC แบบ Waterfall อย่างไร', choices: ['Prototyping ไม่ต้องการผู้ใช้มีส่วนร่วม', 'Prototyping สร้างระบบตัวอย่างให้ผู้ใช้ติชมและปรับปรุงก่อน', 'Prototyping ใช้เวลานานกว่า Waterfall', 'Prototyping ไม่มีขั้นตอนการทดสอบ'], answer: 1, explain: 'Prototyping สร้างระบบต้นแบบที่ทำงานได้จริงอย่างรวดเร็วเพื่อให้ผู้ใช้ติชม ทำให้ลดความเสี่ยงที่จะสร้างระบบผิดความต้องการ' },
      { q: 'End-User Development คืออะไร', choices: ['การจ้างบริษัทภายนอกพัฒนาระบบ', 'การซื้อซอฟต์แวร์สำเร็จรูปมาใช้', 'การที่ผู้ใช้งานในแผนกต่างๆ สร้างระบบง่ายๆ ขึ้นมาใช้เอง', 'การพัฒนาระบบโดยทีม IT เท่านั้น'], answer: 2, explain: 'End-User Development คือการที่ผู้ใช้งานในแผนกต่างๆ สร้างระบบง่ายๆ ขึ้นมาใช้เองโดยไม่ต้องพึ่ง IT เช่น ใช้ Excel หรือ Access' },
      { q: 'Outsourcing ในบริบทการพัฒนาระบบสารสนเทศหมายถึงอะไร', choices: ['การพัฒนาระบบโดยทีมงานภายในองค์กร', 'การซื้อซอฟต์แวร์สำเร็จรูปมาใช้', 'การจ้างบริษัทภายนอกเป็นผู้พัฒนาระบบให้', 'การใช้ Open Source Software'], answer: 2, explain: 'Outsourcing คือการจ้างบริษัทภายนอกเป็นผู้พัฒนาหรือดูแลระบบ ช่วยลดต้นทุนแต่อาจสูญเสียการควบคุม' },
      { q: 'Agile Development แตกต่างจาก Waterfall (SDLC) อย่างไร', choices: ['Agile ไม่มีการทดสอบระบบ', 'Agile เน้นการส่งมอบงานย่อยๆ เป็นรอบ (Sprints) และปรับเปลี่ยนได้ตลอด', 'Agile ต้องกำหนด Requirements ทั้งหมดก่อนเริ่มพัฒนา', 'Agile ใช้เวลานานกว่า Waterfall เสมอ'], answer: 1, explain: 'Agile เน้นความยืดหยุ่น การทำงานร่วมกัน และการส่งมอบงานย่อยๆ เป็น Sprint ทำให้ปรับเปลี่ยน Requirements ได้ตลอดกระบวนการ' },
      { q: 'Business Process Redesign (BPR) คืออะไร', choices: ['การใช้ IT ทำให้งานซ้ำๆ เป็นอัตโนมัติ', 'การปรับปรุงขั้นตอนงานเล็กน้อยให้มีประสิทธิภาพขึ้น', 'การออกแบบกระบวนการธุรกิจใหม่ทั้งหมดเพื่อเพิ่มประสิทธิภาพอย่างก้าวกระโดด', 'การเปลี่ยนโมเดลธุรกิจขององค์กรใหม่'], answer: 2, explain: 'BPR คือการออกแบบกระบวนการธุรกิจใหม่ทั้งหมดเพื่อเพิ่มประสิทธิภาพอย่างก้าวกระโดด ไม่ใช่แค่ปรับปรุงเล็กน้อย' },
      { q: 'ในลำดับขั้นตอน SDLC ขั้นตอนใดอยู่หลัง Systems Design', choices: ['Systems Analysis', 'Testing', 'Programming', 'Conversion'], answer: 2, explain: 'ลำดับ SDLC: Analysis → Design → Programming → Testing → Conversion → Production & Maintenance' },
      { q: 'Component-Based Development คืออะไร', choices: ['การพัฒนาระบบโดยใช้ทีมงานหลายแผนก', 'การสร้างระบบโดยนำชิ้นส่วนซอฟต์แวร์ที่สร้างไว้แล้วมาประกอบกัน', 'การทดสอบระบบทีละส่วน', 'การแบ่งโปรเจกต์ออกเป็น Sprint ย่อยๆ'], answer: 1, explain: 'Component-Based Development คือการสร้างระบบโดยนำชิ้นส่วนซอฟต์แวร์ที่สร้างหรือซื้อไว้แล้วมาประกอบกัน ช่วยประหยัดเวลาและต้นทุน' },
      { q: 'ปัจจัยใดเป็น Critical Success Factor ที่สำคัญที่สุดในการทำโครงการ IS ให้สำเร็จ', choices: ['การใช้เทคโนโลยีล่าสุดเสมอ', 'การสนับสนุนจากผู้บริหารและการระบุ Requirements ที่ชัดเจน', 'การจ้างทีมพัฒนาที่มีขนาดใหญ่', 'การทำงานในเวลาที่สั้นที่สุด'], answer: 1, explain: 'Critical Success Factors ได้แก่ การสนับสนุนจากผู้บริหาร การระบุ Requirements ที่ชัดเจน และการจัดการความคาดหวังของผู้ใช้' },
      { q: 'Rationalization แตกต่างจาก Automation อย่างไร', choices: ['Rationalization มีความเสี่ยงน้อยกว่า Automation', 'Rationalization เป็นการปรับปรุงขั้นตอนงานให้มีประสิทธิภาพ ไม่ใช่แค่ทำให้อัตโนมัติ', 'Rationalization ไม่เกี่ยวข้องกับ IT', 'Rationalization คือการเปลี่ยนโมเดลธุรกิจ'], answer: 1, explain: 'Rationalization คือการจัดระเบียบและปรับปรุงขั้นตอนการทำงานให้มีประสิทธิภาพมากขึ้น ขณะที่ Automation แค่ทำงานเดิมให้เร็วขึ้นด้วย IT' },
      { q: 'RAD (Rapid Application Development) มีจุดเด่นอย่างไร', choices: ['เน้นการวางแผนและเอกสารครบถ้วนก่อนพัฒนา', 'เน้นการสร้างระบบให้เสร็จในเวลาอันสั้นผ่านเครื่องมือช่วยต่างๆ', 'ไม่ต้องการผู้ใช้มีส่วนร่วม', 'เหมาะกับโครงการขนาดใหญ่และซับซ้อนเท่านั้น'], answer: 1, explain: 'RAD เน้นการสร้างระบบให้เสร็จในเวลาอันสั้นโดยใช้เครื่องมือช่วยพัฒนา เหมาะกับโครงการที่ต้องการความรวดเร็ว' },
      { q: 'ขั้นตอน Systems Design ใน SDLC ทำอะไร', choices: ['วิเคราะห์ปัญหาของระบบเดิม', 'ออกแบบโครงสร้างทางเทคนิค เช่น หน้าจอ ฐานข้อมูล และการประมวลผล', 'เขียนโปรแกรมตามข้อกำหนด', 'ทดสอบว่าระบบทำงานถูกต้อง'], answer: 1, explain: 'Systems Design ออกแบบโครงสร้างทางเทคนิคของระบบใหม่ เช่น หน้าจอ UI ฐานข้อมูล และ Logic การประมวลผล' },
      { q: 'ความเสี่ยงของโครงการ IS ข้อใดที่เกี่ยวข้องกับ Risk Management มากที่สุด', choices: ['การเลือกใช้ภาษาโปรแกรมที่ไม่เหมาะสม', 'ขนาดโครงการที่ใหญ่เกินไปและความซับซ้อนทางเทคนิค', 'การไม่มีเว็บไซต์ประชาสัมพันธ์โครงการ', 'การใช้ Database ยี่ห้อที่ไม่เป็นที่นิยม'], answer: 1, explain: 'Risk Management ต้องระบุความเสี่ยงหลัก เช่น ขนาดของโครงการที่ใหญ่เกินไป หรือความซับซ้อนทางเทคนิคที่เกินความสามารถทีม' },
      { q: 'Application Software Package คืออะไร', choices: ['ซอฟต์แวร์ที่เขียนขึ้นเองทั้งหมดสำหรับองค์กร', 'การซื้อซอฟต์แวร์สำเร็จรูปมาใช้งานแทนการเขียนขึ้นเอง', 'ชุดเครื่องมือสำหรับนักพัฒนา', 'ระบบปฏิบัติการสำหรับเซิร์ฟเวอร์'], answer: 1, explain: 'Application Software Package คือซอฟต์แวร์สำเร็จรูปที่ซื้อมาใช้แทนการเขียนเอง เช่น SAP, Oracle ERP ช่วยประหยัดเวลาและต้นทุน' },
      { q: 'ขั้นตอนสุดท้ายของ SDLC คือข้อใด', choices: ['Testing', 'Conversion', 'Programming', 'Production and Maintenance'], answer: 3, explain: 'Production and Maintenance เป็นขั้นตอนสุดท้ายของ SDLC คือการใช้งานระบบจริงและการปรับปรุงให้ทันสมัยอยู่เสมอ' },
      { q: 'Paradigm Shift ต่างจาก BPR อย่างไร', choices: ['Paradigm Shift มีความเสี่ยงน้อยกว่า BPR', 'Paradigm Shift คือการปรับปรุงกระบวนการ ส่วน BPR คือการเปลี่ยนโมเดลธุรกิจ', 'Paradigm Shift คือการเปลี่ยนนิยามหรือโมเดลธุรกิจขององค์กรใหม่ทั้งหมด ซึ่งใหญ่กว่า BPR', 'ทั้งสองอย่างเหมือนกันทุกประการ'], answer: 2, explain: 'Paradigm Shift คือการเปลี่ยนโมเดลธุรกิจขององค์กรใหม่ทั้งหมด (ความเสี่ยงสูงสุด) ขณะที่ BPR แค่ออกแบบกระบวนการธุรกิจใหม่' }
    ]
  },
  {
    id: 'ds9',
    category: 'Data Science',
    name: 'DS Week 9',
    icon: '🧮',
    color: '#0ea5e9',
    iconBg: 'rgba(14,165,233,0.15)',
    desc: 'Logical · Probabilistic · Bayesian Reasoning',
    questions: [
      { q: 'Deductive Reasoning แตกต่างจาก Inductive Reasoning อย่างไร', choices: ['Deductive ใช้ข้อมูลสรุปเป็นกฎ ส่วน Inductive ใช้กฎสรุปเป็นกรณีเฉพาะ', 'Deductive ใช้กฎสรุปเป็นกรณีเฉพาะ ส่วน Inductive ใช้ข้อมูลสรุปเป็นแนวโน้ม', 'ทั้งสองอย่างเหมือนกัน', 'Deductive ให้ผลเป็นความน่าจะเป็น'], answer: 1, explain: 'Deductive: กฎทั่วไป → กรณีเฉพาะ (ผลแน่นอน 100%) | Inductive: กรณีเฉพาะ → ข้อสรุปทั่วไป (เป็นความน่าจะเป็น)' },
      { q: 'โค้ด if pm25 > 50: alert = True เป็นตัวอย่างของ Reasoning แบบใด', choices: ['Probabilistic Reasoning', 'Bayesian Reasoning', 'Deductive Reasoning', 'Inductive Reasoning'], answer: 2, explain: 'เป็น Deductive Reasoning เพราะใช้กฎที่กำหนดไว้ล่วงหน้า ผลลัพธ์ถูกบังคับด้วยเงื่อนไข ไม่มีความน่าจะเป็น' },
      { q: 'Logical Reasoning เป็นรูปแบบของ Reasoning ประเภทใด', choices: ['Inductive Reasoning', 'Deductive Reasoning', 'Probabilistic Reasoning', 'Bayesian Reasoning'], answer: 1, explain: 'Logical Reasoning คือการนำ Deductive Reasoning มาทำให้เป็นรูปธรรมผ่าน Logical Operators' },
      { q: 'Logical Operator ใดที่จริงเมื่ออย่างน้อยหนึ่งเงื่อนไขจริง', choices: ['AND', 'NOT', 'OR', 'XOR'], answer: 2, explain: 'OR (Disjunction) จริงเมื่ออย่างน้อยหนึ่งเงื่อนไขจริง ตรงข้ามกับ AND ที่ต้องทุกเงื่อนไขจริง' },
      { q: 'Implication (A → B) เป็นเท็จได้ในกรณีใด', choices: ['A เท็จ B จริง', 'A เท็จ B เท็จ', 'A จริง B เท็จ', 'A จริง B จริง'], answer: 2, explain: 'A → B เป็นเท็จเฉพาะเมื่อ A จริงแต่ B เท็จ (ขัดแย้ง) กรณีอื่นๆ ทั้งหมดเป็นจริง' },
      { q: 'XOR (Exclusive OR) ต่างจาก OR อย่างไร', choices: ['XOR จริงเมื่อทั้งสองเงื่อนไขจริง', 'XOR จริงเมื่อเงื่อนไขใดหนึ่งจริงเพียงตัวเดียวเท่านั้น', 'XOR เหมือน AND ทุกประการ', 'XOR จริงเมื่ออย่างน้อยหนึ่งเงื่อนไขจริง'], answer: 1, explain: 'XOR จริงเมื่อ A หรือ B จริงเพียงตัวเดียว ถ้าทั้งสองจริงพร้อมกัน XOR จะเป็นเท็จ' },
      { q: 'Conditional Probability P(A|B) หมายความว่าอะไร', choices: ['ความน่าจะเป็นของ A คูณ B', 'ความน่าจะเป็นของ A หรือ B', 'ความน่าจะเป็นของ A เมื่อรู้ว่า B เกิดขึ้นแล้ว', 'ความน่าจะเป็นของ A และ B พร้อมกัน'], answer: 2, explain: 'P(A|B) คือ Conditional Probability ความน่าจะเป็นของ A โดยมีเงื่อนไขว่า B เกิดขึ้นแล้ว' },
      { q: 'ใน Bayesian Reasoning คำว่า Prior หมายถึงอะไร', choices: ['ความเชื่อหลังจากได้รับข้อมูลใหม่', 'ความเชื่อเดิมก่อนได้รับหลักฐานใหม่', 'ความน่าจะเป็นของหลักฐาน', 'ผลลัพธ์สุดท้ายของการคำนวณ'], answer: 1, explain: 'Prior คือความเชื่อเดิม (ก่อนรับข้อมูลใหม่) เช่น P(PM2.5 สูง) = 0.30 จากข้อมูลย้อนหลัง' },
      { q: 'ถ้า P(A)=0.30, P(B|A)=0.60, P(B)=0.40 ค่า Posterior P(A|B) คือเท่าใด', choices: ['0.30', '0.45', '0.60', '0.72'], answer: 1, explain: 'P(A|B) = (0.60 × 0.30) / 0.40 = 0.18 / 0.40 = 0.45 ความเชื่อเพิ่มจาก 30% เป็น 45% หลังรู้ว่า B เกิดขึ้น' },
      { q: 'ข้อใดกล่าวถูกต้องเกี่ยวกับข้อจำกัดของ Deductive Reasoning', choices: ['รองรับความไม่แน่นอนได้ดี', 'ถ้ากฎตั้งต้นผิด ข้อสรุปจะผิดทั้งหมด', 'เหมาะกับ Machine Learning มากที่สุด', 'ให้ผลเป็นความน่าจะเป็นเสมอ'], answer: 1, explain: 'ข้อจำกัดสำคัญของ Deductive คือถ้า Premise ผิด ข้อสรุปจะผิดทั้งหมด และไม่รองรับความไม่แน่นอน' },
      { q: 'ในการรวม Logical + Probabilistic Reasoning เข้าด้วยกัน Logical Reasoning ทำหน้าที่อะไร', choices: ['ประเมินระดับความเสี่ยง', 'กำหนด Hard constraints ที่ห้ามผิด', 'อัปเดตความเชื่อตามข้อมูลใหม่', 'คำนวณความน่าจะเป็น Posterior'], answer: 1, explain: 'ในการใช้ร่วมกัน: Logical = Hard constraints (กรอบที่ห้ามผิด) ส่วน Probabilistic = ประเมินความเสี่ยงภายในกรอบนั้น' },
      { q: 'Probabilistic Reasoning เป็นรูปแบบของ Reasoning ประเภทใด', choices: ['Deductive Reasoning', 'Inductive Reasoning', 'Explicit Reasoning', 'Logical Reasoning'], answer: 1, explain: 'Probabilistic/Bayesian Reasoning เป็นรูปแบบของ Inductive Reasoning ที่ใช้ข้อมูลประเมินความน่าจะเป็นและความเชื่อ' },
      { q: 'ข้อจำกัดของ Inductive Reasoning คือข้อใด', choices: ['ไม่รองรับความไม่แน่นอน', 'ไม่สามารถใช้กับ Machine Learning ได้', 'เสี่ยงต่อ Overgeneralization และอ่อนไหวต่อ bias', 'ผลลัพธ์ต้องแน่นอน 100%'], answer: 2, explain: 'ข้อจำกัดของ Inductive: Overgeneralization, ขึ้นกับคุณภาพข้อมูล, อ่อนไหวต่อ bias' },
      { q: 'Biconditional (A ↔ B) หมายความว่าอะไร', choices: ['A จริงถ้า B จริง (ทิศทางเดียว)', 'A จริงก็ต่อเมื่อ B จริง ทั้งสองต้องมีค่าความจริงเหมือนกัน', 'A หรือ B จริงอย่างน้อยหนึ่งตัว', 'A และ B จริงพร้อมกันเท่านั้น'], answer: 1, explain: 'Biconditional (↔) คือ "ก็ต่อเมื่อ" ทั้งสองต้องมีค่าความจริงเหมือนกัน (T↔T=T, F↔F=T, T↔F=F)' },
      { q: 'ข้อใดเป็นตัวอย่างของ Inductive Reasoning', choices: ['ถ้า PM2.5 > 50 ต้องประกาศเตือน', 'if pm25 > 50: alert = True', 'จากข้อมูล 4 ปี พบว่า 70% ของวันลมสงบ PM2.5 จะเกิน 50', 'นโยบายกำหนดให้เตือนเมื่อ PM2.5 เกิน 37'], answer: 2, explain: 'การสรุปจากข้อมูลย้อนหลังว่า "70% ของวันลมสงบ PM2.5 สูง" คือ Inductive Reasoning เพราะสรุปจากข้อมูลจำนวนมาก' },
      { q: 'Likelihood P(B|A) ใน Bayesian Reasoning หมายถึงอะไร', choices: ['ความเชื่อเดิมก่อนรับข้อมูล', 'ความน่าจะเป็นที่จะพบหลักฐาน B เมื่อ A เป็นจริง', 'ความเชื่อหลังอัปเดต', 'ความน่าจะเป็นรวมของหลักฐาน B'], answer: 1, explain: 'Likelihood คือ P(B|A) ความน่าจะเป็นที่จะพบหลักฐาน B เมื่อสมมติว่า A เป็นจริง เช่น P(ลมสงบ|PM2.5 สูง) = 0.60' },
      { q: 'Deductive Reasoning เหมาะกับงานประเภทใดมากที่สุด', choices: ['Machine Learning', 'Data Mining', 'Rule-based system นโยบาย กฎหมาย', 'Clustering'], answer: 2, explain: 'Deductive เหมาะกับ Rule-based system, Policy enforcement, Safety condition เพราะผลลัพธ์เด็ดขาดและตรวจสอบได้' },
      { q: 'การแปลง Implication: A → B ด้วย AND/OR/NOT คืออะไร', choices: ['A → B ≡ A ∧ B', 'A → B ≡ (¬A) ∨ B', 'A → B ≡ A ∨ (¬B)', 'A → B ≡ (¬A) ∧ (¬B)'], answer: 1, explain: 'A → B ≡ (¬A) ∨ B "ถ้า A แล้ว B" เท่ากับ "A เป็นเท็จ หรือ B เป็นจริง"' },
      { q: 'เหตุใด Data Scientist จึงต้องรู้จัก Reasoning ก่อนสร้าง ML Model', choices: ['เพราะ Reasoning ทำให้โมเดล train เร็วขึ้น', 'เพราะต้องสร้าง baseline decision วิเคราะห์ความเสี่ยง และออกแบบ logic ก่อน', 'เพราะ ML ไม่สามารถทำงานได้โดยไม่มี Reasoning', 'เพราะ Reasoning แทน ML ได้ทุกกรณี'], answer: 1, explain: 'ก่อนสร้าง ML ต้องสร้าง baseline decision, วิเคราะห์ความเสี่ยง, ออกแบบ logic/probability ถ้า reasoning ไม่เป็นจะตัดสินใจผิดพลาดได้' },
      { q: 'Bayesian Reasoning อัปเดตความเชื่อ หมายความว่าอะไร', choices: ['เปลี่ยนกฎความปลอดภัยตามสถานการณ์', 'ปรับระดับความน่าจะเป็น Prior ให้เป็น Posterior เมื่อมีหลักฐานใหม่', 'ลบข้อมูลเก่าและใช้ข้อมูลใหม่แทน', 'เปลี่ยน Threshold การตัดสินใจ'], answer: 1, explain: 'Bayesian Reasoning อัปเดตความเชื่อ: Prior → Posterior เมื่อมีหลักฐานใหม่ เป็นการปรับระดับความเสี่ยงตาม evidence' }
    ]
  },
  {
    id: 'ds10',
    category: 'Data Science',
    name: 'DS Week 10',
    icon: '📷',
    color: '#84cc16',
    iconBg: 'rgba(132,204,22,0.15)',
    desc: 'Computer Vision · Image Processing · CV Tasks',
    questions: [
      { q: 'ในมุมมอง Data Science ภาพดิจิทัลคืออะไร', choices: ['ไฟล์กราฟิกที่ไม่สามารถนำมาวิเคราะห์ได้', 'ข้อมูลอีกชนิดหนึ่ง (data modality) ในรูปของ array/tensor', 'ผลลัพธ์สุดท้ายของการวิเคราะห์', 'เครื่องมือสำหรับสร้าง visualization เท่านั้น'], answer: 1, explain: 'ใน Data Science ภาพ = ข้อมูล (array/feature space), Image processing = feature engineering รูปแบบหนึ่ง' },
      { q: 'ภาพสี RGB มีโครงสร้างเป็นอย่างไร', choices: ['เมทริกซ์ 2 มิติ (H × W)', 'เวกเตอร์ 1 มิติ', 'เทนเซอร์ 3 มิติ (H × W × 3)', 'สเกลาร์ตัวเดียว'], answer: 2, explain: 'ภาพสี RGB = Tensor 3 มิติ (Height × Width × 3 channels) ส่วนภาพขาวดำ = Matrix 2 มิติ (H × W)' },
      { q: 'ความแตกต่างระหว่าง Image Processing และ Computer Vision คืออะไร', choices: ['Image Processing = เป้าหมาย Computer Vision = เครื่องมือ', 'ทั้งสองอย่างเหมือนกัน', 'Image Processing = ปรับปรุงคุณภาพภาพ Computer Vision = เข้าใจความหมายในภาพ', 'Computer Vision ทำได้เฉพาะภาพขาวดำ'], answer: 2, explain: 'Image Processing = เครื่องมือ (blur, edge, ปรับภาพ) | Computer Vision = เป้าหมาย (เข้าใจความหมาย detect, classify)' },
      { q: 'Metric Sharpness วัดจากอะไร', choices: ['ค่าเฉลี่ยของความสว่าง', 'Variance ของ Laplacian', 'Standard Deviation ของ pixel', 'จำนวน edge ในภาพ'], answer: 1, explain: 'Sharpness วัดจาก Variance of Laplacian ค่าสูง = ภาพคม, ค่าต่ำ = ภาพเบลอ' },
      { q: 'CV Task ประเภทใดที่ตอบคำถามว่าภาพนี้คืออะไร', choices: ['Object Detection', 'Segmentation', 'Image Classification', 'Feature Extraction'], answer: 2, explain: 'Image Classification ตอบคำถาม "ภาพนี้คืออะไร" เช่น ภาพท้องฟ้า → clear หรือ smog' },
      { q: 'Object Detection แตกต่างจาก Image Classification อย่างไร', choices: ['Object Detection บอกประเภทภาพ Classification ระบุตำแหน่ง', 'Object Detection ระบุตำแหน่ง + ประเภทวัตถุ Classification บอกแค่ประเภทภาพ', 'ทั้งสองอย่างเหมือนกัน', 'Object Detection ใช้ได้เฉพาะวิดีโอ'], answer: 1, explain: 'Classification: ภาพนี้คืออะไร | Detection: ระบุตำแหน่ง (bounding box) + ประเภทวัตถุในภาพ' },
      { q: 'Gaussian Blur ใน Image Processing มีประโยชน์อะไร', choices: ['เพิ่มความคมชัดของภาพ', 'ลด noise ก่อนทำ Edge Detection', 'เพิ่มจำนวน pixel', 'แปลงภาพสีเป็นขาวดำ'], answer: 1, explain: 'Gaussian Blur ลด noise ในภาพ มักใช้ก่อน Edge Detection เช่น Canny เพื่อให้ผลลัพธ์ดีขึ้น' },
      { q: 'การแปลง RGB เป็น Grayscale เปรียบเหมือนอะไรใน Data Science', choices: ['Data augmentation', 'Feature scaling', 'Dimension reduction', 'Data imputation'], answer: 2, explain: 'การแปลง RGB (3 channels) เป็น Grayscale (1 channel) คือการลดมิติข้อมูล (Dimension Reduction)' },
      { q: 'Metric Mean Saturation บอกอะไรในบริบท haze', choices: ['ความคมชัดของภาพ', 'ความสว่างโดยรวม', 'ภาพซีดหรือหม่น haze มัก saturation ต่ำ', 'จำนวน edge ในภาพ'], answer: 2, explain: 'Mean Saturation วัดจาก HSV channel S ภาพที่มีหมอกหรือหม่นจะมี saturation ต่ำ ใช้แยก hazy vs clear ได้' },
      { q: 'Segmentation Task ใน Computer Vision ทำอะไร', choices: ['จัดประเภทภาพทั้งใบ', 'ระบุตำแหน่งวัตถุด้วย bounding box', 'แยกพื้นที่ของวัตถุออกจากกันในระดับ pixel', 'วัดขนาดของภาพ'], answer: 2, explain: 'Segmentation แยกพื้นที่ของวัตถุใน pixel level เช่น แยกพื้นที่หมอกควันในภาพดาวเทียม' },
      { q: 'ข้อจำกัดของ Image Representation ในทาง Data Science คืออะไร', choices: ['ภาพมีขนาดใหญ่เกินไปเสมอ', 'แสง มุมกล้อง สภาพอากาศ ทำให้เกิด noise และภาพเดียวกันอาจตีความต่างกัน', 'ภาพไม่สามารถแปลงเป็นตัวเลขได้', 'Computer Vision ต้องการ labeled data เสมอ'], answer: 1, explain: 'ข้อจำกัดสำคัญ: แสง มุมกล้อง สภาพอากาศ → noise | ภาพเดียวกันอาจตีความต่าง | ภาพไม่ใช่ ground truth เสมอ' },
      { q: 'Edge Density metric คืออะไร และ haze ส่งผลอย่างไร', choices: ['วัดความสว่าง haze ทำให้สว่างขึ้น', 'วัดสัดส่วนของโครงสร้างหรือขอบในภาพ haze ทำให้ edge หายไป', 'วัดขนาดของภาพ haze ไม่ส่งผล', 'วัด saturation haze ทำให้เพิ่มขึ้น'], answer: 1, explain: 'Edge Density วัดสัดส่วนของโครงสร้างหรือขอบในภาพ เมื่อมี haze/blur ภาพจะเบลอและ edge จะหายไป ทำให้ค่าลดลง' },
      { q: 'ใน CRISP-DM Computer Vision เกี่ยวข้องกับ phase ใด', choices: ['เฉพาะ Deployment', 'เฉพาะ Data Collection', 'ทุก phase ตั้งแต่ Business Understanding ถึง Evaluation', 'เฉพาะ Modeling'], answer: 2, explain: 'CV เกี่ยวข้องทุก phase: Business Understanding (ต้องการเห็นอะไร?) Data Understanding (ภาพแทนจริงได้แค่ไหน?) Modeling Evaluation' },
      { q: 'Intensity Range (Max-Min) มีข้อจำกัดอะไร', choices: ['ใช้หน่วยความจำมากเกินไป', 'คำนวณช้า', 'Sensitive ต่อ outlier pixel เดียวก็ทำให้ค่าพังได้', 'ไม่สามารถใช้กับภาพสีได้'], answer: 2, explain: 'Intensity Range = Max-Min มีปัญหาว่า sensitive ต่อ outlier pixel เพียงตัวเดียวที่สว่างหรือมืดมากก็ทำให้ค่าผิดเพี้ยนได้' },
      { q: 'Shannon Entropy ในบริบทภาพบอกอะไร', choices: ['ความสว่างเฉลี่ยของภาพ', 'จำนวน edge ในภาพ', 'ความหลากหลายของ intensity ในภาพ', 'ขนาดไฟล์ของภาพ'], answer: 2, explain: 'Shannon Entropy บอกความหลากหลายของ intensity ภาพ hazy/blur มัก entropy ต่ำ เพราะ pixel มีความหลากหลายน้อยลง' }
    ]
  },
  {
    id: 'ds11',
    category: 'Data Science',
    name: 'DS Week 11',
    icon: '📝',
    color: '#f43f5e',
    iconBg: 'rgba(244,63,94,0.15)',
    desc: 'NLP · Tokenization · Bag-of-Words · TF-IDF',
    questions: [
      { q: 'NLP คืออะไรในมุมมองของ Data Science', choices: ['การแปลภาษาอัตโนมัติเท่านั้น', 'สาขาของ AI ที่ทำให้คอมพิวเตอร์จัดการ วิเคราะห์ และตีความภาษาในโลกจริง', 'เครื่องมือสำหรับสร้าง Chatbot เท่านั้น', 'การเขียนโปรแกรมภาษาธรรมชาติ'], answer: 1, explain: 'NLP คือสาขาของ AI และ Data Science ที่ทำให้คอมพิวเตอร์สามารถจัดการ วิเคราะห์ และตีความภาษาในโลกจริง' },
      { q: 'ทำไม Text จึงต้องแปลงเป็นตัวเลขก่อน', choices: ['เพื่อลดขนาดไฟล์', 'เพราะโมเดลไม่สามารถทำงานกับตัวอักษรได้โดยตรง', 'เพื่อเพิ่มความเร็วในการอ่าน', 'เพราะภาษาไทยไม่มีรหัส ASCII'], answer: 1, explain: 'Text เป็น unstructured data โมเดลทำงานกับตัวเลข ต้องแปลง Text → ตัวเลขผ่าน Text Representation ก่อน' },
      { q: 'Tokenization คืออะไร', choices: ['การแปลงข้อความเป็นภาษาอื่น', 'กระบวนการแบ่งข้อความออกเป็นหน่วยย่อย (tokens)', 'การลบ stopwords ออกจากข้อความ', 'การแปลงคำเป็น vector'], answer: 1, explain: 'Tokenization คือกระบวนการแบ่งข้อความออกเป็นหน่วยย่อย (tokens) เช่น "Data science" → ["data", "science"]' },
      { q: 'ภาษาไทยมีความท้าทายด้าน Tokenization อย่างไร', choices: ['ภาษาไทยมี whitespace มากเกินไป', 'ภาษาไทยไม่มี delimiter ระหว่างคำ มี ambiguity สูง ต้องพึ่ง dictionary หรือ statistical model', 'ภาษาไทยมีตัวอักษรน้อยเกินไป', 'ภาษาไทย tokenize ได้ง่ายกว่าภาษาอังกฤษ'], answer: 1, explain: 'ภาษาไทยไม่มี whitespace/delimiter ระหว่างคำ มี ambiguity สูง ต้องพึ่ง dictionary หรือ statistical model เช่น PyThaiNLP' },
      { q: 'Bag-of-Words (BoW) มีแนวคิดหลักอย่างไร', choices: ['คำนึงถึงลำดับคำในประโยค', 'เอกสาร = ถุงคำ ไม่สนลำดับ สนใจแค่ความถี่', 'วิเคราะห์ความหมายเชิงบริบทของคำ', 'ใช้ได้เฉพาะภาษาอังกฤษ'], answer: 1, explain: 'BoW: เอกสาร = ถุงคำ ไม่สนลำดับ สนใจความถี่ | มุมมองเรขาคณิต: เอกสาร = vector, คำ = dimension' },
      { q: 'TF-IDF ปรับน้ำหนักคำอย่างไร', choices: ['ให้น้ำหนักคำที่ยาวที่สุดมากกว่า', 'ให้คำที่พบเยอะในเอกสารหนึ่งแต่ไม่พบในทุกเอกสารมีน้ำหนักสูง', 'ให้น้ำหนักเท่ากันทุกคำ', 'ให้คำที่พบในทุกเอกสารมีน้ำหนักสูง'], answer: 1, explain: 'TF-IDF ให้น้ำหนักสูงกับคำที่พบบ่อยในเอกสารนั้นๆ แต่ไม่ได้พบในทุกเอกสาร ช่วยลดผลของคำที่พบบ่อยแต่ไม่ informative' },
      { q: 'ข้อจำกัดสำคัญของ Bag-of-Words คืออะไร', choices: ['คำนวณช้าเกินไป', 'ใช้หน่วยความจำมากเกินไป', 'ไม่เข้าใจความหมายของคำ รู้แค่คำไหนโผล่แต่ไม่รู้ว่าคำไหนคล้ายกัน', 'ใช้ได้เฉพาะภาษาที่มี dictionary'], answer: 2, explain: 'BoW ไม่เข้าใจ semantic similarity เช่น "แพทย์" กับ "โรงพยาบาล" ถูกมองว่าไม่เกี่ยวกัน และไม่สนลำดับคำ' },
      { q: 'Word Embedding แตกต่างจาก Bag-of-Words อย่างไร', choices: ['Word Embedding คำนวณความถี่คำ', 'Word Embedding แทนคำด้วย vector ที่คำมีความหมายใกล้กันจะมี vector ใกล้กัน', 'Word Embedding ใช้ได้เฉพาะภาษาอังกฤษ', 'Word Embedding ไม่สามารถใช้กับ ML ได้'], answer: 1, explain: 'Word Embedding แทนคำด้วย vector โดยคำที่มีความหมายใกล้กัน → vector ใกล้กัน สามารถจับ semantic similarity ได้' },
      { q: 'Text Classification ใน NLP คืออะไร', choices: ['การแบ่งประโยคออกเป็นคำ', 'การจัดประเภทข้อความออกเป็นหมวดหมู่', 'การแปลข้อความเป็นภาษาอื่น', 'การสรุปเนื้อหาข้อความ'], answer: 1, explain: 'Text Classification คือการจัดประเภทข้อความ เช่น spam/not spam, positive/negative sentiment, policy/health/report' },
      { q: 'Weak Labeling ในบริบท NLP หมายถึงอะไร', choices: ['การใช้ label ที่ไม่ถูกต้อง', 'การใช้กฎ keyword-based ในการกำหนด label เบื้องต้นแทน human annotation', 'การฝึกโมเดลด้วยข้อมูลน้อย', 'การใช้โมเดลที่ไม่แม่นยำ'], answer: 1, explain: 'Weak Labeling คือการใช้ keyword/rule-based เพื่อกำหนด label เบื้องต้น เร็วกว่า manual annotation แต่ label อาจไม่สมบูรณ์' },
      { q: 'ข้อใดเป็น NLP Task ที่วิเคราะห์ทัศนคติ (บวก/ลบ/กลาง)', choices: ['Topic Modeling', 'Sentiment Analysis', 'Information Extraction', 'Summarization'], answer: 1, explain: 'Sentiment Analysis วิเคราะห์ทัศนคติหรือความรู้สึกในข้อความ เช่น รีวิว "ดีมาก" = positive' },
      { q: 'การเลือก Text Representation มีผลต่อโมเดลอย่างไร', choices: ['ไม่มีผลต่อโมเดลเลย', 'มีผลเฉพาะขนาดไฟล์', 'Representation = assumption สิ่งที่ไม่ represent = information loss ส่งผลต่อสิ่งที่โมเดลมองเห็น', 'มีผลเฉพาะความเร็วในการ train'], answer: 2, explain: 'Representation = assumption | สิ่งที่เลือก represent = สิ่งที่โมเดลมองเห็น | สิ่งที่ไม่ represent = information loss' },
      { q: 'Stopwords คืออะไรและทำไมต้องลบออก', choices: ['คำที่ยาวที่สุดในประโยค ลบเพื่อลดขนาด', 'คำที่พบบ่อยแต่มีความหมายน้อย เช่น the is ใน และ ลบเพื่อลด noise', 'คำที่สะกดผิด ลบเพื่อความถูกต้อง', 'คำที่เป็น technical terms ลบเพื่อความเข้าใจง่าย'], answer: 1, explain: 'Stopwords คือคำที่พบบ่อยแต่ไม่มีความหมายเชิง content เช่น "the", "is", "ใน", "และ" ลบออกเพื่อลด noise และขนาด feature space' },
      { q: 'LLM เชื่อมโยงกับ NLP แบบดั้งเดิมอย่างไร', choices: ['LLM ไม่เกี่ยวข้องกับ NLP เลย', 'LLM พัฒนาต่อยอดจาก BoW → representation learning → context → general-purpose', 'LLM ใช้ BoW เป็นหลัก', 'LLM ทำงานโดยไม่ต้องการ Text Representation'], answer: 1, explain: 'วิวัฒนาการ: manual feature (BoW) → representation learning (Word Embedding) → context-aware → task-specific → general-purpose (LLM)' },
      { q: 'ข้อใดเป็น Evaluation Metric สำหรับ Classification Model ใน NLP', choices: ['RMSE, MAE, R²', 'Precision, Recall, F1-score', 'Silhouette Score', 'Pearson Correlation'], answer: 1, explain: 'สำหรับ Text Classification ใช้ Precision, Recall, F1-score ซึ่งเหมาะกับ classification task มากกว่า regression metric' }
    ]
  },
  {
    id: 'ds12',
    category: 'Data Science',
    name: 'DS Week 12',
    icon: '🤖',
    color: '#d946ef',
    iconBg: 'rgba(217,70,239,0.15)',
    desc: 'Machine Learning · Task Types · PyCaret',
    questions: [
      { q: 'ข้อใดคือความแตกต่างหลักระหว่าง Supervised และ Unsupervised Learning', choices: ['Supervised ใช้ข้อมูลมาก Unsupervised ใช้น้อย', 'Supervised มี label (target variable) ส่วน Unsupervised ไม่มี', 'Supervised ช้ากว่า Unsupervised', 'Supervised ใช้ได้เฉพาะ Regression'], answer: 1, explain: 'Supervised: มี label → Input(X) → Model → Output(y) | Unsupervised: ไม่มี label → Input(X) → Discover Structure' },
      { q: 'ML Task ใดใช้เมื่อต้องการทำนายค่าตัวเลขต่อเนื่อง เช่น ราคาบ้านหรือค่า PM2.5', choices: ['Classification', 'Clustering', 'Regression', 'Anomaly Detection'], answer: 2, explain: 'Regression ใช้เมื่อ Output เป็นตัวเลขต่อเนื่อง เช่น ทำนายค่า PM2.5, ราคา, ยอดขาย' },
      { q: 'ML Task ใดเหมาะกับการแบ่ง AQI เป็น Good/Moderate/Unhealthy', choices: ['Regression', 'Clustering', 'Time-Series', 'Classification'], answer: 3, explain: 'Classification ใช้เมื่อ Output เป็นหมวดหมู่ เช่น Good/Moderate/Unhealthy, Yes/No, Fraud/Not Fraud' },
      { q: 'Clustering แตกต่างจาก Classification อย่างไร', choices: ['Clustering มี label ส่วน Classification ไม่มี', 'Clustering ค้นหา pattern โดยไม่มี label ส่วน Classification ต้องมี label', 'Clustering ช้ากว่า Classification เสมอ', 'ทั้งสองอย่างเหมือนกัน'], answer: 1, explain: 'Clustering = Unsupervised ค้นหาโครงสร้างที่ซ่อนอยู่โดยไม่มี label | Classification = Supervised ต้องมี label ในการฝึก' },
      { q: 'Anomaly Detection ใช้ในกรณีใด', choices: ['ทำนายค่าตัวเลข', 'แบ่งกลุ่มข้อมูล', 'ต้องการจับเหตุการณ์หายากหรือ deviation จาก pattern ปกติ', 'วิเคราะห์ข้อมูลที่มีลำดับเวลา'], answer: 2, explain: 'Anomaly Detection ใช้จับเหตุการณ์ผิดปกติ เช่น วันค่าฝุ่น spike ผิดปกติ, ธุรกรรมต้องสงสัย, Sensor malfunction' },
      { q: 'ทำไม Time-Series จึงห้าม shuffle ข้อมูล', choices: ['เพราะข้อมูลจะสูญหาย', 'เพราะลำดับเวลามีความสำคัญ การใช้ข้อมูลอนาคตฝึกโมเดลคือ data leakage', 'เพราะ shuffle ทำให้โมเดลช้าลง', 'เพราะข้อมูล Time-Series มักมี missing values'], answer: 1, explain: 'Time-Series ต้อง split ตามเวลา ห้าม shuffle เพราะอดีตมีผลต่ออนาคต การเอาข้อมูลอนาคตมาฝึกคือ data leakage' },
      { q: 'Association Rule Mining ใช้ทำอะไร', choices: ['ทำนายค่าตัวเลข', 'แบ่งกลุ่มลูกค้า', 'หากฎความสัมพันธ์แบบ If-Then เช่น สินค้า A มักซื้อคู่ B', 'ทำนายยอดขายในอนาคต'], answer: 2, explain: 'Association Rule Mining หา co-occurrence pattern แบบ If-Then เช่น "ถ้าซื้อ A มักซื้อ B ด้วย"' },
      { q: 'Train/Validation/Test Split มีบทบาทต่างกันอย่างไร', choices: ['ทั้งสามชุดใช้เพื่อฝึกโมเดล', 'Train=ฝึก, Validation=เลือกโมเดล, Test=ประเมินขั้นสุดท้าย', 'Train=ทดสอบ, Validation=ฝึก, Test=เลือกโมเดล', 'ทั้งสามชุดเหมือนกันทุกประการ'], answer: 1, explain: 'Train: สร้างโมเดล | Validation: เลือกโมเดล/ปรับ hyperparameter | Test: ประเมินครั้งสุดท้าย (ใช้เมื่อตัดสินใจแล้วเท่านั้น)' },
      { q: 'Overfitting คืออะไร', choices: ['โมเดลทำงานช้าเกินไป', 'โมเดลจำข้อมูล train แต่ทำงานได้ไม่ดีกับข้อมูลใหม่', 'โมเดลใช้ feature มากเกินไป', 'โมเดลมีขนาดไฟล์ใหญ่เกินไป'], answer: 1, explain: 'Overfitting คือโมเดลจำข้อมูล training แต่ทำงานได้ไม่ดีกับข้อมูลที่ไม่เคยเห็น เป็นเหตุผลที่ต้องแยก Train/Test' },
      { q: 'Cross-Validation ดีกว่า Validation Set เดียวอย่างไร', choices: ['CV คำนวณเร็วกว่า', 'CV ใช้ข้อมูลน้อยกว่า', 'CV ประเมินหลายรอบทำให้ผลเสถียรกว่า ไม่ขึ้นกับการสุ่มครั้งเดียว', 'CV ไม่ต้องการ Test set'], answer: 2, explain: 'Cross-Validation แบ่งเป็นหลาย fold ประเมินหลายรอบ ผลเสถียรกว่า ไม่ขึ้นกับการสุ่มแบ่ง train/val ครั้งเดียว' },
      { q: 'PyCaret มีประโยชน์อะไรใน ML Workflow', choices: ['ใช้แทน pandas ในการจัดการข้อมูล', 'เปรียบเทียบหลายโมเดลได้เร็ว เหมาะสำหรับสร้าง baseline', 'ใช้ deploy โมเดลขึ้น production', 'ใช้สำหรับ Deep Learning เท่านั้น'], answer: 1, explain: 'PyCaret = High-level ML library ที่ช่วยเปรียบเทียบหลายโมเดลได้เร็ว เหมาะสำหรับ baseline exploration' },
      { q: 'การใช้ test set เพื่อเลือกโมเดลหลายครั้งผิดพลาดอย่างไร', choices: ['ทำให้โมเดลช้าลง', 'ไม่มีผลอะไร', 'ทำให้ test set กลายเป็น validation โดยปริยาย ผลไม่ได้สะท้อนข้อมูลใหม่จริงๆ', 'ทำให้โมเดลใช้ RAM มากขึ้น'], answer: 2, explain: 'Test set ควรใช้เมื่อตัดสินใจแล้วครั้งเดียว ถ้าใช้หลายครั้งเพื่อเลือกโมเดล test set จะกลายเป็น validation โดยปริยาย' },
      { q: 'Stratified Split ใช้ในกรณีใด', choices: ['Regression เสมอ', 'Time-Series เสมอ', 'Classification เพื่อรักษาสัดส่วน class ในทุก split', 'Clustering เสมอ'], answer: 2, explain: 'Stratified Split ใช้ใน Classification เพื่อรักษาสัดส่วน class ให้เหมือนกันใน train/test เหมาะกับ imbalanced dataset' },
      { q: 'โจทย์ "มีอะไรผิดปกติในข้อมูล sensor?" ควรใช้ ML Task ใด', choices: ['Regression', 'Classification', 'Clustering', 'Anomaly Detection'], answer: 3, explain: 'Anomaly Detection เหมาะกับการตรวจจับสิ่งผิดปกติ เช่น Sensor malfunction, ค่าที่ spike ผิดปกติ' },
      { q: 'ข้อใดเป็นความผิดพลาดที่พบบ่อยใน Data Splitting', choices: ['การใช้ random_state', 'การ scale ข้อมูลก่อน split ทำให้ข้อมูล test รั่วไหล', 'การใช้ stratify ใน Classification', 'การแบ่ง 80/20'], answer: 1, explain: 'Scaling ก่อน split เป็นความผิดพลาดที่พบบ่อย เพราะ scaler จะเห็นข้อมูล test → data leakage ต้อง fit scaler บน train เท่านั้น' }
    ]
  },
  {
    id: 'ds13',
    category: 'Data Science',
    name: 'DS Week 13',
    icon: '📊',
    color: '#fb923c',
    iconBg: 'rgba(251,146,60,0.15)',
    desc: 'Model Evaluation · Metrics · Classification · Regression',
    questions: [
      { q: 'Confusion Matrix ประกอบด้วยอะไรบ้าง', choices: ['Precision, Recall, F1, Accuracy', 'TP, TN, FP, FN', 'MAE, MSE, RMSE, R²', 'Silhouette, Calinski, Davies-Bouldin'], answer: 1, explain: 'Confusion Matrix แสดง TP (ทายถูกบวก), TN (ทายถูกลบ), FP (ทายผิดเป็นบวก), FN (ทายผิดเป็นลบ)' },
      { q: 'Precision คืออะไร', choices: ['สัดส่วนของการทำนายถูกต้องทั้งหมด', 'TP / (TP + FP) ความแม่นยำในการทำนายค่าบวก', 'TP / (TP + FN) ความไวในการทำนายค่าบวก', 'ค่าเฉลี่ยของ Precision และ Recall'], answer: 1, explain: 'Precision = TP / (TP + FP) บอกว่าในสิ่งที่โมเดลทายว่าบวก มีที่ถูกต้องกี่ % ป้องกัน False Alarm' },
      { q: 'Recall (Sensitivity) คืออะไร', choices: ['TP / (TP + FP)', 'TP / (TP + FN) ความไวในการจับ True Positive', '(TP + TN) / Total', '2 × Precision × Recall / (Precision + Recall)'], answer: 1, explain: 'Recall = TP / (TP + FN) บอกว่าในของจริงที่เป็นบวกทั้งหมด โมเดลจับได้กี่ % สำคัญเมื่อ False Negative อันตราย' },
      { q: 'F1 Score คืออะไรและใช้เมื่อใด', choices: ['ค่าเฉลี่ยแบบธรรมดาของ Precision และ Recall', 'ค่าเฉลี่ย Harmonic ของ Precision และ Recall ใช้เมื่อต้องการ balance ระหว่างสองค่า', 'เหมือน Accuracy แต่คำนวณต่างกัน', 'ใช้เฉพาะ Regression'], answer: 1, explain: 'F1 = 2×P×R/(P+R) เป็น Harmonic Mean ให้น้ำหนักเท่ากันระหว่าง Precision และ Recall เหมาะกับ imbalanced data' },
      { q: 'ทำไม Accuracy อาจหลอกในกรณี Class Imbalance', choices: ['Accuracy คำนวณผิดพลาด', 'โมเดลที่ทายทุกตัวเป็น majority class อาจได้ Accuracy สูงโดยไม่ได้เรียนรู้อะไร', 'Accuracy ไม่ใช่ metric ที่ถูกต้อง', 'Accuracy ใช้ได้เฉพาะ Binary Classification'], answer: 1, explain: 'ถ้า 90% เป็น class A โมเดลทาย A ทุกตัว → Accuracy 90% แต่ไม่ได้เรียนรู้อะไร Cohen Kappa และ MCC แกปัญหานี้' },
      { q: 'Cohen Kappa วัดอะไร', choices: ['ความแม่นยำโดยรวม', 'ระดับความสอดคล้องหลังหักความสอดคล้องที่เกิดโดยบังเอิญออก', 'ความเร็วของโมเดล', 'จำนวน feature ที่ใช้'], answer: 1, explain: 'Kappa = (Po - Pe) / (1 - Pe) วัดว่าโมเดลดีกว่าการเดาแบบสุ่มตามสัดส่วนข้อมูลแค่ไหน' },
      { q: 'MCC มีข้อดีอะไรเหนือ Accuracy', choices: ['MCC คำนวณเร็วกว่า', 'MCC ไม่ถูกหลอกโดย class imbalance ให้ค่า 0 เมื่อโมเดลแยกคลาสได้ไม่จริง', 'MCC ใช้ได้เฉพาะ Binary Classification', 'MCC เหมือน Accuracy ทุกประการ'], answer: 1, explain: 'MCC ไม่ถูกหลอกโดย class imbalance โมเดลที่ทาย majority class ทุกตัวจะได้ MCC ≈ 0 ไม่ใช่ 90%' },
      { q: 'MAE (Mean Absolute Error) คืออะไร', choices: ['รากที่สองของ MSE', 'ค่าเฉลี่ยของ |ค่าจริง - ค่าทำนาย| ทุก sample', 'สัดส่วนความแปรปรวนที่โมเดลอธิบายได้', 'ค่าเฉลี่ยของ error ยกกำลังสอง'], answer: 1, explain: 'MAE = (1/n)Σ|yi - ŷi| ค่าเฉลี่ยของความคลาดเคลื่อนสัมบูรณ์ ตีความง่าย ไม่ลงโทษ error ใหญ่พิเศษ' },
      { q: 'RMSE ต่างจาก MAE อย่างไร', choices: ['RMSE ง่ายกว่า MAE ในการตีความ', 'RMSE ลงโทษ error ใหญ่มากกว่า MAE เพราะยกกำลังสอง', 'RMSE ให้ค่าน้อยกว่า MAE เสมอ', 'ไม่มีความแตกต่าง'], answer: 1, explain: 'RMSE = √MSE ลงโทษ error ขนาดใหญ่มากกว่า MAE เพราะยกกำลังสอง เหมาะเมื่อ error ใหญ่มีผลกระทบมาก' },
      { q: 'R² (R-squared) มีความหมายว่าอะไร', choices: ['ค่าเฉลี่ยของ error', 'สัดส่วนของความแปรปรวนใน y ที่โมเดลอธิบายได้ ค่าใกล้ 1 = ดี', 'จำนวน feature ที่มีนัยสำคัญ', 'ความเร็วของโมเดล'], answer: 1, explain: 'R² บอกว่าโมเดลอธิบายความแปรปรวนของ y ได้กี่ % R²=1 = สมบูรณ์, R²=0 = ไม่ดีกว่าทายค่าเฉลี่ย' },
      { q: 'Silhouette Score ใน Clustering ตีความอย่างไร', choices: ['ค่าสูง = กลุ่มทับซ้อนกัน', 'ค่าใกล้ 1 = sample อยู่ในกลุ่มที่ถูกต้องและกลุ่มแตกต่างจากกลุ่มอื่นชัดเจน', 'ค่าใกล้ 0 = การ clustering ดีที่สุด', 'ค่าเป็นลบ = clustering ไม่มีความหมาย'], answer: 1, explain: 'Silhouette: ใกล้ 1 = ดีมาก | ใกล้ 0 = อยู่บนเส้นแบ่งระหว่างกลุ่ม | ติดลบ = อาจอยู่ผิดกลุ่ม' },
      { q: 'Davies-Bouldin Index ควรมีค่าอย่างไรเมื่อ clustering ดี', choices: ['ค่าสูงที่สุดเท่าที่เป็นไปได้', 'ค่าต่ำที่สุด กลุ่มแยกจากกันชัดและ compact', 'ค่าเท่ากับ 1 เสมอ', 'ค่าอยู่ระหว่าง -1 ถึง 1'], answer: 1, explain: 'Davies-Bouldin Index ยิ่งต่ำยิ่งดี หมายถึงกลุ่มมีความ compact สูงและแยกจากกลุ่มอื่นชัดเจน' },
      { q: 'การเลือก Metric ผิดประเภทกับโจทย์ส่งผลอย่างไร', choices: ['ไม่มีผลใดๆ', 'อาจทำให้สรุปผิดทั้งงาน เช่น ใช้ Accuracy กับ imbalanced data', 'ทำให้โมเดล train ช้าลง', 'ทำให้ feature มีขนาดใหญ่ขึ้น'], answer: 1, explain: 'การใช้ metric ผิดประเภทอาจทำให้สรุปผิด เช่น Accuracy สูงแต่โมเดลใช้ไม่ได้จริง ต้องเลือก metric ให้สอดคล้องกับปัญหา' },
      { q: 'AUC-ROC วัดอะไร', choices: ['ค่าเฉลี่ยของ Precision ทุก threshold', 'พื้นที่ใต้กราฟ ROC วัดประสิทธิภาพในการแยกแยะระหว่างคลาส', 'ค่า R² ของ Regression', 'จำนวน True Positive'], answer: 1, explain: 'AUC (Area Under ROC Curve) วัดความสามารถของโมเดลในการแยกแยะระหว่างคลาส AUC=1 สมบูรณ์, AUC=0.5 ไม่ดีกว่าสุ่ม' },
      { q: 'Calinski-Harabasz Index ยิ่งสูงหมายความว่าอะไร', choices: ['Clustering แย่', 'Clustering ดีและชัดเจน กลุ่มแน่นและแยกจากกัน', 'ข้อมูลมี noise มาก', 'จำนวนกลุ่มมากเกินไป'], answer: 1, explain: 'Calinski-Harabasz Index ยิ่งสูงยิ่งดี หมายถึงความแปรปรวนระหว่างกลุ่มสูงเทียบกับความแปรปรวนภายในกลุ่ม' }
    ]
  },
  {
    id: 'ds14',
    category: 'Data Science',
    name: 'DS Week 14',
    icon: '🚀',
    color: '#22c55e',
    iconBg: 'rgba(34,197,94,0.15)',
    desc: 'Deployment · MLOps · Gradio · Responsible AI',
    questions: [
      { q: 'ใน CRISP-DM Deployment หมายถึงอะไร', choices: ['การเอาโมเดลขึ้น server เท่านั้น', 'การทำให้ผลลัพธ์ถูกนำไปใช้ตัดสินใจได้จริง รวมถึงสื่อสาร ติดตาม และจัดการความเสี่ยง', 'การเขียน documentation ของโมเดล', 'การลบโมเดลเก่าและเปลี่ยนใหม่'], answer: 1, explain: 'Deployment ครอบคลุม: ทำให้ผลลัพธ์ใช้ตัดสินใจได้จริง, สื่อสารข้อจำกัด, วางกลไกเฝ้าระวัง drift และ misuse' },
      { q: 'Batch Prediction แตกต่างจาก Real-Time Prediction อย่างไร', choices: ['Batch ตอบทันที Real-Time ทำงานเป็นรอบ', 'Batch ทำงานเป็นรอบ Real-Time ผู้ใช้ส่ง input แล้วโมเดลตอบทันที', 'ทั้งสองอย่างเหมือนกัน', 'Batch ใช้ Deep Learning เท่านั้น'], answer: 1, explain: 'Batch: ทำงานเป็นรอบ เช่น ทำนาย PM2.5 ทุกวัน | Real-Time: User → API → Model → Response ทันที เช่น fraud detection' },
      { q: 'Data Drift ในบริบท MLOps คืออะไร', choices: ['โมเดลเขียนโค้ดผิดพลาด', 'Distribution ของข้อมูล input เปลี่ยนไปจากตอน training ทำให้โมเดลแม่นยำน้อยลง', 'ข้อมูลสูญหาย', 'โมเดลใช้ RAM มากขึ้น'], answer: 1, explain: 'Data Drift คือ distribution ของข้อมูลเปลี่ยนไปจากตอน train เช่น climate change ทำให้โมเดลเสื่อม' },
      { q: 'Concept Drift แตกต่างจาก Data Drift อย่างไร', choices: ['เหมือนกัน', 'Concept Drift คือความสัมพันธ์ระหว่าง input และ output เปลี่ยน ส่วน Data Drift คือ distribution ของ input เปลี่ยน', 'Concept Drift เกิดเร็วกว่า Data Drift', 'Data Drift อันตรายกว่า Concept Drift เสมอ'], answer: 1, explain: 'Data Drift: distribution ของ X เปลี่ยน | Concept Drift: ความสัมพันธ์ X→y เปลี่ยน เช่น Humidity เคยทำให้ PM2.5 สูง แต่ตอนนี้อาจไม่ใช่' },
      { q: 'Gradio ช่วยอะไรใน ML Deployment', choices: ['ช่วย train โมเดลให้เร็วขึ้น', 'ช่วยสร้าง ML Web Interface โดยไม่ต้องเขียน frontend', 'ช่วยจัดการ database', 'ช่วย optimize hyperparameter'], answer: 1, explain: 'Gradio = Python library ที่ช่วยสร้าง ML Web App โดยไม่ต้องเขียน HTML/CSS/JS เหมาะสำหรับ demo และ prototype' },
      { q: 'Model Card ควรมีข้อมูลอะไรบ้าง', choices: ['เฉพาะ source code ของโมเดล', 'Model description, Training data, Performance metrics, Intended use, Limitations, Ethical considerations', 'เฉพาะ hyperparameter ที่ใช้', 'เฉพาะ accuracy ของโมเดล'], answer: 1, explain: 'Model Card ควรมี: Model description, Training data, Metrics, Intended use, Limitations, Ethical considerations เพื่อ transparency' },
      { q: 'Overtrust ใน Responsible AI หมายถึงอะไร', choices: ['โมเดลมีความมั่นใจสูงเกินไป', 'ผู้ใช้เชื่อโมเดลมากเกินไปโดยไม่คำนึงถึงข้อจำกัด', 'โมเดลใช้ข้อมูลมากเกินไป', 'การ train โมเดลนานเกินไป'], answer: 1, explain: 'Overtrust คือผู้ใช้เชื่อโมเดลมากเกินไป แก้ไขโดยแสดงข้อจำกัด ไม่ใช้ภาษาฟันธง และระบุ uncertainty' },
      { q: 'MLOps Pipeline มีขั้นตอนหลักอะไรบ้าง', choices: ['Train → Deploy เท่านั้น', 'Data Collection → Training → Evaluation → Deployment → Monitoring → Retraining', 'Code → Test → Release', 'Design → Build → Test'], answer: 1, explain: 'MLOps Pipeline: Data Collection → Training → Evaluation → Deployment → Monitoring → Retraining เพราะโมเดลมีอายุการใช้งาน' },
      { q: 'ทำไม Model จึงต้องมีการ Retraining', choices: ['เพราะโมเดลลืมข้อมูลเก่า', 'เพราะข้อมูลเปลี่ยน ความสัมพันธ์เปลี่ยน ทำให้โมเดลเสื่อมประสิทธิภาพเมื่อเวลาผ่านไป', 'เพราะ hardware เปลี่ยน', 'เพราะต้องการเพิ่ม feature ใหม่เสมอ'], answer: 1, explain: 'โมเดลมีอายุการใช้งาน เมื่อเวลาผ่านไป data/concept drift ทำให้โมเดลเสื่อม จึงต้องมี monitoring และ retraining' },
      { q: 'Interactive Analytical Apps ต่างจาก Batch/Real-Time อย่างไร', choices: ['ทำงานช้าที่สุด', 'ผู้ใช้สามารถทดลอง scenario ต่างๆ ได้เอง เช่น PM2.5 simulator', 'ใช้ได้เฉพาะบน mobile', 'ไม่ใช้โมเดล ML'], answer: 1, explain: 'Interactive Apps ให้ผู้ใช้ทดลอง scenario เองได้ เช่น ปรับ humidity/wind แล้วดูว่า PM2.5 จะเป็นเท่าใด เครื่องมือ: Gradio, Streamlit' },
      { q: 'Misuse ในบริบท Responsible AI คืออะไร', choices: ['การใช้โมเดลที่ error มาก', 'โมเดลถูกนำไปใช้ผิดวัตถุประสงค์เดิม เช่น โมเดล PM2.5 ถูกใช้ฟันธงนโยบาย', 'การ train โมเดลด้วยข้อมูลน้อย', 'โมเดลทำงานช้า'], answer: 1, explain: 'Misuse คือนำโมเดลไปใช้นอกขอบเขตที่ออกแบบไว้ เช่น โมเดลที่ออกแบบเพื่อ educational demo ถูกใช้ตัดสินนโยบายจริง' },
      { q: 'Level ใดของ Deployment Architecture เหมาะสำหรับ classroom/prototype', choices: ['Level 3: ML Platform (MLflow, Kubeflow)', 'Level 2: Application Deployment (Flask, FastAPI, Docker)', 'Level 1: Demo Deployment (Gradio, Streamlit, Jupyter)', 'ไม่มี level ใดเหมาะ'], answer: 2, explain: 'Level 1 Demo Deployment (Gradio, Streamlit, Jupyter) เหมาะสำหรับ research, classroom, prototype ใช้งานง่ายและรวดเร็ว' },
      { q: 'Model as a Service (MaaS) หมายความว่าอะไร', choices: ['โมเดลฟรีทุกคน', 'โมเดลถูกให้บริการเหมือน API: User → Application → API → Model → Prediction', 'โมเดลที่ขายเป็นซอฟต์แวร์', 'โมเดลที่ใช้ cloud เท่านั้น'], answer: 1, explain: 'MaaS คือแนวคิดที่โมเดลถูกให้บริการเหมือน API ผู้ใช้เรียก API เพื่อรับ prediction โดยไม่ต้องรู้ implementation' },
      { q: 'ข้อใดถูกต้องเกี่ยวกับ Bias ใน Deployment', choices: ['Bias ไม่ส่งผลต่อ deployment', 'ข้อมูล training ที่มี bias ทำให้โมเดล deploy ออกมามี bias เช่น เก็บข้อมูลเฉพาะบางพื้นที่', 'Bias เกิดเฉพาะใน Deep Learning', 'Bias แก้ได้ด้วยการเพิ่ม feature'], answer: 1, explain: 'Data bias ใน training → Model bias ใน deployment เช่น เก็บข้อมูล PM2.5 เฉพาะ กทม. โมเดลอาจใช้ไม่ได้กับจังหวัดอื่น' },
      { q: 'Performance Monitoring ใน MLOps ติดตามอะไรบ้าง', choices: ['เฉพาะ model accuracy', 'prediction error, system latency, user feedback เพื่อตรวจจับการเสื่อมของโมเดล', 'เฉพาะจำนวน user', 'เฉพาะ server uptime'], answer: 1, explain: 'Performance Monitoring ติดตาม: prediction error (model performance), system latency (speed), user feedback เพื่อตรวจจับ drift' }
    ]
  },
  // ===== NEW: Data Visualization & Analytics =====
  {
    id: 'dataviz',
    category: 'Data Visualization & Analytics',
    name: 'Data Visualization & Analytics',
    icon: '📈',
    color: '#06b6d4',
    iconBg: 'rgba(6,182,212,0.15)',
    desc: 'Data Warehouse · DAX · Charts · Storytelling · Dashboard',
    questions: [
      {
        q: 'ข้อใดคือความแตกต่างที่สำคัญที่สุดระหว่าง Database (OLTP) และ Data Warehouse (OLAP)?',
        choices: [
          'Database เก็บข้อมูลย้อนหลังได้นานกว่า Data Warehouse',
          'Database เน้นการประมวลผลธุรกรรมรายวัน แต่ Data Warehouse เน้นการวิเคราะห์เพื่อตัดสินใจ',
          'Data Warehouse ไม่สามารถเก็บข้อมูลจากหลายแหล่งพร้อมกันได้',
          'Database ใช้โครงสร้าง Star Schema เสมอ'
        ],
        answer: 1,
        explain: 'OLTP (Online Transaction Processing) ออกแบบมาเพื่อความเร็วในการบันทึกข้อมูลรายวัน ส่วน OLAP หรือ DWH ออกแบบมาเพื่อดึงข้อมูลปริมาณมากมาวิเคราะห์'
      },
      {
        q: 'ในโครงสร้าง Star Schema, ตาราง "Fact Table" มักจะมีลักษณะอย่างไร?',
        choices: [
          'เก็บข้อมูลที่เป็น Unique Key เท่านั้น และห้ามมีข้อมูลซ้ำ',
          'เก็บข้อมูลรายละเอียดสินค้าและชื่อลูกค้า',
          'เก็บตัวเลข (Measures) และ Foreign Keys จากตารางมิติต่างๆ',
          'เป็นตารางที่อยู่ล้อมรอบตาราง Dimension'
        ],
        answer: 2,
        explain: 'Fact Table คือตารางศูนย์กลางที่เก็บ "ข้อเท็จจริง" เป็นตัวเลข (เช่น ยอดขาย, จำนวน) และรหัสที่เชื่อมไปหาตารางมิติ (Dimension)'
      },
      {
        q: 'หากคุณต้องการสร้างความสัมพันธ์แบบ One-to-Many (1:*) ระหว่างตาราง Customer และ Sales ตารางใดควรเป็นฝั่ง "One (1)"?',
        choices: [
          'ตาราง Sales',
          'ตาราง Customer',
          'เป็นตารางใดก็ได้',
          'ต้องเป็น Many-to-Many เท่านั้น'
        ],
        answer: 1,
        explain: 'Customer 1 คน สามารถซื้อของได้หลายครั้ง (Many Sales) ดังนั้น Customer จึงเป็นฝั่งที่มี Unique ID (One)'
      },
      {
        q: '"Data Granularity" ที่ "ต่ำ" (Low Granularity) หมายถึงอะไร?',
        choices: [
          'ข้อมูลมีความละเอียดสูงมาก เช่น เก็บเป็นรายวินาที',
          'ข้อมูลถูกสรุปผลมาแล้ว เช่น เก็บเป็นรายปี',
          'ข้อมูลมีความถูกต้องแม่นยำสูง',
          'ข้อมูลมีจำนวนคอลัมน์น้อย'
        ],
        answer: 1,
        explain: 'Granularity คือระดับความละเอียด ยิ่งสรุปผลมาก (รายเดือน/รายปี) จะถือว่ามีความละเอียดต่ำ (Low) ถ้าละเอียดมาก (รายวินาที/รายธุรกรรม) จะเรียกว่า High Granularity'
      },
      {
        q: 'ข้อใดกล่าวถูกต้องเกี่ยวกับ Calculated Column และ Measure?',
        choices: [
          'Calculated Column คำนวณเมื่อมีการเปลี่ยน Slicer ในหน้ารายงาน',
          'Measure จะถูกคำนวณและเก็บค่าลงใน Hard Drive ของเครื่อง',
          'Calculated Column ใช้ Row Context ในการคำนวณรายบรรทัด',
          'Measure ไม่สามารถนำมาคำนวณต่อกันเองได้'
        ],
        answer: 2,
        explain: 'Calculated Column จะคำนวณทีละแถว (Row Context) ตั้งแต่ตอนโหลดข้อมูล ส่วน Measure จะคำนวณแบบพลวัตตาม Filter Context ในหน้าจอ'
      },
      {
        q: 'ฟังก์ชันใดใน DAX ที่สามารถใช้เปลี่ยน "Filter Context" ของการคำนวณได้?',
        choices: [
          'SUM',
          'AVERAGE',
          'CALCULATE',
          'RELATED'
        ],
        answer: 2,
        explain: 'CALCULATE คือฟังก์ชันที่ทรงพลังที่สุด เพราะสามารถสั่งให้สูตรคำนวณภายใต้เงื่อนไขการกรองใหม่ที่เรากำหนดเองได้'
      },
      {
        q: 'หากต้องการหายอดขายรวมโดยที่ "ไม่สนใจ" การเลือกใน Slicer ของตาราง Product เลย ต้องใช้ฟังก์ชันใดร่วมกับ CALCULATE?',
        choices: [
          'FILTER',
          'ALL',
          'VALUES',
          'SUMX'
        ],
        answer: 1,
        explain: 'ALL จะทำการ Clear Filter ของตารางหรือคอลัมน์ที่ระบุออกไปทั้งหมด'
      },
      {
        q: 'สูตร SUMX(Sales, Sales[Qty] * Sales[Price]) ทำงานอย่างไร?',
        choices: [
          'รวมผลบวกของ Qty ทั้งหมดก่อน แล้วค่อยคูณกับผลรวมของ Price',
          'คูณ Qty และ Price ในแต่ละแถวก่อน แล้วจึงนำผลลัพธ์ทั้งหมดมาบวกกัน',
          'หาค่าเฉลี่ยของยอดขายในตาราง Sales',
          'ทำงานเหมือนกับฟังก์ชัน SUM ปกติทุกประการ'
        ],
        answer: 1,
        explain: 'SUMX เป็น Iterator Function ที่จะสร้าง Row Context เพื่อคำนวณทีละบรรทัดก่อนแล้วค่อย Aggregate (รวม) ผลลัพธ์'
      },
      {
        q: 'ฟังก์ชัน SAMEPERIODLASTYEAR จะทำงานได้ถูกต้องเมื่อใด?',
        choices: [
          'เมื่อมีตาราง Date Table ที่สมบูรณ์และไม่มีวันที่ขาดหาย (Continuous date)',
          'เมื่อข้อมูลยอดขายเป็นรายปีเท่านั้น',
          'เมื่อใช้ใน Calculated Column เท่านั้น',
          'เมื่อไม่มีความสัมพันธ์ (Relationship) ระหว่างตาราง'
        ],
        answer: 0,
        explain: 'Time Intelligence Functions ใน DAX ต้องการปฏิทินที่ต่อเนื่อง (Mark as Date Table) ถึงจะคำนวณเปรียบเทียบเวลาได้แม่นยำ'
      },
      {
        q: 'ข้อใดคือ Syntax ที่ถูกต้องสำหรับการอ้างอิงคอลัมน์ในตารางที่มีชื่อว่า "Service Sales"?',
        choices: [
          'Service Sales[Amount]',
          '[Service Sales]Amount',
          "'Service Sales'[Amount]",
          '(Service Sales)[Amount]'
        ],
        answer: 2,
        explain: "หากชื่อตารางมีช่องว่าง ต้องครอบด้วย Single Quote (' ') เสมอ"
      },
      {
        q: 'หากต้องการตรวจหา "Outliers" (ค่าที่ผิดปกติ) ในชุดข้อมูลค่ารักษาพยาบาล ควรเลือกใช้กราฟใด?',
        choices: [
          'Pie Chart',
          'Line Chart',
          'Box and Whisker Chart',
          'Stacked Bar Chart'
        ],
        answer: 2,
        explain: 'Box Plot หรือ Box and Whisker ออกแบบมาเพื่อแสดงการกระจายตัว (Distribution) และระบุจุดที่เป็น Outliers ได้ชัดเจนที่สุด'
      },
      {
        q: 'กราฟประเภท "Scatter Plot" เหมาะสำหรับตอบคำถามงานวิจัยข้อใด?',
        choices: [
          'ยอดขายในแต่ละเดือนมีแนวโน้มอย่างไร?',
          'ส่วนแบ่งการตลาดของแต่ละแบรนด์เป็นเท่าใด?',
          'งบประมาณโฆษณามีความสัมพันธ์กับยอดขายหรือไม่?',
          'สินค้าตัวใดขายดีที่สุด 5 อันดับแรก?'
        ],
        answer: 2,
        explain: 'Scatter Plot ใช้เพื่อหา Correlation (ความสัมพันธ์) ระหว่างตัวแปรเชิงปริมาณ 2 ตัว'
      },
      {
        q: '"Treemap" เหมาะสำหรับการนำเสนอข้อมูลลักษณะใด?',
        choices: [
          'ข้อมูลที่มีลำดับชั้น (Hierarchy) และต้องการแสดงสัดส่วนภาพรวม',
          'ข้อมูลแนวโน้มราคาหุ้นรายวัน',
          'ข้อมูลการกระจายตัวของประชากรตามอายุ',
          'ข้อมูลเปรียบเทียบยอดขายระหว่าง 2 ปี'
        ],
        answer: 0,
        explain: 'Treemap ใช้พื้นที่รูปสี่เหลี่ยมแสดงขนาดของข้อมูล เหมาะกับข้อมูลที่มีหมวดหมู่ย่อยๆ (Nested Categories)'
      },
      {
        q: 'ในการออกแบบ Bar Chart ตามหลักจริยธรรมข้อมูล (Data Ethics) แกน Y ควรเริ่มจากค่าใด?',
        choices: [
          'ค่าที่ต่ำที่สุดในชุดข้อมูลเพื่อให้เห็นความต่างชัดเจน',
          'ค่าเฉลี่ยของข้อมูล',
          'เลข 0',
          'ค่าใดก็ได้ตามความสวยงาม'
        ],
        answer: 2,
        explain: 'การไม่เริ่มแกน Y ที่ 0 ใน Bar Chart จะทำให้การเปรียบเทียบความสูงของแท่งกราฟบิดเบือนไปจากความเป็นจริง (Visual Distortion)'
      },
      {
        q: 'ตามหลัก "F-Pattern" ในการอ่านแดชบอร์ด พื้นที่ส่วนใดสำคัญที่สุด?',
        choices: [
          'มุมขวาล่าง',
          'ตรงกลางหน้าจอ',
          'มุมซ้ายบน',
          'มุมขวาบน'
        ],
        answer: 2,
        explain: 'มนุษย์มักเริ่มกวาดสายตาจากซ้ายไปขวา และบนลงล่าง พื้นที่ซ้ายบนจึงควรวาง KPI ที่สำคัญที่สุด'
      },
      {
        q: '"Pre-attentive Attributes" ในงาน Visualization คืออะไร?',
        choices: [
          'ข้อมูลที่ถูกเก็บเป็นความลับ',
          'องค์ประกอบที่สมองประมวลผลได้ทันที เช่น สี, ขนาด, ความเข้ม',
          'การเขียนคำอธิบายใต้ภาพ',
          'การกรองข้อมูลด้วย Slicer'
        ],
        answer: 1,
        explain: 'Pre-attentive Attributes คือสมบัติทางกายภาพที่ดึงดูดสายตาได้โดยไม่ต้องใช้ความพยายามในการคิด'
      },
      {
        q: 'องค์ประกอบ 3 อย่างของ Data Storytelling ที่มี Impact คืออะไร?',
        choices: [
          'Data, Statistics, Excel',
          'Data, Narrative, Visuals',
          'Charts, Colors, Power BI',
          'Tables, Numbers, Reports'
        ],
        answer: 1,
        explain: 'การเล่าเรื่องต้องมีข้อมูลที่ถูกต้อง (Data) โครงเรื่องที่น่าสนใจ (Narrative) และภาพที่สื่อความหมาย (Visuals)'
      },
      {
        q: 'หาก "Average Delay Days" มีค่าสูงขึ้นในเขตภูมิภาคหนึ่ง คุณควรตรวจสอบสิ่งใดเป็นอันดับแรก?',
        choices: [
          'สีของกราฟว่าสวยหรือไม่',
          'ประเภทการขนส่ง (Ship Mode) หรือปัญหาใน Warehouse ของภูมิภาคนั้น',
          'เปลี่ยนไปใช้ Pie Chart แทน',
          'ลบข้อมูลภูมิภาคนั้นทิ้ง'
        ],
        answer: 1,
        explain: 'นี่คือการวิเคราะห์เพื่อหา Root Cause (สาเหตุรากเหง้า) ของปัญหาที่แสดงบน Dashboard'
      },
      {
        q: '"Data Ink Ratio" ของ Edward Tufte แนะนำว่าอย่างไร?',
        choices: [
          'ควรใช้หมึก (หรือสี) ให้มากที่สุดเพื่อให้กราฟดูสดใส',
          'ควรลดองค์ประกอบที่ไม่ใช่ข้อมูล (เช่น เส้นขอบ, เส้นตาราง) ให้เหลือเท่าที่จำเป็น',
          'ควรพิมพ์รายงานออกมาเป็นกระดาษเสมอ',
          'ข้อมูลที่สำคัญต้องใช้ตัวอักษรสีดำเท่านั้น'
        ],
        answer: 1,
        explain: 'หลักการคือการทำให้ "หมึก" ส่วนใหญ่บนจอภาพถูกใช้ไปกับการสื่อสาร "ข้อมูล" จริงๆ ไม่ใช่สิ่งตกแต่ง'
      },
      {
        q: 'ในการทำงบกำไรขาดทุน (P&L) หากต้องการวิเคราะห์ "Profitability" ตัวชี้วัดใดสำคัญที่สุด?',
        choices: [
          'Total Revenue',
          'Total Unit Sold',
          'Gross Profit Margin (%)',
          'Number of Customers'
        ],
        answer: 2,
        explain: 'Profitability คือความสามารถในการทำกำไร ซึ่งมักวัดเป็นเปอร์เซ็นต์ (Margin) เพื่อให้เทียบกับเป้าหมายหรือช่วงเวลาอื่นได้ชัดเจน'
      }
    ]
  }
];

// ===== STATE =====
let currentSubject = null;
let currentQ = 0;
let selected = null;
let answered = false;
let totalScore = 0;
let answers = []; // answers[i] = { selected, answered, correct, skipped }

// ===== CATEGORY METADATA =====
const categoryMeta = {
  'MIS': { color: '#f97316', icon: '💼' },
  'Data Science': { color: '#8b5cf6', icon: '🔬' },
  'Data Visualization & Analytics': { color: '#06b6d4', icon: '📊' }
};

// ===== HELPERS =====
function computeScore() {
  return answers.filter(a => a.correct).length;
}

// ===== INIT =====
function init() {
  const container = document.getElementById('subjectsContainer');
  container.innerHTML = '';

  const grouped = {};
  let totalQ = 0;
  subjects.forEach(sub => {
    totalQ += sub.questions.length;
    if (!grouped[sub.category]) grouped[sub.category] = [];
    grouped[sub.category].push(sub);
  });

  document.getElementById('statSubjects').textContent = subjects.length;
  document.getElementById('statQuestions').textContent = totalQ;

  Object.entries(grouped).forEach(([cat, subs]) => {
    const meta = categoryMeta[cat] || { color: '#3b82f6', icon: '📁' };
    const totalCatQ = subs.reduce((s, x) => s + x.questions.length, 0);

    const block = document.createElement('div');
    block.className = 'category-block';
    block.style.setProperty('--cat-color', meta.color);

    const label = document.createElement('div');
    label.className = 'category-label';
    label.innerHTML = `${meta.icon} ${cat} <span style="color:var(--text3);font-weight:400;font-size:0.7rem;text-transform:none;letter-spacing:0">${subs.length} วิชา · ${totalCatQ} ข้อ</span>`;

    const grid = document.createElement('div');
    grid.className = 'subjects-grid';

    subs.forEach(sub => {
      const card = document.createElement('div');
      card.className = 'subject-card';
      card.style.setProperty('--card-color', sub.color);
      card.style.setProperty('--icon-bg', sub.iconBg);
      card.innerHTML = `
        <div class="subject-icon">${sub.icon}</div>
        <div class="subject-name">${sub.name}</div>
        <div class="subject-meta">${sub.desc}</div>
        <div class="subject-count">${sub.questions.length} ข้อ</div>
      `;
      card.onclick = () => startExam(sub);
      grid.appendChild(card);
    });

    block.appendChild(label);
    block.appendChild(grid);
    container.appendChild(block);
  });
}

// ===== NAVIGATION =====
function showHome() {
  document.getElementById('homeView').classList.remove('hidden');
  document.getElementById('examView').classList.remove('active');
}

function startExam(sub) {
  currentSubject = sub;
  currentQ = 0;
  // Init answers array — one slot per question
  answers = sub.questions.map(() => ({
    selected: null,
    answered: false,
    correct: false,
    skipped: false
  }));

  document.getElementById('examSubjectTitle').textContent = sub.icon + ' ' + sub.name;
  document.getElementById('examSubjectDesc').textContent = sub.desc;
  document.getElementById('homeView').classList.add('hidden');
  document.getElementById('examView').classList.add('active');
  renderQuestion();
}

// ===== RENDER QUESTION =====
function renderQuestion() {
  const sub = currentSubject;
  const q = sub.questions[currentQ];
  const total = sub.questions.length;

  // Restore saved state for this question
  const saved = answers[currentQ];
  selected = saved.selected;
  answered = saved.answered;

  const score = computeScore();
  const pct = (currentQ / total) * 100;
  document.getElementById('progressBar').style.width = pct + '%';
  document.getElementById('progressText').textContent = `ข้อ ${currentQ + 1} / ${total}`;
  document.getElementById('progressScore').textContent = `คะแนน: ${score}`;

  // Render action buttons
  const hasPrev = currentQ > 0;
  const isLast = currentQ === total - 1;
  document.querySelector('.exam-actions').innerHTML = `
    <button class="btn btn-ghost" id="prevBtn" onclick="prevQuestion()" ${hasPrev ? '' : 'style="visibility:hidden"'}>← ย้อนกลับ</button>
    <button class="btn btn-ghost" id="skipBtn" onclick="skipQuestion()" ${answered ? 'style="display:none"' : ''}>ข้ามข้อ</button>
    <button class="btn btn-primary" id="checkBtn" onclick="checkAnswer()" ${answered || selected === null ? 'disabled' : ''} ${answered ? 'style="display:none"' : ''}>ตรวจคำตอบ</button>
    <button class="btn btn-primary" id="nextBtn" onclick="nextQuestion()" style="${answered && !isLast ? '' : 'display:none'}">ข้อถัดไป →</button>
    <button class="btn btn-primary" id="resultBtn" onclick="showResult()" style="${answered && isLast ? '' : 'display:none'}">ดูผลลัพธ์ 🎯</button>
  `;

  // Render question card
  const letters = ['A', 'B', 'C', 'D'];
  document.getElementById('questionArea').innerHTML = `
    <div class="question-card">
      <div class="q-number">ข้อที่ ${currentQ + 1}</div>
      <div class="q-text">${q.q}</div>
      <div class="choices" id="choices">
        ${q.choices.map((c, i) => `
          <button class="choice-btn" onclick="selectChoice(${i})" id="choice-${i}">
            <span class="choice-letter">${letters[i]}</span>
            <span>${c}</span>
          </button>
        `).join('')}
      </div>
      <div class="explanation" id="explanation">
        <div class="explanation-label">💡 เฉลย</div>
        <p>${q.explain}</p>
      </div>
    </div>
  `;

  // Restore visual state if already answered/selected
  if (answered) {
    _restoreAnsweredState(q, saved.selected, saved.skipped);
  } else if (selected !== null) {
    document.getElementById(`choice-${selected}`).classList.add('selected');
    document.getElementById('checkBtn').disabled = false;
  }
}

function _restoreAnsweredState(q, sel, skipped) {
  document.querySelectorAll('.choice-btn').forEach((b, i) => {
    if (i === q.answer) b.classList.add('correct');
    else if (i === sel && !skipped) b.classList.add('wrong');
    else b.classList.add('disabled');
  });
  document.getElementById('explanation').classList.add('show');
}

// ===== INTERACTIONS =====
function selectChoice(idx) {
  if (answered) return;
  selected = idx;
  answers[currentQ].selected = idx;
  document.querySelectorAll('.choice-btn').forEach((b, i) => {
    b.classList.toggle('selected', i === idx);
  });
  document.getElementById('checkBtn').disabled = false;
}

function checkAnswer() {
  if (selected === null || answered) return;
  answered = true;

  const q = currentSubject.questions[currentQ];
  const isCorrect = selected === q.answer;

  // Save to answers array
  answers[currentQ].answered = true;
  answers[currentQ].correct = isCorrect;
  answers[currentQ].skipped = false;

  _restoreAnsweredState(q, selected, false);

  const score = computeScore();
  document.getElementById('progressScore').textContent = `คะแนน: ${score}`;
  document.getElementById('checkBtn').style.display = 'none';
  document.getElementById('skipBtn').style.display = 'none';

  const isLast = currentQ === currentSubject.questions.length - 1;
  if (isLast) {
    document.getElementById('resultBtn').style.display = 'inline-block';
  } else {
    document.getElementById('nextBtn').style.display = 'inline-block';
  }
}

function skipQuestion() {
  answers[currentQ].answered = true;
  answers[currentQ].correct = false;
  answers[currentQ].skipped = true;
  answered = true;
  nextQuestion();
}

function prevQuestion() {
  if (currentQ > 0) {
    currentQ--;
    renderQuestion();
  }
}

function nextQuestion() {
  currentQ++;
  if (currentQ >= currentSubject.questions.length) {
    showResult();
  } else {
    renderQuestion();
  }
}

// ===== RESULT =====
function showResult() {
  const total = currentSubject.questions.length;
  const score = computeScore();
  const pct = Math.round((score / total) * 100);
  totalScore += score;
  document.getElementById('totalScore').textContent = totalScore + ' คะแนน';

  let grade, gradeClass, emoji;
  if (pct >= 80) { grade = 'ยอดเยี่ยม 🏆'; gradeClass = 'grade-a'; emoji = '🎉'; }
  else if (pct >= 60) { grade = 'ดี 👍'; gradeClass = 'grade-b'; emoji = '😊'; }
  else if (pct >= 40) { grade = 'พอใช้ 📚'; gradeClass = 'grade-c'; emoji = '😅'; }
  else { grade = 'ต้องปรับปรุง 💪'; gradeClass = 'grade-d'; emoji = '😓'; }

  const wrong = answers.filter(a => a.answered && !a.correct).length;
  const skipped = answers.filter(a => a.skipped).length;

  document.getElementById('progressBar').style.width = '100%';
  document.getElementById('progressText').textContent = 'เสร็จสิ้น';
  document.getElementById('progressScore').textContent = '';

  document.getElementById('questionArea').innerHTML = `
    <div class="result-card">
      <div class="result-emoji">${emoji}</div>
      <div class="result-score">${score}/${total}</div>
      <div class="result-label">คะแนนที่ได้รับ</div>
      <div class="result-grade ${gradeClass}">${grade}</div>
      <div class="result-breakdown">
        <div class="rb-item rb-correct">
          <div class="rb-num">${score}</div>
          <div class="rb-label">ถูก</div>
        </div>
        <div class="rb-item rb-wrong">
          <div class="rb-num">${wrong}</div>
          <div class="rb-label">ผิด</div>
        </div>
        <div class="rb-item">
          <div class="rb-num" style="color:var(--gold)">${skipped}</div>
          <div class="rb-label">ข้าม</div>
        </div>
        <div class="rb-item">
          <div class="rb-num" style="color:var(--text)">${pct}%</div>
          <div class="rb-label">เปอร์เซ็นต์</div>
        </div>
      </div>
    </div>
  `;

  document.querySelector('.exam-actions').innerHTML = `
    <button class="btn btn-ghost" onclick="startExam(currentSubject)">🔄 ลองใหม่</button>
    <button class="btn btn-primary" onclick="showHome()">กลับหน้าหลัก 🏠</button>
  `;
}

init();