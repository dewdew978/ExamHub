import { BookOpen, Brain, ChartColumn, ChartLine, Cloud, Cpu, Database, Network, Stethoscope } from 'lucide-react';

// Line icons per subject category, used instead of the emoji stored in exam data.
const CATEGORY_ICONS = [
  [/cloud|aws/i, Cloud],
  [/warehous/i, Database],
  [/visuali/i, ChartLine],
  [/machine learning/i, Brain],
  [/medical/i, Stethoscope],
  [/intelligent system/i, Cpu],
  [/data science/i, ChartColumn],
  [/mis|management information/i, Network],
];

export default function SubjectIcon({ category = '', size = 18, color = 'var(--accent)' }) {
  const Icon = CATEGORY_ICONS.find(([pattern]) => pattern.test(category))?.[1] ?? BookOpen;
  return <Icon size={size} color={color} strokeWidth={2} aria-hidden="true" />;
}
