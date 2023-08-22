import { styled } from '@mui/material/styles';
import Button, { ButtonProps } from '@mui/material/Button';
import * as Color from '../utils/Colors'

const LoginRegisterButton = styled(Button)<ButtonProps>(({ theme }) => ({
    color: theme.palette.getContrastText(Color.purple.primary),
    backgroundColor: Color.purple.primary,
    '&:hover': {
      backgroundColor: Color.purple.secondary,
    },
    marginTop: '1rem',
  }));

export default LoginRegisterButton;