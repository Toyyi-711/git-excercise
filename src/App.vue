  <script setup>
import RandomFact from './components/RandomFact.vue'
import FactList from './components/FactList.vue'
import BreedList from './components/BreedList.vue'
</script>

<template>
  <div class="page">
    <header class="hero">
      <h1>🐾 Cat Facts 学习项目</h1>
      <p>本项目演示前端如何调用 <code>https://catfact.ninja/</code> 这套 API</p>
    </header>

    <main>
      <RandomFact />
      <FactList />
      <BreedList />
    </main>

    <footer>
      <p>API 调用代码全部在 <code>src/api/catfact.js</code>，组件在 <code>src/components/</code></p>
    </footer>
  </div>
</template>
