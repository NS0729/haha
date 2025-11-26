<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>关于我们</h3>
          <p>提供精美首饰，展现独特魅力</p>
        </div>
        <div class="footer-section">
          <h3>联系方式</h3>
          <p>邮箱: info@jewelry.com</p>
          <p>电话: 400-123-4567</p>
        </div>
        <div class="footer-section">
          <h3>关注我们</h3>
          <div class="social-links">
            <a href="#">微信</a>
            <a href="#">微博</a>
            <a href="#">小红书</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2024 精美首饰. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
.footer {
  background: var(--secondary);
  color: var(--white);
  margin-top: auto;
  padding: 48px 0 24px;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 32px;
  margin-bottom: 32px;
}

.footer-section h3 {
  margin-bottom: 16px;
  color: var(--primary);
}

.footer-section p {
  margin-bottom: 8px;
  opacity: 0.9;
}

.social-links {
  display: flex;
  gap: 16px;
}

.social-links a {
  color: var(--white);
  text-decoration: none;
  padding: 8px 16px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  transition: all 0.3s ease;
}

.social-links a:hover {
  background: var(--primary);
  border-color: var(--primary);
}

.footer-bottom {
  text-align: center;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  opacity: 0.8;
}
</style>

