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
      { text: '延寿手册', link: '/guide/goals' },
      { text: 'AI 咨询', link: '/consult' }
    ],
    sidebar: [
      {
        text: '📖 延寿手册',
        items: [
          { text: '🎯 目标与量化数据', link: '/guide/goals' },
          { text: '🥗 职场膳食建议', link: '/guide/diet' },
          { text: '🏃‍♂️ 办公室生活方式', link: '/guide/lifestyle' }
        ]
      }
    ],
    footer: {
      message: '本站内容基于公开医学研究，由 AI 辅助生成',
      copyright: 'Copyright © 2026-present Jack Smith & Gemini3'
    },
    search: {
      provider: 'local',
      options: {
        miniSearch: {
          options: {
            tokenize: (str) => str.split(/[\u4e00-\u9fa5]|\s+/)
          }
        },
        translations: {
          button: { buttonText: '搜索文档' },
          modal: {
            noResultsText: '无法找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: { selectText: '选择', navigateText: '切换' }
          }
        }
      }
    }
  }
})
