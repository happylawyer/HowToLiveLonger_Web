import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "白领延寿指南 (公益版)",
  description: "您的数字化健康生存手册",
  base: '/HowToLiveLonger_Web/',
  head: [
    ['link', { rel: 'icon', href: 'https://cdn-icons-png.flaticon.com/512/2966/2966327.png' }]
  ],
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '延寿手册', link: '/guide' },
      { text: 'AI 咨询', link: '/consult' }
    ],
    sidebar: [
      {
        text: '📖 延寿手册',
        items: [
          { text: '目标与关键数据', link: '/guide#目标' },
          { text: '饮食摄入建议', link: '/guide#饮食' },
          { text: '生活方式建议', link: '/guide#日常' },
          { text: '医学证据详解', link: '/guide#证据' }
        ]
      }
    ],
    footer: {
      message: '本站内容基于公开医学研究，由 AI 辅助生成',
      copyright: 'Copyright © 2026-present Jack Smith & Gemini3'
    },
    search: {
      provider: 'local'
    },
    outline: {
      label: '页面导航'
    }
  }
})
