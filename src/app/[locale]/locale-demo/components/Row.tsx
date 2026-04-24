'use client';

interface RowProps {
  readonly label: string;
  readonly value: string;
  readonly code?: string;
}

export function Row({ label, value, code }: RowProps) {
  return (
    <div className="flex items-start justify-between py-2 border-b border-gray-50 last:border-0 gap-4">
      <span className="text-sm text-gray-500 shrink-0">{label}</span>
      <div className="text-right">
        <span className="text-sm font-medium text-gray-800 block">{value}</span>
        {code && (
          <code className="text-xs text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded mt-1 inline-block">
            {code}
          </code>
        )}
      </div>
    </div>
  );
}

interface CompareRowProps {
  readonly label: string;
  readonly browserValue: string;
  readonly overrideValue: string;
  readonly isOverridden: boolean;
}

export function CompareRow({ label, browserValue, overrideValue, isOverridden }: CompareRowProps) {
  return (
    <div className="flex items-start justify-between py-2 border-b border-gray-50 last:border-0 gap-4">
      <span className="text-sm text-gray-500 shrink-0">{label}</span>
      <div className="text-right space-y-1">
        {isOverridden ? (
          <>
            <span className="text-sm font-semibold text-indigo-600 block">{overrideValue}</span>
            <span className="text-xs text-gray-400 line-through block">{browserValue}</span>
          </>
        ) : (
          <span className="text-sm font-medium text-gray-800 block">{browserValue}</span>
        )}
      </div>
    </div>
  );
}
