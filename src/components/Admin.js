import React from 'react';
import '../style.scss'
import { Link, Outlet } from 'react-router-dom';

export default function Admin() {
	return (
		<div>
			<h1>Admin</h1>
			Nav coming soon | {" "}
			<Link to='/admin/cardlist'>Card list</Link> {" "} | {" "}
			<Link to='/admin/create'>Create</Link>
			<Outlet />
		</div>
	)
}