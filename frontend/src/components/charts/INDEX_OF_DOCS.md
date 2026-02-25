# Chart Components Documentation Index

Welcome to the Chart Components documentation! This index helps you find the right documentation for your needs.

## 📚 Documentation Files

### For Getting Started
- **[SETUP.md](./SETUP.md)** - Installation and quick start guide
- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Cheat sheet for common usage patterns

### For Development
- **[README.md](./README.md)** - Complete API documentation and usage examples
- **[ChartExamples.tsx](./ChartExamples.tsx)** - Live code examples with sample data
- **[Charts.stories.tsx](./Charts.stories.tsx)** - Storybook stories for interactive demos

### For Integration
- **[MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)** - Step-by-step guide to replace existing charts
- **[IMPLEMENTATION.md](./IMPLEMENTATION.md)** - Architecture details and theming system

## 🎯 Quick Navigation

### I want to...

#### ...get started quickly
→ Read [SETUP.md](./SETUP.md) then [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)

#### ...understand the API
→ Read [README.md](./README.md)

#### ...see examples
→ Check [ChartExamples.tsx](./ChartExamples.tsx) or run Storybook

#### ...integrate into existing components
→ Follow [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)

#### ...understand the architecture
→ Read [IMPLEMENTATION.md](./IMPLEMENTATION.md)

#### ...customize colors or theming
→ See "Theming System" section in [IMPLEMENTATION.md](./IMPLEMENTATION.md)

## 📦 Component Files

- **[ContributionChart.tsx](./ContributionChart.tsx)** - Area chart for contributions
- **[MemberGrowthChart.tsx](./MemberGrowthChart.tsx)** - Line/bar chart for member metrics
- **[GroupChart.tsx](./GroupChart.tsx)** - Pie chart for distributions
- **[index.ts](./index.ts)** - Barrel exports

## 🎨 Key Features

- ✅ Themed with Tailwind colors
- ✅ Dark mode support
- ✅ Responsive design
- ✅ Custom tooltips
- ✅ TypeScript support
- ✅ Storybook integration
- ✅ Comprehensive documentation

## 🚀 Quick Start

```tsx
import { ContributionChart } from '@/components/charts'

<ContributionChart 
  data={[{ date: 'Jan', amount: 4000 }]}
  title="Monthly Contributions"
  height={300}
/>
```

## 📖 Reading Order

For new developers:
1. [SETUP.md](./SETUP.md) - Get dependencies installed
2. [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - Learn basic usage
3. [ChartExamples.tsx](./ChartExamples.tsx) - See working examples
4. [README.md](./README.md) - Deep dive into API

For integrating into existing code:
1. [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) - Step-by-step migration
2. [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - Quick syntax lookup
3. [README.md](./README.md) - API reference as needed

## 🔧 Tools

- **Storybook**: `npm run storybook` - Interactive component demos
- **Type Check**: `npm run type-check` - Verify TypeScript
- **Dev Server**: `npm run dev` - Run development server

## 📞 Support

If you can't find what you need:
1. Check the relevant documentation file above
2. View Storybook for visual examples
3. Review ChartExamples.tsx for code patterns
4. Consult Recharts docs: https://recharts.org/
