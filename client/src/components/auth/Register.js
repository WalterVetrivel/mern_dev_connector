import React, {Fragment, useState} from 'react';
import {Link} from 'react-router-dom';
import {isEmpty, isEmail, isLength, isAlpha} from 'validator';

const Register = () => {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		password2: ''
	});

	const [errors, setErrors] = useState({
		name: null,
		email: null,
		password: null,
		password2: null
	});

	const {name, email, password, password2} = formData;

	const onChange = e =>
		setFormData({...formData, [e.target.name]: e.target.value});

	const validateForm = ({name, email, password, password2}) => {
		let hasError = false;
		setErrors({
			name: null,
			email: null,
			password: null,
			password2: null
		});

		if (!name || isEmpty(name.trim())) {
			setErrors({...errors, name: 'Name is required'});
			hasError = true;
		} else if (!isAlpha(name)) {
			setErrors({...errors, name: 'Name must contain only letters'});
			hasError = true;
		}

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

		if (password !== password2) {
			setErrors({...errors, password2: 'The passwords must match'});
			hasError = true;
		}

		return hasError;
	};

	const onSubmit = async e => {
		e.preventDefault();
		if (!validateForm(formData)) {
			console.log('Form valid');
		} else {
			console.log('Form invalid');
		}
	};

	return (
		<Fragment>
			<h1 className="large text-primary">Sign Up</h1>
			<p className="lead">
				<i className="fas fa-user"></i> Create Your Account
			</p>
			<form className="form" onSubmit={onSubmit}>
				<div className="form-group">
					<input
						type="text"
						placeholder="Name"
						name="name"
						value={name}
						onChange={onChange}
						required
					/>
					<span className="text-danger">
						{errors.name ? errors.name : null}
					</span>
				</div>
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
					<small className="form-text">
						This site uses Gravatar so if you want a profile image, use a
						Gravatar email
					</small>
				</div>
				<div className="form-group">
					<input
						type="password"
						placeholder="Password"
						name="password"
						minLength="8"
						value={password}
						onChange={onChange}
						required
					/>
					<span className="text-danger">
						{errors.password || errors.password2
							? errors.password || errors.password2
							: null}
					</span>
				</div>
				<div className="form-group">
					<input
						type="password"
						placeholder="Confirm Password"
						name="password2"
						minLength="8"
						value={password2}
						onChange={onChange}
						required
					/>
					<span className="text-danger">
						{errors.password2 ? errors.password2 : null}
					</span>
				</div>
				<input type="submit" className="btn btn-primary" value="Register" />
			</form>
			<p className="my-1">
				Already have an account? <Link to="/login">Sign In</Link>
			</p>
		</Fragment>
	);
};

export default Register;
