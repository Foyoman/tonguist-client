import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router';

export default function Login() {
	const navigate = useNavigate();
	
	const SERVER_URL = `http://localhost:6969/user/login`;
	
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
			// sessionStorage.setItem('token', data.user)
			localStorage.setItem('token', data.user)
			alert('Login successful')
			navigate('/learn')
		} else {
			alert('Please check your username and password')
		}
	}
	
	
	return (
		<div className='container'>
			<div style={{ marginTop: '4rem' }} className='row'>
				<div className="col s8 offset-s2 mobile-width-100">
					<Link to='/' className='btn-flat waves-effect'>
						<i className='material-icons left'>keyboard_backspace</i> Back home
					</Link>
					<div className='col s12' style={{ paddingLeft: '11.250px' }}>
						<h4>
							<b>Login</b> below
						</h4>
						<p className='grey-text text-darken-1'>
							Don't have an account? <Link to='/register'>Register</Link>
						</p>
					</div>
					<form onSubmit={ loginUser }>
						<div className='input-field col s12'>
							<input 
								value={ email }
								onChange={(e) => setEmail(e.target.value)}
								type="email" 
							/>
							<label htmlFor='email'>Email</label>
						</div>
						<div className='input-field col s12'>
							<input 
								value={ password }
								onChange={(e) => setPassword(e.target.value)}
								type="password" 
							/>
							<label htmlFor="password">Password</label>
						</div>
						<div className='col s12' style={{ paddingLeft: '11.250px' }}>
							<button
								style={{
									width: '150px',
									borderRadius: '3px',
									letterSpacing: '1.5px',
									marginTop: '1rem'
								}}
								type='submit'
								className='btn btn-large waves-effect waves-light hoverable'
							>
								Login
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}
