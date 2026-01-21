import React, { useEffect, useRef, useState } from 'react';
import XMInstallSDK from '../src/index';

interface ReactExampleProps {
  appId: string;
  isDebug?: boolean;
  buttonText?: string;
}

const ReactExample: React.FC<ReactExampleProps> = ({
  appId,
  isDebug = false,
  buttonText = '打开App',
}) => {
  const wxContainerRef = useRef<HTMLDivElement>(null);

  // 初始化SDK
  useEffect(() => {
    const initSdk = async () => {
      try {
        await XMInstallSDK.init({
          id: appId,
          isDebug,
        });
        XMInstallSDK.renderOpenAppTrigger(wxContainerRef.current, {
          template:
            '<button style="padding: 10px 20px; background: #07c160; color: white; border: none; border-radius: 4px;">打开APP</button>',
        });
      } catch (error) {
        console.error('SDK初始化失败:', error);
      }
    };

    initSdk();
  }, [appId, isDebug]);

  return (
    <div
      className="app-open-container"
      ref={wxContainerRef}
    ></div>
  );
};

export default ReactExample;
