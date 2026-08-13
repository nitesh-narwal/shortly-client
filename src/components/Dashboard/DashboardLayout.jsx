import React, { useEffect, useMemo, useState } from 'react'
import Graph from './Graph'
import { useFetchMyShortUrls, useFetchTotalClicks } from '../../hooks/useQuery'
import { useStoreContext } from '../../contextApi/ContextApi'
import ShortenPopUp from './ShortenPopUp'
import ShortenUrlList from './ShortenUrlList'
import { FaLink, FaPlus, FaChartLine, FaSearch, FaStar, FaCheckSquare, FaDownload, FaTimes, FaTrash } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import Loader from '../Loader'
import api from '../../api/api'
import toast from 'react-hot-toast'

const DashboardLayout = () => {
    const {token} = useStoreContext();
    const navigate = useNavigate();
    const [ShortenPopup, setShortenPopup] = useState(false);
    const [prefillUrl, setPrefillUrl] = useState('');

    const {isLoading, data: myShortenUrls, refetch}  = useFetchMyShortUrls(token, onError)
    const {isLoading: loader, data: totalClicks}  = useFetchTotalClicks(token, onError)

    // If the visitor typed a URL into the landing-page demo box before signing in
    // (or while logged in), open the create form pre-filled with it.
    useEffect(() => {
        const pending = sessionStorage.getItem('shortly_prefill_url');
        if (pending) {
            sessionStorage.removeItem('shortly_prefill_url');
            setPrefillUrl(pending);
            setShortenPopup(true);
        }
    }, []);

    // Search / filter
    const [query, setQuery] = useState('');
    const [tagFilter, setTagFilter] = useState('');
    const [favoriteOnly, setFavoriteOnly] = useState(false);
    const [searchResults, setSearchResults] = useState(null);
    const [searching, setSearching] = useState(false);

    // Bulk selection
    const [selectMode, setSelectMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [bulkDeleting, setBulkDeleting] = useState(false);
    const [showBulkConfirm, setShowBulkConfirm] = useState(false);
    const [exporting, setExporting] = useState(false);

    function onError() {
        navigate("/error");
    }

    const isFiltering = query.trim() !== '' || tagFilter.trim() !== '' || favoriteOnly;

    useEffect(() => {
        if (!isFiltering) {
            setSearchResults(null);
            return;
        }
        setSearching(true);
        const timeout = setTimeout(() => {
            api
                .get('/api/urls/search', {
                    params: {
                        query: query.trim() || undefined,
                        tag: tagFilter.trim() || undefined,
                        favoriteOnly,
                        size: 100,
                    },
                })
                .then(({ data }) => setSearchResults(data.content || []))
                .catch(() => toast.error('Search failed'))
                .finally(() => setSearching(false));
        }, 350);
        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query, tagFilter, favoriteOnly]);

    const displayedUrls = useMemo(
        () => (isFiltering ? searchResults : myShortenUrls) || [],
        [isFiltering, searchResults, myShortenUrls]
    );

    const clearFilters = () => {
        setQuery('');
        setTagFilter('');
        setFavoriteOnly(false);
    };

    const toggleSelectMode = () => {
        setSelectMode(!selectMode);
        setSelectedIds(new Set());
    };

    const toggleSelectId = (id) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
        });
    };

    const selectAllVisible = () => {
        setSelectedIds(new Set(displayedUrls.map((u) => u.id)));
    };

    const handleBulkDelete = async () => {
        setBulkDeleting(true);
        try {
            const { data } = await api.delete('/api/urls/bulk', { data: { ids: Array.from(selectedIds) } });
            toast.success(`${data.deleted?.length || 0} link${(data.deleted?.length || 0) === 1 ? '' : 's'} deleted`);
            setSelectedIds(new Set());
            setSelectMode(false);
            setShowBulkConfirm(false);
            refetch();
        } catch (error) {
            toast.error(error.friendlyMessage || 'Bulk delete failed');
        } finally {
            setBulkDeleting(false);
        }
    };

    const handleExport = async () => {
        setExporting(true);
        try {
            const response = await api.get('/api/urls/export', { responseType: 'blob' });
            const blobUrl = URL.createObjectURL(response.data);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = 'shortly-links.csv';
            link.click();
            URL.revokeObjectURL(blobUrl);
        } catch (error) {
            toast.error(error.friendlyMessage || 'Export failed');
        } finally {
            setExporting(false);
        }
    };

  return (
    <div className='lg:px-14 sm:px-8 px-4 min-h-[calc(100vh-64px)] bg-gradient-to-br from-slate-50 via-white to-slate-100'>
        { loader ? (
            < Loader />
        ): (
        <div className='lg:w-[95%] w-full mx-auto py-10'>
            {/* Header with Stats */}
            <div className="mb-10">
                <div className="flex sm:flex-row flex-col sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-800 mb-2 bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent">
                            Dashboard
                        </h1>
                        <p className="text-slate-600 text-base">Manage and track your shortened URLs</p>
                    </div>
                    <button
                        className='bg-gradient-to-r from-rose-500 to-purple-600 text-white px-6 py-3.5 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 hover:-translate-y-0.5'
                        onClick={() => setShortenPopup(true)}>
                        <FaPlus className="text-sm" />
                        Create New Link
                    </button>
                </div>

                {/* Quick Stats Cards */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm font-medium mb-1">Total Links</p>
                                <h3 className="text-3xl font-bold">{myShortenUrls?.length || 0}</h3>
                            </div>
                            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                                <FaLink className="text-2xl" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-100 text-sm font-medium mb-1">Total Clicks</p>
                                <h3 className="text-3xl font-bold">
                                    {totalClicks?.reduce((sum, item) => sum + (item.clickCount || 0), 0) || 0}
                                </h3>
                            </div>
                            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                                <FaChartLine className="text-2xl" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl shadow-lg p-6 text-white sm:col-span-2 lg:col-span-1">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-rose-100 text-sm font-medium mb-1">Avg Clicks/Link</p>
                                <h3 className="text-3xl font-bold">
                                    {myShortenUrls?.length > 0
                                        ? Math.round(totalClicks?.reduce((sum, item) => sum + (item.clickCount || 0), 0) / myShortenUrls.length)
                                        : 0}
                                </h3>
                            </div>
                            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                                <FaChartLine className="text-2xl" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Analytics Graph Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 mb-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                        <FaChartLine className="text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">Click Analytics</h2>
                </div>
                <div className="h-80 relative">
                    {(totalClicks?.length ?? 0) === 0 && (
                         <div className="absolute flex flex-col justify-center items-center w-full left-0 top-0 bottom-0 right-0 m-auto bg-slate-50 rounded-xl">
                         <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4">
                             <FaChartLine className="text-slate-400 text-2xl" />
                         </div>
                         <h1 className="text-slate-700 font-bold sm:text-xl text-lg mb-2">
                           No Data For This Time Period
                         </h1>
                         <p className="sm:w-96 w-[90%] text-center sm:text-base text-sm text-slate-500">
                           Share your short links to view where your engagements are coming from
                         </p>
                       </div>
                    )}
                    <Graph graphData={totalClicks || []} />
                </div>
            </div>

            {/* URL List Section */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
                <div className="flex sm:flex-row flex-col sm:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-rose-100 to-purple-100 rounded-lg flex items-center justify-center">
                            <FaLink className="text-rose-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800">Your Shortened URLs</h2>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        <button
                            onClick={handleExport}
                            disabled={exporting}
                            className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors disabled:opacity-50"
                        >
                            <FaDownload className="text-xs" /> {exporting ? 'Exporting...' : 'Export CSV'}
                        </button>
                        <button
                            onClick={toggleSelectMode}
                            className={`flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors ${
                                selectMode ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            }`}
                        >
                            <FaCheckSquare className="text-xs" /> {selectMode ? 'Cancel Select' : 'Select'}
                        </button>
                    </div>
                </div>

                {/* Search / filter bar */}
                <div className="flex sm:flex-row flex-col gap-3 mb-6">
                    <div className="relative flex-1">
                        <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search by URL or short code..."
                            className="w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 bg-slate-50 focus:bg-white"
                        />
                    </div>
                    <input
                        type="text"
                        value={tagFilter}
                        onChange={(e) => setTagFilter(e.target.value)}
                        placeholder="Filter by tag"
                        className="sm:w-48 px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 bg-slate-50 focus:bg-white"
                    />
                    <button
                        onClick={() => setFavoriteOnly(!favoriteOnly)}
                        className={`flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors border ${
                            favoriteOnly ? 'bg-amber-50 border-amber-300 text-amber-700' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                    >
                        <FaStar className={favoriteOnly ? 'text-amber-500' : 'text-slate-400'} /> Favorites
                    </button>
                    {isFiltering && (
                        <button
                            onClick={clearFilters}
                            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-500 hover:text-slate-700"
                        >
                            <FaTimes /> Clear
                        </button>
                    )}
                </div>

                {/* Bulk action bar */}
                {selectMode && (
                    <div className="flex flex-wrap items-center gap-3 bg-rose-50 border border-rose-200 rounded-lg px-4 py-3 mb-6">
                        <span className="text-sm font-semibold text-rose-800">{selectedIds.size} selected</span>
                        <button onClick={selectAllVisible} className="text-sm text-rose-600 hover:underline font-medium">
                            Select all ({displayedUrls.length})
                        </button>
                        <button onClick={() => setSelectedIds(new Set())} className="text-sm text-slate-500 hover:underline">
                            Clear
                        </button>
                        <button
                            onClick={() => setShowBulkConfirm(true)}
                            disabled={selectedIds.size === 0}
                            className="ml-auto flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <FaTrash className="text-xs" /> Delete Selected
                        </button>
                    </div>
                )}

                <div>
                  {searching ? (
                    <div className="flex justify-center py-16 text-slate-400 text-sm">Searching...</div>
                  ) : !isLoading && displayedUrls.length === 0 ? (
                    <div className="flex justify-center py-16">
                      <div className="flex flex-col gap-4 items-center justify-center py-12 px-10 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-dashed border-slate-300">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center shadow-lg">
                          <FaLink className="text-blue-600 text-3xl" />
                        </div>
                        <h1 className="text-slate-800 font-semibold text-xl">
                          {isFiltering ? 'No matching URLs' : 'No shortened URLs yet'}
                        </h1>
                        <p className="text-slate-500 text-sm text-center max-w-md leading-relaxed">
                          {isFiltering
                            ? 'Try a different search term, tag, or clear your filters.'
                            : (<>Click the <span className="font-semibold text-rose-600">"Create New Link"</span> button above to create your first short URL and start tracking clicks.</>)}
                        </p>
                        {!isFiltering && (
                            <button
                                className='bg-gradient-to-r from-rose-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 mt-2'
                                onClick={() => setShortenPopup(true)}>
                                <FaPlus className="text-sm" />
                                Create Your First Link
                            </button>
                        )}
                      </div>
                  </div>
                  ):(
                      <ShortenUrlList
                        data={displayedUrls}
                        onDelete={refetch}
                        selectable={selectMode}
                        selectedIds={selectedIds}
                        onToggleSelect={toggleSelectId}
                      />
                  )}
                </div>
            </div>
        </div>
        )}
        <ShortenPopUp
            open={ShortenPopup}
            setOpen={setShortenPopup}
            refetch={refetch}
            prefillUrl={prefillUrl}
        />

        {/* Bulk delete confirmation */}
        {showBulkConfirm && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
                <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                            <FaTrash className="text-red-600 text-xl" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">Delete {selectedIds.size} link{selectedIds.size === 1 ? '' : 's'}?</h3>
                    </div>
                    <p className="text-gray-600 mb-6">This action cannot be undone. All analytics data for these links will be deleted too.</p>
                    <div className="flex gap-3 justify-end">
                        <button
                            onClick={() => setShowBulkConfirm(false)}
                            className="px-5 py-2.5 text-gray-600 hover:text-gray-800 font-medium rounded-lg hover:bg-gray-100 transition-colors"
                            disabled={bulkDeleting}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleBulkDelete}
                            disabled={bulkDeleting}
                            className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                        >
                            {bulkDeleting ? 'Deleting...' : 'Delete'}
                        </button>
                    </div>
                </div>
            </div>
        )}

    </div>
  )
}

export default DashboardLayout
