# Chart Components Quick Reference

## Import

```tsx
import { ContributionChart, MemberGrowthChart, GroupChart } from '@/components/charts'
```

## ContributionChart

```tsx
<ContributionChart 
  data={[{ date: string, amount: number, cumulative?: number }]}
  title="Optional Title"
  height={300}
  showCumulative={false}
/>
```

## MemberGrowthChart

```tsx
<MemberGrowthChart 
  data={[{ 
    period: string, 
    newMembers: number, 
    totalMembers: number, 
    activeMembers?: number 
  }]}
  title="Optional Title"
  height={300}
  chartType="line" // or "bar"
  showActive={false}
/>
```

## GroupChart

```tsx
<GroupChart 
  data={[{ name: string, value: number, color?: string }]}
  title="Optional Title"
  height={300}
/>
```

## Colors

Charts use CSS variables from `src/styles/index.css`:
- `--chart-primary` (Indigo #6366f1)
- `--chart-secondary` (Violet #8b5cf6)
- `--chart-tertiary` (Pink #ec4899)
- `--chart-quaternary` (Teal #14b8a6)

## Common Patterns

### In a card container
```tsx
<div className="bg-white rounded-lg shadow p-6">
  <ContributionChart data={data} height={300} />
</div>
```

### Grid layout
```tsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <div className="bg-white rounded-lg shadow p-6">
    <ContributionChart data={data1} title="Chart 1" />
  </div>
  <div className="bg-white rounded-lg shadow p-6">
    <MemberGrowthChart data={data2} title="Chart 2" />
  </div>
</div>
```

## Tips

- Always wrap charts in a container with defined height
- Use responsive grid layouts for multiple charts
- Tooltips are automatically themed
- Dark mode is supported via CSS variables
- All charts are responsive by default
