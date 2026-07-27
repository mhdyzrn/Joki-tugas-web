/**
 * Supabase Database Integration for TugasBeres
 * Connects directly to Supabase Postgres backend database.
 */

// Supabase Configuration
const SUPABASE_URL = window.SUPABASE_URL || "https://ctzwszzdmkotsoiymkzx.supabase.co";
const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || "sb_publishable_EoOpmvGJMYTkB-IbYlgRXw_kl-wzZJ_";

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

// ============================================================
// 👑 ADMIN DASHBOARD FUNCTIONS
// ============================================================

/**
 * Fetch All Orders for Admin Panel
 */
async function fetchAllAdminOrders() {
    const db = getSupabaseClient();
    if (!db) return [];

    try {
        const { data, error } = await db
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (err) {
        console.error("❌ Admin fetch orders error:", err.message);
        return [];
    }
}

/**
 * Update Order Details (Status, Payment, File URL)
 */
async function updateOrderDetails(orderId, updateData) {
    const db = getSupabaseClient();
    if (!db) return { success: false };

    try {
        const { data, error } = await db
            .from('orders')
            .update(updateData)
            .eq('id', orderId);

        if (error) throw error;
        return { success: true, data };
    } catch (err) {
        console.error("❌ Admin update order error:", err.message);
        return { success: false, error: err.message };
    }
}

/**
 * Delete Order from Admin Panel
 */
async function deleteOrderFromAdmin(orderId) {
    const db = getSupabaseClient();
    if (!db) return false;

    try {
        const { error } = await db
            .from('orders')
            .delete()
            .eq('id', orderId);

        if (error) throw error;
        return true;
    } catch (err) {
        console.error("❌ Admin delete order error:", err.message);
        return false;
    }
}

/**
 * Fetch All Plagiarism Scans for Admin Panel
 */
async function fetchAllAdminPlagScans() {
    const db = getSupabaseClient();
    if (!db) return [];

    try {
        const { data, error } = await db
            .from('plagiarism_scans')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(20);

        if (error) throw error;
        return data || [];
    } catch (err) {
        return [];
    }
}

// Auto init on load
window.addEventListener('DOMContentLoaded', () => {
    getSupabaseClient();
});
