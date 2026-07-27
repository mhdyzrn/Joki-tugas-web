-- ============================================================
-- SUPABASE DATABASE SCHEMA FOR NETLIFY DEPLOYMENT
-- Project: TugasBeres (joki-tugas-web)
-- ============================================================

-- 1. Create Table: `orders`
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    service_name TEXT NOT NULL,
    quantity_text TEXT NOT NULL,
    deadline TEXT NOT NULL,
    subject TEXT NOT NULL,
    total_price TEXT NOT NULL,
    promo_claimed BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
    client_contact TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Table: `plagiarism_scans`
CREATE TABLE IF NOT EXISTS public.plagiarism_scans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    text_snippet TEXT NOT NULL,
    word_count INT DEFAULT 0,
    originality_score INT DEFAULT 100,
    similarity_score INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Table: `testimonials`
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_name TEXT NOT NULL,
    client_role TEXT DEFAULT 'Mahasiswa',
    comment TEXT NOT NULL,
    rating INT DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plagiarism_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Create Policies for Anonymous Public Access (Insert & Select)
CREATE POLICY "Allow public insert to orders" ON public.orders
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read own orders" ON public.orders
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert to plagiarism_scans" ON public.plagiarism_scans
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public select approved testimonials" ON public.testimonials
    FOR SELECT USING (approved = true);

CREATE POLICY "Allow public insert to testimonials" ON public.testimonials
    FOR INSERT WITH CHECK (true);

-- Insert Sample Testimonials
INSERT INTO public.testimonials (client_name, client_role, comment, rating, approved) VALUES
('Rizky Pratama', 'Mahasiswa Universitas Nurul Huda', 'Sangat membantu pengerjaan proposal skripsi PAI! Hasil rapi, pembahasan mendalam, dan bebas plagiasi.', 5, true),
('Siti Nurhaliza', 'Mahasiswi PGMI', 'Respon sangat cepat, analisis data SPSS lengkap dengan penjelasan output & tabel.', 5, true),
('Ahmad Fauzi', 'Mahasiswa Teknik', 'Pengerjaan makalah & PPT sangat bagus dan cepat.', 5, true);
