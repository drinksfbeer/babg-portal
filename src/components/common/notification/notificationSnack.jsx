import React from 'react'

const NEW_ITEM_STATUS_MESSAGES = {
	success:'Successfully Created Item',
	error:'Error Occurred Creating Item',
}
const UPDATE_ITEM_STATUS_MESSAGES = {
	success:'Successfully Updated Item',
	error:'Error Occured Updating Item'
}

class NotificationSnackBar extends React.Component {
	state = {
		active:true
	}

	render(){
		const {
			message,
			status="success", //can be success or error, if none will use default backround color
			isNew=true
		} = this.props;

		const {active} = this.state;
		const _message = message || isNew ? NEW_ITEM_STATUS_MESSAGES[status] : UPDATE_ITEM_STATUS_MESSAGES[status] || 'Successful Action'

		return (
			<div
				className="animated fadeInDown"
				onClick={() => this.setState({active:false})}
				style={{
					cursor:'pointer',
					position:"fixed",
					top:'1rem',
					right:'1rem',
					borderRadius:'3px',
					backgroundColor:"#0ec4af",
					padding:'1rem',
					color:"white",
					boxShadow: '0 0 1px 1px rgba(10, 10, 11, .125)',
					fontWeight:'700',
					display:active ? 'flex' : 'none',
					alignItems:'center'
				}}
			>
				<span
					style={{marginRight:15}}
				>
					{_message}
				</span>
				<span
					style={{fontSize:"150%"}}
				>
					&times;
				</span>
			</div>
		)
	}
}



export default NotificationSnackBar
