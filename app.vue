<template>
  <UApp>
  <div class="min-h-screen bg-zinc-900">
    <noscript>
      <div  class="fixed inset-0 bg-white z-50">
      <div class="flex flex-col items-center min-h-screen bg-gray-950">
    <h1 style="font-size: 6rem" class="font-bold text-white">Javascript was not able to be loaded.</h1>
    <div class="flex items-center space-x-1 ">
      <p class="text-xl text-gray-300">Please switch to a browser that has Javascript support or enable it in your current one.</p>
    </div>
  </div>
  </div>
    </noscript>
    <NuxtLoadingIndicator />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</UApp>
</template>

<script setup lang="ts">
</script>



<style>

</style>

