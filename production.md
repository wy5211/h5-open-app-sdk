# 分发 JSSDK 设计文档（最终版）

> 目标：在 **浏览器 / 微信 WebView** 环境下，提供一个稳定、可扩展、低侵入的 JSSDK，用于 **最优策略打开 App**，并在失败时可优雅兜底。

---

## 一、设计目标与原则

### 1.1 核心目标

- 支持 **微信环境 & 普通浏览器环境**
- 在微信中：优先使用 **wx-open-launch-app 官方能力**
- 在非微信中：使用 **Universal Link / Scheme**
- 打不开时：支持 **兜底下载 / 第三方分发服务（如 XInstall）**
- 支持 **Vue / React / 原生 JS** 接入

### 1.2 设计原则（必须遵守）

1. **SDK 不控制 UI**（不决定按钮样式、文案、布局）
2. **SDK 不劫持业务流程**（不自动加载微信 SDK、不调用 wx.config）
3. **能力判断与执行解耦**
4. **失败必须可兜底**
5. **运行时能力 > 构建时能力**

---

## 二、整体架构设计

```text
┌──────────────────────────────┐
│          业务应用            │
│  Vue / React / Vanilla JS    │
└───────────────▲──────────────┘
                │
┌───────────────┴──────────────┐
│        分发 JSSDK Core        │
│  - init                       │
│  - canUseWxOpen               │
│  - renderWxOpenApp            │
│  - openByScheme / fallback    │
└───────────────▲──────────────┘
                │
┌───────────────┴──────────────┐
│       Environment Layer       │
│  - isWeChat                   │
│  - isIOS / Android            │
└───────────────▲──────────────┘
                │
┌───────────────┴──────────────┐
│       Capability Layer        │
│  - hasWxAppId                 │
│  - isWxReady (外部注入)       │
└───────────────▲──────────────┘
                │
┌───────────────┴──────────────┐
│       Strategy Layer          │
│  - WxOpenStrategy             │
│  - SchemeStrategy             │
│  - FallbackStrategy           │
└──────────────────────────────┘
```

---

## 三、SDK 职责边界（非常重要）

### SDK 负责

- 环境判断（是否微信）
- 能力判断（是否可用 wx-open-launch-app）
- 正确渲染微信开放平台标签
- 提供统一的 open 能力

### SDK 不负责

- 加载 jweixin.js
- 调用 wx.config
- 请求微信签名接口
- 控制 UI / 样式 / 文案
- 判断“是否真的打开成功”

---

## 四、SDK 初始化设计

```ts
sdk.init({
  id: 'business-app-id',
});
```

说明：

- `wx.isReady` 由 **业务侧注入**，SDK 只消费结果
- SDK 不关心 wx.config 的实现细节

---

## 五、核心能力设计

### 5.1 canUseWxOpen

```ts
canUseWxOpen(): boolean | Promise<boolean>
```

判断条件：

```text
isWeChat
AND
存在 wx.appId
AND
wx.isReady === true
```

---

### 5.2 renderWxOpenApp（核心能力）

```ts
renderWxOpenApp(
  container: HTMLElement,
  options: {
    appId: string
    extInfo?: Record<string, any>
    template?: string
  }
): void
```

#### 行为说明

- 仅负责向 container 内渲染 `wx-open-launch-app`
- 不操作 body
- 不监听点击事件
- 不兜底跳转

---

### 5.3 renderWxOpenApp 内部实现（规范）

```ts
function renderWxOpenApp(container, options) {
  container.innerHTML = '';

  const el = document.createElement('wx-open-launch-app');
  el.setAttribute('appid', options.appId);

  if (options.extInfo) {
    el.setAttribute('extinfo', JSON.stringify(options.extInfo));
  }

  el.innerHTML = `
    <script type="text/wxtag-template">
      ${options.template || '<div>打开 App</div>'}
    </script>
  `;

  container.appendChild(el);
}
```

---

## 六、业务侧接入规范

### 6.1 Vue 3 示例

```vue
<template>
  <div ref="wxContainer"></div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import sdk from '@/sdk';

const wxContainer = ref(null);

onMounted(async () => {
  if (await sdk.canUseWxOpen()) {
    sdk.renderWxOpenApp(wxContainer.value, {
      appId: 'wx123456',
      extInfo: { path: '/detail', id: 1 },
    });
  }
});
</script>
```

---

### 6.2 React 示例

```ts
const ref = useRef(null)

useEffect(() => {
  sdk.canUseWxOpen().then(can => {
    if (can) {
      sdk.renderWxOpenApp(ref.current, {...})
    }
  })
}, [])
```

---

## 七、完整打开策略流程（决策树）

```text
openApp()
  ↓
是否微信环境？
  ├─ 否 → Universal Link / Scheme
  └─ 是
      ↓
  canUseWxOpen ?
      ├─ 是 → renderWxOpenApp（用户点击）
      └─ 否 → Scheme / XInstall / 下载页
```

---

## 八、失败兜底设计

SDK **不自动兜底**，但提供能力：

```ts
sdk.openByScheme();
sdk.openDownload();
sdk.openByXInstall();
```

业务侧根据场景组合调用。

---

## 九、常见坑位与强制约束

1. wx-open-launch-app 必须真实存在于 DOM
2. 必须由用户点击触发
3. 不可使用 display:none / v-if 频繁销毁
4. 不可在 iframe 中使用
5. 不可自动触发点击

---

该设计：

- 可长期维护
- 可横向扩展
- 符合微信官方规则
- 适用于真实生产环境

技术栈要求使用 typescript ，编译使用 tsc，请求使用 request


**文档结束**
