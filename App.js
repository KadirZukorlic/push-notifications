import { useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, View, Button, Alert, Platform } from 'react-native'
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
		async function configurePushNotifications() {
			const { status } = await Notifications.getPermissionsAsync()
			let finalStatus = status

			if (finalStatus !== 'granted') {
				const { status } = await Notifications.requestPermissionsAsync()
				finalStatus = status
			}

			if (finalStatus !== 'granted') {
				Alert.alert(
					'Permission Required',
					'Push notifications need the appropriate permissions.'
				)
				return
			}

			const pushTokenData = await Notifications.getExpoPushTokenAsync()
			console.log(pushTokenData)

			if (Platform.OS === 'android') {
				Notifications.setNotificationChannelAsync('default', {
					name: 'default',
					importance: Notifications.AndroidImportance.DEFAULT,
					vibrationPattern: [0, 250, 250, 250],
					lightColor: '#FF231F7C'
				})
			}
		}

		configurePushNotifications()
	}, [])

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

	function sendPushNotificationHandler() {
		const expoPushToken = 'here goes epxoPushToken'

		const message = {
			to: expoPushToken, // demo
			sound: 'default',
			title: 'Original Title',
			body: 'And here is the body!',
			data: { someData: 'goes here' }
		}

		 fetch('https://exp.host/--/api/v2/push/send', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Accept-encoding': 'gzip, deflate',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(message)
		})
	}

	return (
		<View style={styles.container}>
			<Button
				title="Schedule Notification"
				onPress={scheduleNotificationHandler}
			/>
			<Button
				title="Send Push Notification"
				onPress={sendPushNotificationHandler}
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
