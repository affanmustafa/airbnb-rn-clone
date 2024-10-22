import {
	View,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	Text,
} from 'react-native';
import React from 'react';
import { useWarmUpBrowser } from '@/hooks/useWarmUpBrowser';
import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { Ionicons } from '@expo/vector-icons';
import { useOAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

enum Strategy {
	GOOGLE = 'oauth_google',
	APPLE = 'oauth_apple',
	FACEBOOK = 'oauth_facebook',
}

const Login = () => {
	useWarmUpBrowser();
	const router = useRouter();
	const { startOAuthFlow: startOAuthFlowGoogle } = useOAuth({
		strategy: Strategy.GOOGLE,
	});
	const { startOAuthFlow: startOAuthFlowApple } = useOAuth({
		strategy: Strategy.APPLE,
	});
	const { startOAuthFlow: startOAuthFlowFacebook } = useOAuth({
		strategy: Strategy.FACEBOOK,
	});

	const onSelectAuth = async (strategy: Strategy) => {
		const selectedAuth = {
			[Strategy.GOOGLE]: startOAuthFlowGoogle,
			[Strategy.APPLE]: startOAuthFlowApple,
			[Strategy.FACEBOOK]: startOAuthFlowFacebook,
		}[strategy];

		try {
			const { createdSessionId, setActive } = await selectedAuth();
			if (createdSessionId) {
				setActive!({ session: createdSessionId });
				router.back();
			}
		} catch (error) {
			console.error('OAuth Error: ', error);
		}
	};

	return (
		<View style={styles.container}>
			<TextInput
				autoCapitalize="none"
				autoCorrect={false}
				placeholder="Email"
				style={[defaultStyles.inputField, { marginBottom: 30 }]}
			/>
			<TouchableOpacity style={defaultStyles.btn}>
				<Text style={defaultStyles.btnText}>Continue</Text>
			</TouchableOpacity>
			<View style={styles.seperatorView}>
				<View
					style={{
						flex: 1,
						borderBottomColor: '#000000',
						borderBottomWidth: StyleSheet.hairlineWidth,
					}}
				/>
				<Text style={styles.seperator}>OR</Text>
				<View
					style={{
						flex: 1,
						borderBottomColor: '#000000',
						borderBottomWidth: StyleSheet.hairlineWidth,
					}}
				/>
			</View>
			<View style={{ gap: 10 }}>
				<TouchableOpacity style={styles.btnOutline}>
					<Ionicons
						name="call-outline"
						style={defaultStyles.btnIcon}
						size={24}
					/>
					<Text style={styles.btnOutlineText}>Continue with Phone</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.btnOutline}
					onPress={() => onSelectAuth(Strategy.APPLE)}
				>
					<Ionicons name="logo-apple" style={defaultStyles.btnIcon} size={24} />
					<Text style={styles.btnOutlineText}>Continue with Apple</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.btnOutline}
					onPress={() => onSelectAuth(Strategy.GOOGLE)}
				>
					<Ionicons
						name="logo-google"
						style={defaultStyles.btnIcon}
						size={24}
					/>
					<Text style={styles.btnOutlineText}>Continue with Google</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.btnOutline}
					onPress={() => onSelectAuth(Strategy.FACEBOOK)}
				>
					<Ionicons
						name="logo-facebook"
						style={defaultStyles.btnIcon}
						size={24}
					/>
					<Text style={styles.btnOutlineText}>Continue with Facebook</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		padding: 26,
	},

	seperatorView: {
		flexDirection: 'row',
		gap: 10,
		alignItems: 'center',
		marginVertical: 30,
	},
	seperator: {
		fontFamily: 'mon-sb',
		color: Colors.grey,
		fontSize: 16,
	},
	btnOutline: {
		backgroundColor: '#fff',
		borderWidth: 1,
		borderColor: Colors.grey,
		height: 50,
		borderRadius: 8,
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
		paddingHorizontal: 10,
	},
	btnOutlineText: {
		color: '#000',
		fontSize: 16,
		fontFamily: 'mon-sb',
	},
});

export default Login;
