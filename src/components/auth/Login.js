import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';

export default function Login() {
	const navigate = useNavigate();
	
	const SERVER_URL = `https://tonguist-server.herokuapp.com/user/login`;
	
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [alert, setAlert] = useState(false);
	const [readOnly, setReadOnly] = useState(false);
	const [loading, setLoading] = useState(false);

	async function loginUser(e) {
		e.preventDefault();
		setReadOnly(true);
		setLoading(true);

		const response = await fetch(SERVER_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				email,
				password,
			})
		}).catch(() => {
			setAlert(true);
			setReadOnly(false);
			setLoading(false);
		})

		const data = await response.json()

		if (data.user) {
			setAlert(false);
			localStorage.setItem('token', data.user);
			console.log('Login successful');
			navigate('/dashboard');
		} else {
			setAlert(true);
			setReadOnly(false);
			setLoading(false);
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
					<span className='alert' id={ alert ? 'show' : '' }>
						<Alert severity="error">Please check your email or password.</Alert>
					</span>
					<form onSubmit={ loginUser }>
						<div className='input-field col s12'>
							<input 
								readOnly={ readOnly }
								value={ email }
								onChange={(e) => setEmail(e.target.value)}
								type="email" 
							/>
							<label htmlFor='email'>Email</label>
						</div>
						<div className='input-field col s12'>
							<input 
								readOnly={ readOnly }
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
									marginTop: '1rem',
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
									backgroundColor: `${ loading ? '#121212' : '' }`
								}}
								type='submit'
								className='btn btn-large waves-effect waves-light hoverable'
							>
								{ loading ?
									<CircularProgress color="success" style={{ display: 'flex', boxSizing: 'border-box' }} />
								: 'Login' }
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}
