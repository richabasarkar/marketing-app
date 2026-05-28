'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '@/types';
import { MessageCircle, X, Send } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onToggle: () => void;
  messages: ChatMessage[];
  onMessagesChange: (msgs: ChatMessage[]) => void;
  context: Record<string, string | undefined>;
  currentStep: string;
}

const EXAMPLE_PROMPTS: Record<string, string[]> = {
  inputs: [
    "What information is most important for accurate strategies?",
    "I'm a B2B SaaS startup with $2K/month budget — what should I focus on?",
    "How do I figure out my target audience?",
    "What's a realistic marketing budget for an early-stage startup?",
  ],
  strategies: [
    "Explain the difference between paid ads and organic marketing",
    "Which strategy works best with a limited budget?",
    "How long does it realistically take to see marketing results?",
    "What's the biggest mistake founders make with marketing?",
  ],
  followup: [
    "How do I define my brand voice?",
    "What makes a good call-to-action?",
    "How do I measure if my marketing is working?",
    "What content should I create first?",
  ],
  plan: [
    "How do I stay consistent with my content schedule?",
    "What are the most important KPIs to track?",
    "How do I know if my messaging is resonating?",
    "What's the best way to allocate a limited marketing budget?",
  ],
  board: [
    "I'm overwhelmed by all the tasks — where do I start?",
    "How do I prioritize when I only have 5 hours/week?",
    "What are quick wins I can get in the first 2 weeks?",
    "How do I stay motivated when results are slow?",
  ],
};

const MARKETING_TIPS = [
  "Focus on one channel deeply before expanding to others",
  "Data without action is just numbers — always ask 'so what?'",
  "The riches are in the niches — the more specific, the better",
  "Marketing is a long game. Most strategies take 90 days minimum",
  "Test, measure, learn, repeat. That's the whole playbook.",
];

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', gap: 10, padding: '12px 0' }}>
      <div style={{ width: 28, height: 28, background: '#6c63ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontSize: 11, color: 'white' }}>C</div>
      <div style={{ background: 'white', border: '1px solid #e4e2f5', padding: '12px 16px' }}>
        <div className="loading-dots"><span /><span /><span /></div>
      </div>
    </div>
  );
}

function ChatMessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';
  return (
    <div style={{ display: 'flex', flexDirection: isUser ? 'row-reverse' : 'row', gap: 8, marginBottom: 16, animation: 'slideIn 0.2s ease' }}>
      {!isUser && (
        <div style={{ width: 28, height: 28, background: '#6c63ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontSize: 11, color: 'white' }}>C</div>
      )}
      <div className={isUser ? 'chat-bubble-user' : 'chat-bubble-ai'} style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
        {message.content}
      </div>
    </div>
  );
}

export default function ChatBot({ isOpen, onToggle, messages, onMessagesChange, context, currentStep }: Props) {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showExamples, setShowExamples] = useState(true);
  const [tipIndex, setTipIndex] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    const interval = setInterval(() => setTipIndex(i => (i + 1) % MARKETING_TIPS.length), 4000);
    return () => clearInterval(interval);
  }, []);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isTyping) return;
    setShowExamples(false);
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: content.trim(), timestamp: new Date() };
    const newMessages = [...messages, userMsg];
    onMessagesChange(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages.map(m => ({ role: m.role, content: m.content })), context }),
      });
      const data = await res.json();
      const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'assistant', content: data.reply || 'Sorry, I had trouble responding. Please try again.', timestamp: new Date() };
      onMessagesChange([...newMessages, aiMsg]);
    } catch {
      const errMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'assistant', content: "I'm having trouble connecting right now. Please check your API key and try again.", timestamp: new Date() };
      onMessagesChange([...newMessages, errMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const prompts = EXAMPLE_PROMPTS[currentStep] || EXAMPLE_PROMPTS.inputs;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={onToggle}
        style={{
          position: 'fixed', bottom: 28, right: 28, zIndex: 500,
          width: 52, height: 52,
          background: isOpen ? 'white' : '#6c63ff',
          border: isOpen ? '1px solid #e4e2f5' : 'none',
          color: 'white', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(108,99,255,0.35)',
          transition: 'all 0.2s',
        }}
      >
        {isOpen
          ? <X size={20} color="#4a4568" />
          : <MessageCircle size={20} />
        }
        {!isOpen && messages.length === 0 && (
          <div style={{ position: 'absolute', top: -2, right: -2, width: 12, height: 12, background: '#22c55e', border: '2px solid white' }} />
        )}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div style={{
          position: 'fixed', bottom: 92, right: 28, zIndex: 500,
          width: 360, height: 540,
          display: 'flex', flexDirection: 'column',
          background: 'white',
          border: '1px solid #e4e2f5',
          boxShadow: '0 16px 48px rgba(0,0,0,0.12)',
          animation: 'fadeIn 0.2s ease',
        }}>
          {/* Header */}
          <div style={{ padding: '14px 18px', borderBottom: '1px solid #e4e2f5', display: 'flex', alignItems: 'center', gap: 12, background: '#fafafa' }}>
            <div style={{ width: 34, height: 34, background: '#6c63ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontSize: 14, color: 'white', flexShrink: 0 }}>C</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 14, color: '#1a1730' }}>Chip</p>
              <p style={{ fontSize: 11, color: '#22c55e', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 5, height: 5, background: '#22c55e', display: 'inline-block' }} />
                AI Marketing Expert · Online
              </p>
            </div>
            {context.companyName && (
              <span style={{ fontSize: 10, color: '#8b87a8', background: '#f3f2ff', padding: '3px 8px', fontWeight: 600 }}>
                {context.companyName}
              </span>
            )}
          </div>

          {/* Tip ticker */}
          <div style={{ padding: '8px 18px', background: '#f8f7ff', borderBottom: '1px solid #e4e2f5' }}>
            <p style={{ fontSize: 11, color: '#4a4568', animation: 'slideIn 0.3s ease', fontStyle: 'italic' }} key={tipIndex}>
              "{MARKETING_TIPS[tipIndex]}"
            </p>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', padding: '20px 10px' }}>
                <div style={{ width: 48, height: 48, background: '#6c63ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontSize: 20, color: 'white', margin: '0 auto 12px' }}>C</div>
                <p style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 16, marginBottom: 6, color: '#1a1730' }}>Hey, I'm Chip</p>
                <p style={{ fontSize: 13, color: '#4a4568', lineHeight: 1.6, marginBottom: 16 }}>
                  Your AI marketing strategist. Ask me anything about your strategy, plan, or how to execute.
                </p>
                {context.companyName && (
                  <div style={{ background: '#f3f2ff', border: '1px solid #e4e2f5', padding: '10px 14px', marginBottom: 4 }}>
                    <p style={{ fontSize: 12, color: '#6c63ff' }}>I have context about <strong>{context.companyName}</strong> — my answers will be tailored to you.</p>
                  </div>
                )}
              </div>
            )}
            {messages.map(msg => <ChatMessageBubble key={msg.id} message={msg} />)}
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Example prompts */}
          {showExamples && messages.length === 0 && (
            <div style={{ padding: '0 16px 12px' }}>
              <p style={{ fontSize: 10, color: '#8b87a8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Try asking</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {prompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(prompt)}
                    style={{ padding: '8px 12px', background: '#f8f7ff', border: '1px solid #e4e2f5', color: '#4a4568', fontSize: 12, textAlign: 'left', cursor: 'pointer', transition: 'all 0.15s', lineHeight: 1.4, fontFamily: 'DM Sans, sans-serif' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#6c63ff'; (e.currentTarget as HTMLElement).style.color = '#6c63ff'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#e4e2f5'; (e.currentTarget as HTMLElement).style.color = '#4a4568'; }}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid #e4e2f5', display: 'flex', gap: 8, alignItems: 'flex-end', background: 'white' }}>
            <textarea
              ref={inputRef}
              placeholder="Ask Chip anything..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              style={{ flex: 1, resize: 'none', maxHeight: 80, padding: '10px 12px', fontSize: 13, lineHeight: 1.5, border: '1.5px solid #e4e2f5', outline: 'none', fontFamily: 'DM Sans, sans-serif', color: '#1a1730', background: 'white' }}
              onFocus={e => (e.currentTarget.style.borderColor = '#6c63ff')}
              onBlur={e => (e.currentTarget.style.borderColor = '#e4e2f5')}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isTyping}
              style={{
                width: 36, height: 36, background: input.trim() && !isTyping ? '#6c63ff' : '#e4e2f5',
                border: 'none', color: 'white', cursor: input.trim() && !isTyping ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s', flexShrink: 0,
              }}
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}