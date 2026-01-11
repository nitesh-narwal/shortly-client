import React, { useState } from 'react'
import Graph from './Graph'
import { useFetchMyShortUrls, useFetchTotalClicks } from '../../hooks/useQuery'
import { useStoreContext } from '../../contextApi/ContextApi'
import ShortenPopUp from './ShortenPopUp'
import ShortenUrlList from './ShortenUrlList'
import { FaLink, FaPlus, FaChartLine } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import Loader from '../Loader'

const DashboardLayout = () => {
    // const refetch = false;
    const {token} = useStoreContext();
    const navigate = useNavigate();
    const [ShortenPopup, setShortenPopup] = useState(false);

    //console.log(useFetchTotalClicks(token, onError));

    const {isLoading, data: myShortenUrls, refetch}  = useFetchMyShortUrls(token, onError)

    const {isLoading: loader, data: totalClicks}  = useFetchTotalClicks(token, onError)

    function onError() {
        navigate("/error");
    }

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
                    {totalClicks.length === 0 && (
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
                    <Graph graphData={totalClicks} />
                </div>
            </div>

            {/* URL List Section */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-rose-100 to-purple-100 rounded-lg flex items-center justify-center">
                            <FaLink className="text-rose-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800">Your Shortened URLs</h2>
                    </div>
                </div>
                
                <div>
                  {!isLoading && myShortenUrls.length === 0 ? (
                    <div className="flex justify-center py-16">
                      <div className="flex flex-col gap-4 items-center justify-center py-12 px-10 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-dashed border-slate-300">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center shadow-lg">
                          <FaLink className="text-blue-600 text-3xl" />
                        </div>
                        <h1 className="text-slate-800 font-semibold text-xl">
                          No shortened URLs yet
                        </h1>
                        <p className="text-slate-500 text-sm text-center max-w-md leading-relaxed">
                          Click the <span className="font-semibold text-rose-600">"Create New Link"</span> button above to create your first short URL and start tracking clicks.
                        </p>
                        <button
                            className='bg-gradient-to-r from-rose-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 mt-2'
                            onClick={() => setShortenPopup(true)}>
                            <FaPlus className="text-sm" />
                            Create Your First Link
                        </button>
                      </div>
                  </div>
                  ):(
                      <ShortenUrlList data={myShortenUrls} onDelete={refetch} />
                  )}
                </div>
            </div>
        </div>
        )}
        <ShortenPopUp
            open={ShortenPopup}
            setOpen={setShortenPopup}
            refetch={refetch}
        />

    </div>
  )
}

export default DashboardLayout
