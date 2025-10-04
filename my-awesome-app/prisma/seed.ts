import { PrismaClient } from '../src/generated/prisma'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting comprehensive seed...')

  try {
    // Clear all existing data first
    console.log('🧹 Clearing existing data...')
    await prisma.noteTag.deleteMany()
    await prisma.note.deleteMany()
    await prisma.category.deleteMany()
    await prisma.tag.deleteMany()
    await prisma.dailyNote.deleteMany()
    await prisma.task.deleteMany()
    await prisma.project.deleteMany()
    await prisma.template.deleteMany()
    await prisma.knowledgeArticle.deleteMany()
    await prisma.user.deleteMany()
    console.log('✅ Cleared all existing data')

    // Create a demo user
    console.log('👤 Creating demo user...')
    const user = await prisma.user.create({
      data: {
        email: 'demo@myawesomeapp.com',
      name: 'Demo User',
      emailVerified: new Date(),
    },
  })
  console.log('✅ Created user:', user.email)

    // Create 5 Categories with custom colors
    console.log('📁 Creating categories...')
  const categories = await Promise.all([
      prisma.category.create({
        data: {
          name: 'Work', 
          
          color: '#0046FF', // primary-blue
        userId: user.id,
      },
    }),
      prisma.category.create({
        data: {
          name: 'Personal', 
          
          color: '#73C8D2', // accent-cyan
          userId: user.id,
        },
      }),
      prisma.category.create({
        data: {
          name: 'Ideas',
          
          color: '#FF9013', // warning-orange
        userId: user.id,
      },
    }),
      prisma.category.create({
        data: {
          name: 'Learning', 
          
          color: '#10B981', // green
          userId: user.id,
        },
      }),
      prisma.category.create({
        data: {
          name: 'Projects',
          
          color: '#8B5CF6', // purple
        userId: user.id,
      },
    }),
  ])
  console.log('✅ Created categories:', categories.map(c => c.name))

    // Create 8 Tags with custom colors
    console.log('🏷️ Creating tags...')
  const tags = await Promise.all([
      prisma.tag.create({
        data: {
          name: 'Important',
          color: '#EF4444', // red
      },
    }),
      prisma.tag.create({
        data: {
          name: 'Urgent',
          color: '#F59E0B', // amber
      },
    }),
      prisma.tag.create({
        data: {
          name: 'Reference',
          color: '#6B7280', // gray
      },
    }),
      prisma.tag.create({
        data: {
          name: 'Tutorial',
          color: '#3B82F6', // blue
        },
      }),
      prisma.tag.create({
        data: {
          name: 'Meeting',
          color: '#EC4899', // pink
        },
      }),
      prisma.tag.create({
        data: {
          name: 'Quick Win',
          color: '#10B981', // green
        },
      }),
      prisma.tag.create({
        data: {
          name: 'Long-term',
          color: '#8B5CF6', // purple
        },
      }),
      prisma.tag.create({
        data: {
          name: 'Review',
          color: '#06B6D4', // cyan
      },
    }),
  ])
  console.log('✅ Created tags:', tags.map(t => t.name))

    // Create 15 Notes with realistic content
    console.log('📝 Creating notes...')
  const notes = await Promise.all([
    prisma.note.create({
      data: {
          title: 'Project Meeting Notes - January 2025',
          content: `Today's project meeting covered several key topics that will shape our Q1 deliverables. The team discussed the new feature roadmap and identified potential challenges ahead.

Key decisions made:
- Prioritize mobile responsiveness improvements
- Implement new authentication system by end of February
- Schedule weekly design reviews starting next Monday

Action items for next week:
- Complete user research interviews
- Finalize technical architecture documentation
- Prepare demo environment for stakeholder review

The team is energized about the upcoming challenges and confident in our ability to deliver on time.`,
        status: 'PUBLISHED',
          userId: user.id,
          categoryId: categories[0].id, // Work
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        },
      }),
      prisma.note.create({
        data: {
          title: 'Q1 Goals and Objectives',
          content: `Setting clear goals for the first quarter of 2025 to ensure focused progress and measurable outcomes.

Primary Objectives:
1. Launch the redesigned user dashboard
2. Improve application performance by 40%
3. Implement comprehensive testing suite
4. Enhance user onboarding experience

Success Metrics:
- User engagement increase of 25%
- Reduced support tickets by 30%
- 95% uptime achievement
- Positive user feedback score above 4.5/5

These goals align with our company's strategic vision and will position us for strong growth in the coming months.`,
          status: 'PUBLISHED',
          userId: user.id,
          categoryId: categories[0].id, // Work
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        },
      }),
      prisma.note.create({
        data: {
          title: 'Tech Stack Research',
          content: `Researching modern web development technologies to enhance our application's capabilities and developer experience.

Frontend Considerations:
- Next.js 15 for improved performance and SEO
- Tailwind CSS for rapid UI development
- TypeScript for better code quality
- React Query for efficient data fetching

Backend Evaluation:
- Node.js with Express for API development
- PostgreSQL for robust data management
- Redis for caching and session management
- Docker for containerization

The research indicates that our current stack is solid, but we should consider upgrading to the latest versions for better performance and security features.`,
          status: 'DRAFT',
          userId: user.id,
          categoryId: categories[3].id, // Learning
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        },
      }),
      prisma.note.create({
        data: {
          title: 'Weekend Reading List',
          content: `Curated list of articles and books to read during the weekend for personal and professional development.

Technical Articles:
- "Building Scalable React Applications" by Dan Abramov
- "Database Design Best Practices" on Medium
- "API Security Fundamentals" on Dev.to

Personal Development:
- "Atomic Habits" by James Clear (Chapter 3-4)
- "The Lean Startup" methodology review
- "Design Thinking" principles

Fiction for Relaxation:
- "The Martian" by Andy Weir
- Short stories from "The New Yorker"

This balanced approach ensures both learning and relaxation during downtime.`,
          status: 'DRAFT',
        userId: user.id,
        categoryId: categories[1].id, // Personal
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      },
    }),
    prisma.note.create({
      data: {
          title: 'Creative App Ideas',
          content: `Brainstorming innovative application concepts that could solve real-world problems and create value for users.

Idea 1: Smart Habit Tracker
- AI-powered habit formation recommendations
- Social accountability features
- Integration with health apps
- Gamification elements

Idea 2: Local Community Marketplace
- Hyperlocal buying and selling platform
- Trust and safety features
- Mobile-first design
- Sustainable commerce focus

Idea 3: Learning Path Generator
- Personalized skill development roadmaps
- Industry expert mentorship
- Project-based learning
- Career transition support

These ideas address current market gaps and leverage emerging technologies effectively.`,
          status: 'DRAFT',
          userId: user.id,
          categoryId: categories[2].id, // Ideas
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        },
      }),
      prisma.note.create({
        data: {
          title: 'Database Migration Strategy',
          content: `Planning the migration from our current database system to a more scalable solution that can handle increased user load.

Current Challenges:
- Performance bottlenecks during peak hours
- Limited horizontal scaling capabilities
- Complex query optimization issues
- Backup and recovery limitations

Migration Approach:
1. Phase 1: Set up new database infrastructure
2. Phase 2: Implement data synchronization
3. Phase 3: Gradual traffic migration
4. Phase 4: Complete cutover and cleanup

Risk Mitigation:
- Comprehensive testing environment
- Rollback procedures
- Monitoring and alerting
- Team training and documentation

This migration is critical for supporting our growth plans and improving user experience.`,
          status: 'PUBLISHED',
          userId: user.id,
          categoryId: categories[4].id, // Projects
          createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
        },
      }),
      prisma.note.create({
        data: {
          title: 'Team Building Activities',
          content: `Ideas for improving team collaboration and building stronger relationships within our development team.

Monthly Activities:
- Code review sessions with learning focus
- Technical presentation days
- Pair programming workshops
- Architecture discussion forums

Quarterly Events:
- Team hackathons with prizes
- External conference attendance
- Skill sharing workshops
- Team retreat planning

Benefits Expected:
- Improved communication
- Knowledge sharing
- Innovation through collaboration
- Higher job satisfaction

These activities will strengthen our team dynamics and improve overall productivity.`,
        status: 'PUBLISHED',
        userId: user.id,
        categoryId: categories[0].id, // Work
          createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
      },
    }),
    prisma.note.create({
      data: {
          title: 'Personal Finance Tracking',
          content: `Setting up a comprehensive system for tracking personal finances and building better money management habits.

Categories to Track:
- Monthly income and expenses
- Investment portfolio performance
- Emergency fund progress
- Debt reduction milestones

Tools and Methods:
- Spreadsheet for detailed tracking
- Mobile app for daily expense logging
- Monthly budget reviews
- Annual financial goal setting

Goals for 2025:
- Increase emergency fund to 6 months expenses
- Maximize retirement contributions
- Pay off credit card debt
- Start investment portfolio

Consistent tracking will help achieve these financial objectives.`,
        status: 'DRAFT',
        userId: user.id,
          categoryId: categories[1].id, // Personal
          createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
      },
    }),
    prisma.note.create({
      data: {
          title: 'Machine Learning Basics',
          content: `Learning notes on fundamental machine learning concepts and their practical applications in web development.

Core Concepts:
- Supervised vs unsupervised learning
- Training and testing data sets
- Overfitting and underfitting
- Cross-validation techniques

Popular Algorithms:
- Linear regression for predictions
- Decision trees for classification
- Neural networks for complex patterns
- Clustering for data organization

Web Development Applications:
- Recommendation systems
- Content personalization
- Fraud detection
- Image recognition

Understanding these concepts will help in making informed decisions about ML integration in future projects.`,
          status: 'DRAFT',
          userId: user.id,
          categoryId: categories[3].id, // Learning
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        },
      }),
      prisma.note.create({
        data: {
          title: 'Product Launch Checklist',
          content: `Comprehensive checklist for launching new product features to ensure nothing is overlooked in the process.

Pre-Launch (2 weeks before):
- Complete feature development
- Comprehensive testing
- Documentation updates
- Team training sessions

Launch Week:
- Deploy to staging environment
- Final user acceptance testing
- Marketing material preparation
- Support team briefing

Post-Launch (1 week after):
- Monitor system performance
- Collect user feedback
- Address any issues quickly
- Plan next iteration

This systematic approach ensures smooth product launches and minimizes risks.`,
          status: 'PUBLISHED',
          userId: user.id,
          categoryId: categories[4].id, // Projects
          createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), // 12 days ago
        },
      }),
      prisma.note.create({
        data: {
          title: 'Health and Wellness Goals',
          content: `Personal health and wellness objectives for maintaining work-life balance and overall well-being.

Physical Health:
- Exercise 4 times per week
- Maintain healthy sleep schedule
- Balanced nutrition plan
- Regular health checkups

Mental Health:
- Daily meditation practice
- Stress management techniques
- Work-life boundary setting
- Hobby time allocation

Professional Development:
- Continuous learning
- Skill building
- Networking opportunities
- Career advancement planning

These goals will support both personal happiness and professional success.`,
        status: 'DRAFT',
        userId: user.id,
        categoryId: categories[1].id, // Personal
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
      },
    }),
    prisma.note.create({
      data: {
          title: 'API Documentation Standards',
          content: `Establishing consistent API documentation practices to improve developer experience and reduce integration time.

Documentation Requirements:
- Clear endpoint descriptions
- Request/response examples
- Error code explanations
- Authentication details

Tools and Format:
- OpenAPI/Swagger specifications
- Interactive documentation
- Code samples in multiple languages
- Version control integration

Best Practices:
- Keep documentation current
- Include rate limiting info
- Provide SDK examples
- Regular review cycles

Good documentation is essential for API adoption and developer satisfaction.`,
          status: 'PUBLISHED',
          userId: user.id,
          categoryId: categories[0].id, // Work
          createdAt: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000), // 16 days ago
        },
      }),
      prisma.note.create({
        data: {
          title: 'Innovation Workshop Ideas',
          content: `Creative workshop concepts to foster innovation and creative thinking within the team.

Workshop Formats:
- Design thinking sessions
- Rapid prototyping challenges
- User journey mapping
- Problem-solving exercises

Activities:
- Brainstorming with constraints
- Role-playing user scenarios
- Technology exploration
- Cross-functional collaboration

Expected Outcomes:
- Fresh perspectives on problems
- Innovative solution approaches
- Team bonding opportunities
- Skill development

Regular innovation workshops will keep the team creative and engaged.`,
          status: 'DRAFT',
          userId: user.id,
          categoryId: categories[2].id, // Ideas
          createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000), // 18 days ago
        },
      }),
      prisma.note.create({
        data: {
          title: 'Archived: Old Meeting Notes',
          content: `This note contains meeting notes from previous quarters that are no longer relevant for current operations.

Historical Context:
- Q3 2024 planning sessions
- Legacy system discussions
- Old feature requirements
- Previous team structure

Why Archived:
- Information is outdated
- Decisions have been superseded
- Team members have changed
- Technology stack evolved

These notes are kept for historical reference but are not actively used in current planning or decision-making processes.`,
        status: 'ARCHIVED',
        userId: user.id,
        categoryId: categories[0].id, // Work
          createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), // 25 days ago
      },
    }),
      prisma.note.create({
        data: {
          title: 'Archived: Deprecated Features',
          content: `Documentation of features that have been deprecated and removed from the application.

Deprecated Features:
- Legacy authentication system
- Old dashboard layout
- Outdated API endpoints
- Removed integrations

Replacement Solutions:
- New OAuth implementation
- Modern responsive design
- RESTful API structure
- Current third-party services

This archive serves as a reference for understanding the evolution of our application and the reasoning behind architectural decisions.`,
          status: 'ARCHIVED',
          userId: user.id,
          categoryId: categories[4].id, // Projects
          createdAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000), // 28 days ago
        },
      }),
    ])
    console.log('✅ Created notes:', notes.length)

    // Create NoteTag relationships (60% of notes linked to categories, each note linked to 1-3 tags)
    console.log('🔗 Creating note-tag relationships...')
  const noteTagRelations = await Promise.all([
      // Note 1: Project Meeting Notes - Meeting, Important
      prisma.noteTag.create({ data: { noteId: notes[0].id, tagId: tags[4].id } }), // Meeting
      prisma.noteTag.create({ data: { noteId: notes[0].id, tagId: tags[0].id } }), // Important
      
      // Note 2: Q1 Goals - Important, Long-term
      prisma.noteTag.create({ data: { noteId: notes[1].id, tagId: tags[0].id } }), // Important
      prisma.noteTag.create({ data: { noteId: notes[1].id, tagId: tags[6].id } }), // Long-term
      
      // Note 3: Tech Stack Research - Tutorial, Reference
      prisma.noteTag.create({ data: { noteId: notes[2].id, tagId: tags[3].id } }), // Tutorial
      prisma.noteTag.create({ data: { noteId: notes[2].id, tagId: tags[2].id } }), // Reference
      
      // Note 4: Weekend Reading List - Reference
      prisma.noteTag.create({ data: { noteId: notes[3].id, tagId: tags[2].id } }), // Reference
      
      // Note 5: Creative App Ideas - Long-term, Review
      prisma.noteTag.create({ data: { noteId: notes[4].id, tagId: tags[6].id } }), // Long-term
      prisma.noteTag.create({ data: { noteId: notes[4].id, tagId: tags[7].id } }), // Review
      
      // Note 6: Database Migration - Important, Urgent
      prisma.noteTag.create({ data: { noteId: notes[5].id, tagId: tags[0].id } }), // Important
      prisma.noteTag.create({ data: { noteId: notes[5].id, tagId: tags[1].id } }), // Urgent
      
      // Note 7: Team Building - Quick Win
      prisma.noteTag.create({ data: { noteId: notes[6].id, tagId: tags[5].id } }), // Quick Win
      
      // Note 8: Personal Finance - Important, Long-term
      prisma.noteTag.create({ data: { noteId: notes[7].id, tagId: tags[0].id } }), // Important
      prisma.noteTag.create({ data: { noteId: notes[7].id, tagId: tags[6].id } }), // Long-term
      
      // Note 9: Machine Learning - Tutorial, Reference
      prisma.noteTag.create({ data: { noteId: notes[8].id, tagId: tags[3].id } }), // Tutorial
      prisma.noteTag.create({ data: { noteId: notes[8].id, tagId: tags[2].id } }), // Reference
      
      // Note 10: Product Launch - Important, Urgent
      prisma.noteTag.create({ data: { noteId: notes[9].id, tagId: tags[0].id } }), // Important
      prisma.noteTag.create({ data: { noteId: notes[9].id, tagId: tags[1].id } }), // Urgent
      
      // Note 11: Health Goals - Long-term
      prisma.noteTag.create({ data: { noteId: notes[10].id, tagId: tags[6].id } }), // Long-term
      
      // Note 12: API Documentation - Reference, Tutorial
      prisma.noteTag.create({ data: { noteId: notes[11].id, tagId: tags[2].id } }), // Reference
      prisma.noteTag.create({ data: { noteId: notes[11].id, tagId: tags[3].id } }), // Tutorial
      
      // Note 13: Innovation Workshop - Review
      prisma.noteTag.create({ data: { noteId: notes[12].id, tagId: tags[7].id } }), // Review
    ])
    console.log('✅ Created note-tag relationships:', noteTagRelations.length)

    // Create 8 Templates with structured content
    console.log('📋 Creating templates...')
    const templates = await Promise.all([
      prisma.template.create({
      data: {
          name: 'Meeting Notes',
          
          content: `# Meeting Notes

**Date:** [Date]
**Time:** [Start Time] - [End Time]
**Attendees:** [List of participants]
**Meeting Type:** [Standup/Planning/Review/etc.]

## Agenda
- [ ] Item 1
- [ ] Item 2
- [ ] Item 3

## Discussion Points
### Topic 1
- Key points discussed
- Decisions made
- Concerns raised

### Topic 2
- Key points discussed
- Decisions made
- Concerns raised

## Action Items
| Task | Owner | Due Date | Status |
|------|-------|----------|--------|
| [Task 1] | [Name] | [Date] | [ ] |
| [Task 2] | [Name] | [Date] | [ ] |

## Next Steps
- [ ] Follow-up action 1
- [ ] Follow-up action 2

## Notes
[Additional notes and observations]`,
          category: 'Work',
      },
    }),
      prisma.template.create({
      data: {
          name: 'Daily Standup',
          
          content: `# Daily Standup - [Date]

## Team Updates

### [Your Name]
**Yesterday:**
- [What you completed]

**Today:**
- [What you plan to work on]

**Blockers:**
- [Any impediments or help needed]

---

### [Team Member 2]
**Yesterday:**
- [What they completed]

**Today:**
- [What they plan to work on]

**Blockers:**
- [Any impediments or help needed]

---

## Team Metrics
- **Sprint Progress:** [X]% complete
- **Burndown:** [Status]
- **Blockers:** [Count] active

## Action Items
- [ ] [Action item 1]
- [ ] [Action item 2]`,
          category: 'Work',
      },
    }),
      prisma.template.create({
      data: {
          name: 'Project Plan',
          
          content: `# Project Plan: [Project Name]

## Project Overview
**Objective:** [What we're trying to achieve]
**Success Criteria:** [How we measure success]
**Timeline:** [Start Date] - [End Date]
**Budget:** [If applicable]

## Stakeholders
- **Project Manager:** [Name]
- **Technical Lead:** [Name]
- **Product Owner:** [Name]
- **Key Users:** [Names/Roles]

## Scope
### In Scope
- [Feature/Requirement 1]
- [Feature/Requirement 2]
- [Feature/Requirement 3]

### Out of Scope
- [What we're NOT doing]
- [Future considerations]

## Timeline & Milestones
| Milestone | Date | Deliverables |
|-----------|------|--------------|
| [Milestone 1] | [Date] | [Deliverable] |
| [Milestone 2] | [Date] | [Deliverable] |
| [Milestone 3] | [Date] | [Deliverable] |

## Resources
- **Team Members:** [List]
- **Tools & Technologies:** [List]
- **External Dependencies:** [List]

## Risks & Mitigation
| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| [Risk 1] | [High/Med/Low] | [High/Med/Low] | [Strategy] |

## Communication Plan
- **Status Updates:** [Frequency and format]
- **Stakeholder Reviews:** [Schedule]
- **Escalation Process:** [Who to contact when]`,
          category: 'Projects',
      },
    }),
      prisma.template.create({
      data: {
          name: 'Bug Report',
          
          content: `# Bug Report

## Bug Information
**Title:** [Brief description of the bug]
**Severity:** [Critical/High/Medium/Low]
**Priority:** [P1/P2/P3/P4]
**Reported By:** [Name]
**Date Reported:** [Date]
**Environment:** [Production/Staging/Development]

## Description
[Detailed description of what the bug is]

## Steps to Reproduce
1. [Step 1]
2. [Step 2]
3. [Step 3]
4. [Step 4]

## Expected Behavior
[What should happen]

## Actual Behavior
[What actually happens]

## Screenshots/Evidence
[Attach screenshots, logs, or other evidence]

## Additional Information
- **Browser/Device:** [If applicable]
- **User Role:** [If applicable]
- **Related Features:** [If applicable]

## Resolution
**Assigned To:** [Developer name]
**Status:** [Open/In Progress/Resolved/Closed]
**Resolution Date:** [Date]
**Fix Description:** [How it was fixed]
**Testing Notes:** [Verification steps]`,
          category: 'Work',
      },
    }),
      prisma.template.create({
      data: {
          name: 'Weekly Review',
          
          content: `# Weekly Review - Week of [Date]

## This Week's Accomplishments
- [ ] [Major accomplishment 1]
- [ ] [Major accomplishment 2]
- [ ] [Major accomplishment 3]

## Key Metrics
- **Tasks Completed:** [Number]
- **Goals Progress:** [Percentage]
- **Time Allocation:** [Breakdown]

## Challenges & Obstacles
### What went wrong?
- [Challenge 1 and how it was handled]
- [Challenge 2 and how it was handled]

### What could be improved?
- [Area for improvement 1]
- [Area for improvement 2]

## Learning & Growth
- **New Skills:** [What you learned]
- **Books/Articles:** [What you read]
- **Feedback Received:** [Key feedback points]

## Next Week's Focus
### Top 3 Priorities
1. [Priority 1]
2. [Priority 2]
3. [Priority 3]

### Goals
- [ ] [Goal 1]
- [ ] [Goal 2]
- [ ] [Goal 3]

## Gratitude & Wins
- [Something you're grateful for]
- [A win or positive moment]
- [Recognition received]

## Action Items for Next Week
- [ ] [Action item 1]
- [ ] [Action item 2]
- [ ] [Action item 3]`,
          category: 'Personal',
      },
    }),
      prisma.template.create({
      data: {
          name: 'Brainstorming',
          
          content: `# Brainstorming Session

**Topic:** [What we're brainstorming about]
**Date:** [Date]
**Participants:** [List of participants]
**Duration:** [Time spent]

## Problem Statement
[Clear description of the problem or challenge we're trying to solve]

## Constraints & Requirements
- [Constraint 1]
- [Constraint 2]
- [Constraint 3]

## Ideas Generated

### Category 1: [Theme]
- [Idea 1] - [Brief description]
- [Idea 2] - [Brief description]
- [Idea 3] - [Brief description]

### Category 2: [Theme]
- [Idea 1] - [Brief description]
- [Idea 2] - [Brief description]
- [Idea 3] - [Brief description]

### Category 3: [Theme]
- [Idea 1] - [Brief description]
- [Idea 2] - [Brief description]
- [Idea 3] - [Brief description]

## Evaluation Criteria
- **Feasibility:** [How easy is it to implement?]
- **Impact:** [How much value does it provide?]
- **Resources:** [What resources are needed?]

## Top Ideas
| Idea | Feasibility | Impact | Resources | Score |
|------|-------------|--------|-----------|-------|
| [Idea 1] | [1-5] | [1-5] | [1-5] | [Total] |
| [Idea 2] | [1-5] | [1-5] | [1-5] | [Total] |

## Next Steps
- [ ] [Action item 1]
- [ ] [Action item 2]
- [ ] [Action item 3]

## Follow-up
**Next Meeting:** [Date and time]
**Assigned Tasks:** [Who is doing what]`,
          category: 'Ideas',
        },
      }),
      prisma.template.create({
        data: {
          name: 'Research Notes',
          
          content: `# Research Notes: [Topic]

**Research Date:** [Date]
**Researcher:** [Name]
**Purpose:** [Why this research is being conducted]

## Research Question
[The main question or hypothesis being investigated]

## Sources
### Primary Sources
- [Source 1] - [URL or citation]
- [Source 2] - [URL or citation]
- [Source 3] - [URL or citation]

### Secondary Sources
- [Source 1] - [URL or citation]
- [Source 2] - [URL or citation]

## Key Findings

### Finding 1: [Title]
**Source:** [Citation]
**Summary:** [Key points]
**Relevance:** [Why this matters]

### Finding 2: [Title]
**Source:** [Citation]
**Summary:** [Key points]
**Relevance:** [Why this matters]

### Finding 3: [Title]
**Source:** [Citation]
**Summary:** [Key points]
**Relevance:** [Why this matters]

## Patterns & Insights
- [Pattern 1 and what it means]
- [Pattern 2 and what it means]
- [Pattern 3 and what it means]

## Contradictions & Gaps
- [Where sources disagree]
- [What information is missing]
- [Areas needing more research]

## Conclusions
[Main conclusions drawn from the research]

## Recommendations
- [Recommendation 1]
- [Recommendation 2]
- [Recommendation 3]

## Next Steps
- [ ] [Action item 1]
- [ ] [Action item 2]
- [ ] [Action item 3]

## References
[Full citations and links]`,
          category: 'Learning',
        },
      }),
      prisma.template.create({
        data: {
          name: 'Decision Log',
          
          content: `# Decision Log

## Decision: [Decision Title]

**Date:** [Date]
**Decision Makers:** [List of people involved]
**Status:** [Proposed/Approved/Implemented/Rejected]

## Context
[Background information and situation that led to this decision]

## Problem Statement
[What problem or challenge are we trying to solve?]

## Options Considered

### Option 1: [Title]
**Description:** [What this option involves]
**Pros:**
- [Advantage 1]
- [Advantage 2]
- [Advantage 3]

**Cons:**
- [Disadvantage 1]
- [Disadvantage 2]
- [Disadvantage 3]

### Option 2: [Title]
**Description:** [What this option involves]
**Pros:**
- [Advantage 1]
- [Advantage 2]

**Cons:**
- [Disadvantage 1]
- [Disadvantage 2]

### Option 3: [Title]
**Description:** [What this option involves]
**Pros:**
- [Advantage 1]
- [Advantage 2]

**Cons:**
- [Disadvantage 1]
- [Disadvantage 2]

## Decision
[Which option was chosen and why]

## Rationale
[Detailed explanation of why this decision was made]

## Consequences
**Positive:**
- [Expected positive outcome 1]
- [Expected positive outcome 2]

**Negative:**
- [Potential negative outcome 1]
- [Potential negative outcome 2]

## Implementation Plan
- [ ] [Step 1]
- [ ] [Step 2]
- [ ] [Step 3]

## Review Date
[When this decision should be reviewed]

## Related Decisions
- [Link to related decision 1]
- [Link to related decision 2]`,
          category: 'Work',
      },
    }),
  ])
    console.log('✅ Created templates:', templates.length)

    // Create 7 DailyNotes for past week
    console.log('📅 Creating daily notes...')
    const dailyNotes = await Promise.all([
      prisma.dailyNote.create({
        data: {
          date: new Date(Date.now() - 0 * 24 * 60 * 60 * 1000), // Today
          content: `Today was a highly productive day focused on completing the user interface redesign. The team made significant progress on the new dashboard layout, and I'm excited about how it's turning out.

Key accomplishments:
- Finalized the color palette implementation
- Completed responsive design for mobile devices
- Conducted user testing with 5 participants
- Received positive feedback on the new navigation structure

The mood today was energized and focused. The collaborative environment really helped push through some challenging design decisions. Looking forward to continuing this momentum tomorrow.`,
          mood: 'GOOD',
          userId: user.id,
        },
      }),
      prisma.dailyNote.create({
        data: {
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Yesterday
          content: `Yesterday was a bit challenging with several unexpected issues arising during the development process. Had to spend most of the day debugging authentication problems that were blocking the team.

Challenges faced:
- Authentication token expiration issues
- Database connection timeouts
- Integration testing failures
- Team communication gaps

Despite the setbacks, managed to resolve the critical authentication bug by end of day. The debugging process was frustrating but ultimately rewarding when we found the root cause.`,
          mood: 'BAD',
          userId: user.id,
        },
      }),
      prisma.dailyNote.create({
        data: {
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          content: `A very productive day working on the new feature implementation. The morning was spent in a productive planning session where we mapped out the user journey and identified potential pain points.

Highlights:
- Successful feature planning session
- Completed API endpoint development
- Positive stakeholder feedback
- Team collaboration was excellent

The afternoon was dedicated to coding, and I managed to implement three new API endpoints with proper error handling and validation. The code review process went smoothly, and the team provided valuable feedback.`,
          mood: 'GREAT',
          userId: user.id,
        },
      }),
      prisma.dailyNote.create({
        data: {
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
          content: `Today was a learning-focused day with several educational activities. Attended a virtual conference on modern web development practices and learned about new tools and techniques.

Learning highlights:
- Discovered new testing frameworks
- Learned about performance optimization techniques
- Networked with other developers
- Updated personal development plan

The conference was inspiring and provided fresh perspectives on our current projects. Implemented some of the new techniques in a small side project to practice. Feeling motivated to apply these learnings to our main application.`,
          mood: 'GREAT',
          userId: user.id,
        },
      }),
      prisma.dailyNote.create({
        data: {
          date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
          content: `A relatively quiet day with routine tasks and maintenance work. Spent time updating documentation, reviewing code, and planning for the upcoming sprint.

Tasks completed:
- Updated API documentation
- Code review for 3 pull requests
- Sprint planning preparation
- Team one-on-one meetings

The day felt balanced and steady. No major breakthroughs, but solid progress on foundational work. Sometimes these quieter days are just as important as the high-energy ones for maintaining project momentum.`,
          mood: 'NEUTRAL',
          userId: user.id,
        },
      }),
      prisma.dailyNote.create({
        data: {
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
          content: `Feeling a bit tired today after the intense work week. The morning was slow to start, but managed to get into a good rhythm by mid-day.

Accomplishments:
- Completed user story refinement
- Fixed minor UI bugs
- Participated in team retrospective
- Updated project timeline

The retrospective was particularly valuable - we identified several process improvements that could help the team work more efficiently. Looking forward to implementing these changes next week.`,
          mood: 'BAD',
          userId: user.id,
        },
      }),
      prisma.dailyNote.create({
        data: {
          date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
          content: `Excellent day with deep focus on complex problem-solving. Spent the entire day working on a challenging algorithm optimization that had been blocking our performance improvements.

Deep work session:
- Analyzed performance bottlenecks
- Implemented new caching strategy
- Achieved 40% performance improvement
- Wrote comprehensive tests

The focused work session was incredibly satisfying. There's something rewarding about diving deep into a complex problem and emerging with a solution. The performance improvements will have a significant impact on user experience.`,
          mood: 'GOOD',
          userId: user.id,
        },
      }),
    ])
    console.log('✅ Created daily notes:', dailyNotes.length)

    // Create 4 Projects
    console.log('📁 Creating projects...')
    const projects = await Promise.all([
      prisma.project.create({
        data: {
          name: 'Website Redesign',
          
          status: 'IN_PROGRESS',
          progress: 65,
          userId: user.id,
          createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
        },
      }),
      prisma.project.create({
        data: {
          name: 'Mobile App V2',
          
          status: 'IN_PROGRESS',
          progress: 35,
          userId: user.id,
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        },
      }),
      prisma.project.create({
        data: {
          name: 'Documentation Overhaul',
          
          status: 'COMPLETED',
          progress: 100,
          userId: user.id,
          createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
        },
      }),
      prisma.project.create({
        data: {
          name: 'Q1 Marketing Campaign',
          
          status: 'IN_PROGRESS',
          progress: 20,
          userId: user.id,
          createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
        },
      }),
    ])
    console.log('✅ Created projects:', projects.length)

    // Create 15 Tasks with various priorities and due dates
    console.log('✅ Creating tasks...')
    const tasks = await Promise.all([
      prisma.task.create({
        data: {
          title: 'Review pull request #42',
          
          completed: false,
          priority: 'HIGH',
          dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Due tomorrow
          userId: user.id,
          projectId: projects[1].id, // Mobile App V2
        },
      }),
      prisma.task.create({
        data: {
          title: 'Update documentation',
          
          completed: true,
          priority: 'MEDIUM',
          dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // Overdue (completed)
          userId: user.id,
          projectId: projects[2].id, // Documentation Overhaul
        },
      }),
      prisma.task.create({
        data: {
          title: 'Design mobile wireframes',
          
          completed: false,
          priority: 'MEDIUM',
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // Due in 3 days
          userId: user.id,
          projectId: projects[1].id, // Mobile App V2
        },
      }),
      prisma.task.create({
        data: {
          title: 'Set up analytics tracking',
          
          completed: false,
          priority: 'LOW',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Due in 1 week
          userId: user.id,
          projectId: projects[0].id, // Website Redesign
        },
      }),
      prisma.task.create({
        data: {
          title: 'Create social media content',
          
          completed: false,
          priority: 'HIGH',
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Due in 2 days
          userId: user.id,
          projectId: projects[3].id, // Q1 Marketing Campaign
        },
      }),
      prisma.task.create({
        data: {
          title: 'Fix responsive layout issues',
          
          completed: true,
          priority: 'HIGH',
          dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Overdue (completed)
          userId: user.id,
          projectId: projects[0].id, // Website Redesign
        },
      }),
      prisma.task.create({
        data: {
          title: 'Write unit tests',
          
          completed: false,
          priority: 'MEDIUM',
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // Due in 5 days
          userId: user.id,
          projectId: projects[1].id, // Mobile App V2
        },
      }),
      prisma.task.create({
        data: {
          title: 'Schedule team meeting',
          
          completed: true,
          priority: 'LOW',
          dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // Overdue (completed)
          userId: user.id,
        },
      }),
      prisma.task.create({
        data: {
          title: 'Research competitor analysis',
          
          completed: false,
          priority: 'MEDIUM',
          dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // Due in 10 days
          userId: user.id,
          projectId: projects[3].id, // Q1 Marketing Campaign
        },
      }),
      prisma.task.create({
        data: {
          title: 'Optimize database queries',
          
          completed: false,
          priority: 'LOW',
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // Due in 2 weeks
          userId: user.id,
        },
      }),
      prisma.task.create({
        data: {
          title: 'Deploy staging environment',
          
          completed: true,
          priority: 'HIGH',
          dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // Overdue (completed)
          userId: user.id,
          projectId: projects[0].id, // Website Redesign
        },
      }),
      prisma.task.create({
        data: {
          title: 'Create user onboarding flow',
          
          completed: false,
          priority: 'MEDIUM',
          dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // Due in 6 days
          userId: user.id,
          projectId: projects[1].id, // Mobile App V2
        },
      }),
      prisma.task.create({
        data: {
          title: 'Update email templates',
          
          completed: false,
          priority: 'LOW',
          dueDate: null, // No due date
          userId: user.id,
          projectId: projects[3].id, // Q1 Marketing Campaign
        },
      }),
      prisma.task.create({
        data: {
          title: 'Conduct security audit',
          
          completed: false,
          priority: 'HIGH',
          dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // Due in 4 days
          userId: user.id,
        },
      }),
      prisma.task.create({
        data: {
          title: 'Backup documentation',
          
          completed: true,
          priority: 'LOW',
          dueDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Overdue (completed)
          userId: user.id,
          projectId: projects[2].id, // Documentation Overhaul
        },
      }),
    ])
    console.log('✅ Created tasks:', tasks.length)

    // Create 7 KnowledgeArticles
    console.log('📚 Creating knowledge articles...')
    const knowledgeArticles = await Promise.all([
      prisma.knowledgeArticle.create({
        data: {
          title: 'Getting Started Guide',
          content: `Welcome to our comprehensive getting started guide! This article will walk you through the essential steps to begin using our platform effectively.

## Initial Setup
The first step is to create your account and complete the initial configuration. This process takes approximately 5-10 minutes and includes setting up your profile, preferences, and security settings.

## Core Features Overview
Our platform offers a wide range of features designed to enhance your productivity:
- **Note Management**: Create, organize, and search through your notes
- **Task Tracking**: Manage your to-do lists and project tasks
- **Project Organization**: Keep track of multiple projects and their progress
- **Knowledge Base**: Build a personal knowledge repository

## Best Practices
To get the most out of our platform, we recommend:
1. Start with a simple organization system
2. Use categories and tags consistently
3. Regular review and cleanup of old content
4. Take advantage of templates for common tasks

## Getting Help
If you need assistance, our support team is available through multiple channels. Check our FAQ section for quick answers to common questions, or reach out directly for personalized help.`,
          category: 'Documentation',
          tags: ['Tutorial', 'Reference', 'Getting Started'],
          userId: user.id,
        },
      }),
      prisma.knowledgeArticle.create({
        data: {
          title: 'API Documentation',
          content: `Our RESTful API provides programmatic access to all platform features. This documentation covers authentication, endpoints, and integration examples.

## Authentication
All API requests require authentication using Bearer tokens. Obtain your API key from the settings page and include it in the Authorization header:
\`\`\`
Authorization: Bearer your-api-key-here
\`\`\`

## Base URL
All API endpoints are relative to our base URL:
\`\`\`
https://api.myawesomeapp.com/v1
\`\`\`

## Common Endpoints
- **GET /notes**: Retrieve all notes
- **POST /notes**: Create a new note
- **PUT /notes/{id}**: Update an existing note
- **DELETE /notes/{id}**: Delete a note

## Rate Limiting
API requests are rate-limited to 1000 requests per hour per API key. Rate limit headers are included in all responses to help you manage your usage.

## Error Handling
The API uses standard HTTP status codes and returns detailed error messages in JSON format. Always check the response status and handle errors appropriately in your application.`,
          category: 'Reference',
          tags: ['API', 'Technical', 'Integration'],
          userId: user.id,
        },
      }),
      prisma.knowledgeArticle.create({
        data: {
          title: 'Best Practices',
          content: `This article outlines the best practices for using our platform effectively and efficiently. Following these guidelines will help you maximize your productivity and maintain organized workflows.

## Organization Strategies
Effective organization is key to productivity. We recommend:
- **Consistent Naming**: Use clear, descriptive names for all your content
- **Category System**: Develop a logical category structure that works for your needs
- **Tag Usage**: Use tags to create cross-cutting themes and improve searchability
- **Regular Cleanup**: Schedule regular reviews to archive or delete outdated content

## Content Creation
When creating content, consider these principles:
- **Clarity**: Write clear, concise content that you'll understand later
- **Structure**: Use headings, lists, and formatting to improve readability
- **Context**: Include enough context so your future self can understand the content
- **Templates**: Leverage templates for common content types

## Collaboration
If working with a team:
- **Shared Spaces**: Use shared categories and tags for team content
- **Communication**: Document decisions and discussions clearly
- **Version Control**: Use the platform's versioning features for important documents
- **Access Management**: Regularly review and update access permissions

## Security Considerations
Protect your sensitive information:
- **Access Control**: Use appropriate privacy settings for sensitive content
- **Regular Backups**: Ensure your data is regularly backed up
- **Strong Authentication**: Use strong passwords and enable two-factor authentication
- **Data Classification**: Mark sensitive content appropriately`,
          category: 'Guide',
          tags: ['Best Practices', 'Organization', 'Productivity'],
          userId: user.id,
        },
      }),
      prisma.knowledgeArticle.create({
        data: {
          title: 'Common Troubleshooting',
          content: `This troubleshooting guide addresses the most common issues users encounter and provides step-by-step solutions to resolve them quickly.

## Login Issues
If you're having trouble logging in:
1. **Check Credentials**: Verify your email and password are correct
2. **Clear Cache**: Clear your browser cache and cookies
3. **Try Different Browser**: Test with a different browser or incognito mode
4. **Reset Password**: Use the "Forgot Password" link if needed

## Performance Problems
For slow loading or unresponsive pages:
1. **Check Internet Connection**: Ensure you have a stable internet connection
2. **Browser Updates**: Make sure your browser is up to date
3. **Disable Extensions**: Temporarily disable browser extensions
4. **Clear Data**: Clear browser data and restart

## Data Sync Issues
If your data isn't syncing properly:
1. **Check Connection**: Ensure you're connected to the internet
2. **Refresh Page**: Try refreshing the page or restarting the app
3. **Check Storage**: Verify you have sufficient storage space
4. **Contact Support**: If issues persist, contact our support team

## Feature Not Working
When specific features aren't working:
1. **Check Permissions**: Verify you have the necessary permissions
2. **Update App**: Ensure you're using the latest version
3. **Check Status Page**: Visit our status page for known issues
4. **Report Bug**: Use the feedback form to report the issue

## Getting Additional Help
If these solutions don't resolve your issue:
- **Support Portal**: Visit our support portal for more resources
- **Community Forum**: Check our community forum for user solutions
- **Direct Support**: Contact our support team directly for personalized help`,
          category: 'Support',
          tags: ['Troubleshooting', 'Help', 'Technical Support'],
          userId: user.id,
        },
      }),
      prisma.knowledgeArticle.create({
        data: {
          title: 'Feature Overview',
          content: `This comprehensive overview covers all the features available in our platform, helping you understand the full range of capabilities and how they can benefit your workflow.

## Core Features
### Note Management
Create, edit, and organize notes with rich text formatting, attachments, and collaboration features. Notes support markdown formatting, code blocks, and embedded media.

### Task Management
Organize your work with powerful task management features including due dates, priorities, project assignments, and progress tracking. Set up recurring tasks and automated reminders.

### Project Organization
Keep track of multiple projects with dedicated project spaces, progress monitoring, team collaboration tools, and comprehensive reporting features.

### Knowledge Base
Build a personal or team knowledge repository with searchable articles, categorized content, and version control. Perfect for documentation, best practices, and institutional knowledge.

## Advanced Features
### Automation
Set up automated workflows to streamline repetitive tasks, including automatic categorization, scheduled backups, and integration with external tools.

### Analytics
Track your productivity with detailed analytics on note creation, task completion, project progress, and time management insights.

### Integration
Connect with popular tools including calendar applications, email clients, cloud storage services, and project management platforms.

### Mobile Access
Access all features through our mobile applications for iOS and Android, with offline capabilities and real-time synchronization.

## Collaboration Tools
### Team Workspaces
Create shared workspaces for team collaboration with role-based permissions, shared resources, and communication tools.

### Real-time Editing
Collaborate in real-time with multiple users on the same document, with change tracking and conflict resolution.

### Comments and Feedback
Add comments, suggestions, and feedback directly to content, with notification systems and threaded discussions.`,
          category: 'Tutorial',
          tags: ['Features', 'Overview', 'Productivity'],
          userId: user.id,
        },
      }),
      prisma.knowledgeArticle.create({
        data: {
          title: 'Integration Guide',
          content: `This guide explains how to integrate our platform with external tools and services to create a seamless workflow and maximize productivity.

## Calendar Integration
Connect your calendar to automatically sync deadlines, meetings, and important dates:
1. **Google Calendar**: Two-way sync with Google Calendar
2. **Outlook**: Integration with Microsoft Outlook
3. **Apple Calendar**: Native support for Apple Calendar
4. **Custom Calendars**: Import/export with standard calendar formats

## Email Integration
Streamline your email workflow with our email integrations:
- **Gmail**: Direct integration with Gmail for task creation
- **Outlook**: Microsoft Outlook integration
- **Email to Note**: Convert emails directly to notes
- **Notification Emails**: Receive updates via email

## Cloud Storage
Sync your data across multiple devices and platforms:
- **Google Drive**: Automatic backup and sync
- **Dropbox**: Seamless file sharing and storage
- **OneDrive**: Microsoft OneDrive integration
- **Local Sync**: Offline access and local backups

## Development Tools
For developers and technical teams:
- **GitHub**: Integration with GitHub for code documentation
- **Slack**: Team communication and notifications
- **Jira**: Project management integration
- **API Access**: Full REST API for custom integrations

## Setup Instructions
1. **Access Settings**: Go to Settings > Integrations
2. **Choose Service**: Select the service you want to integrate
3. **Authenticate**: Follow the authentication process
4. **Configure**: Set up sync preferences and options
5. **Test**: Verify the integration is working correctly

## Best Practices
- **Start Small**: Begin with one or two integrations
- **Regular Review**: Periodically review integration settings
- **Security**: Use strong authentication and review permissions
- **Backup**: Always maintain backups of critical data`,
          category: 'Guide',
          tags: ['Integration', 'Setup', 'External Tools'],
          userId: user.id,
        },
      }),
      prisma.knowledgeArticle.create({
        data: {
          title: 'FAQ',
          content: `This frequently asked questions section addresses the most common questions about our platform, features, and usage.

## General Questions
**Q: How do I get started with the platform?**
A: Simply create an account, complete the setup wizard, and start creating your first note or task. We recommend exploring the templates to get familiar with the features.

**Q: Is there a mobile app available?**
A: Yes, we have mobile applications for both iOS and Android. You can download them from the App Store or Google Play Store.

**Q: How much storage space do I get?**
A: Free accounts include 1GB of storage. Paid plans offer additional storage starting from 10GB.

**Q: Can I collaborate with team members?**
A: Yes, our platform supports team collaboration with shared workspaces, real-time editing, and role-based permissions.

## Technical Questions
**Q: What browsers are supported?**
A: We support all modern browsers including Chrome, Firefox, Safari, and Edge. We recommend using the latest version for the best experience.

**Q: Is my data secure?**
A: Yes, we use industry-standard encryption and security measures to protect your data. All data is encrypted in transit and at rest.

**Q: Can I export my data?**
A: Yes, you can export your data in various formats including JSON, CSV, and PDF. This feature is available in the settings menu.

**Q: Do you have an API?**
A: Yes, we provide a comprehensive REST API for developers. Documentation is available in our API section.

## Billing and Plans
**Q: What payment methods do you accept?**
A: We accept all major credit cards, PayPal, and bank transfers for annual plans.

**Q: Can I change my plan anytime?**
A: Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.

**Q: Is there a free trial?**
A: Yes, we offer a 14-day free trial for all paid plans with no credit card required.

**Q: How do I cancel my subscription?**
A: You can cancel your subscription anytime from the billing section in your account settings.`,
          category: 'FAQ',
          tags: ['FAQ', 'Help', 'Common Questions'],
          userId: user.id,
        },
      }),
    ])
    console.log('✅ Created knowledge articles:', knowledgeArticles.length)

    console.log('🎉 Comprehensive seed completed successfully!')
  console.log(`Created:
  - 1 user
  - ${categories.length} categories
  - ${tags.length} tags
  - ${notes.length} notes
  - ${noteTagRelations.length} note-tag relationships
  - ${templates.length} templates
  - ${dailyNotes.length} daily notes
  - ${projects.length} projects
  - ${tasks.length} tasks
  - ${knowledgeArticles.length} knowledge articles`)

  } catch (error) {
    console.error('❌ Seed failed:', error)
    throw error
  }
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
