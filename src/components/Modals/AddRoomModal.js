import React, {useContext} from 'react';
import {Form, Modal, Input} from 'antd';
import {AppContext} from '../../Context/AppProvider';
import {addDocument} from '../../firebase/services';
import {AuthContext} from '../../Context/AuthProvider';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AddRoomModal(){
	const {isAddRoomVisible, setIsAddRoomVisible} = useContext(AppContext);
	const {
		user: {uid},
	} = useContext(AuthContext);
	const [form] = Form.useForm();
	
	const handleOk = async () => {
		// handle logic
		// add new room to firestore
		
		let {name, description} = form.getFieldsValue();
		console.log(name);
		console.log(description);
		
		if (description == null) description = '';
		
		if (name == null) {
			toast("Vui lòng nhập tên phòng chat");
			return;
		}
		await addDocument('rooms', {name: name, description: description, members: [uid]});
		
		// reset form values
		form.resetFields();
		
		setIsAddRoomVisible(false);
	};
	
	const handleCancel = () => {
		// reset form value
		form.resetFields();
		
		setIsAddRoomVisible(false);
	};
	
	return (
		<div>
			<Modal
				title='Tạo phòng'
				visible={isAddRoomVisible}
				onOk={handleOk}
				onCancel={handleCancel}
			>
				<Form form={form} layout='vertical'>
					<Form.Item label='Tên phòng' name='name'>
						<Input placeholder='Nhập tên phòng'/>
					</Form.Item>
					<Form.Item label='Mô tả' name='description'>
						<Input.TextArea placeholder='Nhập mô tả'/>
					</Form.Item>
				</Form>
			</Modal>
			<ToastContainer/>
		</div>
	);
}
