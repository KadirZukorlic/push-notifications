import { useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, View, Button } from 'react-native'
import * as Notifications from 'expo-notifications'

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: false,
		shouldSetBadge: false
	})
})

export default function App() {
	useEffect(() => {
		const subscription1 = Notifications.addNotificationReceivedListener(
			(notification) => {
				console.log('NOTIFICATION RECIEVED')
				console.log(notification)
				const userName = notification.request.content.data.userName
				console.log(userName)
			}
		)

		const subscription2 = Notifications.addNotificationResponseReceivedListener(
			(response) => {
				console.log('NOTIFICATIONS RESPONSE RECIEVED')
				const userName = response.notification.request.content.data.userName
				console.log(userName)
				console.log(response)
			}
		)

		return () => {
			subscription1.remove()
			subscription2.remove()
		}
	}, [])

	function scheduleNotificationHandler() {
		Notifications.scheduleNotificationAsync({
			content: {
				title: 'My first local notification',
				body: 'This is the body of the notification.',
				data: {
					userName: 'Hamza'
				}
			},
			trigger: {
				seconds: 5
			}
		})
	}

	return (
		<View style={styles.container}>
			<Button
				title="Schedule Notification"
				onPress={scheduleNotificationHandler}
			/>
			<StatusBar style="auto" />
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center'
	}
})
