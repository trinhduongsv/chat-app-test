import {UserAddOutlined} from '@ant-design/icons';
import React, {useContext, useEffect, useRef, useState} from 'react';
import styled from 'styled-components';
import {Button, Tooltip, Avatar, Form, Alert} from 'antd';
import Message from './Message';
import {AppContext} from '../../Context/AppProvider';
import {addDocument} from '../../firebase/services';
import {AuthContext} from '../../Context/AuthProvider';
import useFirestore from '../../hooks/useFirestore';
import {storage} from "../../firebase/config";
import Picker from 'emoji-picker-react';


const FileIcon = require('../../assets/file.svg').default;
const XmarkIcon = require('../../assets/xmark-solid.svg').default;
const EmojiIcon = require('../../assets/face-grin-solid.svg').default;

const HeaderStyled = styled.div`
  display: flex;
  justify-content: space-between;
  height: 56px;
  padding: 0 16px;
  align-items: center;
  border-bottom: 1px solid rgb(230, 230, 230);

  .header {
    &__info {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    &__title {
      margin: 0;
      font-weight: bold;
    }

    &__description {
      font-size: 12px;
    }
  }
`;

const ButtonGroupStyled = styled.div`
  display: flex;
  align-items: center;
`;

const WrapperStyled = styled.div`
  height: 100vh;
`;

const ContentStyled = styled.div`
  height: calc(100% - 56px);
  display: flex;
  flex-direction: column;
  padding: 11px;
  justify-content: flex-end;
`;

const FormStyled = styled(Form)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 2px 2px 0;
  border: 1px solid rgb(230, 230, 230);
  border-radius: 2px;

  .ant-form-item {
    flex: 1;
    margin-bottom: 0;
  }
`;

const MessageListStyled = styled.div`
  max-height: 100%;
  overflow-y: auto;
