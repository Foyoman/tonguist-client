import React, { useState } from 'react'
import { useNavigate } from 'react-router';
import '../style.scss'

export default function Register() {
	const navigate = useNavigate();

	const SERVER_URL = `http://localhost:6969/user/register`;
	
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	async function registerUser(e) {
		e.preventDefault();

		const response = await fetch(SERVER_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				name,
				email,
				password,
			})
		})

		const data = await response.json()

		if (data.status === 'ok') {
			navigate('/login')		
		}
	}
	
	
	return (
		<div>
			<h2>Register</h2>
			<form onSubmit={ registerUser }>
				<input 
				  value={ name }
					onChange={(e) => setName(e.target.value)}
					type="text" 
					placeholder="Name" 
				/>
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
				<input type="submit" value="Register" />
			</form>
		</div>
	)
}
