# Kira ACT · 备考产品核心体验原型(Q2)

Kira Learning PM 笔试题第二题的交付物:学生"首次使用 → 形成习惯"核心闭环的高保真可点击原型 + 设计说明。

## 运行

```bash
npm install
npm run dev      # http://localhost:5180
npm run build    # 类型检查 + 生产构建
```

> 本机 node 在 `~/bin/node`,若 `npm` 未就绪可用:
> `node ~/lib/node_modules/npm/bin/npm-cli.js install`

## 流程(桌面 / Chromebook 优先,响应式两栏,6 屏)

首次进入 → 自适应诊断 → 个性化计划 → 每日练习 + AI 分层反馈 → 每日回访(Day 1–6)→ 第 7 天里程碑。

> 形态为**学区内 Chromebook Web**:宽屏(`lg` ≥1024px)两栏(左题目 / 右画像·计划·分层反馈),窄屏自动堆叠为单栏。不做原生 / 手机 App——见 [DESIGN_NOTES.md](./DESIGN_NOTES.md) 关键决策 0。

两个重点打磨的关键时刻:
1. **诊断**——自适应 + 进度钩子 + 早停逃生舱,在学生失去耐心前拿到画像。
2. **错题 AI 反馈**——分层反馈,体现"何时多说、何时闭嘴"。

设计决策详见 [DESIGN_NOTES.md](./DESIGN_NOTES.md)。

## 结构

```
src/
  App.tsx              step 状态机(onboarding→diagnostic→plan→practice→daily→day7)
  screens/             Onboarding / Diagnostic / Plan / Practice / DailyComplete / Day7
  components/ui.tsx     AppShell / TwoCol / Card / 按钮 / Meter / Pill
  lib/profile.ts        诊断 → 强弱项画像
  data/items.ts         真实 ACT 风格题库 + 分层反馈内容
  types.ts              领域/考点分类与题目类型
```
