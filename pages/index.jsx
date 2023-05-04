import styles from '../components/layout.module.scss';
import { useEffect, useState } from 'react';
import Dashboard from './dashboard';
import QrCode from '../components/qrCode';

function Index() {

	const emptyForm = { username: '', password: '' };
	const [formData, setFormData] = useState(emptyForm);
	const [step, setStep] = useState(1);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [user, setUser] = useState(null);

	useEffect(() => {
		setStep(1);
	}, []);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
	};

	const getUser = async query => {
		const response = await fetch(`/api/users/${formData.username}?${query}`, {
			method: 'GET'
		});
		const results = await response.json();
		return results;
	}

	const checkUserCode = async () => {
		const response = await fetch(`/api/users/${formData.username}?action=checkCode`, {
			method: 'POST',
			body: JSON.stringify({
				code: formData.code
			})
		});
		const results = await response.json();
		return results;
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		setLoading(true);
		if (step === 1) {
			const results = await getUser(`password=${formData.password}`);
			if (results.success) {
				setUser(results.user);
				setStep(2);
				setError(null);
				setLoading(false);
			} else {
				setError('User not found, or incorrect password.');
				setLoading(false);
			}
		} else {
			// check verification code
			setLoading(true);
			const response = await checkUserCode();
			if (response.success) {
				setStep(3);
			} else {
				setError(`Incorrect code.`);
			}
			setLoading(false);
		}
	};

	return (
		<div className={styles.index}>
			<h1>Towerchain Bot Controller</h1>
			{step !== 3
				?
				<form onSubmit={handleSubmit}>
					<div className={styles.username}>
						<label>Username</label>
						<input id="username" name="username" type="text" placeholder="Username" required onChange={handleInputChange} />
					</div>
					<div className={styles.password}>
						<label>Password</label>
						<input id="password" name="password" type="text" placeholder="Password" required onChange={handleInputChange} />
					</div>
					{step === 2 ?
						!user.registered ? <QrCode user={user}></QrCode> : null
					: null }
					{step === 2 ?
						<>
							<div className={styles.info}>
								<p>Please enter a verification code.</p>
							</div>
							<div className={styles.code}>
								<label>Code</label>
								<input id="code" name="code" type="text" placeholder="Verification code" required onChange={handleInputChange} />
							</div>
						</>: null }
					<button type="submit">
						{!loading ? "Login" : <img src="/images/spinner.svg" alt="Loading" width="32" height="32" />}
					</button>
					{error ? <div className={styles.error}>{error}</div> : null}
				</form>
				: <Dashboard></Dashboard>
			}
		</div>
	);
}

export default Index;