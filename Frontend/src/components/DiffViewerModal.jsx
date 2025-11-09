import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCodeCompare } from '@fortawesome/free-solid-svg-icons';
import * as Diff from 'diff';

/**
 * FR-5.4: Diff Viewer Modal Component
 * Displays a side-by-side comparison of prompt versions
 */
const DiffViewerModal = ({ isOpen, onClose, oldPrompt, newPrompt, oldScanDate, newScanDate }) => {
  if (!isOpen) return null;

  // Generate diff
  const diff = Diff.diffLines(oldPrompt || '', newPrompt || '');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30"
      onClick={onClose}
    >
      <div
        className="relative max-w-6xl w-full bg-white rounded-2xl p-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 cursor-pointer rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>

        <div className="flex items-start gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
            <FontAwesomeIcon icon={faCodeCompare} className="text-blue-600 text-2xl" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">Prompt Comparison</h2>
            <div className="text-sm text-gray-600 mt-1">
              Comparing changes between scans
            </div>
          </div>
        </div>

        {/* Date Headers */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-4 rounded-lg bg-red-50 border border-red-200">
            <div className="text-xs text-red-600 font-semibold uppercase">Previous Version</div>
            <div className="text-sm text-red-900 mt-1">
              {oldScanDate ? new Date(oldScanDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }) : 'N/A'}
            </div>
          </div>
          <div className="p-4 rounded-lg bg-green-50 border border-green-200">
            <div className="text-xs text-green-600 font-semibold uppercase">Current Version</div>
            <div className="text-sm text-green-900 mt-1">
              {newScanDate ? new Date(newScanDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }) : 'N/A'}
            </div>
          </div>
        </div>

        {/* Diff Display */}
        <div className="mb-6">
          <div className="text-sm font-semibold text-gray-900 mb-2">Changes</div>
          <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 font-mono text-sm overflow-x-auto">
            {diff.map((part, index) => {
              const backgroundColor = part.added
                ? 'bg-green-100'
                : part.removed
                ? 'bg-red-100'
                : 'bg-transparent';
              const textColor = part.added
                ? 'text-green-800'
                : part.removed
                ? 'text-red-800'
                : 'text-gray-700';
              const prefix = part.added ? '+ ' : part.removed ? '- ' : '  ';

              return (
                <div key={index} className={`${backgroundColor} ${textColor}`}>
                  {part.value.split('\n').map((line, lineIndex) => (
                    <div key={lineIndex} className="whitespace-pre-wrap">
                      {line && (
                        <>
                          <span className="select-none opacity-50">{prefix}</span>
                          {line}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-100 border border-green-200"></div>
            <span className="text-xs text-gray-600">Added</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-100 border border-red-200"></div>
            <span className="text-xs text-gray-600">Removed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gray-50 border border-gray-200"></div>
            <span className="text-xs text-gray-600">Unchanged</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-full text-sm font-medium cursor-pointer bg-gray-900 text-white hover:bg-black transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiffViewerModal;
