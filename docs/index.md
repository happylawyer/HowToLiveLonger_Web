---
layout: home

hero:
  name: "白领延寿指南"
  text: "把失去的 20 年夺回来"
  tagline: "拒绝职场损耗。基于医学证据的数字化生存手册，为您量身定制延寿方案。"
  image:
    src: https://cdn-icons-png.flaticon.com/512/2966/2966486.png
    alt: Health
  actions:
    - theme: brand
      text: 📖 查阅手册内容
      link: /guide/goals
    - theme: alt
      text: 💬 咨询 AI 助手
      link: /consult

features:
  - title: 🥗 职场膳食
    details: 外卖也能吃出健康。我们通过量化数据告诉您，哪些食物能真正降低 23%-34% 的心血管风险。
    icon: 🍱
  - title: 🎾 运动效率
    details: 抛弃盲目撸铁。羽毛球、乒乓球等挥拍运动能降低 47% 全因死亡率，是职场人的性价比之选。
    icon: ⚡
  - title: 😴 睡眠质量
    details: 破解“早起”焦虑。找到适合您的 7 小时黄金睡眠窗口，降低 40% 以上的过早死亡风险。
    icon: 🌙
  - title: 🤖 智能陪伴
    details: 右下角 AI 助手随时待命。支持文字与语音交互，深度学习数千份医学实证。
    icon: 🧠
---

<div class="custom-section">
  <div class="container">
    <h2 class="section-title">今日延寿 Checklist</h2>
    <p class="section-desc">每天完成这 5 件事，稳定提升预期寿命</p>
    
    <div class="checklist-grid">
      <div class="check-item">
        <div class="check-box">✅</div>
        <div class="check-content">
          <h4>晒太阳 15 分钟</h4>
          <p>午休出门，ACM 降低 ~40%</p>
        </div>
      </div>
      <div class="check-item">
        <div class="check-box">✅</div>
        <div class="check-content">
          <h4>喝一杯咖啡/茶</h4>
          <p>建议 3.5 杯，死亡率最低点</p>
        </div>
      </div>
      <div class="check-item">
        <div class="check-box">✅</div>
        <div class="check-content">
          <h4>规律刷牙两次</h4>
          <p>过早死亡风险降低 25%</p>
        </div>
      </div>
      <div class="check-item">
        <div class="check-box">✅</div>
        <div class="check-content">
          <h4>拒绝甜味饮料</h4>
          <p>保护代谢，远离 27% 额外风险</p>
        </div>
      </div>
      <div class="check-item">
        <div class="check-box">✅</div>
        <div class="check-content">
          <h4>站立办公/每小时走动</h4>
          <p>抵消久坐带来的 3% 风险增量</p>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
.custom-section {
  padding: 80px 24px;
  background: linear-gradient(180deg, var(--vp-c-bg) 0%, var(--vp-c-bg-soft) 100%);
}

.section-title {
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 12px;
  background: linear-gradient(120deg, #3498db 0%, #2ecc71 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.section-desc {
  text-align: center;
  color: var(--vp-c-text-2);
  margin-bottom: 48px;
}

.checklist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  max-width: 1100px;
  margin: 0 auto;
}

.check-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 24px;
  background: var(--vp-c-bg-alt);
  border-radius: 16px;
  border: 1px solid var(--vp-c-divider);
  transition: all 0.3s ease;
}

.check-item:hover {
  transform: translateY(-5px);
  border-color: var(--vp-c-brand);
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
}

.check-box {
  font-size: 1.5rem;
}

.check-content h4 {
  margin: 0 0 4px;
  font-weight: 600;
}

.check-content p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}
</style>
