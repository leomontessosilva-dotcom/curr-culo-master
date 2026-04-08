-- Tabela para guardar posts do LinkedIn criados por cada usuário
create table linkedin_posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  topic text not null,
  goal text,
  audience text,
  tone text,
  format text,
  post_content text not null,
  tips text[] default '{}',
  created_at timestamp with time zone default now()
);

-- Índice para buscar posts por usuário ordenados por data
create index idx_linkedin_posts_user on linkedin_posts(user_id, created_at desc);

-- RLS (Row Level Security)
alter table linkedin_posts enable row level security;

create policy "Users can view own posts"
  on linkedin_posts for select
  using (auth.uid() = user_id);

create policy "Users can insert own posts"
  on linkedin_posts for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own posts"
  on linkedin_posts for delete
  using (auth.uid() = user_id);
