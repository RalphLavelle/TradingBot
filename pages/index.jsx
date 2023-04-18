import styles from '../components/layout.module.scss';
import { useEffect, useState } from 'react';
import Dashboard from './dashboard'; 

function Index() {

	const emptyForm = { username: '', password: '' };
    const [formData, setFormData] = useState(emptyForm);
	const [message, setMessage] = useState(null);
	const [step, setStep] = useState(1);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

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
		const success = await response.json();
		return success;
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		setMessage(null);
		setError(null);
		setLoading(true);
		if(step === 1) {
			const user = await getUser(`password=${formData.password}`);
			if(user) {
				await fetch(`/api/users/${formData.username}?action=generateCode`, {
					method: 'GET'
				});
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
			const user = await getUser(`code=${formData.code}`);
			debugger;
			if(user) {
				setStep(3);
			} else {
				setError(`Incorrect code.`);
			}
			setLoading(false);
		}
	};

    return (
		<>
			<div className={styles.index}>
				<h1>Bot Controller</h1>
				<form onSubmit={handleSubmit}>
					<div className={styles.username}>
						<label>Username</label>
						<input id="username" name="username" type="text" placeholder="Username" required onChange={handleInputChange} />
					</div>
					<div className={styles.password}>
						<label>Password</label>
						<input id="password" name="password" type="text" placeholder="Password" required onChange={handleInputChange} />
					</div>
					{ step === 2 ?
						<>
							<div className={styles.info}>
								<p>Please check your email for a verification code.</p>
							</div>
							<div className={styles.code}>
								<label>Code</label>
								<input id="code" name="code" type="text" placeholder="Verification code" required onChange={handleInputChange} />
							</div>
						</>
					: null }
					<button type="submit">
						{ !loading ? "Login" : <img src="/images/spinner.svg" alt="Loading" width="32" height="32" /> }
					</button>
					{ error ? <div className={styles.error}>{error}</div> : null }
				</form>
				{ message ? <div className={styles.message}>{message}</div> : null }
			</div>
			{ step === 3 ? <Dashboard></Dashboard> : null }
		</>
	);
}

export default Index;