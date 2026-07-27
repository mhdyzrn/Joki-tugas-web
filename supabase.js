/**
 * Supabase Database Integration for TugasBeres & Web Applications
 * Connects directly to Supabase Postgres backend database.
 */

// Supabase Configuration - Set your keys via environment variables or window config
const SUPABASE_URL = window.SUPABASE_URL || "https://your-supabase-project.supabase.co";
const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || "your-anon-key-here";

let supabaseClient = null;

// Initialize Supabase Client
function getSupabaseClient() {
    if (!supabaseClient && window.supabase) {
        try {
            supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log("⚡ Supabase Client initialized successfully.");
        } catch (err) {
            console.warn("⚠️ Supabase Client init fallback:", err.message);
        }
    }
    return supabaseClient;
}

/**
 * Save Order to Supabase Database (`orders` table)
 */
async function saveOrderToSupabase(orderData) {
    const db = getSupabaseClient();
    if (!db) {
        console.log("ℹ️ Supabase not configured yet. Skipping DB order save.");
        return { success: false, mode: 'local' };
    }

    try {
        const { data, error } = await db
            .from('orders')
            .insert([
                {
                    service_name: orderData.serviceName,
                    quantity_text: orderData.qtyText,
                    deadline: orderData.deadlineText,
                    subject: orderData.subjectText,
                    total_price: orderData.totalPriceText,
                    promo_claimed: orderData.promoClaimed || false,
                    status: 'pending',
                    created_at: new Date().toISOString()
                }
            ]);

        if (error) throw error;
        console.log("✅ Order saved to Supabase:", data);
        return { success: true, data };
    } catch (err) {
        console.error("❌ Error saving order to Supabase:", err.message);
        return { success: false, error: err.message };
    }
}

/**
 * Save Plagiarism Scan Log to Supabase (`plagiarism_scans` table)
 */
async function savePlagiarismScanToSupabase(scanData) {
    const db = getSupabaseClient();
    if (!db) return;

    try {
        const { data, error } = await db
            .from('plagiarism_scans')
            .insert([
                {
                    text_snippet: scanData.text.substring(0, 300),
                    word_count: scanData.wordCount,
                    originality_score: scanData.origScore,
                    similarity_score: scanData.plagScore,
                    created_at: new Date().toISOString()
                }
            ]);

        if (error) throw error;
        console.log("✅ Plagiarism scan logged to Supabase");
    } catch (err) {
        console.warn("⚠️ Could not log plagiarism scan:", err.message);
    }
}

/**
 * Fetch Testimonials from Supabase (`testimonials` table)
 */
async function fetchTestimonialsFromSupabase() {
    const db = getSupabaseClient();
    if (!db) return null;

    try {
        const { data, error } = await db
            .from('testimonials')
            .select('*')
            .eq('approved', true)
            .order('created_at', { ascending: false })
            .limit(10);

        if (error) throw error;
        return data;
    } catch (err) {
        console.warn("⚠️ Could not fetch testimonials from Supabase:", err.message);
        return null;
    }
}

/**
 * Submit New Testimonial to Supabase
 */
async function submitTestimonialToSupabase(name, role, comment, rating = 5) {
    const db = getSupabaseClient();
    if (!db) return false;

    try {
        const { data, error } = await db
            .from('testimonials')
            .insert([
                {
                    client_name: name,
                    client_role: role,
                    comment: comment,
                    rating: rating,
                    approved: true, // auto approve or false for moderation
                    created_at: new Date().toISOString()
                }
            ]);

        if (error) throw error;
        return true;
    } catch (err) {
        console.error("❌ Error submitting testimonial:", err.message);
        return false;
    }
}

// Auto init on load
window.addEventListener('DOMContentLoaded', () => {
    getSupabaseClient();
});
