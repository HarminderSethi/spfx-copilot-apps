import * as React from "react";
import { Spinner, tokens } from "@fluentui/react-components";
import { StackV2, TypographyControl } from "@spteck/react-controls-v2";

export interface IEventsAsyncStatusProps {
  error: string | undefined;
  errorLabel: string;
  isLoading: boolean;
  loadingLabel: string;
}

export function EventsAsyncStatus(
  props: IEventsAsyncStatusProps,
): React.ReactElement {
  return (
    <StackV2
      alignItems="center"
      direction="horizontal"
      gap="s"
      padding="s"
      role={props.error ? "alert" : "status"}
      style={{
        backgroundColor: tokens.colorNeutralBackground1,
        borderRadius: tokens.borderRadiusMedium,
        bottom: tokens.spacingVerticalM,
        boxShadow: tokens.shadow8,
        position: "absolute",
        right: tokens.spacingHorizontalM,
        zIndex: 1,
      }}
    >
      {props.error ? (
        <TypographyControl color={tokens.colorPaletteRedForeground1}>
          {props.errorLabel}: {props.error}
        </TypographyControl>
      ) : (
        <Spinner
          label={props.loadingLabel}
          labelPosition="after"
          size="tiny"
        />
      )}
    </StackV2>
  );
}
