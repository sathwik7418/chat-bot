import ReactMarkdown from 'react-markdown';

export default function Message({ message }) {
  const isAssistant = message.role === 'assistant';

  return (
    <div
      className={`ai-bot-message-row ${message.role}`}
      data-testid={`message-${message.role}-${message.id}`}
    >
      <div className="ai-bot-message-bubble">
        {isAssistant ? (
          <ReactMarkdown>
            {message.content}
          </ReactMarkdown>
        ) : (
          message.content
        )}
      </div>
    </div>
  );
}

