import React, { useEffect, useState } from 'react';
import jwt from 'jsonwebtoken'; 
import { useNavigate } from 'react-router';
import _ from 'lodash';
import '../../style.scss';
import { Card, Divider } from '@mui/material';

import BoyIcon from '@mui/icons-material/Boy';
import GirlIcon from '@mui/icons-material/Girl';
import NeutralIcon from '@mui/icons-material/Man4';
import LinearProgress from '@mui/material/LinearProgress';

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
	const [readOnly, setReadOnly] = useState(true);
	const [correct, setCorrect] = useState(false);
	const [finishedCard, setFinishedCard] = useState(false);
	const [todaysDate, setTodaysDate] = useState('');
	const [cardCount, setCardCount] = useState(0);
	const [language, setLanguage] = useState('');
	const [allLangCards, setAllLangCards] = useState([]);
	const [allLangDates, setAllLangDates] = useState([]);

	const SERVER_URL = `https://tonguist-server.onrender.com/`;

	async function populateDates() {
		const req = await fetch(SERVER_URL + 'user/dates', {
			headers: {
				'x-access-token': localStorage.getItem('token'),
			},
		})

		const data = await req.json()
		if (data.status === 'ok') {
			const dates = data.dates;
			setAllLangDates(dates);

			return dates;
		} else {
			alert(data.error)
		}
	}

	async function populateCards(language) {
		const req = await fetch(SERVER_URL + 'user/cards', {
			headers: {
				'x-access-token': localStorage.getItem('token'),
			},
		})

		const data = await req.json()
		if (data.status === 'ok') {
			const cards = data.cards;
			setAllLangCards(cards);
			const languageFilteredCards = (
				_.filter(cards, (card) => {
					return card.language === language;
				})
			)
		
			setCards(languageFilteredCards);
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

		getLanguage().then((language) => populateCards(language).then((langCardsArray) => getCards(langCardsArray).then((payload) => {
			const [language, cards, allCards] = payload;
			const today = new Date();
			const formattedDate = String(today).split(' ').slice(0, 4).join(' ');
			setTodaysDate(formattedDate);

			populateDates().then((dates) => {
				const selectDate = (
					_.filter(dates, (date) => {
						return date.date === formattedDate && date.language === language;
					})
				)
	
				if (selectDate) { 
					setCardCount(selectDate[0] ? selectDate[0].cardCount : 0);
				}
			} );
			
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
			setInputWidth(newSampleCard.targetWord.length * 0.6);

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

			setReadOnly(false);
		})));

		return;
	}, []);

	async function updateCards() {
		setFirstAttempt(false);
		
		let updatedProgress = 1;
		const noDiacritics = sampleCard.targetWord.normalize("NFD").replace(/\p{Diacritic}/gu, "");

		if (input.toLowerCase() === noDiacritics.toLowerCase() || input.toLowerCase() === sampleCard.targetWord.toLowerCase()) {
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
				setFirstAttempt(true);
				setReadOnly(false);
				setCorrect(false);
				setInput('');
				setSampleCard(newCard);
				setInputWidth(newCard.targetWord.length * 0.6);
				setFinishedCard(false);
				if (selectCard) {
					setProgress(selectCard.cardProgress);
				} else {
					setNewCard(true);
					setProgress(0);
					return;
				}
				setNewCard(false);
			}, 2500)
			
			const selectCard = (
				(_.filter(cards, (card) => {
					return card.cardId === newCard._id;
				}))[0]
			);

			setSelectedCard(selectCard);
			
		} 

		if (input.toLowerCase() !== noDiacritics.toLowerCase() && input.toLowerCase() !== sampleCard.targetWord.toLowerCase()) { 
			setInput('');
			setProgress(1);
		}
		
		if (!firstAttempt) {
			return;
		}

		const updatedCardCount = cardCount + 1;
		setCardCount(updatedCardCount);		
		
		const filteredDates = (
			_.reject(allLangDates, (date) => {
				return date.date === todaysDate && date.language === language;
			})
		)

		const filteredUserCards = (
			_.reject(allLangCards, (card) => {
				return card.cardId === sampleCard._id;
			})
		)

		await fetch(SERVER_URL + 'user/cards', {
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
				}],
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
	}

	const _handleChange = (e) => {
		if (readOnly) {
			e.preventDefault();
			return;
		}

		if (e.key === 'Enter') {
			updateCards();
		}
	}

	return (
		<div>
			<Card className='container learn-card'>
				<span style={{ margin: '0', padding: '0', display: 'flex', alignItems: 'center' }}>
					<span className='stripes'>
						<div className={ `stripe ${ finishedCard ? 'finished-stripe' : progress >= 0 && 'checked' }` } id={ newCard ? 'new-word-stripe' : '' } />
						<div className={ `stripe ${ finishedCard ? 'finished-stripe' : progress >= 2 && 'checked' }` } />
						<div className={ `stripe ${ finishedCard ? 'finished-stripe' : progress >= 3 && 'checked' }` } />
						<div className={ `stripe ${ finishedCard ? 'finished-stripe' : progress >= 4 && 'checked' }` } />
						<div className={ `stripe ${ finishedCard ? 'finished-stripe' : progress >= 5 && 'checked' }` } />

						<span className='card-status'>
							{ newCard && <span id='new-word'>New word</span> }
							{ finishedCard && <span id='finished-word'>Word completed</span> }
						</span>
					</span>
				</span>
				<div className='whole-phrase'>
					<p style={{ display: 'inline', fontSize: '20px' }}>{ sampleCard ? sampleCard.phraseStart : "" }</p>
						<input 
							type='search'
							autoFocus
							autoCapitalize="none"
							autoComplete='off'
							autoCorrect='off'
							spellCheck='false'
							value={ input } 
							onChange={ (e) => setInput(e.target.value) }
							onKeyDown={ _handleChange }
							placeholder={ !firstAttempt ? sampleCard.targetWord : "" }
							id={ correct ? 'correct-input' : 'card-input' }
							className='card-input'
							style={{
								fontSize: '20px', 
								height: '1.5em', 
								width: `${ inputWidth }em`, 
								display: 'inline',
								margin: '0 0.2em',
								caretColor: `${ readOnly ? 'transparent' : '' }`
							}}
						/>
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