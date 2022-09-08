import React, { useEffect, useState } from 'react';
import jwt from 'jsonwebtoken'; 
import { useNavigate } from 'react-router';
import _ from 'lodash';
import '../style.scss';
import { Card, Divider, Box, Checkbox, getDialogContentTextUtilityClass } from '@mui/material';

import BoyIcon from '@mui/icons-material/Boy';
import GirlIcon from '@mui/icons-material/Girl';
import NeutralIcon from '@mui/icons-material/Man4';
import LinearProgress from '@mui/material/LinearProgress';
import { ContentPasteSearchOutlined } from '@mui/icons-material';


export default function Learn() {
	const navigate = useNavigate();

	const [cards, setCards] = useState([]);
	const [allCards, setAllCards] = useState([]);
	const [sampleCard, setSampleCard] = useState({});
	const [input, setInput] = useState('');
	const [firstAttempt, setFirstAttempt] = useState(true);
	const [selectedCard, setSelectedCard] = useState('');
	const [inputWidth, setInputWidth] = useState('');
	const [newCard, setNewCard] = useState(false);
	const [progress, setProgress] = useState(0);
	const [readOnly, setReadOnly] = useState(false);
	const [correct, setCorrect] = useState(false);
	const [finishedCard, setFinishedCard] = useState(false);
	const [allDates, setAllDates] = useState('');
	const [todaysDate, setTodaysDate] = useState('');
	const [cardCount, setCardCount] = useState(0);
	const [language, setLanguage] = useState('');

	const SERVER_URL = `http://localhost:6969/`;

	async function populateDates(language) {
		const req = await fetch(SERVER_URL + 'user/dates', {
			headers: {
				'x-access-token': localStorage.getItem('token'),
			},
		})

		const today = new Date();
		const formattedDate = String(today).split(' ').slice(0, 4).join(' ');
		setTodaysDate(formattedDate);

		const data = await req.json()
		if (data.status === 'ok') {
			const dates = data.dates;
			// setAllDates(dates)
			console.log(dates)
			const languageFilteredDates = (
				_.filter(dates, (date) => {
					return date.language === language;
				})
			)

			console.log(language)

			setAllDates(languageFilteredDates);
			console.log(languageFilteredDates);
			
			const selectDate = (
				_.filter(languageFilteredDates, (date) => {
					return date.date === formattedDate;
				})
			)
			console.log(selectDate[0])
			if (selectDate) { 
				setCardCount(selectDate[0] ? selectDate[0].cardCount : 0);
			}
			return dates;

		} else {
			alert(data.error)
		}

	}
// debugger
	async function populateCards(language) {
		const req = await fetch(SERVER_URL + 'user/cards', {
			headers: {
				'x-access-token': localStorage.getItem('token'),
			},
		})

		

		const data = await req.json()
		if (data.status === 'ok') {
			const cards = data.cards;
			const languageFilteredCards = (
				_.filter(cards, (card) => {
					return card.language === language;
				})
			)
		
			setCards(languageFilteredCards)
			return [language, languageFilteredCards];
		} else {
			alert(data.error)
		}
	}


	useEffect(() => {
		if (!localStorage.getItem('token')) {
			navigate('/login');
			return;
		}

	  const token = localStorage.getItem('token')
		if (token) {
			const user = jwt.decode(token)
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
				const message = `An error occurred: ${ response.statusText }`;
				window.alert(message);
				return;
			}

			const { language } = await response.json();
			setLanguage(language);
			return language;
		}

		async function getCards(langCardsArray) {
			const [language, cards] = langCardsArray
			
			const response = await fetch(SERVER_URL + 'cards');

			if (!response.ok) {
				const message = `An error occurred: ${ response.statusText }`;
				window.alert(message);
				return;
			}

			const allCards = await response.json();
			
			return [language, cards, allCards];
		}

		// getLanguage().then((language) => 

		getLanguage().then((language) => populateCards(language).then((langCardsArray) => getCards(langCardsArray).then((payload) => {
			const [language, cards, allCards] = payload;

			populateDates(language);
			
			const languageFilteredCards = (
				_.filter(allCards, (card) => {
					return card.language === language;
				})
			)
			
			const finishedCards = (
				_.filter(cards, (card) => {
					return card.cardProgress >= 5;
				})
			)

			const arrayOfFinishedCards = _.map(finishedCards, 'cardId')

			let filteredCards = languageFilteredCards ? languageFilteredCards : allCards;
			
			if (arrayOfFinishedCards.length > 1) {
				filteredCards = (
					_.reject(languageFilteredCards, (card) => {
						return arrayOfFinishedCards.includes(card._id);
					})
				)
			}

			setAllCards(filteredCards);
			const newSampleCard = _.sample(filteredCards);

			setSampleCard(newSampleCard);
			setInputWidth(newSampleCard.targetWord.length * 0.7);

			const selectCard = (
				(_.filter(cards, (card) => {
					return card.cardId === newSampleCard._id;
				}))[0]
			)

			


			setSelectedCard(selectCard);
			setProgress(selectCard ? selectCard.cardProgress : 0);
			
			if (!selectCard) {
				setNewCard(true);
			} else {
				setNewCard(false);
			}
		})));

		return;
	}, [localStorage.getItem('token')])

	async function updateCards(e) {
		e.preventDefault();
		setFirstAttempt(false);
		
		// const filteredCards = _.reject(cards, (card) => {
		// 	return card.cardId === sampleCard._id;
		// })

		let updatedProgress = 1;
		const noDiacritics = sampleCard.targetWord.normalize("NFD").replace(/\p{Diacritic}/gu, "");

		if (input.toLowerCase() === noDiacritics || input.toLowerCase() === sampleCard.targetWord) {
			if (firstAttempt) {
				setCorrect(true);
				setProgress(progress + 1);
				if (selectedCard) {
					updatedProgress = progress + 1;
				}
			}

			const filteredCards = (
				_.reject(allCards, (card) => {
					if (selectedCard) {
						return card._id === selectedCard.cardId;
					}
				})
			)


			if (updatedProgress >= 5) {
				setFinishedCard(true);
				setAllCards(filteredCards);
			}

			const newCard = _.sample(filteredCards);

			setReadOnly(true);
			setInput(sampleCard.targetWord)

			setTimeout(() => {
				setReadOnly(false);
				setCorrect(false);
				setInput('');
				setSampleCard(newCard);
				setInputWidth(newCard.targetWord.length * 0.7);
				setFinishedCard(false);
				if (!selectCard) {
					setNewCard(true);
					setProgress(0);
					return;
				}
				setNewCard(false);
				setProgress(todaysDate.cardCount);
			}, 2500)

			const selectCard = (
				(_.filter(cards, (card) => {
					return card.cardId === newCard._id;
				}))[0]
			);

			setSelectedCard(selectCard);
			
			setFirstAttempt(true);
		} 

		if (input.toLowerCase() !== noDiacritics) { 
			setInput('');
			setProgress(1);
		}
		
		if (!firstAttempt) {
			return;
		}

		const updatedCardCount = cardCount + 1;
		// setCardCount(updatedCardCount)

		
		const filteredDates = _.reject(allDates, (date) => {
			return date.date === todaysDate;
		})

		const filteredUserCards = (
			_.reject(cards, (card) => {
				return card.cardId === sampleCard._id;
			})
		)

		const req = await fetch(SERVER_URL + 'user/cards', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-access-token': localStorage.getItem('token'),
			},
			body: JSON.stringify({
				cards: [...filteredUserCards, { 
					'cardId': sampleCard._id,
					'targetWord': sampleCard.targetWord,
					'cardProgress': updatedProgress,
					'language': language
				} ],
			}),
		}).then(() => {
			fetch(SERVER_URL + 'user/dates', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'x-access-token': localStorage.getItem('token'),
				},
				body: JSON.stringify({
					dates: [...filteredDates, {
						'date': todaysDate,
						'cardCount': updatedCardCount,
						'language': language
					}]
				})
			})
		})

		populateCards(language);
		populateDates(language);
		
	}


	return (
		<div>
			<Card className='container learn-card'>
				<span style={{ margin: '0', padding: '0', display: 'flex' }}>
					<span className='stripes'>
						<div className={ `stripe ${ finishedCard ? 'finished-stripe' : progress >= 0 && 'checked' }` } id={ newCard ? 'new-word-stripe' : '' } />
						<div className={ `stripe ${ finishedCard ? 'finished-stripe' : progress >= 2 && 'checked' }` } />
						<div className={ `stripe ${ finishedCard ? 'finished-stripe' : progress >= 3 && 'checked' }` } />
						<div className={ `stripe ${ finishedCard ? 'finished-stripe' : progress >= 4 && 'checked' }` } />
						<div className={ `stripe ${ finishedCard ? 'finished-stripe' : progress >= 5 && 'checked' }` } />

						<span className='card-status'>
							{ newCard && <span className='' id='new-word'>New word</span> }
							{ finishedCard && <span className='' id='finished-word'>Word completed</span> }
						</span>
					</span>
				</span>
				<div className='whole-phrase'>
					<p style={{ display: 'inline', fontSize: '20px' }}>{ sampleCard ? sampleCard.phraseStart : "" }</p>
					<form onSubmit={ updateCards } style={{ display: 'inline' }} autoComplete='off'>
						<input 
							readOnly={ readOnly }
							value={ input } 
							onChange={ (e) => setInput(e.target.value) }
							placeholder={ !firstAttempt ? sampleCard.targetWord : "" }
							id={ correct ? 'correct-input' : 'card-input' }
							className='card-input'
							style={{ all: 'none', fontSize: '20px', height: '1.5em', width: `${ inputWidth }em` }}
						/>

						<button type="submit" style={{ display: 'none' }}>Update card progress</button>
					</form>
					<p style={{ display: 'inline', fontSize: '20px' }}>{ sampleCard ? sampleCard.phraseEnd : "" }</p>
				</div>
				<br />
				<Card className='card-bottom grey-text text-darken-1 word-class' variant='dark'>
					{ sampleCard.wordClass ? sampleCard.wordClass.includes('masculine') ? sampleCard.wordClass.includes('plural') ? 
						<span className='boy-icons icons'><BoyIcon /><BoyIcon /><BoyIcon /></span> 
						: 
						<span className='boy-icons icons'><BoyIcon /></span>
					: "" : "" }

					{ sampleCard.wordClass ? sampleCard.wordClass.includes('feminine') ? sampleCard.wordClass.includes('plural') ? 
						<span className='girl-icons icons'><GirlIcon /><GirlIcon /><GirlIcon /></span> 
						: 
						<span className='girl-icons icons'><GirlIcon /></span>
					: "" : "" }
					
					{ sampleCard.wordClass ? sampleCard.wordClass.includes('neutral') ? sampleCard.wordClass.includes('plural') ? 
						<span className='neutral-icons icons'><NeutralIcon /><NeutralIcon /><NeutralIcon /></span> 
						: 
						<span className='neutral-icons icons'><NeutralIcon /></span>
					: "" : "" }

					<span>{ sampleCard.wordClass ? sampleCard.wordClass.join(', ') : "" }</span>
				</Card>

				<Divider />

				<div className='card-bottom'>
					<p className='grey-text text-darken-1 english-word'>{ sampleCard ? sampleCard.englishWord : "" }</p>
					<p className='grey-text text-darken-1 english-phrase'>{ sampleCard ? sampleCard.englishPhrase : "" }</p>
				</div>
				<span className='grey-text text-darken-1 card-count'>
					{ cardCount > 50 ? (cardCount - (Math.floor(cardCount / 50) * 50)) : cardCount } / 50 
					{ cardCount > 50 && 
						<span className='set-count'> / { Math.floor(cardCount / 50) }</span>
					}
				</span>
				<LinearProgress className='progress' color='success' variant="determinate" value={ (cardCount - (Math.floor(cardCount / 50) * 50)) * 2 } />
			</Card>
		</div>
	)
}


