import React, { useState } from 'react';
import { Link, useNavigate  } from 'react-router-dom';
import axios from 'axios';

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get('http://localhost:5000/users', {
                params: { email, password }
            });
            if (response.data.length > 0) {
                const token = 'dummyToken'; 
                localStorage.setItem('authToken', token);
                console.log('Token almacenado:', localStorage.getItem('authToken')); 
                navigate('/home');
            } else {
                alert('Credenciales incorrectas');
            }
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" 
                        />
                    </div>
                    <div className="mb-6 relative">
                        <label className="block text-gray-700">Password</label>
                        <input 
                            type={showPassword ? 'text' : 'password'} 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" 
                        />
                        <button 
                            type="button" 
                            onClick={() => setShowPassword(!showPassword)} 
                            className="absolute inset-y-0 right-0 flex items-center px-3 mt-4"
                        >
                            <span className="text-blue-500 cursor-pointer ">
                                {showPassword ? 'Ocultar' : 'Mostrar'} 
                            </span>
                        </button>
                    </div>
                    <button 
                        type="submit" 
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 mb-4"
                    >
                        Login
                    </button>
                    <div className="text-center">
                        <span className="text-gray-700">No tienes una cuenta?</span>
                        <Link 
                            to="/register" 
                            className="ml-2 text-blue-500 hover:underline"
                        >
                            Regístrate aquí
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
