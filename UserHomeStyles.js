import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

// Define COLORS directly here
const COLORS = {
  background: '#F8F3D9',
  primary: '#A76545',
  primaryDark: '#8B5E3C',
  text: '#5A3B28',
  accent: '#D8BFAA',
  danger: '#D9534F',
  white: '#FFFFFF',
  border: '#E0D6C3',
};

export const UserHomeStyles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    paddingBottom: 30,
    paddingTop: 0,
    position: 'relative',
  },
  logo: {
    position: 'absolute',
    top: 15,
    left: 5,
    width: 100,
    height: 100,
    resizeMode: 'contain',
    zIndex: 2,
  },
  headerTextContainer: {
    position: 'absolute',
    top: 25,
    left: 100,
    right: 10,
    alignItems: 'flex-start',
    zIndex: 1,
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: COLORS.primary,
    fontFamily: 'Tagesschrift',
  },
  subHeaderText: {
    fontSize: 20,
    color: COLORS.primary,
    marginTop: 1,
  },
  hamburgerContainer: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
  },
  buttonGroupContainer: {
    paddingHorizontal: 15,
    marginTop: 10,
    
    
  },
  button: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginHorizontal:'20',
  },
  sectionHeading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginLeft:30,
    marginTop: 20,
    marginBottom: 10,
  },
  
  chatbotButton: {
    backgroundColor: '#AFDDFF',
  },
  sosButton: {
    backgroundColor: '#FF6B6B',
  },
  challengeButton: {
    backgroundColor: '#FFD166',
  },
  storyButton: {
    backgroundColor: '#B5EAD7',
  },
  scheduleButton: {
    backgroundColor: '#CBAACB',
  },
  buttonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 40,
  },
  icon: {
    width: 35,
    height: 35,
  },
  gridContainer: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  squareButton: {
    width: '47%',
    aspectRatio: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  gridImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginBottom: 10,
  },
  gridText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
  },
  qotdContainer: {
    backgroundColor: '#F8F3D9',
    margin: 12,  // Reduced margin for a smaller container
    padding: 12,  // Reduced padding for a smaller container
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.25,  // Keep the shadow opacity for depth
    shadowRadius: 8,  // Keep the shadow radius for visibility
    elevation: 5,  // Maintain elevation for Android shadow
    borderWidth: 2,  // Keep the border for contrast
    borderColor: '#FFD166',  // Keep the border color for consistency
    transform: [{ scale: 1.02 }],  // Slight scaling to make it appear slightly larger (reduced scale)
  },
  
  qotdQuestion: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  qotdOption: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#a76545',
  },
  qotdOptionText: {
    fontSize: 14,
    color: '#000000',
  },
  qotdHeaderContainer: {
    flexDirection: 'row',  // Align the icon and text in a row
    alignItems: 'center',  // Vertically center the icon and text
    marginBottom: 12,  // Space between the icon-text row and the next content
  },
  
  qotdIcon: {
    width: 24,  // Set width of the icon
    height: 24,  // Set height of the icon
    marginRight: 8, 
    marginBottom:'-40', // Space between the icon and the text
  },
  
  

});
