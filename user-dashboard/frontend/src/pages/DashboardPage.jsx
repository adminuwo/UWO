import { useState, useEffect } from 'react';
import {
  Sparkles,
  LogOut,
  PlusCircle,
  ExternalLink,
  Copy,
  Check,
  Smartphone,
  Laptop,
  Apple,
  BarChart3,
  Layers,
  Code2,
  RefreshCw,
  AlertCircle,
  QrCode,
  X,
  PackagePlus,
  FolderGit2,
  Pencil,
  Trash2,
  Download,
  CheckCircle2,
  HelpCircle,
  MousePointerClick,
  History,
  Activity,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { api } from '../services/api';

export default function DashboardPage({ user, onLogout }) {
  const [products, setProducts] = useState([]);
  const [links, setLinks] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loadingActivity, setLoadingActivity] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [generating, setGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [activeModal, setActiveModal] = useState(null); // 'addProduct' | 'editProduct' | 'embedCode' | 'qrCode' | 'manageProjects' | 'attributionInfo'
  const [selectedQrLink, setSelectedQrLink] = useState(null);

  // Add / Edit Project form state
  const [projectForm, setProjectForm] = useState({
    id: '',
    name: '',
    description: '',
    webUrl: '',
    androidUrl: '',
    iosUrl: '',
  });
  const [savingProduct, setSavingProduct] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deletingLinkId, setDeletingLinkId] = useState(null);
  const [productMessage, setProductMessage] = useState({ type: '', text: '' });
  const [linkMessage, setLinkMessage] = useState({ type: '', text: '' });

  // iOS Simulation Testing State
  const [simulatingIos, setSimulatingIos] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);

  // Full Device Simulator State
  const [simSelectedCode, setSimSelectedCode] = useState('');
  const [simRunning, setSimRunning] = useState(false);
  const [simDesktopResult, setSimDesktopResult] = useState(null);
  const [simAndroidResult, setSimAndroidResult] = useState(null);
  const [simIosResult, setSimIosResult] = useState(null);

  useEffect(() => {
    loadProducts();
    loadLinks();
    loadActivity();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await api.getProducts();
      if (data.products) {
        setProducts(data.products);
        if (data.products.length > 0 && !selectedProductId) {
          setSelectedProductId(data.products[0]._id);
        }
      }
    } catch (err) {
      console.error('Failed to load projects:', err);
    }
  };

  const loadLinks = async () => {
    try {
      const data = await api.getLinks();
      if (data.links) {
        setLinks(data.links);
      }
    } catch (err) {
      console.error('Failed to load links:', err);
    }
  };

  const loadActivity = async () => {
    try {
      setLoadingActivity(true);
      const data = await api.getActivity();
      if (data.activity) {
        setActivity(data.activity);
      }
    } catch (err) {
      console.error('Failed to load activity:', err);
    } finally {
      setLoadingActivity(false);
    }
  };

  const handleGenerateLink = async () => {
    if (!selectedProductId) return;
    setGenerating(true);
    setLinkMessage({ type: '', text: '' });

    try {
      const data = await api.generateLink({ productId: selectedProductId });
      setLinkMessage({ type: 'success', text: data.message });
      await Promise.all([loadLinks(), loadActivity()]);
    } catch (err) {
      setLinkMessage({ type: 'error', text: err.message });
    } finally {
      setGenerating(false);
    }
  };

  const openAddProjectModal = () => {
    setProjectForm({
      id: '',
      name: '',
      description: '',
      webUrl: '',
      androidUrl: '',
      iosUrl: '',
    });
    setProductMessage({ type: '', text: '' });
    setActiveModal('addProduct');
  };

  const openEditProjectModal = (prod) => {
    setProjectForm({
      id: prod._id,
      name: prod.name,
      description: prod.description || '',
      webUrl: prod.webUrl || '',
      androidUrl: prod.androidUrl || '',
      iosUrl: prod.iosUrl || '',
    });
    setProductMessage({ type: '', text: '' });
    setActiveModal('editProduct');
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    setProductMessage({ type: '', text: '' });

    const hasWeb = projectForm.webUrl && projectForm.webUrl.trim().length > 0;
    const hasAndroid = projectForm.androidUrl && projectForm.androidUrl.trim().length > 0;
    const hasIos = projectForm.iosUrl && projectForm.iosUrl.trim().length > 0;

    if (!hasWeb && !hasAndroid && !hasIos) {
      setProductMessage({
        type: 'error',
        text: 'At least one URL (Web, Android Play Store, or iOS App Store) is required.',
      });
      return;
    }

    setSavingProduct(true);

    try {
      if (projectForm.id) {
        await api.updateProduct(projectForm.id, {
          name: projectForm.name,
          description: projectForm.description,
          webUrl: projectForm.webUrl,
          androidUrl: projectForm.androidUrl,
          iosUrl: projectForm.iosUrl,
        });
        setProductMessage({ type: 'success', text: 'Project updated successfully in MongoDB!' });
      } else {
        await api.addProduct({
          name: projectForm.name,
          description: projectForm.description,
          webUrl: projectForm.webUrl,
          androidUrl: projectForm.androidUrl,
          iosUrl: projectForm.iosUrl,
        });
        setProductMessage({ type: 'success', text: 'Project added successfully to MongoDB!' });
      }

      await loadProducts();
      await loadLinks();

      setTimeout(() => {
        setActiveModal(null);
        setProductMessage({ type: '', text: '' });
      }, 1000);
    } catch (err) {
      setProductMessage({ type: 'error', text: err.message });
    } finally {
      setSavingProduct(false);
    }
  };

  const handleDeleteProject = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This will also remove any referral links generated for this project.`)) {
      return;
    }

    setDeletingId(id);
    try {
      await api.deleteProduct(id);
      if (selectedProductId === id) {
        setSelectedProductId('');
      }
      await loadProducts();
      await loadLinks();
    } catch (err) {
      alert(`Failed to delete: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteLink = async (id, code) => {
    if (!window.confirm(`Are you sure you want to delete referral link "${code}"? This will also remove all its recorded clicks and download analytics.`)) {
      return;
    }

    setDeletingLinkId(id);
    try {
      await api.deleteLink(id);
      await Promise.all([loadLinks(), loadActivity()]);
    } catch (err) {
      alert(`Failed to delete link: ${err.message}`);
    } finally {
      setDeletingLinkId(null);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Simulate iOS First-Open Verification Live
  const handleSimulateIosFirstOpen = async () => {
    setSimulatingIos(true);
    setSimulationResult(null);
    try {
      const res = await api.verifyIosInstall();
      setSimulationResult(res);
      await Promise.all([loadLinks(), loadActivity()]);
    } catch (err) {
      setSimulationResult({ success: false, message: err.message });
    } finally {
      setSimulatingIos(false);
    }
  };

  // Device Simulator Handlers
  const handleSimulateDesktop = async (code) => {
    setSimRunning(true);
    setSimDesktopResult(null);
    try {
      const res = await api.simulateClick({ code, deviceType: 'desktop' });
      setSimDesktopResult(res);
      await Promise.all([loadLinks(), loadActivity()]);
    } catch (err) {
      setSimDesktopResult({ error: err.message });
    } finally {
      setSimRunning(false);
    }
  };

  const handleSimulateAndroidClick = async (code) => {
    setSimRunning(true);
    setSimAndroidResult(null);
    try {
      const res = await api.simulateClick({ code, deviceType: 'android' });
      setSimAndroidResult(res);
      await Promise.all([loadLinks(), loadActivity()]);
    } catch (err) {
      setSimAndroidResult({ error: err.message });
    } finally {
      setSimRunning(false);
    }
  };

  const handleSimulateAndroidInstall = async (code) => {
    setSimRunning(true);
    try {
      const res = await api.recordAndroidInstall({ referralCode: code });
      setSimAndroidResult((prev) => ({
        ...prev,
        installRecorded: true,
        installMsg: res.message,
      }));
      await Promise.all([loadLinks(), loadActivity()]);
    } catch (err) {
      setSimAndroidResult((prev) => ({
        ...prev,
        installError: err.message,
      }));
    } finally {
      setSimRunning(false);
    }
  };

  const handleSimulateIosClick = async (code) => {
    setSimRunning(true);
    setSimIosResult(null);
    try {
      const res = await api.simulateClick({ code, deviceType: 'ios' });
      setSimIosResult(res);
      await Promise.all([loadLinks(), loadActivity()]);
    } catch (err) {
      setSimIosResult({ error: err.message });
    } finally {
      setSimRunning(false);
    }
  };

  const handleSimulateIosVerify = async () => {
    setSimRunning(true);
    try {
      const res = await api.verifyIosInstall();
      setSimIosResult((prev) => ({
        ...prev,
        verifyRes: res,
      }));
      await Promise.all([loadLinks(), loadActivity()]);
    } catch (err) {
      setSimIosResult((prev) => ({
        ...prev,
        verifyError: err.message,
      }));
    } finally {
      setSimRunning(false);
    }
  };

  // Stats calculation
  const totalClicks = links.reduce((acc, curr) => acc + (curr.deviceStats?.total || curr.clicks || 0), 0);
  const totalUniqueClicks = links.reduce((acc, curr) => acc + (curr.deviceStats?.unique || curr.uniqueClicks || 0), 0);
  const totalDownloads = links.reduce((acc, curr) => acc + (curr.downloadStats?.total || curr.downloads || 0), 0);
  const desktopClicks = links.reduce((acc, curr) => acc + (curr.deviceStats?.desktop || 0), 0);
  const androidClicks = links.reduce((acc, curr) => acc + (curr.deviceStats?.android || 0), 0);
  const iosClicks = links.reduce((acc, curr) => acc + (curr.deviceStats?.ios || 0), 0);
  const androidDownloads = links.reduce((acc, curr) => acc + (curr.downloadStats?.android || 0), 0);
  const iosDownloads = links.reduce((acc, curr) => acc + (curr.downloadStats?.ios || 0), 0);

  const selectedProduct = products.find((p) => p._id === selectedProductId);
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Top Navigation */}
      <nav className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-white text-base tracking-tight block">
                UWO™ Referral Portal
              </span>
              <span className="text-[11px] text-slate-400">
                User ID: <span className="font-mono text-indigo-400 font-semibold">{user?.userId}</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setActiveModal('simulator')}
              className="px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/50 text-xs font-semibold text-indigo-200 flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-indigo-600/20"
            >
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Device Simulator 🧪</span>
            </button>

            <button
              onClick={() => setActiveModal('attributionInfo')}
              className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-xs font-medium text-emerald-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Attribution Guide</span>
            </button>

            <button
              onClick={() => setActiveModal('manageProjects')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FolderGit2 className="w-4 h-4 text-indigo-400" />
              <span className="hidden md:inline">Projects ({products.length})</span>
            </button>

            <button
              onClick={openAddProjectModal}
              className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-xs font-medium text-indigo-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <PackagePlus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Project</span>
            </button>

            <button
              onClick={() => setActiveModal('embedCode')}
              className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-300 flex items-center gap-1.5 cursor-pointer"
              title="Website Button Code"
            >
              <Code2 className="w-4 h-4 text-indigo-400" />
              <span className="hidden md:inline">Embed Code</span>
            </button>

            <div className="h-6 w-px bg-slate-800" />

            <div className="flex items-center gap-2">
              <div className="text-right hidden md:block">
                <div className="text-xs font-semibold text-white">{user?.name}</div>
                <div className="text-[10px] text-slate-400">{user?.email}</div>
              </div>
              <button
                onClick={onLogout}
                title="Logout"
                className="p-2 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-700/60 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Centralized referral tracking across all UWO products (AISA, AI Legal, AI Ads, AI CashFlow, AI Mall, AISA Connect, EFV, and corporate platforms).
            </p>
          </div>
          <button
            onClick={openAddProjectModal}
            className="self-start sm:self-auto px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all cursor-pointer"
          >
            <PackagePlus className="w-4 h-4" />
            <span>+ Add New Project</span>
          </button>
        </div>

        {/* Analytics Grid: Clicks & Downloads */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Active Links</span>
              <Layers className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-bold text-white">{links.length}</div>
            <div className="text-[10px] text-slate-500 mt-1">Generated links</div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Total Clicks</span>
              <BarChart3 className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-blue-400">{totalClicks}</div>
            <div className="text-[10px] text-slate-500 mt-1">Web: {desktopClicks} | Mob: {androidClicks + iosClicks}</div>
          </div>

          <div className="bg-slate-900/70 border border-indigo-500/30 rounded-xl p-4 bg-indigo-950/20">
            <div className="flex items-center justify-between text-indigo-300 text-xs mb-1">
              <span>Unique Clicks</span>
              <MousePointerClick className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-bold text-indigo-400">{totalUniqueClicks}</div>
            <div className="text-[10px] text-indigo-400/80 mt-1">Distinct visitor IPs</div>
          </div>

          <div className="bg-gradient-to-br from-emerald-950/40 to-slate-900/70 border border-emerald-800/40 rounded-xl p-4">
            <div className="flex items-center justify-between text-emerald-400 text-xs mb-1">
              <span>App Downloads</span>
              <Download className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-400">{totalDownloads}</div>
            <div className="text-[10px] text-emerald-500/80 mt-1">Android: {androidDownloads} | iOS: {iosDownloads}</div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Android Play</span>
              <Smartphone className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-xl font-bold text-white">
              <span className="text-green-400">{androidDownloads}</span> <span className="text-xs text-slate-400 font-normal">downloads</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1">{androidClicks} clicks (Play Referrer)</div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>iOS App Store</span>
              <Apple className="w-4 h-4 text-slate-200" />
            </div>
            <div className="text-xl font-bold text-white">
              <span className="text-slate-200">{iosDownloads}</span> <span className="text-xs text-slate-400 font-normal">downloads</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1">{iosClicks} clicks (IP Matched)</div>
          </div>
        </div>

        {/* Link Generator Box */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-900/40 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Smart Link Generator with App Attribution
            </div>
            <h2 className="text-xl font-bold text-white">Generate Referral Link for a Project</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Generates a smart link that attaches Google Play install referrer tags on Android and captures IP/fingerprint (2-4h window) on iOS.
            </p>

            {linkMessage.text && (
              <div
                className={`mt-4 p-3 rounded-xl text-xs flex items-center gap-2 ${
                  linkMessage.type === 'success'
                    ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                    : 'bg-red-500/10 border border-red-500/30 text-red-400'
                }`}
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{linkMessage.text}</span>
              </div>
            )}

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {products.length === 0 ? (
                    <option value="">No projects found in MongoDB (click Add Project)</option>
                  ) : (
                    products.map((prod) => (
                      <option key={prod._id} value={prod._id}>
                        {prod.name} ({prod.slug})
                      </option>
                    ))
                  )}
                </select>
              </div>

              <button
                onClick={handleGenerateLink}
                disabled={generating || products.length === 0}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {generating ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <PlusCircle className="w-4 h-4" />
                    <span>Generate Link</span>
                  </>
                )}
              </button>
            </div>

            {selectedProduct && (
              <div className="mt-6 p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-slate-300">
                    Routing Configuration for "{selectedProduct.name}":
                  </span>
                  <button
                    onClick={() => openEditProjectModal(selectedProduct)}
                    className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium cursor-pointer"
                  >
                    <Pencil className="w-3 h-3" /> Edit Project
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                    <div className="flex items-center gap-1.5 text-blue-400 font-medium mb-1">
                      <Laptop className="w-3.5 h-3.5" />
                      <span>Desktop / Laptop</span>
                    </div>
                    <div className="text-slate-400 truncate text-[11px]" title={selectedProduct.webUrl || 'Fallback to available link'}>
                      {selectedProduct.webUrl || <span className="text-slate-600 italic">Omitted (Uses Fallback)</span>}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                    <div className="flex items-center gap-1.5 text-green-400 font-medium mb-1">
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Android Play Store</span>
                    </div>
                    <div className="text-slate-400 truncate text-[11px]" title={selectedProduct.androidUrl || 'Fallback to available link'}>
                      {selectedProduct.androidUrl || <span className="text-slate-600 italic">Omitted (Uses Fallback)</span>}
                    </div>
                    <div className="text-[10px] text-green-500/70 mt-1">Google Play Referrer Active</div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                    <div className="flex items-center gap-1.5 text-slate-200 font-medium mb-1">
                      <Apple className="w-3.5 h-3.5" />
                      <span>iOS App Store</span>
                    </div>
                    <div className="text-slate-400 truncate text-[11px]" title={selectedProduct.iosUrl || 'Fallback to available link'}>
                      {selectedProduct.iosUrl || <span className="text-slate-600 italic">Omitted (Uses Fallback)</span>}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">IP Matching (3h window) Active</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Links Table */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-5 sm:p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-white">Your Generated Referral Links</h2>
              <p className="text-xs text-slate-400">
                All links generated under User ID: <span className="font-mono text-indigo-400 font-semibold">{user?.userId}</span>
              </p>
            </div>
            <button
              onClick={loadLinks}
              className="self-start sm:self-auto p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Stats</span>
            </button>
          </div>

          {links.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-sm">
              <p>You haven't generated any referral links yet.</p>
              <p className="text-xs text-slate-600 mt-1">Select a project above and click "Generate Link" to start sharing!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-6">Project</th>
                    <th className="py-3.5 px-6">Referral Link</th>
                    <th className="py-3.5 px-6 text-center">Clicks Breakdown</th>
                    <th className="py-3.5 px-6 text-center">Verified Downloads</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {links.map((link) => {
                    const clickStats = link.deviceStats || { desktop: 0, android: 0, ios: 0, total: link.clicks || 0 };
                    const dlStats = link.downloadStats || { android: 0, ios: 0, total: link.downloads || 0 };

                    return (
                      <tr key={link._id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-4 px-6">
                          <div className="font-semibold text-white text-sm">
                            {link.product?.name || 'Deleted Project'}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            Code: {link.code}
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2 max-w-sm">
                            <span className="font-mono text-indigo-300 bg-slate-950/80 px-2.5 py-1.5 rounded-lg border border-slate-800 truncate text-[11px]">
                              {link.fullUrl}
                            </span>
                            <button
                              onClick={() => copyToClipboard(link.fullUrl, link._id)}
                              title="Copy Link"
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                            >
                              {copiedId === link._id ? (
                                <Check className="w-4 h-4 text-emerald-400" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                            <a
                              href={link.fullUrl}
                              target="_blank"
                              rel="noreferrer"
                              title="Test Smart Redirection"
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                        </td>

                        {/* Clicks */}
                        <td className="py-4 px-6">
                          <div className="flex flex-col items-center gap-1.5">
                            <div className="flex items-center justify-center gap-1.5 text-[11px]">
                              <span title="Desktop Clicks" className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
                                <Laptop className="w-3 h-3" />
                                {clickStats.desktop}
                              </span>
                              <span title="Android Play Store Clicks" className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-green-500/10 text-green-400 border border-green-500/20 font-medium">
                                <Smartphone className="w-3 h-3" />
                                {clickStats.android}
                              </span>
                              <span title="iOS App Store Clicks" className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-500/10 text-slate-300 border border-slate-500/20 font-medium">
                                <Apple className="w-3 h-3" />
                                {clickStats.ios}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                              <span className="font-semibold text-slate-200">{clickStats.total || link.clicks || 0} total</span>
                              <span className="text-slate-600">•</span>
                              <span className="text-indigo-300 font-medium bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20" title="Unique Clicks (Unique visitor IPs)">
                                {clickStats.unique !== undefined ? clickStats.unique : (link.uniqueClicks || 0)} unique
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Verified Downloads */}
                        <td className="py-4 px-6 text-center">
                          <div className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-[11px]">
                            <span className="text-green-400 font-medium flex items-center gap-1" title="Android Google Play Installs">
                              <Smartphone className="w-3 h-3" /> {dlStats.android}
                            </span>
                            <span className="text-slate-400">|</span>
                            <span className="text-slate-200 font-medium flex items-center gap-1" title="iOS First-Open Installs">
                              <Apple className="w-3 h-3" /> {dlStats.ios}
                            </span>
                            <span className="font-bold text-emerald-400 ml-1">
                              ({dlStats.total} total)
                            </span>
                          </div>
                        </td>

                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <a
                              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                                `Check out ${link.product?.name || 'this app'}: ${link.fullUrl}`
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2 py-1 rounded-md bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 text-[11px] font-medium border border-emerald-500/30 cursor-pointer"
                            >
                              WhatsApp
                            </a>

                            <button
                              onClick={() => {
                                setSelectedQrLink(link);
                                setActiveModal('qrCode');
                              }}
                              title="Show QR Code"
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                            >
                              <QrCode className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleDeleteLink(link._id, link.code)}
                              disabled={deletingLinkId === link._id}
                              title="Delete Referral Link"
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700/60 transition-colors cursor-pointer disabled:opacity-50"
                            >
                              {deletingLinkId === link._id ? (
                                <RefreshCw className="w-4 h-4 animate-spin text-rose-400" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Real-Time Referral Activity & History */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-5 sm:p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-white">Real-Time Referral Activity &amp; History</h2>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Live Telemetry
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Real-time chronological telemetry of visitor clicks, Android Google Play installs, and iOS app conversions across all UWO products.
                </p>
              </div>
            </div>
            <button
              onClick={loadActivity}
              disabled={loadingActivity}
              className="self-start sm:self-auto p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingActivity ? 'animate-spin text-indigo-400' : ''}`} />
              <span>Refresh Activity</span>
            </button>
          </div>

          {activity.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-sm">
              <History className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-60" />
              <p>No referral activity recorded yet.</p>
              <p className="text-xs text-slate-600 mt-1">
                Share your referral links or use the Device Simulator to trigger live events.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-6">Event &amp; Product</th>
                    <th className="py-3.5 px-6">Referral Code</th>
                    <th className="py-3.5 px-6">Device / Platform</th>
                    <th className="py-3.5 px-6">Attribution Method</th>
                    <th className="py-3.5 px-6">Visitor IP</th>
                    <th className="py-3.5 px-6 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {activity.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-2.5">
                          {item.type === 'download' ? (
                            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                              <Download className="w-3.5 h-3.5" />
                            </div>
                          ) : (
                            <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                              <MousePointerClick className="w-3.5 h-3.5" />
                            </div>
                          )}
                          <div>
                            <div className="font-semibold text-white text-xs flex items-center gap-1.5">
                              <span>{item.productName}</span>
                              {item.type === 'download' && (
                                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                                  VERIFIED INSTALL
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {item.title}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-6">
                        <span className="font-mono text-indigo-300 bg-slate-950 px-2 py-1 rounded border border-slate-800 text-[11px]">
                          {item.code}
                        </span>
                      </td>

                      <td className="py-3.5 px-6">
                        <div className="inline-flex items-center gap-1.5 capitalize text-slate-300 text-[11px]">
                          {item.deviceType === 'desktop' && <Laptop className="w-3.5 h-3.5 text-blue-400" />}
                          {item.deviceType === 'android' && <Smartphone className="w-3.5 h-3.5 text-green-400" />}
                          {item.deviceType === 'ios' && <Apple className="w-3.5 h-3.5 text-slate-300" />}
                          <span>{item.deviceType}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-6">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium ${
                            item.attributionMethod === 'google_play_referrer'
                              ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                              : item.attributionMethod === 'ios_ip_fingerprint'
                              ? 'bg-purple-500/10 text-purple-300 border border-purple-500/20'
                              : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}
                        >
                          {item.attributionMethod === 'google_play_referrer' && 'Play Store Referrer'}
                          {item.attributionMethod === 'ios_ip_fingerprint' && 'iOS IP Fingerprint'}
                          {item.attributionMethod === 'web_redirect' && 'Direct Web Redirection'}
                        </span>
                      </td>

                      <td className="py-3.5 px-6">
                        <span className="font-mono text-[11px] text-slate-400">
                          {item.ip}
                        </span>
                      </td>

                      <td className="py-3.5 px-6 text-right">
                        <span className="text-[11px] text-slate-400" title={new Date(item.timestamp).toLocaleString()}>
                          {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {' '}
                          <span className="text-slate-500 text-[10px]">
                            {new Date(item.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                          </span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Modal: Device Simulator */}
      {activeModal === 'simulator' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl p-6 shadow-2xl relative max-h-[90vh] flex flex-col">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Multi-Device & Attribution Simulator</h3>
                  <p className="text-xs text-slate-400">
                    Test Desktop, Android Google Play Referrer, and iOS IP matching without any real phones!
                  </p>
                </div>
              </div>

              {/* Link selector */}
              {links.length > 0 && (
                <div className="flex items-center gap-2 mr-6">
                  <span className="text-xs text-slate-400 hidden sm:inline">Testing Code:</span>
                  <select
                    value={simSelectedCode || links[0]?.code}
                    onChange={(e) => setSimSelectedCode(e.target.value)}
                    className="px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs font-mono focus:ring-1 focus:ring-indigo-500 outline-none"
                  >
                    {links.map((l) => (
                      <option key={l._id} value={l.code}>
                        {l.product?.name || l.code} ({l.code})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {links.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                Please generate a referral link first before using the simulator.
              </div>
            ) : (
              <div className="overflow-y-auto flex-1 space-y-4 pr-1 text-xs">
                {/* 1. Desktop Test */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-blue-400 font-bold">
                      <Laptop className="w-4 h-4" />
                      <span>1. Desktop / Laptop Web Redirection</span>
                    </div>
                    <button
                      onClick={() => handleSimulateDesktop(simSelectedCode || links[0]?.code)}
                      disabled={simRunning}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs rounded-lg cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Simulate Desktop Click</span>
                    </button>
                  </div>
                  <p className="text-slate-400 text-[11px] mb-2">
                    Simulates a Windows/Mac visitor clicking your link. Inspects redirection to web URL with referral query parameters.
                  </p>
                  {simDesktopResult && (
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-blue-500/30 text-blue-300 font-mono text-[11px] space-y-1">
                      <div>✓ <strong>Device Detected:</strong> {simDesktopResult.deviceType}</div>
                      <div className="break-all">✓ <strong>Redirect URL:</strong> {simDesktopResult.targetUrl}</div>
                      <div className="text-emerald-400 font-sans font-medium text-[11px] mt-1">
                        ✓ Clicks count incremented in MongoDB under "Desktop"!
                        {simDesktopResult.isUnique !== undefined && (
                          <span className="block text-indigo-300 mt-0.5">
                            {simDesktopResult.isUnique ? '★ Unique Click detected (+1 Unique Click recorded)' : 'ℹ Repeat Click from this IP (Total clicks +1, Unique unchanged)'}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Android Test */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-green-400 font-bold">
                      <Smartphone className="w-4 h-4" />
                      <span>2. Android Google Play Referrer & Install</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSimulateAndroidClick(simSelectedCode || links[0]?.code)}
                        disabled={simRunning}
                        className="px-3 py-1.5 bg-green-700 hover:bg-green-600 disabled:opacity-50 text-white font-semibold text-xs rounded-lg cursor-pointer"
                      >
                        Step 1: Simulate Click
                      </button>
                      <button
                        onClick={() => handleSimulateAndroidInstall(simSelectedCode || links[0]?.code)}
                        disabled={simRunning}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-xs rounded-lg cursor-pointer"
                      >
                        Step 2: Simulate App Install
                      </button>
                    </div>
                  </div>
                  <p className="text-slate-400 text-[11px] mb-2">
                    Simulates Android click with Play Store referrer tag attached, followed by app install event.
                  </p>
                  {simAndroidResult && (
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-green-500/30 text-green-300 font-mono text-[11px] space-y-1">
                      {simAndroidResult.targetUrl && (
                        <div>
                          <div>✓ <strong>Play Store Redirect:</strong></div>
                          <div className="break-all text-slate-300">{simAndroidResult.targetUrl}</div>
                        </div>
                      )}
                      {simAndroidResult.isUnique !== undefined && (
                        <div className="text-indigo-300 font-sans text-[11px]">
                          {simAndroidResult.isUnique ? '★ Unique Click detected (+1 Unique Click recorded)' : 'ℹ Repeat Click from this IP (Total clicks +1, Unique unchanged)'}
                        </div>
                      )}
                      {simAndroidResult.installRecorded && (
                        <div className="text-emerald-400 font-sans font-bold pt-1">
                          ✓ Download successfully attributed to referrer via Google Play Referrer!
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 3. iOS Test */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-slate-200 font-bold">
                      <Apple className="w-4 h-4" />
                      <span>3. iOS IP Matching Attribution (2-4h TTL Window)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSimulateIosClick(simSelectedCode || links[0]?.code)}
                        disabled={simRunning}
                        className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white font-semibold text-xs rounded-lg cursor-pointer"
                      >
                        Step 1: Simulate Click (Saves IP)
                      </button>
                      <button
                        onClick={handleSimulateIosVerify}
                        disabled={simRunning}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-xs rounded-lg cursor-pointer"
                      >
                        Step 2: Simulate App First Open
                      </button>
                    </div>
                  </div>
                  <p className="text-slate-400 text-[11px] mb-2">
                    Step 1 saves your IP in MongoDB with 3h TTL. Step 2 simulates the iOS app launching, matching the IP, and crediting the download.
                  </p>
                  {simIosResult && (
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-600 text-slate-300 font-mono text-[11px] space-y-1">
                      {simIosResult.targetUrl && (
                        <div>
                          <div>✓ <strong>App Store Redirect:</strong> <span className="break-all text-slate-400">{simIosResult.targetUrl}</span></div>
                          <div className="text-indigo-400">✓ <strong>Pending Attribution:</strong> Saved IP ({simIosResult.ip}) with 3-hour TTL in MongoDB.</div>
                        </div>
                      )}
                      {simIosResult.isUnique !== undefined && (
                        <div className="text-indigo-300 font-sans text-[11px]">
                          {simIosResult.isUnique ? '★ Unique Click detected (+1 Unique Click recorded)' : 'ℹ Repeat Click from this IP (Total clicks +1, Unique unchanged)'}
                        </div>
                      )}
                      {simIosResult.verifyRes && (
                        <div className={simIosResult.verifyRes.attributed ? 'text-emerald-400 font-sans font-bold pt-1' : 'text-amber-400 font-sans pt-1'}>
                          {simIosResult.verifyRes.attributed
                            ? `✓ Match Found! Credited download to code "${simIosResult.verifyRes.attribution?.code}" (User: ${simIosResult.verifyRes.attribution?.referrerUserId})!`
                            : `ℹ️ ${simIosResult.verifyRes.message}`}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl"
              >
                Close Simulator
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add or Edit Project */}
      {(activeModal === 'addProduct' || activeModal === 'editProduct') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                {activeModal === 'editProduct' ? <Pencil className="w-5 h-5" /> : <PackagePlus className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  {activeModal === 'editProduct' ? 'Edit Project' : 'Add New Project'}
                </h3>
                <p className="text-xs text-slate-400">
                  All link fields are optional, but at least 1 destination link is necessary.
                </p>
              </div>
            </div>

            {productMessage.text && (
              <div
                className={`mb-4 p-3 rounded-xl text-xs flex items-center gap-2 ${
                  productMessage.type === 'success'
                    ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                    : 'bg-red-500/10 border border-red-500/30 text-red-400'
                }`}
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{productMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleSaveProject} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Project / Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={projectForm.name}
                  onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                  placeholder="e.g. My SaaS Platform or Fitness App"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  placeholder="Short note about the project"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-200">Destination Links:</span>
                  <span className="text-[11px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                    Fill any 1, 2, or all 3
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-blue-400 mb-1 flex items-center gap-1.5">
                      <Laptop className="w-3.5 h-3.5" />
                      Desktop / Laptop Web URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={projectForm.webUrl}
                      onChange={(e) => setProjectForm({ ...projectForm, webUrl: e.target.value })}
                      placeholder="https://yourwebsite.com/signup"
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:ring-2 focus:ring-indigo-500 outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-green-400 mb-1 flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5" />
                      Android Google Play Store URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={projectForm.androidUrl}
                      onChange={(e) => setProjectForm({ ...projectForm, androidUrl: e.target.value })}
                      placeholder="https://play.google.com/store/apps/details?id=com.your.app"
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:ring-2 focus:ring-indigo-500 outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                      <Apple className="w-3.5 h-3.5" />
                      iOS Apple App Store URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={projectForm.iosUrl}
                      onChange={(e) => setProjectForm({ ...projectForm, iosUrl: e.target.value })}
                      placeholder="https://apps.apple.com/app/your-app/id123456789"
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:ring-2 focus:ring-indigo-500 outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProduct}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-md cursor-pointer"
                >
                  {savingProduct ? 'Saving to MongoDB...' : activeModal === 'editProduct' ? 'Save Changes' : 'Add Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: App Download Attribution & First-Open Simulation */}
      {activeModal === 'attributionInfo' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl p-6 shadow-2xl relative max-h-[85vh] flex flex-col">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">App Download Attribution Mechanics</h3>
                <p className="text-xs text-slate-400">
                  Google Play Install Referrer + iOS IP/Fingerprint Matching (2-4h window)
                </p>
              </div>
            </div>

            <div className="overflow-y-auto flex-1 space-y-5 text-xs pr-1">
              {/* iOS IP Matching Explanation */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-2 text-slate-200 font-bold mb-2">
                  <Apple className="w-4 h-4 text-white" />
                  <span>iOS App Store Attribution (IP + Fingerprint with 2-4h TTL)</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  1. When someone clicks a referral link on an iPhone/iPad, our router captures their <strong>IP Address</strong> & <strong>Fingerprint</strong>, saving it in MongoDB with an expiration of <strong>3 hours</strong>.<br />
                  2. When the user opens the iOS app for the first time, your app calls:
                </p>
                <pre className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-emerald-400 font-mono text-[11px] mt-2 overflow-x-auto">
POST {apiBase}/api/conversions/ios-verify
                </pre>
                <p className="text-slate-400 mt-2">
                  3. If their IP is in the database within that 2-4h window, the backend credits the download to the referrer!
                </p>

                {/* Live iOS Test Simulation Button */}
                <div className="mt-3 pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="text-[11px] text-slate-400">
                    Test the iOS first-open attribution live with your current IP:
                  </span>
                  <button
                    onClick={handleSimulateIosFirstOpen}
                    disabled={simulatingIos}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-[11px] rounded-lg cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
                  >
                    {simulatingIos ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                    <span>Simulate iOS App First Open</span>
                  </button>
                </div>

                {simulationResult && (
                  <div
                    className={`mt-3 p-3 rounded-lg text-[11px] font-mono ${
                      simulationResult.attributed
                        ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {simulationResult.attributed ? (
                      <>
                        <strong>✓ Attributed!</strong> Credited to code "{simulationResult.attribution?.code}" (User: {simulationResult.attribution?.referrerUserId}). Download count incremented!
                      </>
                    ) : (
                      <>
                        <strong>ℹ️ Result:</strong> {simulationResult.message} (Tip: Click one of your referral links first from this device or with iOS User-Agent to create a pending click).
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Android Google Play Referrer Explanation */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-2 text-green-400 font-bold mb-2">
                  <Smartphone className="w-4 h-4" />
                  <span>Android Google Play Install Referrer</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  1. When someone clicks on Android, the link redirects to Google Play with:
                </p>
                <pre className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-green-300 font-mono text-[10px] mt-1 overflow-x-auto">
&referrer=utm_source%3Dreferral%26ref%3DCODE%26ref_by%3DUSER_ID
                </pre>
                <p className="text-slate-400 mt-2 leading-relaxed">
                  2. On first app launch, read the referrer string via Android's <a href="https://developer.android.com/google/play/installreferrer" target="_blank" rel="noreferrer" className="text-indigo-400 underline">Play Install Referrer Library</a>, and report it to:
                </p>
                <pre className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-emerald-400 font-mono text-[11px] mt-1 overflow-x-auto">
{`POST ${apiBase}/api/conversions/android-install
Body: { "referralCode": "code_from_play_store" }`}
                </pre>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Manage All Projects */}
      {activeModal === 'manageProjects' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl p-6 shadow-2xl relative max-h-[85vh] flex flex-col">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                  <FolderGit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Manage Projects</h3>
                  <p className="text-xs text-slate-400">View, edit destination links, or delete projects from MongoDB.</p>
                </div>
              </div>
              <button
                onClick={openAddProjectModal}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer mr-6"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Project</span>
              </button>
            </div>

            <div className="overflow-y-auto flex-1 space-y-3 pr-1">
              {products.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs">
                  No projects currently in MongoDB. Click "Add Project" to create one.
                </div>
              ) : (
                products.map((prod) => (
                  <div
                    key={prod._id}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1 max-w-md">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{prod.name}</span>
                        <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/40">
                          {prod.slug}
                        </span>
                      </div>
                      {prod.description && (
                        <p className="text-xs text-slate-400">{prod.description}</p>
                      )}
                      <div className="flex items-center gap-2 pt-1 text-[10px]">
                        <span
                          className={`px-2 py-0.5 rounded flex items-center gap-1 ${
                            prod.webUrl
                              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                              : 'bg-slate-800/40 text-slate-600 border border-slate-800'
                          }`}
                        >
                          <Laptop className="w-3 h-3" /> {prod.webUrl ? 'Web Link' : 'No Web'}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded flex items-center gap-1 ${
                            prod.androidUrl
                              ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                              : 'bg-slate-800/40 text-slate-600 border border-slate-800'
                          }`}
                        >
                          <Smartphone className="w-3 h-3" /> {prod.androidUrl ? 'Play Store' : 'No Android'}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded flex items-center gap-1 ${
                            prod.iosUrl
                              ? 'bg-slate-500/10 text-slate-300 border border-slate-500/20'
                              : 'bg-slate-800/40 text-slate-600 border border-slate-800'
                          }`}
                        >
                          <Apple className="w-3 h-3" /> {prod.iosUrl ? 'App Store' : 'No iOS'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => openEditProjectModal(prod)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteProject(prod._id, prod.name)}
                        disabled={deletingId === prod._id}
                        className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{deletingId === prod._id ? 'Deleting...' : 'Delete'}</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Website Button Code */}
      {activeModal === 'embedCode' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl p-6 shadow-2xl relative">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Embed Button Code for Your Main Website</h3>
                <p className="text-xs text-slate-400">
                  Copy and paste this code onto your already built website to show the popup form.
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <p className="text-slate-300 mb-1.5 font-medium">1. Place this button anywhere on your website:</p>
                <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-indigo-300 overflow-x-auto font-mono">
                  {`<button id="open-referral-modal" class="referral-button">
  Refer & Earn 🎁
</button>`}
                </pre>
              </div>

              <div>
                <p className="text-slate-300 mb-1.5 font-medium">2. Add the script just before the closing &lt;/body&gt; tag:</p>
                <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-emerald-400 overflow-x-auto font-mono">
                  {`<script src="${apiBase}/embed.js"></script>`}
                </pre>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: QR Code */}
      {activeModal === 'qrCode' && selectedQrLink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-sm p-6 shadow-2xl relative text-center">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-white mb-1">Scan Referral QR Code</h3>
            <p className="text-xs text-slate-400 mb-4">{selectedQrLink.product?.name}</p>

            <div className="bg-white p-4 rounded-xl inline-block shadow-lg mx-auto">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                  selectedQrLink.fullUrl
                )}`}
                alt="Referral QR Code"
                className="w-44 h-44"
              />
            </div>

            <p className="text-[11px] text-slate-400 mt-4 break-all font-mono">
              {selectedQrLink.fullUrl}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
