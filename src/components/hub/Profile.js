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
	}, [localStorage.getItem('token')]);
	
	const handleLogOut = () => {
    localStorage.removeItem('token');
    navigate('/');
  }

	
	return (
		<div className='profile'>
			<h2><strong>Profile</strong></h2>
			<Card className='dash-card'>
				<h3 style={{ margin: '0' }}>
					<strong>{ user && user.name }</strong>
				</h3>
				<p style={{ fontSize: '20px' }}>
					<strong>Email:</strong> { user && user.email }
				</p>
			</Card>
			<Card className='dash-card profile-info'>
				<p>
					<strong>Email:</strong> { user && user.email }
				</p>
			</Card>
			<Button style={{ fontSize: '16px' }} onClick={ handleLogOut } variant='contained' color='secondary' className='log-out'>Log Out</Button>
		</div>
	)
}
