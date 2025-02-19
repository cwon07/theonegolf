export default function Admin() {
    return (
      <div>
        <h1>Admin Login</h1>
        <form action="/api/admin-login" method="POST">
          <div>
            <label htmlFor="username">Username</label>
            <input type="text" id="username" name="username" required />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" required />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }





// 'use client'; 

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// export default function AdminLogin() {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');

//   const router = useRouter();

//   const handleLogin = (e: React.FormEvent) => {
//     e.preventDefault();

    
//     if (username === 'admin' && password === 'adminpassword') {
//       router.push('/admin-dashboard');
//     } else {
//       setError('Invalid username or password');
//     }
//   };

//   return (
//     <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
//       <h2>Admin Login</h2>
//       {/* <form onSubmit={handleLogin}>
//         <div>
//           <label htmlFor="username">Username</label>
//           <input
//             id="username"
//             name="username"
//             type="text"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             required
//             style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem' }}
//           /> */}
//         {/* </div> */}
//         {/* <div>
//           <label htmlFor="password">Password</label>
//           <input
//             id="password"
//             name="password"
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem' }}
//           />
//         </div>
//         {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
//         <button
//           type="submit"
//           style={{
//             padding: '0.5rem 1rem',
//             backgroundColor: '#4CAF50',
//             color: 'white',
//             border: 'none',
//             borderRadius: '4px',
//           }}
//         >
//           Login
//         </button>
//       </form> */}
//     </div>
//   );
// }