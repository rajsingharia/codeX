
import { NavLink, useNavigate } from 'react-router-dom'
import './NavigationBar.css'
import Avatar from '@mui/material/Avatar';
import { purple } from '../utils/Colors'
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Settings, Logout, AccountCircleRounded, HomeOutlined, PublicOutlined } from '@mui/icons-material';
import { Menu, MenuItem, Divider, ListItemIcon } from '@mui/material';

export const NavigationBar = () => {

    const { user, logout } = useContext(AuthContext);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const navigateToMyAccount = () => {
        navigate('/my-account');
    }


    return (
        <div style={{ height: '100%' }}>
            <div className='navgation'>
                <div className='navigation-header'>
                    <div className='navgation-item'>
                        <NavLink to="/" className='navgation-item-content'>
                            <HomeOutlined />
                        </NavLink>
                    </div>
                    <div className='navgation-item'>
                        <NavLink to="/public" className='navgation-item-content'>
                            <PublicOutlined />
                        </NavLink>
                    </div>
                </div>
                <div className='navigation-footer' onClick={handleOpen}>
                    <Avatar sx={{ bgcolor: purple.secondary, cursor: 'pointer' }}>
                        {(user && user.name && user.name.length > 0) ? user?.name[0]?.toUpperCase() : 'U'}
                    </Avatar>
                </div>
                <Menu
                    id="account-menu"
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}
                    transformOrigin={{ horizontal: 'left', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}>
                    <MenuItem onClick={navigateToMyAccount}>
                        <ListItemIcon>
                            <AccountCircleRounded fontSize="small" />
                        </ListItemIcon>
                        Account
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleClose}>
                        <ListItemIcon>
                            <Settings fontSize="small" />
                        </ListItemIcon>
                        Settings
                    </MenuItem>
                    <MenuItem onClick={() => logout}>
                        <ListItemIcon>
                            <Logout fontSize="small" />
                        </ListItemIcon>
                        Logout
                    </MenuItem>
                </Menu>
            </div>
        </div >
    )
}
