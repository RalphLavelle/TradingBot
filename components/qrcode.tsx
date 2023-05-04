import { useEffect, useState } from "react";
import QRCode from 'qrcode';
import { authenticator } from 'otplib';
import styles from './layout.module.scss';

function QrCode({user}) {

	const [qrUrl, setQrUrl] = useState('');

	useEffect(() => {
		const secret = authenticator.generateSecret();
		saveSecretAndGenerateQRCode(secret);
	}, []);

	const saveSecretAndGenerateQRCode = async (secret) => {
		await saveCode(secret);
		QRCode.toDataURL(authenticator.keyuri(user.email, 'Towerchain Bot Controller', secret), (err, url) => {
			if (err) {throw err }
			setQrUrl(url);
		  });
	};

	const saveCode = async code => {
		const response = await fetch(`/api/users/${user.username}?action=saveCode`, {
			method: 'POST',
			body: JSON.stringify({ code })
		});
		const results = await response.json();
		return results;
	}

	return (
		<div className={styles.qrcode}>
			<p>Please scan this QR code, then enter the code you see in your authenticator</p>
			{ qrUrl ? <img src={qrUrl} /> : <img src="/images/spinner.svg" alt="Loading" width="32" height="32" /> }
		</div>
	)

}

export default QrCode;