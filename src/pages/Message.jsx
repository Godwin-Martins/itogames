import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  setDoc
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import './Message.css';

const Message = () => {
  const { id: otherUserId } = useParams();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [otherUser, setOtherUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) return navigate('/login');
      setCurrentUser(u);
    });
    return () => unsub();
  }, []);

  // load other user basic info when a chat target is present
  useEffect(() => {
    if (!otherUserId) return;
    (async () => {
      try {
        const otherDoc = await getDoc(doc(db, 'users', otherUserId));
        if (otherDoc.exists()) setOtherUser(otherDoc.data());
      } catch (err) {
        console.error('fetch other user', err);
      }
    })();
  }, [otherUserId]);

  // load chats where current user participates
  useEffect(() => {
    if (!currentUser) return;
    setLoadingChats(true);
    const chatsQuery = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsub = onSnapshot(chatsQuery, (snap) => {
      const arr = [];
      snap.forEach(d => arr.push({ id: d.id, ...d.data() }));
      setChats(arr);
      setLoadingChats(false);
    }, (err) => {
      console.error('chats snapshot', err);
      setLoadingChats(false);
    });

    return () => unsub();
  }, [currentUser]);

  // If a chat target is selected, listen to its messages
  useEffect(() => {
    if (!currentUser || !otherUserId) return;
    setLoadingMsgs(true);
    const uidA = currentUser.uid;
    const uidB = otherUserId;
    const chatId = uidA < uidB ? `${uidA}_${uidB}` : `${uidB}_${uidA}`;
    const chatRef = doc(db, 'chats', chatId);

    // ensure chat doc exists
    (async () => {
      try {
        const c = await getDoc(chatRef);
        if (!c.exists()) {
          await setDoc(chatRef, { participants: [uidA, uidB], createdAt: serverTimestamp() });
        }
      } catch (err) {
        console.error('ensure chat', err);
      }
    })();

    const msgsQuery = query(collection(chatRef, 'messages'), orderBy('createdAt'));
    const unsub = onSnapshot(msgsQuery, (snap) => {
      const list = [];
      snap.forEach(d => list.push({ id: d.id, ...d.data() }));
      setMessages(list);
      setLoadingMsgs(false);
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    }, (err) => {
      console.error('messages snap', err);
      setLoadingMsgs(false);
    });

    return () => unsub();
  }, [currentUser, otherUserId]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!text.trim() || !currentUser || !otherUserId) return;
    const uidA = currentUser.uid;
    const uidB = otherUserId;
    const chatId = uidA < uidB ? `${uidA}_${uidB}` : `${uidB}_${uidA}`;
    const chatRef = doc(db, 'chats', chatId);

    try {
      await addDoc(collection(chatRef, 'messages'), {
        senderId: currentUser.uid,
        text: text.trim(),
        createdAt: serverTimestamp()
      });
      setText('');
    } catch (err) {
      console.error('send error', err);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="messages-container">
      <header className="messages-header">
        <button className="back-btn" onClick={() => navigate(-1)}>Back</button>
        <h2>Messages</h2>
      </header>

      <div className="messages-main">
        <aside className="inbox">
          <div className="inbox-header">Chats</div>
          {loadingChats && <div className="loading">Loading chats...</div>}
          {!loadingChats && chats.length === 0 && <div className="empty">No chats yet</div>}
          <div className="chats-list">
            {chats.map(c => {
              const other = c.participants.find(p => p !== currentUser.uid);
              return (
                <div key={c.id} className="chat-row" onClick={() => navigate(`/messages/${other}`)}>
                  <div className="chat-id">{other}</div>
                  <div className="chat-last">{c.lastMessage || 'Open chat'}</div>
                </div>
              );
            })}
          </div>
        </aside>

        <section className="chat-area">
          {!otherUserId && <div className="empty">Select a chat or open a user's profile to message them.</div>}

          {otherUserId && (
            <>
              <div className="chat-header">
                <div className="other-name">{otherUser?.displayName || otherUserId}</div>
              </div>

              <div className="messages-list">
                {loadingMsgs && <div className="loading">Loading messages...</div>}
                {messages.map(m => (
                  <div key={m.id} className={`message-item ${m.senderId === currentUser.uid ? 'outgoing' : 'incoming'}`}>
                    <div className="message-text">{m.text}</div>
                    <div className="message-meta">{new Date(m.createdAt?.toDate?.() || Date.now()).toLocaleString()}</div>
                  </div>
                ))}
                <div ref={endRef} />
              </div>

              <form className="message-input-form" onSubmit={handleSend}>
                <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message..." />
                <button type="submit" disabled={!text.trim()}>Send</button>
              </form>
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default Message;
