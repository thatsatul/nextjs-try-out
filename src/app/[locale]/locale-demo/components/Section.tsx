'use client';

interface SectionProps {
  readonly icon: string;
  readonly title: string;
  readonly subtitle: string;
  readonly children: React.ReactNode;
}

export default function Section({ icon, title, subtitle, children }: SectionProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <h2 className="font-bold text-gray-800">{title}</h2>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}
