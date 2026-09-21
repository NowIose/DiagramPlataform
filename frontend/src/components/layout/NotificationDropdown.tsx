import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  read: boolean;
  relatedEntityId?: number;
  metadata?: string;
  createdAt: string;
}

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
      const res = await axios.get(`${API_URL}/notifications`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setNotifications(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll every 30 seconds for new notifications
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleAction = async (action: 'accept' | 'reject' | 'read', id: number) => {
    try {
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
      
      if (action === 'accept') {
        await axios.post(`${API_URL}/notifications/${id}/accept-invite`, {}, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        navigate('/dashboard/projects'); // Refresh projects or go to projects page
      } else if (action === 'reject') {
        await axios.post(`${API_URL}/notifications/${id}/reject-invite`, {}, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } else if (action === 'read') {
        await axios.put(`${API_URL}/notifications/${id}/read`, {}, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
      fetchNotifications();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        aria-label="Notificaciones" 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors relative ${isOpen ? 'bg-primary/10 text-primary' : 'bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface'}`}
      >
        <span className="material-symbols-outlined text-[20px]">notifications</span>
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-error border border-surface shadow-sm"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-12 right-0 w-80 bg-surface rounded-2xl shadow-xl border border-surface-container-highest overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
          <div className="p-4 border-b border-surface-container-highest flex justify-between items-center bg-surface-container-lowest">
            <h3 className="font-semibold text-sm text-on-surface">Notificaciones</h3>
            {unreadCount > 0 && (
              <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">
                {unreadCount} nuevas
              </span>
            )}
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-on-surface-variant flex flex-col items-center">
                <span className="material-symbols-outlined text-[32px] mb-2 opacity-50">notifications_paused</span>
                <p className="text-xs">No tienes notificaciones</p>
              </div>
            ) : (
              notifications.map(notif => (
                <div key={notif.id} className={`p-4 border-b border-surface-container-low last:border-0 hover:bg-surface-container-lowest transition-colors ${!notif.read ? 'bg-primary/5' : ''}`}>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <span className={`material-symbols-outlined text-[20px] ${notif.type === 'PROJECT_INVITE' ? 'text-tertiary' : 'text-primary'}`}>
                        {notif.type === 'PROJECT_INVITE' ? 'group_add' : 'info'}
                      </span>
                    </div>
                    <div className="flex-1 flex flex-col gap-1">
                      <h4 className={`text-xs font-semibold ${!notif.read ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                        {notif.title}
                      </h4>
                      <p className="text-[11px] text-on-surface-variant leading-relaxed">
                        {notif.message}
                      </p>
                      
                      {notif.type === 'PROJECT_INVITE' && !notif.read && (
                        <div className="flex gap-2 mt-2">
                          <button 
                            onClick={() => handleAction('accept', notif.id)}
                            className="bg-primary text-on-primary text-[10px] font-semibold px-3 py-1.5 rounded hover:bg-primary/90 transition-colors"
                          >
                            Aceptar
                          </button>
                          <button 
                            onClick={() => handleAction('reject', notif.id)}
                            className="bg-surface-container-highest text-on-surface text-[10px] font-semibold px-3 py-1.5 rounded hover:bg-surface-container transition-colors"
                          >
                            Rechazar
                          </button>
                        </div>
                      )}
                      
                      {notif.type !== 'PROJECT_INVITE' && !notif.read && (
                        <button 
                          onClick={() => handleAction('read', notif.id)}
                          className="self-start mt-1 text-[10px] text-primary hover:underline"
                        >
                          Marcar como leída
                        </button>
                      )}
                      
                      <span className="text-[9px] text-on-surface-variant/70 mt-1">
                        {new Date(notif.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
