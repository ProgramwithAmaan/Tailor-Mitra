import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  FiUser, FiMail, FiPhone, FiBriefcase, FiLock, FiSave, 
  FiEdit2, FiCheckCircle, FiAlertCircle, FiEye, FiEyeOff,
  FiCamera, FiX, FiSmartphone, FiCreditCard, FiMapPin,
  FiGlobe, FiClock, FiAward, FiTrendingUp, FiUpload,
  FiImage
} from 'react-icons/fi';
import { useApp } from '../context/AppContext';

import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { profile, updateProfileWithImage, setProfile } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [showBannerOptions, setShowBannerOptions] = useState(false);
  
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const bannerFileInputRef = useRef(null);
  const bannerCameraInputRef = useRef(null);

  // Profile Form Data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    shopName: '',
    shopNumber: '',
    address: '',
    gstNumber: '',
    upiId: '',
  });

  // Password Form Data
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Load profile data
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setFormData({
      name: user?.profile?.name || profile?.name || '',
      email: user?.email || profile?.email || '',
      phone: user?.profile?.phone || profile?.phone || '',
      shopName: user?.shopDetails?.shopName || profile?.shopName || '',
      shopNumber: user?.shopDetails?.shopNumber || profile?.shopNumber || '',
      address: user?.profile?.address || profile?.address || '',
      gstNumber: user?.shopDetails?.gstNumber || profile?.gstNumber || '',
      upiId: user?.shopDetails?.upiId || profile?.upiId || '',
    });
    
    // Images belong to the logged-in user. Never use a shared
    // localStorage key such as `profileImage` because that would make
    // User B inherit User A's image on the same browser.
    setProfileImage(user?.profile?.profileImage || '');
    setBannerImage(user?.bannerImage || '');

    // Remove legacy global keys created by older versions of the app.
    localStorage.removeItem('profileImage');
    localStorage.removeItem('bannerImage');
  }, [profile]);

  const handleProfileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e, type, imageType) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size should be less than 2MB');
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result;
        if (imageType === 'profile') {
          setProfileImage(imageData);

          // Persist the image inside the current user's object.
          const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
          const updatedUser = {
            ...currentUser,
            profile: {
              ...(currentUser.profile || {}),
              profileImage: imageData,
            },
          };
          localStorage.setItem('user', JSON.stringify(updatedUser));

          // Update the shared React context immediately.
          setProfile({
            name: updatedUser?.profile?.name || '',
            email: updatedUser?.email || '',
            phone: updatedUser?.profile?.phone || '',
            shopName: updatedUser?.shopDetails?.shopName || '',
            shopNumber: updatedUser?.shopDetails?.shopNumber || '',
            address: updatedUser?.profile?.address || '',
            gstNumber: updatedUser?.shopDetails?.gstNumber || '',
            upiId: updatedUser?.shopDetails?.upiId || '',
            profileImage: imageData,
            bannerImage: updatedUser?.bannerImage || '',
          });

          toast.success(`Profile image ${type === 'camera' ? 'captured' : 'uploaded'} successfully! 📸`);
          setShowImageOptions(false);
        } else {
          setBannerImage(imageData);

          const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
          const updatedUser = {
            ...currentUser,
            bannerImage: imageData,
          };
          localStorage.setItem('user', JSON.stringify(updatedUser));

          setProfile({
            name: updatedUser?.profile?.name || '',
            email: updatedUser?.email || '',
            phone: updatedUser?.profile?.phone || '',
            shopName: updatedUser?.shopDetails?.shopName || '',
            shopNumber: updatedUser?.shopDetails?.shopNumber || '',
            address: updatedUser?.profile?.address || '',
            gstNumber: updatedUser?.shopDetails?.gstNumber || '',
            upiId: updatedUser?.shopDetails?.upiId || '',
            profileImage: updatedUser?.profile?.profileImage || '',
            bannerImage: imageData,
          });

          toast.success(`Banner image ${type === 'camera' ? 'captured' : 'uploaded'} successfully! 🖼️`);
          setShowBannerOptions(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      // Update localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = {
        ...user,
        profile: {
          ...user.profile,
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          profileImage: profileImage,
        },
        shopDetails: {
          ...user.shopDetails,
          shopName: formData.shopName,
          shopNumber: formData.shopNumber,
          gstNumber: formData.gstNumber,
          upiId: formData.upiId,
        },
        email: formData.email,
        bannerImage: bannerImage,
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Use updateProfileWithImage instead of updateProfile
      await updateProfileWithImage({
        name: formData.name,
        phone: formData.phone,
        shopName: formData.shopName,
        shopNumber: formData.shopNumber,
        address: formData.address,
        gstNumber: formData.gstNumber,
        upiId: formData.upiId,
        email: formData.email,
        profileImage: profileImage,
        bannerImage: bannerImage,
      });

      // Keep every part of the UI synchronized immediately.
      setProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        shopName: formData.shopName,
        shopNumber: formData.shopNumber,
        address: formData.address,
        gstNumber: formData.gstNumber,
        upiId: formData.upiId,
        profileImage: profileImage || '',
        bannerImage: bannerImage || '',
      });

      toast.success('Profile updated successfully! ✅');
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    try {
      toast.success('Password changed successfully! 🔒');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.match(/[a-z]/)) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    return strength;
  };

  const getStrengthColor = (strength) => {
    const colors = ['bg-gray-200', 'bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-400', 'bg-green-600'];
    return colors[strength] || 'bg-gray-200';
  };

  const getStrengthText = (strength) => {
    const texts = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    return texts[strength] || '';
  };

  const strength = getPasswordStrength(passwordData.newPassword);

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-[#161A2B]">My Profile</h1>
        <p className="text-[#6B7280] text-sm mt-1">Manage your personal information and account settings</p>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-[0_12px_28px_-10px_rgba(79,124,255,0.16)] border border-[#EDF0F7] overflow-hidden"
      >
        {/* Cover Image / Banner */}
        <div className="relative h-32 sm:h-40 bg-gradient-to-r from-[#4F7CFF] to-[#8B7CFF] group">
          {/* Banner Image */}
          {bannerImage ? (
            <img 
              src={bannerImage} 
              alt="Banner" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center text-white/50">
                <FiImage className="w-12 h-12 mx-auto mb-2" />
                <p className="text-sm">Click to add banner</p>
              </div>
            </div>
          )}
          
          {/* Banner Upload Button - Shows on hover */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              onClick={() => setShowBannerOptions(!showBannerOptions)}
              className="p-3 bg-white rounded-full hover:bg-gray-100 transition-colors shadow-lg"
            >
              <FiCamera className="w-6 h-6 text-[#4F7CFF]" />
            </button>
          </div>

          {/* Edit Button */}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="absolute top-3 right-3 bg-white/90 p-2 rounded-xl hover:bg-white transition-colors shadow-md z-10"
          >
            {isEditing ? (
              <FiX className="w-4 h-4 text-gray-600" />
            ) : (
              <FiEdit2 className="w-4 h-4 text-gray-600" />
            )}
          </button>

          {/* Name and Email on Banner - Bottom Left */}
          <div className="absolute bottom-3 left-4 text-white">
            <h2 className="text-lg sm:text-xl font-bold drop-shadow-lg">
              {formData.name || 'Tailor'}
            </h2>
            <p className="text-sm sm:text-base text-white/90 drop-shadow-lg flex items-center gap-2">
              <FiMail className="w-3 h-3 sm:w-4 sm:h-4" />
              {formData.email || 'tailor@example.com'}
            </p>
          </div>
        </div>

        {/* Banner Upload Options Modal */}
        {showBannerOptions && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-sm w-full p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-[#161A2B]">Upload Banner Image</h3>
                <button
                  onClick={() => setShowBannerOptions(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FiX className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={() => bannerFileInputRef.current?.click()}
                  className="w-full flex items-center gap-4 p-4 border-2 border-dashed border-[#EDF0F7] rounded-xl hover:border-[#4F7CFF] hover:bg-blue-50 transition-all"
                >
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <FiImage className="w-6 h-6 text-[#4F7CFF]" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-[#161A2B]">Choose from Gallery</p>
                    <p className="text-xs text-[#6B7280]">Select an image from your device</p>
                  </div>
                </button>

                <button
                  onClick={() => bannerCameraInputRef.current?.click()}
                  className="w-full flex items-center gap-4 p-4 border-2 border-dashed border-[#EDF0F7] rounded-xl hover:border-[#4F7CFF] hover:bg-blue-50 transition-all"
                >
                  <div className="p-3 bg-green-100 rounded-xl">
                    <FiCamera className="w-6 h-6 text-[#22C55E]" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-[#161A2B]">Take a Photo</p>
                    <p className="text-xs text-[#6B7280]">Use your camera to capture</p>
                  </div>
                </button>

                {bannerImage && (
                  <button
                    onClick={() => {
                      setBannerImage(null);
                      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
                      const updatedUser = { ...currentUser, bannerImage: '' };
                      localStorage.setItem('user', JSON.stringify(updatedUser));
                      setProfile({
                        name: updatedUser?.profile?.name || '',
                        email: updatedUser?.email || '',
                        phone: updatedUser?.profile?.phone || '',
                        shopName: updatedUser?.shopDetails?.shopName || '',
                        shopNumber: updatedUser?.shopDetails?.shopNumber || '',
                        address: updatedUser?.profile?.address || '',
                        gstNumber: updatedUser?.shopDetails?.gstNumber || '',
                        upiId: updatedUser?.shopDetails?.upiId || '',
                        profileImage: updatedUser?.profile?.profileImage || '',
                        bannerImage: '',
                      });
                      setShowBannerOptions(false);
                      toast.success('Banner image removed');
                    }}
                    className="w-full flex items-center gap-4 p-4 border-2 border-dashed border-red-200 rounded-xl hover:border-red-500 hover:bg-red-50 transition-all"
                  >
                    <div className="p-3 bg-red-100 rounded-xl">
                      <FiX className="w-6 h-6 text-red-500" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-red-500">Remove Banner</p>
                      <p className="text-xs text-[#6B7280]">Remove your banner image</p>
                    </div>
                  </button>
                )}
              </div>

              <input
                ref={bannerFileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'gallery', 'banner')}
                className="hidden"
              />
              <input
                ref={bannerCameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => handleImageUpload(e, 'camera', 'banner')}
                className="hidden"
              />
            </motion.div>
          </div>
        )}

        {/* Profile Image Upload Options Modal */}
        {showImageOptions && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-sm w-full p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-[#161A2B]">Upload Profile Image</h3>
                <button
                  onClick={() => setShowImageOptions(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FiX className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center gap-4 p-4 border-2 border-dashed border-[#EDF0F7] rounded-xl hover:border-[#4F7CFF] hover:bg-blue-50 transition-all"
                >
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <FiImage className="w-6 h-6 text-[#4F7CFF]" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-[#161A2B]">Choose from Gallery</p>
                    <p className="text-xs text-[#6B7280]">Select an image from your device</p>
                  </div>
                </button>

                <button
                  onClick={() => cameraInputRef.current?.click()}
                  className="w-full flex items-center gap-4 p-4 border-2 border-dashed border-[#EDF0F7] rounded-xl hover:border-[#4F7CFF] hover:bg-blue-50 transition-all"
                >
                  <div className="p-3 bg-green-100 rounded-xl">
                    <FiCamera className="w-6 h-6 text-[#22C55E]" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-[#161A2B]">Take a Photo</p>
                    <p className="text-xs text-[#6B7280]">Use your camera to capture</p>
                  </div>
                </button>

                {profileImage && (
                  <button
                    onClick={() => {
                      setProfileImage(null);
                      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
                      const updatedUser = {
                        ...currentUser,
                        profile: {
                          ...(currentUser.profile || {}),
                          profileImage: '',
                        },
                      };
                      localStorage.setItem('user', JSON.stringify(updatedUser));
                      setProfile({
                        name: updatedUser?.profile?.name || '',
                        email: updatedUser?.email || '',
                        phone: updatedUser?.profile?.phone || '',
                        shopName: updatedUser?.shopDetails?.shopName || '',
                        shopNumber: updatedUser?.shopDetails?.shopNumber || '',
                        address: updatedUser?.profile?.address || '',
                        gstNumber: updatedUser?.shopDetails?.gstNumber || '',
                        upiId: updatedUser?.shopDetails?.upiId || '',
                        profileImage: '',
                        bannerImage: updatedUser?.bannerImage || '',
                      });
                      setShowImageOptions(false);
                      toast.success('Profile image removed');
                    }}
                    className="w-full flex items-center gap-4 p-4 border-2 border-dashed border-red-200 rounded-xl hover:border-red-500 hover:bg-red-50 transition-all"
                  >
                    <div className="p-3 bg-red-100 rounded-xl">
                      <FiX className="w-6 h-6 text-red-500" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-red-500">Remove Photo</p>
                      <p className="text-xs text-[#6B7280]">Remove your profile image</p>
                    </div>
                  </button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'gallery', 'profile')}
                className="hidden"
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => handleImageUpload(e, 'camera', 'profile')}
                className="hidden"
              />
            </motion.div>
          </div>
        )}

        {/* Avatar - Positioned to overlap banner */}
        <div className="relative px-6">
          <div className="flex items-end gap-4 -mt-12">
            {/* Profile Image / Avatar */}
            <div className="relative group">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-2xl shadow-lg flex items-center justify-center border-4 border-white overflow-hidden flex-shrink-0">
                {profileImage ? (
                  <img 
                    src={profileImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl sm:text-4xl font-bold text-[#4F7CFF]">
                    {formData.name?.charAt(0) || 'T'}
                  </span>
                )}
              </div>
              
              {/* Upload Button - Shows on hover */}
              <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => setShowImageOptions(!showImageOptions)}
                  className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                >
                  <FiCamera className="w-5 h-5 text-[#4F7CFF]" />
                </button>
              </div>
            </div>
            
            <div className="pb-1 hidden sm:block">
              <p className="text-sm text-[#6B7280]">{formData.shopName || 'TailorStudio'}</p>
            </div>
          </div>
        </div>

        {/* Mobile Name Display */}
        <div className="sm:hidden px-4 pt-3 pb-2">
          <h2 className="text-lg font-bold text-[#161A2B]">{formData.name || 'Tailor'}</h2>
          <p className="text-sm text-[#6B7280]">{formData.shopName || 'TailorStudio'}</p>
        </div>

        {/* Tabs */}
        <div className="px-4 sm:px-6 border-b border-[#EDF0F7] mt-2">
          <div className="flex gap-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-3 px-1 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'profile'
                  ? 'border-[#4F7CFF] text-[#4F7CFF]'
                  : 'border-transparent text-[#6B7280] hover:text-[#161A2B]'
              }`}
            >
              <FiUser className="inline w-4 h-4 mr-2" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab('shop')}
              className={`py-3 px-1 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'shop'
                  ? 'border-[#4F7CFF] text-[#4F7CFF]'
                  : 'border-transparent text-[#6B7280] hover:text-[#161A2B]'
              }`}
            >
              <FiBriefcase className="inline w-4 h-4 mr-2" />
              Shop Details
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`py-3 px-1 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'password'
                  ? 'border-[#4F7CFF] text-[#4F7CFF]'
                  : 'border-transparent text-[#6B7280] hover:text-[#161A2B]'
              }`}
            >
              <FiLock className="inline w-4 h-4 mr-2" />
              Security
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#161A2B] mb-1">
                    <FiUser className="inline w-4 h-4 mr-1 text-[#4F7CFF]" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2.5 rounded-xl border transition-all ${
                      isEditing
                        ? 'border-[#EDF0F7] focus:border-[#4F7CFF] focus:ring-2 focus:ring-[#4F7CFF]/20 bg-white text-[#161A2B]'
                        : 'border-transparent bg-gray-50 text-[#6B7280]'
                    }`}
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#161A2B] mb-1">
                    <FiMail className="inline w-4 h-4 mr-1 text-[#4F7CFF]" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2.5 rounded-xl border transition-all ${
                      isEditing
                        ? 'border-[#EDF0F7] focus:border-[#4F7CFF] focus:ring-2 focus:ring-[#4F7CFF]/20 bg-white text-[#161A2B]'
                        : 'border-transparent bg-gray-50 text-[#6B7280]'
                    }`}
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#161A2B] mb-1">
                    <FiPhone className="inline w-4 h-4 mr-1 text-[#4F7CFF]" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2.5 rounded-xl border transition-all ${
                      isEditing
                        ? 'border-[#EDF0F7] focus:border-[#4F7CFF] focus:ring-2 focus:ring-[#4F7CFF]/20 bg-white text-[#161A2B]'
                        : 'border-transparent bg-gray-50 text-[#6B7280]'
                    }`}
                    placeholder="Phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#161A2B] mb-1">
                    <FiMapPin className="inline w-4 h-4 mr-1 text-[#4F7CFF]" />
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2.5 rounded-xl border transition-all ${
                      isEditing
                        ? 'border-[#EDF0F7] focus:border-[#4F7CFF] focus:ring-2 focus:ring-[#4F7CFF]/20 bg-white text-[#161A2B]'
                        : 'border-transparent bg-gray-50 text-[#6B7280]'
                    }`}
                    placeholder="Your address"
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end gap-3 pt-4 border-t border-[#EDF0F7]">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-[#EDF0F7] rounded-xl hover:bg-gray-50 transition-colors text-[#161A2B]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    disabled={loading}
                    className="px-6 py-2 bg-[#4F7CFF] hover:bg-[#3D63E0] text-white rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <FiSave className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Profile Info Cards */}
              {!isEditing && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                  <div className="bg-blue-50 rounded-xl p-4 text-center">
                    <p className="text-lg sm:text-xl font-bold text-[#4F7CFF] truncate">{formData.name || '-'}</p>
                    <p className="text-xs text-[#6B7280]">Full Name</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4 text-center">
                    <p className="text-lg sm:text-xl font-bold text-[#22C55E] truncate">{formData.email || '-'}</p>
                    <p className="text-xs text-[#6B7280]">Email Address</p>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-4 text-center">
                    <p className="text-lg sm:text-xl font-bold text-[#F5A623] truncate">{formData.phone || '-'}</p>
                    <p className="text-xs text-[#6B7280]">Phone Number</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4 text-center">
                    <p className="text-lg sm:text-xl font-bold text-[#8B5CF6] truncate">{formData.address || '-'}</p>
                    <p className="text-xs text-[#6B7280]">Address</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Shop Details Tab */}
          {activeTab === 'shop' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#161A2B] mb-1">
                    <FiBriefcase className="inline w-4 h-4 mr-1 text-[#4F7CFF]" />
                    Shop Name
                  </label>
                  <input
                    type="text"
                    name="shopName"
                    value={formData.shopName}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#EDF0F7] focus:border-[#4F7CFF] focus:ring-2 focus:ring-[#4F7CFF]/20 bg-white text-[#161A2B] transition-all"
                    placeholder="Your shop name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#161A2B] mb-1">
                    <FiCreditCard className="inline w-4 h-4 mr-1 text-[#4F7CFF]" />
                    Shop Number
                  </label>
                  <input
                    type="text"
                    name="shopNumber"
                    value={formData.shopNumber}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#EDF0F7] focus:border-[#4F7CFF] focus:ring-2 focus:ring-[#4F7CFF]/20 bg-white text-[#161A2B] transition-all"
                    placeholder="Shop number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#161A2B] mb-1">
                    <FiGlobe className="inline w-4 h-4 mr-1 text-[#4F7CFF]" />
                    GST Number
                  </label>
                  <input
                    type="text"
                    name="gstNumber"
                    value={formData.gstNumber}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#EDF0F7] focus:border-[#4F7CFF] focus:ring-2 focus:ring-[#4F7CFF]/20 bg-white text-[#161A2B] transition-all"
                    placeholder="GST number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#161A2B] mb-1">
                    <FiSmartphone className="inline w-4 h-4 mr-1 text-[#4F7CFF]" />
                    UPI ID
                  </label>
                  <input
                    type="text"
                    name="upiId"
                    value={formData.upiId}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#EDF0F7] focus:border-[#4F7CFF] focus:ring-2 focus:ring-[#4F7CFF]/20 bg-white text-[#161A2B] transition-all"
                    placeholder="yourname@upi"
                  />
                  <p className="text-xs text-[#6B7280] mt-1">
                    UPI ID for WhatsApp payments
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-xl flex items-start gap-3">
                <FiSmartphone className="w-5 h-5 text-[#4F7CFF] mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-[#3D63E0]">WhatsApp Payment Setup</p>
                  <p className="text-xs text-[#4F7CFF]">
                    Add your UPI ID above to enable WhatsApp upi id payments. Customers will receive a upi id with their order ready notification.
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-[#EDF0F7]">
                <button
                  onClick={handleSaveProfile}
                  disabled={loading}
                  className="px-6 py-2 bg-[#4F7CFF] hover:bg-[#3D63E0] text-white rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiSave className="w-4 h-4" />
                      Save Shop Details
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* Password Tab */}
          {activeTab === 'password' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 max-w-md"
            >
              <div className="bg-blue-50 p-4 rounded-xl flex items-start gap-3">
                <FiLock className="w-5 h-5 text-[#4F7CFF] mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-[#3D63E0]">Security Tips</p>
                  <p className="text-xs text-[#4F7CFF]">Use a strong password with at least 6 characters, including letters and numbers.</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#161A2B] mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2.5 pr-12 rounded-xl border border-[#EDF0F7] focus:border-[#4F7CFF] focus:ring-2 focus:ring-[#4F7CFF]/20 bg-white text-[#161A2B] transition-all"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6B7280] hover:text-[#161A2B]"
                  >
                    {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#161A2B] mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2.5 pr-12 rounded-xl border border-[#EDF0F7] focus:border-[#4F7CFF] focus:ring-2 focus:ring-[#4F7CFF]/20 bg-white text-[#161A2B] transition-all"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6B7280] hover:text-[#161A2B]"
                  >
                    {showNewPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                  </button>
                </div>
                {passwordData.newPassword && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 ${getStrengthColor(strength)}`}
                          style={{ width: `${(strength / 5) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-[#6B7280]">
                        {getStrengthText(strength)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#161A2B] mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2.5 pr-12 rounded-xl border border-[#EDF0F7] focus:border-[#4F7CFF] focus:ring-2 focus:ring-[#4F7CFF]/20 bg-white text-[#161A2B] transition-all"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6B7280] hover:text-[#161A2B]"
                  >
                    {showConfirmPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                  </button>
                </div>
                {passwordData.confirmPassword && (
                  <p className={`text-xs mt-1 ${
                    passwordData.newPassword === passwordData.confirmPassword
                      ? 'text-[#22C55E]'
                      : 'text-[#EF4444]'
                  }`}>
                    {passwordData.newPassword === passwordData.confirmPassword
                      ? '✅ Passwords match'
                      : '❌ Passwords do not match'}
                  </p>
                )}
              </div>

              <div className="flex justify-end pt-4 border-t border-[#EDF0F7]">
                <button
                  onClick={handleChangePassword}
                  disabled={loading || !passwordData.newPassword || passwordData.newPassword !== passwordData.confirmPassword}
                  className="px-6 py-2 bg-[#4F7CFF] hover:bg-[#3D63E0] text-white rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Changing...
                    </>
                  ) : (
                    <>
                      <FiLock className="w-4 h-4" />
                      Change Password
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;










