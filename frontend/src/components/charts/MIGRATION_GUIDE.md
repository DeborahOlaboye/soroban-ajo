# Migration Guide: Integrating Chart Components

## Overview

This guide helps you replace placeholder charts in existing components with the new themed chart components.

## Step-by-Step Migration

### 1. GroupAnalytics.tsx

**Current State**: Uses inline Recharts components with placeholder data

**Migration Steps**:

1. Import the new chart components:
```tsx
import { ContributionChart, MemberGrowthChart } from '@/components/charts'
```

2. Replace the inline AreaChart:
```tsx
// BEFORE
<ResponsiveContainer width="100%" height="100%">
  <AreaChart data={trendData}>
    {/* ... lots of configuration ... */}
  </AreaChart>
</ResponsiveContainer>

// AFTER
<ContributionChart 
  data={trendData}
  height={256}
/>
```

3. Replace the inline BarChart:
```tsx
// BEFORE
<ResponsiveContainer width="100%" height="100%">
  <BarChart data={timelineData}>
    {/* ... lots of configuration ... */}
  </BarChart>
</ResponsiveContainer>

// AFTER
<MemberGrowthChart 
  data={timelineData}
  chartType="bar"
  height={256}
/>
```

### 2. MonitoringDashboard.tsx

**If it has placeholder charts**:

1. Import chart components
2. Replace placeholder divs:
```tsx
// BEFORE
<div className="h-64 bg-gray-50 rounded flex items-center justify-center">
  <p className="text-gray-400">Chart placeholder</p>
</div>

// AFTER
<ContributionChart 
  data={performanceData}
  title="Performance Metrics"
  height={256}
/>
```

### 3. GroupDetailPage.tsx

**Add group-specific analytics**:

```tsx
import { ContributionChart, MemberGrowthChart, GroupChart } from '@/components/charts'

// In the component
<div className="mt-6 space-y-6">
  <div className="bg-white rounded-lg shadow p-6">
    <ContributionChart 
      data={groupContributions}
      title="Group Contributions Over Time"
      showCumulative={true}
    />
  </div>
  
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <div className="bg-white rounded-lg shadow p-6">
      <MemberGrowthChart 
        data={memberGrowth}
        title="Member Activity"
        chartType="line"
      />
    </div>
    
    <div className="bg-white rounded-lg shadow p-6">
      <GroupChart 
        data={contributionDistribution}
        title="Contribution Distribution"
      />
    </div>
  </div>
</div>
```

## Data Transformation

### Converting existing data formats

#### For ContributionChart
```tsx
// If you have this format:
const oldData = [
  { name: 'Jan', amount: 4000 },
  { name: 'Feb', amount: 3000 },
]

// Transform to:
const newData = oldData.map(item => ({
  date: item.name,
  amount: item.amount,
}))
```

#### For MemberGrowthChart
```tsx
// If you have this format:
const oldData = [
  { name: 'Week 1', completed: 4, pending: 2 },
  { name: 'Week 2', completed: 3, pending: 4 },
]

// Transform to:
const newData = oldData.map(item => ({
  period: item.name,
  newMembers: item.completed,
  totalMembers: item.completed + item.pending,
}))
```

## Common Issues & Solutions

### Issue: Chart not rendering

**Cause**: Parent container has no height

**Solution**:
```tsx
// Add explicit height to parent
<div className="h-64"> {/* or h-80, h-96, etc. */}
  <ContributionChart data={data} />
</div>

// Or use height prop
<ContributionChart data={data} height={300} />
```

### Issue: Colors look different

**Cause**: CSS variables not loaded

**Solution**: Ensure `src/styles/index.css` is imported in your main app file:
```tsx
// In main.tsx or App.tsx
import './styles/index.css'
```

### Issue: TypeScript errors

**Cause**: Data doesn't match expected interface

**Solution**: Check the interface in the component file or README:
```tsx
// ContributionChart expects:
interface ContributionData {
  date: string
  amount: number
  cumulative?: number
}
```

## Testing After Migration

1. **Visual Check**: Verify charts render correctly
2. **Responsive Check**: Test on different screen sizes
3. **Dark Mode**: Toggle dark mode to verify colors
4. **Interactions**: Hover over charts to test tooltips
5. **Data Updates**: Verify charts update when data changes

## Rollback Plan

If you need to rollback:

1. Keep the old code commented out during migration:
```tsx
// OLD CODE (backup)
// <ResponsiveContainer>...</ResponsiveContainer>

// NEW CODE
<ContributionChart data={data} />
```

2. Revert by uncommenting old code and removing new imports

## Performance Considerations

The new chart components are optimized, but for large datasets:

1. **Limit data points**: Show last 30 days instead of all time
2. **Aggregate data**: Group by week/month instead of day
3. **Lazy load**: Load charts only when visible
4. **Memoize data**: Use `useMemo` for data transformations

```tsx
const chartData = useMemo(() => 
  rawData.map(item => ({
    date: item.date,
    amount: item.amount,
  })),
  [rawData]
)
```

## Best Practices

1. **Consistent Heights**: Use same height for charts in a row
2. **Meaningful Titles**: Always provide descriptive titles
3. **Loading States**: Show skeleton while data loads
4. **Error Handling**: Handle empty or invalid data gracefully
5. **Accessibility**: Ensure charts have proper ARIA labels

## Example: Complete Migration

```tsx
// BEFORE: GroupAnalytics.tsx
import { ResponsiveContainer, AreaChart, Area, ... } from 'recharts'

export const GroupAnalytics: React.FC = () => {
  const trendData = [...]
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-bold mb-4">Contribution Trends</h3>
      <div className="h-64 bg-gray-50 rounded pt-4 pr-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trendData}>
            {/* 50+ lines of configuration */}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// AFTER: GroupAnalytics.tsx
import { ContributionChart } from '@/components/charts'

export const GroupAnalytics: React.FC = () => {
  const trendData = [...]
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <ContributionChart 
        data={trendData}
        title="Contribution Trends"
        height={256}
      />
    </div>
  )
}
```

## Support

For questions or issues during migration:
1. Check [README.md](./README.md) for API reference
2. View [ChartExamples.tsx](./ChartExamples.tsx) for working examples
3. Run Storybook to see interactive demos
4. Review [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) for common patterns
