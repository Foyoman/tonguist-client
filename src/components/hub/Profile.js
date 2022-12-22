import React, { useState, useEffect } from 'react'
import jwt from 'jsonwebtoken';
import { useNavigate } from 'react-router';
import { Card, Button } from '@mui/material'

export default function Profile() {
	const navigate = useNavigate();
	const [user, setUser] = useState();

	useEffect(() => {
	  const token = localStorage.getItem('token')
		if (token) {
      const user = jwt.decode(token);
			setUser(user);
		}	
	}, []);
	
	const handleLogOut = () => {
    localStorage.removeItem('token');
    navigate('/');
  }

	
	return (
		<div className='profile'>
			<h2 style={{ margin: '0' }}><strong>Profile</strong></h2>
			<Card className='dash-card'>
				<h3 style={{ margin: '0' }}>
					<strong>{ user && user.name }</strong>
				</h3>
				<p style={{ fontSize: '20px' }}>
					<strong>Email:</strong> { user && user.email }
				</p>
			</Card>
			<Card className='dash-card profile-info'>
				<h4 style={{ marginTop: '0' }}>
					<strong>Thank you, </strong>{ user && user.name }
				</h4>
				<p>for being a part of this experience. I am a strong supporter of language learning and every other means of exposing yourself to different cultures, so it really means a lot to me that you took the time to make an account and test out my little web app. {"<3"}</p>
				<br />
				<p>Special thanks also goes out to everyone at General Assembly, Joel, Loden, and to all my classmates from SEI54 for being so cool. </p>
				<br />
				<p>Kind regards,</p>
				<p>Ed</p>
			</Card>
			<Button onClick={ handleLogOut } variant='contained' color='secondary'>Log Out</Button>
		</div>
	)
}
