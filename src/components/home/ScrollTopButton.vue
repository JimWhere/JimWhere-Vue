<template>
  <button
      v-show="visible"
      class="scroll-top-btn"
      @click="scrollToTop"
  >
    ↑
  </button>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const visible = ref(false);

const handleScroll = () => {
  visible.value = window.scrollY > 300;
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped>
.scroll-top-btn {
  position: fixed;
  bottom: 25px;
  right: 25px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background: #4A72FF;
  color: white;
  font-size: 22px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  transition: opacity 0.25s, transform 0.25s;
  z-index: 9999;
}

.scroll-top-btn:hover {
  background: #3B5FE0;
  transform: translateY(-3px);
}
</style>
