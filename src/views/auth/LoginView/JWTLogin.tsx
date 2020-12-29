import React from 'react';
import type { FC } from 'react';
import clsx from 'clsx';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import {
  Box,
  Button,
  FormHelperText,
  TextField,
  makeStyles,
  Divider,
  Typography, Link
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import type { Theme } from 'src/theme';
import { Link as RouterLink } from 'react-router-dom';


import useAuth from 'src/hooks/useAuth';
import useIsMountedRef from 'src/hooks/useIsMountedRef';

interface JWTLoginProps {
  className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  googleButton: {
    backgroundColor: theme.palette.common.white
  },
  providerIcon: {
    marginRight: theme.spacing(2)
  },
  divider: {
    flexGrow: 1
  },
  dividerText: {
    margin: theme.spacing(2)
  }
}));

const JWTLogin: FC<JWTLoginProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  const { login } = useAuth() as any;
  const isMountedRef = useIsMountedRef();

  return (
    <Formik
      initialValues={{
        email: 'demo@demo.com',
        password: 'Password123',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
        password: Yup.string().max(255).required('Password is required')
      })}
      onSubmit={async (values, {
        setErrors,
        setStatus,
        setSubmitting
      }) => {
        try {
          await login(values.email, values.password);

          if (isMountedRef.current) {
            setStatus({ success: true });
            setSubmitting(false);
          }
        } catch (err) {
          console.error(err);
          if (isMountedRef.current) {
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
          }
        }
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values
      }) => (
        <form
          noValidate
          onSubmit={handleSubmit}
          className={clsx(classes.root, className)}
          {...rest}
        >
          <TextField
            error={Boolean(touched.email && errors.email)}
            fullWidth
            autoFocus
            helperText={touched.email && errors.email}
            label="Email Address"
            margin="normal"
            name="email"
            onBlur={handleBlur}
            onChange={handleChange}
            type="email"
            value={values.email}
            variant="outlined"
          />
          <TextField
            error={Boolean(touched.password && errors.password)}
            fullWidth
            helperText={touched.password && errors.password}
            label="Password"
            margin="normal"
            name="password"
            onBlur={handleBlur}
            onChange={handleChange}
            type="password"
            value={values.password}
            variant="outlined"
          />
          {errors.submit && (
            <Box mt={3}>
              <FormHelperText error>
                {errors.submit}
              </FormHelperText>
            </Box>
          )}
          <Box mt={2}>
            <Button
              color="secondary"
              disabled={isSubmitting}
              fullWidth
              size="large"
              type="submit"
              variant="contained"
            >
              Log In
            </Button>
          </Box>
          <Box
            alignItems="center"
            display="flex"
            mt={2}
          >
            <Divider
              className={classes.divider}
              orientation="horizontal"
            />
            <Typography
              color="textSecondary"
              variant="body1"
              className={classes.dividerText}
            >
              OR
        </Typography>
            <Divider
              className={classes.divider}
              orientation="horizontal"
            />
          </Box>
          <Button
            className={classes.googleButton}
            fullWidth
            onClick={() => { }}
            size="large"
            variant="contained"
          >
            <img
              alt="Google"
              className={classes.providerIcon}
              src="/static/images/google.svg"
            />
    Sign in with Google
  </Button>
          <Box mt={2}>

            <Typography
              variant="body2"
              color="textSecondary"
            >
              <Link
                component={RouterLink}
                to="/register"
                variant="body2"
                color="textSecondary"
              >
                Forgot Password?
            </Link>
            </Typography>
          </Box>
          <Box mt={2}>
            <Alert
              severity="info"
            >
              <div>
                Use
                {' '}
                <b>demo@demo.com</b>
                {' '}
                and password
                {' '}
                <b>Password123</b>
              </div>
            </Alert>
          </Box>
        </form>
      )}
    </Formik>
  );

};

JWTLogin.propTypes = {
  className: PropTypes.string,
};

export default JWTLogin;
