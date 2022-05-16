import React from 'react';
import {Avatar, Typography} from 'antd';
import styled from 'styled-components';
import {formatRelative} from 'date-fns/esm';
import {MessageType} from "./ChatWindow";

const FileIcon = require('../../assets/file.svg').default;
const CloudIcon = require('../../assets/cloud-down.svg').default;

const WrapperStyled = styled.div`
  margin-bottom: 10px;

  .author {
    margin-left: 5px;
    font-weight: bold;
  }

  .date {
    margin-left: 10px;
    font-size: 11px;
    color: #a7a7a7;
  }

  .content {
    margin-left: 30px;
  }
`;

function formatDate(seconds){
	let formattedDate = '';
	
	if (seconds) {
		formattedDate = formatRelative(new Date(seconds * 1000), new Date());
		
		formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
	}
	
	return formattedDate;
}

export default function Message({text, displayName, createdAt, photoURL, fileType, fileUrl, fileName, isMe}){
	return (<WrapperStyled>
		<div>
			<Avatar size='small' src={photoURL}>
				{photoURL ? '' : displayName?.charAt(0)?.toUpperCase()}
			</Avatar>
			<Typography.Text className='author'>{displayName}</Typography.Text>
			<Typography.Text className='date'>{isMe ? '(Bạn)' : ''}</Typography.Text>
			<Typography.Text className='date'>{formatDate(createdAt?.seconds)}</Typography.Text>
			{fileType === MessageType.TEXT ?
				null
				: (<div style={{marginTop: 16}}>
					<a id='download-file' style={{marginLeft: 8}} href={fileUrl} download>
							<span
								style={{border: '1px solid #dbdbdb', backgroundColor: '#ededed', padding: 8, borderRadius: 8}}>
							<img style={{marginRight: 8}} src={FileIcon} alt="file" width='20' height='20'/>
						
							<span>{fileName}</span>
							
							<img style={{marginLeft: 8}} src={CloudIcon} alt="file" width='20' height='20'/>
						</span>
					</a>
				
				</div>)}
		
		</div>
		<div>
			<Typography.Text className='content'>{text}</Typography.Text>
		</div>
	</WrapperStyled>);
}
