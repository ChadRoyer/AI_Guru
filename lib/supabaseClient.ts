'use client'

import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

export function getSupabaseClient() {
  if (!client) {
    client = createBrowserSupabaseClient()
  }
  return client
}
