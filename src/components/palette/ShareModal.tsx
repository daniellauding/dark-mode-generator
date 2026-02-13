import { useState, useEffect, useRef } from 'react';
import {
  X,
  Link2,
  Users,
  Copy,
  Check,
  Loader2,
  Mail,
  Trash2,
  Globe,
  Lock,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { Button } from '../Button';
import { useAuth } from '../../hooks/useAuth';
import {
  createShareLink,
  getShareLinkByPalette,
  findUserByEmail,
  addCollaborator,
  removeCollaborator,
  getCollaboratorProfiles,
  type SavedPalette,
  type ShareLink,
  type UserProfile,
} from '../../firebase/database';

type Tab = 'link' | 'invite';

interface ShareModalProps {
  palette: SavedPalette;
  onClose: () => void;
  onUpdated?: () => void;
}

export function ShareModal({ palette, onClose, onUpdated }: ShareModalProps) {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>('link');
  const [visible, setVisible] = useState(false);

  // Link tab state
  const [shareLink, setShareLink] = useState<ShareLink | null>(null);
  const [linkLoading, setLinkLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [privacy, setPrivacy] = useState<'public' | 'private'>(palette.privacy ?? 'public');
  const [expiration, setExpiration] = useState<'30days' | 'forever'>('30days');

  // Invite tab state
  const [email, setEmail] = useState('');
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);
  const [collaborators, setCollaborators] = useState<UserProfile[]>([]);
  const [collabLoading, setCollabLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const emailRef = useRef<HTMLInputElement>(null);
  const isOwner = palette.userId === user?.uid;

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  // Load existing share link
  useEffect(() => {
    if (!palette.id) return;
    setLinkLoading(true);
    getShareLinkByPalette(palette.id).then((link) => {
      setShareLink(link);
      if (link) {
        setPrivacy(link.privacy);
        setExpiration(link.expiresAt ? '30days' : 'forever');
      }
      setLinkLoading(false);
    });
  }, [palette.id]);

  // Load collaborators
  useEffect(() => {
    setCollabLoading(true);
    getCollaboratorProfiles(palette).then((profiles) => {
      setCollaborators(profiles);
      setCollabLoading(false);
    });
  }, [palette]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 200);
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const shareUrl = shareLink
    ? `${window.location.origin}/palette/${shareLink.shareId}`
    : '';

  const handleGenerateLink = async () => {
    if (!palette.id) return;
    setGenerating(true);
    try {
      const link = await createShareLink(palette.id, privacy, expiration);
      setShareLink(link);
      onUpdated?.();
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInvite = async () => {
    if (!palette.id || !email.trim()) return;
    setInviteError(null);
    setInviteSuccess(null);

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setInviteError('Please enter a valid email address.');
      return;
    }

    if (email.trim() === user?.email) {
      setInviteError("You can't invite yourself.");
      return;
    }

    setInviting(true);
    try {
      const profile = await findUserByEmail(email.trim());
      if (!profile) {
        setInviteError('No user found with this email. They need to sign up first.');
        return;
      }

      // Check if already a collaborator
      if (palette.sharedWith?.[profile.uid]) {
        setInviteError('This user is already a collaborator.');
        return;
      }

      await addCollaborator(palette.id, profile.uid);
      setCollaborators((prev) => [...prev, profile]);
      setInviteSuccess(`Invited ${email.trim()}`);
      setEmail('');
      onUpdated?.();
    } catch {
      setInviteError('Failed to invite user. Please try again.');
    } finally {
      setInviting(false);
    }
  };

  const handleRemoveCollaborator = async (uid: string) => {
    if (!palette.id || !isOwner) return;
    setRemovingId(uid);
    try {
      await removeCollaborator(palette.id, uid);
      setCollaborators((prev) => prev.filter((c) => c.uid !== uid));
      onUpdated?.();
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Share palette"
    >
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200 ${visible ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleClose}
      />

      <div
        className={`relative w-full max-w-lg rounded-2xl bg-dark-800 border border-dark-600 shadow-2xl transition-all duration-200 ${
          visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dark-700">
          <div>
            <h2 className="text-lg font-semibold text-dark-100">Share Palette</h2>
            <p className="text-sm text-dark-400 mt-0.5">{palette.name}</p>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg hover:bg-dark-700 text-dark-400 hover:text-dark-200 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-dark-700">
          <button
            onClick={() => setTab('link')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors cursor-pointer ${
              tab === 'link'
                ? 'text-primary-400 border-b-2 border-primary-400'
                : 'text-dark-400 hover:text-dark-200'
            }`}
          >
            <Link2 size={16} />
            Link
          </button>
          <button
            onClick={() => { setTab('invite'); setTimeout(() => emailRef.current?.focus(), 100); }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors cursor-pointer ${
              tab === 'invite'
                ? 'text-primary-400 border-b-2 border-primary-400'
                : 'text-dark-400 hover:text-dark-200'
            }`}
          >
            <Users size={16} />
            Invite Users
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {tab === 'link' && (
            <div className="space-y-4">
              {/* Link input */}
              {linkLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 size={20} className="text-dark-400 animate-spin" />
                </div>
              ) : shareLink ? (
                <>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={shareUrl}
                      className="flex-1 px-3 py-2.5 rounded-lg bg-dark-900 border border-dark-600 text-dark-200 text-sm font-mono truncate focus:outline-none"
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleCopy}
                      icon={copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                    >
                      {copied ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>

                  {/* Expiration info */}
                  <div className="flex items-center gap-2 text-xs text-dark-500">
                    <Clock size={12} />
                    {shareLink.expiresAt
                      ? `Expires ${new Date(shareLink.expiresAt).toLocaleDateString()}`
                      : 'Never expires'}
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-dark-400 mb-4">
                    Generate a public link to share this palette with anyone.
                  </p>
                </div>
              )}

              {/* Privacy toggle */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-dark-900 border border-dark-700">
                <div className="flex items-center gap-2">
                  {privacy === 'public' ? (
                    <Globe size={16} className="text-success" />
                  ) : (
                    <Lock size={16} className="text-warning" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-dark-200">
                      {privacy === 'public' ? 'Public' : 'Private'}
                    </p>
                    <p className="text-xs text-dark-500">
                      {privacy === 'public'
                        ? 'Anyone with the link can view'
                        : 'Only invited collaborators'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setPrivacy(privacy === 'public' ? 'private' : 'public')}
                  className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${
                    privacy === 'public' ? 'bg-success' : 'bg-dark-600'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                      privacy === 'public' ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Expiration toggle */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-dark-900 border border-dark-700">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-dark-400" />
                  <div>
                    <p className="text-sm font-medium text-dark-200">Expiration</p>
                    <p className="text-xs text-dark-500">
                      {expiration === '30days' ? 'Link expires after 30 days' : 'Link never expires'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setExpiration('30days')}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                      expiration === '30days'
                        ? 'bg-primary-500/15 text-primary-400 border border-primary-500/30'
                        : 'bg-dark-700 text-dark-400 border border-transparent'
                    }`}
                  >
                    30 days
                  </button>
                  <button
                    onClick={() => setExpiration('forever')}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                      expiration === 'forever'
                        ? 'bg-primary-500/15 text-primary-400 border border-primary-500/30'
                        : 'bg-dark-700 text-dark-400 border border-transparent'
                    }`}
                  >
                    Forever
                  </button>
                </div>
              </div>

              {/* Generate / Update button */}
              <Button
                className="w-full"
                onClick={handleGenerateLink}
                disabled={generating}
                icon={
                  generating ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Link2 size={16} />
                  )
                }
              >
                {generating
                  ? 'Generating...'
                  : shareLink
                    ? 'Update Link'
                    : 'Generate Link'}
              </Button>
            </div>
          )}

          {tab === 'invite' && (
            <div className="space-y-4">
              {/* Email input */}
              <div>
                <label htmlFor="invite-email" className="block text-sm font-medium text-dark-300 mb-1.5">
                  Email address
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
                    <input
                      ref={emailRef}
                      id="invite-email"
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setInviteError(null); setInviteSuccess(null); }}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleInvite(); }}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-dark-900 border border-dark-600 text-dark-100 text-sm placeholder:text-dark-500 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/25 transition-colors"
                      placeholder="collaborator@example.com"
                      disabled={inviting}
                    />
                  </div>
                  <Button
                    onClick={handleInvite}
                    disabled={inviting || !email.trim()}
                    icon={inviting ? <Loader2 size={14} className="animate-spin" /> : undefined}
                    size="sm"
                  >
                    Invite
                  </Button>
                </div>

                {inviteError && (
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-danger">
                    <AlertCircle size={12} />
                    {inviteError}
                  </div>
                )}
                {inviteSuccess && (
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-success">
                    <Check size={12} />
                    {inviteSuccess}
                  </div>
                )}
              </div>

              {/* Collaborators list */}
              <div>
                <h3 className="text-sm font-medium text-dark-300 mb-2">Collaborators</h3>
                <div className="space-y-1">
                  {/* Owner */}
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-dark-900/50">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center shrink-0">
                        <span className="text-xs font-medium text-primary-400">
                          {user?.email?.[0]?.toUpperCase() ?? '?'}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-dark-200 truncate">{user?.email ?? 'You'}</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-primary-400 bg-primary-500/10 px-2 py-0.5 rounded-full shrink-0">
                      Owner
                    </span>
                  </div>

                  {/* Loading */}
                  {collabLoading && (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 size={16} className="text-dark-400 animate-spin" />
                    </div>
                  )}

                  {/* Collaborator list */}
                  {!collabLoading && collaborators.map((collab) => (
                    <div key={collab.uid} className="flex items-center justify-between p-2.5 rounded-lg bg-dark-900/50">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-dark-700 flex items-center justify-center shrink-0">
                          <span className="text-xs font-medium text-dark-300">
                            {collab.email[0]?.toUpperCase() ?? '?'}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm text-dark-200 truncate">{collab.displayName ?? collab.email}</p>
                          <p className="text-xs text-dark-500 truncate">{collab.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-medium text-dark-400 bg-dark-700 px-2 py-0.5 rounded-full">
                          Collaborator
                        </span>
                        {isOwner && (
                          <button
                            onClick={() => handleRemoveCollaborator(collab.uid)}
                            disabled={removingId === collab.uid}
                            className="p-1 rounded-md hover:bg-danger/10 text-dark-500 hover:text-danger transition-colors cursor-pointer disabled:opacity-50"
                            title="Remove collaborator"
                          >
                            {removingId === collab.uid ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <Trash2 size={14} />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {!collabLoading && collaborators.length === 0 && (
                    <p className="text-center text-xs text-dark-500 py-4">
                      No collaborators yet. Invite someone by email above.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
