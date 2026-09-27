# Oxford Blocks Brasil - Complete Project Documentation

**Generated:** September 18, 2026  
**Project Version:** 1.0.0  
**Repository:** https://github.com/financenexus/oxfordblock-v2.git  
**Production URL:** https://oxfordblock-v2.financenexus.deno.net/

---

## 📋 TABLE OF CONTENTS

1. [Project Overview](#project-overview)
2. [Business Purpose & Strategy](#business-purpose--strategy)
3. [Technical Architecture](#technical-architecture)
4. [File Structure & Organization](#file-structure--organization)
5. [Configuration & Credentials](#configuration--credentials)
6. [Development Setup](#development-setup)
7. [Deployment Guide](#deployment-guide)
8. [Brand Identity & Design](#brand-identity--design)
9. [Features & Functionality](#features--functionality)
10. [Security Implementation](#security-implementation)
11. [API Documentation](#api-documentation)
12. [Development Workflow](#development-workflow)
13. [Troubleshooting](#troubleshooting)
14. [Future Roadmap](#future-roadmap)
15. [Key Contacts & Resources](#key-contacts--resources)

---

## PROJECT OVERVIEW

### Project Identity
- **Name:** Oxford Blocks Brasil
- **Type:** Brand presentation website with partner registration system
- **Purpose:** Brazilian arm of Oxford (Korea) connecting Brazilian brands/retailers to Korean block-toy manufacturing
- **Status:** Production-ready, actively maintained
- **Development Language:** Portuguese (PT-BR) for content, English for code/documentation

### Core Business Model
The site serves as a bridge between Oxford Korea's manufacturing capabilities and Brazilian market opportunities with three revenue engines:

1. **Institutional/Corporate Projects** (Fastest cycle)
   - Custom block collections for companies, factories, headquarters
   - Marketing budget-driven purchases
   - No retail shelf space required

2. **Brand Collabs/Licensing** (Bigger ticket, longer cycle)
   - Co-branded collections with brand identity
   - Entertainment/IP partnerships
   - Higher value, longer sales cycle

3. **Regular Oxford Line Distribution** (Slowest, capital-intensive)
   - Standard product line retail distribution
   - Traditional toy retail model
   - Not initial phase focus

### Target Audiences

**Primary: Brazilian Brands & Institutions**
- Marketing/brand managers at football clubs, franchises, museums, tourism boards
- Theme parks, entertainment/IP owners, banks, airlines, automotive companies
- Food/beverage brands, retailers, influencers
- **Decision maker:** Marketing director (not toy buyer)
- **Budget source:** Marketing budget (not shelf space budget)

**Secondary: Brazilian Retailers & Buyers**
- Toy stores, stationery shops, bookstores
- Hobby/geek shops, e-commerce and retail chains
- Traditional toy distribution channels

---

## BUSINESS PURPOSE & STRATEGY

### Positioning Statement
> "A Oxford transforma marcas e ideias que ganham vida."

**Key Differentiators:**
- Not a toy distributor — a Korea-to-Brazil manufacturing bridge
- Direct access to Oxford Korea's decades of corporate/brand collaboration experience
- Marketing director audience (bigger budget, faster decisions)
- Premium positioning, not commodity toy seller

### Brand Commitments
- **Name:** Oxford Blocks Brasil (Brazilian arm of Oxford, Korea)
- **Opening Message:** "A Oxford transforma marcas e ideias que ganham vida."
- **Voice:** Confident, premium, tech-forward, Korean-design-inspired
- **Visual Style:** Modern, bold, Korean-tech aesthetic with grid patterns and brick motifs

### Product Principles
1. **Three engines, not one** — Sold separately, never blended
2. **Proof over hype** — Use exact dates and defensible claims
3. **Marketing director, not toy buyer** — "Transforma marca em objeto," not "vende brinquedo"
4. **Korea-to-Brazil bridge** — Every section reinforces the connection
5. **Premium and precise** — Korean tech craftsmanship feel, not toy catalog
6. **Action-oriented** — Every section drives toward partner CTA

### Evidence Constraints (Non-negotiable)
- **Corporate roots:** 1961 (exact date)
- **Block-toy production:** 1992 (exact date)
- **Oxford brand milestone:** 1996 (exact date)
- **DO NOT USE:** "40+ years of block manufacturing" (use exact dates)
- **DO NOT USE:** "One of the largest premium manufacturers in Korea" (pending evidence)
- **DO NOT USE:** Uncertified safety/quality claims (present as aspiration, not fact)
- **Collaboration lists:** Owner-provided lists are leads, not independently verified

### Key Proof Cases
- **Seongnam FC:** Stadium in blocks + 7 players as individual figures with names/numbers
- **KBO (Korean Baseball Organization):** Player figures, clubhouses, buses for 10 clubs (full league program)
- **Gwangju FC & Suwon Bluewings:** Official club buses in blocks

---

## TECHNICAL ARCHITECTURE

### Technology Stack

**Frontend:**
- Single-page application with two main HTML files
- Custom JavaScript for animations and interactivity
- GSAP (GreenSock Animation Platform) for cinematic motion
- Custom cursor system with SVG-based block icons
- Responsive design with mobile-first approach
- Dark theme with Oxford brand colors

**Backend:**
- Node.js/Express server (local development)
- Deno runtime (production deployment)
- Dual runtime support with unified codebase
- Express.js for HTTP server and API endpoints
- File-based JSON storage (local) or Deno KV (production)
- Resend API for email notifications

**Dependencies:**
```json
{
  "express": "^4.21.0",
  "jimp": "^1.6.1",
  "sharp": "^0.35.4"
}
```

### Architecture Patterns

**Dual Runtime Support:**
- Runtime detection via `globalThis.Deno`
- Environment variable abstraction layer
- Storage abstraction (Deno KV vs file system)
- Port configuration (Deno-injected vs local default)

**Storage Strategy:**
- **Local Development:** File-based JSON storage in `submissions/` directory
- **Production:** Deno KV key-value database
- Unified API via `saveSubmission()` function
- Automatic fallback and detection

**API Design:**
- RESTful endpoints for form submissions
- Health check endpoint for monitoring
- Static file serving with cache headers
- SPA fallback for client-side routing

### Performance Considerations
- GSAP animations at 60fps
- Asset optimization and lazy loading
- Cache headers for static assets
- Rate limiting for API protection
- In-memory rate limit Map with cleanup

---

## FILE STRUCTURE & ORGANIZATION

### Complete File Tree

```
oxfordblock/
├── index.html                      # Main landing page (137KB)
├── parceiro.html                    # Partner registration form (36KB)
├── server.js                        # Express/Deno server (11KB)
├── cursor.js                        # Custom cursor implementation
├── cursor.css                       # Custom cursor styles
├── package.json                     # Node.js dependencies
├── package-lock.json                # Dependency lock file
├── deno.json                        # Deno deployment config
├── deno.lock                        # Deno dependency lock
├── config.example.json              # Configuration template
├── .gitignore                       # Git ignore rules
├── .commit-msg2.txt                 # Commit message template
├── PRODUCT.md                       # Product specification
├── APRESENTACAO_OWNER.md            # Owner presentation (Portuguese)
├── OWNER_FEEDBACK_CHECKLIST.md     # Feedback checklist
├── RESUMO_FASES.md                  # Phase summary (Portuguese)
├── COMPLETE_PROJECT_DOCUMENTATION.md # This file
├── assets/                          # Static assets directory
│   ├── oxford-logo-official-master.png    # Master logo (2.2MB)
│   ├── oxford-logo-official-nav.png       # Navigation logo (130KB)
│   ├── oxford-logo-official-nav@2x.png   # Retina navigation logo (528KB)
│   ├── oxford-logo-official-footer.png    # Footer logo (50KB)
│   ├── oxford-cursor-exact.png            # Custom cursor (4KB)
│   ├── oxford-intro.mp4                   # Intro video (2.5MB)
│   ├── mbc-helicopter.mp4                 # Helicopter video (3.1MB)
│   ├── mbc-helicopter-poster.png          # Video poster (171KB)
│   ├── proof-stadium-owner.jpg            # Stadium proof image (43KB)
│   ├── portfolio-korea/                   # Portfolio images by category
│   ├── portfolio-korea-transparent/       # Transparent portfolio assets
│   └── products/                         # Product catalog images
├── submissions/                     # Form submissions (local only)
│   ├── submissions.json               # All submissions index
│   └── [UUID].json                     # Individual submission files
└── node_modules/                    # Dependencies (excluded from git)
```

### Key Files Explained

**Server.js (11KB):**
- Express server with dual runtime support
- Partner form submission API endpoint
- Email notification via Resend API
- Rate limiting and bot protection
- Static file serving with cache headers
- Health check endpoint
- SPA fallback routing

**Index.html (137KB):**
- Main landing page with cinematic animations
- Hero section with video and floating blocks
- Company history timeline
- Services/solutions presentation
- Portfolio gallery with filtering
- FAQ section with accordion
- Contact information

**Parceiro.html (36KB):**
- Partner registration form
- Five partnership type options
- Comprehensive form validation
- Custom branding and styling
- Success/error handling

**Cursor.js & Cursor.css:**
- Custom cursor implementation
- SVG-based block icon system
- Mouse tracking and visual feedback
- Performance-optimized rendering

---

## CONFIGURATION & CREDENTIALS

### Environment Variables (Production - Deno Deploy)

**Required for Email Functionality:**
- `RESEND_API_KEY` - Resend email service API key
- `MAIL_TO` - Destination email for form submissions
- `MAIL_FROM` - Sender email address (default: Oxford Brasil <onboarding@resend.dev>)

**System Variables:**
- `PORT` - Server port (auto-injected by Deno Deploy, defaults to 8123 locally)

### Local Configuration

**File:** `config.json` (gitignored for security)

**Example Structure:**
```json
{
  "_comment": "Local development only. In production (Deno Deploy) set RESEND_API_KEY, MAIL_TO and MAIL_FROM as environment variables instead.",
  "email": {
    "resend_api_key": "re_your_api_key_here",
    "from": "Oxford Brasil <onboarding@resend.dev>",
    "to": "your-real-email@domain.com"
  }
}
```

**Configuration Priority:**
1. Environment variables (highest priority)
2. config.json file
3. Default values (lowest priority)

### Getting Resend API Key

1. Sign up at https://resend.com/
2. Create an API key in the dashboard
3. Set as `RESEND_API_KEY` environment variable
4. Verify sender domain for email delivery

---

## DEVELOPMENT SETUP

### Prerequisites

**Required Software:**
- Node.js (v18 or higher recommended)
- npm (comes with Node.js)
- Git
- Modern web browser

**Optional for Deno Deployment:**
- Deno CLI (for local Deno testing)
- Deno Deploy account

### Installation Steps

1. **Clone Repository:**
```bash
git clone https://github.com/financenexus/oxfordblock-v2.git
cd oxfordblock
```

2. **Install Dependencies:**
```bash
npm install
```

3. **Configure Local Development:**
```bash
# Copy example config
cp config.example.json config.json

# Edit config.json with your email settings
# (Only needed for email testing)
```

4. **Start Development Server:**
```bash
npm start
# Server runs on http://localhost:8123
```

### Development Workflow

**Running Locally:**
```bash
npm start        # Start Node.js server on port 8123
npm dev          # Same as start (alias)
```

**Testing Email Functionality:**
- Configure `config.json` with valid Resend API key
- Submit test form through `http://localhost:8123/parceiro.html`
- Check email destination for test submissions
- Monitor console for email success/failure logs

**File Watching:**
- Currently no hot-reload setup
- Manual server restart after file changes
- Browser refresh to see changes

### Common Development Tasks

**Adding New Portfolio Images:**
1. Place images in `assets/portfolio-korea/` or `assets/portfolio-korea-transparent/`
2. Update JavaScript in `index.html` to include new images
3. Test responsive behavior on different screen sizes

**Modifying Form Fields:**
1. Edit form HTML in `parceiro.html`
2. Update validation logic in `server.js`
3. Update email template in `sendNotificationEmail()` function
4. Test form submission and email delivery

**Updating Brand Colors:**
1. Primary locations: CSS variables and inline styles
2. Key files: `index.html`, `parceiro.html`, `cursor.css`
3. Maintain Oxford red (#D42B24) and yellow (#F5A623) as primary

---

## DEPLOYMENT GUIDE

### Production Deployment (Deno Deploy)

**Prerequisites:**
- Deno Deploy account (https://dash.deno.com/)
- GitHub repository connected to Deno Deploy
- Environment variables configured in Deno Deploy dashboard

**Deployment Configuration:**

**File:** `deno.json`
```json
{
  "tasks": {
    "start": "deno run --allow-net --allow-read --allow-env --unstable-kv server.js"
  },
  "nodeModulesDir": "auto",
  "deploy": {
    "org": "financenexus",
    "app": "oxfordblock"
  }
}
```

**Deployment Steps:**

1. **Configure Environment Variables in Deno Deploy:**
   - Go to Deno Deploy dashboard
   - Select project: oxfordblock
   - Add environment variables:
     - `RESEND_API_KEY`: Your Resend API key
     - `MAIL_TO`: Your destination email
     - `MAIL_FROM`: Your sender email

2. **Deploy via Git:**
```bash
git add .
git commit -m "deployment message"
git push origin main
```

3. **Automatic Deployment:**
   - Deno Deploy automatically deploys on push to main branch
   - Build process uses deno.json configuration
   - Application runs with Deno runtime and KV storage

**Deployment Verification:**
- Check Deno Deploy dashboard for deployment status
- Test production URL: https://oxfordblock-v2.financenexus.deno.net/
- Test health check: https://oxfordblock-v2.financenexus.deno.net/api/health
- Test form submission and email delivery

### Manual Deployment (Alternative)

**Using Deno CLI:**
```bash
# Install Deno if not already installed
curl -fsSL https://deno.land/install.sh | sh

# Deploy manually
deno deploy --project=oxfordblock --allow-net --allow-read --allow-env --unstable-kv server.js
```

### Rollback Procedures

**Git-based Rollback:**
```bash
# View commit history
git log --oneline

# Revert to previous commit
git revert <commit-hash>
git push origin main
```

**Deno Deploy Rollback:**
- Use Deno Deploy dashboard to select previous deployment
- Redeploy selected version
- Verify functionality after rollback

---

## BRAND IDENTITY & DESIGN

### Color Palette

**Primary Colors:**
- Oxford Red: `#D42B24` (Primary brand color)
- Deep Red: `#9B1A14` (Shades and accents)
- Yellow Accent: `#F5A623` (Highlights and CTAs)

**Neutral Colors:**
- Canvas (Background): `#050607` (Near-black)
- Off-white: `#f5f4f0` (Text and light elements)
- Gray tones for structural elements

### Typography & Voice

**Brand Voice:**
- Confident, premium, tech-forward
- Korean-design-inspired modern aesthetic
- Bold and professional tone
- Portuguese language content (PT-BR)

**Typography Guidelines:**
- Modern, sharp, professional fonts
- High contrast on dark canvas
- Legible sizing for accessibility
- Consistent hierarchy across sections

### Visual Identity Elements

**Logo Usage:**
- Master logo: `assets/oxford-logo-official-master.png`
- Navigation: `assets/oxford-logo-official-nav.png` (retina: @2x)
- Footer: `assets/oxford-logo-official-footer.png`
- Always use official Oxford logo files
- Maintain aspect ratio and positioning

**Design Motifs:**
- Grid patterns and brick motifs
- Korean-tech aesthetic inspiration
- Dark cinematic theme
- Block-based visual elements
- Sharp, geometric shapes

### Animation Guidelines

**Motion Principles:**
- Cinematic, intentional movements
- Block-by-block construction effects
- Parallax depth layers
- 60fps performance target
- Respect for reduced-motion preferences

**GSAP Implementation:**
- Professional animation library
- Hardware-accelerated transforms
- Smooth easing functions
- Optimized for performance

---

## FEATURES & FUNCTIONALITY

### Cinematic Motion Engine

**Hero Section:**
- Animated title with block-falling effect
- Floating block pieces in background
- Video integration with animated frame
- Parallax depth layers (3 layers moving at different speeds)
- Product box transparent images with dynamic positioning

**Scroll Animations:**
- Title reveal animations (left-to-right slide)
- Card sequential reveals
- Timeline construction effect
- Number counting animations for years
- Pulsing step indicators
- Smooth section transitions

**Custom Cursor System:**
- SVG-based block icon cursor
- Smooth mouse tracking
- Visual feedback on interactions
- Performance-optimized rendering
- Custom cursor states for different elements

### Partner Registration System

**Partnership Types:**
1. **Projeto Institucional** - Corporate projects
2. **Collab de Marca** - Brand collaborations
3. **Revender Oxford** - Retail partnerships
4. **Solicitar Catálogo** - Catalog requests
5. **Agendar Reunião** - Meeting scheduling

**Form Fields:**
- Name (required)
- Company/Brand (required)
- Partnership Type (required)
- Email (required, validated)
- Phone/WhatsApp
- Website
- Business Segment
- Company Size/Reach
- Budget Range
- Desired Timeline
- Estimated Quantity
- How they found Oxford
- Newsletter subscription
- Message (required)

**Form Validation:**
- Required field checking
- Email format validation
- Input sanitization (trim, length limits)
- Rate limiting (10 submissions/hour per IP)
- Bot protection via honeypot field

### Portfolio System

**Categories:**
- Aviação (Aviation)
- Automotivo (Automotive)
- Esportes (Sports)
- Entretenimento (Entertainment)
- Corporativo (Corporate)
- Cultural/Heritage (Cultural Heritage)

**Features:**
- Filterable gallery by category
- Responsive image grid
- Transparent background options
- Proof case studies
- High-quality imagery

### Navigation & UX

**Smart Navigation:**
- Progress bar showing scroll position
- Auto-hiding menu on scroll down
- Reappearing menu on scroll up
- Active section highlighting
- Smooth scroll to sections

**Interactive Elements:**
- 3D card tilt effects on mouse hover
- Dynamic shine/reflection following cursor
- Magnetic button effects
- FAQ accordion with smooth animations
- Mobile-responsive touch interactions

### Accessibility Features

**WCAG Compliance:**
- Keyboard navigation support
- Sufficient color contrast on dark canvas
- Legible type sizing
- Alt text on imagery
- Reduced motion preference support
- Screen reader compatibility

**Performance:**
- Optimized asset loading
- Cache headers for static assets
- Lazy loading where appropriate
- 60fps animation target
- Minimal JavaScript dependencies

---

## SECURITY IMPLEMENTATION

### Server-Side Security

**Security Headers:**
```javascript
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 0
Referrer-Policy: strict-origin-when-cross-origin
```

**Input Validation:**
- Required field validation
- Email format validation with regex
- Input sanitization (trim, 5000 character limit)
- Type checking for all inputs
- SQL injection prevention (no SQL used)

**Rate Limiting:**
- In-memory Map-based rate limiting
- 10 submissions per IP per hour
- Automatic cleanup of stale entries
- Per-isolate limitation on Deno Deploy

**Bot Protection:**
- Honeypot field (`website`) that should remain empty
- Silent discard of submissions with filled honeypot
- No error messages for bots (appears successful)
- Primary defense against automated submissions

### Data Protection

**Storage Security:**
- Deno KV for production (encrypted at rest)
- File-based storage for local development
- No sensitive data in logs
- IP address logging for security monitoring

**Email Security:**
- Resend API key stored in environment variables
- No credentials in code or git repository
- Secure HTTPS communication with Resend API
- Reply-to header set to submitter email

**Configuration Security:**
- `config.json` gitignored
- Environment variables for production
- No hardcoded credentials
- Example config provided for reference

### Deployment Security

**Deno Deploy Security:**
- Automatic HTTPS
- Isolated runtime environment
- Secure KV storage
- Regular security updates
- DDoS protection

**Git Security:**
- No sensitive data in repository
- `.gitignore` for config files
- Commit message template for consistency
- Branch protection for main branch

---

## API DOCUMENTATION

### Endpoints

#### POST /api/partner
**Purpose:** Submit partner registration form

**Request Body:**
```json
{
  "tipo": "institucional|collab|revenda|catalogo|reuniao",
  "nome": "string (required)",
  "empresa": "string (required)",
  "email": "string (required, email format)",
  "telefone": "string (optional)",
  "site": "string (optional)",
  "segmento": "string (optional)",
  "porte": "string (optional)",
  "orcamento": "string (optional)",
  "prazo": "string (optional)",
  "quantidade": "string (optional)",
  "como_conheceu": "string (optional)",
  "newsletter": "on|off (optional)",
  "mensagem": "string (required)",
  "website": "string (honeypot, should be empty)"
}
```

**Success Response (200):**
```json
{
  "ok": true,
  "id": "uuid-string",
  "message": "Cadastro recebido com sucesso."
}
```

**Error Responses:**
- 400: Missing required fields or invalid email
- 429: Rate limit exceeded
- 500: Internal server error

#### GET /api/health
**Purpose:** Health check endpoint

**Response (200):**
```json
{
  "ok": true,
  "port": 8123,
  "runtime": "deno|node",
  "emailConfigured": true|false
}
```

### Storage Format

**Submission Record:**
```json
{
  "id": "uuid-string",
  "timestamp": "ISO-8601 datetime",
  "ip": "client-ip-address",
  "tipo": "partnership-type",
  "nome": "submitter-name",
  "empresa": "company-name",
  "email": "email-address",
  "telefone": "phone-number",
  "site": "website",
  "segmento": "business-segment",
  "porte": "company-size",
  "orcamento": "budget-range",
  "prazo": "timeline",
  "quantidade": "estimated-quantity",
  "como_conheceu": "discovery-source",
  "newsletter": "on|off",
  "mensagem": "message-content"
}
```

### Email Notification Format

**Subject:** `[Oxford Brasil] {Type} — {Company}`

**HTML Template:**
- Professional email design
- Oxford branding (red accent)
- Formatted submission data
- Secure HTML escaping
- Mobile-responsive layout

**Text Template:**
- Plain text alternative
- Formatted data fields
- Complete submission details
- ID and timestamp reference

---

## DEVELOPMENT WORKFLOW

### Git Workflow

**Branch Strategy:**
- `main` - Production-ready code
- Feature branches for new developments
- Direct commits to main for small fixes

**Commit Guidelines:**
- Use conventional commit format
- Reference issue numbers when applicable
- Keep commits focused and atomic
- Include clear descriptions

**Commit Message Template:**
```
type(scope): subject

body

footer
```

**Types:** feat, fix, docs, style, refactor, test, chore

### Code Review Process

**Self-Review Checklist:**
- Code follows project conventions
- No hardcoded credentials
- Error handling implemented
- Accessibility considered
- Performance impact assessed
- Security implications reviewed

**Testing Before Commit:**
- Test locally with Node.js
- Test email functionality if applicable
- Verify responsive design
- Check console for errors
- Validate form submissions

### Deployment Process

**Pre-Deployment Checklist:**
- All tests passing locally
- Environment variables configured
- Email functionality tested
- No sensitive data in code
- Git status clean
- Documentation updated if needed

**Deployment Steps:**
1. Commit and push to main branch
2. Monitor Deno Deploy dashboard
3. Verify deployment success
4. Test production functionality
5. Monitor error logs

**Post-Deployment:**
- Monitor submission rate
- Check email delivery
- Review error logs
- Gather user feedback
- Plan next improvements

---

## TROUBLESHOOTING

### Common Issues

**Server Won't Start:**
- Check if port 8123 is available
- Verify Node.js installation
- Check dependencies are installed
- Review server.js for syntax errors

**Email Not Sending:**
- Verify RESEND_API_KEY is set correctly
- Check Resend API status
- Validate email addresses
- Check Deno Deploy environment variables
- Review server logs for error messages

**Form Submission Failing:**
- Check rate limiting status
- Verify required fields are present
- Test email validation
- Review server console for errors
- Check network connectivity

**Animations Not Working:**
- Verify GSAP library is loaded
- Check browser console for JavaScript errors
- Test in different browsers
- Verify reduced motion preferences
- Check CSS file loading

**Deployment Failures:**
- Check Deno Deploy dashboard for errors
- Verify deno.json configuration
- Review git repository status
- Check environment variable configuration
- Review deployment logs

### Debugging Tools

**Local Development:**
- Browser developer tools (F12)
- Console logs in server.js
- Network tab for API requests
- Application tab for local storage

**Production Debugging:**
- Deno Deploy logs
- Health check endpoint
- Email delivery status
- Error monitoring (if implemented)

### Performance Issues

**Slow Page Load:**
- Check asset sizes
- Optimize images
- Review GSAP animation complexity
- Check network connectivity
- Consider CDN for static assets

**High Memory Usage:**
- Review rate limit Map size
- Check for memory leaks
- Monitor Deno KV usage
- Optimize image processing
- Review dependency sizes

---

## FUTURE ROADMAP

### Planned Features

**Short-term (1-3 months):**
- Enhanced portfolio gallery with lightbox
- Additional partnership type options
- Improved mobile experience
- Enhanced form validation
- Additional language support (English)

**Medium-term (3-6 months):**
- 3D product gallery with 360° rotation
- Interactive block builder tool
- Product personalization preview
- Advanced analytics integration
- Customer portal for submission tracking

**Long-term (6-12 months):**
- Multi-language support
- Advanced CRM integration
- Automated follow-up sequences
- Enhanced collaboration tools
- VR/AR product visualization

### Technical Improvements

**Performance:**
- Implement service worker for offline support
- Advanced image optimization
- CDN integration for global performance
- Database optimization for scaling
- Caching strategy improvements

**Security:**
- Enhanced bot detection
- CSRF protection
- Advanced rate limiting
- Security audit integration
- GDPR compliance measures

**Developer Experience:**
- Hot-reload development server
- Automated testing framework
- CI/CD pipeline enhancement
- Enhanced documentation
- Deployment automation

---

## KEY CONTACTS & RESOURCES

### Project Resources

**Repository:** https://github.com/financenexus/oxfordblock-v2.git  
**Production URL:** https://oxfordblock-v2.financenexus.deno.net/  
**Organization:** financenexus  
**Deno Deploy Project:** oxfordblock

### External Services

**Deno Deploy:** https://dash.deno.com/  
**Resend Email:** https://resend.com/  
**Oxford Korea:** https://oxfordtoy.co.kr/ (official source)

### Documentation Files

**Project Documentation:**
- `PRODUCT.md` - Product specification and requirements
- `APRESENTACAO_OWNER.md` - Owner presentation (Portuguese)
- `OWNER_FEEDBACK_CHECKLIST.md` - Feedback checklist
- `RESUMO_FASES.md` - Development phase summary (Portuguese)
- `COMPLETE_PROJECT_DOCUMENTATION.md` - This comprehensive guide

### Development Tools

**Required:**
- Node.js: https://nodejs.org/
- Git: https://git-scm.com/
- Code editor: VS Code, Cursor, or similar

**Optional:**
- Deno CLI: https://deno.land/
- Deno Deploy account: https://dash.deno.com/

### Support Channels

**For Development Issues:**
- GitHub Issues: https://github.com/financenexus/oxfordblock-v2/issues
- Deno Deploy Support: https://deno.com/deploy/docs
- Resend Support: https://resend.com/docs

**For Business Inquiries:**
- Use partner form on website
- Email: Configured in environment variables
- Contact via Oxford Brasil channels

---

## APPENDICES

### A. Environment Variable Reference

**Complete List:**
- `PORT` - Server port (default: 8123)
- `RESEND_API_KEY` - Resend API key for email
- `MAIL_TO` - Destination email for submissions
- `MAIL_FROM` - Sender email address

**Deno Deploy Specific:**
- `DENO_DEPLOYMENT_ID` - Auto-generated deployment ID
- `DENO_REGION` - Deployment region

### B. File Size Reference

**Key Files:**
- index.html: 137KB
- parceiro.html: 36KB
- server.js: 11KB
- cursor.js: 3.6KB
- cursor.css: 842B
- package.json: 412B
- deno.json: 217B

**Assets:**
- oxford-logo-official-master.png: 2.2MB
- oxford-intro.mp4: 2.5MB
- mbc-helicopter.mp4: 3.1MB
- Total assets: ~11MB

### C. API Error Codes

**HTTP Status Codes:**
- 200: Success
- 400: Bad Request (validation error)
- 429: Too Many Requests (rate limit)
- 500: Internal Server Error

**Error Messages:**
- "Campos obrigatórios faltando: [fields]"
- "E-mail inválido."
- "Muitas tentativas. Tente novamente em 1 hora ou nos escreva por e-mail."
- "Erro interno. Tente novamente ou nos contate por e-mail."

### D. Browser Compatibility

**Supported Browsers:**
- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

**Required Features:**
- ES6+ JavaScript support
- CSS Grid and Flexbox
- GSAP animation library
- Modern HTML5 features

### E. Performance Metrics

**Target Metrics:**
- Page load time: < 3 seconds
- First Contentful Paint: < 1.5 seconds
- Time to Interactive: < 4 seconds
- Animation frame rate: 60fps
- Mobile performance score: > 90

---

## CHANGE LOG

### Version 1.0.0 (Current)

**Initial Release Features:**
- Cinematic motion engine with GSAP
- Custom block icon system
- Partner registration form
- Email notification system
- Portfolio gallery with filtering
- Responsive design
- Security implementation
- Dual runtime support (Node/Deno)

**Recent Updates:**
- Cursor click jump fixes
- FAQ layout improvements
- Shadow PNG cursor replaced with SVG
- GPU-layered continuous background bricks
- Solution card button alignment
- Hero section enhancements

---

## PRODUCT LINE CARD STANDARD (CATS Accordion)

**Applies to:** "Linha de Produtos" section — `#catList`, driven by the `CATS` array and its renderer in `index.html`.  
**Approved:** September 27, 2026 (Brickmania — King Tiger is the reference implementation)

### Card Data Contract
```js
{t:'Name', tag:'Category', d:'Description (PT-BR)', photo:'assets/<slug>.webp', videos:['assets/<slug>.mp4']}
```
`photo` and `videos` are optional; cards without media show the `.catNoMedia` placeholder.

### Layout Standard
- `.catBody` — flex row: `.catContent` on the left (title / tag / description), `.catShot` on the right.
- `.catShot`: fixed 240px box, `object-fit:contain`, framed with 1px `var(--line)` border, 6px radius, inset margins (18px). The full product image is always visible — never cropped or overlapped.
- Mobile (<640px): `.catBody` stacks vertically with the photo on top (150px height).
- Photo cards do **not** render `.catMore` ("▶ Ver vídeo") — the photo itself is the affordance. Text-only cards keep `.catMore`.
- No overlay badges or play icons on the photo.

### Behavior Standard
- Clicking anywhere on the card toggles `.is-open` → `.catExpand` (grid-template-rows transition) drops the video down and calls `play()`. Only one card stays open — the others close and pause their video.
- Expanded area: video (16:9) + CTA row — "Solicitar catálogo" link (`parceiro.html?t=revenda`) and "WhatsApp" button (opens the quick-quote sheet pre-selected to that line).

### Media Asset Standard
- Photos: WebP, ≤1600px wide, quality ~82 (e.g., produced with `sharp`).
- Videos: h264 mp4 **with audio track** — sound is user-controlled, never auto-played.
- Playback is **muted by default** (`muted` attribute). An "Ativar som" pill button overlays the video bottom-left (`.catVidBar`/`.vMute`) and toggles mute/unmute, swapping speaker icon + label ("Ativar som"/"Desativar som") and turning red while active. No fullscreen button — kept minimal by owner decision.
- `<video>` uses `muted loop playsinline preload="metadata"`.
- Asset naming: `assets/<slug>.webp` / `assets/<slug>.mp4` (e.g., `brickmania-king-tiger.webp`).

---

## CONCLUSION

This comprehensive documentation provides complete context for the Oxford Blocks Brasil project, enabling seamless transition between development environments and ensuring all critical information is preserved for future development work.

The project represents a professional, production-ready brand presentation website with sophisticated animations, robust form handling, and flexible deployment capabilities. The dual runtime support (Node.js for local development, Deno for production) provides development flexibility while maintaining production reliability.

For questions or issues not covered in this documentation, refer to the project repository or contact the development team through the established channels.

---

**Document Version:** 1.0  
**Last Updated:** September 18, 2026  
**Maintained By:** Development Team  
**Project Status:** Production-Ready ✅