import React from 'react';
import CardForm from './CardForm';
import { useNavigate } from 'react-router';

export default function CreateCard() {
	const navigate = useNavigate();

	async function saveCard(form) {
		const newCard = {...form};

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
			<h2>Create</h2>
			<CardForm onSubmit={ saveCard } />
		</div>
	)
}
