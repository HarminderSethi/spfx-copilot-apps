 
import * as React from "react";
import {
  PortalMountNodeProvider,
  webDarkTheme,
  webLightTheme,
} from "@fluentui/react-components";
import { ArrowClockwise24Regular } from "@fluentui/react-icons";
import { FluentUIProvider } from "@spteck/react-controls-v2/fluent-ui-provider";
import { EMessageType } from "@spteck/react-controls-v2/constants/EMessageTypes";
import { IconButton } from "@spteck/react-controls-v2/icon-button";
import { RenderSpinner } from "@spteck/react-controls-v2/render-spinner";
import { ShowMessage } from "@spteck/react-controls-v2/show-message";
import { StackV2 } from "@spteck/react-controls-v2/stack-v2";
import * as strings from "M365ProductRoadmapCopilotComponentStrings";
import { useMcpClient } from "../hooks/useMcpClient";
import type { IM365ProductRoadmapMcpAppProps } from "./IM365ProductRoadmapMcpAppProps";
import { McpToolUI } from "./McpToolUI";
import { useM365ProductRoadmapStyles } from "./styles/useM365ProductRoadmapStyles";

const DEFAULT_COMPONENT_HEIGHT: number = window.outerHeight - 200;

const M365ProductRoadmapMcpApp: React.FC<IM365ProductRoadmapMcpAppProps> = (
  props,
) => {
  console.log("[M365ProductRoadmap] Component rendering!", {
    displayMode: props.hostContext.displayMode,
    hasClient: !!props.bridge,
  });
  const styles = useM365ProductRoadmapStyles();
  const { client, error, isConnecting, reconnect } = useMcpClient();
  const isFullscreen = props.hostContext.displayMode === "fullscreen";

  const theme =
    props.hostContext.theme === "dark" ? webDarkTheme : webLightTheme;
  const containerHeight: number =
    props.hostContext.containerDimensions?.height ?? DEFAULT_COMPONENT_HEIGHT;

  React.useEffect(() => {
    props.onClientChanged(client);
    return () => {
      props.onClientChanged(undefined);
    };
  }, [client, props.onClientChanged]);

  return (
    <PortalMountNodeProvider value={props.targetDocument.body}>
      <FluentUIProvider
        applicationName="m365-product-roadmap-mcp-host"
        applyStylesToPortals={true}
        className={styles.provider}
        styles={{
          height: isFullscreen ? containerHeight : "100%",
          backgroundColor: theme.colorNeutralBackground1,
        }}
        targetDocument={props.targetDocument}
        theme={theme}
      >
        <StackV2
          direction="vertical"
          height={isFullscreen ? "100%" : undefined}
          overflow="hidden"
        >
          {isConnecting && (
            <StackV2
              alignItems="center"
              justifyContent="center"
              padding="l"
              style={{ backgroundColor: theme.colorNeutralBackground1 }}
              height="100%"
            >
              <RenderSpinner size="large" />
            </StackV2>
          )}

          {error && (
            <StackV2
              alignItems="center"
              gap="s"
              justifyContent="center"
              padding="l"
              width="100%"
              height="100%"
            >
              <ShowMessage message={error} messageType={EMessageType.ERROR} />
              <IconButton
                ariaLabel={strings.ReconnectLabel}
                icon={<ArrowClockwise24Regular />}
                onClick={reconnect}
                height="2rem"
                width="2rem"
              />
            </StackV2>
          )}

          {client && !isConnecting && !error && (
            <McpToolUI
              assetBaseUrl={props.assetBaseUrl}
              bridge={props.bridge}
              client={client}
              hostContext={props.hostContext}
              locale={props.locale}
              onConnectionError={reconnect}
              onRequestDisplayMode={props.onRequestDisplayMode}
              targetDocument={props.targetDocument}
              toolInput={props.toolInput}
            />
          )}
        </StackV2>
      </FluentUIProvider>
    </PortalMountNodeProvider>
  );
};

export default M365ProductRoadmapMcpApp;
