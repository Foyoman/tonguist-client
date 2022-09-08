import React from 'react'
import BottomNavigation from '../layout/BottomNavigation'
import { Outlet } from 'react-router'

export default function Hub() {
	return (
		<div>
			<Outlet />
			<BottomNavigation />
		</div>
	)
}
