import dayjs from 'dayjs';
import React, { useState, useEffect } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { FaExternalLinkAlt, FaRegCalendarAlt, FaTrash, FaClock, FaFingerprint } from 'react-icons/fa';
import { MdAnalytics, MdOutlineAdsClick } from 'react-icons/md';
import { LiaCheckSolid } from "react-icons/lia";
import { IoCopy } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { useStoreContext } from '../../contextApi/ContextApi';
import api from '../../api/api';
import Graph from './Graph';
import { Hourglass } from 'react-loader-spinner';
import toast from 'react-hot-toast';

const ShortenItem = ({ id, originalUrl, shortUrl, clickCount, createdDate, isOneTimeUrl, isUsed, expiresAt, isActive, onDelete }) => {
    const{ token } = useStoreContext();
    const navigate = useNavigate();
    const [isCopied, setIsCopied] = useState(false);
    const [loader, setLoader] = useState(false);
    const [analyticToggle, setAnalyticToggle] = useState(false);
    const [selectedUrl, setSelectedUrl] = useState("");
    const [analyticsData, setAnalyticsData] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const subDomain = import.meta.env.VITE_REACT_FRONT_END_URL
        ? import.meta.env.VITE_REACT_FRONT_END_URL.replace(/^https?:\/\//, '')
        : '';

    const shortHref = `${import.meta.env.VITE_REACT_SUBDOMAIN}/${shortUrl}`;
    const shortDisplay = `${subDomain}/${shortUrl}`;

    const analyticsHandler = (shortUrl) => {
        if(!analyticToggle){
            setSelectedUrl(shortUrl);
        }
        setAnalyticToggle(!analyticToggle);
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await api.delete(`/api/urls/${id}`, {
                headers: {
                    Authorization: "Bearer " + token,
                },
            });
            toast.success("URL deleted successfully");
            setShowDeleteModal(false);
            if (onDelete) {
                onDelete();
            }
        } catch (error) {
            toast.error("Failed to delete URL");
            console.error("Delete error:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    const fetchMyShortUrl = async () => {
        setLoader(true);
        try {
             const { data } = await api.get(`/api/urls/analytics/${selectedUrl}?startDate=2025-12-01T00:00:00&endDate=2027-12-31T23:59:59`, {
                        headers: {
                          "Content-Type": "application/json",
                          Accept: "application/json",
                          Authorization: "Bearer " + token,
                        },
                      });
            setAnalyticsData(data);
            setSelectedUrl("");
            // console.log(data);
            
        } catch (error) {
            navigate("/error");
            console.log(error);
        } finally {
            setLoader(false);
        }
    }


    useEffect(() => {
        if (selectedUrl) {
            fetchMyShortUrl();
        }
    }, [selectedUrl]);

    // Check if URL is expired
    const isExpired = expiresAt && new Date(expiresAt) < new Date();

    return (
        <div className={`bg-white shadow-lg border-l-4 ${isActive === false || isExpired ? 'border-l-red-500 bg-red-50/30' : 'border-l-blue-500'} px-6 sm:py-1 py-3 rounded-lg transition-all duration-200 hover:shadow-xl`}>
            <div className="flex sm:flex-row flex-col sm:justify-between w-full sm:gap-0 gap-5 py-5">
                <div className="flex-1 sm:space-y-1 max-w-full overflow-x-auto overflow-y-hidden">
                    <div className="text-slate-900 pb-1 sm:pb-0 flex items-center gap-2 flex-wrap">
                        <a
                            href={shortHref}
                            target="_blank"
                            rel="noreferrer"
                            className={`text-[17px] font-montserrat font-[600] ${isActive === false || isExpired ? 'text-gray-400 line-through' : 'text-linkColor'}`}
                        >
                            {shortDisplay}
                        </a>
                        <FaExternalLinkAlt className={isActive === false || isExpired ? 'text-gray-400' : 'text-linkColor'} />

                        {/* Badges */}
                        {isOneTimeUrl && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
                                <FaFingerprint className="text-[10px]" />
                                One-Time
                            </span>
                        )}
                        {expiresAt && (
                            <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${isExpired ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                                <FaClock className="text-[10px]" />
                                {isExpired ? 'Expired' : `Expires ${dayjs(expiresAt).format("MMM DD, HH:mm")}`}
                            </span>
                        )}
                        {isActive === false && !isExpired && (
                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                                Inactive
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-1">
                        <h3 className="text-slate-700 font-[400] text-[17px]">
                            {originalUrl}
                        </h3>
                    </div>

                    <div className="flex items-center gap-8 pt-6">
                        <div className="flex gap-1 items-center font-semibold text-green-800">
                            <span>
                                <MdOutlineAdsClick className="text-[22px] me-1" />
                            </span>
                            <span className="text-[16px]">{clickCount}</span>
                            <span className="text-[15px]">
                                {clickCount === 0 || clickCount === 1 ? 'Click' : 'Clicks'}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 font-semibold text-lg text-slate-800">
                            <span>
                                <FaRegCalendarAlt />
                            </span>
                            <span className="text-[17px]">
                                {dayjs(createdDate).format("MMM DD, YYYY")}
                            </span>
                        </div>
                    </div>
                </div>

                 <div className="flex  flex-1  sm:justify-end items-center gap-3 flex-wrap">
                    <CopyToClipboard
                        onCopy={() => setIsCopied(true)}
                        text={`${import.meta.env.VITE_REACT_FRONT_END_URL + "/s/" + `${shortUrl}`}`}
                    >
                        <div className="flex cursor-pointer gap-1.5 items-center bg-gradient-to-r from-blue-500 to-blue-600 py-2.5 font-semibold shadow-md hover:shadow-lg px-5 rounded-lg text-white transition-all duration-200 hover:from-blue-600 hover:to-blue-700">
                        <button className="">{isCopied ? "Copied" : "Copy"}</button>
                        {isCopied ? (
                            <LiaCheckSolid className="text-md" />
                        ) : (
                            <IoCopy className="text-md" />
                        )}
                        </div>
                    </CopyToClipboard>
                    <div
                        onClick={() => analyticsHandler(shortUrl)}
                        className="flex cursor-pointer gap-1.5 items-center bg-gradient-to-r from-purple-500 to-purple-600 py-2.5 font-semibold shadow-md hover:shadow-lg px-5 rounded-lg text-white transition-all duration-200 hover:from-purple-600 hover:to-purple-700"
                    >
                        <button>Analytics</button>
                        <MdAnalytics className="text-md" />
                    </div>
                    <div
                        onClick={() => setShowDeleteModal(true)}
                        className="flex cursor-pointer gap-1.5 items-center bg-gradient-to-r from-red-500 to-red-600 py-2.5 font-semibold shadow-md hover:shadow-lg px-5 rounded-lg text-white transition-all duration-200 hover:from-red-600 hover:to-red-700"
                    >
                        <button>Delete</button>
                        <FaTrash className="text-sm" />
                    </div>
                </div>
            </div>
            <React.Fragment>
                <div className={`${
                    analyticToggle ? "flex" : "hidden"
                    }  max-h-96 sm:mt-0 mt-5 min-h-96 relative  border-t-2 w-[100%] overflow-hidden `}>
                        {loader ? (
                            <div className="mini-h-[calc(450vh-140px)] flex justify-center items-center w-full">
                                <div className=" Flex flex-col items-center gap-1">
                                    <Hourglass
                                        visible={true}
                                        height="50"
                                        width="50"
                                        ariaLabel="hourglass-loading"
                                        wrapperStyle={{}}
                                        wrapperClass=""
                                        colors={['#306cce', '#72a1ed']}
                                    />
                                    <p className='text-slate-700'>Please Wait...</p>
                                </div>
                            </div>
                            ) : (
                            <>{analyticsData.length === 0 && (
                             <div className="absolute flex flex-col  justify-center sm:items-center items-end  w-full left-0 top-0 bottom-0 right-0 m-auto">
                                <h1 className=" text-slate-800 font-serif sm:text-2xl text-[15px] font-bold mb-1">
                                    No Data For This Time Period
                                </h1>
                                <h3 className="sm:w-96 w-[90%] sm:ml-0 pl-6 text-center sm:text-lg text-[12px] text-slate-600 ">
                                    Share your short link to view where your engagements are
                                    coming from
                                </h3>
                            </div>
                            )}
                            <Graph graphData={analyticsData} />
                            </>
                        )}
                </div>
            </React.Fragment>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl transform transition-all">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                                <FaTrash className="text-red-600 text-xl" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Delete URL</h3>
                        </div>
                        <p className="text-gray-600 mb-2">
                            Are you sure you want to delete this shortened URL?
                        </p>
                        <div className="text-sm text-gray-700 bg-gray-100 p-3 rounded-lg mb-4 break-all border-l-4 border-blue-500">
                            <span className="text-blue-600 font-medium">{shortDisplay}</span>
                        </div>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                            <p className="text-sm text-red-700 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                This action cannot be undone. All analytics data will be deleted.
                            </p>
                        </div>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-5 py-2.5 text-gray-600 hover:text-gray-800 font-medium rounded-lg hover:bg-gray-100 transition-colors"
                                disabled={isDeleting}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isDeleting ? 'Deleting...' : 'Delete URL'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShortenItem;




