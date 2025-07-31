// // app/AuthProvider.js
// 'use client';
// import { createContext, useState, useEffect } from 'react';

// export const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const [token, setToken] = useState(null);
//   useEffect(() => {
//     const t = localStorage.getItem('access_token');
//     if (t) setToken(t);
//   }, []);
//   const login = (tok) => { localStorage.setItem('access_token', tok); setToken(tok); };
//   const logout = () => { localStorage.removeItem('access_token'); setToken(null); };

//   return (
//     <AuthContext.Provider value={{ token, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }


// app/AuthProvider.js
// 'use client'

// import { createContext, useState, useEffect } from 'react'

// export const AuthContext = createContext()

// export function AuthProvider({ children }) {
//   const [token, setToken] = useState(null)

//   useEffect(() => {
//     const t = localStorage.getItem('access_token')
//     if (t) setToken(t)
//   }, [])

//   const login = (tok) => {
//     localStorage.setItem('access_token', tok)
//     setToken(tok)
//   }
//   const logout = () => {
//     localStorage.removeItem('access_token')
//     setToken(null)
//   }

//   return (
//     <AuthContext.Provider value={{ token, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   )
// }


// app/AuthProvider.js
// 'use client'

// import { createContext, useState } from 'react'
// import { useRouter } from 'next/navigation'
// import Cookies from 'js-cookie'

// export const AuthContext = createContext()

// export default function AuthProvider({ children }) {
//   const router = useRouter()
//   const [user, setUser] = useState(null) // You can use this later to store user info

//   const login = (token) => {
//     Cookies.set('auth_token', token, {
//       expires: 7, // The cookie will last for 7 days
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'strict',
//     })
//     // You could decode the token here to set user details
//     // setUser({ email: '...' }); 
//     router.replace('/dashboard')
//   }

//   // The new logout function
//   const logout = () => {
//     Cookies.remove('auth_token') // Remove the cookie
//     setUser(null) // Clear any user state
//     router.replace('/login') // Redirect to the login page
//   }

//   return (
//     // Provide the logout function to the rest of your app
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   )
// }





// 'use client'

// import { createContext, useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import Cookies from 'js-cookie'

// export const AuthContext = createContext()

// export default function AuthProvider({ children }) {
//   const router = useRouter()
//   const [user, setUser] = useState(null)
//   const [loading, setLoading] = useState(true) // ✅ Add loading state

//   useEffect(() => {
//     // Check for the token when the app loads
//     const token = Cookies.get('auth_token');
//     if (token) {
//       // In a real app, you'd verify the token with your backend here
//       // For now, we'll assume the token means the user is logged in.
//       setUser({ isAuthenticated: true });
//     }
//     setLoading(false); // ✅ Set loading to false after checking
//   }, []);

//   const login = (token) => {
//     Cookies.set('auth_token', token, {
//       expires: 7,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'strict',
//     })
//     setUser({ isAuthenticated: true });
//     router.replace('/dashboard')
//   }

//   const logout = () => {
//     Cookies.remove('auth_token')
//     setUser(null)
//     router.replace('/login')
//   }

//   // Pass the loading state down through the context
//   const value = { user, loading, login, logout };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   )
// }


// 'use client'

// import { createContext, useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import Cookies from 'js-cookie'

// export const AuthContext = createContext()

// const API = process.env.NEXT_PUBLIC_API_URL;

// export default function AuthProvider({ children }) {
//   const router = useRouter()
//   const [user, setUser] = useState(null)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const validateToken = async () => {
//       const token = Cookies.get('auth_token');
//       if (token) {
//         try {
//           const res = await fetch(`${API}/auth/me`, {
//             headers: { 'Authorization': `Bearer ${token}` }
//           });

//           if (res.ok) {
//             const userData = await res.json();
//             setUser(userData);
//           } else {
//             Cookies.remove('auth_token');
//             setUser(null);
//           }
//         } catch (error) {
//           console.error("Token validation failed", error);
//           Cookies.remove('auth_token');
//           setUser(null);
//         }
//       }
//       setLoading(false);
//     };

//     validateToken();
//   }, []);

//   // ✅ The login function now accepts the email and sets it in the user state.
//   const login = (token, email) => {
//     Cookies.set('auth_token', token, {
//       expires: 7,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'strict',
//     })
//     setUser({ email: email }); // Set the user's email immediately
//     router.replace('/dashboard')
//   }

//   const logout = () => {
//     Cookies.remove('auth_token')
//     setUser(null)
//     router.replace('/login')
//   }

//   const value = { user, loading, login, logout };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

'use client'

import { createContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

export const AuthContext = createContext()

const API = process.env.NEXT_PUBLIC_API_URL;

export default function AuthProvider({ children }) {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const validateToken = async () => {
      const token = Cookies.get('auth_token');
      if (token) {
        try {
          const res = await fetch(`${API}/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (res.ok) {
            const userData = await res.json();
            setUser(userData);
            // Also sync local storage on initial load
            localStorage.setItem('user.email', userData.email);
            localStorage.setItem('isLoggedIn', 'true');
          } else {
            // If token is invalid, log the user out completely
            logout();
          }
        } catch (error) {
          console.error("Token validation failed", error);
          logout();
        }
      }
      setLoading(false);
    };

    validateToken();
  }, []);

  const login = (token, email) => {
    Cookies.set('auth_token', token, {
      expires: 7,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    })
    
    // ✅ --- UPDATE LOCAL STORAGE ON LOGIN ---
    // This is the crucial fix. It saves the new email to the browser's memory.
    localStorage.setItem('user.email', email);
    localStorage.setItem('isLoggedIn', 'true');

    setUser({ email: email });
    router.replace('/dashboard')
  }

  const logout = () => {
    // Remove the authentication token from cookies
    Cookies.remove('auth_token');
    
    // Clear user data from Local Storage
    localStorage.removeItem('user.email');
    localStorage.removeItem('isLoggedIn');

    // Clear the user state in the application
    setUser(null);
    
    // Redirect to the login page
    router.replace('/login');
  }

  const value = { user, loading, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
