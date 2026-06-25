<script setup>
/**
 * FactList.vue —— 演示带分页的 API 调用
 *
 * 在 RandomFact 基础上多学一点：
 *  1. 调用带 query 参数的接口：getFacts({ page, limit })
 *  2. 维护分页状态：page / lastPage
 *  3. 加载新数据时不要把旧列表清空 —— 避免闪屏
 */
import { ref, computed, onMounted } from 'vue'
import { getFacts } from '../api/catfact.js'

const list = ref([])        // 当前页数据列表
const page = ref(1)         // 当前页码
const lastPage = ref(1)     // 总页数（接口会告诉我们）
const limit = ref(5)        // 每页条数
const loading = ref(false)
const error = ref(null)

// 是否还有下一页
const hasNext = computed(() => page.value < lastPage.value)
const hasPrev = computed(() => page.value > 1)

async function load(p) {
  loading.value = true
  error.value = null
  // 注意：这里不清空 list，让用户看到旧内容直到新内容到达，体验更好
  try {
    const data = await getFacts({ page: p, limit: limit.value })
    list.value = data.data           // 数组在 data.data 里
    page.value = data.current_page
    lastPage.value = data.last_page
  } catch (e) {
    error.value = e.message || '请求失败'
  } finally {
    loading.value = false
  }
}

function next() { if (hasNext.value) load(page.value + 1) }
function prev() { if (hasPrev.value) load(page.value - 1) }
function reload() { load(page.value) }

onMounted(() => load(1))
</script>

<template>
  <section class="card">
    <h2>📚 冷知识列表（分页）</h2>

    <p v-if="loading" class="status">加载中…</p>
    <p v-else-if="error" class="status error">❌ {{ error }} <button @click="reload">重试</button></p>

    <ol v-else class="list">
      <li v-for="(item, i) in list" :key="i" class="list-item">
        <span class="badge">{{ (page - 1) * limit + i + 1 }}</span>
        {{ item.fact }}
      </li>
    </ol>

    <div class="pager">
      <button :disabled="!hasPrev || loading" @click="prev">← 上一页</button>
      <span>第 {{ page }} / {{ lastPage }} 页</span>
      <button :disabled="!hasNext || loading" @click="next">下一页 →</button>
    </div>
  </section>
</template>
