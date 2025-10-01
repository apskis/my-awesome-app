import { PrismaClient, NoteStatus, Mood, TaskPriority, ProjectStatus } from '../src/generated/prisma'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting comprehensive seed...')

  // Get or create demo user
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      name: 'Demo User',
      emailVerified: new Date(),
    },
  })

  console.log('✅ User ready:', user.email)

  // Create Categories with custom color palette
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name_userId: { name: 'Work', userId: user.id } },
      update: {},
      create: {
        name: 'Work',
        description: 'Work-related notes and tasks',
        color: '#0046FF', // Primary Blue
        userId: user.id,
      },
    }),
    prisma.category.upsert({
      where: { name_userId: { name: 'Personal', userId: user.id } },
      update: {},
      create: {
        name: 'Personal',
        description: 'Personal notes and thoughts',
        color: '#73C8D2', // Accent Cyan
        userId: user.id,
      },
    }),
    prisma.category.upsert({
      where: { name_userId: { name: 'Learning', userId: user.id } },
      update: {},
      create: {
        name: 'Learning',
        description: 'Learning resources and study notes',
        color: '#FF9013', // Accent Orange
        userId: user.id,
      },
    }),
    prisma.category.upsert({
      where: { name_userId: { name: 'Projects', userId: user.id } },
      update: {},
      create: {
        name: 'Projects',
        description: 'Project-related documentation',
        color: '#0046FF',
        userId: user.id,
      },
    }),
    prisma.category.upsert({
      where: { name_userId: { name: 'Ideas', userId: user.id } },
      update: {},
      create: {
        name: 'Ideas',
        description: 'Creative ideas and brainstorming',
        color: '#73C8D2',
        userId: user.id,
      },
    }),
  ])

  console.log('✅ Created categories:', categories.length)

  // Create Tags
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { name: 'important' },
      update: {},
      create: { name: 'important', color: '#FF9013' }, // Orange
    }),
    prisma.tag.upsert({
      where: { name: 'urgent' },
      update: {},
      create: { name: 'urgent', color: '#FF9013' },
    }),
    prisma.tag.upsert({
      where: { name: 'review' },
      update: {},
      create: { name: 'review', color: '#73C8D2' }, // Cyan
    }),
    prisma.tag.upsert({
      where: { name: 'reference' },
      update: {},
      create: { name: 'reference', color: '#0046FF' }, // Blue
    }),
    prisma.tag.upsert({
      where: { name: 'tutorial' },
      update: {},
      create: { name: 'tutorial', color: '#0046FF' },
    }),
    prisma.tag.upsert({
      where: { name: 'meeting-notes' },
      update: {},
      create: { name: 'meeting-notes', color: '#73C8D2' },
    }),
    prisma.tag.upsert({
      where: { name: 'inspiration' },
      update: {},
      create: { name: 'inspiration', color: '#FF9013' },
    }),
    prisma.tag.upsert({
      where: { name: 'design' },
      update: {},
      create: { name: 'design', color: '#73C8D2' },
    }),
  ])

  console.log('✅ Created tags:', tags.length)

  // Create Templates
  await prisma.template.deleteMany({})
  const templates = await prisma.template.createMany({
    data: [
      {
        name: 'Meeting Notes',
        description: 'Template for taking meeting notes',
        category: 'Work',
        content: `# Meeting Notes

**Date:** {{date}}
**Attendees:** 
**Agenda:**

## Discussion Points
1. 
2. 
3. 

## Action Items
- [ ] 
- [ ] 

## Next Meeting
**Date:** 
**Time:**`,
      },
      {
        name: 'Daily Journal',
        description: 'Template for daily journaling',
        category: 'Personal',
        content: `# Daily Journal - {{date}}

## Mood
[Rate 1-5]: 

## Today's Highlights
- 
- 
-

## Gratitude
1. 
2. 
3. 

## Tomorrow's Goals
- 
- `,
      },
      {
        name: 'Project Plan',
        description: 'Template for project planning',
        category: 'Projects',
        content: `# Project: {{project_name}}

## Overview
**Goal:** 
**Timeline:** 
**Status:** Planning

## Milestones
1. [ ] 
2. [ ] 
3. [ ] 

## Resources Needed
- 
- 

## Risks & Challenges
- `,
      },
      {
        name: 'Learning Resource',
        description: 'Template for documenting learning materials',
        category: 'Learning',
        content: `# {{topic}}

## Key Concepts
- 
- 
- 

## Resources
- [Link]()
- [Link]()

## Notes
{{notes}}

## Practice Examples
\`\`\`
{{code}}
\`\`\`

## Next Steps
- [ ] `,
      },
      {
        name: 'Book Notes',
        description: 'Template for book summaries and notes',
        category: 'Learning',
        content: `# Book: {{title}}
**Author:** 
**Status:** Reading

## Key Takeaways
1. 
2. 
3. 

## Favorite Quotes
> 

## My Thoughts
{{thoughts}}

## Application
How I can apply this:
- `,
      },
      {
        name: 'Recipe',
        description: 'Template for saving recipes',
        category: 'Personal',
        content: `# Recipe: {{dish_name}}

**Prep Time:** 
**Cook Time:** 
**Servings:** 

## Ingredients
- 
- 
- 

## Instructions
1. 
2. 
3. 

## Notes
{{notes}}`,
      },
      {
        name: 'Bug Report',
        description: 'Template for documenting bugs',
        category: 'Work',
        content: `# Bug Report

## Description
{{description}}

## Steps to Reproduce
1. 
2. 
3. 

## Expected Behavior
{{expected}}

## Actual Behavior
{{actual}}

## Environment
- Browser: 
- OS: 
- Version: 

## Screenshots
{{screenshots}}`,
      },
      {
        name: 'Idea Brainstorm',
        description: 'Template for brainstorming ideas',
        category: 'Ideas',
        content: `# Idea: {{title}}

## Problem Statement
{{problem}}

## Potential Solution
{{solution}}

## Target Audience
{{audience}}

## Key Features
- 
- 
- 

## Considerations
- Pros: 
- Cons: 

## Next Steps
- [ ] `,
      },
    ],
  })

  console.log('✅ Created templates:', templates.count)

  // Create comprehensive notes
  await prisma.note.deleteMany({ where: { userId: user.id } })
  const notes = await prisma.note.createMany({
    data: [
      {
        title: 'Product Launch Strategy 2025',
        content: `# Product Launch Strategy Q1 2025

## Executive Summary
Our new product line is scheduled for release in Q1 2025. This document outlines the comprehensive launch strategy.

## Target Market
- Primary: Tech-savvy professionals aged 25-45
- Secondary: Small business owners
- Geographic focus: North America, Europe

## Marketing Channels
1. **Social Media**
   - LinkedIn campaign
   - Twitter influencer partnerships
   - Instagram product showcases

2. **Content Marketing**
   - Blog series (pre-launch, launch, post-launch)
   - Video tutorials
   - Case studies

3. **Email Marketing**
   - Drip campaign starting 6 weeks before launch
   - Exclusive early access for subscribers

## Timeline
- Week 1-2: Teaser campaign
- Week 3-4: Feature reveals
- Week 5-6: Early access program
- Week 7: Official launch

## Budget Allocation
- Digital Ads: $50,000
- Content Creation: $30,000
- Influencer Partnerships: $20,000
- Events: $25,000

## Success Metrics
- Target: 10,000 sign-ups in first month
- Conversion rate: 5%
- Customer satisfaction: >4.5/5`,
        status: NoteStatus.PUBLISHED,
        userId: user.id,
        categoryId: categories[0].id,
        createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000), // 21 days ago
        updatedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Weekly Team Meeting - September 2025',
        content: `# Weekly Team Meeting Notes
**Date:** September 26, 2025
**Attendees:** Sarah, Mike, Jessica, Tom

## Agenda Items

### 1. Project Updates
- **Website Redesign** (Tom)
  - 75% complete
  - Landing page finalized
  - Mobile optimization in progress
  
- **Mobile App** (Jessica)
  - Beta testing phase
  - 50 users enrolled
  - Positive feedback on UX
  
- **Marketing Campaign** (Sarah)
  - Email series launched
  - Open rate: 32% (above industry average)
  - Next: Social media push

### 2. Challenges & Blockers
- Need additional design resources
- API integration delayed by 1 week
- Budget approval pending for Q4

### 3. Action Items
- [ ] Tom: Complete mobile optimization by Friday
- [ ] Jessica: Schedule user feedback session
- [ ] Sarah: Prepare Q4 marketing budget proposal
- [ ] Mike: Review and approve design mockups

### 4. Next Meeting
**Date:** October 3, 2025
**Time:** 10:00 AM
**Location:** Conference Room B`,
        status: NoteStatus.PUBLISHED,
        userId: user.id,
        categoryId: categories[0].id,
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
        updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'React Performance Optimization Guide',
        content: `# React Performance Optimization

A comprehensive guide to optimizing React applications for better performance.

## Key Techniques

### 1. Use React.memo for Component Memoization
\`\`\`jsx
const MyComponent = React.memo(({ data }) => {
  return <div>{data}</div>
})
\`\`\`

### 2. useMemo for Expensive Calculations
\`\`\`jsx
const sortedData = useMemo(() => {
  return data.sort((a, b) => a.value - b.value)
}, [data])
\`\`\`

### 3. useCallback for Function References
\`\`\`jsx
const handleClick = useCallback(() => {
  console.log('Clicked')
}, [])
\`\`\`

### 4. Code Splitting with React.lazy
\`\`\`jsx
const LazyComponent = React.lazy(() => import('./LazyComponent'))
\`\`\`

### 5. Virtual Scrolling for Long Lists
Use libraries like react-window or react-virtualized for rendering large lists efficiently.

## Performance Monitoring Tools
- React DevTools Profiler
- Lighthouse
- Web Vitals
- Chrome Performance Tab

## Best Practices
1. Avoid inline function definitions in JSX
2. Use proper key props in lists
3. Implement proper error boundaries
4. Optimize images (WebP, lazy loading)
5. Minimize bundle size
6. Use production builds

## Resources
- [React Docs - Optimizing Performance](https://react.dev/learn/render-and-commit)
- [Web.dev - React Performance](https://web.dev/react)

## Next Steps
- [ ] Implement React.memo in Dashboard components
- [ ] Set up performance monitoring
- [ ] Create performance benchmarks`,
        status: NoteStatus.PUBLISHED,
        userId: user.id,
        categoryId: categories[2].id,
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Personal Goals for 2025',
        content: `# Personal Goals for 2025

## Health & Fitness
- [ ] Exercise 4 times per week
- [ ] Learn yoga or meditation
- [ ] Drink 8 glasses of water daily
- [ ] Cook healthy meals 5 days a week
- [ ] Get 7-8 hours of sleep

## Career & Learning
- [ ] Complete advanced JavaScript course
- [ ] Build 3 side projects
- [ ] Contribute to open source
- [ ] Attend 2 tech conferences
- [ ] Network with 20 new professionals

## Personal Development
- [ ] Read 24 books (2 per month)
- [ ] Learn Spanish (conversational level)
- [ ] Start journaling daily
- [ ] Practice gratitude
- [ ] Develop a morning routine

## Financial
- [ ] Save 20% of income
- [ ] Start investment portfolio
- [ ] Create passive income stream
- [ ] Build emergency fund (6 months)

## Relationships
- [ ] Quality time with family weekly
- [ ] Reconnect with old friends
- [ ] Join a local community group
- [ ] Volunteer monthly

## Travel & Experiences
- [ ] Visit 3 new countries
- [ ] Try 12 new restaurants
- [ ] Learn photography
- [ ] Go on a solo trip

## Review Schedule
- Monthly: Check progress on goals
- Quarterly: Adjust as needed
- End of year: Reflect and plan for next year`,
        status: NoteStatus.DRAFT,
        userId: user.id,
        categoryId: categories[1].id,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'UI/UX Design Principles',
        content: `# UI/UX Design Principles

Essential principles for creating user-friendly interfaces.

## 1. Clarity
- Make interfaces intuitive and easy to understand
- Use clear, concise language
- Provide visual hierarchy

## 2. Consistency
- Maintain consistent design patterns
- Use same terminology throughout
- Keep interaction patterns predictable

## 3. Feedback
- Provide immediate response to user actions
- Use loading states and progress indicators
- Show error messages clearly

## 4. Efficiency
- Minimize clicks needed to complete tasks
- Provide keyboard shortcuts
- Remember user preferences

## 5. Forgiveness
- Allow easy undo/redo
- Confirm destructive actions
- Auto-save user work

## 6. Accessibility
- Support keyboard navigation
- Provide alt text for images
- Ensure sufficient color contrast
- Support screen readers

## Color Psychology
- Blue: Trust, professionalism (#0046FF)
- Cyan: Calm, clarity (#73C8D2)
- Orange: Energy, enthusiasm (#FF9013)
- Cream: Warmth, comfort (#F5F1DC)

## Typography Best Practices
- Hierarchy: H1 > H2 > H3 > Body
- Line height: 1.5-1.8 for body text
- Line length: 50-75 characters optimal
- Font pairing: Max 2-3 fonts

## Whitespace
- Provides breathing room
- Improves readability
- Creates visual hierarchy
- Reduces cognitive load

## Mobile-First Design
1. Start with mobile layout
2. Progressive enhancement
3. Touch-friendly (44x44px minimum)
4. Consider thumb zones

## Resources
- Nielsen Norman Group
- Smashing Magazine
- A List Apart
- UX Collective`,
        status: NoteStatus.PUBLISHED,
        userId: user.id,
        categoryId: categories[2].id,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Weekend Trip Planning - October',
        content: `# Weekend Trip to Mountains

Planning a relaxing weekend getaway!

## Destination
📍 Blue Ridge Mountains, Virginia

## Dates
- **Departure:** Friday, October 15, 2025
- **Return:** Sunday, October 17, 2025

## Accommodation
- Mountain Lodge Resort
- Booked: Cabin #12 with fireplace
- Confirmation: #ABC123456

## Itinerary

### Friday
- Leave home: 2:00 PM
- Arrive: ~6:00 PM
- Dinner at lodge restaurant
- Evening: Relax by fireplace

### Saturday
- Morning hike: Appalachian Trail (5 miles)
- Lunch: Picnic at scenic overlook
- Afternoon: Visit local winery
- Evening: Stargazing

### Sunday
- Breakfast at lodge
- Visit local farmers market
- Scenic drive through Skyline Drive
- Depart: 2:00 PM

## Packing List
- [ ] Hiking boots
- [ ] Warm jacket
- [ ] Camera
- [ ] Binoculars
- [ ] Snacks & water bottles
- [ ] First aid kit
- [ ] Book to read
- [ ] Portable charger

## Things to Remember
- Check weather forecast
- Fill up gas tank
- Download offline maps
- Pack layers (mountain weather changes quickly)

## Budget
- Accommodation: $300
- Food: $150
- Gas: $50
- Activities: $100
**Total:** $600`,
        status: NoteStatus.DRAFT,
        userId: user.id,
        categoryId: categories[1].id,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'API Integration Documentation',
        content: `# API Integration Guide

Documentation for integrating third-party APIs.

## Authentication

### API Key Method
\`\`\`javascript
const headers = {
  'Authorization': 'Bearer YOUR_API_KEY',
  'Content-Type': 'application/json'
}
\`\`\`

### OAuth 2.0 Flow
1. Redirect user to authorization URL
2. Receive authorization code
3. Exchange code for access token
4. Use access token in requests

## Common Endpoints

### GET Request
\`\`\`javascript
async function fetchData() {
  const response = await fetch('https://api.example.com/data', {
    method: 'GET',
    headers: headers
  })
  return response.json()
}
\`\`\`

### POST Request
\`\`\`javascript
async function createData(data) {
  const response = await fetch('https://api.example.com/data', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(data)
  })
  return response.json()
}
\`\`\`

## Error Handling
\`\`\`javascript
try {
  const data = await fetchData()
} catch (error) {
  if (error.status === 401) {
    // Handle unauthorized
  } else if (error.status === 429) {
    // Handle rate limiting
  } else {
    // Handle other errors
  }
}
\`\`\`

## Rate Limiting
- Most APIs: 100 requests/hour
- Implement exponential backoff
- Cache responses when possible

## Best Practices
1. Store API keys in environment variables
2. Implement retry logic
3. Use request timeouts
4. Log API errors
5. Monitor usage quotas

## Testing
- Use Postman or Insomnia
- Create test environment
- Mock API responses for unit tests`,
        status: NoteStatus.PUBLISHED,
        userId: user.id,
        categoryId: categories[3].id,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Book Notes: Atomic Habits',
        content: `# Book: Atomic Habits by James Clear

## Key Concepts

### The Four Laws of Behavior Change
1. **Make it Obvious** - Design your environment
2. **Make it Attractive** - Bundle habits with things you enjoy
3. **Make it Easy** - Reduce friction
4. **Make it Satisfying** - Use rewards

### The 1% Rule
Small improvements compound over time
- 1% better each day = 37x better in a year
- 1% worse each day = decline to nearly zero

### Identity-Based Habits
Focus on who you want to become, not what you want to achieve
- "I'm a runner" vs "I want to run"
- Habits shape identity, identity shapes habits

### The Habit Loop
1. Cue - triggers the habit
2. Craving - motivation
3. Response - the habit itself
4. Reward - satisfies craving

## Favorite Quotes
> "You do not rise to the level of your goals. You fall to the level of your systems."

> "Every action you take is a vote for the type of person you wish to become."

> "The most effective way to change your habits is to focus not on what you want to achieve, but on who you wish to become."

## Practical Applications

### Habit Stacking
Link new habits to existing ones:
- After I pour my morning coffee, I will meditate for 5 minutes
- After I close my laptop, I will do 10 pushups

### Environment Design
- Make good habits obvious (put gym clothes out)
- Make bad habits invisible (hide junk food)

### 2-Minute Rule
Start new habits with a 2-minute version:
- "Read before bed" becomes "Read one page"
- "Do yoga" becomes "Take out my yoga mat"

## Implementation Plan
- [ ] Identify keystone habits
- [ ] Design environment for success
- [ ] Use habit stacking
- [ ] Track daily habits
- [ ] Review weekly progress`,
        status: NoteStatus.PUBLISHED,
        userId: user.id,
        categoryId: categories[2].id,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      },
      {
        title: 'Mobile App Feature Ideas',
        content: `# Mobile App Feature Brainstorm

Collection of ideas for the new mobile app.

## Priority Features (Must Have)

### 1. Offline Mode
- Cache data locally
- Sync when back online
- Show connection status

### 2. Push Notifications
- Task reminders
- Daily summary
- Achievements

### 3. Dark Mode
- Auto-switch based on time
- Manual toggle
- Remember preference

### 4. Quick Capture
- Widget for quick notes
- Voice to text
- Photo notes

## Nice to Have Features

### 5. Collaboration
- Share notes with team
- Real-time collaboration
- Comment threads

### 6. Templates
- Pre-made templates
- Custom templates
- Template gallery

### 7. Search & Filters
- Full-text search
- Filter by tags/categories
- Recent searches

### 8. Widgets
- Today widget
- Task widget
- Quick stats

## Future Considerations

### Analytics
- Usage patterns
- Popular features
- User engagement metrics

### AI Features
- Smart suggestions
- Auto-categorization
- Sentiment analysis

### Integration
- Calendar sync
- Email integration
- Cloud storage (Google Drive, Dropbox)

## Technical Considerations
- React Native vs Native
- State management (Redux/Context)
- Offline storage (SQLite)
- Backend API design
- Push notification service

## Next Steps
- [ ] Validate with user surveys
- [ ] Create wireframes
- [ ] Technical feasibility analysis
- [ ] MVP feature set definition`,
        status: NoteStatus.DRAFT,
        userId: user.id,
        categoryId: categories[4].id,
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
        updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      },
      {
        title: 'Database Optimization Strategies',
        content: `# Database Optimization Guide

## Indexing Strategies

### When to Use Indexes
- Columns used in WHERE clauses
- Foreign key columns
- Columns in ORDER BY
- Frequently joined columns

### Index Types
1. **B-Tree Index** (default, most common)
2. **Hash Index** (equality comparisons)
3. **GiST Index** (geometric data)
4. **GIN Index** (full-text search)

\`\`\`sql
-- Create index
CREATE INDEX idx_users_email ON users(email);

-- Composite index
CREATE INDEX idx_orders_user_date ON orders(user_id, created_at);
\`\`\`

## Query Optimization

### Use EXPLAIN ANALYZE
\`\`\`sql
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';
\`\`\`

### Avoid SELECT *
\`\`\`sql
-- Bad
SELECT * FROM users;

-- Good
SELECT id, name, email FROM users;
\`\`\`

### Use Pagination
\`\`\`sql
SELECT * FROM posts 
ORDER BY created_at DESC 
LIMIT 20 OFFSET 0;
\`\`\`

## Connection Pooling
- Use connection pools (PgBouncer, pgpool-II)
- Set appropriate pool size
- Monitor active connections

## Caching Strategies
1. **Redis** for session data
2. **Memcached** for query results
3. **CDN** for static assets

## Database Maintenance
- Regular VACUUM operations
- Update table statistics
- Monitor slow queries
- Set up replication for read scaling

## Best Practices
1. Normalize data appropriately
2. Use appropriate data types
3. Set proper constraints
4. Monitor database metrics
5. Regular backups

## Tools
- pg_stat_statements (query analysis)
- pgBadger (log analyzer)
- pgAdmin (administration)`,
        status: NoteStatus.PUBLISHED,
        userId: user.id,
        categoryId: categories[0].id,
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      },
      {
        title: 'Recipe: Homemade Pizza',
        content: `# Homemade Pizza Recipe 🍕

## Dough Ingredients
- 500g bread flour
- 325ml warm water
- 7g active dry yeast
- 2 tsp salt
- 2 tbsp olive oil
- 1 tsp sugar

## Sauce Ingredients
- 400g crushed tomatoes
- 2 cloves garlic, minced
- 2 tbsp olive oil
- 1 tsp dried oregano
- 1 tsp dried basil
- Salt and pepper to taste

## Toppings (Your Choice!)
- Fresh mozzarella
- Pepperoni
- Mushrooms
- Bell peppers
- Fresh basil
- Parmesan cheese

## Instructions

### Dough Preparation (2-3 hours ahead)
1. Mix warm water, yeast, and sugar. Let sit 5 minutes
2. Add flour, salt, and olive oil
3. Knead for 10 minutes until smooth
4. Let rise in oiled bowl for 1-2 hours
5. Punch down and divide into 2 balls
6. Let rest 30 minutes

### Sauce (15 minutes)
1. Heat olive oil, sauté garlic
2. Add crushed tomatoes and herbs
3. Simmer 10 minutes
4. Season with salt and pepper

### Assembly & Baking
1. Preheat oven to 475°F (245°C)
2. Stretch dough on floured surface
3. Add sauce, leaving 1-inch border
4. Add toppings
5. Bake 12-15 minutes until crust is golden

## Tips
- Use a pizza stone if available
- Don't overload with toppings
- Brush crust with garlic butter
- Let cool 2-3 minutes before slicing

**Prep Time:** 20 min (+ 2-3 hrs rising)
**Cook Time:** 15 min
**Servings:** 2 large pizzas`,
        status: NoteStatus.PUBLISHED,
        userId: user.id,
        categoryId: categories[1].id,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      },
      {
        title: '[ARCHIVED] Old Project Requirements - 2024',
        content: `# Project Requirements - Client Website 2024

This project has been completed and archived.

## Original Requirements
- Responsive website design
- E-commerce functionality
- Blog section
- Admin dashboard
- Payment integration

## Delivered Features
✅ Mobile-responsive design
✅ Shopping cart system
✅ Blog with CMS
✅ Admin panel
✅ Stripe integration
✅ SEO optimization

## Project Timeline
- Start: January 2024
- Launch: March 2024
- Final Delivery: April 2024

## Team
- Designer: Sarah Johnson
- Developer: Mike Chen
- Project Manager: Tom Wilson

## Lessons Learned
- Early client feedback crucial
- Regular sprint reviews helped
- Testing phase should be longer
- Documentation is important

**Status:** Completed & Archived
**Archive Date:** September 2025`,
        status: NoteStatus.ARCHIVED,
        userId: user.id,
        categoryId: categories[3].id,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        updatedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'TypeScript Best Practices',
        content: `# TypeScript Best Practices

A collection of TypeScript tips and best practices.

## Type Safety

### Use Strict Mode
\`\`\`json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
\`\`\`

### Prefer Interfaces for Objects
\`\`\`typescript
// Good
interface User {
  id: string
  name: string
  email: string
}

// Also good (for unions, intersections)
type Status = 'active' | 'inactive' | 'pending'
\`\`\`

### Use Type Guards
\`\`\`typescript
function isUser(obj: any): obj is User {
  return 'id' in obj && 'email' in obj
}
\`\`\`

## Generic Types

### Function Generics
\`\`\`typescript
function identity<T>(arg: T): T {
  return arg
}
\`\`\`

### Generic Constraints
\`\`\`typescript
interface HasId {
  id: string
}

function getById<T extends HasId>(items: T[], id: string): T | undefined {
  return items.find(item => item.id === id)
}
\`\`\`

## Utility Types

### Partial<T>
Makes all properties optional
\`\`\`typescript
type PartialUser = Partial<User>
\`\`\`

### Pick<T, K>
Select specific properties
\`\`\`typescript
type UserPreview = Pick<User, 'id' | 'name'>
\`\`\`

### Omit<T, K>
Remove specific properties
\`\`\`typescript
type UserWithoutEmail = Omit<User, 'email'>
\`\`\`

### Record<K, T>
Create object type with specific keys
\`\`\`typescript
type UserRoles = Record<string, string[]>
\`\`\`

## Best Practices
1. Enable strict mode
2. Use explicit return types
3. Avoid \`any\` type
4. Use readonly when appropriate
5. Leverage type inference
6. Use enums for constants
7. Document complex types

## Resources
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)`,
        status: NoteStatus.PUBLISHED,
        userId: user.id,
        categoryId: categories[2].id,
        createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 min ago
        updatedAt: new Date(Date.now() - 15 * 60 * 1000),
      },
      {
        title: 'Content Calendar - Q4 2025',
        content: `# Content Calendar - Q4 2025

## October 2025

### Week 1 (Oct 1-7)
- **Mon:** Product announcement
- **Wed:** Tutorial: Getting Started
- **Fri:** Customer success story

### Week 2 (Oct 8-14)
- **Mon:** Feature deep dive
- **Wed:** Industry insights
- **Fri:** Team behind the scenes

### Week 3 (Oct 15-21)
- **Mon:** Case study
- **Wed:** Tips & tricks
- **Fri:** Community spotlight

### Week 4 (Oct 22-28)
- **Mon:** Product update
- **Wed:** How-to guide
- **Fri:** User-generated content

## November 2025

### Week 1 (Oct 29 - Nov 4)
- **Mon:** Monthly recap
- **Wed:** New feature announcement
- **Fri:** Expert interview

### Week 2 (Nov 5-11)
- **Mon:** Tutorial series part 1
- **Wed:** Tutorial series part 2
- **Fri:** Q&A session

### Week 3 (Nov 12-18)
- **Mon:** Industry trends
- **Wed:** Product comparison
- **Fri:** Customer testimonial

### Week 4 (Nov 19-25)
- **Mon:** Thanksgiving special
- **Wed:** Holiday gift guide
- **Fri:** Black Friday promotion

## December 2025

### Week 1 (Nov 26 - Dec 2)
- **Mon:** Cyber Monday deals
- **Wed:** Year in review prep
- **Fri:** Team appreciation

### Week 2 (Dec 3-9)
- **Mon:** Holiday campaign
- **Wed:** Gift ideas
- **Fri:** Customer stories

### Week 3 (Dec 10-16)
- **Mon:** Last-minute shopping
- **Wed:** Holiday hours announcement
- **Fri:** Thank you message

### Week 4 (Dec 17-23)
- **Mon:** Year in review
- **Wed:** Holiday greeting
- **Fri:** New Year preview

## Content Themes
- 📱 Product Features & Updates
- 📚 Educational & How-To
- 👥 Customer Stories & Testimonials
- 🎯 Industry Insights & Trends
- 🎉 Seasonal & Promotional

## Distribution Channels
- Blog
- Email newsletter
- Social media (LinkedIn, Twitter, Instagram)
- YouTube

## Notes
- Prepare content 1 week in advance
- A/B test email subject lines
- Track engagement metrics
- Adjust based on performance`,
        status: NoteStatus.DRAFT,
        userId: user.id,
        categoryId: categories[0].id,
        createdAt: new Date(Date.now() - 15 * 60 * 1000),
        updatedAt: new Date(Date.now() - 5 * 60 * 1000),
      },
    ],
  })

  console.log('✅ Created notes:', notes.count)

  // Create Daily Notes (Journal entries)
  await prisma.dailyNote.deleteMany({ where: { userId: user.id } })
  const dailyNotes = []
  for (let i = 0; i < 7; i++) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    date.setHours(9, 0, 0, 0) // Set to 9 AM

    const moods = [Mood.GREAT, Mood.GOOD, Mood.NEUTRAL, Mood.GOOD, Mood.GREAT, Mood.GOOD, Mood.NEUTRAL]
    const contents = [
      `Great start to the week! Completed the project proposal and got positive feedback from the team. Feeling energized and motivated.`,
      `Productive day at work. Finished two major tasks ahead of schedule. Had a great coffee chat with a colleague about new tech trends.`,
      `Normal Tuesday. Meetings took up most of the day. Made progress on the dashboard redesign. Need to focus more on deep work tomorrow.`,
      `Midweek check-in: On track with goals. Started reading a new book about productivity. Excited about the weekend plans.`,
      `Wrapped up a challenging bug that's been blocking us for days. Team celebration tonight! Feeling accomplished.`,
      `Finally Friday! Delivered the presentation to stakeholders - went really well. Looking forward to some rest and relaxation this weekend.`,
      `Weekend vibes! Spent the morning hiking and the afternoon catching up on personal projects. Perfect balance.`,
    ]

    dailyNotes.push(
      await prisma.dailyNote.create({
        data: {
          date: date,
          mood: moods[i],
          content: contents[i],
          userId: user.id,
        },
      })
    )
  }

  console.log('✅ Created daily notes:', dailyNotes.length)

  // Create Projects
  await prisma.project.deleteMany({ where: { userId: user.id } })
  const projects = await prisma.project.createMany({
    data: [
      {
        name: 'Website Redesign',
        description: 'Complete overhaul of company website with modern design and improved UX',
        status: ProjectStatus.IN_PROGRESS,
        progress: 75,
        userId: user.id,
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      },
      {
        name: 'Mobile App Development',
        description: 'Build native iOS and Android applications',
        status: ProjectStatus.IN_PROGRESS,
        progress: 45,
        userId: user.id,
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      },
      {
        name: 'Marketing Campaign Q4',
        description: 'Comprehensive marketing strategy for Q4 product launch',
        status: ProjectStatus.PLANNING,
        progress: 20,
        userId: user.id,
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      },
      {
        name: 'API Documentation',
        description: 'Create comprehensive API documentation for developers',
        status: ProjectStatus.COMPLETED,
        progress: 100,
        userId: user.id,
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
    ],
  })

  const projectsList = await prisma.project.findMany({ where: { userId: user.id } })
  console.log('✅ Created projects:', projectsList.length)

  // Create Tasks
  await prisma.task.deleteMany({ where: { userId: user.id } })
  const tasks = await prisma.task.createMany({
    data: [
      {
        title: 'Review pull requests',
        completed: false,
        priority: TaskPriority.HIGH,
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
        userId: user.id,
        projectId: projectsList[0]?.id,
      },
      {
        title: 'Update project documentation',
        completed: false,
        priority: TaskPriority.MEDIUM,
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        userId: user.id,
        projectId: projectsList[0]?.id,
      },
      {
        title: 'Prepare weekly status report',
        completed: true,
        priority: TaskPriority.HIGH,
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Yesterday
        userId: user.id,
        projectId: projectsList[0]?.id,
      },
      {
        title: 'Design mobile app wireframes',
        completed: false,
        priority: TaskPriority.HIGH,
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        userId: user.id,
        projectId: projectsList[1]?.id,
      },
      {
        title: 'Test new API endpoints',
        completed: false,
        priority: TaskPriority.MEDIUM,
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        userId: user.id,
        projectId: projectsList[1]?.id,
      },
      {
        title: 'Schedule team meeting',
        completed: true,
        priority: TaskPriority.LOW,
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        userId: user.id,
      },
      {
        title: 'Research competitors',
        completed: false,
        priority: TaskPriority.MEDIUM,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        userId: user.id,
        projectId: projectsList[2]?.id,
      },
      {
        title: 'Create social media content',
        completed: false,
        priority: TaskPriority.HIGH,
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        userId: user.id,
        projectId: projectsList[2]?.id,
      },
      {
        title: 'Review analytics report',
        completed: false,
        priority: TaskPriority.LOW,
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        userId: user.id,
      },
      {
        title: 'Update contact list',
        completed: true,
        priority: TaskPriority.LOW,
        dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        userId: user.id,
      },
      {
        title: 'Backup project files',
        completed: false,
        priority: TaskPriority.MEDIUM,
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        userId: user.id,
      },
      {
        title: 'Plan Q1 roadmap',
        completed: false,
        priority: TaskPriority.HIGH,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        userId: user.id,
      },
    ],
  })

  console.log('✅ Created tasks:', tasks.count)

  // Create Knowledge Articles
  await prisma.knowledgeArticle.deleteMany({ where: { userId: user.id } })
  const knowledgeArticles = await prisma.knowledgeArticle.createMany({
    data: [
      {
        title: 'Git Workflow Best Practices',
        content: `# Git Workflow Best Practices

A comprehensive guide to effective Git workflows.

## Branch Naming Conventions
- \`feature/feature-name\` - New features
- \`bugfix/bug-description\` - Bug fixes
- \`hotfix/critical-fix\` - Production hotfixes
- \`release/version-number\` - Release preparation

## Commit Message Format
\`\`\`
type(scope): subject

body

footer
\`\`\`

### Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code formatting
- **refactor**: Code refactoring
- **test**: Adding tests
- **chore**: Maintenance

### Examples
\`\`\`
feat(auth): add OAuth login

Implement OAuth 2.0 authentication with Google and GitHub providers

Closes #123
\`\`\`

## Branching Strategy

### Gitflow
- **main**: Production code
- **develop**: Integration branch
- **feature branches**: New features
- **release branches**: Release preparation
- **hotfix branches**: Production fixes

### GitHub Flow (Simpler)
- **main**: Production code
- **feature branches**: All changes

## Pull Request Guidelines
1. Keep PRs small and focused
2. Write descriptive titles and descriptions
3. Link related issues
4. Request reviewers
5. Address review comments
6. Squash commits if needed

## Common Commands

### Create and switch to new branch
\`\`\`bash
git checkout -b feature/new-feature
\`\`\`

### Update from main
\`\`\`bash
git checkout main
git pull origin main
git checkout feature/new-feature
git rebase main
\`\`\`

### Interactive rebase
\`\`\`bash
git rebase -i HEAD~3
\`\`\`

### Cherry-pick commits
\`\`\`bash
git cherry-pick <commit-hash>
\`\`\`

## Best Practices
1. Commit early and often
2. Write meaningful commit messages
3. Keep commits atomic (one logical change)
4. Review your own code before pushing
5. Use \`.gitignore\` properly
6. Never commit secrets or credentials
7. Test before pushing

## Resources
- [Git Documentation](https://git-scm.com/doc)
- [Pro Git Book](https://git-scm.com/book/en/v2)
- [Atlassian Git Tutorials](https://www.atlassian.com/git/tutorials)`,
        category: 'Development',
        tags: ['git', 'version-control', 'workflow', 'best-practices'],
        userId: user.id,
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'REST API Design Principles',
        content: `# REST API Design Principles

Guide to designing RESTful APIs.

## HTTP Methods

### GET
- Retrieve resources
- Idempotent and safe
- Cacheable

\`\`\`
GET /api/users
GET /api/users/123
\`\`\`

### POST
- Create new resources
- Not idempotent

\`\`\`
POST /api/users
Body: { "name": "John", "email": "john@example.com" }
\`\`\`

### PUT
- Update entire resource
- Idempotent

\`\`\`
PUT /api/users/123
Body: { "name": "John Updated", "email": "john@example.com" }
\`\`\`

### PATCH
- Partial update
- Not necessarily idempotent

\`\`\`
PATCH /api/users/123
Body: { "name": "John Updated" }
\`\`\`

### DELETE
- Remove resource
- Idempotent

\`\`\`
DELETE /api/users/123
\`\`\`

## URL Structure

### Good Examples
\`\`\`
GET /api/users
GET /api/users/123
GET /api/users/123/posts
POST /api/users/123/posts
\`\`\`

### Avoid
\`\`\`
❌ GET /api/getUsers
❌ POST /api/user/create
❌ GET /api/users/delete/123
\`\`\`

## Response Status Codes

### Success (2xx)
- **200 OK**: Successful GET, PUT, PATCH
- **201 Created**: Successful POST
- **204 No Content**: Successful DELETE

### Client Errors (4xx)
- **400 Bad Request**: Invalid input
- **401 Unauthorized**: Not authenticated
- **403 Forbidden**: Not authorized
- **404 Not Found**: Resource doesn't exist
- **422 Unprocessable Entity**: Validation error

### Server Errors (5xx)
- **500 Internal Server Error**: Server error
- **503 Service Unavailable**: Temporary unavailable

## Response Format

### Success Response
\`\`\`json
{
  "data": {
    "id": "123",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
\`\`\`

### Error Response
\`\`\`json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": [
      {
        "field": "email",
        "message": "Must be a valid email"
      }
    ]
  }
}
\`\`\`

### Pagination
\`\`\`json
{
  "data": [...],
  "meta": {
    "total": 100,
    "page": 1,
    "per_page": 20,
    "total_pages": 5
  },
  "links": {
    "first": "/api/users?page=1",
    "last": "/api/users?page=5",
    "prev": null,
    "next": "/api/users?page=2"
  }
}
\`\`\`

## Versioning

### URL Versioning
\`\`\`
/api/v1/users
/api/v2/users
\`\`\`

### Header Versioning
\`\`\`
Accept: application/vnd.api+json; version=1
\`\`\`

## Security
1. Use HTTPS always
2. Implement authentication (JWT, OAuth)
3. Rate limiting
4. Input validation
5. CORS configuration
6. API keys for third-party access

## Best Practices
1. Use nouns for resources, not verbs
2. Use plural nouns (/users not /user)
3. Use sub-resources for relationships
4. Provide filtering, sorting, pagination
5. Use standard HTTP status codes
6. Version your API
7. Document your API (OpenAPI/Swagger)
8. Handle errors consistently
9. Use caching headers
10. Keep responses consistent

## Tools
- Postman (API testing)
- Swagger/OpenAPI (documentation)
- Insomnia (API client)
- curl (command-line)`,
        category: 'Development',
        tags: ['api', 'rest', 'web-development', 'backend'],
        userId: user.id,
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'CSS Grid Layout Guide',
        content: `# CSS Grid Layout Guide

Modern layout system for web design.

## Grid Container

### Display Grid
\`\`\`css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto;
  gap: 20px;
}
\`\`\`

### Grid Template Columns
\`\`\`css
/* Fixed widths */
grid-template-columns: 200px 200px 200px;

/* Flexible with fractions */
grid-template-columns: 1fr 2fr 1fr;

/* Auto-fit with minmax */
grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));

/* Named grid lines */
grid-template-columns: [start] 1fr [middle] 2fr [end];
\`\`\`

### Grid Template Areas
\`\`\`css
.container {
  grid-template-areas:
    "header header header"
    "sidebar main main"
    "footer footer footer";
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.footer { grid-area: footer; }
\`\`\`

## Grid Items

### Placement
\`\`\`css
.item {
  grid-column: 1 / 3;  /* Start at 1, end at 3 */
  grid-row: 1 / 2;
  
  /* or use span */
  grid-column: span 2;
  grid-row: span 1;
}
\`\`\`

### Alignment
\`\`\`css
/* Align items */
justify-items: start | center | end | stretch;
align-items: start | center | end | stretch;

/* Align content */
justify-content: start | center | end | space-between | space-around;
align-content: start | center | end | space-between | space-around;

/* Align individual item */
.item {
  justify-self: center;
  align-self: center;
}
\`\`\`

## Common Patterns

### Responsive Grid
\`\`\`css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}
\`\`\`

### Holy Grail Layout
\`\`\`css
.container {
  display: grid;
  grid-template-areas:
    "header header header"
    "nav main aside"
    "footer footer footer";
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}
\`\`\`

### Card Grid
\`\`\`css
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-auto-rows: 300px;
  gap: 20px;
}
\`\`\`

### Masonry Layout (with grid-template-rows: masonry)
\`\`\`css
.masonry {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-template-rows: masonry;
  gap: 10px;
}
\`\`\`

## Grid vs Flexbox

### Use Grid When:
- Two-dimensional layouts
- Precise control over rows and columns
- Overlapping elements
- Complex layouts

### Use Flexbox When:
- One-dimensional layouts
- Content-driven sizes
- Simple alignments
- Unknown number of items

## Browser Support
- All modern browsers support Grid
- Use feature queries for fallbacks

\`\`\`css
@supports (display: grid) {
  .container {
    display: grid;
  }
}
\`\`\`

## Tools
- Firefox Grid Inspector
- Chrome DevTools Grid overlay
- CSS Grid Generator
- Grid Garden (learning game)

## Resources
- [CSS Tricks Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [MDN Grid Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)
- [Grid by Example](https://gridbyexample.com/)`,
        category: 'Design',
        tags: ['css', 'layout', 'grid', 'frontend'],
        userId: user.id,
        createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Database Normalization Forms',
        content: `# Database Normalization

Guide to database normalization forms.

## What is Normalization?

Process of organizing data to:
- Minimize redundancy
- Eliminate insertion/update/deletion anomalies
- Ensure data dependencies make sense

## First Normal Form (1NF)

### Rules
1. Each column contains atomic (indivisible) values
2. Each column contains values of a single type
3. Each column has a unique name
4. Order doesn't matter

### Example

#### Not 1NF
| ID | Name | Phone |
|----|------|-------|
| 1  | John | 555-1234, 555-5678 |

#### 1NF
| ID | Name | Phone |
|----|------|-------|
| 1  | John | 555-1234 |
| 1  | John | 555-5678 |

## Second Normal Form (2NF)

### Rules
1. Must be in 1NF
2. All non-key attributes must depend on the entire primary key

### Example

#### Not 2NF
| OrderID | ProductID | ProductName | Quantity |
|---------|-----------|-------------|----------|
| 1       | 101       | Widget      | 5        |

ProductName depends only on ProductID, not the full key (OrderID, ProductID)

#### 2NF
**Orders Table:**
| OrderID | ProductID | Quantity |
|---------|-----------|----------|
| 1       | 101       | 5        |

**Products Table:**
| ProductID | ProductName |
|-----------|-------------|
| 101       | Widget      |

## Third Normal Form (3NF)

### Rules
1. Must be in 2NF
2. No transitive dependencies (non-key attributes depend only on primary key)

### Example

#### Not 3NF
| EmployeeID | DepartmentID | DepartmentName |
|------------|--------------|----------------|
| 1          | 10           | Sales          |

DepartmentName depends on DepartmentID, not EmployeeID

#### 3NF
**Employees Table:**
| EmployeeID | DepartmentID |
|------------|--------------|
| 1          | 10           |

**Departments Table:**
| DepartmentID | DepartmentName |
|--------------|----------------|
| 10           | Sales          |

## Boyce-Codd Normal Form (BCNF)

### Rules
1. Must be in 3NF
2. For every dependency A → B, A must be a super key

Stricter version of 3NF. Most 3NF tables are already in BCNF.

## When to Denormalize

Sometimes denormalization improves performance:

### Scenarios
1. Read-heavy applications
2. Reporting and analytics
3. Frequently joined tables
4. Performance bottlenecks

### Techniques
- Calculated columns
- Summary tables
- Data warehousing
- Caching

## Best Practices

1. **Start normalized**: Begin with 3NF
2. **Measure first**: Profile before denormalizing
3. **Document decisions**: Note why you denormalized
4. **Use views**: For denormalized queries
5. **Consider indexes**: Often better than denormalization

## Tools
- Database design tools (dbdiagram.io, drawSQL)
- ERD (Entity Relationship Diagram) tools
- Database analyzers

## Summary

| Form | Main Rule |
|------|-----------|
| 1NF  | Atomic values |
| 2NF  | No partial dependencies |
| 3NF  | No transitive dependencies |
| BCNF | Every determinant is a candidate key |`,
        category: 'Database',
        tags: ['database', 'normalization', 'data-modeling', 'sql'],
        userId: user.id,
        createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Security Best Practices for Web Apps',
        content: `# Web Application Security Best Practices

Essential security practices for web developers.

## Authentication & Authorization

### Password Security
\`\`\`javascript
// Use bcrypt or argon2 for hashing
const bcrypt = require('bcryptjs')
const hashedPassword = await bcrypt.hash(password, 12)

// Verify password
const isValid = await bcrypt.compare(password, hashedPassword)
\`\`\`

### Password Requirements
- Minimum 8 characters
- Mix of uppercase, lowercase, numbers, symbols
- Check against common password lists
- Implement account lockout after failed attempts
- Use MFA (Multi-Factor Authentication)

### JWT Best Practices
\`\`\`javascript
// Short expiration times
const token = jwt.sign(
  { userId: user.id },
  process.env.JWT_SECRET,
  { expiresIn: '15m' }
)

// Use refresh tokens
const refreshToken = jwt.sign(
  { userId: user.id },
  process.env.REFRESH_SECRET,
  { expiresIn: '7d' }
)
\`\`\`

## Input Validation

### Never Trust User Input
\`\`\`javascript
// Use validation libraries
const { z } = require('zod')

const userSchema = z.object({
  email: z.string().email(),
  age: z.number().min(18).max(120),
  username: z.string().min(3).max(20)
})
\`\`\`

### SQL Injection Prevention
\`\`\`javascript
// ✅ Use parameterized queries
db.query('SELECT * FROM users WHERE id = $1', [userId])

// ❌ NEVER concatenate strings
db.query(\`SELECT * FROM users WHERE id = \${userId}\`) // DANGEROUS!
\`\`\`

### XSS (Cross-Site Scripting) Prevention
\`\`\`javascript
// Sanitize HTML
const DOMPurify = require('dompurify')
const clean = DOMPurify.sanitize(dirty)

// Escape output
const escapeHtml = (unsafe) => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}
\`\`\`

## HTTPS & Security Headers

### Enforce HTTPS
\`\`\`javascript
// Redirect HTTP to HTTPS
app.use((req, res, next) => {
  if (!req.secure) {
    return res.redirect(\`https://\${req.headers.host}\${req.url}\`)
  }
  next()
})
\`\`\`

### Security Headers
\`\`\`javascript
// Use helmet.js
const helmet = require('helmet')
app.use(helmet())

// Or set manually
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-XSS-Protection', '1; mode=block')
  res.setHeader('Strict-Transport-Security', 'max-age=31536000')
  next()
})
\`\`\`

## CSRF Protection

\`\`\`javascript
const csrf = require('csurf')
app.use(csrf({ cookie: true }))

// Include token in forms
<form method="POST">
  <input type="hidden" name="_csrf" value="{{ csrfToken }}">
</form>
\`\`\`

## Rate Limiting

\`\`\`javascript
const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})

app.use('/api/', limiter)
\`\`\`

## CORS Configuration

\`\`\`javascript
const cors = require('cors')

app.use(cors({
  origin: 'https://your-domain.com',
  credentials: true,
  optionsSuccessStatus: 200
}))
\`\`\`

## Environment Variables

\`\`\`javascript
// NEVER commit .env files
// Use .env.example instead

// Access environment variables
const dbPassword = process.env.DB_PASSWORD
\`\`\`

## Dependency Security

### Regular Updates
\`\`\`bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Check outdated packages
npm outdated
\`\`\`

### Use Security Tools
- Snyk
- npm audit
- Dependabot
- OWASP Dependency-Check

## Logging & Monitoring

\`\`\`javascript
// Log security events
logger.warn(\`Failed login attempt for \${email}\`)
logger.error(\`Unauthorized access attempt to \${route}\`)

// Don't log sensitive data
// ❌ logger.info(\`User logged in with password: \${password}\`)
// ✅ logger.info(\`User \${userId} logged in\`)
\`\`\`

## File Upload Security

\`\`\`javascript
const multer = require('multer')

// Restrict file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Invalid file type'), false)
  }
}

// Limit file size
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: fileFilter
})
\`\`\`

## Security Checklist

- [ ] Use HTTPS everywhere
- [ ] Implement proper authentication
- [ ] Validate all inputs
- [ ] Use parameterized queries
- [ ] Set security headers
- [ ] Implement CSRF protection
- [ ] Add rate limiting
- [ ] Configure CORS properly
- [ ] Keep dependencies updated
- [ ] Use environment variables
- [ ] Implement proper logging
- [ ] Regular security audits
- [ ] Error handling without info leakage
- [ ] Secure session management

## Resources
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)`,
        category: 'Security',
        tags: ['security', 'web-development', 'best-practices', 'owasp'],
        userId: user.id,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Docker Quick Reference',
        content: `# Docker Quick Reference

Essential Docker commands and concepts.

## Basic Commands

### Images
\`\`\`bash
# List images
docker images

# Pull an image
docker pull nginx:latest

# Build an image
docker build -t myapp:1.0 .

# Remove an image
docker rmi image_name

# Tag an image
docker tag myapp:1.0 myapp:latest
\`\`\`

### Containers
\`\`\`bash
# Run a container
docker run -d -p 8080:80 --name mycontainer nginx

# List running containers
docker ps

# List all containers
docker ps -a

# Stop a container
docker stop container_name

# Start a container
docker start container_name

# Remove a container
docker rm container_name

# View logs
docker logs container_name

# Execute command in container
docker exec -it container_name bash
\`\`\`

## Dockerfile

### Basic Example
\`\`\`dockerfile
# Use official Node image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Expose port
EXPOSE 3000

# Set user (don't run as root)
USER node

# Start application
CMD ["node", "server.js"]
\`\`\`

### Multi-Stage Build
\`\`\`dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production
USER node
EXPOSE 3000
CMD ["node", "dist/server.js"]
\`\`\`

## Docker Compose

### docker-compose.yml
\`\`\`yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgres://db:5432/myapp
    depends_on:
      - db
    volumes:
      - ./src:/app/src
    networks:
      - app-network

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_PASSWORD=secret
      - POSTGRES_DB=myapp
    volumes:
      - db-data:/var/lib/postgresql/data
    networks:
      - app-network

volumes:
  db-data:

networks:
  app-network:
    driver: bridge
\`\`\`

### Compose Commands
\`\`\`bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Restart a service
docker-compose restart web

# Run command in service
docker-compose exec web bash

# Scale service
docker-compose up -d --scale web=3
\`\`\`

## Volumes

\`\`\`bash
# Create volume
docker volume create mydata

# List volumes
docker volume ls

# Inspect volume
docker volume inspect mydata

# Remove volume
docker volume rm mydata

# Mount volume
docker run -v mydata:/app/data myapp
\`\`\`

## Networks

\`\`\`bash
# Create network
docker network create mynetwork

# List networks
docker network ls

# Inspect network
docker network inspect mynetwork

# Connect container to network
docker network connect mynetwork container_name

# Remove network
docker network rm mynetwork
\`\`\`

## Best Practices

### Image Optimization
1. Use official base images
2. Use specific version tags
3. Minimize layers
4. Use multi-stage builds
5. Don't install unnecessary packages
6. Use .dockerignore file
7. Run as non-root user

### .dockerignore Example
\`\`\`
node_modules
npm-debug.log
.env
.git
.gitignore
README.md
.dockerignore
Dockerfile
docker-compose.yml
\`\`\`

### Security
1. Don't run as root
2. Scan images for vulnerabilities
3. Use secrets management
4. Keep images updated
5. Limit container resources

## Health Checks

\`\`\`dockerfile
HEALTHCHECK --interval=30s --timeout=3s \\
  CMD curl -f http://localhost:3000/health || exit 1
\`\`\`

## Resource Limits

\`\`\`bash
# Limit memory and CPU
docker run -m 512m --cpus="1.5" myapp
\`\`\`

## Cleanup

\`\`\`bash
# Remove unused containers
docker container prune

# Remove unused images
docker image prune

# Remove unused volumes
docker volume prune

# Remove everything unused
docker system prune -a --volumes
\`\`\`

## Debugging

\`\`\`bash
# View container processes
docker top container_name

# View resource usage
docker stats

# Inspect container
docker inspect container_name

# Copy files from container
docker cp container_name:/app/file.txt ./
\`\`\`

## Registry Operations

\`\`\`bash
# Login to registry
docker login registry.example.com

# Push image
docker push myapp:1.0

# Pull image
docker pull myapp:1.0

# Tag for registry
docker tag myapp:1.0 registry.example.com/myapp:1.0
\`\`\`

## Useful Links
- [Docker Documentation](https://docs.docker.com/)
- [Docker Hub](https://hub.docker.com/)
- [Play with Docker](https://labs.play-with-docker.com/)`,
        category: 'DevOps',
        tags: ['docker', 'containers', 'devops', 'deployment'],
        userId: user.id,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
    ],
  })

  console.log('✅ Created knowledge articles:', knowledgeArticles.count)

  console.log('\n🎉 Comprehensive seed completed successfully!')
  console.log(`\nCreated:
  - 1 user
  - ${categories.length} categories
  - ${tags.length} tags
  - ${templates.count} templates
  - ${notes.count} notes
  - ${dailyNotes.length} daily journal entries
  - ${projectsList.length} projects
  - ${tasks.count} tasks
  - ${knowledgeArticles.count} knowledge articles
  `)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })


