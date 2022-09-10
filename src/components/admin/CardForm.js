import React, { useState } from 'react'
import '../../style.scss'

export default function CardForm(props) {
	const [form, setForm] = useState({
		language: props.card ? props.card.language : "",
		level: props.card ? props.card.level : "",
		targetWord: props.card ? props.card.targetWord : "",
		englishWord: props.card ? props.card.englishWord : "",
		wordClass: props.card ? props.card.wordClass.join(' ') : "",
		phraseStart: props.card ? props.card.phraseStart : "",
		phraseEnd: props.card ? props.card.phraseEnd : "",
		englishPhrase: props.card ? props.card.englishPhrase : ""
	});

	function updateForm(value) {
		return setForm((prev) => {
			return {...prev, ...value};
		});
	}

	function _createOrUpdate(e) {
		e.preventDefault();
		props.onSubmit(form);
		setForm({ language: "", level: "", targetWord: "", englishWord: "", wordClass: "", phraseStart: "", phraseEnd: "", englishPhrase: "" });
	}
	
	return (
		<form onSubmit={ _createOrUpdate }>
			<label>
				Language:
				<input 
					value={ form.language }
					onChange={(e) => updateForm({ language: e.target.value })}
					type="text" 
					required 
				/>
			</label>

			<label>
				Level:
				<input 
					value={ form.level }
					onChange={(e) => updateForm({ level: e.target.value })}
					type="text" 
					required 
				/>
			</label>
			
			<label>
				Target word:
				<input 
					value={ form.targetWord }
					onChange={(e) => updateForm({ targetWord: e.target.value })}
					type="text" 
					required 
				/>
			</label>

			<label>
				English word:
				<input 
					value={ form.englishWord }
					onChange={(e) => updateForm({ englishWord: e.target.value })}
					type="text" 
					required 
				/>
			</label>

			<label>
				Word class:
				<input 
					value={ form.wordClass }
					onChange={(e) => updateForm({ wordClass: e.target.value })}
					type="text" 
					required 
				/>
			</label>

			<label>
				Phrase start:
				<input 
					value={ form.phraseStart }
					onChange={(e) => updateForm({ phraseStart: e.target.value })}
					type="text" 
					required 
				/>
			</label>
			
			<label>
				Phrase end:
				<input 
					value={ form.phraseEnd }
					onChange={(e) => updateForm({ phraseEnd: e.target.value })}
					type="text" 
					required 
				/>
			</label>

			<label>
				English phrase:
				<input 
					value={ form.englishPhrase }
					onChange={(e) => updateForm({ englishPhrase: e.target.value })}
					type="text" 
					required 
				/>
			</label>

			<button type='submit'>
				Submit
			</button>
		</form>
	)
}
