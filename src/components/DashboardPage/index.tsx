/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import AnimatedBackground from '../Utils/Background/AnimatedBackground';
import WeatherControls from '../Utils/Background/WeatherControls';
import socialAuth from '../../Data/SocialAuth';
import { selectAuth } from '../../store/slices/authSlice';
import {
  deleteInternalProject,
  deletePublicProject,
  deleteRepository,
  fetchInternalProjects,
  fetchPublicProjects,
  fetchRepositories,
  upsertInternalProject,
  upsertPublicProject,
  upsertRepository,
  type InternalProjectRecord,
  type RepositoryRecord,
} from '../../services/dashboardApi';
import type { ProjectData } from '../FrontPage/AboutLayer/ProjectModal';

type PublicForm = {
  id: string;
  title: string;
  shortDescription: string;
  githubUrl: string;
  liveUrl: string;
};

type InternalForm = {
  id?: string;
  title: string;
  type: string;
  status: string;
  priority: string;
  notes: string;
};

type RepoForm = {
  id?: string;
  github_full_name: string;
  visibility: string;
  tags: string;
  language: string;
};

const defaultPublicForm: PublicForm = {
  id: '',
  title: '',
  shortDescription: '',
  githubUrl: '',
  liveUrl: '',
};

const defaultInternalForm: InternalForm = {
  id: undefined,
  title: '',
  type: '',
  status: '',
  priority: '',
  notes: '',
};

const defaultRepoForm: RepoForm = {
  id: undefined,
  github_full_name: '',
  visibility: 'private',
  tags: '',
  language: '',
};

const ITEMS_PER_PAGE = 5;

