import { describe, expect, it, vi, beforeEach } from 'vitest';
import {
  deletePublicProject,
  deleteRepository,
  fetchInternalProjects,
  fetchPublicProjects,
  fetchRepositories,
  upsertInternalProject,
  upsertPublicProject,
  upsertRepository,
} from '../services/dashboardApi';

const selectReturn = { data: [], error: null };

const order = vi.fn().mockResolvedValue(selectReturn);
const select = vi.fn(() => ({ order, single: vi.fn().mockResolvedValue(selectReturn) }));
const upsert = vi.fn(() => ({
  select: vi.fn(() => ({ single: vi.fn().mockResolvedValue(selectReturn) })),
}));
const insert = vi.fn(() => ({
  select: vi.fn(() => ({ single: vi.fn().mockResolvedValue(selectReturn) })),
}));
const del = vi.fn(() => ({ eq: vi.fn().mockResolvedValue({ error: null }) }));

const from = vi.fn(() => ({ select, order, upsert, insert, delete: del }));

vi.mock('../services/supabaseClient', () => ({ supabase: { from } }));

describe('dashboardApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetchPublicProjects propagates errors', async () => {
    order.mockResolvedValueOnce({ data: null, error: { message: 'boom' } });
    await expect(fetchPublicProjects()).rejects.toThrow('boom');
  });

  it('upsertPublicProject calls supabase upsert', async () => {
    await upsertPublicProject({ id: 'x', title: 'Test' });
    expect(from).toHaveBeenCalledWith('projects_public');
    expect(upsert).toHaveBeenCalled();
  });

  it('deletePublicProject calls delete', async () => {
    await deletePublicProject('abc');
    expect(del).toHaveBeenCalled();
  });

  it('fetchInternalProjects uses table', async () => {
    await fetchInternalProjects();
    expect(from).toHaveBeenCalledWith('projects_internal');
  });

  it('upsertInternalProject insert when no id', async () => {
    await upsertInternalProject({ title: 't' });
    expect(insert).toHaveBeenCalled();
  });

  it('fetchRepositories uses table', async () => {
    await fetchRepositories();
    expect(from).toHaveBeenCalledWith('repositories');
  });

  it('upsertRepository uses upsert', async () => {
    await upsertRepository({ github_full_name: 'me/repo' });
    expect(upsert).toHaveBeenCalled();
  });

  it('deleteRepository calls delete', async () => {
    await deleteRepository('id1');
    expect(del).toHaveBeenCalled();
  });
});
