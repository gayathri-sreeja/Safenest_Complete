import { StyleSheet, Platform, StatusBar } from 'react-native';

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 16,
    backgroundColor: '#f0fdf8', // light mint green background
    flexGrow: 1, // allow ScrollView to expand
  },
  
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#4CAF91', // deeper shade of B5EAD7 for title
  },
  scene: {
    fontSize: 16,
    marginBottom: 16,
    color: '#333',
  },
  question: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#4CAF91',
  },
  optionButton: {
    backgroundColor: '#dffaf0', // soft mint
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#b5ead7',
  },
  optionText: {
    fontSize: 16,
    color: '#317C66', // readable green text
  },
  explanation: {
    marginTop: 16,
    fontSize: 16,
    color: '#2e7d32',
  },
  legalInsight: {
    marginTop: 10,
    fontSize: 14,
    fontStyle: 'italic',
    color: '#00695c', // deeper green for legal note
  },
  nextButton: {
    marginTop: 20,
    backgroundColor: '#4CAF91', // stronger mint green
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default styles;
