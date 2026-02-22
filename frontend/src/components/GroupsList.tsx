import React, { useEffect, useState } from "react"
import { Group } from "@/types"
import { SortField, SortDirection } from "@/hooks/useDashboard"
import Pagination from "./Pagination"

interface GroupsListProps {
  fetchGroups?: (page: number) => Promise<{ groups: Group[]; totalPages: number }>
  isLoading?: boolean
  sortField?: SortField
  sortDirection?: SortDirection
  onSort?: (field: SortField) => void
  onGroupClick?: (groupId: string) => void
  onJoinGroup?: (groupId: string) => void
}

export const GroupsList: React.FC<GroupsListProps> = ({
  fetchGroups,
  isLoading = false,
  sortField = "name",
  sortDirection = "asc",
  onSort = () => {},
  onGroupClick,
  onJoinGroup,
}) => {
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)

  // Pagination loader
  const loadPage = async (page: number) => {
    if (!fetchGroups) return
    setLoading(true)
    try {
      const result = await fetchGroups(page)
      setGroups(result.groups)
      setTotalPages(result.totalPages)
      setCurrentPage(page)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPage(currentPage)
  }, [])

  const handlePageChange = (page: number) => {
    loadPage(page)
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <span className="sort-indicator-inactive">↕</span>
    return <span className="sort-indicator-active">{sortDirection === "asc" ? "↑" : "↓"}</span>
  }

  const statusConfig: Record<string, { badge: string; dot: string; label: string }> = {
    active: {
      badge: "badge badge-active",
      dot: "bg-emerald-500",
      label: "Active",
    },
    completed: {
      badge: "badge badge-completed",
      dot: "bg-primary-500",
      label: "Completed",
    },
    paused: {
      badge: "badge badge-paused",
      dot: "bg-amber-500",
      label: "Paused",
    },
  }

  if (loading || isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-surface-200/80 overflow-hidden">
        <table className="table-premium w-full">
          <thead>
            <tr>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">
                Members
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">
                Contributions
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">
                Next Payout
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, i) => (
              <tr key={i} className="animate-pulse-soft" style={{ animationDelay: `${i * 100}ms` }}>
                <td className="px-5 py-4">
                  <div className="skeleton h-4 w-32 rounded-md" />
                </td>
                <td className="px-5 py-4">
                  <div className="skeleton h-4 w-16 rounded-md" />
                </td>
                <td className="px-5 py-4">
                  <div className="skeleton h-4 w-20 rounded-md" />
                </td>
                <td className="px-5 py-4">
                  <div className="skeleton h-4 w-24 rounded-md" />
                </td>
                <td className="px-5 py-4">
                  <div className="skeleton h-6 w-16 rounded-full" />
                </td>
                <td className="px-5 py-4">
                  <div className="skeleton h-8 w-20 rounded-lg" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-surface-200/80 overflow-hidden animate-fade-in">
        <table className="table-premium w-full">
          <thead>
            <tr>
              <th>
                <div className="sort-header cursor-pointer" onClick={() => onSort("name")}>
                  Name <SortIcon field="name" />
                </div>
              </th>
              <th>
                <div className="sort-header cursor-pointer" onClick={() => onSort("members")}>
                  Members <SortIcon field="members" />
                </div>
              </th>
              <th>
                <div className="sort-header cursor-pointer" onClick={() => onSort("contributions")}>
                  Contributions <SortIcon field="contributions" />
                </div>
              </th>
              <th>
                <div className="sort-header cursor-pointer" onClick={() => onSort("nextPayout")}>
                  Next Payout <SortIcon field="nextPayout" />
                </div>
              </th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group, i) => {
              const config = statusConfig[group.status] || statusConfig.active
              return (
                <tr
                  key={group.id}
                  className="cursor-pointer transition-all duration-200 animate-fade-in"
                  style={{ animationDelay: `${i * 40}ms` }}
                  onClick={() => onGroupClick?.(group.id)}
                >
                  <td className="whitespace-nowrap">
                    <div className="text-sm font-semibold text-surface-900">{group.name}</div>
                    {group.description && (
                      <div className="text-xs text-surface-400 truncate max-w-xs mt-0.5">
                        {group.description}
                      </div>
                    )}
                  </td>
                  <td className="whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-surface-700">
                        {group.currentMembers}/{group.maxMembers}
                      </span>
                      <div className="w-12 h-1.5 rounded-full bg-surface-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-primary-400 to-primary-600 transition-all duration-500"
                          style={{ width: `${(group.currentMembers / group.maxMembers) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap text-sm font-semibold text-surface-800">
                    ${group.totalContributions.toFixed(2)}
                  </td>
                  <td className="whitespace-nowrap text-sm text-surface-600">
                    {new Date(group.nextPayoutDate).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap">
                    <span className={config.badge}>
                      <span className={`inline-block w-1.5 h-1.5 rounded-full ${config.dot}`} />
                      {config.label}
                    </span>
                  </td>
                  <td className="whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onJoinGroup?.(group.id)
                      }}
                      className="btn-join"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                        />
                      </svg>
                      Join
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </>
  )
}