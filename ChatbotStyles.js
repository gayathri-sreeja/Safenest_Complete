// styles/ChatbotStyles.js
import { StyleSheet, StatusBar, Platform } from 'react-native';

const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 20;

export const chatbotStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ebf3fa',
    paddingTop: statusBarHeight,
    
  },
  contentContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
    flexGrow: 1,
    justifyContent: 'flex-end',
  },

  topButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10, // Add this if supported, else use marginBottom below
    marginBottom: 10,
  },
  chatContainer: {
    paddingHorizontal: 15,
    marginBottom: 10,
  },

  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 18,
    marginVertical: 7,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },

  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#FFDEE9',
    borderBottomRightRadius: 0,
  },

  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#BEE1F1',
    borderBottomLeftRadius: 0,
    borderColor: '#A2D2FF',
    borderWidth: 1,
  },

  messageText: {
    fontSize: 18,
    color: '#333',
    lineHeight: 24,
   
  },

  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    borderRadius: 20,
    marginHorizontal: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: -3 },
    elevation: 3,
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#FAF9FF',
  },

  sendButton: {
    marginLeft: 10,
    backgroundColor: '#6C9BCF',
    borderRadius: 25,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  sendButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },

  clearButton: {
    backgroundColor: '#ff6666',
    padding: 10,
    marginLeft: 5,
    borderRadius: 10,
    marginBottom: 10, // Add this for spacing when wrapped
    flexGrow: 0.25,
    alignItems: 'center',
    marginRight: 5,
  },

  clearButtonText: {
    color: '#000000',
    fontSize: 16,
  },

  languageButton: {
    backgroundColor: '#B5EAD7',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight:5,
  },

  languageButtonText: {
    color: '#000000',
    fontSize: 16,
    paddingTop:5,
  },
});
