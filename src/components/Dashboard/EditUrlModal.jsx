import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import { RxCross2 } from 'react-icons/rx';
import { FaTag, FaLock, FaSave, FaStar, FaToggleOn } from 'react-icons/fa';
import toast from 'react-hot-toast';
import api from '../../api/api';

const EditUrlModal = ({ item, open, setOpen, onSaved }) => {
    const [originalUrl, setOriginalUrl] = useState(item?.originalUrl || '');
    const [isActive, setIsActive] = useState(item?.isActive ?? true);
    const [isFavorite, setIsFavorite] = useState(item?.isFavorite ?? false);
    const [tags, setTags] = useState(item?.tags || []);
    const [tagInput, setTagInput] = useState('');
    const [changePassword, setChangePassword] = useState(false);
    const [password, setPassword] = useState('');
    const [saving, setSaving] = useState(false);

    if (!item) return null;

    const addTag = () => {
        const value = tagInput.trim();
        if (value && !tags.includes(value) && tags.length < 10) {
            setTags([...tags, value]);
        }
        setTagInput('');
    };

    const removeTag = (tag) => setTags(tags.filter((t) => t !== tag));

    const handleClose = () => setOpen(false);

    const handleSave = async (e) => {
        e.preventDefault();
        if (!originalUrl.trim()) {
            toast.error('Destination URL is required');
            return;
        }
        setSaving(true);
        try {
            const body = {
                originalUrl: originalUrl.trim(),
                isActive,
                isFavorite,
                tags,
                ...(changePassword && { password }),
            };
            await api.patch(`/api/urls/${item.id}`, body);
            toast.success('Link updated');
            setOpen(false);
            if (onSaved) onSaved();
        } catch (error) {
            toast.error(error.friendlyMessage || 'Failed to update link');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <div className="flex justify-center items-center h-full w-full px-4">
                <form
                    onSubmit={handleSave}
                    className="bg-white sm:w-[480px] w-full relative shadow-custom pt-8 pb-6 sm:px-8 px-4 rounded-lg max-h-[90vh] overflow-y-auto"
                >
                    <h1 className="font-montserrat text-center font-bold text-2xl text-slate-800">
                        Edit Link
                    </h1>
                    <p className="text-center text-xs text-slate-400 mt-1 font-mono">/{item.shortUrl}</p>

                    <hr className="mt-4 mb-5" />

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Destination URL</label>
                            <input
                                type="url"
                                value={originalUrl}
                                onChange={(e) => setOriginalUrl(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                            />
                        </div>

                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                            <div className="flex items-center gap-3">
                                <FaToggleOn className={isActive ? 'text-green-600 text-xl' : 'text-slate-400 text-xl'} />
                                <p className="font-medium text-slate-800 text-sm">Active</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                            <div className="flex items-center gap-3">
                                <FaStar className={isFavorite ? 'text-amber-500 text-xl' : 'text-slate-400 text-xl'} />
                                <p className="font-medium text-slate-800 text-sm">Favorite</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={isFavorite} onChange={(e) => setIsFavorite(e.target.checked)} className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                            </label>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                            <label className="flex items-center gap-2 text-sm font-medium text-slate-800 mb-2">
                                <FaTag className="text-teal-600" /> Tags
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
                                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(); } }}
                                onBlur={addTag}
                                placeholder="Add a tag..."
                                disabled={tags.length >= 10}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50"
                            />
                        </div>

                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <FaLock className="text-rose-600 text-xl" />
                                    <div>
                                        <p className="font-medium text-slate-800 text-sm">Password Protection</p>
                                        <p className="text-xs text-slate-500">
                                            Currently {item.passwordProtected ? 'enabled' : 'disabled'}
                                        </p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" checked={changePassword} onChange={(e) => setChangePassword(e.target.checked)} className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-rose-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
                                </label>
                            </div>
                            {changePassword && (
                                <div className="mt-3">
                                    <input
                                        type="text"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="New password (leave blank to remove protection)"
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                                    />
                                    <p className="text-xs text-slate-500 mt-1">Leave blank and save to remove password protection entirely.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full mt-6 flex items-center justify-center gap-2 bg-custom-gradient text-white font-semibold py-2.5 rounded-md transition-colors disabled:opacity-50"
                    >
                        <FaSave />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>

                    <button type="button" onClick={handleClose} disabled={saving} className="absolute right-2 top-2">
                        <RxCross2 className="text-slate-800 text-3xl" />
                    </button>
                </form>
            </div>
        </Modal>
    );
};

export default EditUrlModal;