`;

export const MessageType = {
	TEXT: 'text',
	IMAGE: 'image',
	FILE: 'file',
	
}

export default function ChatWindow(){
	const {selectedRoom, members, setIsInviteMemberVisible} =
		useContext(AppContext);
	const {
		user: {uid, photoURL, displayName},
	} = useContext(AuthContext);
	const [inputValue, setInputValue] = useState('');
	const [form] = Form.useForm();
	const inputRef = useRef(null);
	const messageListRef = useRef(null);
	
	const handleInputChange = (e) => {
		setInputValue(e.target.value);
	};
	
	const addMessage = (fileType, msg, {url, nameFile}) => {
		console.log('file name ' + nameFile);
		addDocument('messages', {
			text: msg,
			fileType: fileType,
			url: url === null ? '' : url,
			nameFile: nameFile === null ? '' : nameFile,
			uid,
			photoURL,
			roomId: selectedRoom.id,
			displayName,
		});
		
	}
	
	const handleOnSubmit = () => {
		upload();
		if (inputValue === '') return;
		addMessage(MessageType.TEXT, inputValue, {url: '', nameFile: ''});
		
		setInputValue('');
		// focus to input again after submit
		if (inputRef?.current) {
			setTimeout(() => {
				inputRef.current.focus();
			});
		}
	};
	
	const condition = React.useMemo(
		() => ({
			fieldName: 'roomId',
			operator: '==',
			compareValue: selectedRoom.id,
		}),
		[selectedRoom.id]
	);
	
	const messages = useFirestore('messages', condition);
	
	useEffect(() => {
		// scroll to bottom after message changed
		if (messageListRef?.current) {
			messageListRef.current.scrollTop =
				messageListRef.current.scrollHeight + 50;
		}
	}, [messages]);
	
	const [image, setImage] = useState([]);
	const upload = async () => {
		console.log(image);
		if (image.length === 0) return;
		
		for (let i = 0; i < image.length; i++) {
			let ext = image[i].name.substr(image[i].name.lastIndexOf('.') + 1);
			storage.ref(`/images/${Date.now()}.${ext}`).put(image[i]).then((snapshot, error) => {
				if (error) console.log(error);
				console.log(snapshot);
				snapshot.ref.getDownloadURL().then((data) => {
					addMessage(MessageType.FILE, '', {url: data, nameFile: image[i].name});
					deleteCurrentFile(image[i].name);
				});
				
			});
		}
		
	}
	
	const deleteCurrentFile = (name) => {
		const data = image.filter(i => i.name !== name);
		setImage(data);
	}
	
	const [isPickEmoji, setIsPickEmoji] = useState(false);
	
	const onEmojiClick = (event, emojiObject) => {
		const cursor = inputRef.current.selectionStart;
		
		const text = inputValue.slice(0, cursor) + emojiObject.emoji + inputValue.slice(cursor);
		setInputValue(text);
		
		const newCursor = cursor + emojiObject.emoji.length
		setTimeout(() => {
			inputRef.current.setSelectionRange(newCursor, newCursor);
			inputRef.current.focus();
		}, 0);
		
	};
	
	
	const callBackPress = (e) => {
		if (e.key === 'Enter') {
			handleOnSubmit();
		}
	}
	
	return (
		<WrapperStyled>
			{selectedRoom.id ? (
				<>
					<HeaderStyled>
						<div className='header__info'>
							<p className='header__title'>{selectedRoom.name}</p>
							<span className='header__description'>
                {selectedRoom.description}
              </span>
						</div>
						<ButtonGroupStyled>
							<Button
								icon={<UserAddOutlined/>}
								type='text'
								onClick={() => setIsInviteMemberVisible(true)}
							>
								Mời
							</Button>
							<Avatar.Group size='small' maxCount={2}>
								{members.map((member) => (
									<Tooltip title={member.displayName} key={member.id}>
										<Avatar src={member.photoURL}>
											{member.photoURL
												? ''
												: member.displayName?.charAt(0)?.toUpperCase()}
										</Avatar>
									</Tooltip>
								))}
							</Avatar.Group>
						</ButtonGroupStyled>
					</HeaderStyled>
					<ContentStyled>
						<MessageListStyled ref={messageListRef}>
							{messages.map((mes) => (
								<Message
									key={mes.id}
									text={mes.text}
									photoURL={mes.photoURL}
									displayName={mes.displayName}
									createdAt={mes.createdAt}
									fileType={mes.fileType}
									fileName={mes.nameFile}
									fileUrl={mes.url}
									isMe={mes.uid === uid}
								/>
							))}
						</MessageListStyled>
						{
							isPickEmoji ? <Picker onEmojiClick={onEmojiClick} pickerStyle={{width: '100%', height: "100%"}}
							                      disableSearchBar="true"/> : null
						}
						<div style={{
							
							backgroundColor: '#f1f1f1',
							alignContent: "center",
							padding: 8,
							display: image.length === 0 ? 'none' : 'inline'
						}}>
							{
								image.map((value, index, image) => <span style={{marginRight: 8}}>{value.name}
									
									<img style={{marginLeft: 8, marginRight: 8}} src={XmarkIcon} alt="Upload file" width='20'
									     height='20' onClick={() => deleteCurrentFile(value.name)}/>
									  |
								</span>)
							}
						</div>
						
						<FormStyled form={form}>
							<label htmlFor="myInput">
								<img style={{marginLeft: 8}} src={FileIcon} alt="Upload file" width='20' height='20'/>
							</label>
							<input type="file" id="myInput" multiple style={{display: 'none'}} onChange={(e) => {
								const tempArr = [];
								
								[...e.target.files].forEach(file => {
									console.log("file >>> ", file);
									
									tempArr.push(file);
									
								});
								setImage(tempArr);
							}}/>
							
							<input
								ref={inputRef}
								value={inputValue}
								onChange={handleInputChange}
								placeholder='Nhập tin nhắn...'
								type='text'
								onKeyPress={callBackPress}
								style={{border: "none", width: "96%", marginLeft: 8, outline: 'none'}}
							/>
							
							<img style={{marginRight: 8}} src={EmojiIcon} alt="Upload file" width='20' height='20'
							     onClick={() => {
								     setIsPickEmoji(!isPickEmoji);
							     }}/>
							
							<Button type='primary' onClick={handleOnSubmit}>
								Gửi
							</Button>
						</FormStyled>
					
					</ContentStyled>
				</>
			) : (
				<Alert
					message='Hãy chọn phòng'
					type='info'
					showIcon
					style={{margin: 5}}
					closable
				/>
			)}
		</WrapperStyled>
	);
}
