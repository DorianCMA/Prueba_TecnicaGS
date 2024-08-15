import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import axios from 'axios';

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            console.error("Passwords do not match");
            return;
        }
        try {
            const response = await axios.post('http://localhost:5000/users', { email, password });
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
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
                    <div className="mb-4">
                        <label className="block text-gray-700">Password</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" 
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700">Confirm Password</label>
                        <input 
                            type="password" 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" 
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
                    >
                        Register
                    </button>
                    <div className="text-center mt-2">
                        <span className="text-gray-700">No tienes una cuenta?</span>
                        <Link 
                            to="/login" 
                            className="ml-2 text-blue-500 hover:underline"
                        >
                            Logeate aquí
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register;
