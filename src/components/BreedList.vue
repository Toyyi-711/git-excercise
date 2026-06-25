<script setup>
/**
 * BreedList.vue —— 演示结构化数据的展示
 *
 * 重点：API 返回的对象字段多时，模板里直接用 v-for 渲染对象数组
 */
import { ref, computed, onMounted } from 'vue'
import { getBreeds } from '../api/catfact.js'

const list = ref([])
const page = ref(1)
const lastPage = ref(1)
const loading = ref(false)
const error = ref(null)

const hasNext = computed(() => page.value < lastPage.value)
const hasPrev = computed(() => page.value > 1)

async function load(p) {
  loading.value = true
  error.value = null
  try {
    const data = await getBreeds({ page: p, limit: 8 })
    list.value = data.data
    page.value = data.current_page
    lastPage.value = data.last_page
  } catch (e) {
    error.value = e.message || '请求失败'
  } finally {
    loading.value = false
  }
}

onMounted(() => load(1))
</script>

<template>
  <section class="card">
    <h2>🐈 猫咪品种</h2>

    <p v-if="loading" class="status">加载中…</p>
    <p v-else-if="error" class="status error">❌ {{ error }}</p>

    <div v-else class="grid">
      <article v-for="b in list" :key="b.breed" class="breed">
        <h3>{{ b.breed }}</h3>
        <dl>
          <dt>原产地</dt><dd>{{ b.country }}</dd>
          <dt>起源</dt><dd>{{ b.origin }}</dd>
          <dt>毛长</dt><dd>{{ b.coat }}</dd>
          <dt>花纹</dt><dd>{{ b.pattern }}</dd>
        </dl>
      </article>
    </div>

    <div class="pager">
      <button :disabled="!hasPrev || loading" @click="load(page - 1)">← 上一页</button>
      <span>{{ page }} / {{ lastPage }}</span>
      <button :disabled="!hasNext || loading" @click="load(page + 1)">下一页 →</button>
    </div>
  </section>
</template>
