<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
    <div class="text-center space-y-4">
      <h1 class="text-6xl font-bold text-black">Привіт!</h1>
      <h3 class="text-xl text-gray-700">
        <span class="font-semibold text-black">Сторінка</span> не існує.
      </h3>
      <router-link
        :to="{ name: 'MapView' }"
        class="inline-block mt-6 px-6 py-3 bg-gray-500 text-white text-sm font-medium rounded hover:bg-gray-700 transition">
        Повернутись до карти
      </router-link>
    </div>
  </div>
</template>
