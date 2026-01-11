import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaUserCircle,
  FaEnvelope,
  FaShieldAlt,
  FaExclamationTriangle,
  FaTrash,
  FaClock,
  FaUndo,
  FaCheckCircle,
  FaLink,
  FaCog,
  FaSignOutAlt
} from 'react-icons/fa';
import { useStoreContext } from '../contextApi/ContextApi';
import api from '../api/api';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { token, userInfo, setUserInfo, clearUserInfo } = useStoreContext();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showImmediateDeleteModal, setShowImmediateDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile to get deletion status
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/api/auth/profile', {
          headers: { Authorization: 'Bearer ' + token },
        });
        setProfile(data);
        setUserInfo({ ...userInfo, ...data });
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  const handleScheduleDeletion = async () => {
    setIsDeleting(true);
    try {
      await api.post('/api/auth/account/schedule-deletion', {}, {
        headers: { Authorization: 'Bearer ' + token },
      });
      toast.success('Account scheduled for deletion. You have 5 days to cancel.');
      // Refresh profile
      const { data } = await api.get('/api/auth/profile', {
        headers: { Authorization: 'Bearer ' + token },
      });
      setProfile(data);
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Schedule deletion error:', error);
      toast.error(error.response?.data?.message || 'Failed to schedule deletion');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDeletion = async () => {
    setIsRecovering(true);
    try {
      await api.post('/api/auth/account/cancel-deletion', {}, {
        headers: { Authorization: 'Bearer ' + token },
      });
      toast.success('Account recovered successfully!');
      // Refresh profile
      const { data } = await api.get('/api/auth/profile', {
        headers: { Authorization: 'Bearer ' + token },
      });
      setProfile(data);
    } catch (error) {
      console.error('Cancel deletion error:', error);
      toast.error(error.response?.data?.message || 'Failed to recover account');
    } finally {
      setIsRecovering(false);
    }
  };

  const handleImmediateDelete = async () => {
    if (deleteConfirmText !== 'DELETE') {
      toast.error('Please type DELETE to confirm');
      return;
    }
    setIsDeleting(true);
    try {
      await api.delete('/api/auth/account', {
        headers: { Authorization: 'Bearer ' + token },
      });
      toast.success('Account deleted successfully');
      clearUserInfo();
      navigate('/');
    } catch (error) {
      console.error('Delete account error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete account');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLogout = () => {
    clearUserInfo();
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  // Calculate days remaining
  const getDaysRemaining = () => {
    if (!profile?.deletionDate) return 0;
    const deletionDate = new Date(profile.deletionDate);
    const now = new Date();
    const diffTime = deletionDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-140px)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-140px)] bg-gradient-to-br from-slate-50 via-white to-slate-100 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <FaCog className="text-rose-600" />
            Settings
          </h1>
          <p className="text-slate-600 mt-2">Manage your account settings and preferences</p>
        </div>

        {/* Account Deletion Warning Banner */}
        {profile?.isDeleted && (
          <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-xl shadow-lg p-6 mb-6 text-white">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <FaExclamationTriangle className="text-2xl" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">Account Scheduled for Deletion</h3>
                <p className="text-white/90 mb-4">
                  Your account will be permanently deleted in <span className="font-bold text-yellow-200">{getDaysRemaining()} days</span>.
                  All your URLs and data will be lost. You can still recover your account before the deadline.
                </p>
                <button
                  onClick={handleCancelDeletion}
                  disabled={isRecovering}
                  className="flex items-center gap-2 px-6 py-3 bg-white text-red-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg disabled:opacity-50"
                >
                  {isRecovering ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-red-600"></div>
                      Recovering...
                    </>
                  ) : (
                    <>
                      <FaUndo />
                      Recover My Account
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Profile */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Section */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-rose-500 to-purple-600 px-6 py-8">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/30">
                    <span className="text-white text-3xl font-bold">
                      {profile?.username?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="text-white">
                    <h2 className="text-2xl font-bold">{profile?.username || 'User'}</h2>
                    <p className="text-white/80">{profile?.email || 'No email'}</p>
                    <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-white/20 rounded-full text-sm">
                      <FaShieldAlt className="text-xs" />
                      {profile?.role?.replace('ROLE_', '') || 'User'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <h3 className="font-semibold text-slate-800 text-lg">Account Information</h3>

                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FaUserCircle className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-500">Username</p>
                    <p className="font-medium text-slate-800">{profile?.username || 'User'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <FaEnvelope className="text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-500">Email Address</p>
                    <p className="font-medium text-slate-800">{profile?.email || 'No email'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FaLink className="text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-500">Account Status</p>
                    <p className={`font-medium ${profile?.isDeleted ? 'text-red-600' : 'text-green-600'}`}>
                      {profile?.isDeleted ? 'Scheduled for deletion' : 'Active'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-red-100">
              <h2 className="text-xl font-semibold text-red-600 mb-4 flex items-center gap-2">
                <FaExclamationTriangle />
                Danger Zone
              </h2>

              <div className="space-y-4">
                {/* Schedule Deletion */}
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FaClock className="text-red-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-red-800">Schedule Account Deletion</h3>
                      <p className="text-sm text-red-700 mt-1 mb-3">
                        Your account will be deleted after a 5-day grace period. You can recover your account anytime before the deadline.
                      </p>
                      <button
                        onClick={() => setShowDeleteModal(true)}
                        disabled={profile?.isDeleted}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        <FaClock />
                        {profile?.isDeleted ? 'Already Scheduled' : 'Schedule Deletion'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Immediate Deletion */}
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FaTrash className="text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">Delete Immediately</h3>
                      <p className="text-sm text-gray-600 mt-1 mb-3">
                        Permanently delete your account right now. This action cannot be undone.
                      </p>
                      <button
                        onClick={() => setShowImmediateDeleteModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-colors"
                      >
                        <FaTrash />
                        Delete Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Quick Actions */}
          <div className="space-y-6">
            {/* Quick Actions Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-semibold text-slate-800 mb-4">Quick Actions</h3>

              <div className="space-y-3">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors text-left"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FaLink className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">My URLs</p>
                    <p className="text-xs text-slate-500">Manage your short links</p>
                  </div>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors text-left group"
                >
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                    <FaSignOutAlt className="text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium text-red-700">Logout</p>
                    <p className="text-xs text-red-500">Sign out of your account</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Account Stats */}
            <div className="bg-gradient-to-br from-rose-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
              <h3 className="font-semibold mb-4">Account Status</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-300" />
                  <span className="text-sm">Email verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-300" />
                  <span className="text-sm">Account active</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaShieldAlt className="text-yellow-300" />
                  <span className="text-sm">Standard plan</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Deletion Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl transform transition-all">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaClock className="text-orange-600 text-3xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Schedule Account Deletion</h3>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
              <p className="text-orange-800 text-sm">
                <span className="font-semibold">5-Day Grace Period:</span> Your account will remain accessible for 5 days.
                During this time, you can cancel the deletion and recover your account.
              </p>
            </div>

            <ul className="text-sm text-gray-600 list-disc list-inside space-y-1 mb-6">
              <li>Your URLs will remain active during the grace period</li>
              <li>You can still access and manage your account</li>
              <li>After 5 days, all data will be permanently deleted</li>
            </ul>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-3 text-gray-600 hover:text-gray-800 font-medium rounded-lg hover:bg-gray-100 transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleScheduleDeletion}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors disabled:bg-gray-300"
              >
                {isDeleting ? 'Scheduling...' : 'Schedule Deletion'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Immediate Delete Modal */}
      {showImmediateDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaTrash className="text-red-600 text-3xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Delete Account Immediately</h3>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-800 font-medium mb-2">⚠️ This action is irreversible!</p>
              <ul className="text-sm text-red-700 list-disc list-inside space-y-1">
                <li>All your shortened URLs will be deleted</li>
                <li>All analytics data will be lost</li>
                <li>Your account cannot be recovered</li>
              </ul>
            </div>

            <p className="text-gray-700 mb-3 text-sm">
              Type <span className="font-bold text-red-600 bg-red-50 px-2 py-1 rounded">DELETE</span> to confirm:
            </p>

            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="Type DELETE"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-red-500 mb-4 text-center font-mono text-lg"
            />

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowImmediateDeleteModal(false);
                  setDeleteConfirmText('');
                }}
                className="flex-1 px-4 py-3 text-gray-600 hover:text-gray-800 font-medium rounded-lg hover:bg-gray-100 transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleImmediateDelete}
                disabled={isDeleting || deleteConfirmText !== 'DELETE'}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isDeleting ? 'Deleting...' : 'Delete Forever'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;

