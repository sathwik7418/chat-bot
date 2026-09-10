import { Check } from 'lucide-react';

function initialsFor(name) {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function Avatar({ avatar, botName }) {
  const isImage = avatar?.startsWith('http') || avatar?.startsWith('data:');

  return (
    <div className="ai-bot-avatar ai-bot-avatar-message" aria-hidden="true">
      {isImage ? <img src={avatar} alt="" /> : avatar || initialsFor(botName)}
    </div>
  );
}

export default function Message({ message, avatar, botName }) {
  return (
    <div
      className={`ai-bot-message-row ${message.role}`}
      data-testid={`message-${message.role}-${message.id}`}
    >
      {message.role === 'assistant' && <Avatar avatar={avatar} botName={botName} />}
      <div className="ai-bot-message-bubble">{message.content}</div>
      {message.role === 'user' && (
        <Check size={13} className="ai-bot-delivered" aria-label="Sent" />
      )}
    </div>
  );
}