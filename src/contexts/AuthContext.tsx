import { createContext, useContext, useEffect, useState, FC, ReactNode } from 'react';
import { 
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '@/lib/firebase';

interface UserData {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  isPremium: boolean;
  createdAt: Date;
  lastLogin: Date;
  streak: number;
  totalQuizzes: number;
  correctAnswers: number;
  totalAnswers: number;
}

interface AuthContextType {
  currentUser: User | null;
  userData: UserData | null;
  loading: boolean;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (displayName: string, photoURL?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Crea o aggiorna documento utente in Firestore
  const createUserDocument = async (user: User, additionalData?: any) => {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // Crea nuovo documento
      const newUserData: UserData = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName,
        photoURL: user.photoURL,
        isPremium: false,
        createdAt: new Date(),
        lastLogin: new Date(),
        streak: 0,
        totalQuizzes: 0,
        correctAnswers: 0,
        totalAnswers: 0,
        ...additionalData
      };
      await setDoc(userRef, newUserData);
      setUserData(newUserData);
    } else {
      // Aggiorna lastLogin
      const existingData = userSnap.data() as UserData;
      await setDoc(userRef, { 
        ...existingData,
        lastLogin: new Date() 
      }, { merge: true });
      setUserData(existingData);
    }
  };

  // Signup con email/password
  const signup = async (email: string, password: string, displayName: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName });
    await createUserDocument(result.user, { displayName });
  };

  // Login con email/password
  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  // Login con Google
  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    await createUserDocument(result.user);
  };

  // Logout
  const logout = async () => {
    await signOut(auth);
    setUserData(null);
  };

  // Reset password
  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  // Update profile
  const updateUserProfile = async (displayName: string, photoURL?: string) => {
    if (!currentUser) return;
    
    await updateProfile(currentUser, { 
      displayName, 
      ...(photoURL && { photoURL }) 
    });

    const userRef = doc(db, 'users', currentUser.uid);
    await setDoc(userRef, { 
      displayName,
      ...(photoURL && { photoURL })
    }, { merge: true });
  };

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        await createUserDocument(user);
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    userData,
    loading,
    signup,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

