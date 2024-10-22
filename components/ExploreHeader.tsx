import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	ScrollView,
} from 'react-native';
import React, { useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import * as Haptics from 'expo-haptics';

const categories = [
	{
		name: 'Tiny homes',
		icon: 'home',
	},
	{
		name: 'Cabins',
		icon: 'house-siding',
	},
	{
		name: 'Trending',
		icon: 'local-fire-department',
	},
	{
		name: 'Play',
		icon: 'videogame-asset',
	},
	{
		name: 'City',
		icon: 'apartment',
	},
	{
		name: 'Beach',
		icon: 'beach-access',
	},
	{
		name: 'Country',
		icon: 'nature-people',
	},
];

interface Props {
	onCategoryChanged: (category: string) => void;
}

const ExploreHeader = ({ onCategoryChanged }: Props) => {
	const scrollRef = useRef<ScrollView>(null);
	const itemsRef = useRef<Array<TouchableOpacity | null>>([]);
	const [activeIndex, setActiveIndex] = useState(0);
	const selectCategory = (index: number) => {
		const selectedItem = itemsRef.current[index];
		selectedItem?.measure((x) => {
			scrollRef.current?.scrollTo({
				x,
				y: 0,
				animated: true,
			});
		});
		setActiveIndex(index);
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		onCategoryChanged(categories[index].name);
	};
	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
			<View style={styles.container}>
				<View style={styles.actionRow}>
					<Link href={'/(modals)/booking'} asChild>
						<TouchableOpacity style={styles.searchButton}>
							<Ionicons name="search" size={24} color="black" />
							<View>
								<Text style={{ fontFamily: 'mon-sb', fontSize: 14 }}>
									Where to?
								</Text>
								<Text
									style={{
										fontFamily: 'mon-r',
										fontSize: 12,
										color: Colors.grey,
									}}
								>
									Anywhere - Any week
								</Text>
							</View>
						</TouchableOpacity>
					</Link>
					<TouchableOpacity style={styles.filterButton}>
						<Ionicons name="options-outline" size={24} color="black" />
					</TouchableOpacity>
				</View>
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={{
						alignItems: 'center',
						gap: 30,
						paddingHorizontal: 16,
					}}
				>
					{categories.map((item, index) => (
						<TouchableOpacity
							onPress={() => selectCategory(index)}
							key={index}
							ref={(el) => {
								if (el) {
									itemsRef.current.push(el);
								}
							}}
							style={
								activeIndex === index
									? styles.categoriesButtonActive
									: styles.categoriesButton
							}
						>
							<MaterialIcons
								name={item.icon as any}
								size={24}
								color={activeIndex === index ? 'black' : Colors.grey}
							/>
							<Text
								style={
									activeIndex === index
										? styles.categoryTextActive
										: styles.categoryText
								}
							>
								{item.name}
							</Text>
						</TouchableOpacity>
					))}
				</ScrollView>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#fff',
		height: 130,
	},
	actionRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 24,
		paddingBottom: 16,
		gap: 10,
	},
	filterButton: {
		padding: 10,
		borderWidth: 1,
		borderColor: Colors.grey,
		borderRadius: 24,
	},
	searchButton: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10,
		flex: 1,
		padding: 14,
		borderColor: '#c2c2c2',
		borderRadius: 30,
		backgroundColor: '#fff',
		borderWidth: StyleSheet.hairlineWidth,
		width: 280,
		elevation: 2,
		shadowColor: '#000',
		shadowOffset: { width: 1, height: 1 },
		shadowOpacity: 0.12,
		shadowRadius: 0,
	},
	categoriesButton: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingBottom: 8,
	},
	categoriesButtonActive: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingBottom: 8,
		borderBottomWidth: 2,
		borderBottomColor: '#000',
	},
	categoryText: {
		fontSize: 14,
		fontFamily: 'mon-sb',
		color: Colors.grey,
	},
	categoryTextActive: {
		fontSize: 14,
		fontFamily: 'mon-sb',
		color: 'black',
	},
});

export default ExploreHeader;
