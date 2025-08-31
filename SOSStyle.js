import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const SOSStyle = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#ffe4e4',
  },
  title: { 
    fontSize: 26, 
    fontWeight: 'bold', 
    color: '#D32F2F',
    marginBottom: 20, 
    alignSelf: 'center' 
  },
  input: {
    borderWidth: 1,
    borderColor: '#FF6B6B',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#FFB1B1',
  },
  addButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  addButtonText: { 
    color: '#fff',
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#FF6B6B',
  },
  contactText: { 
    fontSize: 16, 
    color: '#C2185B',
  },
  deleteText: { 
    color: '#D32F2F',
    fontWeight: 'bold' 
  },
  sosButtonContainer: {
    position: 'absolute',
    top: height / 2 - 60, // Center vertically (assuming button is 120x120)
    left: width / 2 - 60, // Center horizontally
    justifyContent: 'center',
    alignItems: 'center',
  },
  sosButton: {
    backgroundColor: '#D32F2F',
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    marginBottom: 175,
    marginLeft: 95,
  },
  sosButtonText: { 
    color: '#fff',
    fontSize: 20, 
    fontWeight: 'bold',
    textAlign: 'center',
  },
  locationText: {
    color: '#D32F2F'
  },
  stopButton: {
    backgroundColor: '#D32F2F',
    paddingVertical: 16,
    paddingHorizontal: 26,
    borderRadius: 12,
    marginTop: 10,
    alignItems: 'center',
  },
  stopButtonText: {
    color: '#fff',
    fontSize: 20, 
    fontWeight: 'bold' 
  }
});

export default SOSStyle;
