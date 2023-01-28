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


import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';

export default function Dashboard() {
	const navigate = useNavigate();

	const [name, setName] = useState('');
	const [today, setToday] = useState('');
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

	const [language, setLanguage] = useState('');

	const [open, setOpen] = React.useState(false);
	const [selectedIndex, setSelectedIndex] = React.useState('');

	const anchorRef = React.useRef(null);

	const SERVER_URL = `https://tonguist-server.herokuapp.com/`;

	async function populateDates(language) {
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
		const dates = (
			_.filter(data.dates, (date) => {
				return date.language === language;
			})
		)

		let todaysCardCount;

		if (data.status === 'ok') {
			todaysCardCount = (
				(_.filter(dates, (date) => {
					return date.date === todaysDate && date.language === language;
				}))[0]
			)
		} else {
			alert(data.error)
		}
		return [todaysCardCount, dates];
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
			if (user) {
				setName(user.name);
			}
			if (!user) {
				navigate('/login');
				return;
			}
		}

		async function getLanguage() {
			const response = await fetch(SERVER_URL + 'user/language', {
				headers: {
					'x-access-token': localStorage.getItem('token'),
				},
			});

			if (!response.ok) {
				const message = `An error occurred: ${response.statusText}`;
				window.alert(message);
				return;
			}

			const { language } = await response.json();

			setLanguage(language);

			const languages = ['spanish', 'french', 'vietnamese'];

			setSelectedIndex(languages.indexOf(language));

			return language;
		}



		getLanguage().then((language) => populateDates(language).then((dates) => {
			const [todaysCount, allDates] = dates;

			setTodaysProgress(todaysCount && todaysCount.cardCount);

			const yesterday = getPreviousDays(1);
			const yesterdaysDay = yesterday.split(' ')[0];
			setYesterdaysDay(yesterdaysDay);

			const yesterdaysCount = (
				_.filter(allDates, (date) => {
					return date.date === yesterday;
				})[0]
			)

			if (yesterdaysCount && yesterdaysCount.cardCount >= 50) {
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

			if (fourDaysAgosCount && fourDaysAgosCount.cardCount >= 50) {
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

			if (fiveDaysAgosCount && fiveDaysAgosCount.cardCount >= 50) {
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

			if (sixDaysAgosCount && sixDaysAgosCount.cardCount >= 50) {
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

			if (aWeekAgosCount && aWeekAgosCount.cardCount >= 50) {
				setAWeekAgosCount(true);
			};

		}));
	}, [language]);

	async function updateLanguage(updatedLanguage) {
		const req = await fetch(SERVER_URL + 'user/language', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-access-token': localStorage.getItem('token'),
			},
			body: JSON.stringify({
				language: updatedLanguage
			})
		});

		const data = await req.json()
		if (data.status === 'ok') {
			console.log('success')
		} else {
			alert(data.error)
		}

		window.location.reload(false);
	}

	const options = ['🇪🇸 Spanish', '🇫🇷 French', '🇻🇳 Vietnamese'];

	const handleClick = () => {
		console.info(`You clicked ${options[selectedIndex]}`);
	};

	const handleMenuItemClick = (event, index) => {
		const selectedLanguage = options[index].split(' ')[1].toLowerCase();
		setLanguage(selectedLanguage);
		updateLanguage(selectedLanguage);
		setSelectedIndex(index);
		setOpen(false);
	};

	const handleToggle = () => {
		setOpen((prevOpen) => !prevOpen);
	};

	const handleClose = (event) => {
		if (anchorRef.current && anchorRef.current.contains(event.target)) {
			return;
		}

		setOpen(false);
	};

	return (
		<div className='dashboard'>
			<h3 id='welcome-back' style={{ margin: '0', textAlign: 'center' }}>
				<strong>Welcome back, {name}</strong>
			</h3>
			<Card className='dash-card' id='learn-card'>
				<div id='language-learning'>
					<ButtonGroup
						style={{ width: '100%' }}
						variant="contained"
						ref={anchorRef}
						aria-label="split button"
					>
						<Button
							style={{ width: '100%' }}
							onClick={handleClick}
						>
							{options[selectedIndex]}
						</Button>
						<Button
							size="large"
							aria-controls={open ? 'split-button-menu' : undefined}
							aria-expanded={open ? 'true' : undefined}
							aria-label="select language"
							aria-haspopup="menu"
							onClick={handleToggle}
						>
							<ArrowDropDownIcon />
						</Button>
					</ButtonGroup>
					<Popper
						sx={{
							zIndex: 1,
						}}
						open={open}
						anchorEl={anchorRef.current}
						role={undefined}
						transition
						disablePortal
					>
						{({ TransitionProps, placement }) => (
							<Grow
								{...TransitionProps}
								style={{
									transformOrigin:
										placement === 'bottom' ? 'center top' : 'center bottom',
								}}
							>
								<Paper>
									<ClickAwayListener onClickAway={handleClose}>
										<MenuList id="split-button-menu" autoFocusItem>
											{options.map((option, index) => (
												<MenuItem
													key={option}
													selected={index === selectedIndex}
													onClick={(event) => handleMenuItemClick(event, index)}
												>
													{option}
												</MenuItem>
											))}
										</MenuList>
									</ClickAwayListener>
								</Paper>
							</Grow>
						)}
					</Popper>
					<br />
					<Button id='continue-learning' href="/#/learn" color='secondary' variant='contained'>continue learning</Button>
				</div>
			</Card>
			<Card className='dash-card'>
				<p className='card-header'>Today's progress</p>
				<p className='grey-text text-darken-1 dash-content'>Complete 50 cards to complete a set and achieve your daily goal.</p>
				<p className='today'>{today}</p>
				<span className='todays-count'>
					{todaysProgress ? todaysProgress > 50 ? todaysProgress - (Math.floor(todaysProgress / 50) * 50) : todaysProgress : '0'} / 50
					{todaysProgress > 50 &&
						<span className='set-count-dash'> / {Math.floor(todaysProgress / 50)} set{Math.floor(todaysProgress / 50) > 1 && 's'} completed</span>
					}
				</span>
				<LinearProgress style={{ marginTop: '2px' }} className='progress' color='secondary' variant="determinate" value={(todaysProgress - (Math.floor(todaysProgress / 50) * 50)) * 2} />
			</Card>
			<Card className='dash-card'>
				<div>
					<p className='card-header'>Past week's progress</p>
					<p className='grey-text text-darken-1 dash-content'>For best results, try to learn every day. 50 cards would be ideal, but even 10 cards on tough days can help create a healthy learning habit.</p>
					<FormControl component="fieldset">
						<FormGroup aria-label="position" row>
							<FormControlLabel
								value="bottom"
								control={<Checkbox className={aWeekAgosCount && 'checked'} disabled checked={aWeekAgosCount} size='large' />}
								label={aWeekAgosDay}
								labelPlacement="bottom"
								className='daily-checkbox'
							/>
							<FormControlLabel
								value="bottom"
								control={<Checkbox className={sixDaysAgosCount && 'checked'} disabled checked={sixDaysAgosCount} size='large' />}
								label={sixDaysAgosDay}
								labelPlacement="bottom"
								className='daily-checkbox'
							/>
							<FormControlLabel
								value="bottom"
								control={<Checkbox className={fiveDaysAgosCount && 'checked'} disabled checked={fiveDaysAgosCount} size='large' />}
								label={fiveDaysAgosDay}
								labelPlacement="bottom"
								className='daily-checkbox'
							/>
							<FormControlLabel
								value="bottom"
								control={<Checkbox className={fourDaysAgosCount && 'checked'} disabled checked={fourDaysAgosCount} size='large' />}
								label={fourDaysAgosDay}
								labelPlacement="bottom"
								className='daily-checkbox'
							/>
							<FormControlLabel
								value="bottom"
								control={<Checkbox className={threeDaysAgosCount && 'checked'} disabled checked={threeDaysAgosCount} size='large' />}
								label={threeDaysAgosDay}
								labelPlacement="bottom"
								className='daily-checkbox'
							/>
							<FormControlLabel
								value="bottom"
								control={<Checkbox className={ereyesterdaysCount && 'checked'} disabled checked={ereyesterdaysCount} size='large' />}
								label={ereyesterdaysDay}
								labelPlacement="bottom"
								className='daily-checkbox'
							/>
							<FormControlLabel
								value="bottom"
								control={<Checkbox className={yesterdaysCount && 'checked'} disabled checked={yesterdaysCount} size='large' />}
								label={yesterdaysDay}
								labelPlacement="bottom"
								className='daily-checkbox'
							/>
						</FormGroup>
					</FormControl>
				</div>
			</Card>
		</div>
	)
}
