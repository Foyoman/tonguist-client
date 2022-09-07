import React from 'react'
import { useNavigate } from 'react-router';
import { Card, Button } from '@mui/material'

export default function Profile() {
	const navigate = useNavigate();

	const handleLogOut = () => {
    localStorage.removeItem('token');
    navigate('/');
  }

	return (
		<div class='profile'>
			<div>
				<Card>Profile</Card>
			</div>
			<Button onClick={ handleLogOut } variant='contained' color='secondary' className='log-out'>Log Out</Button>
		</div>
	)
}
