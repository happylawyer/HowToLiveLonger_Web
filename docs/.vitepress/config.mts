import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "延寿指南 (公益版)",
  description: "您的数字化健康生存手册",
  base: '/HowToLiveLonger_Web/',
  themeConfig: {
    // 暂时移除 logo 图片，改用文字标题
    nav: [
      { text: '首页', link: '/' },
      { text: '延寿手册', link: '/guide' },
      { text: 'AI 咨询', link: '/consult' },
      { text: '关于', link: '/about' }
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
      message: '本站内容仅供公益普及，不代表医疗建议',
      copyright: 'Copyright © 2026-present Jack Smith & Gemini3'
    },
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档'
          },
          modal: {
            noResultsText: '无法找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              navigateText: '切换'
            }
          }
        }
      }
    }
  }
})
