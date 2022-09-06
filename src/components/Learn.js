import React, { useEffect, useState } from 'react';
import jwt from 'jsonwebtoken'; 
import { useNavigate } from 'react-router';
import _ from 'lodash';
import '../style.scss';
import { Card, Divider, Box, Checkbox } from '@mui/material';

import BoyIcon from '@mui/icons-material/Boy';
import GirlIcon from '@mui/icons-material/Girl';

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
	const [correct, setCorrect] = useState(false)

	const SERVER_URL = `http://localhost:6969/`;

	async function populateCards() {
		const req = await fetch(SERVER_URL + 'user/cards', {
			headers: {
				'x-access-token': localStorage.getItem('token'),
			},
		})

		const data = await req.json()
		if (data.status === 'ok') {
			setCards(data.cards)
			console.log(data.cards)
		} else {
			alert(data.error)
		}

		return data.cards;
	}
	
	useEffect(() => {
		if (!localStorage.getItem('token')) {
			navigate('/login')
		}

	  const token = localStorage.getItem('token')
		if (token) {
			const user = jwt.decode(token)
			if (!user) {
				navigate('/login');
			}
		}

		async function getCards(cards) {
			const response = await fetch(SERVER_URL + 'cards');

			if (!response.ok) {
				const message = `An error occurred: ${ response.statusText }`;
				window.alert(message);
				return;
			}

			const allCards = await response.json();
			setAllCards(allCards);
			const newCard = _.sample(allCards);
			setSampleCard(newCard);
			setInputWidth(newCard.targetWord.length * 0.7);
			return [newCard, cards];
		}

		populateCards().then((cards) => getCards(cards).then((cardArray) => {
			const [newCard, cards] = cardArray;
			const selectCard = (
				(_.filter(cards, (card) => {
					return card.cardId === newCard._id;
				}))[0]
			)
			setSelectedCard(selectCard);
			setProgress(selectCard.cardProgress);
			if (!selectCard) {
				setNewCard(true);
			} else {
				setNewCard(false);
			}
		}))

		return;
	}, [])
	
// debugger
	async function updateCards(e) {
		e.preventDefault();
		setFirstAttempt(false);
		
		const filteredCards = _.reject(cards, (card) => {
			return card.cardId === sampleCard._id;
		})

		let updatedProgress = 1;
		const noDiacritics = sampleCard.targetWord.normalize("NFD").replace(/\p{Diacritic}/gu, "");

		if (input.toLowerCase() === noDiacritics) {
			if (selectedCard) {
				updatedProgress = selectedCard.cardProgress + 1;
			}

			const newCard = _.sample(allCards);
			// setSampleCard(newCard);
			setReadOnly(true);
			
			if (firstAttempt) {
				setCorrect(true);
				setProgress(progress + 1);
			}

			setTimeout(() => {
				console.log('hi')
				setSampleCard(newCard);
				setInputWidth(newCard.targetWord.length * 0.7);
				setProgress(selectCard.cardProgress);
				setReadOnly(false);
				setCorrect(false);
				setInput('');
			}, 3000)

			const selectCard = (
				(_.filter(cards, (card) => {
					return card.cardId === newCard._id;
				}))[0]
			);

			setSelectedCard(selectCard);
			
			if (!selectCard) {
				setNewCard(true);
			} else {
				setNewCard(false);
			}
			setFirstAttempt(true);
		} 

		if (input.toLowerCase() !== noDiacritics) { 
			setInput('');
			setProgress(1);
		}
		
		if (!firstAttempt) {
			return;
		}

		const req = await fetch(SERVER_URL + 'user/cards', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-access-token': localStorage.getItem('token'),
			},
			body: JSON.stringify({
				cards: [...filteredCards, { 
					'cardId': sampleCard._id,
					'targetWord': sampleCard.targetWord,
					'cardProgress': updatedProgress
				} ],
			}),
		})

		const data = await req.json()
		if (data.status === 'ok') {
			// setCards(cardProgress)
			console.log('success')
		} else {
			alert(data.error)
		}

		populateCards();
		
	}

	// debugger

	return (
		<div>
			<h3 style={{ textAlign: 'center' }}>Learn</h3>
			<Card className='container learn-card'>
				<span style={{ margin: '0', padding: '0', display: 'flex' }}>
					{ newCard ? 
						<span style={{ color: 'orange' }}>New Word!</span>
						: 
						<span className='stripes'>
							{ progress >= 1 &&
								<div className='stripe checked' /> || <div className='stripe' />
							}
							{ progress >= 2 &&
								<div className='stripe checked' /> || <div className='stripe' />
							}
							{ progress >= 3 &&
								<div className='stripe checked' /> || <div className='stripe' />
							}
							{ progress >= 4 &&
								<div className='stripe checked' /> || <div className='stripe' />
							}
							{ progress >= 5 &&
								<div className='stripe checked' /> || <div className='stripe' />
							}
						</span>
					}
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
						<span><BoyIcon /><BoyIcon /><BoyIcon /></span> 
						: 
						<BoyIcon /> 
					: "" : "" }
					{ sampleCard.wordClass ? sampleCard.wordClass.includes('feminine') ? sampleCard.wordClass.includes('plural') ? 
						<span><GirlIcon /><GirlIcon /><GirlIcon /></span> 
						: 
						<GirlIcon /> 
					: "" : "" }
					{ sampleCard.wordClass ? sampleCard.wordClass.join(', ') : "" }
				</Card>

				<Divider />

				<div className='card-bottom'>
					<p className='grey-text text-darken-1 english-word'>{ sampleCard ? sampleCard.englishWord : "" }</p>
					<p className='grey-text text-darken-1 english-phrase'>{ sampleCard ? sampleCard.englishPhrase : "" }</p>
				</div>
			</Card>
		</div>
	)
}


