# SCC Adjusters to Next.js 16 Structure - Migration Checklist

## Overview
This checklist guides the migration from root-level structure to a modern `src/`-based Next.js 16 structure.

**Total Estimated Time: 5-7 hours**  
**Difficulty: Medium**

---

## PHASE 1: Directory Structure Migration (2-3 hours)

### 1.1 Create src/ Directory
- [ ] Create `/src` folder at project root
- [ ] Verify creation with: `mkdir -p /src`

### 1.2 Move app/ Directory
```bash
# Copy app/ to src/app/
cp -r app/* src/app/
# Verify copy
ls -la src/app/
```
- [ ] Verify all app routes exist in `src/app/`
- [ ] Keep original `app/` until full migration complete
- [ ] Check git status: `git status`

### 1.3 Move components/ Directory
```bash
cp -r components/* src/components/
```
- [ ] Verify all components exist in `src/components/`
- [ ] Check subdirectories: ui/, claims/, dashboard/, layout/

### 1.4 Move lib/ Directory
```bash
cp -r lib/* src/lib/
```
- [ ] Verify all lib subdirectories copied
- [ ] Verify count: `find src/lib -type d | wc -l` should match original

### 1.5 Move hooks/ Directory
```bash
cp -r hooks/* src/hooks/
```
- [ ] Verify hooks directory exists: `ls -la src/hooks/`
- [ ] Check: `find src/hooks -name "*.ts" | wc -l`

### 1.6 Move contexts/ Directory
```bash
cp -r contexts/* src/contexts/
```
- [ ] Verify: `ls -la src/contexts/`

### 1.7 Move middleware.ts
```bash
cp middleware.ts src/middleware.ts
```
- [ ] Verify: `ls -la src/middleware.ts`

### 1.8 Clean up old directories (after validation)
```bash
# Only after full migration testing!
rm -rf app/ components/ lib/ hooks/ contexts/
rm middleware.ts
```
- [ ] **DO NOT do this yet** - keep originals until all tests pass

---

## PHASE 2: Route Organization (1-2 hours)

### 2.1 Create Route Groups Structure
```bash
# Create (marketing) group
mkdir -p src/app/\(marketing\)/{_components,demo,landing,pricing,pricing-print}

# Create (admin) group  
mkdir -p src/app/\(admin\)/{_components}

# Add _components to dashboard
mkdir -p src/app/dashboard/_components
```
- [ ] Verify structure with: `tree src/app -L 2`

### 2.2 Move Marketing Routes
Move these pages into `src/app/(marketing)/`:
```bash
# These should be moved:
# src/app/demo/page.tsx → src/app/(marketing)/demo/page.tsx
# src/app/landing/page.tsx → src/app/(marketing)/landing/page.tsx
# src/app/pricing/page.tsx → src/app/(marketing)/pricing/page.tsx
# src/app/pricing-print/page.tsx → src/app/(marketing)/pricing-print/page.tsx
```
- [ ] Move demo/ page and any components
- [ ] Move landing/ page and any components
- [ ] Move pricing/ page and any components
- [ ] Move pricing-print/ page and any components
- [ ] Update import paths in moved files

### 2.3 Move Admin Routes
```bash
# Move admin pages to (admin) group
# src/app/admin/ → src/app/(admin)/
```
- [ ] Move admin page.tsx
- [ ] Move claims-center/ subdirectory
- [ ] Update import paths

### 2.4 Create Private Components
Move page-specific components to `_components/`:
```bash
# In src/app/(marketing)/_components/
# Move: HeroSection, PricingCard, DemoWizard, etc.

# In src/app/admin/_components/
# Move: AdminPanel components, etc.

# In src/app/dashboard/_components/
# Move: SidebarNav, DashboardCard, etc.
```
- [ ] Create `_components` folder in (marketing)
- [ ] Create `_components` folder in admin (optional)
- [ ] Create `_components` folder in dashboard
- [ ] Move marketing page components to (marketing)/_components/
- [ ] Move admin page components to (admin)/_components/
- [ ] Move dashboard page components to dashboard/_components/
- [ ] Create index.ts barrel exports in each _components/
- [ ] Update imports in pages

### 2.5 Verify Route Structure
- [ ] Check: `find src/app -name "page.tsx" | wc -l`
- [ ] Verify all routes still work after structure changes
- [ ] Update internal route links (if using relative imports)

---

## PHASE 3: Configuration Updates (30 minutes)

