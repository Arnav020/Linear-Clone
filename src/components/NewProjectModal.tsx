'use client';

import { useState, useRef, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { X, Loader2, Folder, Keyboard, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated?: () => void;
}

const COLORS = ['#F97316', '#EF4444', '#EAB308', '#22C55E', '#3B82F6', '#6366F1', '#A855F7', '#EC4899'];

export default function NewProjectModal({ isOpen, onClose, onProjectCreated }: NewProjectModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [key, setKey] = useState('');
  const [color, setColor] = useState(COLORS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const supabase = createClient();
  const { user } = useUser();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 100);

      // Fetch users
      const fetchUsers = async () => {
          setLoadingUsers(true);
          const { data, error } = await supabase.from('users').select('*');
          if (data) {
              setAvailableUsers(data);
          }
          setLoadingUsers(false);
      };
      fetchUsers();

    } else {
      document.body.style.overflow = 'unset';
      setTimeout(() => {
          setName('');
          setDescription('');
          setKey('');
          setColor(COLORS[0]);
          setSelectedUsers(new Set());
      }, 200);
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // ... auto-generate key useEffect ...

  const toggleUser = (userId: string) => {
      const next = new Set(selectedUsers);
      if (next.has(userId)) {
          next.delete(userId);
      } else {
          next.add(userId);
      }
      setSelectedUsers(next);
  };

  const handleSubmit = async () => {
    if (!name.trim() || !key.trim() || !user) return;

    setIsSubmitting(true);
    try {
      // 1. Create Project
      const { data: projectDataResponse, error: projectError } = await supabase.from('projects').insert({
        name,
        description: description || null,
        key: key.toUpperCase(),
        color,
        status: 'active',
        created_by: user.id
      } as any).select('id').single();

      const projectData = projectDataResponse as { id: string } | null;


      if (projectError) {
        throw projectError;
      }

      if (projectData) {
          // 2. Add creator as member (owner)
          const membersToInsert = [
              { project_id: projectData.id, user_id: user.id, role: 'owner' }
          ];

          // 3. Add selected users
          selectedUsers.forEach(userId => {
              membersToInsert.push({
                  project_id: projectData.id,
                  user_id: userId,
                  role: 'member'
              });
          });

          const { error: memberError } = await supabase.from('project_members').insert(membersToInsert as any);

          if (memberError) {
              console.error('Error adding members:', memberError);
          }
      }

      if (onProjectCreated) onProjectCreated();
      onClose();
      router.refresh();

    } catch (err: any) {
      console.error('Error creating project:', err);
      if (err.code === '23505') { // Unique constraint violation for key
          alert('Project identifier (key) already exists. Please choose another.');
      } else {
          alert('Failed to create project');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200"
        onClick={onClose}
      />

      <div 
        ref={modalRef}
        className="relative w-full max-w-lg bg-[#1e2024] border border-[#2a2c30] rounded-lg shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#2a2c30]">
           <span className="text-xs font-medium text-gray-500">New Project</span>
           <button onClick={onClose} className="text-gray-500 hover:text-gray-300 transition-colors">
             <X size={16} />
           </button>
        </div>

        <div className="p-6 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Project Name</label>
                <div className="flex items-center gap-3 bg-[#16181D] border border-[#2a2c30] rounded-md px-3 py-2 focus-within:border-[#5E6AD2] transition-colors">
                    <Folder size={16} style={{ color }} />
                    <input
                        ref={nameInputRef}
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Q3 Roadmap"
                        className="flex-1 bg-transparent text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none"
                    />
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Project Key</label>
                <div className="flex items-center gap-3 bg-[#16181D] border border-[#2a2c30] rounded-md px-3 py-2 focus-within:border-[#5E6AD2] transition-colors">
                    <Keyboard size={16} className="text-gray-500" />
                    <input
                        type="text"
                        value={key}
                        onChange={(e) => setKey(e.target.value.toUpperCase())}
                        placeholder="e.g. ROA"
                        className="flex-1 bg-transparent text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none font-mono uppercase"
                        maxLength={5}
                    />
                </div>
                 <p className="text-[10px] text-gray-500">Unique identifier for issues (e.g. LIN-123)</p>
            </div>

             <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Icon Color</label>
                <div className="flex flex-wrap gap-2">
                    {COLORS.map(c => (
                        <button
                            key={c}
                            onClick={() => setColor(c)}
                            className={`w-6 h-6 rounded-full transition-all ${color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-[#1e2024]' : 'hover:scale-110'}`}
                            style={{ backgroundColor: c }}
                        />
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What is this project about?"
                    className="w-full bg-[#16181D] border border-[#2a2c30] rounded-md px-3 py-2 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-[#5E6AD2] min-h-[80px] resize-none"
                />
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Members ({selectedUsers.size})</label>
                <div className="bg-[#16181D] border border-[#2a2c30] rounded-md max-h-[150px] overflow-y-auto">
                    {loadingUsers ? (
                        <div className="flex items-center justify-center p-4 text-gray-500 text-xs">
                            <Loader2 size={14} className="animate-spin mr-2" /> Loading users...
                        </div>
                    ) : availableUsers.filter(u => u.id !== user?.id).length === 0 ? (
                        <div className="p-3 text-xs text-gray-500 text-center">No other users found.</div>
                    ) : (
                        availableUsers.filter(u => u.id !== user?.id).map(u => (
                            <div 
                                key={u.id}
                                onClick={() => toggleUser(u.id)}
                                className="flex items-center gap-3 px-3 py-2 hover:bg-[#2a2c30] cursor-pointer transition-colors border-b last:border-0 border-[#2a2c30]"
                            >
                                <div className={`w-4 h-4 border rounded flex items-center justify-center transition-colors ${selectedUsers.has(u.id) ? 'bg-[#5E6AD2] border-[#5E6AD2]' : 'border-gray-600 bg-transparent'}`}>
                                    {selectedUsers.has(u.id) && <Check size={10} className="text-white" />}
                                </div>
                                <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-[10px] text-white font-bold shrink-0">
                                    {u.name?.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-sm text-gray-300 flex-1">{u.name}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>

        <div className="p-4 border-t border-[#2a2c30] flex items-center justify-end gap-3 bg-[#1e2024] rounded-b-lg">
             <button 
                onClick={onClose}
                className="px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-gray-200 hover:bg-white/5 rounded transition-colors"
             >
                Cancel
             </button>
             <button 
                onClick={handleSubmit}
                disabled={!name.trim() || !key.trim() || isSubmitting}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#5e6ad2] hover:bg-[#4e5ac2] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-[6px] text-xs font-medium transition-colors"
             >
                {isSubmitting && <Loader2 size={12} className="animate-spin" />}
                Create Project
             </button>
        </div>
      </div>
    </div>
  );
}
