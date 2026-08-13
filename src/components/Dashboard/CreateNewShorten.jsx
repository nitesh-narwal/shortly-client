import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import Tooltip from '@mui/material/Tooltip';
import { RxCross2 } from 'react-icons/rx';
import { FaFingerprint, FaClock, FaInfoCircle, FaTag, FaLock, FaLayerGroup, FaLink } from 'react-icons/fa';
import toast from 'react-hot-toast';
import TextField from '../TextField';
import api from '../../api/api';

const CreateNewShorten = ({setOpen, refetch, prefillUrl}) => {
    const [loading, setLoading] = useState(false);
    const [isOneTimeUrl, setIsOneTimeUrl] = useState(false);
    const [hasExpiration, setHasExpiration] = useState(false);
    const [expiresInHours, setExpiresInHours] = useState(24);
    const [customAlias, setCustomAlias] = useState('');
    const [hasPassword, setHasPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');
    const [bulkMode, setBulkMode] = useState(false);
    const [bulkUrls, setBulkUrls] = useState('');
    const [bulkResult, setBulkResult] = useState(null);

    const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      originalUrl: prefillUrl || "",
    },
    mode: "onTouched",
  });

  const addTag = () => {
    const value = tagInput.trim();
    if (value && !tags.includes(value) && tags.length < 10) {
      setTags([...tags, value]);
    }
    setTagInput('');
  };

  const removeTag = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const resetForm = () => {
    reset();
    setIsOneTimeUrl(false);
    setHasExpiration(false);
    setExpiresInHours(24);
    setCustomAlias('');
    setHasPassword(false);
    setPassword('');
    setTags([]);
    setTagInput('');
    setBulkUrls('');
    setBulkResult(null);
  };

    const createShortUrlHandler = async (data) => {
    setLoading(true);
    try {
        const requestData = {
            originalUrl: data.originalUrl,
            isOneTimeUrl: isOneTimeUrl,
            ...(hasExpiration && { expiresInHours: parseInt(expiresInHours) }),
            ...(customAlias.trim() && { customAlias: customAlias.trim() }),
            ...(hasPassword && password && { password }),
            ...(tags.length > 0 && { tags }),
        };

        const { data: res } = await api.post("/api/urls/shorten", requestData);

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
          resetForm();
          setOpen(false);
    } catch (error) {
        toast.error(error.friendlyMessage || "Create ShortURL Failed");
    } finally {
        setLoading(false);
    }
  };

  const createBulkHandler = async (e) => {
    e.preventDefault();
    const urls = bulkUrls
      .split('\n')
      .map((u) => u.trim())
      .filter(Boolean);

    if (urls.length === 0) {
      toast.error('Enter at least one URL, one per line');
      return;
    }
    if (urls.length > 50) {
      toast.error('Max 50 URLs per batch');
      return;
    }

    setLoading(true);
    setBulkResult(null);
    try {
      const payload = {
        urls: urls.map((originalUrl) => ({
          originalUrl,
          isOneTimeUrl,
          ...(hasExpiration && { expiresInHours: parseInt(expiresInHours) }),
          ...(hasPassword && password && { password }),
          ...(tags.length > 0 && { tags }),
        })),
      };
      const { data } = await api.post('/api/urls/bulk/shorten', payload);
      setBulkResult(data);
      if (data.created?.length) {
        toast.success(`${data.created.length} short URL${data.created.length === 1 ? '' : 's'} created`);
      }
      if (data.failed?.length) {
        toast.error(`${data.failed.length} URL${data.failed.length === 1 ? '' : 's'} failed`);
      }
      if (refetch) {
        refetch();
      }
    } catch (error) {
      toast.error(error.friendlyMessage || 'Bulk create failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=' flex justify-center items-center bg-white rounded-md'>
        <form
            onSubmit={bulkMode ? createBulkHandler : handleSubmit(createShortUrlHandler)}
            className="sm:w-[520px] w-[380px] relative shadow-custom pt-8 pb-5 sm:px-8 px-4 rounded-lg max-h-[90vh] overflow-y-auto"
        >
            <h1 className="font-montserrat sm:mt-0 mt-3 text-center font-bold sm:text-2xl text-[22px] text-slate-800 ">
                Create New Shorten Url
        </h1>

        <hr className="mt-2 sm:mb-5 mb-3 text-slate-950" />

        {/* Single / Bulk mode switch */}
        <div className="flex bg-slate-100 rounded-lg p-1 mb-4">
          <button
            type="button"
            onClick={() => setBulkMode(false)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-sm font-semibold transition-colors ${!bulkMode ? 'bg-white shadow text-rose-600' : 'text-slate-500'}`}
          >
            <FaLink className="text-xs" /> Single
          </button>
          <button
            type="button"
            onClick={() => setBulkMode(true)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-sm font-semibold transition-colors ${bulkMode ? 'bg-white shadow text-rose-600' : 'text-slate-500'}`}
          >
            <FaLayerGroup className="text-xs" /> Bulk
          </button>
        </div>

        {!bulkMode ? (
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
        ) : (
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Enter URLs (one per line, up to 50)
            </label>
            <textarea
              value={bulkUrls}
              onChange={(e) => setBulkUrls(e.target.value)}
              rows={5}
              placeholder={"https://example.com/one\nhttps://example.com/two"}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono"
            />
            <p className="text-xs text-slate-500 mt-1">
              Advanced options below apply to every URL in this batch.
            </p>
          </div>
        )}

        {/* Advanced Options Section */}
        <div className="mt-4 space-y-4">
          <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <FaInfoCircle className="text-blue-500" />
            Advanced Options
          </h3>

          {/* Custom Alias */}
          {!bulkMode && (
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-800 mb-2">
                <FaFingerprint className="text-indigo-600" />
                Custom Alias <span className="text-xs font-normal text-slate-400">(optional)</span>
              </label>
              <input
                type="text"
                value={customAlias}
                onChange={(e) => setCustomAlias(e.target.value)}
                placeholder="my-brand-name"
                maxLength={32}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-xs text-slate-500 mt-1">4-32 chars, letters/numbers/hyphens/underscores. Leave blank to auto-generate.</p>
            </div>
          )}

          {/* Tags */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-800 mb-2">
              <FaTag className="text-teal-600" />
              Tags <span className="text-xs font-normal text-slate-400">(optional, press Enter to add)</span>
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {tags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-teal-100 text-teal-700 rounded-full">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="hover:text-teal-900">
                    <RxCross2 />
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              onBlur={addTag}
              placeholder="marketing, launch, ..."
              disabled={tags.length >= 10}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50"
            />
          </div>

          {/* Password Protection */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FaLock className="text-rose-600 text-xl" />
                <div>
                  <p className="font-medium text-slate-800 text-sm">Password Protect</p>
                  <p className="text-xs text-slate-500">Visitors must enter a password to open the link</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasPassword}
                  onChange={(e) => setHasPassword(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-rose-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
              </label>
            </div>
            {hasPassword && (
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Set a password (min 4 characters)"
                minLength={4}
                className="w-full mt-3 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            )}
          </div>

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

        {/* Bulk results */}
        {bulkResult && (
          <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
            {bulkResult.created?.map((item) => (
              <div key={item.id} className="text-xs bg-green-50 border border-green-200 text-green-800 rounded-lg px-3 py-2 flex justify-between gap-2">
                <span className="truncate">{item.originalUrl}</span>
                <span className="font-semibold whitespace-nowrap">/{item.shortUrl}</span>
              </div>
            ))}
            {bulkResult.failed?.map((item, i) => (
              <div key={i} className="text-xs bg-red-50 border border-red-200 text-red-800 rounded-lg px-3 py-2">
                <span className="font-semibold">Failed:</span> {item.originalUrl} - {item.error}
              </div>
            ))}
          </div>
        )}

         <button
          className="bg-customRed font-semibold text-white w-full bg-custom-gradient py-2.5 transition-colors rounded-md mt-5"
          type="submit"
          disabled={loading}
        >
          {loading ? "Creating..." : bulkMode ? "Create Short URLs" : "Create Short URL"}
        </button>

        {!loading && (
          <Tooltip title="Close">
            <button
              disabled={loading}
              onClick={() => setOpen(false)}
              className=" absolute right-2 top-2  "
              type="button"
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