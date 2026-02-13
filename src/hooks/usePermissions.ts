import { useMemo } from 'react';
import { getPaletteRole, type SavedPalette, type PaletteRole } from '../firebase/database';

interface PermissionResult {
  role: PaletteRole;
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canShare: boolean;
  canAddIterations: boolean;
}

export function usePermissions(palette: SavedPalette | null, userId: string | null): PermissionResult {
  return useMemo(() => {
    if (!palette) {
      return { role: 'none' as const, canView: false, canEdit: false, canDelete: false, canShare: false, canAddIterations: false };
    }

    const role = getPaletteRole(palette, userId);

    return {
      role,
      canView: role !== 'none',
      canEdit: role === 'owner',
      canDelete: role === 'owner',
      canShare: role === 'owner',
      canAddIterations: role === 'owner' || role === 'collaborator',
    };
  }, [palette, userId]);
}
