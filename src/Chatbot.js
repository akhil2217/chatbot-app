// src/Chatbot.js
import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import {
  FaRegCopy,
  FaThumbsUp,
  FaThumbsDown,
  FaWindowMinimize,
  FaTimes,
  FaBars,
  FaComments,
  FaPaperPlane,
  FaRobot,
  FaUser,
} from 'react-icons/fa';

const Chatbot = () => {
  // State variables
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [theme, setTheme] = useState('light');
  const [fontSize, setFontSize] = useState(14);
  const [showMenu, setShowMenu] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // State for chatbot visibility
  const [isTyping, setIsTyping] = useState(false); // State for typing indicator
  const [newMessage, setNewMessage] = useState(false); // State for pop effect
  const messageEndRef = useRef(null);
  const messageIndexRef = useRef(null); // To track the index of the bot's message during typing

  // Scroll to the latest message
  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Function to handle sending messages
  const sendMessage = () => {
    if (input.trim() === '') return;

    // Add user's message to messages
    const userMessage = { sender: 'me', text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    // Clear input
    setInput('');

    // Show typing indicator
    setIsTyping(true);

    // Add bot's typing indicator message and get its index
    setMessages((prevMessages) => {
      const botMessageIndex = prevMessages.length;
      messageIndexRef.current = botMessageIndex; // Save index to ref
      return [
        ...prevMessages,
        {
          sender: 'bot',
          text: '',
          isTyping: true,
          likes: 0,
          dislikes: 0,
        },
      ];
    });

    // Simulate bot response (e.g., API call)
    setTimeout(() => {
      // Simulate bot response
      const botResponse = 'Hello! This is a static response from the bot.';
      // Start typing effect
      typeBotMessage(botResponse);
    }, 2000);
  };

  // Function to simulate typing effect for bot message
  const typeBotMessage = (fullText) => {
    setIsTyping(false);

    let index = 0;
    const typingSpeed = 50; // Adjust typing speed here

    const botMessageIndex = messageIndexRef.current;

    const interval = setInterval(() => {
      const currentText = fullText.substring(0, index);
      index++;

      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        if (updatedMessages[botMessageIndex]) {
          updatedMessages[botMessageIndex].text = currentText;
          // Do not set isTyping to false here
        }
        return updatedMessages;
      });

      if (index > fullText.length) {
        clearInterval(interval);
        // Now set isTyping to false
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          if (updatedMessages[botMessageIndex]) {
            updatedMessages[botMessageIndex].isTyping = false;
          }
          return updatedMessages;
        });
        setNewMessage(true); // Trigger pop effect
        messageIndexRef.current = null; // Reset the ref
      }

      scrollToBottom();
    }, typingSpeed);
  };

  // Function to handle liking a message
  const likeMessage = (index) => {
    const updatedMessages = [...messages];
    updatedMessages[index].likes = (updatedMessages[index].likes || 0) + 1;
    setMessages(updatedMessages);
  };

  // Function to handle disliking a message
  const dislikeMessage = (index) => {
    const updatedMessages = [...messages];
    updatedMessages[index].dislikes =
      (updatedMessages[index].dislikes || 0) + 1;
    setMessages(updatedMessages);
  };

  // Function to copy message text
  const copyMessage = (text) => {
    navigator.clipboard.writeText(text);
    alert('Message copied to clipboard!');
  };

  // Function to export chat
  const exportChat = () => {
    const chatContent = messages
      .map((msg) => `${msg.sender}: ${msg.text}`)
      .join('\n');
    const blob = new Blob([chatContent], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'chat.txt';
    link.click();
  };

  // Function to clear chat
  const clearChat = () => {
    if (window.confirm('Are you sure you want to clear the chat?')) {
      setMessages([]);
      messageIndexRef.current = null; // Reset message index
      setIsTyping(false); // Reset typing indicator
    }
  };

  // Function to start a new chat session
  const newChatSession = () => {
    setMessages([]);
    setInput('');
    messageIndexRef.current = null;
    setIsTyping(false);
    // Add welcome message again
    addWelcomeMessage();
  };

  // Function to toggle theme
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Function to adjust font size with limits
  const adjustFontSize = (size) => {
    const newSize = size;
    if (newSize >= 12 && newSize <= 20) {
      setFontSize(newSize);
    }
  };

  // Handle keypress for sending message
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    } else if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Handle minimize
  const handleMinimize = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  // Effect to reset newMessage state after the pop effect
  useEffect(() => {
    if (newMessage) {
      const timer = setTimeout(() => {
        setNewMessage(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [newMessage]);

  // Add welcome message when chatbot opens for the first time
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addWelcomeMessage();
    }
  }, [isOpen]);

  const addWelcomeMessage = () => {
    // Show typing indicator
    setIsTyping(true);

    // Add bot's typing indicator message and get its index
    setMessages((prevMessages) => {
      const botMessageIndex = prevMessages.length;
      messageIndexRef.current = botMessageIndex; // Save index to ref
      return [
        ...prevMessages,
        {
          sender: 'bot',
          text: '',
          isTyping: true,
          likes: 0,
          dislikes: 0,
        },
      ];
    });

    // Simulate bot response (e.g., API call)
    setTimeout(() => {
      // Simulate bot response
      const botResponse = 'Hello! How can I assist you today?';
      // Start typing effect
      typeBotMessage(botResponse);
    }, 1000);
  };

  // Close menu when mouse leaves
  const handleMenuMouseLeave = () => {
    setShowMenu(false);
  };

  return (
    <>
      {!isOpen && (
        <ChatbotIcon onClick={() => setIsOpen(true)} newMessage={newMessage}>
          <FaComments />
        </ChatbotIcon>
      )}

      {isOpen && (
        <ChatbotContainer themeStyle={theme} fontSize={fontSize}>
          {/* Chatbot Header */}
          <ChatbotHeader themeStyle={theme}>
            <h2>Chat Assistant</h2>
            <HeaderIcons>
              <FaBars onClick={() => setShowMenu(!showMenu)} />
              <FaWindowMinimize onClick={handleMinimize} />
              <FaTimes onClick={() => setIsOpen(false)} />
            </HeaderIcons>
          </ChatbotHeader>

          {/* Menu Options */}
          {showMenu && (
            <ChatbotMenu
              themeStyle={theme}
              onMouseLeave={handleMenuMouseLeave}
            >
              <ul>
                <li onClick={exportChat}>Export Chat</li>
                <li onClick={clearChat}>Clear Chat</li>
                <li onClick={newChatSession}>New Chat Session</li>
                <li onClick={toggleTheme}>Toggle Theme</li>
                <li onClick={() => adjustFontSize(fontSize + 2)}>
                  Increase Font Size
                </li>
                <li onClick={() => adjustFontSize(fontSize - 2)}>
                  Decrease Font Size
                </li>
              </ul>
            </ChatbotMenu>
          )}

          {/* Chat Messages */}
          {!isMinimized && (
            <>
              <ChatbotMessages themeStyle={theme}>
                {messages.map((msg, index) => (
                  <Message key={index} sender={msg.sender}>
                    <MessageContent sender={msg.sender}>
                      <IconWrapper sender={msg.sender}>
                        {msg.sender === 'me' ? <FaUser /> : <FaRobot />}
                      </IconWrapper>
                      <Bubble sender={msg.sender}>
                        {msg.isTyping ? (
                          <TypingIndicatorInBubble>
                            <Dot />
                            <Dot />
                            <Dot />
                          </TypingIndicatorInBubble>
                        ) : (
                          msg.text
                        )}
                        {/* Move MessageActions inside Bubble */}
                        {msg.sender === 'bot' && !msg.isTyping && (
                          <MessageActionsInBubble themeStyle={theme}>
                            <FaRegCopy onClick={() => copyMessage(msg.text)} />
                            <FaThumbsUp onClick={() => likeMessage(index)} />
                            {msg.likes || 0}
                            <FaThumbsDown
                              onClick={() => dislikeMessage(index)}
                            />
                            {msg.dislikes || 0}
                          </MessageActionsInBubble>
                        )}
                      </Bubble>
                    </MessageContent>
                  </Message>
                ))}

                <div ref={messageEndRef} />
              </ChatbotMessages>

              {/* Input Area */}
              <ChatbotInput themeStyle={theme}>
                <Textarea
                  rows="1"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  themeStyle={theme}
                ></Textarea>
                <SendIcon onClick={sendMessage}>
                  <FaPaperPlane />
                </SendIcon>
              </ChatbotInput>
            </>
          )}
        </ChatbotContainer>
      )}
    </>
  );
};

export default Chatbot;

/* Styled Components */

const popAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
`;

const ChatbotIcon = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #007bff;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1000;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  animation: ${(props) =>
    props.newMessage ? popAnimation : 'none'} 0.5s ease-in-out;
  &:hover {
    background-color: #0056b3;
  }
  svg {
    width: 30px;
    height: 30px;
  }
`;

const ChatbotContainer = styled.div`
  width: 350px;
  height: 500px; /* Fixed height */
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  font-size: ${(props) => props.fontSize}px;
  font-family: 'Roboto', sans-serif;
  background-color: ${(props) =>
    props.themeStyle === 'light' ? '#fff' : '#1a1a1a'};
  color: ${(props) => (props.themeStyle === 'light' ? '#000' : '#fff')};
  position: fixed;
  bottom: 80px; /* Position above the chatbot icon */
  right: 20px;
  z-index: 1000;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
`;

const ChatbotHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: ${(props) =>
    props.themeStyle === 'light' ? '#007bff' : '#333'};
  color: white;
  position: relative;
  h2 {
    margin: 0;
    font-size: 1.2em;
  }
`;

const HeaderIcons = styled.div`
  display: flex;
  align-items: center;
  svg {
    margin-left: 15px;
    cursor: pointer;
    color: white;
    &:hover {
      color: #ccc;
    }
  }
`;

const ChatbotMenu = styled.div`
  background-color: ${(props) =>
    props.themeStyle === 'light' ? '#f9f9f9' : '#1a1a1a'};
  padding: 10px;
  position: absolute;
  top: 60px;
  right: 10px;
  width: 200px;
  border-radius: 5px;
  z-index: 1001; /* Ensure the menu is above other elements */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  li {
    padding: 12px 10px;
    cursor: pointer;
    border-bottom: 1px solid
      ${(props) => (props.themeStyle === 'light' ? '#ddd' : '#333')};
    font-weight: 500;
    color: ${(props) => (props.themeStyle === 'light' ? '#333' : '#ccc')};
    &:hover {
      background-color: #007bff;
      color: white;
    }
  }
`;

const ChatbotMessages = styled.div`
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  background-color: ${(props) =>
    props.themeStyle === 'light' ? '#f0f4f8' : '#23272a'};
`;

const Message = styled.div`
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  align-items: ${(props) =>
    props.sender === 'me' ? 'flex-end' : 'flex-start'};
`;

const MessageContent = styled.div`
  display: flex;
  align-items: flex-end;
  flex-direction: ${(props) =>
    props.sender === 'me' ? 'row-reverse' : 'row'};
`;

const IconWrapper = styled.div`
  margin: ${(props) =>
    props.sender === 'me' ? '0 0 0 10px' : '0 10px 0 0'};
  color: ${(props) => (props.sender === 'me' ? '#007bff' : '#28a745')};
  svg {
    width: 24px;
    height: 24px;
  }
`;

const Bubble = styled.div`
  background-color: ${(props) =>
    props.sender === 'me' ? '#007bff' : '#e5e5ea'};
  color: ${(props) => (props.sender === 'me' ? '#fff' : '#000')};
  padding: 10px 15px;
  border-radius: 20px;
  max-width: 70%;
  word-wrap: break-word;
  font-size: 0.95em;
  position: relative;
`;

const TypingIndicatorInBubble = styled.div`
  display: flex;
  align-items: center;
  margin-top: 5px;
`;

const MessageActionsInBubble = styled.div`
  margin-top: 5px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: ${(props) =>
    props.themeStyle === 'light' ? '#555' : '#ccc'}; /* Subtle color */
  font-size: 0.85em;
  svg {
    margin-right: 8px;
    cursor: pointer;
    color: ${(props) => (props.themeStyle === 'light' ? '#555' : '#ccc')};
    &:hover {
      color: #007bff;
    }
  }
`;

const ChatbotInput = styled.div`
  padding: 10px;
  background-color: ${(props) =>
    props.themeStyle === 'light' ? '#f9f9f9' : '#1a1a1a'};
  display: flex;
  align-items: center;
`;

const Textarea = styled.textarea`
  flex: 1;
  resize: none;
  padding: 10px;
  font-size: 1em;
  border: none;
  border-radius: 20px;
  outline: none;
  background-color: ${(props) =>
    props.themeStyle === 'light' ? '#fff' : '#40444b'};
  color: ${(props) => (props.themeStyle === 'light' ? '#000' : '#fff')};
  margin-right: 10px;
  max-height: 100px;
`;

const SendIcon = styled.div`
  cursor: pointer;
  color: #007bff;
  svg {
    width: 24px;
    height: 24px;
    transform: rotate(45deg);
  }
  &:hover {
    color: #0056b3;
  }
`;

const bounce = keyframes`
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-10px);
  }
`;

const Dot = styled.div`
  width: 8px;
  height: 8px;
  background-color: #777;
  border-radius: 50%;
  margin: 0 3px;
  animation: ${bounce} 1.4s infinite ease-in-out both;
  &:nth-child(1) {
    animation-delay: -0.32s;
  }
  &:nth-child(2) {
    animation-delay: -0.16s;
  }
`;

/* End of Styled Components */
