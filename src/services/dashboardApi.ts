import type { ProjectData } from '../components/FrontPage/AboutLayer/ProjectModal';
import { supabase } from './supabaseClient';

const TABLES = {
  publicProjects: 'projects_public',
  internalProjects: 'projects_internal',
  repositories: 'repositories',
} as const;

export type PublicProjectRecord = {
  id: string;
  title: string;
  short_description?: string | null;
  full_description?: string | null;
  github_url?: string | null;
  live_url?: string | null;
  tech_stack?: unknown;
  images?: unknown;
  created_at?: string;
};

export type InternalProjectRecord = {
  id?: string;
  title: string;
  type?: string | null;
  status?: string | null;
  priority?: string | null;
  notes?: string | null;
  metadata?: Record<string, unknown> | null;
  created_at?: string;
};

export type RepositoryRecord = {
  id?: string;
  github_full_name: string;
  visibility?: string | null;
  stars?: number | null;
  forks?: number | null;
  language?: string | null;
  tags?: string[] | null;
  synced_at?: string;
};

const mapPublicRecordToProjectData = (record: PublicProjectRecord): ProjectData => ({
  id: record.id,
  title: record.title,
  shortDescription: record.short_description || '',
  fullDescription: record.full_description || '',
  githubUrl: record.github_url || undefined,
  liveUrl: record.live_url || undefined,
  techStack: (record.tech_stack as ProjectData['techStack']) || [],
  images: (record.images as ProjectData['images']) || [],
});

const buildPublicRecord = (
  input: Partial<ProjectData> & { id: string; title: string }
): PublicProjectRecord => ({
  id: input.id,
  title: input.title,
  short_description: input.shortDescription ?? null,
  full_description: input.fullDescription ?? null,
  github_url: input.githubUrl ?? null,
  live_url: input.liveUrl ?? null,
  tech_stack: input.techStack ?? null,
  images: input.images ?? null,
});

export async function fetchPublicProjects() {
  const query = supabase
    .from(TABLES.publicProjects)
    .select('*')
    .order('created_at', { ascending: false });

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapPublicRecordToProjectData);
}

export async function upsertPublicProject(
  input: Partial<ProjectData> & { id: string; title: string }
) {
  const payload = buildPublicRecord(input);
  const { data, error } = await supabase
    .from(TABLES.publicProjects)
    .upsert(payload, { onConflict: 'id' })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return mapPublicRecordToProjectData(data as PublicProjectRecord);
}

export async function deletePublicProject(id: string) {
  const { error } = await supabase.from(TABLES.publicProjects).delete().eq('id', id);
  if (error) throw new Error(error.message);
  return true;
}

export async function fetchInternalProjects() {
  const query = supabase
    .from(TABLES.internalProjects)
    .select('*')
    .order('created_at', { ascending: false });
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as InternalProjectRecord[];
}

export async function upsertInternalProject(input: InternalProjectRecord) {
  const hasId = Boolean(input.id);
  const base = {
    title: input.title,
    type: input.type ?? null,
    status: input.status ?? null,
    priority: input.priority ?? null,
    notes: input.notes ?? null,
    metadata: input.metadata ?? null,
  } satisfies Omit<InternalProjectRecord, 'id'>;

  const builder = supabase.from(TABLES.internalProjects);
  const { data, error } = hasId
    ? await builder
        .upsert({ id: input.id, ...base }, { onConflict: 'id' })
        .select()
        .single()
    : await builder.insert(base).select().single();

  if (error) throw new Error(error.message);
  return data as InternalProjectRecord;
}

export async function deleteInternalProject(id: string) {
  const { error } = await supabase.from(TABLES.internalProjects).delete().eq('id', id);
  if (error) throw new Error(error.message);
  return true;
}

export async function fetchRepositories() {
  const query = supabase
    .from(TABLES.repositories)
    .select('*')
    .order('synced_at', { ascending: false });
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as RepositoryRecord[];
}

export async function upsertRepository(input: RepositoryRecord) {
  const hasId = Boolean(input.id);
  const base = {
    github_full_name: input.github_full_name,
    visibility: input.visibility ?? null,
    stars: input.stars ?? null,
    forks: input.forks ?? null,
    language: input.language ?? null,
    tags: input.tags ?? null,
  } satisfies Omit<RepositoryRecord, 'id'>;

  const builder = supabase.from(TABLES.repositories);
  const { data, error } = hasId
    ? await builder
        .upsert({ id: input.id, ...base }, { onConflict: 'id' })
        .select()
        .single()
    : await builder.insert(base).select().single();

  if (error) throw new Error(error.message);
  return data as RepositoryRecord;
}

export async function deleteRepository(id: string) {
  const { error } = await supabase.from(TABLES.repositories).delete().eq('id', id);
  if (error) throw new Error(error.message);
  return true;
}
