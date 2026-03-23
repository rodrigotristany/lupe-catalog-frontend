import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useProductHistory } from '../../hooks/useAdminProducts';
import { Spinner } from '../ui/Spinner';

const ACTION_COLORS = {
  Created: 'bg-green-100 text-green-700',
  Updated: 'bg-blue-100 text-blue-700',
  Deleted: 'bg-red-100 text-red-700',
};

function actionLabel(action, t) {
  const map = {
    Created: t('admin.history_created'),
    Updated: t('admin.history_updated'),
    Deleted: t('admin.history_deleted'),
  };
  return map[action] || action;
}

function SnapshotView({ snapshot }) {
  if (!snapshot) return null;
  return (
    <div className="mt-3 rounded-lg bg-gray-50 border border-gray-200 p-3 text-xs font-mono overflow-x-auto">
      {Object.entries(snapshot).map(([key, value]) => (
        <div key={key} className="flex gap-2">
          <span className="text-lupe-600 font-semibold min-w-[120px]">{key}:</span>
          <span className="text-gray-700">{JSON.stringify(value)}</span>
        </div>
      ))}
    </div>
  );
}

export function ProductHistory({ productId }) {
  const { t } = useTranslation();
  const { data: history, isLoading } = useProductHistory(productId);
  const [expanded, setExpanded] = useState(null);

  if (isLoading) return <Spinner className="mx-auto my-6" />;

  if (!history?.length) {
    return <p className="text-sm text-gray-400 text-center py-4">{t('admin.no_history')}</p>;
  }

  return (
    <div className="relative pl-4 border-l-2 border-lupe-200 space-y-4">
      {history.map((entry) => (
        <div key={entry.id} className="relative">
          <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-lupe-400 border-2 border-white" />

          <button
            onClick={() => setExpanded(expanded === entry.id ? null : entry.id)}
            className="w-full text-left"
          >
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ACTION_COLORS[entry.action] || 'bg-gray-100 text-gray-600'}`}>
                {actionLabel(entry.action, t)}
              </span>
              <span className="text-xs text-gray-400">
                {new Date(entry.timestamp).toLocaleString()}
              </span>
              {entry.changed_by && (
                <span className="text-xs text-gray-400">
                  {t('admin.history_by')} {entry.changed_by}
                </span>
              )}
              <span className="ml-auto text-gray-400">
                {expanded === entry.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </span>
            </div>
          </button>

          {expanded === entry.id && <SnapshotView snapshot={entry.snapshot} />}
        </div>
      ))}
    </div>
  );
}
