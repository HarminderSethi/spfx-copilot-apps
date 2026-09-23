import { css } from '@emotion/css';
import { tokens } from '@fluentui/react-components';

export interface IM365ProductRoadmapStyles {
  provider: string;
}

const styles: IM365ProductRoadmapStyles = {
  provider: css({
    backgroundColor: tokens.colorTransparentBackground
  })
};

export const useM365ProductRoadmapStyles = (): IM365ProductRoadmapStyles =>
  styles;
