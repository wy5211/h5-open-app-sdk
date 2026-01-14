<template>
  <div class="app-open-container">
    <!-- 微信开放标签容器 -->
    <div
      ref="wxContainer"
      v-if="showWxOpenButton"
    ></div>

    <!-- 备用按钮 -->
    <button
      v-if="!showWxOpenButton"
      @click="handleOpenApp"
      class="open-app-btn"
    >
      {{ buttonText }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import H5OpenAppSDK from '../src/index';

// 定义组件props
interface Props {
  appId: string;
  wxAppId?: string;
  scheme?: string;
  universalLink?: string;
  downloadUrl?: string;
  extInfo?: Record<string, any>;
}

const props = withDefaults(defineProps<Props>(), {
  extInfo: () => ({}),
  buttonText: '打开App',
});

const wxContainer = ref<HTMLDivElement | null>(null);
const showWxOpenButton = ref(false);
const buttonText = computed(() => props.buttonText || '打开App');

// 初始化SDK
const initSdk = () => {
  H5OpenAppSDK.init({
    id: props.appId,
    wxAppId: props.wxAppId,
    scheme: props.scheme,
    universalLink: props.universalLink,
    downloadUrl: props.downloadUrl,
    extInfo: props.extInfo,
  });
};

// 处理打开App
const handleOpenApp = () => {
  if (H5OpenAppSDK.getEnvironment().isWeChat) {
    // 在微信中，尝试使用微信开放标签
    H5OpenAppSDK.openApp();
  } else {
    // 在非微信环境中，使用scheme或universal link
    if (props.universalLink) {
      H5OpenAppSDK.openByUniversalLink();
    } else if (props.scheme) {
      H5OpenAppSDK.openByScheme();
    } else if (props.downloadUrl) {
      H5OpenAppSDK.openDownload();
    }
  }
};

// 检查是否可以使用微信开放标签
const checkWxOpenCapability = async () => {
  try {
    const canUse = await H5OpenAppSDK.canUseWxOpen();
    if (canUse && wxContainer.value) {
      showWxOpenButton.value = true;

      // 渲染微信开放标签
      H5OpenAppSDK.renderWxOpenApp(wxContainer.value, {
        appId: props.wxAppId!,
        extInfo: props.extInfo,
        template: '<div>打开App</div>',
      });
    }
  } catch (error) {
    console.error('检查微信开放标签能力失败:', error);
  }
};

onMounted(async () => {
  // 初始化SDK
  initSdk();

  // 如果是微信环境，检查是否可以使用微信开放标签
  if (H5OpenAppSDK.getEnvironment().isWeChat) {
    await checkWxOpenCapability();
  }
});
</script>

<style scoped>
.open-app-btn {
  padding: 10px 20px;
  background-color: #007aff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

.open-app-btn:hover {
  background-color: #0062cc;
}
</style>