### 3.1 Update tsconfig.json
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/app/*": ["./src/app/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/contexts/*": ["./src/contexts/*"],
      "@/hooks/*": ["./src/hooks/*"]
    }
  }
}
```
- [ ] Open `tsconfig.json`
- [ ] Change `"@/*": ["./*"]` to `"@/*": ["./src/*"]`
- [ ] Add additional path aliases (optional but recommended)
- [ ] Verify no syntax errors

### 3.2 Update tailwind.config.ts
```typescript
content: [
  './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  './src/app/**/*.{js,ts,jsx,tsx,mdx}',
],
```
- [ ] Open `tailwind.config.ts`
- [ ] Remove `./pages/**/*.{js,ts,jsx,tsx,mdx}` line (deprecated)
- [ ] Change `./components/**` to `./src/components/**`
- [ ] Change `./app/**` to `./src/app/**`
- [ ] Verify syntax is correct

### 3.3 Update next.config.js (if needed)
- [ ] Check for any hardcoded paths pointing to `app/`, `components/`, or `lib/`
- [ ] Update any found paths to use `src/` prefix
- [ ] Test configuration: `npm run build` (should not error)

### 3.4 Check and Update .env.local (if needed)
- [ ] Review .env.local for any path-related variables
- [ ] No changes usually needed, but verify

---

## PHASE 4: Add Special Files (1 hour)

### 4.1 Create Global Error Boundary
Create `src/app/error.tsx`:
```typescript
'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h2 className="text-2xl font-bold">Something went wrong!</h2>
      <button
        onClick={() => reset()}
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-white"
      >
        Try again
      </button>
    </div>
  )
}
```
- [ ] Create file: `src/app/error.tsx`
- [ ] Paste error component code
- [ ] Verify no syntax errors

### 4.2 Create Global Loading State
Create `src/app/loading.tsx`:
```typescript
export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="animate-spin">
        <div className="h-12 w-12 rounded-full border-4 border-gray-300 border-t-blue-500"></div>
      </div>
    </div>
  )
}
```
- [ ] Create file: `src/app/loading.tsx`
- [ ] Paste loading component code
- [ ] Verify styling matches your brand

### 4.3 Create Custom 404 Page
Create `src/app/not-found.tsx`:
```typescript
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">404</h1>
      <h2 className="text-2xl font-semibold">Page Not Found</h2>
      <p className="mt-2 text-gray-600">
        The page you're looking for doesn't exist.
      </p>
      <Link href="/" className="mt-4 text-blue-500 hover:underline">
        Return Home
      </Link>
    </div>
  )
}
```
- [ ] Create file: `src/app/not-found.tsx`
- [ ] Paste not-found component code
- [ ] Update styling to match your brand
- [ ] **Reference from stellar project:** `/Users/diodelahoz/Projects/stellar/src/app/`

### 4.4 Verify Special Files
- [ ] Check all three files exist: `ls -la src/app/{error,loading,not-found}.tsx`
- [ ] No import errors when building

---

## PHASE 5: Cleanup (30 minutes)

### 5.1 Verify Project Still Works
```bash
# Full rebuild test
npm run build

# Check for TypeScript errors
npx tsc --noEmit

# Lint check
npm run lint

# Dev server test
npm run dev
```
- [ ] Build completes without errors
- [ ] No TypeScript errors
- [ ] Lint passes
- [ ] Dev server starts successfully
- [ ] Test page loads: http://localhost:3000/

### 5.2 Remove Obsolete Root-Level Files

Move scripts to `/scripts/`:
```bash
mv check-kb.sh scripts/
mv check-qlik-api.sh scripts/
mv test-load-speed.sh scripts/
```
- [ ] Move `check-kb.sh` → `scripts/`
- [ ] Move `check-qlik-api.sh` → `scripts/`
- [ ] Move `test-load-speed.sh` → `scripts/`
- [ ] Move `simple-debug.js` → `scripts/`

Move or delete backup/screenshot files:
```bash
mkdir -p docs/assets
mv theme-after-click.png docs/assets/
mv theme-initial.png docs/assets/
rm tailwind.config.backup.ts
rm console-audit-full.json
```
- [ ] Move screenshots to `docs/assets/`
- [ ] Delete `tailwind.config.backup.ts`
- [ ] Delete `console-audit-full.json`
- [ ] Delete `tsconfig.tsbuildinfo`

Update .gitignore:
- [ ] Ensure `tsconfig.tsbuildinfo` is in .gitignore
- [ ] Ensure `.next` is in .gitignore
- [ ] Ensure `node_modules` is in .gitignore

### 5.3 Remove Old Directories
```bash
# Only after all tests pass!
rm -rf app/
rm -rf components/
rm -rf lib/
rm -rf hooks/
rm -rf contexts/
rm middleware.ts
```
- [ ] **IMPORTANT:** Only do this after all tests pass
- [ ] Verify with: `git status` (should show deleted files)
- [ ] Double-check src/ directory has everything needed

### 5.4 Update Git
```bash
git add -A
git commit -m "refactor: migrate to src/ directory structure and Next.js 16 best practices

- Move app/, components/, lib/, hooks/, contexts/ to src/
- Create route groups: (marketing), (admin)
- Add private _components folders for route-scoped components
- Update tsconfig.json paths to ./src/*
- Update tailwind.config.ts content paths
- Add error.tsx, loading.tsx, not-found.tsx special files
- Clean up obsolete scripts and files
- Update all internal imports"
```
- [ ] Review git diff: `git diff --cached`
- [ ] Commit changes
- [ ] Verify commit: `git log -1`

---

## PHASE 6: Testing & Validation (1 hour)

### 6.1 Manual Testing
- [ ] Homepage loads: http://localhost:3000/
- [ ] Marketing pages load: http://localhost:3000/(marketing)/landing
- [ ] Dashboard loads: http://localhost:3000/dashboard
- [ ] Admin pages load: http://localhost:3000/(admin)/
- [ ] API routes work: test at least 2 API endpoints
- [ ] Error boundary triggers: try invalid route → /invalid-page
- [ ] Loading state visible: check network tab for slow loading

### 6.2 Component Testing
- [ ] Verify shared components import correctly from `/components/`
- [ ] Verify page-specific components import from `./_components/`
- [ ] Check TypeScript compilation: `npx tsc --noEmit`
- [ ] Check for import errors in console

### 6.3 Build Testing
```bash
# Production build test
npm run build
npm start
```
- [ ] Production build succeeds
- [ ] Production server starts
- [ ] Pages load from production server
- [ ] No hydration errors in console
- [ ] Performance is acceptable

### 6.4 Edge Cases
- [ ] Test 404 page: navigate to `/does-not-exist`
- [ ] Test loading: use network throttling on slow connection
- [ ] Test error state: try to trigger error in a page
- [ ] Check theme switching: if applicable
- [ ] Check all environment variables load

---

## PHASE 7: Documentation Updates (15 minutes)

### 7.1 Update CLAUDE.md
- [ ] Update project structure section to reflect new src/ layout
- [ ] Update import examples to use new paths
- [ ] Add route group documentation
- [ ] Document _components pattern

### 7.2 Update README.md
- [ ] Update folder structure diagram
- [ ] Update getting started guide if needed
- [ ] Add notes about src/ directory

### 7.3 Create docs/STRUCTURE.md (Optional)
- [ ] Document the new structure
- [ ] Provide examples of how to add new pages
- [ ] Document the _components pattern
- [ ] Document when to use route groups

---

## FINAL CHECKLIST

- [ ] All tests pass
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] No build warnings
- [ ] All pages accessible
- [ ] Git commit created
- [ ] Documentation updated
- [ ] Team notified of structure change
- [ ] Code review completed (if applicable)

---

## Rollback Plan (If Needed)

If something goes wrong during migration:

```bash
# Revert last commit
git reset --hard HEAD~1

# Or use git reflog to find the right commit
git reflog
git reset --hard <commit-hash>
```

- [ ] Keep the old root directories until absolutely certain migration is complete
- [ ] Consider merging to separate branch first for safety
- [ ] Have team review structure before deleting old directories

---

## Post-Migration Notes

### For Team Communication
"We've migrated the project structure to follow Next.js 16 best practices:
- All source code now in `src/` directory
- Routes organized in (marketing), (admin), and dashboard groups
- Page-specific components in `_components` folders
- Updated all import paths
- Added global error handling and loading states"

### For Future Development
- Add new pages to appropriate route groups
- Place page-specific components in `_components/` folder
- Use route groups to organize related features
- Keep `components/` for truly shared components only

---

## References
- Stellar Project Structure: `/Users/diodelahoz/Projects/stellar/src/`
- Full Audit Report: `docs/STRUCTURE_AUDIT_REPORT.md`
- Next.js Docs: https://nextjs.org/docs/getting-started/project-structure
