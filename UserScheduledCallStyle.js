// styles/UserScheduledCallStyle.js

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#DCD7ED', // soft lavender
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop:30,
    textAlign: 'center',
    color: '#4B3B4E', // darker lavender for contrast
  },
  card: {
    padding: 16,
    borderRadius: 10,
    backgroundColor: '#E8D4EA', // lighter lavender for card
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  disabledCard: {
    backgroundColor: '#ddd7df', // muted lavender gray
  },
  label: {
    fontWeight: 'bold',
    marginTop: 8,
    color: '#5A4E5D', // muted deep lavender
  },
  value: {
    marginBottom: 4,
    color: '#3B2F3E', // deep text
  },
  link: {
    color: '#874C9D', // strong violet for link
    marginTop: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  pending: {
    color: '#7D6D81',
    marginTop: 10,
    textAlign: 'center',
  },
  empty: {
    textAlign: 'center',
    marginTop: 30,
    color: '#7D6D81',
    fontSize: 16,
  },
});

export default styles;
