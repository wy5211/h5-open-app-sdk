# H5 Open App SDK

一个用于在浏览器/微信 WebView 环境下以最优策略打开 App 的 SDK。

## 特性

- 支持微信环境 & 普通浏览器环境
- 在微信中：优先使用 `wx-open-launch-app` 官方能力
- 在非微信中：使用 Scheme
- 支持 Vue / React / 原生 JS 接入
- 不控制 UI，不劫持业务流程
- 能力判断与执行解耦

## 安装

```bash
npm install xm-install-sdk
```

## 使用方法

### 基础使用

```javascript
import XMInstallSDK from 'xm-install-sdk';

// 初始化SDK
XMInstallSDK.init({
  id: 'your-business-app-id',
});

// 在微信环境中渲染打开按钮
async function renderOpenButton() {
  if (await XMInstallSDK.canUseWxOpen()) {
    XMInstallSDK.renderWxOpenApp(document.getElementById('wx-container'), {
      appId: 'your-wechat-app-id',
      extInfo: { path: '/detail', id: 1 },
      template: '<div>打开App</div>',
    });
  }
}

// 打开App
XMInstallSDK.openApp();
```

### 在 Vue 中使用

```vue
<template>
  <div>
    <div
      ref="wxContainer"
      v-if="showWxButton"
    ></div>
    <button
      v-else
      @click="openApp"
    >
      打开App
    </button>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import XMInstallSDK from 'xm-install-sdk';

export default {
  setup() {
    const wxContainer = ref(null);
    const showWxButton = ref(false);

    onMounted(async () => {
      if (await XMInstallSDK.canUseWxOpen()) {
        showWxButton.value = true;
        XMInstallSDK.renderWxOpenApp(wxContainer.value, {
          appId: 'your-wx-app-id',
          extInfo: { path: '/detail', id: 1 },
        });
      }
    });

    const openApp = () => {
      XMInstallSDK.openApp();
    };

    return {
      wxContainer,
      showWxButton,
      openApp,
    };
  },
};
</script>
```

### 在 React 中使用

```jsx
import React, { useEffect, useRef } from 'react';
import XMInstallSDK from 'xm-install-sdk';

const AppOpenButton = () => {
  const wxContainerRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      if (await XMInstallSDK.canUseWxOpen()) {
        XMInstallSDK.renderWxOpenApp(wxContainerRef.current, {
          appId: 'your-wx-app-id',
          extInfo: { path: '/detail', id: 1 },
        });
      }
    };

    init();
  }, []);

  const openApp = () => {
    XMInstallSDK.openApp();
  };

  return (
    <div>
      <div ref={wxContainerRef} />
      <button onClick={openApp}>打开App</button>
    </div>
  );
};

export default AppOpenButton;
```

## API

### init(options)

初始化 SDK

- `options.id`: 业务应用 ID

### canUseWxOpen()

判断是否可以使用微信开放标签

### renderWxOpenApp(container, options)

渲染微信开放标签

- `container`: DOM 容器元素
- `options.appId`: 微信 AppId
- `options.extInfo`: 扩展信息（可选）
- `options.template`: 自定义模板（可选）

### openApp()

统一的打开 App 方法，根据当前环境选择最优策略

## 开发

```bash
# 安装依赖
npm install

# 构建
npm run build

# 运行测试
npm test
```

## 许可证

MIT
