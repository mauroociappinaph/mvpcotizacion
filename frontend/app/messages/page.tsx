"use client";

import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  Button,
  Input
} from "../components/ui";
import { Send, Search, Plus, Users, Phone, Video, MoreHorizontal, Smile } from "lucide-react";

// Datos de ejemplo
interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

interface ChatContact {
  id: string;
  name: string;
  avatar?: string;
  status: "online" | "offline" | "away";
  lastMessage?: string;
  unreadCount: number;
  isGroup?: boolean;
  members?: number;
}

export default function MessagesPage() {
  const [contacts, setContacts] = useState<ChatContact[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Cargar datos de ejemplo
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      // Simular retraso de red
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockContacts: ChatContact[] = [
        {
          id: "user1",
          name: "Juan Pérez",
          status: "online",
          lastMessage: "¿Cómo va el proyecto?",
          unreadCount: 2
        },
        {
          id: "user2",
          name: "María López",
          status: "away",
          lastMessage: "Revisemos el diseño mañana",
          unreadCount: 0
        },
        {
          id: "group1",
          name: "Equipo de Desarrollo",
          status: "online",
          lastMessage: "Reunión a las 10:00",
          unreadCount: 5,
          isGroup: true,
          members: 8
        },
        {
          id: "user3",
          name: "Carlos Rodríguez",
          status: "offline",
          lastMessage: "Gracias por la información",
          unreadCount: 0
        },
        {
          id: "group2",
          name: "Proyecto Cotización",
          status: "online",
          lastMessage: "Nueva tarea asignada",
          unreadCount: 3,
          isGroup: true,
          members: 5
        }
      ];

      setContacts(mockContacts);
      setSelectedChat(mockContacts[0].id); // Seleccionar el primer chat por defecto
      setIsLoading(false);
    };

    loadData();
  }, []);

  // Cargar mensajes cuando se selecciona un chat
  useEffect(() => {
    if (selectedChat) {
      // En un caso real, esto sería una llamada a la API
      const mockMessages: ChatMessage[] = [
        {
          id: "m1",
          senderId: selectedChat === "user1" ? "user1" : "currentUser",
          content: "Hola, ¿cómo estás?",
          timestamp: "2023-06-15T09:30:00",
          isRead: true
        },
        {
          id: "m2",
          senderId: "currentUser",
          content: "¡Bien! Trabajando en el proyecto",
          timestamp: "2023-06-15T09:32:00",
          isRead: true
        },
        {
          id: "m3",
          senderId: selectedChat === "user1" ? "user1" : "currentUser",
          content: "¿Cómo va el avance?",
          timestamp: "2023-06-15T09:35:00",
          isRead: true
        },
        {
          id: "m4",
          senderId: "currentUser",
          content: "Estamos a un 70% de completarlo. Creo que terminaremos a tiempo para la entrega del viernes.",
          timestamp: "2023-06-15T09:40:00",
          isRead: true
        },
        {
          id: "m5",
          senderId: selectedChat === "user1" ? "user1" : "currentUser",
          content: "¡Perfecto! Avísame si necesitas algo",
          timestamp: "2023-06-15T09:45:00",
          isRead: false
        }
      ];

      setMessages(mockMessages);
    }
  }, [selectedChat]);

  // Scroll al último mensaje cuando cambian los mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;

    const newMsg: ChatMessage = {
      id: `m${Date.now()}`,
      senderId: "currentUser",
      content: newMessage,
      timestamp: new Date().toISOString(),
      isRead: false
    };

    setMessages([...messages, newMsg]);
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredContacts = contacts.filter(
    contact => contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  const selectedContact = contacts.find(c => c.id === selectedChat);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Cargando mensajes...</h1>
        <div className="animate-pulse h-96 bg-gray-100 rounded"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Mensajes</h1>

      <div className="flex h-[calc(80vh-4rem)] border rounded-lg overflow-hidden">
        {/* Lista de contactos/chats */}
        <div className="w-1/3 border-r flex flex-col">
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input
                className="pl-9"
                placeholder="Buscar conversaciones..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredContacts.length > 0 ? (
              filteredContacts.map(contact => (
                <div
                  key={contact.id}
                  className={`p-3 border-b cursor-pointer hover:bg-gray-50 flex items-center ${selectedChat === contact.id ? 'bg-blue-50' : ''}`}
                  onClick={() => setSelectedChat(contact.id)}
                >
                  <div className="relative mr-3">
                    {contact.avatar ? (
                      <img
                        src={contact.avatar}
                        alt={contact.name}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${contact.isGroup ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                        {contact.isGroup ? (
                          <Users size={20} />
                        ) : (
                          contact.name.charAt(0).toUpperCase()
                        )}
                      </div>
                    )}
                    <span
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                        contact.status === 'online' ? 'bg-green-500' :
                        contact.status === 'away' ? 'bg-yellow-500' : 'bg-gray-500'
                      }`}
                    ></span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <span className="font-medium truncate">{contact.name}</span>
                      {contact.unreadCount > 0 && (
                        <span className="bg-blue-500 text-white text-xs rounded-full h-5 min-w-5 flex items-center justify-center px-1">
                          {contact.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {contact.isGroup && `${contact.members} miembros • `}
                      {contact.lastMessage}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                No se encontraron conversaciones
              </div>
            )}
          </div>

          <div className="p-3 border-t">
            <Button className="w-full">
              <Plus size={16} className="mr-2" />
              Nueva Conversación
            </Button>
          </div>
        </div>

        {/* Área de chat */}
        <div className="w-2/3 flex flex-col">
          {selectedChat && selectedContact ? (
            <>
              {/* Encabezado del chat */}
              <div className="p-3 border-b flex justify-between items-center">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${selectedContact.isGroup ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {selectedContact.isGroup ? (
                      <Users size={20} />
                    ) : (
                      selectedContact.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{selectedContact.name}</div>
                    <div className="text-xs text-gray-500">
                      {selectedContact.status === 'online' ? 'En línea' :
                       selectedContact.status === 'away' ? 'Ausente' : 'Desconectado'}
                      {selectedContact.isGroup && ` • ${selectedContact.members} miembros`}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" className="rounded-full" title="Llamada de voz">
                    <Phone size={18} />
                  </Button>
                  <Button variant="ghost" size="sm" className="rounded-full" title="Videollamada">
                    <Video size={18} />
                  </Button>
                  <Button variant="ghost" size="sm" className="rounded-full" title="Más opciones">
                    <MoreHorizontal size={18} />
                  </Button>
                </div>
              </div>

              {/* Mensajes */}
              <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                <div className="space-y-4">
                  {messages.map((message, index) => {
                    const isCurrentUser = message.senderId === "currentUser";
                    const showDate = index === 0 || formatDate(messages[index-1].timestamp) !== formatDate(message.timestamp);

                    return (
                      <div key={message.id}>
                        {showDate && (
                          <div className="flex justify-center my-4">
                            <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                              {formatDate(message.timestamp)}
                            </span>
                          </div>
                        )}

                        <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                          <Card className={`max-w-[70%] shadow-sm ${isCurrentUser ? 'bg-blue-500 text-white' : 'bg-white'}`}>
                            <CardContent className="p-3">
                              <p>{message.content}</p>
                              <div className={`text-xs mt-1 text-right ${isCurrentUser ? 'text-blue-100' : 'text-gray-400'}`}>
                                {formatTime(message.timestamp)}
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Entrada de mensaje */}
              <div className="p-3 border-t">
                <div className="flex items-center">
                  <Button variant="ghost" size="sm" className="rounded-full" title="Añadir emoji">
                    <Smile size={20} />
                  </Button>
                  <Input
                    className="flex-1 mx-2"
                    placeholder="Escribe un mensaje..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="rounded-full w-10 h-10 p-0"
                  >
                    <Send size={18} />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center p-6">
                <Users size={48} className="mx-auto text-gray-300 mb-3" />
                <h3 className="text-lg font-medium">Selecciona una conversación</h3>
                <p className="text-gray-500">Elige un contacto o grupo para comenzar a chatear</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