function DashboardLayer() {
  const { profile } = useSelector(selectAuth);

  const [publicProjects, setPublicProjects] = useState<ProjectData[]>([]);
  const [internalProjects, setInternalProjects] = useState<InternalProjectRecord[]>([]);
  const [repositories, setRepositories] = useState<RepositoryRecord[]>([]);

  const [publicForm, setPublicForm] = useState<PublicForm>(defaultPublicForm);
  const [internalForm, setInternalForm] = useState<InternalForm>(defaultInternalForm);
  const [repoForm, setRepoForm] = useState<RepoForm>(defaultRepoForm);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Filters and pagination
  const [searchPublic, setSearchPublic] = useState('');
  const [searchInternal, setSearchInternal] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [searchRepo, setSearchRepo] = useState('');
  const [filterVisibility, setFilterVisibility] = useState('');

  const [pagePublic, setPagePublic] = useState(0);
  const [pageInternal, setPageInternal] = useState(0);
  const [pageRepo, setPageRepo] = useState(0);

  const handleLogout = useCallback(async () => {
    await socialAuth.logout();
    window.location.href = '/';
  }, []);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [pub, internal, repo] = await Promise.all([
        fetchPublicProjects(),
        fetchInternalProjects(),
        fetchRepositories(),
      ]);
      setPublicProjects(pub);
      setInternalProjects(internal);
      setRepositories(repo);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }, []);

  const handlePublicSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!publicForm.id || !publicForm.title) {
      setError('ID e título são obrigatórios para projetos públicos.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await upsertPublicProject({
        id: publicForm.id,
        title: publicForm.title,
        shortDescription: publicForm.shortDescription,
        githubUrl: publicForm.githubUrl || undefined,
        liveUrl: publicForm.liveUrl || undefined,
      });
      await loadAll();
      setPublicForm(defaultPublicForm);
      showToast('Projeto público salvo.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar projeto público');
    } finally {
      setLoading(false);
    }
  };

  const handleInternalSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!internalForm.title) {
      setError('Título é obrigatório para projetos internos.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await upsertInternalProject({
        id: internalForm.id,
        title: internalForm.title,
        type: internalForm.type || null,
        status: internalForm.status || null,
        priority: internalForm.priority || null,
        notes: internalForm.notes || null,
        metadata: null,
      });
      await loadAll();
      setInternalForm(defaultInternalForm);
      showToast('Projeto interno salvo.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar projeto interno');
    } finally {
      setLoading(false);
    }
  };

  const handleRepoSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!repoForm.github_full_name) {
      setError('Full name do repositório é obrigatório.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await upsertRepository({
        id: repoForm.id,
        github_full_name: repoForm.github_full_name,
        visibility: repoForm.visibility,
        language: repoForm.language || null,
        tags: repoForm.tags
          ? repoForm.tags
              .split(',')
              .map(tag => tag.trim())
              .filter(Boolean)
          : null,
      });
      await loadAll();
      setRepoForm(defaultRepoForm);
      showToast('Repositório salvo.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar repositório');
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (type: 'public' | 'internal' | 'repo', id: string) => {
    setLoading(true);
    setError(null);
    try {
      if (type === 'public') await deletePublicProject(id);
      if (type === 'internal') await deleteInternalProject(id);
      if (type === 'repo') await deleteRepository(id);
      await loadAll();
      showToast('Removido com sucesso.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao remover item');
    } finally {
      setLoading(false);
    }
  };

  const editingPublic = useMemo(
    () => publicProjects.find(p => p.id === publicForm.id) || null,
    [publicForm.id, publicProjects]
  );

  // Filtered and paginated lists
  const filteredPublic = useMemo(() => {
    return publicProjects.filter(p => p.title.toLowerCase().includes(searchPublic.toLowerCase()));
  }, [publicProjects, searchPublic]);

  const filteredInternal = useMemo(() => {
    return internalProjects.filter(p => {
      const matchSearch = p.title.toLowerCase().includes(searchInternal.toLowerCase());
      const matchType = !filterType || p.type === filterType;
      const matchStatus = !filterStatus || p.status === filterStatus;
      const matchPriority = !filterPriority || p.priority === filterPriority;
      return matchSearch && matchType && matchStatus && matchPriority;
    });
  }, [internalProjects, searchInternal, filterType, filterStatus, filterPriority]);

  const filteredRepo = useMemo(() => {
    return repositories.filter(r => {
      const matchSearch = r.github_full_name.toLowerCase().includes(searchRepo.toLowerCase());
      const matchVis = !filterVisibility || r.visibility === filterVisibility;
      return matchSearch && matchVis;
    });
  }, [repositories, searchRepo, filterVisibility]);

  const paginatedPublic = useMemo(() => {
    const start = pagePublic * ITEMS_PER_PAGE;
    return filteredPublic.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPublic, pagePublic]);

  const paginatedInternal = useMemo(() => {
    const start = pageInternal * ITEMS_PER_PAGE;
    return filteredInternal.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredInternal, pageInternal]);

  const paginatedRepo = useMemo(() => {
    const start = pageRepo * ITEMS_PER_PAGE;
    return filteredRepo.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredRepo, pageRepo]);

  const totalPagesPublic = Math.ceil(filteredPublic.length / ITEMS_PER_PAGE);
  const totalPagesInternal = Math.ceil(filteredInternal.length / ITEMS_PER_PAGE);
  const totalPagesRepo = Math.ceil(filteredRepo.length / ITEMS_PER_PAGE);

  // Unique values for filters
  const uniqueTypes = useMemo(
    () => Array.from(new Set(internalProjects.map(p => p.type).filter(Boolean))),
    [internalProjects]
  );
  const uniqueStatuses = useMemo(
    () => Array.from(new Set(internalProjects.map(p => p.status).filter(Boolean))),
    [internalProjects]
  );

  return (
    <div className="flex flex-col justify-between w-full h-full pointer-events-none">
      <header className="fixed top-0 left-0 right-0 flex items-center justify-between w-full p-6 pointer-events-auto z-50">
        <div className="px-4 py-2 font-bold tracking-tighter text-white border rounded-lg bg-white/5 border-white/10 backdrop-blur-md shadow-[0_0_15px_rgba(0,0,0,0.2)]">
          J. KLABACHER
        </div>

        <nav className="flex gap-4 items-center">
          <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-right text-xs text-orange-100/80">
            <p className="leading-tight">Logado</p>
            <p className="font-semibold text-white text-sm">
              {profile?.username || profile?.email || 'Conta GitHub'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-semibold text-orange-200/90 hover:text-white hover:border-orange-500/40 hover:bg-white/10 transition-all backdrop-blur-md pointer-events-auto"
          >
            Sair
          </button>
        </nav>
      </header>

      <main className="flex items-center justify-center grow w-full overflow-y-auto pt-24 pb-12">
        <div className="pointer-events-auto will-change-transform w-full px-4 md:px-8 lg:px-12 max-w-7xl">
          <div className="text-center group">
            <div className="p-6 md:p-8 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.3)] text-white w-full text-left space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold">Dashboard Admin</h2>
                  <p className="text-sm text-orange-200/80">
                    CRUD completo com filtros e paginação.
                  </p>
                </div>
                {toast && (
                  <div className="px-3 py-2 rounded-lg bg-orange-500/20 border border-orange-500/30 text-sm text-orange-100">
                    {toast}
                  </div>
                )}
                {loading && (
                  <div className="px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-sm text-gray-200">
                    Atualizando...
                  </div>
                )}
              </div>

              {error && (
                <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-100">
                  {error}
                </div>
              )}

              {/* Public Projects Section */}
              <section className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                <header className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Projetos Públicos</h3>
                    <p className="text-xs text-gray-300">Espelha a seção pública do site.</p>
                  </div>
                  <span className="text-xs text-orange-200/80">{filteredPublic.length} itens</span>
                </header>

                <form onSubmit={handlePublicSubmit} className="space-y-3 text-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      required
                      value={publicForm.id}
                      onChange={e => setPublicForm({ ...publicForm, id: e.target.value })}
                      placeholder="ID único"
                      className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/15 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                    <input
                      required
                      value={publicForm.title}
                      onChange={e => setPublicForm({ ...publicForm, title: e.target.value })}
                      placeholder="Título"
                      className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/15 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>
                  <textarea
                    value={publicForm.shortDescription}
                    onChange={e =>
                      setPublicForm({ ...publicForm, shortDescription: e.target.value })
                    }
                    placeholder="Descrição curta"
                    className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/15 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      value={publicForm.githubUrl}
                      onChange={e => setPublicForm({ ...publicForm, githubUrl: e.target.value })}
                      placeholder="GitHub URL"
                      className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/15 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                    <input
                      value={publicForm.liveUrl}
                      onChange={e => setPublicForm({ ...publicForm, liveUrl: e.target.value })}
                      placeholder="Live URL"
                      className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/15 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-colors"
                  >
                    {editingPublic ? 'Atualizar' : 'Salvar'} projeto público
                  </button>
                </form>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                  <input
                    value={searchPublic}
                    onChange={e => {
                      setSearchPublic(e.target.value);
                      setPagePublic(0);
                    }}
                    placeholder="Buscar por título..."
                    className="w-full pl-10 pr-3 py-2 text-sm rounded-lg bg-white/10 border border-white/15 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>

                <div className="space-y-2 min-h-[200px]">
                  {paginatedPublic.map(item => (
                    <div
                      key={item.id}
                      className="flex items-start justify-between gap-3 p-3 rounded-xl bg-white/5 border border-white/10"
                    >
                      <div>
                        <p className="text-sm font-semibold">{item.title}</p>
                        <p className="text-xs text-gray-300 line-clamp-2">
                          {item.shortDescription}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="text-xs px-3 py-1 rounded-lg bg-orange-500/20 border border-orange-500/30 text-orange-100"
                          onClick={() =>
                            setPublicForm({
                              id: item.id,
                              title: item.title,
                              shortDescription: item.shortDescription,
                              githubUrl: item.githubUrl || '',
                              liveUrl: item.liveUrl || '',
                            })
                          }
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          className="text-xs px-3 py-1 rounded-lg bg-red-500/20 border border-red-500/40 text-red-100"
                          onClick={() => deleteItem('public', item.id)}
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  ))}
                  {paginatedPublic.length === 0 && (
                    <p className="text-xs text-gray-400 text-center py-8">
                      Nenhum projeto público encontrado.
                    </p>
                  )}
                </div>

                {/* Pagination */}
                {totalPagesPublic > 1 && (
                  <div className="flex items-center justify-center gap-3">
                    <button
                      type="button"
                      disabled={pagePublic === 0}
                      onClick={() => setPagePublic(p => Math.max(0, p - 1))}
                      className="p-2 rounded-lg bg-white/10 border border-white/15 disabled:opacity-30"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <span className="text-xs text-gray-300">
                      Página {pagePublic + 1} de {totalPagesPublic}
                    </span>
                    <button
                      type="button"
                      disabled={pagePublic >= totalPagesPublic - 1}
                      onClick={() => setPagePublic(p => p + 1)}
                      className="p-2 rounded-lg bg-white/10 border border-white/15 disabled:opacity-30"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </section>

              {/* Internal Projects Section */}
              <section className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                <header className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Projetos Internos</h3>
                    <p className="text-xs text-gray-300">Ideias e planos privados.</p>
                  </div>
                  <span className="text-xs text-orange-200/80">
                    {filteredInternal.length} itens
                  </span>
                </header>

                <form onSubmit={handleInternalSubmit} className="space-y-3 text-sm">
                  <input
                    value={internalForm.title}
                    onChange={e => setInternalForm({ ...internalForm, title: e.target.value })}
                    placeholder="Título"
                    className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/15 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      value={internalForm.type}
                      onChange={e => setInternalForm({ ...internalForm, type: e.target.value })}
                      placeholder="Tipo (ideia, plano)"
                      className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/15 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                    <input
                      value={internalForm.status}
                      onChange={e => setInternalForm({ ...internalForm, status: e.target.value })}
                      placeholder="Status"
                      className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/15 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                    <input
                      value={internalForm.priority}
                      onChange={e => setInternalForm({ ...internalForm, priority: e.target.value })}
                      placeholder="Prioridade"
                      className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/15 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>
                  <textarea
                    value={internalForm.notes}
                    onChange={e => setInternalForm({ ...internalForm, notes: e.target.value })}
                    placeholder="Notas"
                    className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/15 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                  <button
                    type="submit"
                    className="w-full py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-colors"
                  >
                    {internalForm.id ? 'Atualizar' : 'Salvar'} projeto interno
                  </button>
                </form>

                {/* Search & Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="relative md:col-span-2">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                    <input
                      value={searchInternal}
                      onChange={e => {
                        setSearchInternal(e.target.value);
                        setPageInternal(0);
                      }}
                      placeholder="Buscar por título..."
                      className="w-full pl-10 pr-3 py-2 text-sm rounded-lg bg-white/10 border border-white/15 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>
                  <select
                    value={filterType}
                    onChange={e => {
                      setFilterType(e.target.value);
                      setPageInternal(0);
                    }}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-white/10 border border-white/15 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  >
                    <option value="">Todos os tipos</option>
                    {uniqueTypes.map(t => (
                      <option key={t} value={t ? t : ''}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <select
                    value={filterStatus}
                    onChange={e => {
                      setFilterStatus(e.target.value);
                      setPageInternal(0);
                    }}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-white/10 border border-white/15 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  >
                    <option value="">Todos os status</option>
                    {uniqueStatuses.map(s => (
                      <option key={s} value={s ? s : ''}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2 min-h-[200px]">
                  {paginatedInternal.map(item => (
                    <div
                      key={item.id}
                      className="flex items-start justify-between gap-3 p-3 rounded-xl bg-white/5 border border-white/10"
                    >
                      <div>
                        <p className="text-sm font-semibold">{item.title}</p>
                        <p className="text-xs text-gray-300">
                          {item.type || '—'} · {item.status || 'sem status'} ·{' '}
                          {item.priority || 'sem prioridade'}
                        </p>
                        {item.notes && (
                          <p className="text-xs text-gray-400 line-clamp-2">{item.notes}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="text-xs px-3 py-1 rounded-lg bg-orange-500/20 border border-orange-500/30 text-orange-100"
                          onClick={() =>
                            setInternalForm({
                              id: item.id,
                              title: item.title,
                              type: item.type || '',
                              status: item.status || '',
                              priority: item.priority || '',
                              notes: item.notes || '',
                            })
                          }
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          className="text-xs px-3 py-1 rounded-lg bg-red-500/20 border border-red-500/40 text-red-100"
                          onClick={() => deleteItem('internal', item.id!)}
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  ))}
                  {paginatedInternal.length === 0 && (
                    <p className="text-xs text-gray-400 text-center py-8">
                      Nenhum projeto interno encontrado.
                    </p>
                  )}
                </div>

                {/* Pagination */}
                {totalPagesInternal > 1 && (
                  <div className="flex items-center justify-center gap-3">
                    <button
                      type="button"
                      disabled={pageInternal === 0}
                      onClick={() => setPageInternal(p => Math.max(0, p - 1))}
                      className="p-2 rounded-lg bg-white/10 border border-white/15 disabled:opacity-30"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <span className="text-xs text-gray-300">
                      Página {pageInternal + 1} de {totalPagesInternal}
                    </span>
                    <button
                      type="button"
                      disabled={pageInternal >= totalPagesInternal - 1}
                      onClick={() => setPageInternal(p => p + 1)}
                      className="p-2 rounded-lg bg-white/10 border border-white/15 disabled:opacity-30"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </section>

              {/* Repositories Section */}
              <section className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                <header className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Repositórios</h3>
                    <p className="text-xs text-gray-300">Organize todos os repositórios GitHub.</p>
                  </div>
                  <span className="text-xs text-orange-200/80">{filteredRepo.length} itens</span>
                </header>

                <form onSubmit={handleRepoSubmit} className="space-y-3 text-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      value={repoForm.github_full_name}
                      onChange={e => setRepoForm({ ...repoForm, github_full_name: e.target.value })}
                      placeholder="owner/repo"
                      className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/15 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                    <input
                      value={repoForm.language}
                      onChange={e => setRepoForm({ ...repoForm, language: e.target.value })}
                      placeholder="Linguagem"
                      className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/15 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      value={repoForm.visibility}
                      onChange={e => setRepoForm({ ...repoForm, visibility: e.target.value })}
                      placeholder="Visibilidade (public/private)"
                      className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/15 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                    <input
                      value={repoForm.tags}
                      onChange={e => setRepoForm({ ...repoForm, tags: e.target.value })}
                      placeholder="Tags separadas por vírgula"
                      className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/15 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-colors"
                  >
                    {repoForm.id ? 'Atualizar' : 'Salvar'} repositório
                  </button>
                </form>

                {/* Search & Filter */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                    <input
                      value={searchRepo}
                      onChange={e => {
                        setSearchRepo(e.target.value);
                        setPageRepo(0);
                      }}
                      placeholder="Buscar por nome..."
                      className="w-full pl-10 pr-3 py-2 text-sm rounded-lg bg-white/10 border border-white/15 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>
                  <select
                    value={filterVisibility}
                    onChange={e => {
                      setFilterVisibility(e.target.value);
                      setPageRepo(0);
                    }}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-white/10 border border-white/15 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  >
                    <option value="">Todas visibilidades</option>
                    <option value="public">public</option>
                    <option value="private">private</option>
                  </select>
                </div>

                <div className="space-y-2 min-h-[200px]">
                  {paginatedRepo.map(item => (
                    <div
                      key={item.id}
                      className="flex items-start justify-between gap-3 p-3 rounded-xl bg-white/5 border border-white/10"
                    >
                      <div>
                        <p className="text-sm font-semibold">{item.github_full_name}</p>
                        <p className="text-xs text-gray-300">
                          {item.language || '—'} · {item.visibility || '—'}
                        </p>
                        {item.tags && item.tags.length > 0 && (
                          <p className="text-[11px] text-orange-200/90">{item.tags.join(', ')}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="text-xs px-3 py-1 rounded-lg bg-orange-500/20 border border-orange-500/30 text-orange-100"
                          onClick={() =>
                            setRepoForm({
                              id: item.id,
                              github_full_name: item.github_full_name,
                              visibility: item.visibility || 'private',
                              tags: item.tags?.join(', ') || '',
                              language: item.language || '',
                            })
                          }
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          className="text-xs px-3 py-1 rounded-lg bg-red-500/20 border border-red-500/40 text-red-100"
                          onClick={() => deleteItem('repo', item.id!)}
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  ))}
                  {paginatedRepo.length === 0 && (
                    <p className="text-xs text-gray-400 text-center py-8">
                      Nenhum repositório encontrado.
                    </p>
                  )}
                </div>

                {/* Pagination */}
                {totalPagesRepo > 1 && (
                  <div className="flex items-center justify-center gap-3">
                    <button
                      type="button"
                      disabled={pageRepo === 0}
                      onClick={() => setPageRepo(p => Math.max(0, p - 1))}
                      className="p-2 rounded-lg bg-white/10 border border-white/15 disabled:opacity-30"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <span className="text-xs text-gray-300">
                      Página {pageRepo + 1} de {totalPagesRepo}
                    </span>
                    <button
                      type="button"
                      disabled={pageRepo >= totalPagesRepo - 1}
                      onClick={() => setPageRepo(p => p + 1)}
                      className="p-2 rounded-lg bg-white/10 border border-white/15 disabled:opacity-30"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      </main>

      <div className="h-28" />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="no-scrollbar relative w-full h-screen overflow-y-auto overflow-x-hidden bg-gray-900 scroll-smooth snap-y snap-mandatory">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <AnimatedBackground />
      </div>

      <WeatherControls />

      <section className="relative w-full min-h-screen z-10 pointer-events-none snap-start">
        <div className="w-full h-full pointer-events-none">
          <DashboardLayer />
        </div>
      </section>
    </div>
  );
}
