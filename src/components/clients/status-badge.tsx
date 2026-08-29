import { ClientStatus } from '@/types/client';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock } from 'lucide-react';

interface ClientStatusBadgeProps {
  status: ClientStatus;
}

export default function ClientStatusBadge({ status }: ClientStatusBadgeProps) {
  if (status === 'APPROVED') {
    return (
      <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 hover:bg-emerald-500/15 transition-all gap-1.5 py-1 px-2.5 rounded-full font-mono text-[10px] tracking-wide font-bold shadow-[0_0_12px_rgba(52,211,153,0.15)]">
        <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />
        APROBADO
      </Badge>
    );
  }

  return (
    <Badge className="bg-[oklch(0.76_0.12_82/0.12)] text-[oklch(0.76_0.12_82)] border border-[oklch(0.76_0.12_82/0.3)] hover:bg-[oklch(0.76_0.12_82/0.18)] transition-all gap-1.5 py-1 px-2.5 rounded-full font-mono text-[10px] tracking-wide font-bold shadow-[0_0_12px_oklch(0.76_0.12_82/0.15)]">
      <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.76_0.12_82)] animate-pulse shrink-0" />
      PENDIENTE
    </Badge>
  );
}
