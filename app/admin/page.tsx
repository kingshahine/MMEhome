'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface Lead {
  id: string | number
  first_name?: string
  last_name?: string
  email?: string
  phone?: string
  created_at?: string
  address?: string
  city?: string
  state?: string
  lead_source?: string
  field_1?: string   // ownership type
  field_2?: string   // income source
  field_3?: string   // pre-tax income
  property_use?: string
  foreclosure?: string
  [key: string]: unknown
}

interface LeadsResponse {
  data?: Lead[]
  error?: string
  meta?: { total?: number; page?: number; per_page?: number }
}

const N = { navy: '#0B2348', blue: '#1967E4', gold: '#C8960A', grey: '#8EA3BF', greyLight: '#E4EAF2', greyText: '#4A6480', offWhite: '#F6F8FC' }

export default function AdminDashboard() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [selected, setSelected] = useState<Lead | null>(null)
  const [apiNote, setApiNote] = useState('')
  const router = useRouter()
  const PER_PAGE = 25

  const fetchLeads = useCallback(async (pg = 1, q = '') => {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams({ page: String(pg), per_page: String(PER_PAGE), ...(q ? { search: q } : {}) })
      const res = await fetch(`/api/leads?${params}`)
      if (res.status === 401) { router.push('/admin/login'); return }
      const json: LeadsResponse = await res.json()
      if (json.error && json.error.includes('Bonzo API returned')) {
        setApiNote(`Bonzo API note: ${json.error}. The endpoint may need adjustment — check the server logs.`)
      }
      setLeads(json.data || [])
      setTotal(json.meta?.total || (json.data?.length ?? 0))
    } catch (e) {
      setError('Failed to load leads. Check your connection.')
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => { fetchLeads(1, '') }, [fetchLeads])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setPage(1)
    fetchLeads(1, search)
  }

  async function handleLogout() {
    await fetch('/api/admin-auth', { method: 'DELETE' })
    router.push('/admin/login')
  }

  function fmt(dateStr?: string) {
    if (!dateStr) return '—'
    try { return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }
    catch { return dateStr }
  }

  function initials(lead: Lead) {
    return `${(lead.first_name || '?')[0]}${(lead.last_name || '?')[0]}`.toUpperCase()
  }

  const totalPages = Math.ceil(total / PER_PAGE)

  return (
    <div style={{ minHeight: '100vh', background: N.offWhite, fontFamily: "'DM Sans', sans-serif" }}>

      {/* TOP NAV */}
      <nav style={{
        background: N.navy, padding: '0 32px', height: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 32, height: 32, background: 'rgba(255,255,255,0.1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
          <span style={{ color: 'white', fontWeight: 600, fontSize: '0.95rem' }}>MME Home</span>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>/ Admin</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <a href="/" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', textDecoration: 'none' }}>
            View site ↗
          </a>
          <button onClick={handleLogout} style={{
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
            color: 'rgba(255,255,255,0.7)', borderRadius: 8, padding: '7px 16px',
            fontSize: '0.82rem', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
          }}>
            Sign out
          </button>
        </div>
      </nav>

      <div style={{ padding: '32px 32px 64px', maxWidth: 1300, margin: '0 auto' }}>

        {/* HEADER */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 600, color: N.navy, marginBottom: 4 }}>Lead Dashboard</h1>
          <p style={{ fontSize: '0.875rem', color: N.grey }}>Leads from Bonzo CRM</p>
        </div>

        {/* STATS ROW */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 28 }}>
          {[
            { label: 'Total leads', value: total || leads.length, icon: '👥' },
            { label: 'This page', value: leads.length, icon: '📄' },
            { label: 'Data source', value: 'Bonzo', icon: '🔗' },
          ].map(s => (
            <div key={s.label} style={{
              background: 'white', borderRadius: 14, padding: '18px 20px',
              border: `1px solid ${N.greyLight}`,
            }}>
              <div style={{ fontSize: 20, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 600, color: N.navy, lineHeight: 1.1, marginBottom: 2 }}>{s.value}</div>
              <div style={{ fontSize: '0.78rem', color: N.grey }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* API NOTE */}
        {apiNote && (
          <div style={{
            background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 10,
            padding: '12px 16px', fontSize: '0.82rem', color: '#92400E', marginBottom: 20,
            display: 'flex', alignItems: 'flex-start', gap: 10,
          }}>
            <span>⚠️</span>
            <div>
              <strong>API Configuration Note</strong><br/>
              {apiNote}<br/>
              <span style={{ opacity: 0.8 }}>The Bonzo API endpoint may need to be updated. Common paths: <code>/api/prospects</code>, <code>/api/v1/contacts</code>, <code>/api/people</code>. Check your server logs for the exact error.</span>
            </div>
          </div>
        )}

        {/* SEARCH + REFRESH */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, flex: 1, minWidth: 240 }}>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, email, or phone…"
              style={{
                flex: 1, padding: '10px 14px',
                border: `1.5px solid ${N.greyLight}`,
                borderRadius: 10, fontSize: '0.88rem',
                fontFamily: "'DM Sans', sans-serif", outline: 'none',
                background: 'white',
              }}
            />
            <button type="submit" style={{
              background: N.navy, color: 'white', border: 'none',
              borderRadius: 10, padding: '10px 20px', fontSize: '0.88rem',
              fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
            }}>Search</button>
          </form>
          <button onClick={() => fetchLeads(page, search)} style={{
            background: 'white', border: `1.5px solid ${N.greyLight}`,
            borderRadius: 10, padding: '10px 18px', fontSize: '0.88rem',
            cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", color: N.greyText,
          }}>↻ Refresh</button>
        </div>

        {/* ERROR */}
        {error && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '12px 16px', fontSize: '0.85rem', color: '#991B1B', marginBottom: 20 }}>
            {error}
          </div>
        )}

        {/* TABLE */}
        <div style={{ background: 'white', borderRadius: 16, border: `1px solid ${N.greyLight}`, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${N.greyLight}`, background: N.offWhite }}>
                {['Lead', 'Contact', 'Address', 'Source', 'Property Use', 'Date', ''].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.72rem', fontWeight: 600, color: N.grey, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ padding: '48px', textAlign: 'center', color: N.grey }}>
                  <div style={{ fontSize: '0.9rem' }}>Loading leads…</div>
                </td></tr>
              ) : leads.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: '48px', textAlign: 'center', color: N.grey }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>📭</div>
                  <div style={{ fontSize: '0.9rem', marginBottom: 4 }}>No leads found</div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Leads submitted through your site will appear here</div>
                </td></tr>
              ) : leads.map((lead, i) => (
                <tr key={lead.id || i} style={{
                  borderBottom: `1px solid ${N.greyLight}`,
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = N.offWhite)}
                  onMouseLeave={e => (e.currentTarget.style.background = 'white')}
                  onClick={() => setSelected(lead)}
                >
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: '50%',
                        background: N.navy, color: 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.72rem', fontWeight: 700, flexShrink: 0,
                      }}>{initials(lead)}</div>
                      <div>
                        <div style={{ fontWeight: 600, color: N.navy }}>{[lead.first_name, lead.last_name].filter(Boolean).join(' ') || '—'}</div>
                        <div style={{ fontSize: '0.75rem', color: N.grey }}>{lead.id}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', color: N.greyText }}>
                    <div>{lead.email || '—'}</div>
                    <div style={{ fontSize: '0.8rem', color: N.grey }}>{lead.phone || ''}</div>
                  </td>
                  <td style={{ padding: '14px 16px', color: N.greyText, maxWidth: 180 }}>
                    <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {[lead.address, lead.city, lead.state].filter(Boolean).join(', ') || '—'}
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    {lead.lead_source ? (
                      <span style={{
                        background: 'rgba(25,103,228,0.08)', color: N.blue,
                        borderRadius: 100, padding: '4px 10px', fontSize: '0.75rem', fontWeight: 600,
                      }}>{lead.lead_source}</span>
                    ) : '—'}
                  </td>
                  <td style={{ padding: '14px 16px', color: N.greyText }}>{lead.property_use || '—'}</td>
                  <td style={{ padding: '14px 16px', color: N.grey, whiteSpace: 'nowrap' }}>{fmt(lead.created_at)}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ color: N.blue, fontSize: '0.8rem', fontWeight: 600 }}>View →</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 20 }}>
            <button disabled={page <= 1} onClick={() => { setPage(p => p-1); fetchLeads(page-1, search) }}
              style={{ padding: '8px 16px', borderRadius: 8, border: `1px solid ${N.greyLight}`, background: 'white', cursor: page<=1?'not-allowed':'pointer', opacity: page<=1?0.4:1, fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem' }}>← Prev</button>
            <span style={{ fontSize: '0.85rem', color: N.grey }}>Page {page} of {totalPages}</span>
            <button disabled={page >= totalPages} onClick={() => { setPage(p => p+1); fetchLeads(page+1, search) }}
              style={{ padding: '8px 16px', borderRadius: 8, border: `1px solid ${N.greyLight}`, background: 'white', cursor: page>=totalPages?'not-allowed':'pointer', opacity: page>=totalPages?0.4:1, fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem' }}>Next →</button>
          </div>
        )}
      </div>

      {/* LEAD DETAIL DRAWER */}
      {selected && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(11,35,72,0.5)',
          zIndex: 100, display: 'flex', justifyContent: 'flex-end',
          backdropFilter: 'blur(4px)',
        }} onClick={() => setSelected(null)}>
          <div style={{
            width: '100%', maxWidth: 440,
            background: 'white', height: '100%',
            overflowY: 'auto', padding: '32px 28px',
            boxShadow: '-20px 0 60px rgba(11,35,72,0.15)',
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: N.navy }}>Lead Details</h2>
              <button onClick={() => setSelected(null)} style={{ background: N.greyLight, border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: N.greyText }}>✕</button>
            </div>

            <div style={{ width: 56, height: 56, borderRadius: '50%', background: N.navy, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 700, marginBottom: 12 }}>{initials(selected)}</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: N.navy, marginBottom: 4 }}>{[selected.first_name, selected.last_name].filter(Boolean).join(' ') || 'Unknown'}</h3>
            <p style={{ fontSize: '0.82rem', color: N.grey, marginBottom: 24 }}>ID: {selected.id} · Added {fmt(selected.created_at)}</p>

            {[
              { label: 'Email', value: selected.email },
              { label: 'Phone', value: selected.phone },
              { label: 'Address', value: [selected.address, selected.city, selected.state].filter(Boolean).join(', ') || null },
              { label: 'Property use', value: selected.property_use },
              { label: 'Ownership type', value: selected.field_1 },
              { label: 'Income source', value: selected.field_2 },
              { label: 'Pre-tax income', value: selected.field_3 },
              { label: 'Mortgage lates', value: selected.foreclosure === 'yes' ? 'Yes' : 'No' },
              { label: 'Lead source', value: selected.lead_source },
            ].filter(r => r.value).map(row => (
              <div key={row.label} style={{ padding: '12px 0', borderBottom: `1px solid ${N.greyLight}` }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 600, color: N.grey, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>{row.label}</div>
                <div style={{ fontSize: '0.9rem', color: N.navy }}>{String(row.value)}</div>
              </div>
            ))}

            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {selected.email && (
                <a href={`mailto:${selected.email}`} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  background: N.navy, color: 'white', borderRadius: 10, padding: '12px',
                  textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem',
                }}>✉ Email {selected.first_name || 'Lead'}</a>
              )}
              {selected.phone && (
                <a href={`tel:${selected.phone}`} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  background: 'white', color: N.navy, border: `1.5px solid ${N.greyLight}`,
                  borderRadius: 10, padding: '12px', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem',
                }}>📞 Call {selected.first_name || 'Lead'}</a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
