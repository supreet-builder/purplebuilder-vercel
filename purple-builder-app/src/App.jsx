import { useState, useRef, useEffect } from "react";
import logoImage from "./assets/purplebuilder_logo.png";

// ─── MOCK DATA ───────────────────────────────────────────────────────────────
const defaultPersonas = [
  {
    id: 1, name: "Sarah Chen", firm: "Sequoia Capital", type: "Venture Capitalist",
    avatar: "https://i.pravatar.cc/150?img=47",
    voiceSettings: { voiceIndex: -1, rate: 0.95, pitch: 1.0 },
    context: "Focuses on enterprise SaaS, B2B, and AI-first companies. Previously founded two startups. Values strong unit economics and clear product-market fit.",
    topics: ["Market Size", "Unit Economics", "Go-to-Market", "Competitive Moat", "Team Background", "Revenue Model", "Customer Acquisition", "Tech Architecture"]
  },
  {
    id: 2, name: "Marcus Rivera", firm: "Andreessen Horowitz", type: "Venture Capitalist",
    avatar: "https://i.pravatar.cc/150?img=68",
    voiceSettings: { voiceIndex: -1, rate: 1.0, pitch: 0.95 },
    context: "Deep background in consumer tech and marketplaces. Led Series A and B rounds. Interested in network effects and viral growth loops.",
    topics: ["Network Effects", "Viral Growth", "Burn Rate", "Platform Strategy", "User Retention", "Marketplace Dynamics", "Scaling Plan", "Fundraise Terms"]
  },
  {
    id: 3, name: "Priya Patel", firm: "NEA", type: "Target Customer",
    avatar: "https://i.pravatar.cc/150?img=44",
    voiceSettings: { voiceIndex: -1, rate: 0.9, pitch: 1.05 },
    context: "VP of Engineering at a mid-size fintech. Evaluates tools based on integration ease, security compliance, and developer experience.",
    topics: ["Integration API", "Security & Compliance", "Developer Experience", "Pricing Model", "Support SLA", "Onboarding Flow", "Customization", "ROI Calculation"]
  },
  {
    id: 4, name: "James Whitfield", firm: "Tiger Global", type: "Venture Capitalist",
    avatar: "https://i.pravatar.cc/150?img=12",
    voiceSettings: { voiceIndex: -1, rate: 1.0, pitch: 1.0 },
    context: "Focuses on late-stage growth investments. Driven by data — wants clear metrics and retention curves. Has funded 40+ companies.",
    topics: ["ARR Growth", "Retention Metrics", "Unit Economics", "Fundraise History", "Valuation Basis", "Path to Profit", "Market Leadership", "Exit Strategy"]
  }
];

const BUBBLE_COLORS = [
  { bg: "#F5F3FF", text: "#7963D0", border: "#D4C5F0" },
  { bg: "#F0EDFF", text: "#7963D0", border: "#D4C5F0" },
  { bg: "#F5F3FF", text: "#7963D0", border: "#D4C5F0" },
  { bg: "#F0EDFF", text: "#7963D0", border: "#D4C5F0" },
  { bg: "#F5F3FF", text: "#7963D0", border: "#D4C5F0" },
  { bg: "#F0EDFF", text: "#7963D0", border: "#D4C5F0" },
  { bg: "#F5F3FF", text: "#7963D0", border: "#D4C5F0" },
  { bg: "#F0EDFF", text: "#7963D0", border: "#D4C5F0" },
];

// ─── ICONS ───────────────────────────────────────────────────────────────────
const Svg = ({ children, w = 18, h = 18, ...p }) => (
  <svg width={w} height={h} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>{children}</svg>
);

const UploadIcon = () => <Svg><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></Svg>;
const LinkIcon = () => <Svg w={18} h={18}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></Svg>;
const SendIcon = () => <Svg><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2" fill="currentColor" stroke="none"/></Svg>;
const PlusIcon = () => <Svg w={16} h={16}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></Svg>;
const TrashIcon = () => <Svg w={15} h={15}><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></Svg>;
const EditIcon = () => <Svg w={15} h={15}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></Svg>;
const XIcon = () => <Svg w={18} h={18}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></Svg>;
const PhoneIcon = () => <Svg w={20} h={20} style={{ color: "#fff" }}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></Svg>;
const PhoneOffIcon = () => <Svg w={20} h={20} style={{ color: "#fff" }}><path d="M10.68 13.31a16 16 0 0 0 3.41 5.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 19.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 5h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 12.91a16 16 0 0 0 2.59.4"/><line x1="1" y1="1" x2="23" y2="23"/></Svg>;
const VoiceIcon = () => <Svg w={16} h={16}><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></Svg>;
const PlayIcon = () => <Svg w={14} h={14}><polygon points="5 3 19 12 5 21 5 3" fill="currentColor" stroke="none"/></Svg>;
const StopSmIcon = () => <svg width="14" height="14" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" fill="currentColor"/></svg>;

// ─── RESPONSIVE HOOK ────────────────────────────────────────────────────────
function useW() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener("resize", fn); fn();
    return () => window.removeEventListener("resize", fn);
  }, []);
  return w;
}

