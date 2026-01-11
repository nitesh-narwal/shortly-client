import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import Tooltip from '@mui/material/Tooltip';
import { RxCross2 } from 'react-icons/rx';
import { FaFingerprint, FaClock, FaInfoCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';
import TextField from '../TextField';
import api from '../../api/api';
import { useStoreContext } from '../../contextApi/ContextApi';

const CreateNewShorten = ({setOpen, refetch}) => {
  const { token } = useStoreContext();
    const [loading, setLoading] = useState(false);
    const [isOneTimeUrl, setIsOneTimeUrl] = useState(false);
    const [hasExpiration, setHasExpiration] = useState(false);
    const [expiresInHours, setExpiresInHours] = useState(24);

    const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      originalUrl: "",
    },
    mode: "onTouched",
  });
    const createShortUrlHandler = async (data) => {
    setLoading(true);
    try {
        const requestData = {
            originalUrl: data.originalUrl,
            isOneTimeUrl: isOneTimeUrl,
            ...(hasExpiration && { expiresInHours: parseInt(expiresInHours) })
        };

        const { data: res } = await api.post("/api/urls/shorten", requestData, {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: "Bearer " + token,
            },
          });

          const shortenUrl = `${import.meta.env.VITE_REACT_FRONT_END_URL + "/s/" + `${res.shortUrl}`}`;
          await navigator.clipboard.writeText(shortenUrl);

          toast.success("Short URL Copied to Clipboard", {
              position: "bottom-center",
              className: "mb-5",
              duration: 3000,
          });
          
          if (refetch) {
            refetch();
          }
          reset();
          setIsOneTimeUrl(false);
          setHasExpiration(false);
          setExpiresInHours(24);
          setOpen(false);
    } catch (error) {
        toast.error("Create ShortURL Failed");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className=' flex justify-center items-center bg-white rounded-md'>
        <form
            onSubmit={handleSubmit(createShortUrlHandler)}
            className="sm:w-[500px] w-[380px] relative shadow-custom pt-8 pb-5 sm:px-8 px-4 rounded-lg"
        >
            <h1 className="font-montserrat sm:mt-0 mt-3 text-center font-bold sm:text-2xl text-[22px] text-slate-800 ">
                Create New Shorten Url
        </h1>

        <hr className="mt-2 sm:mb-5 mb-3 text-slate-950" />


        <div>
          <TextField 
            label="Enter URL"
            required
            id="originalUrl"
            placeholder="https://example.com"
            type="url"
            message="Url is required"
            register={register}
            errors={errors}
          />
        </div>

        {/* Advanced Options Section */}
        <div className="mt-4 space-y-4">
          <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <FaInfoCircle className="text-blue-500" />
            Advanced Options
          </h3>

          {/* One-Time URL Toggle */}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center gap-3">
              <FaFingerprint className="text-purple-600 text-xl" />
              <div>
                <p className="font-medium text-slate-800 text-sm">One-Time URL</p>
                <p className="text-xs text-slate-500">Each device can access only once</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isOneTimeUrl}
                onChange={(e) => setIsOneTimeUrl(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          {/* Expiration Time Toggle */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FaClock className="text-orange-600 text-xl" />
                <div>
                  <p className="font-medium text-slate-800 text-sm">Set Expiration Time</p>
                  <p className="text-xs text-slate-500">URL will expire after set time</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasExpiration}
                  onChange={(e) => setHasExpiration(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
              </label>
            </div>

            {hasExpiration && (
              <div className="mt-3 pt-3 border-t border-slate-200">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Expires in (hours)
                </label>
                <div className="flex gap-2 flex-wrap">
                  {[1, 6, 12, 24, 48, 72, 168, 720].map((hours) => (
                    <button
                      key={hours}
                      type="button"
                      onClick={() => setExpiresInHours(hours)}
                      className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
                        expiresInHours === hours
                          ? 'bg-orange-600 text-white'
                          : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {hours < 24 ? `${hours}h` : hours === 24 ? '1d' : hours === 48 ? '2d' : hours === 72 ? '3d' : hours === 168 ? '1w' : '30d'}
                    </button>
                  ))}
                </div>
                <div className="mt-2">
                  <input
                    type="number"
                    min="1"
                    max="8760"
                    value={expiresInHours}
                    onChange={(e) => setExpiresInHours(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Custom hours"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Info note about auto-deletion */}
          <p className="text-xs text-slate-500 bg-blue-50 p-2 rounded-lg">
            <span className="font-medium text-blue-700">Note:</span> All URLs are automatically deleted after 3 months of inactivity to keep your dashboard clean.
          </p>
        </div>

         <button
          className="bg-customRed font-semibold text-white w-full bg-custom-gradient py-2.5 transition-colors rounded-md mt-5"
          type="submit"
        >
          {loading ? "Creating..." : "Create Short URL"}
        </button>

        {!loading && (
          <Tooltip title="Close">
            <button
              disabled={loading}
              onClick={() => setOpen(false)}
              className=" absolute right-2 top-2  "
            >
              <RxCross2 className="text-slate-800   text-3xl" />
            </button>
          </Tooltip>
        )}

        </form>

    </div>
  )
}

export default CreateNewShorten