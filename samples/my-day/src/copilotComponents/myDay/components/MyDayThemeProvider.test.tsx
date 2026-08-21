import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';

import { makeStyles } from '@griffel/react';

import MyDayThemeProvider from './MyDayThemeProvider';

const useTestStyles = makeStyles({
  root: {
    display: 'grid'
  }
});

const StyledChild: React.FunctionComponent = () => {
  const styles = useTestStyles();
  return <div className={styles.root}>Styled in target document</div>;
};

describe('MyDayThemeProvider', () => {
  test('inserts Griffel styles into the supplied component document', () => {
    const iframe = document.createElement('iframe');
    document.body.appendChild(iframe);
    const targetDocument = iframe.contentDocument as Document;
    const target = targetDocument.createElement('div');
    targetDocument.body.appendChild(target);

    act(() => {
      ReactDOM.render(
        <MyDayThemeProvider targetDocument={targetDocument} theme="light">
          <StyledChild />
        </MyDayThemeProvider>,
        target
      );
    });

    expect(target.querySelector('[class]')).not.toBeNull();
    expect(
      targetDocument.head.querySelectorAll('style[data-make-styles-bucket]').length
    ).toBeGreaterThan(0);

    act(() => {
      ReactDOM.unmountComponentAtNode(target);
    });
    iframe.remove();
  });
});