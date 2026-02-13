import { useState, useEffect, useCallback } from 'react';
import { ThumbsUp, Trophy, Loader2, ChevronDown, ChevronRight, Play } from 'lucide-react';
import { Button } from '../Button';
import { ContrastBadge } from '../ContrastBadge';
import { useAuth } from '../../hooks/useAuth';
import { loadIterations, voteIteration } from '../../firebase/database';
import type { Iteration } from '../../types';

interface IterationTimelineProps {
  paletteId: string;
  onLoadIteration?: (iteration: Iteration) => void;
}

export function IterationTimeline({ paletteId, onLoadIteration }: IterationTimelineProps) {
  const { user } = useAuth();
  const [iterations, setIterations] = useState<Iteration[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [votingId, setVotingId] = useState<string | null>(null);

  const fetchIterations = useCallback(async () => {
    try {
      const data = await loadIterations(paletteId);
      setIterations(data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [paletteId]);

  useEffect(() => {
    fetchIterations();
  }, [fetchIterations]);

  const bestIterationId = getBestIterationId(iterations);

  const handleVote = async (iterationId: string) => {
    if (!user) return;
    setVotingId(iterationId);
    try {
      await voteIteration(iterationId, user.uid);
      await fetchIterations();
    } catch {
      // silently fail
    } finally {
      setVotingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 size={24} className="text-primary-500 animate-spin" />
      </div>
    );
  }

  if (iterations.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-dark-400 text-sm">No iterations yet.</p>
        <p className="text-dark-500 text-xs mt-1">Save an iteration from the Preview page to start tracking changes.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Vertical timeline line */}
      <div className="absolute left-5 top-0 bottom-0 w-px bg-dark-700" />

      <div className="space-y-4">
        {iterations.map((iteration, index) => {
          const isExpanded = expandedId === iteration.id;
          const isBest = iteration.id === bestIterationId;
          const hasVoted = user ? (iteration.voters ?? []).includes(user.uid) : false;

          return (
            <div key={iteration.id} className="relative pl-12">
              {/* Timeline dot */}
              <div className={`absolute left-3.5 top-4 w-3 h-3 rounded-full border-2 ${
                isBest
                  ? 'bg-warning border-warning'
                  : index === 0
                    ? 'bg-primary-500 border-primary-500'
                    : 'bg-dark-700 border-dark-600'
              }`} />

              {/* Card */}
              <div className={`rounded-xl border p-4 transition-colors ${
                isBest
                  ? 'bg-dark-800/80 border-warning/30'
                  : 'bg-dark-800/50 border-dark-700 hover:border-dark-600'
              }`}>
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    {/* Best badge */}
                    {isBest && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-warning bg-warning/10 px-2 py-0.5 rounded-full mb-2">
                        <Trophy size={12} />
                        Best Version
                      </span>
                    )}

                    {/* Color swatches */}
                    <div className="flex gap-1 mb-2">
                      {iteration.colors.slice(0, 7).map((color, ci) => (
                        <div
                          key={ci}
                          className="w-6 h-6 rounded-md border border-dark-600"
                          style={{ backgroundColor: color.hex }}
                          title={`${color.name} (${color.hex})`}
                        />
                      ))}
                    </div>

                    {/* Comment */}
                    {iteration.comment && (
                      <p className="text-sm text-dark-200 mb-1">{iteration.comment}</p>
                    )}

                    {/* Meta */}
                    <div className="flex items-center gap-2 text-xs text-dark-500">
                      <span>{iteration.userName}</span>
                      <span>&middot;</span>
                      <span>{formatDate(iteration.createdAt)}</span>
                      <span>&middot;</span>
                      <span className="capitalize">{iteration.preset}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Vote button */}
                    <button
                      onClick={() => handleVote(iteration.id)}
                      disabled={!user || votingId === iteration.id}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer disabled:cursor-not-allowed ${
                        hasVoted
                          ? 'bg-primary-500/15 text-primary-400 border border-primary-500/30'
                          : 'bg-dark-700 text-dark-400 hover:text-dark-200 border border-dark-600 hover:border-dark-500'
                      }`}
                      title={!user ? 'Log in to vote' : hasVoted ? 'Remove vote' : 'Upvote'}
                    >
                      {votingId === iteration.id ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <ThumbsUp size={12} />
                      )}
                      {iteration.votes}
                    </button>

                    {/* Load button */}
                    {onLoadIteration && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onLoadIteration(iteration)}
                        icon={<Play size={12} />}
                      >
                        Load
                      </Button>
                    )}
                  </div>
                </div>

                {/* Expand toggle */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : iteration.id)}
                  className="flex items-center gap-1 text-xs text-dark-500 hover:text-dark-300 mt-3 transition-colors cursor-pointer"
                >
                  {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                  {isExpanded ? 'Hide details' : 'Show all colors & APCA scores'}
                </button>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-dark-700 space-y-2">
                    {iteration.colors.map((color, ci) => (
                      <div key={ci} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded border border-dark-600"
                            style={{ backgroundColor: color.hex }}
                          />
                          <span className="text-dark-300">{color.name}</span>
                          <span className="text-dark-500 font-mono">{color.hex}</span>
                          <span className="text-dark-600">&larr;</span>
                          <span className="text-dark-500 font-mono">{color.originalHex}</span>
                        </div>
                        <ContrastBadge apcaValue={color.apcaValue} />
                      </div>
                    ))}
                    <div className="flex items-center gap-4 pt-2 text-xs text-dark-500">
                      <span>BG: {iteration.customSettings.backgroundDarkness}%</span>
                      <span>Text: {iteration.customSettings.textLightness}%</span>
                      <span>Accent: {iteration.customSettings.accentSaturation}%</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getBestIterationId(iterations: Iteration[]): string | null {
  if (iterations.length === 0) return null;
  let best = iterations[0];
  for (const iter of iterations) {
    if (
      iter.votes > best.votes ||
      (iter.votes === best.votes && iter.createdAt > best.createdAt)
    ) {
      best = iter;
    }
  }
  return best.votes > 0 ? best.id : null;
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
