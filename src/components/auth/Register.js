import React, { useState } from 'react'
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom'
import Alert from '@mui/material/Alert';

export default function Register() {
	const navigate = useNavigate();

	const SERVER_URL = `https://tonguist.herokuapp.com/user/register`;
	
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [alert, setAlert] = useState(false);

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
			setAlert(false);
			navigate('/login')		
		} else {
			setAlert(true);
			console.error('error')
		}
	}
	
	
	return (
		<div className="container">
			<div style={{ marginTop: '4rem' }} className="row">
				<div className="col s8 offset-s2 mobile-width-100">
					<Link to="/" className="btn-flat waves-effect">
						<i className="material-icons left">keyboard_backspace</i> Back to
						home
					</Link>
					<div className="col s12" style={{ paddingLeft: "11.250px" }}>
						<h4>
							<b>Register</b> below
						</h4>
						<p className="grey-text text-darken-1">
							Already have an account? <Link to="/login">Log in</Link>
						</p>
					</div>
					<span className='alert' id={ alert ? 'show' : '' }>
						<Alert severity="error">Email already taken, or server unavailable.</Alert>
					</span>
					<form onSubmit={ registerUser }>
						<div className="input-field col s12">
						<input 
							value={ name }
							onChange={(e) => setName(e.target.value)}
							type="text" 
						/>
							<label htmlFor="name">Name</label>
						</div>
						<div className="input-field col s12">
						<input 
							maxLength={ 16 }
							value={ email }
							onChange={(e) => setEmail(e.target.value)}
							type="email" 
						/>
							<label htmlFor="email">Email</label>
						</div>
						<div className="input-field col s12">
						<input 
							value={ password }
							onChange={(e) => setPassword(e.target.value)}
							type="password" 
						/>
							<label htmlFor="password">Password</label>
						</div>
						<div className="col s12" style={{ paddingLeft: "11.250px" }}>
							<button
								style={{
									width: "150px",
									borderRadius: "3px",
									letterSpacing: "1.5px",
									marginTop: "1rem"
								}}
								type="submit"
								className="btn btn-large waves-effect waves-light hoverable blue accent-3"
							>
								Sign up
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}
