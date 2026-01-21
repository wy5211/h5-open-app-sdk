<template>
  <div
    class="app-open-container"
    ref="wxContainer"
  ></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import XMInstallSDK from '../src/index';

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

// 初始化SDK
onMounted(async () => {
  try {
    await XMInstallSDK.init({
      id: props.appId,
      isDebug: props.isDebug,
    });

    if (wxContainer.value) {
      XMInstallSDK.renderOpenAppTrigger(wxContainer.value, {
        template:
          '<button style="padding: 10px 20px; background: #07c160; color: white; border: none; border-radius: 4px;">打开APP</button>',
      });
    }
  } catch (error) {
    console.error('SDK初始化失败:', error);
  }
});
</script>

<style scoped>
.app-open-container {
  display: inline-block;
}
</style>
