import React, { useState } from 'react'
import { useNavigate } from 'react-router';
import '../style.scss'

export default function Login() {
	const navigate = useNavigate();
	
	const SERVER_URL = `http://localhost:6969/login`;
	
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	async function loginUser(e) {
		e.preventDefault();

		const response = await fetch(SERVER_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				email,
				password,
			})
		})

		const data = await response.json()

		if (data.user) {
			localStorage.setItem('token', data.user)
			alert('Login successful')
			navigate('/dashboard')
		} else {
			alert('Please check your username and password')
		}
	}
	
	
	return (
		<div>
			<h2>Login</h2>
			<form onSubmit={ loginUser }>
				<input 
					value={ email }
					onChange={(e) => setEmail(e.target.value)}
					type="email" 
					placeholder="Email"
				/>
				<input 
					value={ password }
					onChange={(e) => setPassword(e.target.value)}
					type="password" 
					placeholder="Password"
				/>
				<input type="submit" value="Login" />
			</form>
		</div>
	)
}
