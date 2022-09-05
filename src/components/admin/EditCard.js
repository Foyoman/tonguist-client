import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import CardForm from './CardForm';

export default function EditCard() {
	const params = useParams();
	const navigate = useNavigate();

	const [card, setCard] = useState();

	const SERVER_URL = `http://localhost:6969/cards/${ params.id.toString() }`
	
	useEffect(() => {
		async function fetchData() {
			const id = params.id.toString();
			const response = await fetch(SERVER_URL);

			if (!response.ok) {
				const message = `An error has occurred: ${ response.statusText }`;
				window.alert(message);
				return;
			}

			const card = await response.json();
			if (!card) {
				window.alert(`Card with id ${id} not found`);
				navigate("/");
				return;
			}

			setCard(card);
		}

		fetchData();
		
		return;
	}, [params.id, navigate]);

	async function updateCard(form) {
		const editedCard = {
			language: form.language,
			level: form.level,
			targetWord: form.targetWord,
			englishWord: form.englishWord,
			wordClass: form.wordClass.split(' '),
			phraseStart: form.phraseStart,
			phraseEnd: form.phraseEnd,
			englishPhrase: form.englishPhrase
		};

		await fetch(SERVER_URL, {
			method: "PUT",
			body: JSON.stringify(editedCard),
			headers: {
				'Content-Type': 'application/json'
			},
		});

		navigate("/admin/cardlist");
	}
	
	return (
		<div>
			<h3>Edit Card</h3>
			{ card && 
				<CardForm
					onSubmit={ updateCard }
					card={ card }
				/>
			}
		</div>
	)
}
