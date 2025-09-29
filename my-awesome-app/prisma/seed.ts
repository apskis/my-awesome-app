import { PrismaClient } from '../src/generated/prisma'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create a sample user
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      name: 'Demo User',
      emailVerified: new Date(),
    },
  })

  console.log('✅ Created user:', user.email)

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { 
        name_userId: { 
          name: 'Work', 
          userId: user.id 
        } 
      },
      update: {},
      create: {
        name: 'Work',
        description: 'Work-related notes and tasks',
        color: '#EF4444', // Red
        userId: user.id,
      },
    }),
    prisma.category.upsert({
      where: { 
        name_userId: { 
          name: 'Personal', 
          userId: user.id 
        } 
      },
      update: {},
      create: {
        name: 'Personal',
        description: 'Personal notes and thoughts',
        color: '#10B981', // Green
        userId: user.id,
      },
    }),
    prisma.category.upsert({
      where: { 
        name_userId: { 
          name: 'Learning', 
          userId: user.id 
        } 
      },
      update: {},
      create: {
        name: 'Learning',
        description: 'Notes about learning and education',
        color: '#3B82F6', // Blue
        userId: user.id,
      },
    }),
  ])

  console.log('✅ Created categories:', categories.map(c => c.name))

  // Create tags
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { name: 'important' },
      update: {},
      create: {
        name: 'important',
        color: '#F59E0B', // Amber
      },
    }),
    prisma.tag.upsert({
      where: { name: 'todo' },
      update: {},
      create: {
        name: 'todo',
        color: '#8B5CF6', // Purple
      },
    }),
    prisma.tag.upsert({
      where: { name: 'meeting' },
      update: {},
      create: {
        name: 'meeting',
        color: '#EC4899', // Pink
      },
    }),
    prisma.tag.upsert({
      where: { name: 'project' },
      update: {},
      create: {
        name: 'project',
        color: '#06B6D4', // Cyan
      },
    }),
  ])

  console.log('✅ Created tags:', tags.map(t => t.name))

  // Create notes
  const notes = await Promise.all([
    prisma.note.create({
      data: {
        title: 'Welcome to My Awesome App!',
        content: `This is your first note in the app. You can use this space to jot down ideas, create to-do lists, or keep track of important information.

Features you can explore:
- Create and organize notes by categories
- Add tags to categorize your content
- Set note status (Draft, Published, Archived)
- Search and filter your notes

Happy note-taking! 🎉`,
        status: 'PUBLISHED',
        userId: user.id,
        categoryId: categories[1].id, // Personal
      },
    }),
    prisma.note.create({
      data: {
        title: 'Project Planning Meeting',
        content: `Meeting notes from the project planning session:

Agenda:
1. Review project requirements
2. Define milestones and deadlines
3. Assign team responsibilities
4. Set up communication channels

Action items:
- [ ] Create project timeline
- [ ] Set up development environment
- [ ] Schedule weekly check-ins
- [ ] Prepare initial wireframes

Next meeting: Friday at 2 PM`,
        status: 'PUBLISHED',
        userId: user.id,
        categoryId: categories[0].id, // Work
      },
    }),
    prisma.note.create({
      data: {
        title: 'Learning React Hooks',
        content: `Notes on React Hooks:

useState - for managing component state
useEffect - for side effects and lifecycle
useContext - for consuming context
useReducer - for complex state logic
useMemo - for memoizing expensive calculations
useCallback - for memoizing functions

Best practices:
- Only call hooks at the top level
- Don't call hooks inside loops, conditions, or nested functions
- Use dependency arrays correctly in useEffect`,
        status: 'DRAFT',
        userId: user.id,
        categoryId: categories[2].id, // Learning
      },
    }),
    prisma.note.create({
      data: {
        title: 'Grocery Shopping List',
        content: `Weekly grocery shopping:

Produce:
- Bananas
- Apples
- Spinach
- Tomatoes
- Avocados

Dairy:
- Milk
- Greek yogurt
- Cheese

Pantry:
- Bread
- Pasta
- Rice
- Olive oil

Don't forget to check the fridge before going!`,
        status: 'DRAFT',
        userId: user.id,
        categoryId: categories[1].id, // Personal
      },
    }),
    prisma.note.create({
      data: {
        title: 'Archived: Old Project Ideas',
        content: `This note contains some old project ideas that are no longer relevant:

1. Mobile app for tracking expenses
2. Social media scheduler
3. Recipe sharing platform
4. Local event finder

These ideas have been archived as they're no longer priorities.`,
        status: 'ARCHIVED',
        userId: user.id,
        categoryId: categories[0].id, // Work
      },
    }),
  ])

  console.log('✅ Created notes:', notes.map(n => n.title))

  // Create note-tag relationships
  const noteTagRelations = await Promise.all([
    // Welcome note gets 'important' tag
    prisma.noteTag.create({
      data: {
        noteId: notes[0].id,
        tagId: tags[0].id, // important
      },
    }),
    // Meeting note gets 'meeting' and 'todo' tags
    prisma.noteTag.create({
      data: {
        noteId: notes[1].id,
        tagId: tags[2].id, // meeting
      },
    }),
    prisma.noteTag.create({
      data: {
        noteId: notes[1].id,
        tagId: tags[1].id, // todo
      },
    }),
    // Learning note gets 'important' tag
    prisma.noteTag.create({
      data: {
        noteId: notes[2].id,
        tagId: tags[0].id, // important
      },
    }),
    // Grocery list gets 'todo' tag
    prisma.noteTag.create({
      data: {
        noteId: notes[3].id,
        tagId: tags[1].id, // todo
      },
    }),
    // Archived project gets 'project' tag
    prisma.noteTag.create({
      data: {
        noteId: notes[4].id,
        tagId: tags[3].id, // project
      },
    }),
  ])

  console.log('✅ Created note-tag relationships')

  console.log('🎉 Seed completed successfully!')
  console.log(`Created:
  - 1 user
  - ${categories.length} categories
  - ${tags.length} tags
  - ${notes.length} notes
  - ${noteTagRelations.length} note-tag relationships`)
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
