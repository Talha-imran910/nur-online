
Large scope — I'll ship it as one pass but flag anything I can't safely fix at the end. Confirm before I start.

## 1. React Query migration (highest priority)
Convert raw `useEffect + useState` fetches to `useQuery` with `staleTime: 60_000`:
- `Index.tsx` (featured courses via `FeaturedCourses.tsx`, `LatestBlog.tsx`)
- `Courses.tsx` → `["courses","published"]`
- `CourseDetail.tsx` → `["course", id]`
- `Blog.tsx` → `["blog","published"]`, `BlogPost.tsx` → `["blog", slug]`
- `AdminDashboard.tsx` → separate `useQuery` per section: `["admin","courses"]`, `["admin","students"]`, `["admin","live"]`, `["admin","blog"]`, `["admin","reviews"]`. No single Promise.all.
- All mutations (create/update/delete anywhere) call `queryClient.invalidateQueries({ queryKey: [...] })` instead of manual refetch/setState.
- Keep existing loading UI; drop the ad-hoc `subscribeToTables` polling on these pages (replace with `refetchOnWindowFocus` + invalidate on mutation).

## 2. Student reviews
- First: query `information_schema.columns` on live DB for `enrollments` to confirm actual column names before writing SQL.
- Migration: `reviews(id, course_id, student_id, rating int check 1..5, comment text, is_approved bool default false, created_at, updated_at)` + unique `(course_id, student_id)` + `updated_at` trigger + GRANTs.
- RLS:
  - SELECT: `is_approved = true` OR `student_id = auth.uid()` OR `has_role(auth.uid(),'teacher')`
  - INSERT: `student_id = auth.uid()` AND exists enrollment for that (student, course)
  - UPDATE: `student_id = auth.uid()` OR teacher (for approve/reject)
  - DELETE: teacher only
- Admin: new "Reviews" tab — Pending queue (approve/reject) + Approved reference list.
- CourseDetail: approved reviews list + real computed average; enrolled logged-in viewer without a review sees star-picker + comment form; if they already have one (pending/approved) show it back with its status.
- JSON-LD: add `aggregateRating` on Course only when ≥1 approved review (real values, never fabricated).

## 3. Bulk Add Lessons (paste)
Location: inside admin course editor, per-unit "Bulk Add Lessons" button opens a dialog.
- Textarea, one lesson per line.
- Parser: regex-split on ` - (https?://(?:www\.)?youtube\.com/watch\?v=[\w-]+)` so titles with hyphens (e.g. `Surah Al-Baqarah, Ayah 1-5`) parse correctly. Also accept `youtu.be/ID` and `&...` params. Extract `videoId`.
- Preview list of `{ title, videoId, youtubeUrl }` before save: inline-edit title, remove, ↑/↓ reorder (no drag lib).
- Target: current unit, or "New unit" inline field.
- Batch insert into `lessons` in one `supabase.from('lessons').insert([...])` respecting `sort_order` starting after existing max.
- Invalid lines skipped with a warning listing 1-indexed line numbers; never fail the whole paste.

## 4. Demo blog post
Insert via the normal `createBlogPost` flow (not raw SQL) on first admin load OR provide a one-click "Insert demo post" button in Blog tab (safer — no accidental duplicates). I'll go with the button so it's obviously a placeholder and idempotent. Exact copy as provided.

## 5. Audit pass
- **Images**: convert `hero-mosque.jpg`, `islamic-pattern.jpg`, `quran-calligraphy.jpg` (and any >150KB) to WebP with `cwebp` (via nix); update imports.
- **Unused deps**: run `depcheck`, verify manually with `rg` before removing.
- **Titles/meta**: re-audit every page's Helmet, list any duplicates/over-length.
- **robots.txt + sitemap**: verify current routes covered; disallow `/admin /dashboard /profile /login /player/`.
- **RLS audit**: query `pg_policies` for every relevant table; flag any `qual = true` leftover permissive policy.
- **PKR pricing**: switch displayed prices from `$` to `Rs ` / `PKR`. Change JSON-LD `priceCurrency` from `USD` → `PKR`. Keep raw `price` column value as-is (numeric). Locations: `CourseCard`, `CourseDetail`, admin `EditPriceDialog`, WhatsApp enroll message.
- **E2E check**: after all changes, drive Playwright through anon browse → register → login → enroll (free) → play a lesson (mobile viewport) → teacher admin flows. Report result.

## Technical details
- New file: `src/components/admin/BulkAddLessonsDialog.tsx`.
- New file: `src/components/admin/ReviewsTab.tsx`, `src/components/reviews/CourseReviews.tsx`.
- `db.ts`: add `fetchReviews`, `submitReview`, `approveReview`, `rejectReview`, `bulkInsertLessons`, keep types.
- Query keys namespaced: `["courses","published"]`, `["course", id]`, `["blog","published"]`, `["blog", slug]`, `["admin", section]`, `["reviews", courseId]`, `["review","mine", courseId, userId]`.
- Keep `subscribeToTables` available but stop using it where React Query owns the data.
- Migration file adds `reviews` table + policies + GRANTs (`authenticated`, `service_role`; `anon` SELECT for approved via policy — actually keep `anon` SELECT grant since approved reviews are public).

## What I will explicitly NOT do without your OK
- Delete any dependency I'm not 100% sure is unused — I'll list them for you instead.
- Change the numeric value of existing course prices (only the currency label/symbol).

Reply "go" and I'll execute the whole thing in one pass.
