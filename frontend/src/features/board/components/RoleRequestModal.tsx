import { useState, useMemo } from 'react'
import Modal from '@/shared/components/Modal'
import Toast from '@/shared/components/Toast'
import { useToast } from '@/shared/hooks/useToast'
import { useAuth } from '@/shared/contexts/AuthContext'
import { Button, Input, Checkbox, Badge, IconBadge, Icons, Icon } from '@/shared/components/ui-kit'
import { useAdminSystems, useUserRoleAssignments, useRoleRequests, useSystemRoles } from '@/features/admin/api/queries'
import { mockRoleRequests } from '@/features/admin/mocks/adminData'

interface RoleRequestModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function RoleRequestModal({ isOpen, onClose }: RoleRequestModalProps) {
  const { user } = useAuth()
  const { toast, showToast, hideToast } = useToast()

  const { data: systems = [] } = useAdminSystems()
  const { data: assignments = [] } = useUserRoleAssignments(user?.id)
  const { data: roleRequests = [] } = useRoleRequests()
  const { data: allRoles = [] } = useSystemRoles()

  // 선택된 시스템 ID 세트
  const [selectedSystems, setSelectedSystems] = useState<Set<string>>(new Set())
  // 시스템별 선택된 역할 ID
  const [selectedRoles, setSelectedRoles] = useState<Record<string, Set<string>>>({})
  // 요청 사유
  const [reason, setReason] = useState('')

  // 현재 사용자의 pending 요청 시스템 ID 세트
  const pendingSystemIds = useMemo(() => {
    return new Set(
      roleRequests
        .filter(r => r.userId === user?.id && r.status === 'pending')
        .map(r => r.systemId)
    )
  }, [roleRequests, user?.id])

  // 현재 사용자가 접근 중인 시스템 ID 세트
  const assignedSystemIds = useMemo(() => {
    return new Set(assignments.map(a => a.systemId))
  }, [assignments])

  // 특정 시스템의 역할 목록 (기본 역할 제외)
  const getRolesForSystem = (systemId: string) => {
    return allRoles.filter(r => r.systemId === systemId && !r.isDefault)
  }

  const handleSystemToggle = (systemId: string) => {
    setSelectedSystems(prev => {
      const next = new Set(prev)
      if (next.has(systemId)) {
        next.delete(systemId)
        // 시스템 선택 해제 시 역할도 초기화
        setSelectedRoles(prevRoles => {
          const nextRoles = { ...prevRoles }
          delete nextRoles[systemId]
          return nextRoles
        })
      } else {
        next.add(systemId)
      }
      return next
    })
  }

  const handleRoleToggle = (systemId: string, roleId: string) => {
    setSelectedRoles(prev => {
      const current = prev[systemId] ?? new Set<string>()
      const next = new Set(current)
      if (next.has(roleId)) {
        next.delete(roleId)
      } else {
        next.add(roleId)
      }
      return { ...prev, [systemId]: next }
    })
  }

  // 신청 가능 여부: 최소 하나의 시스템이 선택되고, 각 선택 시스템에 최소 하나의 역할이 선택
  const canSubmit = useMemo(() => {
    if (selectedSystems.size === 0) return false
    for (const systemId of selectedSystems) {
      const roles = selectedRoles[systemId]
      if (!roles || roles.size === 0) return false
    }
    return true
  }, [selectedSystems, selectedRoles])

  const handleSubmit = () => {
    if (!user || !canSubmit) return

    for (const systemId of selectedSystems) {
      const roleIds = Array.from(selectedRoles[systemId] ?? [])
      if (roleIds.length === 0) continue

      mockRoleRequests.push({
        id: `rr-${Date.now()}-${systemId}`,
        userId: user.id,
        systemId,
        roleIds,
        status: 'pending',
        reason: reason || undefined,
        requestedAt: new Date().toISOString().slice(0, 10),
      })
    }

    showToast('권한 신청이 완료되었습니다', 'success')

    // 상태 초기화
    setSelectedSystems(new Set())
    setSelectedRoles({})
    setReason('')
    onClose()
  }

  const handleClose = () => {
    setSelectedSystems(new Set())
    setSelectedRoles({})
    setReason('')
    onClose()
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="권한 신청"
        subtitle="접근하고 싶은 시스템과 역할을 선택하세요"
        icon={<IconBadge icon={Icons.key} color="emerald" size="md" />}
        size="lg"
      >
        {/* 시스템 목록 */}
        <div className="max-h-80 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
          {systems.map(system => {
            const isAssigned = assignedSystemIds.has(system.id)
            const isPending = pendingSystemIds.has(system.id)
            const isDisabled = isAssigned || isPending
            const isSelected = selectedSystems.has(system.id)
            const roles = getRolesForSystem(system.id)

            return (
              <div key={system.id} className="rounded-xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
                {/* 시스템 카드 헤더 */}
                <div
                  className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                    isDisabled
                      ? 'opacity-60 cursor-not-allowed'
                      : 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  } ${isSelected ? 'bg-emerald-50/50 dark:bg-emerald-900/10' : ''}`}
                  onClick={() => !isDisabled && handleSystemToggle(system.id)}
                >
                  <Checkbox
                    checked={isSelected}
                    disabled={isDisabled}
                    accentColor="emerald"
                    onChange={() => {}}
                    className="pointer-events-none"
                  />
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: system.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                        {system.name}
                      </span>
                      {isAssigned && <Badge color="emerald">접근 중</Badge>}
                      {isPending && <Badge color="amber">신청 중</Badge>}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {system.description}
                    </p>
                  </div>
                </div>

                {/* 역할 선택 영역 (시스템 선택 시 펼침) */}
                {isSelected && roles.length > 0 && (
                  <div className="px-4 pb-3 pt-1 border-t border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/30">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                      역할 선택
                    </p>
                    <div className="flex flex-wrap gap-x-4 gap-y-2">
                      {roles.map(role => (
                        <Checkbox
                          key={role.id}
                          label={role.name}
                          accentColor="emerald"
                          size="sm"
                          checked={selectedRoles[system.id]?.has(role.id) ?? false}
                          onChange={() => handleRoleToggle(system.id, role.id)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* 요청 사유 */}
        <div className="mt-4">
          <Input
            placeholder="요청 사유 (선택)"
            value={reason}
            onChange={e => setReason(e.target.value)}
            size="sm"
            accentColor="emerald"
          />
        </div>

        {/* 신청 버튼 */}
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={handleClose}>
            취소
          </Button>
          <Button
            color="emerald"
            size="sm"
            disabled={!canSubmit}
            onClick={handleSubmit}
          >
            <Icon name="shield" className="w-4 h-4" />
            신청
          </Button>
        </div>
      </Modal>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </>
  )
}
