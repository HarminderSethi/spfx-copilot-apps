import * as React from 'react';
import { Skeleton, SkeletonItem } from '@fluentui/react-components';
import { StackV2 } from '@spteck/react-controls-v2';

const INLINE_ROW_COUNT: number = 2;
const FULLSCREEN_ROW_COUNT: number = 4;
const ROW_HEIGHT: number = 152;

/**
 * Relative widths used by the loading rows. The variation mirrors the
 * PhotoAlbum rows layout, where each row contains photos with different
 * aspect ratios instead of a fixed column grid.
 */
const ROW_FLEX_VALUES: readonly (readonly number[])[] = [
  [1.25, 0.9, 1.1],
  [0.85, 1.35, 0.95],
  [1.1, 0.8, 1.3],
  [0.95, 1.2, 0.85]
];

export interface IPhotoRowsSkeletonProps {
  /** Render more rows when the Copilot component is in fullscreen mode. */
  fullscreen?: boolean;
  /** Accessible status text announced while the Graph request is pending. */
  ariaLabel: string;
}

/**
 * Loading placeholder for the photo gallery.
 *
 * This intentionally uses horizontal stacks for every row so its geometry
 * follows PhotoAlbum's `rows` layout while the SharePoint search is pending.
 */
export function PhotoRowsSkeleton({
  fullscreen = false,
  ariaLabel
}: IPhotoRowsSkeletonProps): React.ReactElement {
  const rowCount: number = fullscreen ? FULLSCREEN_ROW_COUNT : INLINE_ROW_COUNT;

  return (
    <StackV2
      direction="vertical"
      gap="s"
      role="status"
      aria-label={ariaLabel}
      aria-live="polite"
      width="100%"
    >
      {Array.from({ length: rowCount }, (_, rowIndex: number) => {
        const rowFlexValues: readonly number[] = ROW_FLEX_VALUES[rowIndex % ROW_FLEX_VALUES.length];

        return (
          <StackV2
            key={rowIndex}
            direction="horizontal"
            gap="s"
            width="100%"
            alignItems="stretch"
          >
            {rowFlexValues.map((flex: number, photoIndex: number) => (
              <Skeleton
                key={`${rowIndex}-${photoIndex}`}
                appearance="opaque"
                style={{
                  flex: `${flex} 1 0`,
                  minWidth: 0,
                  height: ROW_HEIGHT
                }}
              >
                <SkeletonItem shape="rectangle" style={{ width: '100%', height: '100%' }} />
              </Skeleton>
            ))}
          </StackV2>
        );
      })}
    </StackV2>
  );
}
