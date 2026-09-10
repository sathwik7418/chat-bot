import { useEffect, useRef, useState } from 'react';
import BotButton from './BotButton';
import BotWindow from './BotWindow';
import './AIBot.css';

const DEFAULT_SUGGESTIONS = [
  'What can you help me with?',
  'Tell me about your approach',
  'Help me get started',
];

export function AIBot({
  botName = 'Milo',
  greeting = 'Hi, I’m Milo. What would you like to explore?',
  avatar,
  accentColor = '#2f7773',
  suggestions = DEFAULT_SUGGESTIONS,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const nextId = useRef(1);
  const replyCount = useRef(0);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      window.setTimeout(() => {
        textareaRef.current?.focus();
      }, 120);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = async (value) => {
  const content = value.trim();

  if (!content || isTyping) return;

  setMessages((current) => [
    ...current,
    {
      id: nextId.current++,
      role: "user",
      content,
    },
  ]);

  setDraft("");
  setIsTyping(true);

  const API_URL = import.meta.env.VITE_API_URL;
  try {
    const response = await fetch(`${API_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: content,
        history: messages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Something went wrong");
    }

    setMessages((current) => [
      ...current,
      {
        id: nextId.current++,
        role: "assistant",
        content: data.reply,
      },
    ]);
  } catch (error) {
    console.error("Chat error:", error);

    setMessages((current) => [
      ...current,
      {
        id: nextId.current++,
        role: "assistant",
        content:
          "Sorry, I couldn't connect to the AI right now. Please try again.",
      },
    ]);
  } finally {
    setIsTyping(false);
  }
};

  return (
    <div
      className={`ai-bot-root ${isOpen ? 'is-open' : ''}`}
      style={{ '--ai-accent': accentColor }}
    >
      {isOpen ? (
        <BotWindow
          botName={botName}
          greeting={greeting}
          avatar={avatar}
          suggestions={suggestions}
          messages={messages}
          isTyping={isTyping}
          draft={draft}
          setDraft={setDraft}
          onSend={sendMessage}
          onClose={() => setIsOpen(false)}
          messagesEndRef={messagesEndRef}
          textareaRef={textareaRef}
        />
      ) : (
        <BotButton
          botName={botName}
          avatar={avatar}
          onClick={() => setIsOpen(true)}
        />
      )}
    </div>
  );
}

export default AIBot;