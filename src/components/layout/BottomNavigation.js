import * as React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import '../../style.scss';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CottageIcon from '@mui/icons-material/Cottage';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';


export default function LabelBottomNavigation() {
const [value, setValue] = React.useState('recents');

const handleChange = (_, newValue) => {
	setValue(newValue);
};

return (
	<BottomNavigation 
		id='bottom-navigation' 
		sx={{ width: '100%', height: '70px' }} 
		value={value} onChange={handleChange} 
		className='bottom-navigation'
	>
		<BottomNavigationAction
			href="#/dashboard"
			label="Home"
			value="home"
			icon={<CottageIcon />}
		/>
		<BottomNavigationAction
			href="#/learn"
			label="Learn"
			value="learn"
			icon={<PlayCircleFilledWhiteIcon />}
		/>
		<BottomNavigationAction
			href="#/profile"
			label="Profile"
			value="profile"
			icon={<AccountCircleIcon />}
		/>
	</BottomNavigation>
);
}