import { useEffect, useMemo } from 'react';

const UNICORN_SCRIPT_ID = 'unicornstudio-umd';
const UNICORN_SCRIPT_SRC =
  'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.5.2/dist/unicornStudio.umd.js';

function loadUnicornStudioScript() {
  if (typeof window === 'undefined') return Promise.resolve();

  if (document.getElementById(UNICORN_SCRIPT_ID)) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.id = UNICORN_SCRIPT_ID;
    script.src = UNICORN_SCRIPT_SRC;
    script.async = true;

    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load UnicornStudio script'));

    (document.head || document.body).appendChild(script);
  });
}

export default function UnicornStudioEmbed({ projectId, className }) {
  const projectKey = useMemo(() => projectId, [projectId]);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        await loadUnicornStudioScript();
        if (cancelled) return;

        if (!window.UnicornStudio) {
          window.UnicornStudio = { isInitialized: false };
        }

        // Allow re-initialization for newly mounted embeds.
        requestAnimationFrame(() => {
          try {
            window.UnicornStudio?.init?.();
            window.UnicornStudio.isInitialized = true;
          } catch {
            // Ignore init errors to avoid breaking the page.
          }
        });
      } catch {
        // Ignore load errors to avoid breaking the page.
      }
    }

    init();

    return () => {
      cancelled = true;
    };
  }, [projectKey]);

  return (
    <div
      className={className}
      data-us-project={projectKey}
      style={{ width: '100%', height: '100%' }}
    />
  );
}
