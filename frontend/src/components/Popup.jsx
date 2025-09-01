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

  const getAlertClass = itemType => {
    switch (itemType) {
      case 'success':
        return 'alert-success';
      case 'info':
        return 'alert-info';
      case 'warning':
        return 'alert-warning';
      default:
        return 'alert-success';
    }
  };

  return (
    <div className="toast toast-top toast-end z-50">
      {transitions((style, item) => (
        <div
          style={{
            ...style,
            willChange: 'transform, opacity, height',
          }}
          className={`alert ${getAlertClass(item.type)} shadow-lg max-w-sm`}
          ref={ref => ref && refMap.set(item, ref)}
        >
          <div>
            <span className="font-bold">{item.title}</span>
            <div className="text-sm">{item.message}</div>
          </div>
          <div className="flex-none">
            <button
              onClick={() => {
                if (cancelMap.has(item)) {
                  cancelMap.get(item)();
                }
              }}
              className="btn btn-sm btn-ghost"
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
      ))}
    </div>
  );
}

export default Popup;
