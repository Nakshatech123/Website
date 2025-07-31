// // app/login/page.js

// 'use client'

// import { useState, useContext } from 'react'
// import Link from 'next/link'
// import { AuthContext } from '../AuthProvider'
// import styles from './auth.module.css'

// const API = process.env.NEXT_PUBLIC_API_URL

// export default function LoginPage() {
//   const { login } = useContext(AuthContext)

//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [secret, setSecret] = useState('')
//   const [error, setError] = useState('') // ✅ ADD THIS LINE

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setError('') // Reset error on new submission

//     try {
//       const res = await fetch(`${API}/auth/login`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password, secret }),
//       })
//       const data = await res.json()

//       if (!res.ok) {
//         throw new Error(data.detail || 'Login failed')
//       }

//       // login() from AuthProvider will set the cookie and redirect
//       login(data.access_token)
      
//     } catch (err) {
//       // Set state to display the error message in your form
//       setError(err.message)
//     }
//   }

//   return (
//     <div className={styles.wrapper}>
//       <form onSubmit={handleSubmit} className={styles.form}>
//         <h2>Login</h2>
//         {/* This line requires the 'error' state to exist */}
//         {error && <p className={styles.error}>{error}</p>}

//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         <input
//           type="text"
//           placeholder="Shared Secret"
//           value={secret}
//           onChange={(e) => setSecret(e.target.value)}
//           required
//         />
//         <button type="submit">Login</button>
//         <p className={styles.toggle}>
//           New here? <Link href="/register">Register</Link>
//         </p>
//       </form>
//     </div>
//   )
// }

// app/login/page.js

// 'use client'

// import { useState, useContext } from 'react'
// import Link from 'next/link'
// import { AuthContext } from '../AuthProvider'
// import styles from './auth.module.css'

// const API = process.env.NEXT_PUBLIC_API_URL

// export default function LoginPage() {
//   const { login } = useContext(AuthContext)
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [secret, setSecret] = useState('')
//   const [error, setError] = useState('')

//   const handleSubmit = async (e) => {
//     e.preventDefault() // Prevents the form from reloading the page
//     setError('')

//     try {
//       const res = await fetch(`${API}/auth/login`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password, secret }),
//       })
//       const data = await res.json()

//       if (!res.ok) {
//         throw new Error(data.detail || 'Login failed. Please check your credentials.')
//       }

//       // This function (from AuthProvider) saves the token and redirects
//       login(data.access_token)
//     } catch (err) {
//       setError(err.message)
//     }
//   }

//   return (
//     <div className={styles.wrapper}>
//       <form onSubmit={handleSubmit} className={styles.form}>
//         <h2>Login</h2>
//         {error && <p className={styles.error}>{error}</p>}
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         <input
//           type="text"
//           placeholder="Shared Secret"
//           value={secret}
//           onChange={(e) => setSecret(e.target.value)}
//           required
//         />
//         <button type="submit">Login</button>
//         <p className={styles.toggle}>
//           New here? <Link href="/register">Register</Link>
//         </p>
//       </form>
//     </div>
//   )
// }


'use client'

import { useState, useContext } from 'react'
import Link from 'next/link'
import { AuthContext } from '../AuthProvider'
import styles from './auth.module.css'

const API = process.env.NEXT_PUBLIC_API_URL

export default function LoginPage() {
  const { login } = useContext(AuthContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [secret, setSecret] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, secret }),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.detail || 'Login failed. Please check your credentials.')
      }

      // ✅ The user's email is now passed to the login function.
      login(data.access_token, email)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className={styles.wrapper}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>Login</h2>
        {error && <p className={styles.error}>{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Shared Secret"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        <p className={styles.toggle}>
          New here? <Link href="/register">Register</Link>
        </p>
      </form>
    </div>
  )
}
