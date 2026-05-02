import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || supabaseUrl.includes('your-project-id')) {
  console.warn(
    '[FriendUs] Supabase not configured yet.\n' +
    'Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.\n' +
    'The app will run in offline/demo mode until then.'
  );
}

export const supabase = createClient(
  supabaseUrl  || 'https://placeholder.supabase.co',
  supabaseKey  || 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

// ─── Convenience helpers ───────────────────────────────────────────────────

/** Fetch full profile row for the current user */
export async function fetchProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
  return data;
}

/** Upsert profile fields */
export async function upsertProfile(userId, fields) {
  const { error } = await supabase
    .from('profiles')
    .upsert({ id: userId, ...fields }, { onConflict: 'id' });
  if (error) throw error;
}

/** Fetch all connections for the current user */
export async function fetchConnections(userId) {
  const { data, error } = await supabase
    .from('connections')
    .select('*')
    .eq('user_id', userId)
    .order('connected_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

/** Insert a new connection */
export async function insertConnection(userId, conn) {
  const { error } = await supabase.from('connections').insert({
    user_id:           userId,
    friend_id:         String(conn.id),
    friend_alias:      conn.alias,
    friend_avatar:     conn.avatar,
    friend_avatar_color: conn.avatarColor,
    match_score:       conn.matchScore,
    connected_at:      new Date(conn.connectedAt).toISOString(),
    friend_meta:       {
      likes:       conn.likes,
      dislikes:    conn.dislikes,
      interests:   conn.interests,
      visionBoard: conn.visionBoard,
      personality: conn.personality,
      values:      conn.values,
      icebreaker:  conn.icebreaker,
      distance:    conn.distance,
    },
  });
  if (error) throw error;
}

/** Fetch messages for a specific connection thread */
export async function fetchMessages(userId, connectionId) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('user_id', userId)
    .eq('connection_id', String(connectionId))
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data || [];
}

/** Insert a single message */
export async function insertMessage(userId, connectionId, msg) {
  const { error } = await supabase.from('messages').insert({
    user_id:       userId,
    connection_id: String(connectionId),
    from_role:     msg.from,
    type:          msg.type || 'text',
    text:          msg.text,
    time:          msg.time,
    meta:          {
      promptIcon: msg.promptIcon,
      items:      msg.items,
    },
  });
  if (error) throw error;
}

// ─── SQL schema (run once in Supabase SQL editor) ──────────────────────────
/*
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  alias text not null,
  likes text[] default '{}',
  dislikes text[] default '{}',
  interests text[] default '{}',
  values text[] default '{}',
  vibe_board jsonb default '[]',
  discovery_board jsonb default '[]',
  red_flag_board jsonb default '[]',
  green_flag_board jsonb default '[]',
  profile_complete boolean default false,
  stripe_customer_id text,
  subscription_status text default 'free',
  created_at timestamptz default now()
);

create table connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  friend_id text not null,
  friend_alias text not null,
  friend_avatar text,
  friend_avatar_color text,
  match_score int,
  connected_at timestamptz default now(),
  friend_meta jsonb default '{}'
);

create table messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  connection_id text not null,
  from_role text not null,
  type text default 'text',
  text text not null,
  time text,
  meta jsonb default '{}',
  created_at timestamptz default now()
);

alter table profiles    enable row level security;
alter table connections enable row level security;
alter table messages    enable row level security;

create policy "own profile"     on profiles    for all using (auth.uid() = id);
create policy "own connections" on connections for all using (auth.uid() = user_id);
create policy "own messages"    on messages    for all using (auth.uid() = user_id);
*/
