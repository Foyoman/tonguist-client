import React, { useEffect, useState } from 'react';
import jwt from 'jsonwebtoken'; 
import { useNavigate } from 'react-router';
import _ from 'lodash';
import '../style.scss';
import { first } from 'underscore';

export default function Learn() {
	const navigate = useNavigate();

	const [cards, setCards] = useState([]);
	const [allCards, setAllCards] = useState([]);
	const [sampleCard, setSampleCard] = useState({});
	const [input, setInput] = useState('');
	const [firstAttempt, setFirstAttempt] = useState(true);

	const [inputWidth, setInputWidth] = useState('');

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
		} else {
			alert(data.error)
		}

		console.log(data.cards)
	}
	
	useEffect(() => {
		if (!localStorage.getItem('token')) {
			navigate('/login')
		}
	  const token = localStorage.getItem('token')
		if (token) {
			const user = jwt.decode(token)
			if (!user) {
				// localStorage.removeItem('token');
				navigate('/login');
			} else {
				populateCards();
			}
		}

		async function getCards() {
			const response = await fetch(SERVER_URL + 'cards');

			if (!response.ok) {
				const message = `An error occurred: ${ response.statusText }`;
				window.alert(message);
				return;
			}

			const allCards = await response.json();
			setAllCards(allCards);
			const sampleCard = _.sample(allCards);
			setSampleCard(sampleCard);
			setInputWidth(sampleCard.targetWord.length * 0.7);
		}

		getCards();

		return;
	}, [localStorage.getItem('token')])
// debugger
	async function updateCards(e) {
		e.preventDefault();
		setInput('');
		setFirstAttempt(false);
		
		const filteredCards = _.reject(cards, (card) => {
			return card.cardId === sampleCard._id;
		})

		const selectedCard = (
			(_.filter(cards, (card) => {
				return card.cardId === sampleCard._id;
			}))[0]
		)
		
		let updatedProgress;

		if (input === sampleCard.targetWord) {
			updatedProgress = selectedCard.cardProgress + 1;
			const newCard = _.sample(allCards);
			setSampleCard(newCard);
			setInputWidth(newCard.targetWord.length * 0.7);
			setFirstAttempt(true);
			await populateCards();
		} else {
			updatedProgress = 1;
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

		
	}

	return (
		<div>
			<h3 style={{ textAlign: 'center' }}>Learn</h3>
			<div className='container card'>
				<p style={{ display: 'inline', fontSize: '20px' }}>{ sampleCard ? sampleCard.phraseStart : "" }</p>
				<form onSubmit={ updateCards } style={{ display: 'inline' }}>
					<input 
						value={ input } 
						onChange={ (e) => setInput(e.target.value) }
						placeholder={ !firstAttempt ? sampleCard.targetWord : "" }
						style={{ display: 'inline', fontSize: '20px', height: '1.5em', width: `${ inputWidth }em`, textAlign: 'center' }}
					/>

					<button type="submit" style={{ display: 'none' }}>Update card progress</button>
				</form>
				<p style={{ display: 'inline', fontSize: '20px' }}>{ sampleCard ? sampleCard.phraseEnd : "" }</p>

				<div className='divider'></div>

				<div className='card-bottom'>
					<p className='grey-text text-darken-1'>{ sampleCard ? sampleCard.englishWord : "" }</p>
					<p className='grey-text text-darken-1'>{ sampleCard ? sampleCard.englishPhrase : "" }</p>
				</div>
			</div>
		</div>
	)
}


