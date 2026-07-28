-- ============================================================
-- SQL SCRIPT: HAPUS DATABASE & TABEL ADMIN SUPABASE
-- Project: TugasBeres (joki-tugas-web)
-- ============================================================

-- Drop Tabel Admin jika pernah dibuat
DROP TABLE IF EXISTS public.admin_users CASCADE;
DROP TABLE IF EXISTS public.admin_logs CASCADE;
DROP TABLE IF EXISTS public.admin_settings CASCADE;
DROP TABLE IF EXISTS public.admin_sessions CASCADE;

-- Drop Kebijakan RLS Khusus Admin jika ada
DROP POLICY IF EXISTS "Allow admin full access" ON public.orders;
DROP POLICY IF EXISTS "Allow admin full access" ON public.plagiarism_scans;
DROP POLICY IF EXISTS "Allow admin full access" ON public.testimonials;

-- Drop Fungsi & Trigger Admin jika ada
DROP FUNCTION IF EXISTS public.is_admin() CASCADE;

-- Catatan: Tabel utama pelanggan (`orders`, `plagiarism_scans`, `testimonials`)
-- tetap dipertahankan untuk transaksi website publik.
