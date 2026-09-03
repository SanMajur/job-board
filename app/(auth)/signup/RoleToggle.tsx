'use client'

interface RoleToggleProps {
  role: 'candidate' | 'employer'
  onRoleChange: (role: 'candidate' | 'employer') => void
}

export function RoleToggle({ role, onRoleChange }: RoleToggleProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">I want to:</label>
      <div className="grid grid-cols-2 gap-3 p-1 bg-slate-100 rounded-xl">
        <button
          type="button"
          onClick={() => onRoleChange('candidate')}
          className={`py-2.5 text-sm font-semibold rounded-lg transition cursor-pointer ${
            role === 'candidate'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Find Jobs
        </button>
        <button
          type="button"
          onClick={() => onRoleChange('employer')}
          className={`py-2.5 text-sm font-semibold rounded-lg transition cursor-pointer ${
            role === 'employer'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Hire Talent
        </button>
      </div>
    </div>
  )
}