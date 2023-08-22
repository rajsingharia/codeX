import { Button, ButtonProps, IconButton, IconButtonProps } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { styled } from '@mui/material/styles';
import { white, purple } from '../utils/Colors';

export const CustomButton = styled(Button)<ButtonProps>(() => ({
    color: white.primary,
    backgroundColor: purple.secondary,
    borderColor: purple.primary,
    borderWidth: '2px',
    transition: 'all 0.2s ease',
    '&:hover': {
        backgroundColor: purple.primary,
        borderColor: purple.secondary,
        borderWidth: '2px',
        transform: 'scale(1.05)',
    },
}));

export const CustomLoadingButton = styled(LoadingButton)<ButtonProps>(() => ({
    color: white.primary,
    backgroundColor: purple.secondary,
    borderColor: purple.primary,
    borderWidth: '2px',
    transition: 'all 0.2s ease',
    '&:hover': {
        backgroundColor: purple.primary,
        borderColor: purple.secondary,
        borderWidth: '2px',
        transform: 'scale(1.01)',
    },
}));


export const CustomIconButton = styled(IconButton)<IconButtonProps>(() => ({
    color: white.primary,
    backgroundColor: purple.secondary,
    borderColor: purple.primary,
    borderWidth: '2px',
    transition: 'all 0.2s ease',
    borderRadius: '50%',

    '&:hover': {
        backgroundColor: purple.primary,
        borderColor: purple.secondary,
        borderWidth: '2px',
        transform: 'scale(1.05)',
    },
}));