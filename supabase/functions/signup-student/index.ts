// supabase/functions/signup-student/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )
    
    const { email, password, fullName, registrationCode } = await req.json()
    if (!email || !password || !fullName || !registrationCode) {
      throw new Error("Semua field harus diisi: email, password, nama lengkap, dan kode registrasi.");
    }

    // --- LOGIKA UTAMA PENJAGA GERBANG ---

    // 1. Periksa validitas kode registrasi
    const { data: codeData, error: codeError } = await supabaseAdmin
      .from('registration_codes')
      .select('*')
      .eq('code', registrationCode)
      .single()

    if (codeError || !codeData) {
      throw new Error("Kode registrasi tidak valid.")
    }

    if (codeData.uses_left !== null && codeData.uses_left <= 0) {
      throw new Error("Kode registrasi sudah habis digunakan.")
    }
    
    // (Opsional) Cek jika kode sudah kedaluwarsa
    if (codeData.expires_at && new Date(codeData.expires_at) < new Date()) {
      throw new Error("Kode registrasi sudah kedaluwarsa.")
    }

    // 2. Jika kode valid, buat pengguna baru di Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
    })
    if (authError) throw authError

    const newUserId = authData.user.id
    
    // 3. Masukkan data ke tabel profiles
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({ id: newUserId, full_name: fullName, role: codeData.role_to_assign })

    if (profileError) {
      // Jika gagal buat profil, hapus user auth yang sudah terlanjur dibuat (rollback)
      await supabaseAdmin.auth.admin.deleteUser(newUserId)
      throw profileError
    }

    // 4. Kurangi jatah pemakaian kode registrasi
    if (codeData.uses_left !== null) {
        const { error: updateCodeError } = await supabaseAdmin
            .from('registration_codes')
            .update({ uses_left: codeData.uses_left - 1 })
            .eq('id', codeData.id)
        if (updateCodeError) console.error("Gagal update jatah kode:", updateCodeError) // Tidak fatal, jadi hanya di-log
    }

    return new Response(JSON.stringify({ message: "Pendaftaran berhasil!" }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})