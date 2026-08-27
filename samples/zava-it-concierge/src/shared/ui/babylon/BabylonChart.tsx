import * as React from 'react';

import { createBabylonScene } from './createBabylonScene';
import type { IBabylonChartModel } from './chartModels';

import styles from '../IntentCanvasApp.module.scss';

export interface IBabylonChartProps {
  readonly model: IBabylonChartModel;
  readonly isDark: boolean;
  readonly selectedId?: string;
  readonly onSelect: (markId: string) => void;
}

export function BabylonChart(props: IBabylonChartProps): React.ReactElement {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [fallbackReason, setFallbackReason] = React.useState<string>();

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return undefined;
    }

    let disposed = false;
    let animationFrame = 0;
    let resizeFrame = 0;
    let sceneHandle: ReturnType<typeof createBabylonScene> | undefined;
    let resizeObserver: ResizeObserver | undefined;
    let resizeScene: (() => void) | undefined;
    const ownerDocument = canvas.ownerDocument;
    const ownerWindow = ownerDocument.defaultView;
    const handleContextLost = (event: Event): void => {
      event.preventDefault();
      disposed = true;
      resizeObserver?.disconnect();
      ownerWindow?.cancelAnimationFrame(animationFrame);
      sceneHandle?.dispose();
      sceneHandle = undefined;
      setFallbackReason('Interactive graphics stopped because the WebGL context was lost. The evidence view remains available.');
    };
    canvas.addEventListener('webglcontextlost', handleContextLost);
    try {
      sceneHandle = createBabylonScene(canvas, props.model, props.isDark, props.onSelect);
      const reduceMotion = ownerWindow?.matchMedia('(prefers-reduced-motion: reduce)').matches ?? false;
      resizeScene = (): void => {
        ownerWindow?.cancelAnimationFrame(resizeFrame);
        resizeFrame = ownerWindow?.requestAnimationFrame(() => {
          if (!disposed) {
            sceneHandle?.resize();
          }
        }) ?? 0;
      };
      const startedAt = Date.now();
      const renderFrame = (): void => {
        if (disposed || !sceneHandle) {
          return;
        }
        if (!ownerDocument.hidden) {
          sceneHandle.render();
        }
        if (!reduceMotion && Date.now() - startedAt < 420) {
          animationFrame = ownerWindow?.requestAnimationFrame(renderFrame) ?? 0;
        }
      };
      renderFrame();

      if (ownerWindow?.ResizeObserver) {
        resizeObserver = new ownerWindow.ResizeObserver(resizeScene);
        resizeObserver.observe(canvas.parentElement ?? canvas);
      }
      ownerWindow?.addEventListener('resize', resizeScene);
      resizeScene();
    } catch {
      setFallbackReason('Interactive graphics are unavailable in this environment.');
    }

    return () => {
      disposed = true;
      resizeObserver?.disconnect();
      if (resizeScene) {
        ownerWindow?.removeEventListener('resize', resizeScene);
      }
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      ownerWindow?.cancelAnimationFrame(animationFrame);
      ownerWindow?.cancelAnimationFrame(resizeFrame);
      sceneHandle?.dispose();
    };
  }, [props.isDark, props.model, props.onSelect]);

  return (
    <>
      {fallbackReason
        ? <div className={styles.canvasFallback} role="status">{fallbackReason}</div>
        : <canvas ref={canvasRef} className={styles.canvas} aria-label={props.model.ariaLabel} role="img" />}
      <ul className={styles.chartLegend} aria-label={`${props.model.title} data`}>
        {props.model.marks.map((mark) => (
          <li className={styles.chartLegendEntry} key={mark.id}>
            <button
              aria-pressed={props.selectedId === mark.id}
              className={styles.chartLegendItem}
              onClick={() => props.onSelect(mark.id)}
              type="button"
            >
              <span className={styles.chartSwatch} style={{ backgroundColor: mark.color }} />
              <span>{mark.label}</span>
              <strong>{mark.value}</strong>
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}