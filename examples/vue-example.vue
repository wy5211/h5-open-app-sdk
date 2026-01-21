<template>
  <div class="app-open-container">
    <!-- SDK初始化状态 -->
    <div v-if="!isInitialized">SDK初始化中...</div>

    <!-- 微信开放标签容器 -->
    <div v-else-if="showWxOpenButton">
      <div ref="wxContainer"></div>
      <p>点击上方按钮打开APP</p>
    </div>

    <!-- 备用按钮 -->
    <div v-else>
      <button
        @click="handleOpenApp"
        class="open-app-btn"
      >
        {{ buttonText }}
      </button>
      <p>点击按钮打开App</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import XMInstallSDK, { isWeChat } from '../src/index';

// 定义组件props
interface Props {
  appId: string;
  isDebug?: boolean;
  buttonText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  isDebug: false,
  buttonText: '打开App',
});

const wxContainer = ref<HTMLDivElement | null>(null);
const showWxOpenButton = ref(false);
const isInitialized = ref(false);

// 初始化SDK
const initSdk = async () => {
  try {
    await XMInstallSDK.init({
      id: props.appId,
      isDebug: props.isDebug,
    });
    isInitialized.value = true;
    console.log('SDK初始化成功');
  } catch (error) {
    console.error('SDK初始化失败:', error);
  }
};

// 处理打开App
const handleOpenApp = () => {
  try {
    XMInstallSDK.openApp();
  } catch (error) {
    console.error('打开App失败:', error);
  }
};

// 检查是否可以使用微信开放标签
const checkWxOpenCapability = async () => {
  if (!isInitialized.value) return;

  try {
    const canUse = XMInstallSDK.canUseWxOpen();
    if (canUse && wxContainer.value) {
      showWxOpenButton.value = true;

      // 渲染微信开放标签
      XMInstallSDK.renderWxOpenTag(wxContainer.value, {
        template:
          '<button style="padding: 10px 20px; background: #07c160; color: white; border: none; border-radius: 4px;">打开微信小程序</button>',
      });
    }
  } catch (error) {
    console.error('检查微信开放标签能力失败:', error);
  }
};

onMounted(async () => {
  // 初始化SDK
  await initSdk();

  // 如果是微信环境，检查是否可以使用微信开放标签
  if (isWeChat() && isInitialized.value) {
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
