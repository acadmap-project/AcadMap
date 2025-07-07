import { useEffect, useState, useMemo } from 'react';
import { useTransition } from '@react-spring/web';

let id = 0;

function Popup({ isOpen, onClose, title, message, type = 'success' }) {
  const refMap = useMemo(() => new WeakMap(), []);
  const cancelMap = useMemo(() => new WeakMap(), []);
  const [items, setItems] = useState([]);
  const [hasShownCurrent, setHasShownCurrent] = useState(false);

  const POPUP_DURATION = 5000;

  const transitions = useTransition(items, {
    from: { opacity: 0, transform: 'translateX(100%)', height: 0 },
    keys: item => item.key,
    enter: item => async (next, cancel) => {
      cancelMap.set(item, cancel);
      await next({
        opacity: 1,
        transform: 'translateX(0%)',
        height: refMap.get(item)?.offsetHeight || 'auto',
      });

      await new Promise(resolve => setTimeout(resolve, POPUP_DURATION));
    },
    leave: { opacity: 0, transform: 'translateX(100%)', height: 0 },
    onRest: (result, ctrl, item) => {
      setItems(state => state.filter(i => i.key !== item.key));
      if (items.length === 1) {
        onClose();
      }
    },
    config: { tension: 125, friction: 20, precision: 0.1 },
  });

  useEffect(() => {
    if (isOpen && !hasShownCurrent) {
      setItems(state => [
        ...state,
        {
          key: id++,
          title,
          message,
          type,
        },
      ]);
      setHasShownCurrent(true);
    }
  }, [isOpen, title, message, type, hasShownCurrent]);

  useEffect(() => {
    if (!isOpen) {
      setHasShownCurrent(false);
    }
  }, [isOpen]);

  const getIconColor = itemType => {
    switch (itemType) {
      case 'success':
        return 'text-green-500';
      case 'info':
        return 'text-blue-500';
      case 'warning':
        return 'text-yellow-500';
      default:
        return 'text-green-500';
    }
  };

  const getBorderColor = itemType => {
    switch (itemType) {
      case 'success':
        return 'border-l-green-500';
      case 'info':
        return 'border-l-blue-500';
      case 'warning':
        return 'border-l-yellow-500';
      default:
        return 'border-l-green-500';
    }
  };

  return (
    <div
      className="fixed top-4 right-4 z-50 space-y-2"
      style={{ pointerEvents: 'none' }}
    >
      {transitions((style, item) => (
        <div
          style={{
            ...style,
            pointerEvents: 'auto',
            willChange: 'transform, opacity, height',
          }}
          className={`bg-white rounded-lg shadow-xl border-l-4 ${getBorderColor(item.type)} max-w-sm w-full mx-4 overflow-hidden`}
        >
          <div ref={ref => ref && refMap.set(item, ref)} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className={`mt-0.5 ${getIconColor(item.type)}`}>
                  {item.type === 'success' && (
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {item.type === 'warning' && (
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {item.type === 'info' && (
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.message}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  if (cancelMap.has(item)) {
                    cancelMap.get(item)();
                  }
                }}
                className="ml-3 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Popup;
