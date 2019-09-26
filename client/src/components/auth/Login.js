import React, {Fragment, useState} from 'react';
import {Link} from 'react-router-dom';
import {isEmpty, isEmail, isLength} from 'validator';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUser} from '@fortawesome/free-solid-svg-icons';

const Login = () => {
	const [formData, setFormData] = useState({
		email: '',
		password: ''
	});

	const [errors, setErrors] = useState({
		email: null,
		password: null
	});

	const {email, password} = formData;

	const onChange = e =>
		setFormData({...formData, [e.target.name]: e.target.value});

	const validateForm = ({email, password}) => {
		let hasError = false;
		setErrors({
			email: null,
			password: null
		});

		if (!email || isEmpty(email.trim())) {
			setErrors({...errors, email: 'Email is required'});
			hasError = true;
		} else if (!isEmail(email)) {
			setErrors({...errors, email: 'Please enter a valid email'});
			hasError = true;
		}

		if (!password || isEmpty(password.trim())) {
			setErrors({...errors, password: 'Password is required'});
			hasError = true;
		} else if (!isLength(password, {min: 8})) {
			setErrors({
				...errors,
				password: 'Password must be at least 8 characters long'
			});
			hasError = true;
		}

		return hasError;
	};

	const onSubmit = e => {
		e.preventDefault();
		if (!validateForm(formData)) {
			console.log('Form valid');
		} else {
			console.log('Form invalid');
		}
	};

	return (
		<Fragment>
			<div className="alert alert-danger">Invalid credentials</div>
			<h1 className="large text-primary">Sign In</h1>
			<p className="lead">
				<FontAwesomeIcon icon={faUser} /> Sign into Your Account
			</p>
			<form className="form" onSubmit={onSubmit}>
				<div className="form-group">
					<input
						type="email"
						placeholder="Email Address"
						name="email"
						value={email}
						onChange={onChange}
						required
					/>
					<span className="text-danger">
						{errors.email ? errors.email : null}
					</span>
				</div>

				<div className="form-group">
					<input
						type="password"
						placeholder="Password"
						name="password"
						value={password}
						onChange={onChange}
						required
					/>
					<span className="text-danger">
						{errors.email ? errors.password : null}
					</span>
				</div>
				<input type="submit" className="btn btn-primary" value="Login" />
			</form>
			<p className="my-1">
				Don't have an account? <Link to="/register">Sign Up</Link>
			</p>
		</Fragment>
	);
};

export default Login;
