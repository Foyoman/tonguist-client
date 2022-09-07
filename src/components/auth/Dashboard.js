import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router';
import jwt from 'jsonwebtoken'; 

import '../../style.scss';
import { Card, Button, Divider, Box, Checkbox, getDialogContentTextUtilityClass } from '@mui/material';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

export default function Dashboard() {
	const navigate = useNavigate();

	const [currentUser, setCurrentUser] = useState('');
  const [name, setName] = useState('');
	const [todaysDay, setTodaysDay] = useState('');
	const [allDates, setAllDatse] = useState('');

	const SERVER_URL = `http://localhost:6969/`;
	
	async function populateDates() {
		const req = await fetch(SERVER_URL + 'user/dates', {
			headers: {
				'x-access-token': localStorage.getItem('token'),
			},
		})

		const today = new Date();
		const todaysDay = String(today).split(' ')[0];
		setTodaysDay(todaysDay);
		const formattedDate = today.toISOString().split('T')[0];
		
		const data = await req.json()
		if (data.status === 'ok') {
			
		}
	}

	useEffect(() => {
	  const token = localStorage.getItem('token')
		if (token) {
      const user = jwt.decode(token);
			setCurrentUser(user);
      if (user) { 
        setName(user.name) 
      }
		}	
	}, [localStorage.getItem('token')]);
	
	return (
		<div className='dashboard'>
			<Card>
				<Card><p>select language</p></Card>
				
				<Button>continue learning</Button>
			</Card>
			<Card>
				My progress
			</Card>
			<Card>
				<div>
					<FormControl component="fieldset">
						<p>Today's goal</p>
						<p>13 / 50 cards</p>
						<FormGroup aria-label="position" row>
							<FormControlLabel
								value="bottom"
								control={<Checkbox disabled checked={ false } size='large' />}
								label="Mon"
								labelPlacement="bottom"
								className='daily-checkbox'
							/>
							<FormControlLabel
								value="bottom"
								control={<Checkbox disabled checked={ false } size='large'  />}
								label="Tue"
								labelPlacement="bottom"
								className='daily-checkbox'
							/>
							<FormControlLabel
								value="bottom"
								control={<Checkbox disabled checked={ false } size='large'  />}
								label="Wed"
								labelPlacement="bottom"
								className='daily-checkbox'
							/>
							<FormControlLabel
								value="bottom"
								control={<Checkbox disabled checked={ false } size='large'  />}
								label="Thu"
								labelPlacement="bottom"
								className='daily-checkbox'
							/>
							<FormControlLabel
								value="bottom"
								control={<Checkbox disabled checked={ false } size='large'  />}
								label="Fri"
								labelPlacement="bottom"
								className='daily-checkbox'
							/>
							<FormControlLabel
								value="bottom"
								control={<Checkbox disabled checked={ false } size='large'  />}
								label="Sat"
								labelPlacement="bottom"
								className='daily-checkbox'
							/>
							<FormControlLabel
								value="bottom"
								control={<Checkbox disabled checked={ false } size='large'  />}
								label="Sun"
								labelPlacement="bottom"
								className='daily-checkbox'
							/>
						</FormGroup>
					</FormControl>
				</div>
			</Card>
			<Card>
				Today's goal
			</Card>
		</div>
	)
}
