import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import 'react-native-reanimated';
export { ErrorBoundary } from 'expo-router';
import { ClerkProvider, useAuth, ClerkLoaded } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';
import { SafeAreaView } from 'react-native-safe-area-context';

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

const tokenCache = {
	async getToken(key: string) {
		try {
			return SecureStore.getItemAsync(key);
		} catch (err) {
			return null;
		}
	},
	async saveToken(key: string, token: string) {
		try {
			SecureStore.setItemAsync(key, token);
		} catch (err) {}
	},
};

export const unstable_settings = {
	// Ensure that reloading on `/modal` keeps a back button present.
	initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [loaded, error] = useFonts({
		mon: require('../assets/fonts/Montserrat-Regular.ttf'),
		'mon-sb': require('../assets/fonts/Montserrat-SemiBold.ttf'),
		'mon-b': require('../assets/fonts/Montserrat-Bold.ttf'),
	});

	// Expo Router uses Error Boundaries to catch errors in the navigation tree.
	useEffect(() => {
		if (error) throw error;
	}, [error]);

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	return (
		<ClerkProvider
			publishableKey={CLERK_PUBLISHABLE_KEY!}
			tokenCache={tokenCache}
		>
			<RootLayoutNav />
		</ClerkProvider>
	);
}

function RootLayoutNav() {
	const router = useRouter();
	const { isLoaded, isSignedIn } = useAuth();

	useEffect(() => {
		if (isLoaded && !isSignedIn) {
			router.push('/(modals)/login');
		}
	}, [isLoaded, isSignedIn]);
	return (
		<Stack>
			<Stack.Screen
				name="(tabs)"
				options={{
					headerShown: false,
					headerTransparent: true,
					headerTitle: '',
				}}
			/>
			<Stack.Screen
				name="(modals)/login"
				options={{
					title: 'Log in or Sign up',
					headerTitleStyle: { fontFamily: 'mon-sb' },
					presentation: 'modal',
					headerLeft: () => (
						<TouchableOpacity onPress={() => router.back()}>
							<Ionicons name="close" size={24} color="black" />
						</TouchableOpacity>
					),
				}}
			/>
			<Stack.Screen
				name="listing/[id]"
				options={{ headerTitle: '', headerTransparent: true }}
			/>
			<Stack.Screen
				name="(modals)/booking"
				options={{
					presentation: 'transparentModal',
					animation: 'fade',
					headerLeft: () => (
						<TouchableOpacity onPress={() => router.back()}>
							<Ionicons name="close" size={24} color="black" />
						</TouchableOpacity>
					),
				}}
			/>
		</Stack>
	);
}
