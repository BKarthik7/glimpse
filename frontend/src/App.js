import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import { Alert } from './components/ui/alert';


const API_URL = process.env.REACT_APP_BACKEND_API_URL;

console.log('API_URL:', API_URL);

// Auth Context
const AuthContext = React.createContext(null);

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const Navbar = () => {
  const { token, logout } = React.useContext(AuthContext);
  const location = useLocation();

  return (
    <nav className="bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg mb-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-extrabold text-white">
            <Link to="/submissions">Glimpse</Link>
          </h1>
          <div className="flex items-center space-x-4">
            {token ? (
              <>
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-red-600 text-white rounded-full shadow-lg transition-transform transform hover:scale-105"
                >
                  Logout
                </button>
                {location.pathname === '/submit' ? (
                  <Link to="/submissions" className="ml-4 px-4 py-2 bg-purple-700 text-white rounded-full shadow-lg transition-transform transform hover:scale-105">
                    Experiences
                  </Link>
                ) : (
                  <Link to="/submit" className="ml-4 px-4 py-2 bg-purple-700 text-white rounded-full shadow-lg transition-transform transform hover:scale-105">
                    Submit Experience
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 bg-blue-600 text-white rounded-full shadow-lg transition-transform transform hover:scale-105">
                  Login
                </Link>
                <Link to="/register" className="px-4 py-2 bg-green-600 text-white rounded-full shadow-lg transition-transform transform hover:scale-105">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setFormData({ name: '', email: '', password: '' });
      } else {
        setError(data.error || 'Failed to register');
      }
    } catch (err) {
      setError('An error occurred during registration');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg font-sans">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      {error && <Alert className="mb-4">{error}</Alert>}
      {success && (
        <Alert className="mb-4 bg-green-100">
          Registration successful! You can now <Link to="/login" className="font-bold text-blue-500">login</Link>.
        </Alert>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          placeholder="Name"
          className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg shadow-lg hover:bg-blue-700 transition-all">
          Register
        </button>
      </form>
    </div>
  );
};

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); 
  const { login } = React.useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      setLoading(false);
      if (response.ok) {
        login(data.token);
        navigate('/submissions');
      } else {
        setError(data.error);
      }
    } catch (err) {
      setLoading(false);
      setError('An error occurred during login');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg font-sans">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      {error && <Alert className="mb-4">{error}</Alert>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white p-3 rounded-lg shadow-lg hover:bg-blue-700 transition-all"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

const SubmissionForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    company: '',
    questions: ['']
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { token } = React.useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/submissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setSuccess(true);
        setFormData({ name: '', country: '', company: '', questions: [''] });
      } else {
        const data = await response.json();
        setError(data.error);
      }
    } catch (err) {
      setError('An error occurred while submitting');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg font-sans">
      <h2 className="text-2xl font-bold mb-4">Submit Interview Experience</h2>
      {error && <Alert className="mb-4">{error}</Alert>}
      {success && <Alert className="mb-4 bg-green-100">Experience submitted successfully!</Alert>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          placeholder="Name"
          className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Country"
          className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.country}
          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
        />
        <input
          type="text"
          placeholder="Company"
          className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
        />
        <textarea
          placeholder="Interview Questions"
          className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.questions.join('\n')}
          onChange={(e) => setFormData({ ...formData, questions: e.target.value.split('\n') })}
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg shadow-lg hover:bg-blue-700 transition-all">
          Submit Experience
        </button>
      </form>
    </div>
  );
};

// Submissions List Component
const SubmissionsList = () => {
  const [submissions, setSubmissions] = useState([]);
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');
  const { token } = React.useContext(AuthContext);

  useEffect(() => {
    fetchSubmissions();
  }, [page]);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch(`${API_URL}/submissions?page=${page}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      // Ensure that 'submissions' is an array
      if (Array.isArray(data.submissions)) {
        setSubmissions(data.submissions);
      } else {
        setError('Invalid submissions data');
      }
    } catch (err) {
      setError('Failed to fetch submissions');
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Interview Experiences</h2>
      {error && <Alert className="mb-4">{error}</Alert>}
      <div className="space-y-4">
        {submissions.map((submission) => (
          <div key={submission._id} className="p-4 border rounded shadow">
            <h3 className="text-xl font-bold">{submission.name}</h3>
            <p><strong>Country:</strong> {submission.country}</p>
            <p><strong>Company:</strong> {submission.company}</p>
            <ul className="mt-2 space-y-2">
              {submission.questions.map((question, index) => (
                <li key={index}>{question}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-between">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Previous
        </button>
        <button
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/submit" element={<SubmissionForm />} />
          <Route path="/submissions" element={<SubmissionsList />} />
          <Route path="/" element={<Navigate to="/submissions" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
