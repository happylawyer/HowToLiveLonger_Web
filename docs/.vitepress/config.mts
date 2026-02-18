import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "程序员延寿指南 (公益版)",
  description: "基于医学证据的程序员长寿指南",
  base: '/HowToLiveLonger_Web/',
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '关于项目', link: '/about' }
    ],
    sidebar: [
      {
        text: '延寿指南',
        items: [
          { text: '1. 术语与目标', link: '/#1-术语' },
          { text: '2. 关键结果', link: '/#3-关键结果' },
          { text: '3. 行动清单', link: '/#5-行动' },
          { text: '4. 科学证据', link: '/#6-证据' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/geekan/HowToLiveLonger' }
    ]
  }
})
