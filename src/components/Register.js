import React, { useState } from 'react'

export default function Register() {
	const [form, setForm] = useState({
		name: "",
		email: "",
		password: ""
	});

	function updateForm(value) {
		return setForm((prev) => {
			return { ...prev, ... value};
		});
	}

	function _createOrUpdate(e) {
		e.preventDefault();
		// props.onSubmit(form);
		setForm({ name: "", email: "", password: "" });
	}
	
	
	return (
		<div>
			<h2>Register</h2>
			<form>
				<input 
				  value={ form.name }
					onChange={(e) => updateForm({ name: e.target.value })}
					type="text" 
					placeholder="Name" 
				/>
				<input 
					value={ form.email }
					onChange={(e) => updateForm({ email: e.target.value })}
					type="email" 
					placeholder="Email"
				/>
				<input 
					value={ form.password }
					onChange={(e) => updateForm({ password: e.target.value })}
					type="password" 
					placeholder="Password"
				/>
				<input type="submit" value="Register" />
			</form>
		</div>
	)
}
