import Image from 'next/image'
import { Clock3 } from 'lucide-react'

export default function AwaitingApprovalPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-lg border border-border-subtle bg-bg-secondary p-8 text-center">
        <Image src="/logo.png" alt="PDF Lovers" width={42} height={42} className="mx-auto" />
        <div className="mx-auto mb-4 mt-4 flex h-10 w-10 items-center justify-center border border-accent-amber/40 bg-accent-amber/10">
          <Clock3 size={20} className="text-accent-amber" />
        </div>
        <h1 className="font-display text-2xl text-text-primary">Awaiting Approval</h1>
        <p className="mt-2 text-sm text-text-muted">
          Your account is created but not yet approved by a super admin.
        </p>
      </div>
    </div>
  )
}
