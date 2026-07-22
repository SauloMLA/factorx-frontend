import { ClientStatus } from '@/types/client';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface ClientStatusBadgeProps {
  status: ClientStatus;
}

export default function ClientStatusBadge({ status }: ClientStatusBadgeProps) {
  if (status === 'APPROVED') {
    return (
      <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/15 transition-colors gap-1 py-1 font-bold">
        <CheckCircle2 className="h-3 w-3 text-emerald-400" />
        Aprobado
      </Badge>
    );
  }

  return (
    <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/15 transition-colors gap-1 py-1 font-bold">
      <AlertCircle className="h-3 w-3 text-amber-400" />
      Pendiente
    </Badge>
  );
}
