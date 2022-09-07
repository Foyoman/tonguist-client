import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router';
import jwt from 'jsonwebtoken'; 
import _ from 'lodash';

import '../../style.scss';
import { Card, Button, Checkbox } from '@mui/material';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import LinearProgress from '@mui/material/LinearProgress';
import IconButton from '@mui/material';

export default function Dashboard() {
	const navigate = useNavigate();

	const [today, setToday] = useState('')
	const [todaysProgress, setTodaysProgress] = useState(0);
	const [yesterdaysCount, setYesterdaysCount] = useState(false);
	const [yesterdaysDay, setYesterdaysDay] = useState('');
	const [ereyesterdaysCount, setEreyesterdaysCount] = useState(false);
	const [ereyesterdaysDay, setEreyesterdaysDay] = useState('');
	const [threeDaysAgosCount, setThreeDaysAgosCount] = useState(false);
	const [threeDaysAgosDay, setThreeDaysAgosDay] = useState('');
	const [fourDaysAgosCount, setFourDaysAgosCount] = useState(false);
	const [fourDaysAgosDay, setFourDaysAgosDay] = useState('');
	const [fiveDaysAgosCount, setFiveDaysAgosCount] = useState(false);
	const [fiveDaysAgosDay, setFiveDaysAgosDay] = useState('');
	const [sixDaysAgosCount, setSixDaysAgosCount] = useState(false);
	const [sixDaysAgosDay, setSixDaysAgosDay] = useState('');
	const [aWeekAgosCount, setAWeekAgosCount] = useState(false);
	const [aWeekAgosDay, setAWeekAgosDay] = useState('');

	const SERVER_URL = `http://localhost:6969/`;
	
	async function populateDates() {
		const req = await fetch(SERVER_URL + 'user/dates', {
			headers: {
				'x-access-token': localStorage.getItem('token'),
			},
		})

		const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

		const today = new Date();
		setToday(weekdays[today.getDay()]);
		const todaysDate = String(today).split(' ').slice(0, 4).join(' ');
		
		const data = await req.json()

		let todaysCardCount;
		
		if (data.status === 'ok') {
			todaysCardCount = (
				(_.filter(data.dates, (date) => {
					return date.date === todaysDate;
				}))[0]
			)
		} else {
			alert(data.error)
		}
		return [todaysCardCount, data.dates];
	}

	function getPreviousDays(n, date = new Date()) {
		const previous = new Date(date.getTime());
		previous.setDate(date.getDate() - n);

		return String(previous).split(' ').slice(0, 4).join(' ');
	}

	useEffect(() => {
		if (!localStorage.getItem('token')) {
			navigate('/login')
			return;
		}
		
	  const token = localStorage.getItem('token')
		if (token) {
      const user = jwt.decode(token);
      if (!user) { 
        navigate('/login')
				return;
      }
		}	

		populateDates().then((dates) => {
			const [todaysCount, allDates] = dates;
			
			setTodaysProgress(todaysCount.cardCount);
			
			const yesterday = getPreviousDays(1);
			const yesterdaysDay = yesterday.split(' ')[0];
			setYesterdaysDay(yesterdaysDay);
			
			const yesterdaysCount = (
				_.filter(allDates, (date) => {
					return date.date === yesterday;
				})[0]
			)

			console.log(yesterdaysCount)

			if (yesterdaysCount.cardCount >= 50) {
				setYesterdaysCount(true);
			};

			const ereyesterday = getPreviousDays(2);
			const ereyesterdaysDay = ereyesterday.split(' ')[0];
			setEreyesterdaysDay(ereyesterdaysDay);
			
			const ereyesterdaysCount = (
				_.filter(allDates, (date) => {
					return date.date === ereyesterday;
				})[0]
			)

			if (ereyesterdaysCount && ereyesterdaysCount.cardCount >= 50) {
				setEreyesterdaysCount(true);
			};

			const threeDaysAgo = getPreviousDays(3);
			const threeDaysAgosDay = threeDaysAgo.split(' ')[0];
			setThreeDaysAgosDay(threeDaysAgosDay);
			
			const threeDaysAgosCount = (
				_.filter(allDates, (date) => {
					return date.date === threeDaysAgo;
				})[0]
			)

			if (threeDaysAgosCount && threeDaysAgosCount.cardCount >= 50) {
				setThreeDaysAgosCount(true);
			};

			const fourDaysAgo = getPreviousDays(4);
			const fourDaysAgosDay = fourDaysAgo.split(' ')[0];
			setFourDaysAgosDay(fourDaysAgosDay);

			const fourDaysAgosCount = (
				_.filter(allDates, (date) => {
					return date.date === fourDaysAgo;
				})[0]
			)

			if (fourDaysAgosCount && fourDaysAgosCount >= 50) {
				setFourDaysAgosCount(true);
			};

			const fiveDaysAgo = getPreviousDays(5);
			const fiveDaysAgosDay = fiveDaysAgo.split(' ')[0];
			setFiveDaysAgosDay(fiveDaysAgosDay);

			const fiveDaysAgosCount = (
				_.filter(allDates, (date) => {
					return date.date === fiveDaysAgo;
				})[0]
			)

			if (fiveDaysAgosCount && fiveDaysAgosCount >= 50) {
				setFiveDaysAgosCount(true);
			};

			const sixDaysAgo = getPreviousDays(6);
			const sixDaysAgosDay = sixDaysAgo.split(' ')[0];
			setSixDaysAgosDay(sixDaysAgosDay);

			const sixDaysAgosCount = (
				_.filter(allDates, (date) => {
					return date.date === sixDaysAgo;
				})[0]
			)

			if (sixDaysAgosCount && sixDaysAgosCount >= 50) {
				setSixDaysAgosCount(true);
			};

			const aWeekAgo = getPreviousDays(7);
			const aWeekAgosDay = aWeekAgo.split(' ')[0];
			setAWeekAgosDay(aWeekAgosDay);

			const aWeekAgosCount = (
				_.filter(allDates, (date) => {
					return date.date === aWeekAgo;
				})[0]
			)

			if (aWeekAgosCount && aWeekAgosCount >= 50) {
				setAWeekAgosCount(true);
			};

		});
	}, [localStorage.getItem('token')]);
	
	return (
		<div className='dashboard'>
			{/* <IconButton><IconFlagTR /></IconButton> */}
			<Card className='dash-card'>
				<Card className='inner-card'>select language</Card>
				<Button id='continue-learning' href="/#/learn" color='secondary' variant='contained'>continue learning</Button>
			</Card>
			<Card className='dash-card'>
				<p className='card-header'>Today's progress</p>
				<p className='today'>{ today }</p>
				<span>
					{ todaysProgress > 50 ? todaysProgress - (Math.floor(todaysProgress / 50) * 50) : todaysProgress } / 50
					{ todaysProgress > 50 && 
						<span className='set-count-dash'> / { Math.floor(todaysProgress / 50)} set completed</span> 
					}
				</span>
				<LinearProgress className='progress' color='secondary' variant="determinate" value={ todaysProgress * 2 } />
			</Card>
			<Card className='dash-card'>
				<div>
					<p className='card-header'>Past week's progress</p>
					<FormControl component="fieldset">
						<FormGroup aria-label="position" row>
							<FormControlLabel
								value="bottom"
								control={<Checkbox className={ aWeekAgosCount && 'checked' } disabled checked={ aWeekAgosCount } size='large'  />}
								label={ aWeekAgosDay }
								labelPlacement="bottom"
								className='daily-checkbox'
							/>
							<FormControlLabel
								value="bottom"
								control={<Checkbox className={ sixDaysAgosCount && 'checked' } disabled checked={ sixDaysAgosCount } size='large' />}
								label={ sixDaysAgosDay }
								labelPlacement="bottom"
								className='daily-checkbox'
							/>
							<FormControlLabel
								value="bottom"
								control={<Checkbox className={ fiveDaysAgosCount && 'checked' } disabled checked={ fiveDaysAgosCount } size='large'  />}
								label={ fiveDaysAgosDay }
								labelPlacement="bottom"
								className='daily-checkbox'
							/>
							<FormControlLabel
								value="bottom"
								control={<Checkbox className={ fourDaysAgosCount && 'checked' } disabled checked={ fourDaysAgosCount } size='large'  />}
								label={ fourDaysAgosDay }
								labelPlacement="bottom"
								className='daily-checkbox'
							/>
							<FormControlLabel
								value="bottom"
								control={<Checkbox className={ threeDaysAgosCount && 'checked' } disabled checked={ threeDaysAgosCount } size='large'  />}
								label={ threeDaysAgosDay }
								labelPlacement="bottom"
								className='daily-checkbox'
							/>
							<FormControlLabel
								value="bottom"
								control={<Checkbox className={ ereyesterdaysCount && 'checked' } disabled checked={ ereyesterdaysCount } size='large'  />}
								label={ ereyesterdaysDay }
								labelPlacement="bottom"
								className='daily-checkbox'
							/>
							<FormControlLabel
								value="bottom"
								control={<Checkbox className={ yesterdaysCount && 'checked' } disabled checked={ yesterdaysCount } size='large'  />}
								label={ yesterdaysDay }
								labelPlacement="bottom"
								className='daily-checkbox'
							/>
							{/* <FormControlLabel
								value="bottom"
								control={<Checkbox className={ todaysCount && 'checked' } disabled checked={ todaysCount } size='large'  />}
								label={ todaysDay }
								labelPlacement="bottom"
								className='daily-checkbox'
							/> */}
						</FormGroup>
					</FormControl>
				</div>
			</Card>
			<Card className='dash-card'>
				Today's goal
			</Card>
		</div>
	)
}
