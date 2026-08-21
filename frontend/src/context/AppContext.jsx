import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const AppContext = createContext(null);

const safeParseUser = () => {
  try {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch (error) {
    console.error('Failed to read logged-in user:', error);
    return null;
  }
};

const profileFromUser = (user) => {
  if (!user) return {};

  return {
    name: user?.profile?.name || '',
    email: user?.email || '',
    phone: user?.profile?.phone || '',
    shopName: user?.shopDetails?.shopName || '',
    shopNumber: user?.shopDetails?.shopNumber || '',
    address: user?.profile?.address || '',
    gstNumber: user?.shopDetails?.gstNumber || '',
    upiId: user?.shopDetails?.upiId || '',
    profileImage: user?.profile?.profileImage || '',
    bannerImage: user?.bannerImage || '',
  };
};

const mergeProfileIntoUser = (user, nextProfile = {}) => {
  const currentUser = user || {};

  return {
    ...currentUser,
    email: nextProfile.email ?? currentUser.email ?? '',
    profile: {
      ...(currentUser.profile || {}),
      name: nextProfile.name ?? currentUser?.profile?.name ?? '',
      phone: nextProfile.phone ?? currentUser?.profile?.phone ?? '',
      address: nextProfile.address ?? currentUser?.profile?.address ?? '',
      profileImage:
        nextProfile.profileImage ?? currentUser?.profile?.profileImage ?? '',
    },
    shopDetails: {
      ...(currentUser.shopDetails || {}),
      shopName:
        nextProfile.shopName ?? currentUser?.shopDetails?.shopName ?? '',
      shopNumber:
        nextProfile.shopNumber ?? currentUser?.shopDetails?.shopNumber ?? '',
      gstNumber:
        nextProfile.gstNumber ?? currentUser?.shopDetails?.gstNumber ?? '',
      upiId: nextProfile.upiId ?? currentUser?.shopDetails?.upiId ?? '',
    },
    bannerImage: nextProfile.bannerImage ?? currentUser.bannerImage ?? '',
  };
};

export const AppProvider = ({ children }) => {
  const initialUser = safeParseUser();

  const [currentUser, setCurrentUser] = useState(initialUser);
  const [profile, setProfileState] = useState(profileFromUser(initialUser));

  const syncFromStorage = useCallback(() => {
    const user = safeParseUser();

    setCurrentUser(user);
    setProfileState(profileFromUser(user));

    // These keys were used by an older version and must never be shared
    // between different accounts on the same browser.
    localStorage.removeItem('profileImage');
    localStorage.removeItem('bannerImage');
  }, []);

  useEffect(() => {
    syncFromStorage();

    const handleUserChanged = () => {
      syncFromStorage();
    };

    const handleStorage = (event) => {
      if (event.key === 'user' || event.key === 'token' || event.key === 'userRole') {
        syncFromStorage();
      }
    };

    const handleFocus = () => {
      syncFromStorage();
    };

    window.addEventListener('userChanged', handleUserChanged);
    window.addEventListener('storage', handleStorage);
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('userChanged', handleUserChanged);
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('focus', handleFocus);
    };
  }, [syncFromStorage]);

  /*
   * IMPORTANT:
   * setProfile is kept compatible with your existing components.
   *
   * Previously it only changed React state, while localStorage.user still
   * contained another user's data. That created:
   *
   * Profile -> Farman
   * Dashboard/Navbar/Sidebar -> Akram
   *
   * Now setProfile updates BOTH the context and the logged-in user's object.
   */
  const setProfile = useCallback((nextProfile = {}) => {
    const storedUser = safeParseUser();

    // Never create a fake logged-in account when there is no authenticated user.
    if (!storedUser) {
      setProfileState(nextProfile || {});
      return;
    }

    const updatedUser = mergeProfileIntoUser(storedUser, nextProfile);

    localStorage.setItem('user', JSON.stringify(updatedUser));

    setCurrentUser(updatedUser);
    setProfileState(profileFromUser(updatedUser));

    window.dispatchEvent(new Event('userChanged'));
  }, []);

  /*
   * Used by Profile.jsx.
   *
   * The API call can be added here if your backend exposes a profile update
   * endpoint. Local state is updated immediately so the UI never waits for
   * Profile -> Save -> refresh before showing the current user.
   */
  const updateProfileWithImage = useCallback(async (profileData = {}) => {
    const storedUser = safeParseUser();

    if (!storedUser) {
      throw new Error('No authenticated user found.');
    }

    const updatedUser = mergeProfileIntoUser(storedUser, profileData);

    localStorage.setItem('user', JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);
    setProfileState(profileFromUser(updatedUser));

    window.dispatchEvent(new Event('userChanged'));

    return updatedUser;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');

    // Remove legacy global image keys too.
    localStorage.removeItem('profileImage');
    localStorage.removeItem('bannerImage');

    setCurrentUser(null);
    setProfileState({});

    window.dispatchEvent(new Event('userChanged'));
  }, []);

  const value = useMemo(
    () => ({
      profile,
      currentUser,
      user: currentUser,
      setProfile,
      updateProfileWithImage,
      logout,
      syncUser: syncFromStorage,
    }),
    [
      profile,
      currentUser,
      setProfile,
      updateProfileWithImage,
      logout,
      syncFromStorage,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useApp must be used inside an AppProvider');
  }

  return context;
};

export default AppContext;



