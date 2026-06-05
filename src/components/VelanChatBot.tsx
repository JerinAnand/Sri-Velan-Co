/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 * Sri Velan & Co - VELAN AI Client
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  HelpCircle,
  Clock,
  CheckCircle,
  FileText,
  MapPin,
  Phone,
  ThumbsUp,
  Award
} from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

// Pre-compiled regex patterns for CPU performance optimization
const VELAN_GREETINGS_PATTERN = /^(hello|hi|hey|greetings|good\s+morning|good\s+evening|afternoon|welcome|who\s*is|who\s*are|who\s*this|yo\b)/i;

// Advanced Cog-AI matching & real-time response generator
const getVelanResponse = (query: string): string => {
  const q = (query || "").toLowerCase().trim();

  // 1. DIRECT OPTION SERIAL NUMBER LOOKUPS
  if (q === '1' || q.includes('option 1') || q.includes('option1') || q.includes('opt 1') || q.includes('opt1') || q === 'one') {
    return `### **Option 1: Disaster Dewatering & Heavy Emergency Relief Fleet**

Sri Velan & Co is recognized nationwide as a premier emergency response operator during major monsoon inundation and structural crises.

**Our Specialized Pumping Assets:**
* **Air-Assist Vacuum Pumps:** Heavy-duty **4" and 6" custom pump units** paired with reliable, water-cooled diesel standby engines.
* **Vertical Electrical Submersibles:** High-power **100 HP submersible units** designed to drain metropolitan highway underpasses and deep underground transit nodes.
* **Peak Discharge Potential:** Scaled to pump over **80,000,000 to 120,000,000 Liters per day** during active stormwater peak phases.
* **Emergency Track Record:** High-volume drainage execution praised by regulatory heads during **Cycone Fengal (2024)**, **Cyclone Michaung (2023)**, **Cyclone Gulab (2021)**, and **Cyclone Nivar (2020)**.

*To register emergency rental queries or immediate logistical dispatch, contact Governing Partner G. Selva Kumar on **+91 98942 18243**.*`;
  }

  if (q === '2' || q.includes('option 2') || q.includes('option2') || q.includes('opt 2') || q.includes('opt2') || q === 'two') {
    return `### **Option 2: Tractor-Mounted Hydraulic Broomer Configurations**

Sri Velan & Co manufactures and distributes high-durability **Tractor-Mounted Highway Broomers** designed for heavy cleanups and highway maintenance in strict adherence to MoRTH guidelines.

**Key Engineering Specifications:**
* **Sweeping Path Capacity:** Adjustable layout from **1800 mm to 2200 mm** sweeping widths.
* **Abrasive Double-Bristles:** Interwoven high-wear nylon filaments and heavy abrasive steel core wires.
* **Operational Hyd Pressure:** Heavy duty **160 to 180 Bar** integrated directly with tractor hydraulic take-offs.
* **Clearing Output:** Swiftest active clearing speeds of up to **10,000 Square Meters per Hour**.
* **3-Point Fitment:** Universal implementation compatible with all major utility tractors of **40 HP or larger** using Cat-II hitches.

*Would you like to generate a detailed catalog price estimate? Use our interactive Broomer tab to trigger an instant estimation report!*`;
  }

  if (q === '3' || q.includes('option 3') || q.includes('option3') || q.includes('opt 3') || q.includes('opt3') || q === 'three') {
    return `### **Option 3: Registered Civil Infrastructure Services**

Armed with standard Class I Gov. registrations, we lead high-budget infrastructure undertakings with audited precision:

1. **PWD Public Buildings & Complexes:** Multilevel earthquake-resistant institutional facilities, administrative offices, and model educational structures.
2. **WRD Irrigation Infrastructure:** Heavy earthmoving, canal branch alignments, reinforced stone-pitch embankment structures, and spillway repairs.
3. **High-Strength Concrete Roads & Bridges:** Industrial rigid bituminized pavements, stormwater concrete chambers, and structural box culvert installations.
4. **Machinery & Fleet Hire:** Fast mobilization of high-capacity vacuum dewatering setups and tractor broomer assemblies.

*All structural materials undergo rigorous site-level audits under leading QA standards.*`;
  }

  if (q === '4' || q.includes('option 4') || q.includes('option4') || q.includes('opt 4') || q.includes('opt4') || q === 'four') {
    return `### **Option 4: Corporate Connection Channels**

Connect directly with Sri Velan & Co’s central management and engineering estimators:

* **Primary High-Priority Hotline:** **+91 98942 18243** (Mr. G. Selva Kumar, Managing Director & Partner)
* **Secondary Customer Desk:** **+91 98427 18243**
* **Direct Corporate Correspondence:** **srivelan2004@gmail.com** or **pgselva45@gmail.com**
* **In-app Quote Routing:** Submit an inquiry via our forms to dispatch instant automated SMS alerts straight to our team.`;
  }

  if (q === '5' || q.includes('option 5') || q.includes('option5') || q.includes('opt 5') || q.includes('opt5') || q === 'five') {
    return `### **Option 5: Our Corporate Locations & Address Hubs**

We maintain dual corporate facilities to ensure efficient machinery transport and state government liaison:

1. **Head Office (Villupuram):**
   2/112 Post Office Street,
   Pillur, Viluppuram, Tamilnadu - 605103.
   
2. **Chennai Corporate Office:**
   S2, Second Floor, A Block, 8th Cross Street,
   Ram Nagar South, Madipakkam, Chennai, Tamilnadu - 600091.

*Both branches support active machinery depots, rapid mobilization units, and bid coordination desks.*`;
  }

  if (q === '6' || q.includes('option 6') || q.includes('option6') || q.includes('opt 6') || q.includes('opt6') || q === 'six') {
    return `### **Option 6: Accreditations & Government Credentials**

Sri Velan & Co is fully accredited for industrial-scale government operations:
* **Contractor Rank:** Registered **Class I Government Contractor** (state's highest-tier accreditation).
* **GSTIN:** **33ABFFS6298G1ZU**
* **MSME Registry:** **UDYAM-TN-31-0046742**
* **Standards Compliance:** Fully compliant with ISO quality and safety protocols.`;
  }

  // HELLO / GREETINGS
  if (VELAN_GREETINGS_PATTERN.test(q)) {
    return `### **Vanakkam & Welcome! I am VELAN AI** ⚡

I am the cognitive intelligence workspace core representing **Sri Velan & Co** (Accredited Class I Govt. Civil Contractors, Estd. 2006). 

Please query by serial number, click a suggestion chip, or ask me directly:
* **[1] Disaster Dewatering & Emergency Pumping Fleet** 💧
* **[2] Tractor-Attached Hydraulic Broomers & highway sweepers** 🧹
* **[3] PWD Buildings, WRD Canals & Rigid CC Roads** 🏗️
* **[4] Corporate Connection Channels & Liaison** 📞
* **[5] Corporate Offices & Field Location Hubs** 📍
* **[6] Accreditations & Government Credentials** 🎖️`;
  }

  // DEWATERING / FLOOD / EMERGENCY / CYCLONE / PUMPS
  if (q.includes('dewater') || q.includes('pump') || q.includes('flood') || q.includes('cyclone') || q.includes('submersible') || q.includes('fengal') || q.includes('michaung') || q.includes('vacuum') || q.includes('diesel') || q.includes('discharge') || q.includes('relief') || q.includes('rescue')) {
    return `### **Disaster Dewatering & Heavy Emergency Relief Fleet**

Sri Velan & Co is recognized nationwide as a premier emergency response operator during major monsoon inundation and structural crises.

**Our Specialized Pumping Assets:**
* **Air-Assist Vacuum Pumps:** Heavy-duty **4" and 6" custom pump units** paired with reliable, water-cooled diesel standby engines.
* **Vertical Electrical Submersibles:** High-power **100 HP submersible units** designed to drain metropolitan highway underpasses and deep underground transit nodes.
* **Peak Discharge Potential:** Scaled to pump over **80,000,000 to 120,000,000 Liters per day** during active stormwater peak phases.
* **Emergency Track Record:** High-volume drainage execution praised by regulatory heads during **Cycone Fengal (2024)**, **Cyclone Michaung (2023)**, **Cyclone Gulab (2021)**, and **Cyclone Nivar (2020)**.

*To register emergency rental queries or immediate logistical dispatch, contact Governing Partner G. Selva Kumar on **+91 98942 18243**.*`;
  }

  // BROOMER / SWEEPER / ROADS / RECONSTRUCTION
  if (q.includes('broom') || q.includes('sweep') || q.includes('tractor') || q.includes('pavement') || q.includes('highway') || q.includes('clean') || q.includes('attachment') || q.includes('bristle') || q.includes('spec') || q.includes('quotation')) {
    return `### **Tractor-Mounted Hydraulic Broomer Configurations**

Sri Velan & Co manufactures and distributes high-durability **Tractor-Mounted Highway Broomers** designed for heavy cleanups and highway maintenance in strict adherence to MoRTH guidelines.

**Key Engineering Specifications:**
* **Sweeping Path Capacity:** Adjustable layout from **1800 mm to 2200 mm** sweeping widths.
* **Abrasive Double-Bristles:** Engineered using ultra-tough steel core wires interwoven with high-wear nylon filaments.
* **Operational Hyd Pressure:** Heavy duty **160 to 180 Bar** integrated directly with tractor hydraulic take-offs.
* **Clearing Output:** Swiftest active clearing speeds of up to **10,000 Square Meters per Hour**.
* **3-Point Fitment:** Universal implementation compatible with all major utility tractors of **40 HP or larger** using Cat-II hitches.

*Would you like to generate a detailed catalog price estimate? Use our interactive Broomer tab to trigger an instant estimation report!*`;
  }

  // SERVICES / CAPABILITIES / CIVIL WORKS
  if (q.includes('service') || q.includes('capability') || q.includes('works') || q.includes('tenders') || q.includes('contract') || q.includes('civil') || q.includes('canal') || q.includes('drain') || q.includes('structural') || q.includes('build')) {
    return `### **Our Registered Civil Infrastructure Services**

Armed with standard Class I Gov. registrations, we lead high-budget infrastructure undertakings with audited precision:

1. **PWD Public Buildings & Complexes:** Multilevel earthquake-resistant institutional facilities, administrative offices, and model educational structures.
2. **WRD Irrigation Infrastructure:** Heavy earthmoving, canal branch alignments, reinforced stone-pitch embankment structures, and spillway repairs.
3. **High-Strength Concrete Roads & Bridges:** Industrial rigid bituminized pavements, stormwater concrete chambers, and structural box culvert installations.
4. **Machinery & Fleet Hire:** Fast mobilization of high-capacity vacuum dewatering setups and tractor broomer assemblies.

*All structural materials undergo rigorous site-level audits under leading QA standards.*`;
  }

  // PROJECTS / EXPERIENCE / PAST WORK
  if (q.includes('project') || q.includes('experience') || q.includes('done') || q.includes('restor') || q.includes('temple') || q.includes('history') || q.includes('portfolio')) {
    return `### **Milestone Projects & Civil Portfolios**

Covering over 18+ years of engineering execution, Sri Velan & Co has handled critical municipal contracts:

* **Heritage Restoration Works:** Intricate structural brick repair and sacred water basin (Theertha Kulam) structural restoration for the Hindu Religious & Charitable Endowments (HR&CE) department.
* **PWD Structural Complexes:** Designed and finished key state administrative offices exceeding 45,000 sq ft with integrated rainwater cells.
* **Irrigation Embankments:** Finished over **12 Kilometers** of WRD protective stone pitching on volatile river basins, ensuring localized agricultural security.
* **Cyclone Dewatering Support:** Seamless deployment of high-speed dewatering pump blocks to resolve emergency water logging across arterial city subways.`;
  }

  // CONTACT / PHONE / WHATSAPP / EMAILS
  if (q.includes('contact') || q.includes('phone') || q.includes('email') || q.includes('whatsapp') || q.includes('call') || q.includes('reach') || q.includes('number') || q.includes('mail') || q.includes('selva') || q.includes('kumar')) {
    return `### **Corporate Connection Channels**

Connect directly with Sri Velan & Co’s central management and engineering estimators:

* **Primary High-Priority Hotline:** **+91 98942 18243** (Mr. G. Selva Kumar, Managing Director & Partner)
* **Secondary Customer Desk:** **+91 98427 18243**
* **Direct Corporate Correspondence:** **srivelan2004@gmail.com** or **pgselva45@gmail.com**
* **In-app Quote Routing:** Submit an inquiry via our forms to dispatch instant automated SMS alerts straight to our team.`;
  }

  // OFFICE / LOCATION / ADDRESS / VILLUPURAM / CHENNAI
  if (q.includes('office') || q.includes('address') || q.includes('where') || q.includes('location') || q.includes('map') || q.includes('chennai') || q.includes('villupuram') || q.includes('branch')) {
    return `### **Our Corporate Locations**

We maintain dual corporate facilities to ensure efficient machinery transport and state government liaison:

1. **Head Office (Villupuram):**
   2/112 Post Office Street,
   Pillur, Viluppuram, Tamilnadu - 605103.
   
2. **Chennai Corporate Office:**
   S2, Second Floor, A Block, 8th Cross Street,
   Ram Nagar South, Madipakkam, Chennai, Tamilnadu - 600091.

*Both branches support active machinery depots, rapid mobilization units, and bid coordination desks.*`;
  }

  // TAX / GSTIN / MSME / REGISTRATION
  if (q.includes('gst') || q.includes('msme') || q.includes('tax') || q.includes('regist') || q.includes('license') || q.includes('accreditation') || q.includes('class i')) {
    return `### **Accreditations & Government Credentials**

Sri Velan & Co is fully accredited for industrial-scale government operations:
* **Contractor Rank:** Registered **Class I Government Contractor** (state's highest-tier accreditation).
* **GSTIN:** **33ABFFS6298G1ZU**
* **MSME Registry:** **UDYAM-TN-31-0046742**
* **Standards Compliance:** Fully compliant with ISO quality and safety protocols.`;
  }

  // DEFAULT INTELLIGENT BOT RESPONSE WITH ACCREDITED TRUTHS
  return `### **Sri Velan & Co • Intelligent AI System Core**

How can I help you construct or support your next infrastructure project? Select a focal point by serial number or type your message here:

* **[1] Disaster Dewatering & Emergency Pumping Fleet** 💧
* **[2] Tractor-Attached Hydraulic Broomers & Highways** 🧹
* **[3] Registered Civil Infrastructure Services** 🏗️
* **[4] Corporate Connection Channels & Hotlines** 📞
* **[5] Corporate Offices & Address Locations** 📍
* **[6] Accreditations & Government Credentials** 🎖️

Please reply with any options above (e.g. **1**, **2**, **3**) or write your queries freely.`;
};

