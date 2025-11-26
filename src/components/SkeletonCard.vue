<template>
  <div class="skeleton-card">
    <div class="skeleton-image"></div>
    <div class="skeleton-content">
      <div class="skeleton-line skeleton-title"></div>
      <div class="skeleton-line skeleton-category"></div>
      <div class="skeleton-line skeleton-price"></div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.skeleton-card {
  background: var(--white);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px var(--shadow);
}

.skeleton-image {
  width: 100%;
  aspect-ratio: 1;
  background: linear-gradient(
    90deg,
    var(--accent) 25%,
    rgba(255, 255, 255, 0.5) 50%,
    var(--accent) 75%
  );
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

.skeleton-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-line {
  height: 16px;
  background: linear-gradient(
    90deg,
    var(--accent) 25%,
    rgba(255, 255, 255, 0.5) 50%,
    var(--accent) 75%
  );
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
}

.skeleton-title {
  width: 80%;
  height: 20px;
}

.skeleton-category {
  width: 40%;
  height: 14px;
}

.skeleton-price {
  width: 60%;
  height: 24px;
  margin-top: 8px;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>

