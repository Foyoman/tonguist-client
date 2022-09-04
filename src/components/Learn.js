import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import _ from 'underscore';

export default function Learn() {
	const [cards, setCards] = useState([]);
	const [card, setCard] = useState({});
	const [previousCards, setPreviousCards] = useState([]); // TODO: add previous cards to previousCards, to prevent users from seeing the same cards in short sequence
	// 

	const SERVER_URL = 'http://localhost:6969/cards/'

	useEffect(() => {
		async function getCards() {
			const response = await fetch(SERVER_URL);

			if (!response.ok) {
				const message = `An error occurred: ${ response.statusText }`;
				window.alert(message);
				return;
			}

			const cards = await response.json();
			setCards(cards);
		}

		getCards().then(() => setCard(_.sample(cards)));

		return;
	}, [cards.length]);

	return (
		<div>
			<h2>Learn</h2>
			<div className='text-center' style={{ maxWidth: '600px', margin: '0 auto' }}>
				<h3>Test card</h3>
				<Card className='d-flex justify-content-center align-items-center'>
					<Card.Body>
						<p style={{ display: 'inline' }}>
							{ card ? card.phraseStart : "loading..." }
						</p>
						<input type="text" />
						<p style={{ display: 'inline' }}>
							{ card ? card.phraseEnd : "loading..." }
						</p>

						<br />
						<br />
						<div className='card-bottom'>
							<p>{ card ? card.englishWord : "loading..." }</p>
							<p>{ card ? card.englishPhrase : "loading..." }</p>
						</div>
					</Card.Body>
				</Card>
			</div>
		</div>
	)
}
