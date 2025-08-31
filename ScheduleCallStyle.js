import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F3D9', // Light background color for the psychiatrist screen
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3a3a3a',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333333',
  },
  link: {
    color: '#007bff', // Blue color for the join room link
    fontSize: 16,
    marginTop: 10,
  },
  pending: {
    color: '#e74c3c', // Red color for pending room link
    fontSize: 16,
    marginTop: 10,
  },
  empty: {
    fontSize: 18,
    fontWeight: '600',
    color: '#888888',
    textAlign: 'center',
  },
  button: {
    backgroundColor:'#A76545', // Green button color for setting date/time
    color: '#fff',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  activityIndicator: {
    marginTop: 20,
  },
});

export default styles;
