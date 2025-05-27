
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the user from the JWT token
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (req.method === 'POST') {
      // For demo purposes, we'll simulate Instagram account connection
      // In a real app, this would handle the Instagram OAuth flow
      const { username } = await req.json()

      console.log('Connecting Instagram account for user:', user.id)

      const { data: account, error: accountError } = await supabase
        .from('instagram_accounts')
        .insert({
          user_id: user.id,
          instagram_user_id: `demo_${Date.now()}`,
          username: username,
          access_token: `demo_token_${Date.now()}`,
          is_active: true
        })
        .select()
        .single()

      if (accountError) {
        console.error('Error connecting Instagram account:', accountError)
        return new Response(JSON.stringify({ error: 'Failed to connect account' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      return new Response(JSON.stringify({ 
        success: true, 
        account: account 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (req.method === 'GET') {
      // Get user's connected Instagram accounts
      const { data: accounts, error: accountsError } = await supabase
        .from('instagram_accounts')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)

      if (accountsError) {
        console.error('Error fetching Instagram accounts:', accountsError)
        return new Response(JSON.stringify({ error: 'Failed to fetch accounts' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      return new Response(JSON.stringify({ 
        accounts: accounts || [] 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

  } catch (error) {
    console.error('Error in instagram-auth function:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