// Custom simple markdown renderer
const SimpleMarkdown: React.FC<{ content: string }> = ({ content }) => {
  const lines = content.split('\n');
  
  return (
    <div className="space-y-1.5 text-sm leading-relaxed text-neutral-800">
      {lines.map((line, idx) => {
        let trimmed = line.trim();
        
        // Skip empty lines
        if (!trimmed) return <div key={idx} className="h-1" />;

        // Headings (###)
        if (trimmed.startsWith('###')) {
          const text = trimmed.replace(/^###\s*/, '');
          return (
            <h4 key={idx} className="font-display font-semibold text-neutral-900 text-sm mt-3 mb-1 flex items-center gap-1.5 border-b border-neutral-200 pb-1">
              {renderBoldText(text)}
            </h4>
          );
        }

        // Bullet Lists (* or -)
        if (trimmed.startsWith('*') || trimmed.startsWith('-')) {
          const text = trimmed.replace(/^[*|-]\s*/, '');
          return (
            <div key={idx} className="flex items-start gap-1.5 pl-2 my-0.5">
              <span className="text-brand-gold-500 mt-1 shrink-0">•</span>
              <p className="flex-grow">{renderBoldText(text)}</p>
            </div>
          );
        }

        // Regular line
        return (
          <p key={idx} className="my-0.5">
            {renderBoldText(line)}
          </p>
        );
      })}
    </div>
  );
};

// Helper to replace **text** with HTML bold representations
const renderBoldText = (text: string) => {
  const parts = text.split(/\*\*([\s\S]*?)\*\*/g);
  if (parts.length === 1) return text;
  
  return parts.map((part, i) => {
    if (i % 2 === 1) {
      return <strong key={i} className="font-semibold text-neutral-900">{part}</strong>;
    }
    return part;
  });
};

interface VelanChatBotProps {
  showScrollTop?: boolean;
}

export const VelanChatBot: React.FC<VelanChatBotProps> = ({ showScrollTop = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: "### Sri Velan & Co • VELAN AI\n\nHello! I am **VELAN AI**, your real-time intelligent helper. I can answer any questions about our Class I civil engineering services, disaster relief pumping setups, customized hydraulic sweepers, or quotation details.\n\nType any option number below or ask me directly:\n\n* **[1] Disaster Dewatering & Emergency Pumping Fleet** 💧\n* **[2] Tractor-Attached Hydraulic Broomers & Highways** 🧹\n* **[3] Registered Civil Infrastructure Services** 🏗️\n* **[4] Corporate Connection Channels & Liaison** 📞\n* **[5] Corporate Offices & Field Location Hubs** 📍\n* **[6] Accreditations & Government Credentials** 🎖️",
      timestamp: new Date()
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on changes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleOpenToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed) return;

    setInputMessage('');
    
    // 1. Append User Message
    const userMsg: ChatMessage = {
      role: 'user',
      text: trimmed,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    // 2. Optimized real-time cognitive lookup response (220ms delay for snappier performance)
    setTimeout(() => {
      const replyText = getVelanResponse(trimmed);
      
      setMessages(prev => [
        ...prev,
        {
          role: 'model',
          text: replyText,
          timestamp: new Date()
        }
      ]);
      setIsLoading(false);
    }, 220);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputMessage);
  };

  const suggestionChips = [
    { label: 'Option 1: Dewatering', prompt: '1' },
    { label: 'Option 2: Broomer', prompt: '2' },
    { label: 'Option 3: Civil Services', prompt: '3' },
    { label: 'Option 4: Help Desk', prompt: '4' }
  ];

  return (
    <div 
      id="velan-chatbot-widget-container" 
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 font-sans"
    >
      
      {/* Expanded Chat Box Window Frame */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 24, stiffness: 180 }}
            id="velan-chatbot-panel"
            className="w-[410px] max-w-[calc(100vw-2rem)] h-[550px] max-h-[82vh] bg-white rounded-2xl shadow-2xl border border-neutral-200/80 flex flex-col overflow-hidden leading-normal"
          >
            {/* Header Area banner with premium Real-Time AI look */}
            <div className="bg-gradient-to-r from-brand-blue-900 to-brand-blue-950 text-white p-4 flex items-center justify-between shadow-md relative shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-gold-500/20 border border-brand-gold-500/40 flex items-center justify-center text-brand-gold-400 relative">
                  <Bot className="w-5.5 h-5.5" />
                  {/* Glowing live indicator ring */}
                  <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm tracking-wide flex items-center gap-1.5 leading-none">
                    VELAN AI
                    <span className="text-[10px] bg-brand-gold-500/20 text-brand-gold-400 border border-brand-gold-500/30 px-1.5 py-0.5 rounded font-mono font-medium scale-90">LIVE V3.5</span>
                  </h3>
                  <p className="text-[11px] text-brand-gold-300 font-medium tracking-tight mt-1 flex items-center gap-1">
                    <Award className="w-3 h-3 text-brand-gold-500" /> Sri Velan & Co Enterprise AI Core
                  </p>
                </div>
              </div>
              <button
                onClick={handleOpenToggle}
                className="text-neutral-400 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-all duration-200 cursor-pointer"
                aria-label="Close Chat Window"
                id="velan-chat-btn-close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* High-Fi Live Connected Info Band */}
            <div className="bg-brand-blue-950 text-brand-gold-400 px-4 py-2 border-b border-neutral-200/60 text-xs flex justify-between items-center shrink-0">
              <span className="flex items-center gap-1 font-medium text-[11px]">
                <Clock className="w-3.5 h-3.5 text-brand-gold-500 animate-pulse" /> Live Synchronized AI Agent
              </span>
              <span className="text-[10px] text-neutral-300 font-mono tracking-wider">CLOUD LINK SECURE</span>
            </div>

            {/* Messages body stream with redefined layouts */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-neutral-50/30 to-white scrollbar-thin">
              
              {messages.map((msg, index) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={index}
                    className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                    id={`velan-chat-row-${index}`}
                  >
                    {!isUser && (
                      <div className="w-7 h-7 rounded-full bg-brand-blue-900 text-brand-gold-400 border border-brand-blue-800 mt-1 flex items-center justify-center shrink-0 shadow-sm text-xs">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] rounded-2xl p-4 shadow-sm border text-sm ${
                        isUser
                          ? 'bg-brand-blue-900 text-white border-brand-blue-950 rounded-br-none'
                          : 'bg-white text-neutral-800 border-neutral-200 rounded-bl-none'
                      }`}
                    >
                      {isUser ? (
                        <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                      ) : (
                        <SimpleMarkdown content={msg.text} />
                      )}
                      
                      <span
                        className={`text-[9px] mt-2 block text-right font-medium tracking-tight ${
                          isUser ? 'text-blue-200' : 'text-neutral-400'
                        }`}
                      >
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {isUser && (
                      <div className="w-7 h-7 rounded-full bg-brand-gold-500 text-brand-blue-950 mt-1 flex items-center justify-center shrink-0 shadow-sm text-xs border border-brand-gold-600/30">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                );
              })}

              {/* real-time API load state */}
              {isLoading && (
                <div className="flex gap-2.5 justify-start" id="velan-loading-indicator">
                  <div className="w-7 h-7 rounded-full bg-brand-blue-900 text-brand-gold-400 border border-brand-blue-800 mt-1 flex items-center justify-center shrink-0 shadow-sm text-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-200 rounded-bl-none max-w-[85%]">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-brand-blue-800 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 rounded-full bg-brand-blue-800 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 rounded-full bg-brand-blue-800 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span className="text-xs text-neutral-500 italic">VELAN AI is generating response...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions Chips box (Only shown on startup/initial welcome screen to save massive space) */}
            {messages.length <= 1 && (
              <div className="p-3 bg-neutral-50 border-t border-neutral-200/50 shrink-0">
                <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2 px-1 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-brand-blue-800" /> High-Performance AI Inquiries
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {suggestionChips.map((chip, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(chip.prompt)}
                      disabled={isLoading}
                      className="text-left text-[11px] font-medium text-neutral-700 bg-white hover:bg-neutral-50 hover:text-brand-blue-900 hover:border-brand-blue-800/40 border border-neutral-200/80 rounded-xl px-2.5 py-2 cursor-pointer shadow-xs transition-all flex items-center justify-between group active:scale-98"
                    >
                      <span className="truncate mr-1">{chip.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Bar Form */}
            <form
              onSubmit={handleFormSubmit}
              className="p-3 bg-white border-t border-neutral-100 flex gap-2 shrink-0 items-center justify-between"
              id="velan-chatbot-form"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask our AI about dewatering, sweeper specs..."
                disabled={isLoading}
                className="flex-grow text-sm text-neutral-800 bg-neutral-50 hover:bg-neutral-100/60 focus:bg-white border border-neutral-200/70 focus:border-brand-blue-800 rounded-xl px-3.5 py-2.5 outline-none transition-all disabled:opacity-60"
                id="velan-chatbot-text-input"
              />
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="bg-brand-blue-900 text-white hover:bg-brand-blue-950 disabled:bg-neutral-100 disabled:text-neutral-400 p-2.5 rounded-xl transition-all shadow-md hover:scale-105 active:scale-95 shrink-0 flex items-center justify-center cursor-pointer border border-brand-blue-950/25"
                id="velan-chatbot-btn-submit"
                title="Send Inquiry"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Activation Button and Toggle state */}
      <div className="flex items-center gap-3">
        {/* Help Invitation bubble popup */}
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, x: 10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="bg-brand-blue-950 text-white text-[12px] font-medium py-2 px-3.5 rounded-2xl shadow-xl font-display uppercase tracking-wide border border-brand-gold-500/20 relative flex items-center gap-2 pr-4 pl-3"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="flex items-center gap-1">VELAN AI <Sparkles className="w-3.5 h-3.5 text-brand-gold-400" /></span>
            {/* simple arrow design */}
            <div className="absolute right-[-4px] top-[14px] w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[4px] border-l-brand-blue-950" />
          </motion.div>
        )}

        <button
          onClick={handleOpenToggle}
          className={`relative p-4 rounded-full shadow-2xl transition-all duration-300 cursor-pointer flex items-center justify-center text-shadow ${
            isOpen 
              ? 'bg-neutral-800 hover:bg-neutral-900 text-white border border-neutral-700 rotate-90 scale-95' 
              : 'bg-brand-gold-500 hover:bg-brand-gold-400 text-brand-blue-950 border border-brand-gold-600/30 hover:scale-110 active:scale-95'
          }`}
          id="velan-chatbot-trigger-btn"
          title={isOpen ? "Minimize Desk" : "Talk to VELAN AI (Cloud AI)"}
        >
          {isOpen ? (
            <X className="w-5.5 h-5.5" />
          ) : (
            <Sparkles className="w-5.5 h-5.5 animate-pulse" />
          )}
        </button>
      </div>

    </div>
  );
};

