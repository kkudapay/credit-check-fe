'use client'

import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'

const createClient = () => createPagesBrowserClient()
const supabase = createClient();
export default supabase;