// ─── ROOT ────────────────────────────────────────────────────────────────────
export default function PurpleBuilder() {
  const w = useW();
  const mob = w < 640, tab = w < 1024;

  // ── tabs / upload / preview ──
  const [activeTab, setActiveTab] = useState("builder");
  const [file, setFile] = useState(null);
  const [webUrl, setWebUrl] = useState("");
  const [previewMode, setPreviewMode] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [iframeError, setIframeError] = useState(false);
  const [iframeLoading, setIframeLoading] = useState(true);
  const [websiteText, setWebsiteText] = useState(null);
  const [textLoading, setTextLoading] = useState(false);
  const [simulationPersonas, setSimulationPersonas] = useState([]);
  const [selectedSimPersona, setSelectedSimPersona] = useState(null);
  const [showPersonaSelector, setShowPersonaSelector] = useState(false);
  const [personaFeedback, setPersonaFeedback] = useState({});
  const [simulationActive, setSimulationActive] = useState(false);
  const iframeTimeoutRef = useRef(null);
  const iframeRef = useRef(null);
  const fileRef = useRef(null);
  
  // ── multiple content items ──
  const [contentItems, setContentItems] = useState([]); // Array of { id, type, name, url/file, selected }
  const [selectedItems, setSelectedItems] = useState([]); // Array of item IDs
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addModalType, setAddModalType] = useState(null); // 'survey', 'figma', 'website', 'pitchdeck', 'document', 'image'
  const [selectedContentItem, setSelectedContentItem] = useState(null); // Currently selected item for preview
  const [showAddDropdown, setShowAddDropdown] = useState(false);
  const [showBottomOverlay, setShowBottomOverlay] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // Item being edited in overlay
  const [overlayInputValue, setOverlayInputValue] = useState("");
  const [addingNewItem, setAddingNewItem] = useState(false); // True when adding new item, false when editing

  // ── personas ──
  const [personas, setPersonas] = useState(defaultPersonas);
  const [selId, setSelId] = useState(defaultPersonas[0].id);   // store only the id
  const selPersona = personas.find(p => p.id === selId) || personas[0] || null; // derive live
  const [showDrop, setShowDrop] = useState(false);
  const [selTopics, setSelTopics] = useState([]);

  // ── AI summary ──
  const [summary, setSummary] = useState(null);
  const [sumLoading, setSumLoading] = useState(false);

  // ── text chat ──
  const [msgs, setMsgs] = useState([]);
  const [chatIn, setChatIn] = useState("");
  const [thinking, setThinking] = useState(false);
  const chatEnd = useRef(null);
  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);
  useEffect(() => { setMsgs([]); setSelTopics([]); }, [selId]);

  // ── available voices cache ──
  const [voices, setVoices] = useState([]);
  useEffect(() => {
    const load = () => {
      const vs = window.speechSynthesis?.getVoices() || [];
      if (vs.length) setVoices(vs);
    };
    load();
    window.speechSynthesis?.addEventListener("voiceschanged", load);
    return () => window.speechSynthesis?.removeEventListener("voiceschanged", load);
  }, []);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ── VOICE ENGINE
  //
  // Previous bug: speak() and listen() were both useCallback with dependency
  // arrays.  speak's utt.onend called listen — but it captured the listen closure
  // that existed when speak was first created.  That listen in turn held a stale
  // speak.  The loop died silently after the greeting.
  //
  // Fix: speak and listen are plain functions re-created every render (so they
  // always close over current state).  They are stored in refs (speakRef /
  // listenRef).  Every async callback dereferences the ref at call-time, so it
  // always reaches the latest version.
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const callRef      = useRef(false);
  const msgsRef      = useRef([]);
  const statusRef    = useRef("idle");
  const transcriptRef= useRef("");
  const recRef       = useRef(null);
  const speakRef     = useRef(null);   // holds current speak fn
  const listenRef    = useRef(null);   // holds current listen fn

  // React state mirrors (render triggers only)
  const [callActive, _setCall]           = useState(false);
  const [voiceMsgs, _setMsgs]           = useState([]);
  const [voiceStatus, _setStatus]       = useState("idle");
  const [transcript, _setTranscript]    = useState("");

  // Synced writers
  function setCall(v)     { callRef.current = v;       _setCall(v); }
  function pushMsg(m)     { msgsRef.current = [...msgsRef.current, m]; _setMsgs([...msgsRef.current]); }
  function setStatus(v)   { statusRef.current = v;     _setStatus(v); }
  function setLiveText(v) { transcriptRef.current = v; _setTranscript(v); }
  function resetMsgs()    { msgsRef.current = [];      _setMsgs([]); }

  const voiceEnd = useRef(null);
  useEffect(() => { voiceEnd.current?.scrollIntoView({ behavior: "smooth" }); }, [voiceMsgs]);

  // ── speak ──────────────────────────────────────────────────────────────────
  // Plain function.  Closes over current selPersona + voices every render.
  // Stored in speakRef so listen's async onresult can call it.
  const speak = (text) => {
    if (!text || !callRef.current) return;
    setStatus("speaking");
    const synth = window.speechSynthesis;
    synth.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    const vs  = selPersona?.voiceSettings || {};
    utt.rate   = vs.rate  ?? 1;
    utt.pitch  = vs.pitch ?? 1;
    utt.volume = 1;
    if (vs.voiceIndex != null && vs.voiceIndex >= 0 && voices[vs.voiceIndex]) {
      utt.voice = voices[vs.voiceIndex];
    }
    // After speaking finishes, go idle. User taps mic button to speak next.
    utt.onend   = () => { if (callRef.current) { setStatus("idle"); } };
    utt.onerror = () => { if (callRef.current) { setStatus("idle"); } };
    synth.speak(utt);
  };
  speakRef.current = speak;   // keep ref up to date every render

  // ── listen ─────────────────────────────────────────────────────────────────
  const listen = () => {
    if (!callRef.current) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    if (recRef.current) { try { recRef.current.stop(); } catch {} recRef.current = null; }

    const rec = new SR();
    rec.continuous     = false;
    rec.interimResults = true;
    rec.lang           = "en-US";
    recRef.current     = rec;

    rec.onstart = () => { setStatus("listening"); };

    rec.oninterimresult = (e) => {
      const t = Array.from(e.results).map(r => r[0].transcript).join("");
      setLiveText(t);
    };

    rec.onresult = async (e) => {
      const final = Array.from(e.results)
        .filter(r => r.isFinal)
        .map(r => r[0].transcript)
        .join("")
        .trim();
      setLiveText("");
      if (!final || !callRef.current) {
        setStatus("idle");
        return;
      }

      pushMsg({ role: "user", content: final });
      setStatus("thinking");

      try {
        const p   = selPersona;
        const history = msgsRef.current.map(m => ({ role: m.role, content: m.content }));
        const res = await fetch("/api/voice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: history,
            persona: p,
            summary: summary ? summary.slice(0, 600) : null
          })
        });
        const data  = await res.json();
        const reply = data.reply || "Interesting — tell me more.";
        pushMsg({ role: "assistant", content: reply });
        if (callRef.current) speakRef.current?.(reply);
      } catch {
        const fb = "That's interesting. Can you elaborate?";
        pushMsg({ role: "assistant", content: fb });
        if (callRef.current) speakRef.current?.(fb);
      }
    };

    rec.onerror = (e) => {
      // On any error (including no-speech timeout), go idle. User taps mic to retry.
      setStatus("idle");
    };

    rec.onend = () => {
      // Recognition ended. Stay idle — user taps mic again to speak next turn.
      if (callRef.current && statusRef.current === "listening") { setStatus("idle"); }
    };

    rec.start();
  };
  listenRef.current = listen;  // keep ref up to date every render

  // ── start / end call ───────────────────────────────────────────────────────
  const startCall = () => {
    resetMsgs();
    setLiveText("");
    setCall(true);
    const p = selPersona;
    const greeting = `Hi! I'm ${p?.name} from ${p?.firm}. Great to connect — tell me about what you're building.`;
    pushMsg({ role: "assistant", content: greeting });
    setStatus("speaking");
    setTimeout(() => speakRef.current?.(greeting), 250);
  };

  const endCall = () => {
    setCall(false);
    setStatus("idle");
    setLiveText("");
    if (recRef.current) { try { recRef.current.stop(); } catch {} recRef.current = null; }
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  };

  // cleanup on unmount
  useEffect(() => () => endCall(), []);

  // ─── FILE UPLOAD + AI SUMMARY ──────────────────────────────────────────────
  const handleUpload = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreviewMode("deck");
    setPreviewUrl(URL.createObjectURL(f));
    setSumLoading(true); setSummary(null);
    try {
      // Send file data to serverless function
      const fileData = f.name.toLowerCase().endsWith(".pdf") ? btoa(String.fromCharCode(...new Uint8Array(await f.arrayBuffer()))) : null;
      const res = await fetch("/api/summary", {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileData: fileData,
          fileName: f.name,
          fileType: f.type || (f.name.toLowerCase().endsWith(".pdf") ? "application/pdf" : "application/vnd.openxmlformats-officedocument.presentationml.presentation")
        })
      });
      const data = await res.json();
      setSummary(data.summary || "Summary unavailable.");
    } catch { setSummary("AI summary unavailable. Please review the deck manually."); }
    setSumLoading(false);
  };

  const fetchWebsiteText = async (url) => {
    setTextLoading(true);
    setWebsiteText(null);
    try {
      // Use a CORS proxy to fetch the website content
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl);
      const data = await response.json();
      
      if (data.contents) {
        // Create a temporary DOM element to parse HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(data.contents, 'text/html');
        
        // Remove script and style elements
        const scripts = doc.querySelectorAll('script, style, noscript');
        scripts.forEach(el => el.remove());
        
        // Extract all text content
        const bodyText = doc.body?.innerText || doc.body?.textContent || '';
        
        // Clean up the text - remove excessive whitespace
        const cleanText = bodyText
          .replace(/\s+/g, ' ')
          .replace(/\n\s*\n/g, '\n\n')
          .trim();
        
        setWebsiteText(cleanText);
      }
    } catch (error) {
      console.error('Error fetching website text:', error);
      setWebsiteText("Unable to extract website content. Please open the website in a new tab to view it.");
    }
    setTextLoading(false);
  };

  // Helper functions for content items
  const getItemIcon = (type) => {
    switch(type) {
      case "website": return <LinkIcon w={20} h={20} />;
      case "pitchdeck": return <UploadIcon w={20} h={20} />;
      case "figma": return <img src="https://cdn.simpleicons.org/figma/7963D0" alt="Figma" style={{ width: 20, height: 20 }} />;
      case "survey": return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7963D0" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
      case "image": return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7963D0" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>;
      case "document": return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7963D0" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
      default: return <UploadIcon w={20} h={20} />;
    }
  };

  const selectContentItem = (itemId) => {
    setSelectedContentItem(itemId);
    const item = contentItems.find(i => i.id === itemId);
    if (item) {
      if (item.type === "website" || item.type === "figma" || item.type === "survey") {
        setPreviewUrl(item.url);
        setPreviewMode("website");
        setIframeLoading(true);
      } else if (item.type === "pitchdeck" || item.type === "document") {
        setFile(item.file);
        setPreviewUrl(item.url);
        setPreviewMode("deck");
      } else if (item.type === "image") {
        setPreviewUrl(item.url);
        setPreviewMode("image");
      } else {
        // For other types (marketingassets, adcopy, email, branding), set a text preview mode
        setPreviewMode("text");
        setPreviewUrl(null);
      }
    }
  };

  const addContentItem = (type, name, urlOrFile) => {
    const newItem = {
      id: Date.now(),
      type,
      name,
      url: urlOrFile instanceof File ? URL.createObjectURL(urlOrFile) : urlOrFile,
      file: urlOrFile instanceof File ? urlOrFile : null,
      selected: false
    };
    setContentItems(prev => [...prev, newItem]);
    setShowBottomOverlay(false);
    setAddModalType(null);
    setAddingNewItem(false);
    setOverlayInputValue("");
    // Auto-select the newly added item
    selectContentItem(newItem.id);
  };

  const toggleItemSelection = (itemId) => {
    setContentItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, selected: !item.selected } : item
    ));
    setSelectedItems(prev => {
      const item = contentItems.find(i => i.id === itemId);
      if (item?.selected) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  const handleUpdateItem = () => {
    if (!editingItem || !overlayInputValue.trim()) return;
    
    setContentItems(prev => prev.map(item => {
      if (item.id === editingItem.id) {
        const updated = {
          ...item,
          name: overlayInputValue.includes("http") ? overlayInputValue.replace(/^https?:\/\//, '').split('/')[0] : overlayInputValue,
          url: overlayInputValue
        };
        // Update preview if this is the selected item
        if (selectedContentItem === item.id) {
          if (item.type === "website" || item.type === "figma") {
            setPreviewUrl(overlayInputValue);
            setPreviewMode("website");
            setIframeLoading(true);
          }
        }
        return updated;
      }
      return item;
    }));
    
    setShowBottomOverlay(false);
    setEditingItem(null);
    setOverlayInputValue("");
  };

  const handleUpdateItemFile = (file) => {
    if (!editingItem || !file) return;
    
    const fileUrl = URL.createObjectURL(file);
    setContentItems(prev => prev.map(item => {
      if (item.id === editingItem.id) {
        const updated = {
          ...item,
          name: file.name,
          url: fileUrl,
          file: file
        };
        // Update preview if this is the selected item
        if (selectedContentItem === item.id) {
          setFile(file);
          setPreviewUrl(fileUrl);
          setPreviewMode("deck");
        }
        return updated;
      }
      return item;
    }));
    
    setShowBottomOverlay(false);
    setEditingItem(null);
    setOverlayInputValue("");
  };

  const handleAddNewItem = () => {
    if (!addModalType || !overlayInputValue.trim()) return;
    
    let url = overlayInputValue.trim();
    if ((addModalType === "website" || addModalType === "figma" || addModalType === "survey") && !url.startsWith("http")) {
      url = "https://" + url;
    }
    
    const name = addModalType === "website" ? url.replace(/^https?:\/\//, '').split('/')[0] : overlayInputValue.trim();
    addContentItem(addModalType, name, url);
    
    setShowBottomOverlay(false);
    setAddingNewItem(false);
    setAddModalType(null);
    setOverlayInputValue("");
  };

  const handleAddNewItemFile = (file) => {
    if (!addModalType || !file) return;
    
    addContentItem(addModalType, file.name, file);
    
    setShowBottomOverlay(false);
    setAddingNewItem(false);
    setAddModalType(null);
    setOverlayInputValue("");
  };

  const handleUrlSubmit = () => {
    if (!webUrl.trim()) return;
    let u = webUrl.trim();
    if (!u.startsWith("http")) u = "https://" + u;
    addContentItem("website", u.replace(/^https?:\/\//, '').split('/')[0], u);
    setWebUrl("");
    setPreviewUrl(u); 
    setPreviewMode("website"); 
    setSummary(null);
    setIframeError(false);
    setIframeLoading(true);
    setWebsiteText(null);
    
    // Clear any existing timeout
    if (iframeTimeoutRef.current) {
      clearTimeout(iframeTimeoutRef.current);
    }
    
    // Set timeout only to hide loading spinner, but always show iframe
    iframeTimeoutRef.current = setTimeout(() => {
      setIframeLoading(false);
    }, 2000);
  };

  const handleIframeError = () => {
    // Don't set error, just hide loading spinner - always show iframe
    setIframeLoading(false);
    if (iframeTimeoutRef.current) {
      clearTimeout(iframeTimeoutRef.current);
    }
  };

  const handleIframeLoad = (e) => {
    // Always hide loading spinner when iframe loads, regardless of content
    setIframeLoading(false);
    if (iframeTimeoutRef.current) {
      clearTimeout(iframeTimeoutRef.current);
    }
  };

  const openWebsiteInNewTab = () => {
    if (previewUrl) {
      window.open(previewUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => () => {
    if (iframeTimeoutRef.current) {
      clearTimeout(iframeTimeoutRef.current);
    }
  }, []);

  // ── SIMULATION FUNCTIONS ──────────────────────────────────────────────────
  const startSimulation = () => {
    if (simulationPersonas.length === 0) {
      setShowPersonaSelector(true);
      return;
    }
    setSimulationActive(true);
    setSelectedSimPersona(simulationPersonas[0]?.id || null);
    // Initialize feedback for all selected personas
    const initialFeedback = {};
    simulationPersonas.forEach(p => {
      initialFeedback[p.id] = { text: "Reviewing website...", sentiment: "neutral" };
    });
    setPersonaFeedback(initialFeedback);
  };

  const addPersonaToSimulation = (personaId) => {
    if (simulationPersonas.find(p => p.id === personaId)) return;
    const persona = personas.find(p => p.id === personaId);
    if (persona) {
      setSimulationPersonas(prev => [...prev, persona]);
    }
  };

  const removePersonaFromSimulation = (personaId) => {
    setSimulationPersonas(prev => prev.filter(p => p.id !== personaId));
    if (selectedSimPersona === personaId) {
      setSelectedSimPersona(simulationPersonas.find(p => p.id !== personaId)?.id || null);
    }
    const newFeedback = { ...personaFeedback };
    delete newFeedback[personaId];
    setPersonaFeedback(newFeedback);
  };

  const generateFeedback = async (personaId, content) => {
    const persona = personas.find(p => p.id === personaId);
    if (!persona) return;

    try {
      const res = await fetch("/api/simulation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          persona: persona,
          content: content.slice(0, 1000),
          contentType: "website"
        })
      });
      const data = await res.json();
      const feedback = data.feedback || "";
      const sentiment = data.sentiment || "neutral";

      setPersonaFeedback(prev => ({
        ...prev,
        [personaId]: { text: feedback, sentiment }
      }));
    } catch (err) {
      console.error("Error generating feedback:", err);
    }
  };

  // Monitor iframe scroll and generate feedback
  useEffect(() => {
    if (!simulationActive || !iframeRef.current || previewMode !== "website") return;

    const iframe = iframeRef.current;
    let lastContent = "";
    let lastScrollPosition = 0;
    let feedbackTimeout = null;
    let lastFeedbackText = {};

    const checkContent = () => {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (iframeDoc) {
          const currentContent = iframeDoc.body?.innerText || "";
          const scrollPosition = iframeDoc.documentElement?.scrollTop || 0;
          
          // Check if user scrolled or content changed
          const hasScrolled = Math.abs(scrollPosition - lastScrollPosition) > 100;
          const contentChanged = currentContent !== lastContent && currentContent.length > 100;
          
          if ((hasScrolled || contentChanged) && currentContent.length > 100) {
            lastContent = currentContent;
            lastScrollPosition = scrollPosition;
            
            // Clear previous timeout
            if (feedbackTimeout) clearTimeout(feedbackTimeout);
            
            // Generate feedback for all simulation personas after a delay
            feedbackTimeout = setTimeout(() => {
              simulationPersonas.forEach(persona => {
                // Only generate if we don't have recent feedback or content changed significantly
                const existingFeedback = personaFeedback[persona.id];
                if (!existingFeedback || existingFeedback.text !== lastFeedbackText[persona.id]) {
                  generateFeedback(persona.id, currentContent);
                  lastFeedbackText[persona.id] = existingFeedback?.text || "";
                }
              });
            }, 1500);
          }
        }
      } catch (err) {
        // Cross-origin - can't access content, use website text instead
        if (websiteText && websiteText.length > 100) {
          if (feedbackTimeout) clearTimeout(feedbackTimeout);
          feedbackTimeout = setTimeout(() => {
            simulationPersonas.forEach(persona => {
              const existingFeedback = personaFeedback[persona.id];
              if (!existingFeedback || !existingFeedback.text.includes("Reviewing")) {
                generateFeedback(persona.id, websiteText);
              }
            });
          }, 2000);
        }
      }
    };

    // Check periodically
    const interval = setInterval(checkContent, 2000);
    
    // Also listen for scroll events if possible
    try {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (iframeDoc) {
        iframeDoc.addEventListener('scroll', checkContent, true);
      }
    } catch (err) {
      // Cross-origin
    }
    
    return () => {
      clearInterval(interval);
      if (feedbackTimeout) clearTimeout(feedbackTimeout);
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (iframeDoc) {
          iframeDoc.removeEventListener('scroll', checkContent, true);
        }
      } catch (err) {
        // Cross-origin
      }
    };
  }, [simulationActive, simulationPersonas, previewMode, previewUrl, websiteText, personaFeedback]);

  // ── TEXT CHAT ──────────────────────────────────────────────────────────────
  const sysPrompt = () => {
    const p = selPersona;
    return `You are ${p?.name}, a ${p?.type} at ${p?.firm}. ${p?.context || ""}
Respond in character. Ask probing questions. Keep to 2-4 sentences.
${selTopics.length ? "Topics: " + selTopics.join(", ") + "." : ""}
${summary ? "Deck context: " + summary.slice(0, 800) : ""}`;
  };
  const sendMsg = async (text) => {
    if (!text?.trim()) return;
    setMsgs(prev => [...prev, { role: "user", content: text.trim() }]);
    setThinking(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...msgs.map(m => ({ role: m.role, content: m.content })), { role: "user", content: text.trim() }],
          persona: selPersona,
          summary: summary ? summary.slice(0, 800) : null,
          topics: selTopics
        })
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error("API Error:", res.status, errorText);
        throw new Error(`API error: ${res.status} - ${errorText}`);
      }
      
      const data = await res.json();
      if (data.error) {
        console.error("API returned error:", data);
        throw new Error(data.error);
      }
      
      setMsgs(prev => [...prev, { role: "assistant", content: data.reply || "Tell me more." }]);
    } catch (err) {
      console.error("Chat error:", err);
      const errorMsg = err.message || "Failed to get response. Please check your API key in Vercel settings.";
      setMsgs(prev => [...prev, { role: "assistant", content: `Error: ${errorMsg}` }]);
    }
    setThinking(false);
  };

  // ── PERSONAS TAB ───────────────────────────────────────────────────────────
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: "", firm: "", type: "Venture Capitalist", context: "", avatar: "", voiceSettings: { voiceIndex: -1, rate: 1, pitch: 1 } });
  const [avatarPre, setAvatarPre] = useState("");
  const [voicePreviewPlaying, setVoicePreviewPlaying] = useState(false);
  const avatarRef = useRef(null);
  const personaTypes = ["Venture Capitalist", "Target Customer", "Angel Investor", "Corporate VC", "Private Equity", "Strategic Partner", "Industry Advisor"];

  const resetForm = () => { setForm({ name: "", firm: "", type: "Venture Capitalist", context: "", avatar: "", voiceSettings: { voiceIndex: -1, rate: 1, pitch: 1 } }); setAvatarPre(""); setShowForm(false); setEditId(null); };
  const savePersona = () => {
    if (!form.name || !form.firm) return;
    if (editId !== null) setPersonas(prev => prev.map(p => p.id === editId ? { ...p, ...form, avatar: form.avatar || p.avatar } : p));
    else setPersonas(prev => [...prev, { ...form, id: Date.now(), avatar: form.avatar || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`, topics: [] }]);
    resetForm();
  };
  const previewVoice = () => {
    const synth = window.speechSynthesis;
    if (voicePreviewPlaying) { synth.cancel(); setVoicePreviewPlaying(false); return; }
    synth.cancel();
    const utt = new SpeechSynthesisUtterance(`Hi, I'm ${form.name || "the investor"} from ${form.firm || "the firm"}. Nice to meet you. I'm excited to hear about your company.`);
    utt.rate  = form.voiceSettings?.rate  ?? 1;
    utt.pitch = form.voiceSettings?.pitch ?? 1;
    if (form.voiceSettings?.voiceIndex >= 0 && voices[form.voiceSettings.voiceIndex]) utt.voice = voices[form.voiceSettings.voiceIndex];
    utt.onend  = () => setVoicePreviewPlaying(false);
    utt.onerror = () => setVoicePreviewPlaying(false);
    setVoicePreviewPlaying(true);
    synth.speak(utt);
  };

  const enVoices = voices.filter(v => v.lang?.startsWith("en"));

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // RENDER
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  return (
    <div style={{ fontFamily: "'DM Sans','Segoe UI',system-ui,sans-serif", background: "#FCFCFC", minHeight: "100vh", width: "100%", color: "#181818", display: "flex", flexDirection: "column", position: "relative" }}>

      {/* ════ HEADER ════ */}
      <header style={{ background: "#FCFCFC", borderBottom: "1px solid #E5E5E5", position: "sticky", top: 0, zIndex: 50, width: "100%", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: mob ? "12px 16px" : tab ? "14px 20px" : "16px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 0, flexShrink: 0 }}>
            <img 
              src={logoImage} 
              alt="Purple Builder" 
              style={{ 
                height: mob ? 32 : 40, 
                width: "auto",
                objectFit: "contain"
              }} 
            />
            </div>
          <div style={{ display: "flex", gap: 4, background: "#F5F5F5", borderRadius: 12, padding: 4, boxShadow: "inset 0 1px 2px rgba(0,0,0,0.03)" }}>
            {[{ k: "builder", l: "Builder" }, { k: "personas", l: "AI Personas" }].map(t => (
              <button key={t.k} onClick={() => setActiveTab(t.k)} style={{
                padding: mob ? "7px 16px" : "8px 22px", borderRadius: 8, border: "none",
                background: activeTab === t.k ? "#FCFCFC" : "transparent", color: activeTab === t.k ? "#7963D0" : "#6B6B6B",
                fontWeight: activeTab === t.k ? 700 : 500, fontSize: mob ? 12.5 : 13.5, cursor: "pointer",
                boxShadow: activeTab === t.k ? "0 2px 6px rgba(121,99,208,0.12)" : "none", transition: "all .2s ease"
              }}>{t.l}</button>
            ))}
          </div>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#7963D0", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 13, fontWeight: 700, boxShadow: "0 2px 8px rgba(121,99,208,0.25)" }}>PB</div>
        </div>
      </header>

      {/* ════════════ BUILDER TAB ════════════ */}
      {activeTab === "builder" && !callActive && (
        <div style={{ flex: 1, maxWidth: 1400, margin: "0 auto", width: "100%", padding: mob ? "12px 14px" : tab ? "16px 20px" : "20px 32px", display: "flex", gap: mob ? 16 : tab ? 18 : 20, flexDirection: mob ? "column" : "row" }}>

          {/* LEFT SIDEBAR: Grey bar with assets */}
          <div style={{ 
            width: mob ? "100%" : 280, 
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: 16
          }}>
            {/* Grey bar */}
            <div style={{ 
              background: "#F5F5F5", 
              borderRadius: 12, 
              padding: "12px 16px", 
              display: "flex", 
              gap: 12, 
              alignItems: "flex-start",
              position: "relative",
              minHeight: 60
            }}>
              {/* Left: Added assets list */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8, minWidth: 0 }}>
                {contentItems.length === 0 ? (
                  <div style={{ fontSize: 12, color: "#6B6B6B", padding: "8px 0" }}>No assets yet</div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: mob ? 200 : "calc(100vh - 300px)", overflowY: "auto" }}>
                    {contentItems.map(item => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setEditingItem(item);
                          setAddingNewItem(false);
                          setOverlayInputValue(item.type === "website" || item.type === "figma" || item.type === "survey" ? (item.url || "") : "");
                          setShowBottomOverlay(true);
                          selectContentItem(item.id);
                        }}
                        style={{
                          background: selectedContentItem === item.id ? "#FCFCFC" : "transparent",
                          borderRadius: 8,
                          padding: "8px 10px",
                          border: `1px solid ${selectedContentItem === item.id ? "#7963D0" : "transparent"}`,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          transition: "all .15s",
                          textAlign: "left",
                          width: "100%"
                        }}
                        onMouseEnter={e => { if (selectedContentItem !== item.id) e.currentTarget.style.background = "#FCFCFC"; }}
                        onMouseLeave={e => { if (selectedContentItem !== item.id) e.currentTarget.style.background = "transparent"; }}
                      >
                        <div style={{ flexShrink: 0 }}>
                          {getItemIcon(item.type)}
                </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: "#181818", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</div>
                          <div style={{ fontSize: 10, color: "#6B6B6B", textTransform: "capitalize" }}>{item.type}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: Plus button */}
              <div style={{ flexShrink: 0, position: "relative" }}>
                <button 
                  onClick={() => setShowAddDropdown(!showAddDropdown)} 
                  style={{
                    background: "#FCFCFC", 
                    borderRadius: 8, 
                    padding: "8px", 
                    border: "1px solid #E5E5E5",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)", 
                    cursor: "pointer", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    transition: "all .15s", 
                    width: 32, 
                    height: 32
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#7963D0"; e.currentTarget.style.background = "#F5F3FF"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#E5E5E5"; e.currentTarget.style.background = "#FCFCFC"; }}
                >
                  <PlusIcon />
                </button>
                
                {/* Dropdown menu */}
                {showAddDropdown && (
                  <div style={{
                    position: "absolute", 
                    top: "calc(100% + 8px)", 
                    right: 0,
                    background: "#FCFCFC", 
                    borderRadius: 12, 
                    border: "1px solid #E5E5E5",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)", 
                    padding: 8, 
                    zIndex: 100,
                    display: "flex", 
                    flexDirection: "column", 
                    gap: 4, 
                    minWidth: 180
                  }}>
                    {[
                      { type: "figma", label: "Figma", icon: <img src="https://cdn.simpleicons.org/figma/7963D0" alt="Figma" style={{ width: 16, height: 16 }} /> },
                      { type: "survey", label: "Survey", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7963D0" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
                      { type: "website", label: "Website", icon: <LinkIcon w={16} h={16} /> },
                      { type: "pitchdeck", label: "Pitch Deck", icon: <UploadIcon w={16} h={16} /> },
                      { type: "document", label: "Document", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7963D0" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
                      { type: "image", label: "Image", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7963D0" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg> },
                      { type: "marketingassets", label: "Marketing Assets", icon: <UploadIcon w={16} h={16} /> },
                      { type: "branding", label: "Branding", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7963D0" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg> },
                      { type: "adcopy", label: "Ad Copy", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7963D0" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg> },
                      { type: "email", label: "Email", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7963D0" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg> }
                    ].map(opt => (
                      <button 
                        key={opt.type} 
                        onClick={() => { 
                          setAddModalType(opt.type); 
                          setAddingNewItem(true);
                          setOverlayInputValue("");
                          setShowBottomOverlay(true);
                          setShowAddDropdown(false);
                        }} 
                        style={{
                          padding: "10px 14px", 
                          borderRadius: 8, 
                          border: "none", 
                          background: "transparent",
                          cursor: "pointer", 
                          textAlign: "left", 
                          fontSize: 12.5, 
                          fontWeight: 500, 
                          color: "#181818",
                          transition: "all .15s", 
                          display: "flex", 
                          alignItems: "center", 
                          gap: 10
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = "#F5F5F5"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                      >
                        {opt.icon}
                        {opt.label}
                      </button>
                    ))}
              </div>
                )}
                </div>
                  </div>
                </div>

          {/* RIGHT: Main content area */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 20, minWidth: 0 }}>
            {/* Items list view - always show, even when empty */}
            {contentItems.length === 0 ? (
              <div style={{ 
                background: "#F5F5F5", 
                borderRadius: 16, 
                padding: mob ? "40px 24px" : "60px 40px",
                minHeight: mob ? "calc(100vh - 200px)" : "calc(100vh - 180px)",
                display: "flex", 
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 24
              }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24, flex: 1 }}>
                  <div style={{ textAlign: "center", marginBottom: 8 }}>
                    <div style={{ fontSize: mob ? 20 : 24, fontWeight: 700, color: "#181818", marginBottom: 8 }}>
                      Start by adding your pitch deck, website, or other assets
              </div>
                    <div style={{ fontSize: 13, color: "#6B6B6B" }}>Choose an option below to get started</div>
            </div>
                  <div style={{ 
                    display: "grid", 
                    gridTemplateColumns: mob ? "1fr" : "repeat(3, 1fr)", 
                    gap: 16, 
                    width: "100%",
                    maxWidth: 800
                  }}>
                    {/* Survey */}
                    <button onClick={() => { 
                      setAddModalType("survey"); 
                      setAddingNewItem(true);
                      setOverlayInputValue("");
                      setShowBottomOverlay(true);
                    }} style={{
                      background: "#FCFCFC", borderRadius: 12, padding: "24px 20px", border: "1px solid #E5E5E5",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.06)", cursor: "pointer", display: "flex", flexDirection: "column",
                      alignItems: "center", gap: 10, transition: "all .2s ease"
                    }}
                      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)"; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)"; }}>
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#7963D0" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      <span style={{ fontSize: 14, fontWeight: 700, color: "#181818" }}>Survey</span>
                      <span style={{ fontSize: 11, color: "#6B6B6B", textAlign: "center" }}>Add survey link</span>
                    </button>
                    
                    {/* Figma */}
                    <button onClick={() => { 
                      setAddModalType("figma"); 
                      setAddingNewItem(true);
                      setOverlayInputValue("");
                      setShowBottomOverlay(true);
                    }} style={{
                      background: "#FCFCFC", borderRadius: 12, padding: "24px 20px", border: "1px solid #E5E5E5",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.06)", cursor: "pointer", display: "flex", flexDirection: "column",
                      alignItems: "center", gap: 10, transition: "all .2s ease"
                    }}
                      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)"; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)"; }}>
                      <img src="https://cdn.simpleicons.org/figma/7963D0" alt="Figma" style={{ width: 40, height: 40 }} />
                      <span style={{ fontSize: 14, fontWeight: 700, color: "#181818" }}>Figma</span>
                      <span style={{ fontSize: 11, color: "#6B6B6B", textAlign: "center" }}>Add Figma design</span>
                    </button>
                    
                    {/* Website */}
                    <button onClick={() => { 
                      setAddModalType("website"); 
                      setAddingNewItem(true);
                      setOverlayInputValue("");
                      setShowBottomOverlay(true);
                    }} style={{
                      background: "#FCFCFC", borderRadius: 12, padding: "24px 20px", border: "1px solid #E5E5E5",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.06)", cursor: "pointer", display: "flex", flexDirection: "column",
                      alignItems: "center", gap: 10, transition: "all .2s ease"
                    }}
                      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)"; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)"; }}>
                      <LinkIcon w={40} h={40} style={{ color: "#7963D0" }} />
                      <span style={{ fontSize: 14, fontWeight: 700, color: "#181818" }}>Website</span>
                      <span style={{ fontSize: 11, color: "#6B6B6B", textAlign: "center" }}>Add website URL</span>
                    </button>
                    
                    {/* Pitch Deck */}
                    <button onClick={() => { 
                      setAddModalType("pitchdeck"); 
                      setAddingNewItem(true);
                      setOverlayInputValue("");
                      setShowBottomOverlay(true);
                    }} style={{
                      background: "#FCFCFC", borderRadius: 12, padding: "24px 20px", border: "1px solid #E5E5E5",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.06)", cursor: "pointer", display: "flex", flexDirection: "column",
                      alignItems: "center", gap: 10, transition: "all .2s ease"
                    }}
                      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)"; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)"; }}>
                      <UploadIcon w={40} h={40} style={{ color: "#7963D0" }} />
                      <span style={{ fontSize: 14, fontWeight: 700, color: "#181818" }}>Pitch Deck</span>
                      <span style={{ fontSize: 11, color: "#6B6B6B", textAlign: "center" }}>Upload PDF/PPTX</span>
                    </button>
                    
                    {/* Document */}
                    <button onClick={() => { 
                      setAddModalType("document"); 
                      setAddingNewItem(true);
                      setOverlayInputValue("");
                      setShowBottomOverlay(true);
                    }} style={{
                      background: "#FCFCFC", borderRadius: 12, padding: "24px 20px", border: "1px solid #E5E5E5",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.06)", cursor: "pointer", display: "flex", flexDirection: "column",
                      alignItems: "center", gap: 10, transition: "all .2s ease"
                    }}
                      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)"; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)"; }}>
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#7963D0" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                      <span style={{ fontSize: 14, fontWeight: 700, color: "#181818" }}>Document</span>
                      <span style={{ fontSize: 11, color: "#6B6B6B", textAlign: "center" }}>Upload document</span>
                    </button>
                    
                    {/* Image */}
                    <button onClick={() => { 
                      setAddModalType("image"); 
                      setAddingNewItem(true);
                      setOverlayInputValue("");
                      setShowBottomOverlay(true);
                    }} style={{
                      background: "#FCFCFC", borderRadius: 12, padding: "24px 20px", border: "1px solid #E5E5E5",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.06)", cursor: "pointer", display: "flex", flexDirection: "column",
                      alignItems: "center", gap: 10, transition: "all .2s ease"
                    }}
                      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)"; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)"; }}>
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#7963D0" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                      <span style={{ fontSize: 14, fontWeight: 700, color: "#181818" }}>Image</span>
                      <span style={{ fontSize: 11, color: "#6B6B6B", textAlign: "center" }}>Upload image</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
                  {/* Preview section */}
                  {selectedContentItem && (
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
                      {/* Preview container */}
                      <div style={{ flex: 1, background: "#FCFCFC", borderRadius: 14, border: "1px solid #E5E5E5", overflow: "hidden", minHeight: mob ? 400 : 500, position: "relative" }}>
                        {/* Preview content will go here - same as before */}
                        {previewMode === "website" && (
                          <div style={{ position: "relative", width: "100%", height: "100%" }}>
                            {iframeLoading && (
                              <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(252,252,252,.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 5 }}>
                                <div style={{ textAlign: "center" }}>
                                  <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 8 }}>
                                    {[0, 1, 2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#7963D0", animation: `pb-bounce 1.2s ${i * .2}s infinite` }} />)}
                                  </div>
                                  <div style={{ fontSize: 11, color: "#7963D0", fontWeight: 500 }}>Loading...</div>
                                </div>
                              </div>
                            )}
                            <iframe ref={iframeRef} src={previewUrl} style={{ width: "100%", height: "100%", border: "none" }} title="Site" 
                              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
                              onError={handleIframeError} onLoad={handleIframeLoad} />
                          </div>
                        )}
                        {previewMode === "deck" && (
                          <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#FCFCFC" }}>
                            {file?.name?.toLowerCase().endsWith(".pdf") ? (
                              <object data={previewUrl} type="application/pdf" style={{ width: "100%", height: "100%" }}><iframe src={previewUrl} style={{ width: "100%", height: "100%", border: "none" }} title="PDF" /></object>
                            ) : (
                              <div style={{ textAlign: "center", color: "#6B6B6B" }}>
                                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#7963D0" strokeWidth="1.3" style={{ marginBottom: 8 }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                                <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>"{file?.name}"</p>
                                <p style={{ margin: "4px 0 0", fontSize: 11, color: "#9CA3AF" }}>PPTX uploaded</p>
                              </div>
                            )}
                          </div>
                        )}
                        {previewMode === "image" && (
                          <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#FCFCFC", padding: 20 }}>
                            <img src={previewUrl} alt="Preview" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: 8 }} />
                          </div>
                        )}
                        {previewMode === "text" && (
                          <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#FCFCFC", padding: 40 }}>
                            <div style={{ textAlign: "center", maxWidth: 600 }}>
                              {(() => {
                                const item = contentItems.find(i => i.id === selectedContentItem);
                                if (!item) return null;
                                return (
                                  <>
                                    <div style={{ marginBottom: 16 }}>
                                      {getItemIcon(item.type)}
                                    </div>
                                    <div style={{ fontSize: 18, fontWeight: 700, color: "#181818", marginBottom: 8 }}>{item.name}</div>
                                    <div style={{ fontSize: 13, color: "#6B6B6B", textTransform: "capitalize" }}>{item.type}</div>
                                    {item.url && (
                                      <div style={{ marginTop: 16, padding: 12, background: "#F5F5F5", borderRadius: 8, fontSize: 12, color: "#6B6B6B", wordBreak: "break-all" }}>
                                        {item.url}
                                      </div>
                                    )}
                                  </>
                                );
                              })()}
                            </div>
                          </div>
                        )}
                        {!previewMode && selectedContentItem && (
                          <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#FCFCFC" }}>
                            <div style={{ textAlign: "center", color: "#6B6B6B" }}>
                              <div style={{ fontSize: 14, fontWeight: 600 }}>Select an item to preview</div>
                            </div>
                          </div>
                        )}
                        
                        {/* Simulation overlay - show for all content types */}
                        {selectedContentItem && (
                          <div style={{ position: "absolute", bottom: 12, left: 12, right: 12, background: "#FCFCFC", border: "1px solid #E5E5E5", padding: "16px 18px", borderRadius: 12, boxShadow: "0 -4px 16px rgba(0,0,0,0.1)", zIndex: 10 }}>
                            {!simulationActive ? (
                              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
                                <span style={{ fontSize: 15, color: "#181818", fontWeight: 600 }}>Select personas and get real time feedback</span>
                                <button onClick={() => { if (simulationPersonas.length === 0) { setShowPersonaSelector(true); } else { startSimulation(); } }} style={{
                                  padding: "8px 16px", background: "#181818", color: "#fff", border: "none", borderRadius: 8,
                                  cursor: "pointer", fontWeight: 600, fontSize: 12.5, display: "flex", alignItems: "center", gap: 6,
                                  boxShadow: "0 2px 6px rgba(0,0,0,0.15)", transition: "all .2s ease", whiteSpace: "nowrap"
                                }}
                                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.25)"; }}
                                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.15)"; }}>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
                                  Start Simulation
                                </button>
                              </div>
                            ) : (
                              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
                                  {selectedSimPersona && (() => {
                                    const selected = personas.find(p => p.id === selectedSimPersona);
                                    if (!selected) return null;
                                    const feedback = personaFeedback[selectedSimPersona];
                                    return (
                                      <>
                                        <img src={selected.avatar} alt="" style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover", border: "2px solid #D4C5F0" }} />
                                        <div style={{ minWidth: 0, flex: 1 }}>
                                          <div style={{ fontSize: 12, fontWeight: 600, color: "#181818", marginBottom: 2 }}>Simulating with {selected.name}</div>
                                          {feedback && (
                                            <div style={{ fontSize: 11, color: "#6B6B6B", lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                              {feedback.text}
                                            </div>
                                          )}
                                        </div>
                                      </>
                                    );
                                  })()}
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                  {simulationPersonas.slice(0, 4).map(p => {
                                    const isSelected = selectedSimPersona === p.id;
                                    return (
                                      <button key={p.id} onClick={() => setSelectedSimPersona(p.id)} style={{
                                        display: "flex", alignItems: "center", gap: 6, padding: "6px 10px",
                                        background: isSelected ? "#F5F3FF" : "#FCFCFC", border: `1px solid ${isSelected ? "#7963D0" : "#E5E5E5"}`,
                                        borderRadius: 20, cursor: "pointer", transition: "all .15s"
                                      }}
                                        onMouseEnter={e => { if (!isSelected) { e.currentTarget.style.background = "#FAFAFA"; } }}
                                        onMouseLeave={e => { if (!isSelected) { e.currentTarget.style.background = "#FCFCFC"; } }}>
                                        <img src={p.avatar} alt="" style={{ width: 24, height: 24, borderRadius: "50%", objectFit: "cover" }} />
                                        <div style={{ textAlign: "left" }}>
                                          <div style={{ fontSize: 10.5, fontWeight: 600, color: "#181818" }}>{p.name}</div>
                                          <div style={{ fontSize: 9, color: "#9CA3AF" }}>{p.type}</div>
                                        </div>
                                      </button>
                                    );
                                  })}
                                  <button onClick={() => { setSimulationActive(false); setSelectedSimPersona(null); }} style={{
                                    padding: "6px 12px", background: "#F5F3FF", border: "1px solid #D4C5F0", borderRadius: 8,
                                    color: "#7963D0", cursor: "pointer", fontWeight: 600, fontSize: 11.5
                                  }}>Stop</button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Persona Selector Overlay */}
                        {showPersonaSelector && (
                          <div style={{
                            position: "absolute",
                            bottom: 100,
                            left: 12,
                            right: 12,
                            background: "#FCFCFC",
                            border: "1px solid #E5E5E5",
                            borderRadius: 12,
                            padding: 18,
                            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                            zIndex: 20,
                            maxHeight: 320,
                            overflowY: "auto"
                          }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                              <div style={{ fontSize: 13, fontWeight: 700, color: "#181818" }}>Select Personas for Simulation</div>
                              <button onClick={() => setShowPersonaSelector(false)} style={{
                                width: 24, height: 24, borderRadius: "50%", border: "none", background: "#F5F5F5",
                                color: "#6B6B6B", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"
                              }}><XIcon /></button>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                              {personas.map(p => {
                                const isSelected = simulationPersonas.find(sp => sp.id === p.id);
                                return (
                                  <button
                                    key={p.id}
                                    onClick={() => {
                                      if (isSelected) {
                                        removePersonaFromSimulation(p.id);
                                      } else {
                                        addPersonaToSimulation(p.id);
                                      }
                                    }}
                                    style={{
                                      width: "100%",
                                      padding: "10px 12px",
                                      background: isSelected ? "#F5F3FF" : "#FCFCFC",
                                      border: `1px solid ${isSelected ? "#7963D0" : "#E5E5E5"}`,
                                      borderRadius: 10,
                                      cursor: "pointer",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 10,
                                      transition: "all .15s"
                                    }}
                                    onMouseEnter={e => { if (!isSelected) { e.currentTarget.style.background = "#FAFAFA"; } }}
                                    onMouseLeave={e => { if (!isSelected) { e.currentTarget.style.background = "#FCFCFC"; } }}
                                  >
                                    <img src={p.avatar} alt="" style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }} />
                                    <div style={{ flex: 1, textAlign: "left" }}>
                                      <div style={{ fontSize: 12.5, fontWeight: 600, color: "#181818" }}>{p.name}</div>
                                      <div style={{ fontSize: 11, color: "#9CA3AF" }}>{p.firm} · {p.type}</div>
                                    </div>
                                    {isSelected && (
                                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7963D0" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                            <button onClick={() => { setShowPersonaSelector(false); if (simulationPersonas.length > 0) startSimulation(); }} style={{
                              width: "100%",
                              marginTop: 12,
                              padding: "10px 0",
                              background: "#7963D0",
                              color: "#fff",
                              border: "none",
                              borderRadius: 10,
                              cursor: "pointer",
                              fontWeight: 600,
                              fontSize: 12.5
                            }}>Start Simulation</button>
                          </div>
                        )}
                        
                        {/* Feedback Bubble for Selected Persona */}
                        {simulationActive && selectedSimPersona && personaFeedback[selectedSimPersona] && personaFeedback[selectedSimPersona].text && (
                          <div style={{
                            position: "absolute",
                            bottom: 100,
                            right: 12,
                            maxWidth: mob ? 280 : 320,
                            background: "#FCFCFC",
                            border: "1px solid #E5E5E5",
                            borderRadius: 12,
                            padding: "14px 16px",
                            boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                            zIndex: 15
                          }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                              <img src={personas.find(p => p.id === selectedSimPersona)?.avatar} alt="" style={{ width: 24, height: 24, borderRadius: "50%", objectFit: "cover", border: "2px solid #D4C5F0" }} />
                              <div style={{ fontSize: 11, fontWeight: 700, color: "#7963D0", textTransform: "uppercase", letterSpacing: ".6px" }}>
                                {personas.find(p => p.id === selectedSimPersona)?.name}'s Feedback
                              </div>
                            </div>
                            <div style={{ fontSize: 12.5, lineHeight: 1.6, color: "#181818", marginBottom: 10 }}>
                              {personaFeedback[selectedSimPersona].text}
                            </div>
                            <button onClick={() => {
                              const persona = personas.find(p => p.id === selectedSimPersona);
                              if (persona && personaFeedback[selectedSimPersona]) {
                                const feedbackText = `${persona.name}: ${personaFeedback[selectedSimPersona].text}`;
                                setMsgs(prev => [...prev, { role: "assistant", content: feedbackText }]);
                                sendMsg(`I saw your feedback: "${personaFeedback[selectedSimPersona].text}". Can you tell me more about this?`);
                              }
                            }} style={{
                              width: "100%",
                              padding: "6px 12px",
                              background: "transparent",
                              border: "1px solid #D4C5F0",
                              borderRadius: 8,
                              color: "#7963D0",
                              cursor: "pointer",
                              fontWeight: 600,
                              fontSize: 11,
                              transition: "all .15s",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 6
                            }}
                              onMouseEnter={e => { e.currentTarget.style.background = "#F5F3FF"; e.currentTarget.style.borderColor = "#7963D0"; }}
                              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "#D4C5F0"; }}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                              Respond in chat
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
          </div>

          {/* RIGHT: investor panel */}
          <div style={{ 
            width: mob ? "100%" : tab ? 260 : 280, 
            flexShrink: 0, 
            display: "flex", 
            flexDirection: "column", 
            gap: 14,
            position: mob ? "relative" : "sticky",
            top: mob ? "auto" : "72px",
            alignSelf: "flex-start",
            height: mob ? "auto" : "calc(100vh - 88px)",
            overflow: "hidden",
            willChange: "transform"
          }}>

            {/* Chat with Person - Combined Section */}
            <div style={{ 
              background: "#FCFCFC", 
              borderRadius: 14, 
              border: "1px solid #E5E5E5", 
              overflow: "hidden", 
              display: "flex", 
              flexDirection: "column", 
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              flex: 1,
              minHeight: 0,
              overflowY: "auto"
            }}>
              <div style={{ padding: "14px 18px 12px", borderBottom: "1px solid #E5E5E5", background: "linear-gradient(135deg, #FCFCFC 0%, #FAFAFA 100%)", flexShrink: 0 }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: ".8px" }}>Chat with Person</span>
              </div>

              {/* Person Selector */}
              <div style={{ padding: "16px", position: "relative", borderBottom: "1px solid #E5E5E5", flexShrink: 0 }}>
                <button onClick={() => setShowDrop(!showDrop)} style={{ width: "100%", padding: "12px 14px", border: "1px solid #E5E5E5", borderRadius: 10, background: "#FCFCFC", cursor: "pointer", display: "flex", alignItems: "center", gap: 11, transition: "all .2s ease", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#7963D0"; e.currentTarget.style.boxShadow = "0 2px 6px rgba(121,99,208,0.15)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#E5E5E5"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)"; }}>
                  <img src={selPersona?.avatar} alt="" style={{ width: 38, height: 38, borderRadius: "50%", objectFit: "cover", border: "2.5px solid #D4C5F0", boxShadow: "0 2px 4px rgba(121,99,208,0.15)" }} />
                  <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#181818", letterSpacing: "-0.2px" }}>{selPersona?.name}</div>
                    <div style={{ fontSize: 11.5, color: "#7963D0", fontWeight: 500, marginTop: 2 }}>{selPersona?.firm}</div>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                </button>
                {showDrop && (
                  <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 16, right: 16, background: "#FCFCFC", border: "1px solid #E5E5E5", borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,.12)", zIndex: 30, maxHeight: 240, overflowY: "auto" }}>
                    {personas.map(p => (
                      <button key={p.id} onClick={() => { setSelId(p.id); setShowDrop(false); }} style={{ width: "100%", padding: "10px 14px", border: "none", background: selPersona?.id === p.id ? "#F5F3FF" : "#FCFCFC", cursor: "pointer", display: "flex", alignItems: "center", gap: 11, transition: "all .15s" }}
                        onMouseEnter={e => { if (selPersona?.id !== p.id) e.currentTarget.style.background = "#FAFAFA"; }}
                        onMouseLeave={e => { if (selPersona?.id !== p.id) e.currentTarget.style.background = "#FCFCFC"; }}>
                        <img src={p.avatar} alt="" style={{ width: 34, height: 34, borderRadius: "50%", objectFit: "cover", border: "2px solid #E5E5E5" }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "#181818", letterSpacing: "-0.2px" }}>{p.name}</div>
                          <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>{p.firm} · {p.type}</div>
                        </div>
                        {selPersona?.id === p.id && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7963D0" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Discussion Topics */}
              {msgs.length === 0 && (
                <div style={{ padding: "14px 16px 16px", borderBottom: "1px solid #E5E5E5", background: "linear-gradient(135deg, #FCFCFC 0%, #FAFAFA 100%)", flexShrink: 0 }}>
                  <span style={{ fontSize: 10.5, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: ".8px", marginBottom: 10, display: "block" }}>Discussion Topics</span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {(selPersona?.topics || []).map((topic, i) => {
                    const sel = selTopics.includes(topic);
                    const c = BUBBLE_COLORS[i % BUBBLE_COLORS.length];
                    return (
                      <button key={topic} onClick={() => { setSelTopics(prev => prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]); sendMsg(`Let's discuss: ${topic}. Give me your perspective.`); }} style={{
                          padding: "6px 13px", borderRadius: 20, border: `1.5px solid ${c.border}`, background: sel ? c.bg : "#FCFCFC", color: sel ? c.text : "#6B6B6B",
                          fontSize: 11.5, fontWeight: sel ? 600 : 500, cursor: "pointer", transition: "all .2s ease", boxShadow: sel ? `0 2px 6px ${c.border}66` : "0 1px 2px rgba(0,0,0,0.04)"
                        }}
                          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = sel ? `0 3px 8px ${c.border}77` : "0 2px 4px rgba(0,0,0,0.06)"; }}
                          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = sel ? `0 2px 6px ${c.border}66` : "0 1px 2px rgba(0,0,0,0.04)"; }}>{topic}</button>
                    );
                  })}
                </div>
              </div>
              )}

              {/* Text Chat */}
              <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
                <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px 8px", minHeight: 0 }}>
                  {msgs.length === 0 && <div style={{ textAlign: "center", padding: "20px 0", color: "#9CA3AF" }}><div style={{ fontSize: 28, marginBottom: 6 }}>💬</div><div style={{ fontSize: 12, fontWeight: 500 }}>Tap a topic or type below</div></div>}
                {msgs.map((m, i) => (
                    <div key={i} style={{ marginBottom: 10, display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", alignItems: "flex-start", gap: 8 }}>
                      {m.role === "assistant" && <img src={selPersona?.avatar} alt="" style={{ width: 24, height: 24, borderRadius: "50%", objectFit: "cover", flexShrink: 0, marginTop: 2, border: "2px solid #D4C5F0" }} />}
                      <div style={{ maxWidth: "78%", padding: "10px 14px", borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px", background: m.role === "user" ? "#7963D0" : "#F5F3FF", color: m.role === "user" ? "#fff" : "#181818", fontSize: 12.5, lineHeight: 1.6, boxShadow: m.role === "user" ? "0 2px 6px rgba(121,99,208,0.25)" : "0 1px 3px rgba(0,0,0,0.06)" }}>{m.content}</div>
                  </div>
                ))}
                {thinking && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <img src={selPersona?.avatar} alt="" style={{ width: 24, height: 24, borderRadius: "50%", objectFit: "cover", border: "2px solid #D4C5F0" }} />
                      <div style={{ background: "#F5F3FF", padding: "10px 14px", borderRadius: "14px 14px 14px 4px", display: "flex", gap: 4, alignItems: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                        {[0, 1, 2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#7963D0", animation: `pb-bounce 1.2s ${i * .2}s infinite` }} />)}
                    </div>
                  </div>
                )}
                <div ref={chatEnd} />
              </div>
                <div style={{ padding: "12px 14px 14px", background: "linear-gradient(135deg, #FCFCFC 0%, #FAFAFA 100%)", borderTop: "1px solid #E5E5E5", flexShrink: 0 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", background: "#F5F3FF", borderRadius: 12, padding: "6px 6px 6px 14px", border: "1px solid #D4C5F0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                  <input value={chatIn} onChange={e => setChatIn(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { sendMsg(chatIn); setChatIn(""); } }} placeholder={`Message ${selPersona?.name}…`}
                      style={{ flex: 1, border: "none", background: "transparent", outline: "none", fontSize: 12.5, color: "#181818", minWidth: 0 }} />
                    <button onClick={() => { sendMsg(chatIn); setChatIn(""); }} style={{ width: 32, height: 32, borderRadius: 8, border: "none", background: "#7963D0", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 6px rgba(121,99,208,0.25)", transition: "all .2s ease" }}
                      onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.boxShadow = "0 3px 8px rgba(121,99,208,0.35)"; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 2px 6px rgba(121,99,208,0.25)"; }}><SendIcon /></button>
                </div>
              </div>
            </div>

            {/* CALL BUTTON - Sticky at bottom */}
            <button onClick={startCall} style={{
              width: "100%", padding: "16px 0", borderRadius: 14, border: "none",
              background: "#7963D0", color: "#fff", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontWeight: 600, fontSize: 14.5,
              boxShadow: "0 4px 14px rgba(121,99,208,.35)", transition: "all .2s ease", letterSpacing: "-0.2px",
              flexShrink: 0,
              position: mob ? "relative" : "sticky",
              bottom: 0
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(121,99,208,.45)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(121,99,208,.35)"; }}
            ><PhoneIcon /> Talk to {selPersona?.name}</button>
          </div>
        </div>
      </div>
      )}

      {/* ════════════ LIVE CALL EXPANDED VIEW ════════════ */}
      {callActive && activeTab === "builder" && (
        <div style={{ flex: 1, maxWidth: 1400, margin: "0 auto", width: "100%", padding: mob ? "20px 16px" : tab ? "28px 24px" : "32px 40px", display: "flex", flexDirection: "column", gap: 24 }}>
            {/* top bar */}
          <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 16, borderBottom: "1px solid #E5E5E5" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#EF4444", animation: "pb-pulse 1.5s infinite", boxShadow: "0 0 0 3px rgba(239,68,68,0.2)" }} />
              <span style={{ color: "#EF4444", fontSize: 13, fontWeight: 700, letterSpacing: "0.5px" }}>LIVE CALL</span>
              <span style={{ color: "#9CA3AF", fontSize: 12 }}>•</span>
              <span style={{ color: "#6B6B6B", fontSize: 12.5, fontWeight: 500 }}>{voiceMsgs.length} exchanges</span>
              </div>
            <button onClick={endCall} style={{ 
              background: "#F5F3FF", 
              border: "1px solid #D4C5F0", 
              borderRadius: 10, 
              padding: "8px 16px", 
              color: "#EF4444", 
              fontSize: 12.5, 
              fontWeight: 600, 
              cursor: "pointer", 
              display: "flex", 
              alignItems: "center", 
              gap: 6,
              transition: "all .2s ease",
              boxShadow: "0 2px 4px rgba(0,0,0,0.04)"
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "#FEF2F2"; e.currentTarget.style.borderColor = "#EF4444"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#F5F3FF"; e.currentTarget.style.borderColor = "#D4C5F0"; e.currentTarget.style.transform = "translateY(0)"; }}>
              <PhoneOffIcon />
              <span>End Call</span>
              </button>
            </div>

          {/* main call content */}
          <div style={{ flex: 1, display: "flex", gap: 32, flexDirection: mob ? "column" : "row", alignItems: mob ? "center" : "flex-start" }}>
            {/* left: avatar and controls */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, flexShrink: 0, width: mob ? "100%" : "auto" }}>
            {/* avatar + animated ring */}
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", inset: -16, borderRadius: "50%", border: "2px solid rgba(121,99,208,.2)", animation: "pb-ring 2.6s infinite" }} />
                <div style={{ position: "absolute", inset: -8, borderRadius: "50%", border: "2px solid rgba(121,99,208,.12)", animation: "pb-ring 2.6s .5s infinite" }} />
              <img src={selPersona?.avatar} alt="" style={{
                  width: mob ? 100 : 120, height: mob ? 100 : 120, borderRadius: "50%", objectFit: "cover", position: "relative", zIndex: 1,
                  border: `5px solid ${voiceStatus === "speaking" ? "#7963D0" : voiceStatus === "listening" ? "#34D399" : voiceStatus === "thinking" ? "#FCD34D" : "#E5E5E5"}`,
                  transition: "border-color .3s",
                  boxShadow: "0 4px 16px rgba(121,99,208,0.2)"
              }} />
            </div>

            {/* name + status badge */}
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: mob ? 20 : 24, fontWeight: 700, color: "#181818", marginBottom: 4, letterSpacing: "-0.3px" }}>{selPersona?.name}</div>
                <div style={{ fontSize: 13.5, color: "#6B6B6B", marginBottom: 12 }}>{selPersona?.firm}</div>
            <div style={{
                  fontSize: 12.5, fontWeight: 600,
                  color: voiceStatus === "listening" ? "#34D399" : voiceStatus === "speaking" ? "#7963D0" : voiceStatus === "thinking" ? "#FCD34D" : "#6B6B6B",
                  background: voiceStatus === "listening" ? "#ECFDF5" : voiceStatus === "speaking" ? "#F5F3FF" : voiceStatus === "thinking" ? "#FEF3C7" : "#F5F5F5",
                  borderRadius: 20, padding: "6px 16px", transition: "all .3s",
                  border: `1px solid ${voiceStatus === "listening" ? "#34D399" : voiceStatus === "speaking" ? "#7963D0" : voiceStatus === "thinking" ? "#FCD34D" : "#E5E5E5"}`
            }}>
              {voiceStatus === "listening" ? "🎙 Listening…" : voiceStatus === "thinking" ? "🤔 Thinking…" : voiceStatus === "speaking" ? "🗣 Speaking…" : "🎤 Tap mic to speak"}
                </div>
            </div>

            {/* live transcript bubble */}
            {transcript && (
                <div style={{ width: "100%", maxWidth: 300, background: "#F5F3FF", border: "1px solid #D4C5F0", borderRadius: 14, padding: "12px 16px", boxShadow: "0 2px 8px rgba(121,99,208,0.15)" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#7963D0", textTransform: "uppercase", letterSpacing: ".8px", marginBottom: 6 }}>You're saying…</div>
                  <div style={{ fontSize: 13.5, color: "#181818", fontStyle: "italic", lineHeight: 1.5 }}>
                  {transcript}
                    <span style={{ display: "inline-block", width: 8, height: 8, background: "#7963D0", borderRadius: "50%", marginLeft: 8, verticalAlign: "middle", animation: "pb-pulse .7s infinite" }} />
                </div>
              </div>
            )}

            {/* mic + end call buttons */}
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 20, marginTop: 8 }}>
              {/* mic button — primary CTA */}
              <button
                onClick={() => {
                  const st = statusRef.current;
                  if (st === "idle") listenRef.current?.();
                  else if (st === "listening" && recRef.current) { try { recRef.current.stop(); } catch {} setStatus("idle"); }
                }}
                disabled={voiceStatus === "thinking" || voiceStatus === "speaking"}
                style={{
                    width: mob ? 64 : 72, height: mob ? 64 : 72, borderRadius: "50%", border: "none",
                  cursor: voiceStatus === "thinking" || voiceStatus === "speaking" ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all .2s ease",
                    background: voiceStatus === "listening" ? "#EF4444" : (voiceStatus === "thinking" || voiceStatus === "speaking") ? "#E5E5E5" : "#22C55E",
                    boxShadow: voiceStatus === "listening" ? "0 0 0 8px rgba(239,68,68,.2), 0 4px 16px rgba(239,68,68,.4)" : voiceStatus === "idle" ? "0 4px 18px rgba(34,197,94,.4)" : "0 2px 8px rgba(0,0,0,0.1)",
                  animation: voiceStatus === "listening" ? "pb-mic-pulse 1.4s infinite" : "none",
                    opacity: voiceStatus === "thinking" || voiceStatus === "speaking" ? 0.5 : 1
                }}
                  onMouseEnter={e => { if (voiceStatus === "idle" || voiceStatus === "listening") { e.currentTarget.style.transform = "scale(1.1)"; } }}
                onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
              >
                  <svg width={mob ? 28 : 32} height={mob ? 28 : 32} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  <line x1="12" y1="19" x2="12" y2="23"/>
                  <line x1="8" y1="23" x2="16" y2="23"/>
                </svg>
              </button>

                {/* end call button */}
                <button onClick={endCall} style={{ 
                  width: mob ? 56 : 64, height: mob ? 56 : 64, borderRadius: "50%", 
                  background: "#EF4444", border: "none", cursor: "pointer", 
                  display: "flex", alignItems: "center", justifyContent: "center", 
                  boxShadow: "0 4px 12px rgba(239,68,68,.35)", transition: "all .2s ease"
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.1)"; e.currentTarget.style.boxShadow = "0 6px 16px rgba(239,68,68,.45)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(239,68,68,.35)"; }}
                >
                  <PhoneOffIcon />
                </button>
              </div>
            </div>

            {/* right: conversation log */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: ".8px" }}>Conversation</div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12, overflowY: "auto", padding: "16px", background: "#FCFCFC", borderRadius: 14, border: "1px solid #E5E5E5", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", minHeight: 400 }}>
                {voiceMsgs.length === 0 && (
                  <div style={{ textAlign: "center", padding: "60px 20px", color: "#9CA3AF" }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>🎙</div>
                    <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>Call started</div>
                    <div style={{ fontSize: 12 }}>Tap the microphone to start speaking</div>
                  </div>
                )}
                {voiceMsgs.map((m, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", alignItems: "flex-start", gap: 10 }}>
                    {m.role === "assistant" && <img src={selPersona?.avatar} alt="" style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: "2px solid #D4C5F0" }} />}
                    <div style={{
                      maxWidth: "75%", padding: "12px 16px",
                      borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                      background: m.role === "user" ? "#7963D0" : "#F5F3FF",
                      border: m.role === "user" ? "none" : "1px solid #D4C5F0",
                      color: m.role === "user" ? "#fff" : "#181818", fontSize: 13.5, lineHeight: 1.6,
                      boxShadow: m.role === "user" ? "0 2px 8px rgba(121,99,208,0.25)" : "0 1px 3px rgba(0,0,0,0.06)"
                    }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: m.role === "user" ? "rgba(255,255,255,0.8)" : "#7963D0", marginBottom: 4, textTransform: "uppercase", letterSpacing: ".5px" }}>{m.role === "user" ? "You" : selPersona?.name}</div>
                      {m.content}
                    </div>
                    {m.role === "user" && (
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#F5F3FF", border: "2px solid #D4C5F0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7963D0" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="8" r="4"/></svg>
                      </div>
                    )}
                  </div>
                ))}
                <div ref={voiceEnd} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════ AI PERSONAS TAB ════════════ */}
      {activeTab === "personas" && (
        <div style={{ flex: 1, maxWidth: 900, margin: "0 auto", width: "100%", padding: mob ? "16px 12px" : tab ? "20px 16px" : "24px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div style={{ fontSize: 13, color: "#6B6B6B" }}>{personas.length} persona{personas.length !== 1 ? "s" : ""} configured</div>
            <button onClick={() => { resetForm(); setShowForm(true); }} style={{ display: "flex", alignItems: "center", gap: 5, padding: "8px 14px", background: "#7963D0", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 12.5 }}>
              <PlusIcon /> Add Persona
            </button>
          </div>

          {/* form */}
          {showForm && (
            <div style={{ background: "#FCFCFC", borderRadius: 14, border: "1px solid #D4C5F0", padding: mob ? 16 : 22, marginBottom: 22, boxShadow: "0 4px 16px rgba(121,99,208,.08)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                <span style={{ fontWeight: 700, fontSize: 15 }}>{editId !== null ? "Edit Persona" : "New Persona"}</span>
                <button onClick={resetForm} style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF" }}><XIcon /></button>
              </div>
              <div style={{ display: "flex", gap: mob ? 14 : 22, flexDirection: mob ? "column" : "row", alignItems: mob ? "center" : "flex-start" }}>
                {/* avatar */}
                <div style={{ flexShrink: 0, textAlign: "center" }}>
                  <input type="file" ref={avatarRef} onChange={e => { const f = e.target.files?.[0]; if (f) { const u = URL.createObjectURL(f); setAvatarPre(u); setForm(p => ({ ...p, avatar: u })); } }} accept="image/*" style={{ display: "none" }} />
                  <div onClick={() => avatarRef.current?.click()} style={{ width: 80, height: 80, borderRadius: "50%", border: "2px dashed #D4C5F0", background: avatarPre ? `url(${avatarPre}) center/cover` : "#F5F3FF", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {!avatarPre && <span style={{ fontSize: 10.5, color: "#7963D0", fontWeight: 600 }}>Photo</span>}
                  </div>
                  <div style={{ fontSize: 9.5, color: "#9CA3AF", marginTop: 5 }}>Upload photo</div>
                </div>

                {/* fields */}
                <div style={{ flex: 1, width: "100%", display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 11.5, fontWeight: 600, color: "#181818", display: "block", marginBottom: 4 }}>Name *</label>
                    <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Full name" style={{ width: "100%", padding: "8px 10px", border: "1px solid #E5E7EB", borderRadius: 7, fontSize: 12.5, outline: "none", boxSizing: "border-box" }} onFocus={e => e.target.style.borderColor = "#7963D0"} onBlur={e => e.target.style.borderColor = "#E5E7EB"} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11.5, fontWeight: 600, color: "#181818", display: "block", marginBottom: 4 }}>Firm *</label>
                    <input value={form.firm} onChange={e => setForm(p => ({ ...p, firm: e.target.value }))} placeholder="Firm name" style={{ width: "100%", padding: "8px 10px", border: "1px solid #E5E7EB", borderRadius: 7, fontSize: 12.5, outline: "none", boxSizing: "border-box" }} onFocus={e => e.target.style.borderColor = "#7963D0"} onBlur={e => e.target.style.borderColor = "#E5E7EB"} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11.5, fontWeight: 600, color: "#181818", display: "block", marginBottom: 4 }}>Investor Type</label>
                    <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} style={{ width: "100%", padding: "8px 10px", border: "1px solid #E5E7EB", borderRadius: 7, fontSize: 12.5, outline: "none", background: "#FCFCFC", boxSizing: "border-box", cursor: "pointer" }}>
                      {personaTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-end" }}>
                    <button onClick={savePersona} style={{ width: "100%", padding: "8px 0", background: "#7963D0", color: "#fff", border: "none", borderRadius: 7, cursor: "pointer", fontWeight: 600, fontSize: 12.5 }}>
                      {editId !== null ? "Save Changes" : "Create Persona"}
                    </button>
                  </div>
                  <div style={{ gridColumn: mob ? "1" : "1 / -1" }}>
                    <label style={{ fontSize: 11.5, fontWeight: 600, color: "#181818", display: "block", marginBottom: 4 }}>Persona Context</label>
                    <textarea value={form.context} onChange={e => setForm(p => ({ ...p, context: e.target.value }))} placeholder="Describe background, investment thesis, interests, personality…" rows={3}
                      style={{ width: "100%", padding: "8px 10px", border: "1px solid #E5E7EB", borderRadius: 7, fontSize: 12, outline: "none", resize: "vertical", fontFamily: "inherit", boxSizing: "border-box", color: "#181818" }}
                      onFocus={e => e.target.style.borderColor = "#7963D0"} onBlur={e => e.target.style.borderColor = "#E5E7EB"} />
                  </div>

                  {/* ── VOICE CUSTOMISATION ── */}
                  <div style={{ gridColumn: mob ? "1" : "1 / -1", background: "#F5F3FF", borderRadius: 10, padding: 14, border: "1px solid #D4C5F0" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        <div style={{ width: 24, height: 24, borderRadius: 6, background: "#7963D0", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}><VoiceIcon /></div>
                        <span style={{ fontSize: 12.5, fontWeight: 700, color: "#7963D0" }}>Voice Customisation</span>
                      </div>
                      <button onClick={previewVoice} style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 6, border: "1px solid #D4C5F0", background: voicePreviewPlaying ? "#7963D0" : "#fff", color: voicePreviewPlaying ? "#fff" : "#7963D0", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
                        {voicePreviewPlaying ? <StopSmIcon /> : <PlayIcon />} {voicePreviewPlaying ? "Playing…" : "Preview"}
                      </button>
                    </div>
                    {/* voice dropdown */}
                    <div style={{ marginBottom: 10 }}>
                      <label style={{ fontSize: 10.5, fontWeight: 600, color: "#6B6B6B", display: "block", marginBottom: 4 }}>Voice</label>
                      <select value={form.voiceSettings?.voiceIndex ?? -1} onChange={e => setForm(p => ({ ...p, voiceSettings: { ...p.voiceSettings, voiceIndex: Number(e.target.value) } }))}
                        style={{ width: "100%", padding: "7px 10px", border: "1px solid #D4C5F0", borderRadius: 7, fontSize: 11.5, outline: "none", background: "#FCFCFC", cursor: "pointer", color: "#181818" }}>
                        <option value={-1}>— Browser Default —</option>
                        {enVoices.map(v => {
                          const idx = voices.indexOf(v);
                          return <option key={idx} value={idx}>{v.name} ({v.localName || v.lang})</option>;
                        })}
                        {enVoices.length === 0 && <option disabled>No voices loaded…</option>}
                      </select>
                    </div>
                    {/* sliders */}
                    <div style={{ display: "flex", gap: mob ? 10 : 18 }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: 10.5, fontWeight: 600, color: "#6B6B6B", display: "flex", justifyContent: "space-between" }}>
                          <span>Speed</span><span style={{ color: "#7963D0" }}>{(form.voiceSettings?.rate ?? 1).toFixed(2)}x</span>
                        </label>
                        <input type="range" min="0.5" max="2" step="0.05" value={form.voiceSettings?.rate ?? 1} onChange={e => setForm(p => ({ ...p, voiceSettings: { ...p.voiceSettings, rate: Number(e.target.value) } }))} style={{ width: "100%", accentColor: "#7963D0", marginTop: 4 }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: 10.5, fontWeight: 600, color: "#6B6B6B", display: "flex", justifyContent: "space-between" }}>
                          <span>Pitch</span><span style={{ color: "#7963D0" }}>{(form.voiceSettings?.pitch ?? 1).toFixed(2)}</span>
                        </label>
                        <input type="range" min="0.5" max="2" step="0.05" value={form.voiceSettings?.pitch ?? 1} onChange={e => setForm(p => ({ ...p, voiceSettings: { ...p.voiceSettings, pitch: Number(e.target.value) } }))} style={{ width: "100%", accentColor: "#7963D0", marginTop: 4 }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* persona list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {personas.map(p => (
              <div key={p.id} style={{ background: "#FCFCFC", borderRadius: 11, border: "1px solid #E5E5E5", padding: mob ? 14 : "16px 20px", display: "flex", alignItems: "center", gap: 14, transition: "box-shadow .15s" }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = "0 3px 12px rgba(0,0,0,.06)"} onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
                <img src={p.avatar} alt="" style={{ width: 46, height: 46, borderRadius: "50%", objectFit: "cover", border: "3px solid #D4C5F0", flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 700, fontSize: 14, color: "#181818" }}>{p.name}</span>
                    <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: p.type === "Venture Capitalist" ? "#D4C5F0" : p.type === "Target Customer" ? "#ECFDF5" : p.type === "Angel Investor" ? "#FEF3C7" : "#D4C5F0", color: p.type === "Venture Capitalist" ? "#7963D0" : p.type === "Target Customer" ? "#059669" : p.type === "Angel Investor" ? "#D97706" : "#7963D0" }}>{p.type}</span>
                    {p.voiceSettings?.voiceIndex >= 0 && <span style={{ fontSize: 9.5, color: "#7963D0", background: "#F5F3FF", padding: "1px 6px", borderRadius: 20 }}>🔊 Custom</span>}
                  </div>
                  <div style={{ fontSize: 12, color: "#7963D0", fontWeight: 500, marginTop: 1 }}>{p.firm}</div>
                  {p.context && <div style={{ fontSize: 11.5, color: "#6B6B6B", marginTop: 3, lineHeight: 1.4, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical" }}>{p.context}</div>}
                </div>
                <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
                  <button onClick={() => { setForm({ name: p.name, firm: p.firm, type: p.type, context: p.context || "", avatar: p.avatar, voiceSettings: p.voiceSettings || { voiceIndex: -1, rate: 1, pitch: 1 } }); setAvatarPre(p.avatar); setEditId(p.id); setShowForm(true); }} style={{ width: 32, height: 32, borderRadius: 7, border: "1px solid #E5E5E5", background: "#FCFCFC", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#6B6B6B" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#7963D0"; e.currentTarget.style.color = "#7963D0"; }} onMouseLeave={e => { e.currentTarget.style.borderColor = "#eee"; e.currentTarget.style.color = "#6B7280"; }}><EditIcon /></button>
                  <button onClick={() => { setPersonas(prev => prev.filter(x => x.id !== p.id)); if (selPersona?.id === p.id) { const next = personas.find(x => x.id !== p.id); if (next) setSelId(next.id); } }} style={{ width: 32, height: 32, borderRadius: 7, border: "1px solid #E5E5E5", background: "#FCFCFC", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#6B6B6B" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#EF4444"; e.currentTarget.style.color = "#EF4444"; }} onMouseLeave={e => { e.currentTarget.style.borderColor = "#eee"; e.currentTarget.style.color = "#6B7280"; }}><TrashIcon /></button>
                </div>
              </div>
            ))}
            {personas.length === 0 && (
              <div style={{ textAlign: "center", padding: "50px 0", color: "#9CA3AF" }}>
                <div style={{ fontSize: 36, marginBottom: 6 }}>👤</div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>No personas yet</div>
                <div style={{ fontSize: 11.5, marginTop: 3 }}>Click "Add Persona" to get started</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom Overlay Input */}
      {showBottomOverlay && (editingItem || (addingNewItem && addModalType)) && (
        <div style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "#FCFCFC",
          borderTop: "1px solid #E5E5E5",
          boxShadow: "0 -4px 24px rgba(0,0,0,0.12)",
          zIndex: 1000,
          padding: mob ? "20px 16px" : "24px 32px",
          maxHeight: "60vh",
          overflowY: "auto"
        }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ flexShrink: 0 }}>
                  {getItemIcon(editingItem?.type || addModalType)}
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#181818" }}>
                    {editingItem ? editingItem.name : (addModalType === "website" ? "Add Website" : addModalType === "figma" ? "Add Figma" : addModalType === "survey" ? "Add Survey" : addModalType === "pitchdeck" ? "Add Pitch Deck" : addModalType === "document" ? "Add Document" : addModalType === "image" ? "Add Image" : "Add Item")}
                  </div>
                  <div style={{ fontSize: 12, color: "#6B6B6B", textTransform: "capitalize" }}>{editingItem?.type || addModalType}</div>
                </div>
              </div>
              <button onClick={() => { 
                setShowBottomOverlay(false); 
                setEditingItem(null); 
                setAddingNewItem(false);
                setAddModalType(null);
                setOverlayInputValue(""); 
              }} style={{
                width: 32, height: 32, borderRadius: "50%", border: "none", background: "#F5F5F5",
                color: "#6B6B6B", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Input Section */}
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              {/* Text Input */}
              {((editingItem?.type || addModalType) === "website" || (editingItem?.type || addModalType) === "figma" || (editingItem?.type || addModalType) === "survey") && (
                <div style={{ flex: 1, display: "flex", gap: 8, alignItems: "center" }}>
                  {(editingItem?.type || addModalType) === "website" && (
                    <div style={{ flexShrink: 0, width: 40, height: 40, borderRadius: 8, background: "#F5F3FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <LinkIcon w={20} h={20} style={{ color: "#7963D0" }} />
                    </div>
                  )}
                  <input
                    type="text"
                    value={overlayInputValue}
                    onChange={(e) => setOverlayInputValue(e.target.value)}
                    placeholder={(editingItem?.type || addModalType) === "website" ? "Enter website URL" : (editingItem?.type || addModalType) === "figma" ? "Enter Figma link" : "Enter survey link"}
                    style={{
                      flex: 1,
                      padding: "12px 16px",
                      borderRadius: 10,
                      border: "1px solid #E5E5E5",
                      background: "#FCFCFC",
                      fontSize: 14,
                      color: "#181818",
                      outline: "none",
                      transition: "all .15s"
                    }}
                    onFocus={(e) => { e.target.style.borderColor = "#7963D0"; e.target.style.boxShadow = "0 0 0 3px rgba(121,99,208,0.1)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "#E5E5E5"; e.target.style.boxShadow = "none"; }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        if (addingNewItem) {
                          handleAddNewItem();
                        } else {
                          handleUpdateItem();
                        }
                      }
                    }}
                    autoFocus
                  />
                </div>
              )}

              {/* PDF Upload */}
              {((editingItem?.type || addModalType) === "pitchdeck" || (editingItem?.type || addModalType) === "document") && (
                <div style={{ flex: 1, display: "flex", gap: 8, alignItems: "center" }}>
                  <input
                    type="file"
                    ref={fileRef}
                    accept={(editingItem?.type || addModalType) === "pitchdeck" ? ".pdf,.pptx,.ppt" : ".pdf,.doc,.docx"}
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) {
                        if (addingNewItem) {
                          handleAddNewItemFile(f);
                        } else {
                          handleUpdateItemFile(f);
                        }
                      }
                    }}
                    style={{ display: "none" }}
                  />
                  <button
                    onClick={() => fileRef.current?.click()}
                    style={{
                      flex: 1,
                      padding: "12px 16px",
                      borderRadius: 10,
                      border: "1px solid #E5E5E5",
                      background: "#FCFCFC",
                      fontSize: 14,
                      color: "#181818",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      transition: "all .15s"
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#7963D0"; e.currentTarget.style.background = "#F5F3FF"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E5E5E5"; e.currentTarget.style.background = "#FCFCFC"; }}
                  >
                    <UploadIcon w={18} h={18} />
                    <span>Upload {(editingItem?.type || addModalType) === "pitchdeck" ? "PDF/PPTX" : "Document"}</span>
                  </button>
                </div>
              )}

              {/* Text Input for other types */}
              {((editingItem?.type || addModalType) === "image" || (editingItem?.type || addModalType) === "marketingassets" || (editingItem?.type || addModalType) === "adcopy" || (editingItem?.type || addModalType) === "email") && (
                <textarea
                  value={overlayInputValue}
                  onChange={(e) => setOverlayInputValue(e.target.value)}
                  placeholder="Enter text or description..."
                  rows={3}
                  style={{
                    flex: 1,
                    padding: "12px 16px",
                    borderRadius: 10,
                    border: "1px solid #E5E5E5",
                    background: "#FCFCFC",
                    fontSize: 14,
                    color: "#181818",
                    outline: "none",
                    resize: "vertical",
                    fontFamily: "inherit",
                    transition: "all .15s"
                  }}
                  onFocus={(e) => { e.target.style.borderColor = "#7963D0"; e.target.style.boxShadow = "0 0 0 3px rgba(121,99,208,0.1)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "#E5E5E5"; e.target.style.boxShadow = "none"; }}
                  autoFocus
                />
              )}

              {/* Add/Update Button */}
              <button
                onClick={() => {
                  if (addingNewItem) {
                    handleAddNewItem();
                  } else {
                    handleUpdateItem();
                  }
                }}
                style={{
                  padding: "12px 24px",
                  borderRadius: 10,
                  border: "none",
                  background: "#7963D0",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all .15s",
                  whiteSpace: "nowrap",
                  display: "flex",
                  alignItems: "center",
                  gap: 8
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#6B56C0"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#7963D0"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                {(editingItem?.type || addModalType) === "website" && <LinkIcon w={16} h={16} />}
                <span>{addingNewItem ? "Add" : "Update"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── CSS ─── */}
      <style>{`
        @keyframes pb-bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-4px)}}
        @keyframes pb-pulse{0%,100%{opacity:1}50%{opacity:.4}}
        @keyframes pb-ring{0%{transform:scale(1);opacity:.25}100%{transform:scale(1.4);opacity:0}}
        @keyframes pb-float{0%,100%{transform:translate(0,0)}50%{transform:translate(18px,-14px)}}
        @keyframes pb-mic-pulse{0%,100%{box-shadow:0 0 0 6px rgba(239,68,68,.25),0 4px 16px rgba(239,68,68,.4)}50%{box-shadow:0 0 0 10px rgba(239,68,68,.08),0 4px 20px rgba(239,68,68,.5)}}
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:#D4C5F0;border-radius:2px}
        input::placeholder,textarea::placeholder{color:#9CA3AF}
        select option{background:#fff}
        button{font-family:inherit}
        input[type=range]{cursor:pointer;height:4px}
      `}</style>
    </div>
  );
}
