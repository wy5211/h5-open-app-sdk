import React, { useEffect, useRef, useState } from 'react';
import XMInstallSDK, { isWeChat } from '../src/index';

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
  const [showWxOpenButton, setShowWxOpenButton] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // 初始化SDK
  useEffect(() => {
    const initSdk = async () => {
      try {
        await XMInstallSDK.init({
          id: appId,
          isDebug,
        });
        setIsInitialized(true);
        console.log('SDK初始化成功');
      } catch (error) {
        console.error('SDK初始化失败:', error);
      }
    };

    initSdk();
  }, [appId, isDebug]);

  // 检查是否可以使用微信开放标签
  useEffect(() => {
    const checkWxOpenCapability = async () => {
      if (!isInitialized) return;

      try {
        const canUse = XMInstallSDK.canUseWxOpen();
        if (canUse && wxContainerRef.current) {
          setShowWxOpenButton(true);

          // 渲染微信开放标签
          XMInstallSDK.renderWxOpenTag(wxContainerRef.current, {
            template:
              '<button style="padding: 10px 20px; background: #07c160; color: white; border: none; border-radius: 4px;">打开APP</button>',
          });
        }
      } catch (error) {
        console.error('检查微信开放标签能力失败:', error);
      }
    };

    // 如果是微信环境，检查是否可以使用微信开放标签
    if (isWeChat() && isInitialized) {
      checkWxOpenCapability();
    }
  }, [isInitialized]);

  // 处理打开App
  const handleOpenApp = () => {
    try {
      XMInstallSDK.openApp();
    } catch (error) {
      console.error('打开App失败:', error);
    }
  };

  if (!isInitialized) {
    return <div>SDK初始化中...</div>;
  }

  return (
    <div className="app-open-container">
      {/* 微信开放标签容器 */}
      {showWxOpenButton && (
        <div>
          <div ref={wxContainerRef} />
          <p>点击上方按钮打开微信小程序</p>
        </div>
      )}

      {/* 备用按钮 */}
      {!showWxOpenButton && (
        <div>
          <button
            onClick={handleOpenApp}
            className="open-app-btn"
            style={{
              padding: '10px 20px',
              backgroundColor: '#007aff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: 'pointer',
            }}
          >
            {buttonText}
          </button>
          <p>点击按钮打开App</p>
        </div>
      )}
    </div>
  );
};

export default ReactExample;
