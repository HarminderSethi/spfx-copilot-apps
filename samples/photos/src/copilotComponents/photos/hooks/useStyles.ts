import * as React from "react";
import { css } from "@emotion/css";
import { tokens } from "@fluentui/react-components";

export interface IPhotoStyles {
  header: string;
  description: string;
  action: string;
  gallery: string;
}

export function useStyles(): IPhotoStyles {
  return React.useMemo(
    () => ({
      header: css({
        display: "flex",
        flex: "0 0 auto",
        alignItems: "center",
        justifyContent: "space-between",
        gap: tokens.spacingHorizontalM,
        width: "100%",
        padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalS}`,
      }),
      description: css({
        flex: "1 1 auto",
        minWidth: 0,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }),
      action: css({
        flex: "0 0 auto",
      }),
      gallery: css({
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        minWidth: 0,
      }),
    }),
    [],
  );
}
