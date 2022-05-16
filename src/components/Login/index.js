import React from 'react';
import {Row, Col, Button, Typography} from 'antd';
import firebase, {auth, db} from '../../firebase/config';
import {addDocument, generateKeywords} from '../../firebase/services';
const LaucherIcon = require('../../assets/ic_laucher.png');
const {Title} = Typography;

const fbProvider = new firebase.auth.FacebookAuthProvider();
const googleProvider = new firebase.auth.GoogleAuthProvider();

export default function Login(){
	const handleLogin = async (provider) => {
		const {additionalUserInfo, user} = await auth.signInWithPopup(provider);
		let users = await db
			.collection('users')
			.where('email', '==', additionalUserInfo?.profile.email)
			.limit(1)
			.get();
		console.log(users.docs.length);
		if (users.docs.length === 0) {
			addDocument('users', {
				displayName: user.displayName,
				email: user.email,
				photoURL: user.photoURL,
				uid: user.uid,
				providerId: additionalUserInfo.providerId,
				keywords: generateKeywords(user.displayName?.toLowerCase()),
			});
		}
	};
	
	return (
		<div style={{backgroundColor: '#9900ff', height: '100vh',display:"flex", justifyContent: "center",alignItems: 'center'}}>
			
			
			<div style={{
				width: 500,
				height: 300,
				padding: 32,display:"flex", justifyContent: "center",alignItems: 'center',
				backgroundColor: "white",
				borderRadius: 4,
				flexDirection:'column'
			}}>
				<img style={{marginLeft: 8, marginRight: 8, marginBottom: 16}} src={LaucherIcon} width='100' height='100'/>
				
				<Title style={{textAlign: 'center', color: '#9900ff'}} level={3}>ĐĂNG NHẬP</Title>
				
				<div style={{marginTop:30,flexDirection:'row',justifyContent:'space-between'}}>
					<Button
						style={{marginLeft:16}}
						onClick={() => handleLogin(googleProvider)}
					>
						Đăng nhập bằng Google
					</Button>
					<Button
						style={{marginLeft: 16}}
						onClick={() => handleLogin(fbProvider)}
					>
						Đăng nhập bằng Facebook
					</Button>
				</div>
			</div>
		</div>
	);
}
