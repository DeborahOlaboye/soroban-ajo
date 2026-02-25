# Chart Components Setup Guide

## Installation Status

✓ Recharts is already listed in `package.json` (v2.10.0)

If dependencies are not installed, run:

```bash
cd frontend
npm install --legacy-peer-deps
```

Note: The `--legacy-peer-deps` flag is needed due to Storybook version conflicts in the project.

## Quick Start

### 1. Import the components

```tsx
import { 
  ContributionChart, 
  MemberGrowthChart, 
  GroupChart 
} from '@/components/charts'
```

### 2. Prepare your data

```tsx
// For ContributionChart
const contributionData = [
  { date: 'Jan', amount: 4000, cumulative: 4000 },
  { date: 'Feb', amount: 3000, cumulative: 7000 },
]

// For MemberGrowthChart
const memberData = [
  { period: 'Week 1', newMembers: 5, totalMembers: 15, activeMembers: 12 },
  { period: 'Week 2', newMembers: 3, totalMembers: 18, activeMembers: 15 },
]

// For GroupChart
const groupData = [
  { name: 'Active Groups', value: 12 },
  { name: 'Pending Groups', value: 5 },
]
```

### 3. Use the components

```tsx
<div className="bg-white rounded-lg shadow p-6">
  <ContributionChart 
    data={contributionData}
    title="Monthly Contributions"
    height={300}
  />
</div>
```

## Verification

To verify the setup is working:

1. Run Storybook:
   ```bash
   npm run storybook
   ```

2. Navigate to the Charts section to see all chart variations

3. Or import `ChartExamples` component in your app:
   ```tsx
   import { ChartExamples } from '@/components/charts/ChartExamples'
   
   // In your route or page
   <ChartExamples />
   ```

## Troubleshooting

### Issue: Charts not rendering

**Solution**: Ensure the parent container has a defined height:
```tsx
<div className="h-64"> {/* or height={300} */}
  <ContributionChart data={data} />
</div>
```

### Issue: Colors not showing correctly

**Solution**: Verify CSS variables are defined in `src/styles/index.css`:
```css
:root {
  --chart-primary: #6366f1;
  --chart-secondary: #8b5cf6;
  /* ... other variables */
}
```

### Issue: TypeScript errors

**Solution**: Run type checking:
```bash
npm run type-check
```

If errors persist, ensure all dependencies are installed:
```bash
npm install --legacy-peer-deps
```

## Integration Examples

### Replace existing placeholder charts

**Before:**
```tsx
<div className="h-64 bg-gray-50 rounded flex items-center justify-center">
  <p className="text-gray-400">Chart placeholder</p>
</div>
```

**After:**
```tsx
<ContributionChart 
  data={contributionData}
  height={256}
/>
```

### Add to GroupAnalytics component

```tsx
import { ContributionChart, MemberGrowthChart } from '@/components/charts'

export const GroupAnalytics: React.FC = () => {
  // ... fetch or prepare data
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <ContributionChart 
          data={trendData}
          title="Contribution Trends"
          height={300}
        />
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <MemberGrowthChart 
          data={memberData}
          title="Member Growth"
          chartType="bar"
        />
      </div>
    </div>
  )
}
```

## Next Steps

1. Review the [README.md](./README.md) for detailed API documentation
2. Check [IMPLEMENTATION.md](./IMPLEMENTATION.md) for architecture details
3. View [ChartExamples.tsx](./ChartExamples.tsx) for complete usage examples
4. Run Storybook to see interactive demos
5. Integrate charts into your dashboard components

## Support

For issues or questions:
- Check the README.md for API reference
- View Storybook stories for visual examples
- Refer to Recharts docs: https://recharts.org/
