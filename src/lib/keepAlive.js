import { supabase } from '../supabaseClient'

// Ping the DB every 4 minutes to prevent sleep
export function startKeepAlive() {
  const ping = () => supabase.from('words').select('id').limit(1)
  ping()
  setInterval(ping, 4 * 60 * 1000)
}