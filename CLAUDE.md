# Claude Code Configuration

## Project: Shakes Travel - Uganda Tourism Platform

### Project Overview
Shakes Travel is a Next.js-based tourism platform exclusively focused on Uganda destinations, experiences, and accommodations. The platform emphasizes sustainable tourism, gorilla trekking, wildlife safaris, and eco-friendly travel in the "Pearl of Africa."

### Technology Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Netlify
- **Authentication**: Netlify Identity

### Auto-Deploy Configuration
- **Auto-commit**: YES
- **Auto-push**: YES
- **Branch**: main
- **Deploy Provider**: Netlify (automatic via webhook)

### Live URLs
- **Primary**: https://main--shakestravel.netlify.app
- **Custom Domain**: https://shakestravel.com

### Project Focus
The platform is exclusively focused on **Uganda tourism**:
- Mountain gorilla trekking in Bwindi & Mgahinga
- Wildlife safaris (Murchison Falls, Queen Elizabeth, Kidepo Valley, Lake Mburo)
- Adventure activities (white water rafting, mountain trekking)
- Eco-tourism and sustainability (Planting Green Paths initiative)

### Development Workflow
1. Make changes to code
2. Test locally if needed: `cd frontend && npm run dev`
3. Commit changes with descriptive messages
4. Push to GitHub main branch
5. Netlify automatically deploys (2-3 minutes)

### Important Directories
```
frontend/
├── src/app/              # Next.js pages (App Router)
├── src/components/       # React components
├── src/lib/             # Utility functions
├── src/data/            # Static data (destinations, experiences)
└── public/              # Static assets (images, PDFs)
```

### Key Commands
```bash
# Development
cd frontend && npm run dev

# Build
cd frontend && npm run build

# Lint
cd frontend && npm run lint

# Type check
cd frontend && npx tsc --noEmit
```

### Coding Standards
- Use TypeScript for type safety
- Follow Next.js 14 App Router conventions
- Use Tailwind CSS for styling
- Keep components modular and reusable
- Optimize images and assets
- Maintain accessibility (ARIA labels, semantic HTML)
- Focus exclusively on Uganda content

### Content Guidelines
- All destinations must be in Uganda
- Use "Pearl of Africa" branding
- Emphasize sustainability and eco-tourism
- Include accurate pricing and availability
- Provide detailed destination descriptions
- Highlight unique Ugandan experiences

### Brand Colors
- Primary: #195e48 (Forest Green)
- Use for CTAs, links, and brand elements

### Common Tasks
- **Add new destination**: Update `frontend/src/data/topExperiences.ts` and create corresponding images
- **Update homepage**: Edit `frontend/src/app/page.tsx`
- **Add new page**: Create in `frontend/src/app/[pagename]/page.tsx`
- **Update navigation**: Edit `frontend/src/components/Layout/Navbar.tsx`

### Deployment Notes
- Netlify automatically builds and deploys on push to main
- Build command: `cd frontend && npm run build`
- Publish directory: `frontend/.next`
- Node version: 18.x

### Authentication
- Uses Netlify Identity for user management
- Login/Register pages at `/auth/login` and `/auth/register`
- Dashboard access requires authentication

### Known Issues & Solutions
- **Custom domain 503**: SSL certificate renewal required (contact Netlify support)
- **Build failures**: Check Node version (must be 18+)
- **Image optimization**: Use Next.js Image component for all images

### SEO & Performance
- Structured data (JSON-LD) included on homepage
- Meta tags optimized for Uganda tourism keywords
- Lazy loading for images and components
- Mobile-first responsive design

### Last Updated
Date: 2025-10-11
Status: Clean project structure, Uganda-focused content
