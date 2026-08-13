import React, { useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import { RxCross2 } from 'react-icons/rx';
import { FaDownload, FaQrcode } from 'react-icons/fa';
import toast from 'react-hot-toast';
import api from '../../api/api';

const QrCodeModal = ({ shortUrl, open, setOpen }) => {
    const [imageUrl, setImageUrl] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!open || !shortUrl) return;

        let objectUrl = null;
        // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch-on-open is the point of this effect
        setLoading(true);
        api
            .get(`/api/urls/qrcode/${shortUrl}`, { responseType: 'blob' })
            .then(({ data }) => {
                objectUrl = URL.createObjectURL(data);
                setImageUrl(objectUrl);
            })
            .catch((error) => {
                toast.error(error.friendlyMessage || 'Failed to generate QR code');
                setOpen(false);
            })
            .finally(() => setLoading(false));

        return () => {
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [open, shortUrl, setOpen]);

    const handleClose = () => {
        setImageUrl(null);
        setOpen(false);
    };

    const handleDownload = () => {
        if (!imageUrl) return;
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `shortly-${shortUrl}.png`;
        link.click();
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <div className="flex justify-center items-center h-full w-full px-4">
                <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-xs w-full text-center relative">
                    <button onClick={handleClose} className="absolute right-3 top-3 text-slate-500 hover:text-slate-800">
                        <RxCross2 className="text-2xl" />
                    </button>

                    <div className="flex items-center justify-center gap-2 mb-4">
                        <FaQrcode className="text-purple-600 text-xl" />
                        <h2 className="font-bold text-lg text-slate-800">Scan to Open</h2>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4 flex items-center justify-center min-h-[220px]">
                        {loading || !imageUrl ? (
                            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-600" />
                        ) : (
                            <img src={imageUrl} alt={`QR code for ${shortUrl}`} className="w-48 h-48 rounded-lg" />
                        )}
                    </div>

                    <p className="text-sm text-slate-500 mt-3 font-mono">/{shortUrl}</p>

                    <button
                        onClick={handleDownload}
                        disabled={!imageUrl}
                        className="w-full mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                    >
                        <FaDownload /> Download PNG
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default QrCodeModal;
