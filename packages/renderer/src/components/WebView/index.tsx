import React, { FC, useRef, useEffect } from "react";
import useElectron from "../../hooks/electron";
import classNames from "classnames";
import "./index.scss";

interface DivRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

const computeRect = (rect: DivRect) => {
  if (!rect) return { x: 0, y: 0, width: 0, height: 0 };
  return {
    x: Math.floor(rect.left),
    y: Math.floor(rect.top),
    width: Math.floor(rect.width),
    height: Math.floor(rect.height),
  };
};

interface WebViewProps {
  className?: string;
}

const WebView: FC<WebViewProps> = ({ className }) => {
  const webviewRef = useRef<HTMLDivElement>(null);
  const resizeObserver = useRef<ResizeObserver>();

  const { setWebviewBounds, webviewHide, webviewShow } = useElectron();

  useEffect(() => {
    if (webviewRef.current != null) {
      // 监控 webview 元素的大小
      resizeObserver.current = new ResizeObserver((entries) => {
        const rect = computeRect(webviewRef.current?.getBoundingClientRect());
        const entry = entries[0];
        const viewRect = computeRect(entry.contentRect);
        viewRect.x += rect.x;
        viewRect.y += rect.y;
        setWebviewBounds(viewRect);
      });

      resizeObserver.current.observe(webviewRef.current);
      webviewShow();
    }

    return () => {
      resizeObserver.current?.disconnect();
      webviewHide();
    };
  }, []);

  return <div ref={webviewRef} className={classNames(className)} />;
};

export default WebView;
