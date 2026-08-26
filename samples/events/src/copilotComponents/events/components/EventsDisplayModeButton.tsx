import * as React from "react";
import type { SPCopilotDisplayMode } from "@microsoft/sp-copilot-component";
import { Button, Tooltip } from "@fluentui/react-components";
import {
  ArrowExpand24Regular,
  ArrowMinimize24Regular,
} from "@fluentui/react-icons";

export interface IEventsDisplayModeButtonProps {
  label: string;
  mode: SPCopilotDisplayMode;
  onRequestDisplayMode: (mode: SPCopilotDisplayMode) => Promise<void>;
}

export function EventsDisplayModeButton(
  props: IEventsDisplayModeButtonProps,
): React.ReactElement {
  const icon =
    props.mode === "fullscreen" ? (
      <ArrowExpand24Regular />
    ) : (
      <ArrowMinimize24Regular />
    );

  const handleClick = async (): Promise<void> => {
    await props.onRequestDisplayMode(props.mode);
  };

  return (
    <Tooltip content={props.label} relationship="label">
      <Button
        appearance="subtle"
        aria-label={props.label}
        icon={icon}
        onClick={handleClick}
      />
    </Tooltip>
  );
}
