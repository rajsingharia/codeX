import { styled } from '@mui/material/styles';
import * as Color from '../utils/Colors'
import { TextField, TextFieldProps } from '@mui/material';

export const CustomTextField = styled(TextField)<TextFieldProps>(() => ({
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: Color.purple.primary,
        },
        '&:hover fieldset': {
            borderColor: Color.purple.primary,
        },
        '&.Mui-focused fieldset': {
            borderColor: Color.purple.primary,
        },
    },
    '& .MuiOutlinedInput-input': {
        color: Color.white.primary,
    },
    '& .MuiInputLabel-outlined': {
        color: Color.white.primary,
    },
}));