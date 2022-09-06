import React from 'react';
import CardForm from './CardForm';
import { useNavigate } from 'react-router';

export default function CreateCard() {
	const navigate = useNavigate();

	async function saveCard(form) {
		const newCard = {
			language: form.language,
			level: form.level,
			targetWord: form.targetWord,
			englishWord: form.englishWord,
			wordClass: form.wordClass.split(' '),
			phraseStart: form.phraseStart,
			phraseEnd: form.phraseEnd,
			englishPhrase: form.englishPhrase
		};


		await fetch("http://localhost:6969/cards", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(newCard),
		})
		.catch(error => {
			window.alert(error);
			return;
		});

		navigate('/admin/cardlist')
	}
	
	return (
		<div>
			<h3 style={{ textAlign: 'center' }}>Create</h3>
			<CardForm onSubmit={ saveCard } />
		</div>
	)
}
