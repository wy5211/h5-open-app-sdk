import React, { useEffect, useRef } from 'react';
import H5OpenAppSDK from '../src/index';

interface ReactExampleProps {
  appId: string;
  wxAppId?: string;
  scheme?: string;
  universalLink?: string;
  downloadUrl?: string;
  extInfo?: Record<string, any>;
  buttonText?: string;
}

const ReactExample: React.FC<ReactExampleProps> = ({
  appId,
  wxAppId,
  scheme,
  universalLink,
  downloadUrl,
  extInfo = {},
  buttonText = '打开App',
}) => {
  const wxContainerRef = useRef<HTMLDivElement>(null);
  const [showWxOpenButton, setShowWxOpenButton] = React.useState(false);

  // 初始化SDK
  useEffect(() => {
    H5OpenAppSDK.init({
      id: appId,
      wxAppId,
      scheme,
      universalLink,
      downloadUrl,
      extInfo,
    });
  }, [appId, wxAppId, scheme, universalLink, downloadUrl, extInfo]);

  // 检查是否可以使用微信开放标签
  useEffect(() => {
    const checkWxOpenCapability = async () => {
      try {
        const canUse = await H5OpenAppSDK.canUseWxOpen();
        if (canUse && wxContainerRef.current) {
          setShowWxOpenButton(true);

          // 渲染微信开放标签
          H5OpenAppSDK.renderWxOpenApp(wxContainerRef.current, {
            appId: wxAppId!,
            extInfo,
            template: '<div>打开App</div>',
          });
        }
      } catch (error) {
        console.error('检查微信开放标签能力失败:', error);
      }
    };

    // 如果是微信环境，检查是否可以使用微信开放标签
    if (H5OpenAppSDK.getEnvironment().isWeChat) {
      checkWxOpenCapability();
    }
  }, [wxAppId, extInfo]);

  // 处理打开App
  const handleOpenApp = () => {
    if (H5OpenAppSDK.getEnvironment().isWeChat) {
      // 在微信中，尝试使用微信开放标签
      H5OpenAppSDK.openApp();
    } else {
      // 在非微信环境中，使用scheme或universal link
      if (universalLink) {
        H5OpenAppSDK.openByUniversalLink();
      } else if (scheme) {
        H5OpenAppSDK.openByScheme();
      } else if (downloadUrl) {
        H5OpenAppSDK.openDownload();
      }
    }
  };

  return (
    <div className="app-open-container">
      {/* 微信开放标签容器 */}
      {showWxOpenButton && <div ref={wxContainerRef} />}

      {/* 备用按钮 */}
      {!showWxOpenButton && (
        <button
          onClick={handleOpenApp}
          className="open-app-btn"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default ReactExample;
