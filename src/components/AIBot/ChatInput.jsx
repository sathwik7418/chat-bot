import { ArrowUp, CornerDownLeft } from 'lucide-react';

export default function ChatInput({ draft, setDraft, onSend, isTyping, textareaRef }) {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      onSend(draft);
    }
  };

  return (
    <form
      className="ai-bot-composer"
      onSubmit={(event) => {
        event.preventDefault();
        onSend(draft);
      }}
    >
      <textarea
        ref={textareaRef}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Write a message…"
        rows={1}
        aria-label="Message"
        data-testid="input-message"
      />
      <div className="ai-bot-composer-footer">
        <span className="ai-bot-hint">
          <CornerDownLeft size={13} /> Enter to send
        </span>
        <button
          className="ai-bot-send"
          type="submit"
          disabled={!draft.trim() || isTyping}
          aria-label="Send message"
          data-testid="button-send-message"
        >
          <ArrowUp size={17} strokeWidth={2.2} />
        </button>
      </div>
    </form>
  );
}