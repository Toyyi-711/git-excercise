<script setup>
/**
 * RandomFact.vue —— 演示最基本的 API 调用
 *
 * 这里你能学到：
 *  1. ref() 用来保存组件状态：数据、加载中、错误
 *  2. async/await + try/catch/finally 规范写法
 *  3. onMounted 钩子：组件挂载完就自动请求一次
 *  4. 模板里 v-if / v-else-if 链渲染不同状态
 */
import { ref, onMounted } from 'vue'
import { getRandomFact } from '../api/catfact.js'

// 三个核心状态：用 ref 包成响应式
const fact = ref('')           // 存储接口返回的数据
const loading = ref(false)     // 是否正在请求
const error = ref(null)        // 错误信息，null 表示没有错误

// 把请求逻辑抽成一个函数，方便按钮点击和 onMounted 复用
async function loadFact() {
  loading.value = true         // 进入"加载中"状态
  error.value = null           // 清掉上一次的错误
  fact.value = ''              // 清掉上一次的数据（避免闪现旧内容）

  try {
    // 真正发请求：await 等待服务端返回
    const data = await getRandomFact()
    fact.value = data.fact     // 把后端返回的 fact 字段写到响应式变量
  } catch (e) {
    // 出错时把错误信息存起来，模板里展示给用户
    error.value = e.message || '请求失败'
  } finally {
    // 无论成功失败，最后都要把 loading 关掉
    loading.value = false
  }
}

// 组件挂载时自动拉一次，让页面一进来就有内容
onMounted(loadFact)
</script>

<template>
  <section class="card">
    <h2>🐱 随机猫咪冷知识</h2>

    <!-- 三态渲染：加载中 / 出错 / 有数据 -->
    <p v-if="loading" class="status">加载中…</p>
    <p v-else-if="error" class="status error">❌ {{ error }}</p>
    <p v-else class="fact">{{ fact }}</p>

    <button :disabled="loading" @click="loadFact">
      {{ loading ? '请稍等…' : '再来一条' }}
    </button>
  </section>
</template>
