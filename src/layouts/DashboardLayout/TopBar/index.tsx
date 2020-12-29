import React from 'react';
import type { FC } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  AppBar,
  Box,
  Hidden,
  IconButton,
  Toolbar,
  makeStyles,
  Tooltip,
  SvgIcon
} from '@material-ui/core';
import { Menu as MenuIcon,  LogOut as LogOutIcon } from 'react-feather';
import Logo from 'src/components/Logo';
import { THEMES } from 'src/constants';
import type { Theme } from 'src/theme';
import Account from './Account';
import Contacts from './Contacts';
import Notifications from './Notifications';
import Search from './Search';
import { useHistory } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import Settings from './Settings';
import useAuth from 'src/hooks/useAuth';


interface TopBarProps {
  className?: string;
  onMobileNavOpen?: () => void;
}

const useStyles = makeStyles((theme: Theme) => {
  console.log("🚀 ~ file: index.tsx ~ line 31 ~ useStyles ~ theme", theme)
  return {
  root: {
    zIndex: theme.zIndex.drawer + 100,
    ...theme.name === THEMES.LIGHT ? {
      boxShadow: 'none',
      backgroundColor: theme.palette.primary.main
    } : {},
    ...theme.name === THEMES.ONE_DARK ? {
      backgroundColor: theme.palette.background.default
    } : {}
  },
  toolbar: {
    background: '#E55E28',
    minHeight: 64
  }
}
});

const TopBar: FC<TopBarProps> = ({
  className,
  onMobileNavOpen,
  ...rest
}) => {
  const classes = useStyles();

  const {  logout } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();



  const handleLogout = async (): Promise<void> => {
    try {
      await logout();
      history.push('/');
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Unable to logout', {
        variant: 'error'
      });
    }
  };

  return (
    <AppBar
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Toolbar className={classes.toolbar}>
        <Hidden lgUp>
          <IconButton
            color="inherit"
            onClick={onMobileNavOpen}
          >
            <SvgIcon fontSize="small">
              <MenuIcon />
            </SvgIcon>
          </IconButton>
        </Hidden>
        <Hidden mdDown>
          <RouterLink to="/">
            <Logo />
          </RouterLink>
        </Hidden>
        <Box
          ml={2}
          flexGrow={1}
        />
        <Search />
        <Contacts />
        <Notifications />
        <Settings />
        <Box ml={2}>
        <Tooltip title="Log off">
        <IconButton
          color="inherit"
          onClick={handleLogout}
        >
          <SvgIcon>
            <LogOutIcon />
          </SvgIcon>
        </IconButton>
      </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

TopBar.propTypes = {
  className: PropTypes.string,
  onMobileNavOpen: PropTypes.func
};

TopBar.defaultProps = {
  onMobileNavOpen: () => {}
};

export default TopBar;
