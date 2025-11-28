import { useState, useRef, useEffect } from "react";
import { X, Send, Phone } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

interface ChatModalProps {
  workerName: string;
  workerPhone: string;
  onClose: () => void;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'worker';
  timestamp: Date;
}

const ChatModal = ({ workerName, workerPhone, onClose }: ChatModalProps) => {
  const { user, addMessage, getMessages } = useAuthStore();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const chatKey = `${user?.phone}-${workerPhone}`;
  const messages = getMessages(chatKey);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    addMessage(chatKey, {
      text: input,
      sender: 'user',
    });
    setInput('');

    // Simulate worker auto-reply after 2 seconds
    setTimeout(() => {
      addMessage(chatKey, {
        text: `Thank you for your message. I am currently on relief duty and will reach your area soon. - ${workerName}`,
        sender: 'worker',
      });
    }, 2000);
  };

  const handleCall = () => {
    window.location.href = `tel:${workerPhone}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="glass-card w-full max-w-md h-[600px] flex flex-col animate-fade-in">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground">{workerName}</h3>
            <p className="text-sm text-muted-foreground">{workerPhone}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCall}
              className="p-2 rounded-lg bg-success/20 text-success hover:bg-success/30 transition-colors"
            >
              <Phone size={20} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <p>No messages yet</p>
              <p className="text-sm">Start a conversation with {workerName}</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                    msg.sender === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-sm'
                      : 'bg-muted text-foreground rounded-bl-sm'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              className="flex-1 px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="px-4 py-3 rounded-xl bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
