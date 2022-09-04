import React, { useEffect, useState } from 'react';
import jwt from 'jsonwebtoken'; 
import { useNavigate } from 'react-router';
import _ from 'lodash';

export default function Dashboard() {
	const navigate = useNavigate();
	const [name, setName] = useState();
	const [cards, setCards] = useState();
	const [cardProgress, setCardProgress] = useState(0);
	const [allCards, setAllCards] = useState();
	const [sampleCard, setSampleCard] = useState();

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
	  const token = localStorage.getItem('token')
		if (token) {
			const user = jwt.decode(token)
			if (!user) {
				// localStorage.removeItem('token')
				navigate('/login')
			} else {
				setName(user.name);
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
			setSampleCard(_.sample(allCards));
		}

		getCards();

		return;
	}, [])
// debugger
	async function updateCards(e) {
		e.preventDefault()

		await populateCards();
		
		const filteredCards = _.reject(cards, (card) => {
			return card.cardId === sampleCard._id;
		})

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
					'cardProgress': Number(cardProgress)
				} ],
			}),
		})

		const data = await req.json()
		if (data.status === 'ok') {
			// setCards(cardProgress)
			setCardProgress(0)
		} else {
			alert(data.error)
		}

		setSampleCard(_.sample(allCards));
	}
	// debugger
	return (
		<div>
			<h2>Dashboard</h2>
			<h3>{ name }</h3>
			{/* <h4>{ sampleCard.targetWord }</h4> */}
			<h3>{ sampleCard ? sampleCard.targetWord : "" }</h3>
			<form onSubmit={ updateCards }>
				<input 
					type='number'
					placeholder='card progress' 
					value={ cardProgress }
					onChange={ (e) => setCardProgress(e.target.value) }
				/>
				<input type="submit" value="Add to user's cards" />
			</form>
		</div>
	)
}
