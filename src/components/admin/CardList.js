import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Card = (props) => (
	<tr>
		<td>{ props.card.targetWord }</td>
		<td>{ props.card.englishWord }</td>
		<td>
			<Link className='btn btn-link' to={`/admin/edit/${ props.card._id }`}>Edit</Link> |
			<button 
				className='btn btn-link'
				onClick={() => {
					props.deleteCard(props.card._id);
				}}
			>
				Delete
			</button>
		</td>
	</tr>
);

export default function CardList() {
	const [cards, setCards] = useState([]);

	const SERVER_URL = 'https://tonguist.herokuapp.com/cards/'
	
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

		getCards();

		return;
	}, [cards.length]);

	async function deleteCard(id) {
		await fetch(SERVER_URL + id, {
			method: "DELETE"
		});

		const newCards = cards.filter((el) => el._id !== id);
		setCards(newCards);
	}

	function cardList() {
		return cards.map((card) => {
			return (
				<Card
					card={ card }
					deleteCard={ () => deleteCard(card._id) }
					key={ card._id }
				/>
			);
		});
	}

	return (
		<div>
			<h3>Card List</h3>
			<table className='table table-striped' style={{ marginTop: 20 }}>
				<thead>
					<tr>
						<th>Target word</th>
						<th>English word</th>
					</tr>
				</thead>
				<tbody>{ cardList() }</tbody>
			</table>
		</div>
	)
}
