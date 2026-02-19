import React from 'react'
import { GroupExplorer } from '@/components/GroupExplorer'

export const Explore: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl px-6 py-8 text-white shadow-lg">
        <h2 className="text-3xl font-bold mb-2">Discover Groups</h2>
        <p className="text-blue-100 text-base max-w-xl">
          Browse public savings groups, filter by your preferences, and join a community working toward shared financial goals.
        </p>
        <div className="flex flex-wrap gap-4 mt-5 text-sm">
          <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
            </svg>
            <span>18 Public Groups</span>
          </div>
          <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>$25 – $1,000/cycle</span>
          </div>
          <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <span>8 Categories</span>
          </div>
        </div>
      </div>

      {/* Explorer */}
      <GroupExplorer />
    </div>
  )
}
