'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

const PRODUCTS = [
  { name: 'HELOC', desc: 'Access your home equity with a revolving line of credit. Use it for renovations, debt consolidation, or anything else.', s1n: 'Up to 90%', s1l: 'Max LTV', s2n: '5 days', s2l: 'To close' },
  { name: 'DSCR Loans', desc: 'Qualify based on rental income alone — no personal income verification required. Perfect for investors.', s1n: 'No W2', s1l: 'Required', s2n: '1–4', s2l: 'Units' },
  { name: 'Cash-Out Refinance', desc: 'Replace your current mortgage and take out your equity as cash. Lock in a great rate at the same time.', s1n: '$0', s1l: 'Min cash-out', s2n: '80%', s2l: 'Max LTV' },
  { name: 'Purchase', desc: 'Get the best rate from 100+ wholesale lenders. Fast pre-approval and a smooth close.', s1n: 'Same day', s1l: 'Pre-approval', s2n: '100+', s2l: 'Lenders' },
  { name: 'Rate/Term Refinance', desc: 'Lower your rate or shorten your term without taking cash out.', s1n: 'Competitive', s1l: 'Rates', s2n: 'No-cost', s2l: 'Options' },
  { name: 'FHA / VA', desc: 'Government-backed programs with low down payments and flexible credit requirements.', s1n: '3.5%', s1l: 'Down (FHA)', s2n: '0%', s2l: 'Down (VA)' },
  { name: 'Home Equity Agreement', desc: 'Access equity without monthly payments. Share a portion of future appreciation instead.', s1n: 'No monthly', s1l: 'Payments', s2n: '10 yr', s2l: 'Term' },
]

const FAQS = [
  { q: 'What is a wholesale mortgage broker?', a: "A wholesale mortgage broker works with wholesale lenders on your behalf — lenders that don't deal directly with the public. This gives you access to rates and programs you can't get by going directly to a retail bank." },
  { q: 'Does getting a rate quote affect my credit?', a: "No. Our initial rate quote requires no credit pull. We only pull credit when you're ready to move forward with a full application, and we'll always ask permission first." },
  { q: 'How fast can you close a loan?', a: 'Depending on the loan type and your documentation, we can close as fast as 5 business days. Most purchase loans close in 21–30 days. HELOC closings can happen in 5–10 days.' },
  { q: 'What is a DSCR loan?', a: "A DSCR (Debt Service Coverage Ratio) loan lets real estate investors qualify based on the property's rental income rather than their personal income. No W2s, no tax returns needed." },
  { q: 'Can I get a HELOC without refinancing my current mortgage?', a: "Yes. A HELOC is a separate second lien on your property. You keep your existing mortgage and its rate exactly as-is." },
  { q: 'What states do you serve?', a: 'We are currently licensed in California for all loan types including purchase, refinance, HELOC, DSCR, FHA, and VA loans.' },
]

type DropdownItem = { label: string }

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [heroAddress, setHeroAddress] = useState('')
  const [modalAddress, setModalAddress] = useState('')
  const [ownership, setOwnership] = useState('')
  const [occupancy, setOccupancy] = useState('')
  const [forSale, setForSale] = useState('')
  const [lates, setLates] = useState('')
  const [preTaxIncome, setPreTaxIncome] = useState('')
  const [otherIncome, setOtherIncome] = useState('')
  const [incomeSource, setIncomeSource] = useState('W2 Employee')
  const [firstName, setFirstName] = useState('')
  const [middleName, setMiddleName] = useState('')
  const [lastName, setLastName] = useState('')
  const [suffix, setSuffix] = useState('')
  const [dob, setDob] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [consentTCPA, setConsentTCPA] = useState(false)
  const [consentPrivacy, setConsentPrivacy] = useState(false)
  const [addrError, setAddrError] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [activeTab, setActiveTab] = useState(0)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [navScrolled, setNavScrolled] = useState(false)
  const [heroDropdown, setHeroDropdown] = useState<DropdownItem[]>([])
  const [modalDropdown, setModalDropdown] = useState<DropdownItem[]>([])
  const heroDebounce = useRef<ReturnType<typeof setTimeout> | null>(null)
  const modalDebounce = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    const onScroll = () => setNavScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => { window.removeEventListener('scroll', onScroll); observer.disconnect() }
  }, [])

  useEffect(() => { document.body.style.overflow = modalOpen ? 'hidden' : '' }, [modalOpen])

  const fetchAddresses = useCallback((val: string, setter: (items: DropdownItem[]) => void, debounceRef: React.MutableRefObject<ReturnType<typeof setTimeout> | null>) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!val || val.length < 4) { setter([]); return }
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(val)}&limit=5&bbox=-125,24,-66,50&lang=en`)
        const data = await res.json()
        const items = (data.features || [])
          .filter((f: {properties?: {country?: string}}) => f.properties?.country === 'United States')
          .map((f: {properties?: {housenumber?: string; street?: string; city?: string; state?: string}}) => {
            const p = f.properties || {}
            return { label: [p.housenumber, p.street, p.city, p.state].filter(Boolean).join(', ') }
          })
        setter(items)
      } catch { setter([]) }
    }, 350)
  }, [])

  function openModal(addr?: string) {
    if (addr) setModalAddress(addr)
    setModalOpen(true)
    setCurrentStep(1)
    setSubmitted(false)
  }

  function goToStep(n: number) {
    if (n === 2) {
      if (!modalAddress || modalAddress.length < 6) { setAddrError('Please enter a valid property address.'); return }
      if (!/\d/.test(modalAddress)) { setAddrError('Address must include a street number.'); return }
      if (!ownership) { setAddrError('Please select an ownership type.'); return }
      if (!occupancy) { setAddrError('Please select how you will use this property.'); return }
      setAddrError('')
    }
    setCurrentStep(n)
  }

  async function handleSubmit() {
    if (!email || !email.includes('@')) { setSubmitError('Please enter a valid email address.'); return }
    if (!phone || phone.replace(/\D/g, '').length < 10) { setSubmitError('Please enter a valid 10-digit phone number.'); return }
    if (!consentTCPA) { setSubmitError('Please agree to receive communications to continue.'); return }
    if (!consentPrivacy) { setSubmitError('Please agree to the Privacy Policy to continue.'); return }
    setSubmitError('')
    setSubmitting(true)
    const parts = modalAddress.split(',').map((s: string) => s.trim())
    const street = parts[0] || ''
    const city = parts[1] || ''
    const stateZip = (parts[2] || '').trim().split(' ')
    try {
      await fetch('/api/submit-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ first_name: firstName, last_name: lastName, email, phone: phone.replace(/\D/g, '').slice(0, 10), address: street, city, state: stateZip[0] || '', zip: stateZip[1] || '', property_address: street, property_city: city, property_state: stateZip[0] || '', property_use: occupancy, ownership_type: ownership, income_source: incomeSource, pre_tax_income: preTaxIncome, mortgage_lates: lates === 'Yes' ? 'yes' : 'no' }),
      })
    } catch { /* show success anyway */ }
    setSubmitting(false)
    setSubmitted(true)
  }

  const navy = '#0B2348', blue = '#1967E4', gold = '#C8960A', grey = '#4A6480', greyMid = '#8EA3BF', greyLight = '#E4EAF2', offWhite = '#F6F8FC'

  const inputStyle: React.CSSProperties = { width: '100%', padding: '12px 14px', border: `1.5px solid ${greyLight}`, borderRadius: 9, fontSize: '0.9rem', fontFamily: "'DM Sans', sans-serif", color: navy, background: offWhite, outline: 'none', boxSizing: 'border-box', marginBottom: 12 }
  const continueBtnStyle: React.CSSProperties = { background: '#1B4F9A', color: 'white', border: 'none', borderRadius: 100, padding: '12px 28px', fontSize: '0.92rem', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }
  const backBtnStyle: React.CSSProperties = { background: greyLight, color: navy, border: 'none', borderRadius: 100, padding: '12px 28px', fontSize: '0.92rem', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }

  function YNTile({ label, selected, onSelect }: { label: string; selected: boolean; onSelect: () => void }) {
    return <button onClick={onSelect} style={{ padding: '11px 32px', borderRadius: 100, border: `1.5px solid ${selected ? blue : greyLight}`, background: selected ? 'rgba(25,103,228,0.07)' : 'white', color: selected ? blue : grey, fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem', fontWeight: selected ? 600 : 500, cursor: 'pointer' }}>{label}</button>
  }

  function OccTile({ icon, label, selected, onSelect }: { icon: string; label: string; selected: boolean; onSelect: () => void }) {
    return <div onClick={onSelect} style={{ flex: 1, minWidth: 110, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '14px 10px', border: `1.5px solid ${selected ? blue : greyLight}`, borderRadius: 12, background: selected ? 'rgba(25,103,228,0.07)' : offWhite, cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500, color: selected ? blue : grey }}><span style={{ fontSize: 22 }}>{icon}</span><span>{label}</span></div>
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: navy, background: 'white', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{overflow-x:hidden;-webkit-font-smoothing:antialiased}
        .reveal{opacity:0;transform:translateY(22px);transition:opacity 0.6s ease,transform 0.6s ease}
        .reveal.visible{opacity:1;transform:translateY(0)}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.6;transform:scale(1.3)}}
        .anim-1{animation:fadeUp 0.6s 0.1s ease forwards;opacity:0}
        .anim-2{animation:fadeUp 0.6s 0.2s ease forwards;opacity:0}
        .anim-3{animation:fadeUp 0.6s 0.3s ease forwards;opacity:0}
        .anim-4{animation:fadeUp 0.7s 0.4s ease forwards;opacity:0}
        .anim-5{animation:fadeUp 0.6s 0.5s ease forwards;opacity:0}
        .pulse-dot{width:7px;height:7px;border-radius:50%;background:#C8960A;flex-shrink:0;animation:pulse 2s ease infinite}
        @media(max-width:900px){.nav-ul{display:none!important}.nav-burger{display:flex!important}.how-3col{grid-template-columns:1fr!important}.how-line{display:none!important}.heloc-2col{grid-template-columns:1fr!important}.heloc-right-hide{display:none!important}.tab-2col{grid-template-columns:1fr!important}.tab-vis-hide{display:none!important}.about-2col{grid-template-columns:1fr!important}.footer-flex{flex-direction:column!important}}
        input::placeholder{color:#8EA3BF}
        a{color:inherit}
      `}</style>

      {/* NAV */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(255,255,255,0.93)', backdropFilter: 'blur(16px)', borderBottom: `1px solid rgba(13,27,62,0.07)`, padding: '0 5%', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: navScrolled ? '0 4px 24px rgba(11,35,72,0.08)' : 'none', transition: 'box-shadow 0.3s' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 11, textDecoration: 'none' }}>
          <div style={{ width: 38, height: 38, background: navy, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 600, color: navy, letterSpacing: '-0.02em', lineHeight: 1.2 }}>MME Home <span style={{ display: 'block', fontSize: '0.62rem', fontWeight: 500, color: greyMid }}>Making Mortgage Easy</span></div>
        </a>
        <ul className="nav-ul" style={{ display: 'flex', alignItems: 'center', gap: '2rem', listStyle: 'none' }}>
          {[['#products','Products'],['#about','About'],['#reviews','Reviews']].map(([h,l]) => <li key={h}><a href={h} style={{ textDecoration: 'none', color: grey, fontSize: '0.88rem', fontWeight: 500 }}>{l}</a></li>)}
          <li><button onClick={() => openModal()} style={{ background: blue, color: 'white', padding: '9px 22px', borderRadius: 8, fontWeight: 600, fontSize: '0.88rem', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Get My Rate</button></li>
        </ul>
        <button className="nav-burger" onClick={() => setMobileOpen(o => !o)} style={{ display: 'none', flexDirection: 'column', gap: 5, background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
          {[0,1,2].map(i => <span key={i} style={{ display: 'block', width: 22, height: 2, background: navy, borderRadius: 2 }}/>)}
        </button>
      </nav>
      {mobileOpen && <div style={{ position: 'fixed', top: 68, left: 0, right: 0, background: 'white', borderBottom: `1px solid ${greyLight}`, padding: '20px 5%', zIndex: 99, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {[['#products','Products'],['#about','About'],['#reviews','Reviews']].map(([h,l]) => <a key={h} href={h} onClick={() => setMobileOpen(false)} style={{ textDecoration: 'none', color: grey, fontSize: '0.95rem', padding: '10px 0', borderBottom: `1px solid ${greyLight}` }}>{l}</a>)}
        <button onClick={() => { setMobileOpen(false); openModal() }} style={{ background: blue, color: 'white', border: 'none', borderRadius: 10, padding: 12, fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", marginTop: 8 }}>Get My Rate →</button>
      </div>}

      {/* HERO */}
      <section style={{ minHeight: '100vh', padding: '160px 5% 100px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', background: 'linear-gradient(160deg,#F0F4FB 0%,#FFFFFF 50%,#EBF1FA 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(27,79,154,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(27,79,154,0.03) 1px,transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }}/>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 680 }}>
          <div className="anim-1" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(27,79,154,0.08)', border: '1px solid rgba(27,79,154,0.18)', color: blue, padding: '7px 16px', borderRadius: 100, fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 28 }}>
            <span className="pulse-dot"/>&nbsp;California Licensed Wholesale Broker
          </div>
          <h1 className="anim-2" style={{ fontFamily: "'Instrument Serif', serif", fontSize: 'clamp(3rem,7vw,5.2rem)', lineHeight: 1.05, color: navy, letterSpacing: '-0.03em', marginBottom: 20 }}>
            Home financing,<em style={{ fontStyle: 'italic', color: '#1B4F9A', display: 'block' }}>done easier.</em>
          </h1>
          <p className="anim-3" style={{ fontSize: '1.05rem', color: grey, lineHeight: 1.7, maxWidth: 500, marginBottom: 40 }}>Access 100+ wholesale lenders for the best rates in California. Purchase, refinance, HELOC, DSCR, FHA/VA — all in one place.</p>
          <div className="anim-4" style={{ background: 'white', borderRadius: 100, padding: '7px 7px 7px 24px', boxShadow: '0 8px 40px rgba(11,35,72,0.12)', border: '1px solid rgba(27,79,154,0.1)', display: 'flex', alignItems: 'center', maxWidth: 560, position: 'relative' }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={greyMid} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginRight: 12 }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <input style={{ flex: 1, border: 'none', background: 'transparent', padding: '12px 0', fontSize: '0.97rem', fontFamily: "'DM Sans', sans-serif", color: navy, outline: 'none', minWidth: 0 }} value={heroAddress} onChange={e => { setHeroAddress(e.target.value); fetchAddresses(e.target.value, setHeroDropdown, heroDebounce) }} placeholder="Enter your property address" autoComplete="off"/>
            <button onClick={() => openModal(heroAddress)} style={{ background: blue, color: 'white', border: 'none', borderRadius: 100, padding: '14px 24px', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", whiteSpace: 'nowrap', flexShrink: 0 }}>Get My Rate</button>
            {heroDropdown.length > 0 && <div style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0, background: 'white', border: `1px solid ${greyLight}`, borderRadius: 16, boxShadow: '0 12px 40px rgba(11,35,72,0.15)', zIndex: 50, overflow: 'hidden' }}>
              {heroDropdown.map((item, i) => <div key={i} style={{ padding: '11px 18px', fontSize: '0.88rem', cursor: 'pointer', borderBottom: `1px solid ${greyLight}` }} onClick={() => { setHeroAddress(item.label); setHeroDropdown([]) }}>{item.label}</div>)}
            </div>}
          </div>
          <p className="anim-4" style={{ fontSize: '0.76rem', color: greyMid, display: 'flex', alignItems: 'center', gap: 6, marginTop: 14 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            No credit pull required · Free rate quote in 60 seconds
          </p>
          <div className="anim-5" style={{ display: 'flex', gap: 36, marginTop: 52 }}>
            {[['100+','Wholesale lenders'],['5 days','Fastest close'],['NMLS#','1082653']].map(([n,l],i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
                {i > 0 && <div style={{ width: 1, background: greyLight, alignSelf: 'stretch' }}/>}
                <div><div style={{ fontFamily: "'Instrument Serif', serif", fontSize: '1.6rem', color: navy, lineHeight: 1.1 }}>{n}</div><div style={{ fontSize: '0.72rem', color: greyMid, fontWeight: 500, marginTop: 3 }}>{l}</div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div style={{ background: 'white', borderTop: `1px solid ${greyLight}`, borderBottom: `1px solid ${greyLight}`, padding: '24px 5%', textAlign: 'center' }}>
        <p style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: greyMid, marginBottom: 18 }}>Wholesale access to top lenders</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
          {['United Wholesale','Pennymac','loanDepot','Rocket Pro','AmeriSave','Better','Cardinal Financial','Caliber'].map(l => <span key={l} style={{ fontSize: '0.8rem', fontWeight: 700, color: greyMid, opacity: 0.55 }}>{l}</span>)}
        </div>
      </div>

      {/* HELOC CALLOUT */}
      <div className="reveal" style={{ background: 'linear-gradient(135deg,#0B2348 0%,#1B4F9A 100%)', padding: '80px 5%' }}>
        <div className="heloc-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center', maxWidth: 1100, margin: '0 auto' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', background: gold, color: navy, padding: '5px 14px', borderRadius: 100, fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 18 }}>Featured Product</div>
            <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 'clamp(2.4rem,4vw,3.4rem)', color: 'white', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 28 }}>Unlock your home equity — without refinancing</h2>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 36 }}>
              {["Access up to 90% of your home's value","Interest-only payment options available","No prepayment penalties","Close in as few as 5 business days"].map(b => (
                <li key={b} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, fontSize: '0.975rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.5 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}><polyline points="20 6 9 17 4 12"/></svg>{b}
                </li>
              ))}
            </ul>
            <button onClick={() => openModal()} style={{ background: gold, color: navy, border: 'none', borderRadius: 10, padding: '15px 40px', fontSize: '0.98rem', fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>See If You Qualify →</button>
          </div>
          <div className="heloc-right-hide" style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 28, padding: 4, maxWidth: 320, width: '100%' }}>
              <div style={{ background: 'white', borderRadius: 24, padding: '36px 28px' }}>
                <div style={{ width: 52, height: 52, background: `linear-gradient(135deg,${blue},#1B4F9A)`, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
                <p style={{ textAlign: 'center', fontSize: '0.78rem', fontWeight: 600, color: greyMid, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>Estimated equity available</p>
                <p style={{ textAlign: 'center', fontFamily: "'Instrument Serif', serif", fontSize: '3rem', color: navy, lineHeight: 1, marginBottom: 4 }}>$84,000</p>
                <p style={{ textAlign: 'center', fontSize: '0.74rem', color: greyMid, marginBottom: 20 }}>Based on 80% LTV · Example only</p>
                <div style={{ height: 1, background: greyLight, marginBottom: 16 }}/>
                {[['Est. home value','$520,000'],['Current balance','$332,000'],['Available equity','$84,000']].map(([l,v]) => <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.83rem', padding: '7px 0', borderBottom: `1px solid ${greyLight}` }}><span style={{ color: grey }}>{l}</span><span style={{ color: navy, fontWeight: 600 }}>{v}</span></div>)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PRODUCTS */}
      <div id="products" style={{ background: 'white', padding: '96px 5%' }}>
        <div className="tab-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'start', maxWidth: 1100, margin: '0 auto' }}>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#1B4F9A', marginBottom: 12 }}>Our products</div>
            <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 'clamp(2rem,3.5vw,3rem)', lineHeight: 1.1, color: navy, letterSpacing: '-0.03em', marginBottom: 32 }}>Every loan type, one broker</h2>
            {PRODUCTS.map((p, i) => (
              <div key={p.name} style={{ borderBottom: `1px solid ${greyLight}`, borderTop: i === 0 ? `1px solid ${greyLight}` : 'none', cursor: 'pointer' }} onClick={() => setActiveTab(i)}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 0', gap: 12 }}>
                  <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: activeTab === i ? '1.55rem' : '1.5rem', color: activeTab === i ? navy : greyMid, transition: 'color 0.3s' }}>{p.name}</span>
                  <span style={{ width: 3, background: activeTab === i ? gold : 'transparent', borderRadius: 100, alignSelf: 'stretch', minHeight: activeTab === i ? 40 : 0, transition: 'all 0.3s' }}/>
                </div>
                {activeTab === i && <div style={{ paddingBottom: 22 }}>
                  <p style={{ fontSize: '0.9rem', color: grey, lineHeight: 1.65, marginBottom: 16, maxWidth: 380 }}>{p.desc}</p>
                  <button onClick={(e) => { e.stopPropagation(); openModal() }} style={{ background: 'transparent', border: `1.5px solid ${navy}`, color: navy, borderRadius: 100, padding: '10px 24px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Get a Quote →</button>
                </div>}
              </div>
            ))}
          </div>
          <div className="tab-vis-hide" style={{ position: 'sticky', top: 100, background: navy, borderRadius: 24, aspectRatio: '4/3', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 32, boxShadow: '0 20px 60px rgba(11,35,72,0.13)' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: gold, marginBottom: 10 }}>{PRODUCTS[activeTab].name}</div>
            <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: '2rem', color: 'white', lineHeight: 1.2, marginBottom: 20 }}>{PRODUCTS[activeTab].desc.split('.')[0]}.</div>
            <div style={{ display: 'flex', gap: 20 }}>
              {[{n:PRODUCTS[activeTab].s1n,l:PRODUCTS[activeTab].s1l},{n:PRODUCTS[activeTab].s2n,l:PRODUCTS[activeTab].s2l}].map(s => (
                <div key={s.l} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: '14px 18px', flex: 1 }}>
                  <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: '1.6rem', color: gold, lineHeight: 1, marginBottom: 4 }}>{s.n}</div>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)' }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section className="reveal" style={{ padding: '96px 5%', background: 'white' }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#1B4F9A', marginBottom: 12 }}>How it works</div>
        <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 'clamp(2rem,3.5vw,3rem)', lineHeight: 1.1, color: navy, letterSpacing: '-0.03em', marginBottom: 16 }}>Three steps to your best rate</h2>
        <p style={{ fontSize: '0.975rem', color: grey, lineHeight: 1.65, maxWidth: 540, marginBottom: 52 }}>No bank branch, no hassle. Everything online, with a real person available every step of the way.</p>
        <div className="how-3col" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', position: 'relative' }}>
          <div className="how-line" style={{ position: 'absolute', top: 39, left: 'calc(16.66% + 24px)', right: 'calc(16.66% + 24px)', height: 1, background: `linear-gradient(to right,#4A8DF5,${gold})`, zIndex: 0 }}/>
          {[['1','Tell us about your property','Enter your address and answer a few quick questions. Takes under 2 minutes.'],['2','Get matched with lenders','We search 100+ wholesale lenders and surface the best rates instantly.'],['3','Close on your timeline','Work directly with your broker to lock your rate and close — as fast as 5 days.']].map(([n,t,d],i) => (
            <div key={n} style={{ padding: i===0?'0 28px 0 0':i===2?'0 0 0 28px':'0 28px', textAlign: 'center', position: 'relative' }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'white', border: `2px solid ${greyLight}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Instrument Serif', serif", fontSize: '1.5rem', color: '#1B4F9A', margin: '0 auto 26px', position: 'relative', zIndex: 1, boxShadow: '0 4px 24px rgba(11,35,72,0.08)' }}>{n}</div>
              <div style={{ fontSize: '0.98rem', fontWeight: 600, color: navy, marginBottom: 8 }}>{t}</div>
              <p style={{ fontSize: '0.855rem', color: grey, lineHeight: 1.65 }}>{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* REVIEWS */}
      <section className="reveal" id="reviews" style={{ background: navy, padding: '96px 5%' }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: gold, marginBottom: 12 }}>Reviews</div>
        <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 'clamp(2rem,3.5vw,3rem)', lineHeight: 1.1, color: 'white', letterSpacing: '-0.03em', marginBottom: 16 }}>What clients are saying</h2>
        <p style={{ fontSize: '0.975rem', color: 'rgba(255,255,255,0.5)', marginBottom: 28 }}>Real reviews from real homeowners and investors.</p>
        <a href="https://www.zillow.com/lender-profile/Shane%20Bakhtiari/" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', padding: '14px 28px', borderRadius: 12, fontSize: '0.92rem', fontWeight: 600, textDecoration: 'none' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#006AFF"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          View reviews on Zillow →
        </a>
      </section>

      {/* ABOUT */}
      <section className="reveal" id="about" style={{ background: offWhite, padding: '96px 5%' }}>
        <div className="about-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 64, alignItems: 'start', maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ width: '100%', aspectRatio: '3/4', background: `linear-gradient(135deg,${navy} 0%,#1B4F9A 100%)`, borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Instrument Serif', serif", fontSize: '4rem', color: 'white', position: 'relative', overflow: 'hidden' }}>
            SB
            <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 100, padding: '7px 18px', fontSize: '0.72rem', fontWeight: 600, color: 'white', whiteSpace: 'nowrap' }}>NMLS# 1082653 · DRE# 02244476</div>
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#1B4F9A', marginBottom: 12 }}>About your broker</div>
            <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 'clamp(2rem,3.5vw,3rem)', lineHeight: 1.1, color: navy, letterSpacing: '-0.03em', marginBottom: 16 }}>Shane Bakhtiari</h2>
            <p style={{ fontSize: '0.975rem', color: grey, lineHeight: 1.75, marginBottom: 20 }}>Licensed wholesale mortgage broker in California with access to over 100 lenders. I work on your behalf — not the bank&apos;s — to find the most competitive rates and terms for your unique situation.</p>
            <p style={{ fontSize: '0.975rem', color: grey, lineHeight: 1.75, marginBottom: 24 }}>Whether you&apos;re purchasing your first home, refinancing, tapping your equity, or building a rental portfolio with DSCR loans — I&apos;ve got the tools and lender relationships to make it happen.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, margin: '32px 0' }}>
              {[['100+','Wholesale lenders'],['5 days','Fastest close'],['$0','Rate quote cost'],['CA','Licensed statewide']].map(([n,l]) => (
                <div key={l} style={{ background: 'white', borderRadius: 14, padding: '18px 20px' }}>
                  <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: '1.8rem', color: navy, marginBottom: 4 }}>{n}</div>
                  <div style={{ fontSize: '0.78rem', color: greyMid, fontWeight: 500 }}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button onClick={() => openModal()} style={{ background: navy, color: 'white', border: 'none', borderRadius: 10, padding: '13px 28px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Get My Free Rate Quote</button>
              <a href="mailto:shane@shieldhomeloans.com" style={{ background: 'transparent', color: navy, border: `1.5px solid ${navy}`, borderRadius: 10, padding: '13px 28px', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>Email Shane</a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="reveal" style={{ background: offWhite, padding: '96px 5%' }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#1B4F9A', marginBottom: 12 }}>FAQ</div>
        <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 'clamp(2rem,3.5vw,3rem)', lineHeight: 1.1, color: navy, letterSpacing: '-0.03em', marginBottom: 16, textAlign: 'center' }}>Common questions</h2>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          {FAQS.map((f, i) => (
            <div key={i} style={{ borderBottom: `1px solid ${greyLight}`, borderTop: i === 0 ? `1px solid ${greyLight}` : 'none' }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 0', gap: 16, fontFamily: "'DM Sans', sans-serif", fontSize: '1rem', fontWeight: 600, color: openFaq === i ? blue : navy, textAlign: 'left' }}>
                {f.q}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, transform: openFaq === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              {openFaq === i && <div style={{ paddingBottom: 18 }}><p style={{ fontSize: '0.9rem', color: grey, lineHeight: 1.75 }}>{f.a}</p></div>}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="reveal" style={{ padding: '80px 5%', background: `linear-gradient(135deg,${navy} 0%,#1B4F9A 100%)`, textAlign: 'center' }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: gold, marginBottom: 12 }}>Ready to start?</div>
        <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 'clamp(2rem,3.5vw,3rem)', lineHeight: 1.1, color: 'white', letterSpacing: '-0.03em', maxWidth: 580, margin: '0 auto 12px' }}>Get your free rate quote today</h2>
        <p style={{ fontSize: '0.975rem', color: 'rgba(255,255,255,0.5)', margin: '0 auto 34px', maxWidth: 540 }}>No credit pull. No obligation. Takes under 2 minutes.</p>
        <button onClick={() => openModal()} style={{ background: gold, color: navy, border: 'none', borderRadius: 100, padding: '16px 40px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Get My Rate →</button>
      </section>

      {/* FOOTER */}
      <footer style={{ background: navy, borderTop: '1px solid rgba(255,255,255,0.08)', padding: '52px 5% 32px' }}>
        <div className="footer-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 40, marginBottom: 40, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: 'white' }}>MME Home <span style={{ display: 'block', fontSize: '0.62rem', fontWeight: 400, color: 'rgba(255,255,255,0.35)', marginTop: 1 }}>Making Mortgage Easy</span></div>
            <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', marginTop: 10, maxWidth: 250, lineHeight: 1.6 }}>Licensed wholesale mortgage broker in California. NMLS# 1082653 · DRE# 02244476</p>
          </div>
          <div style={{ display: 'flex', gap: 56, flexWrap: 'wrap' }}>
            <div>
              <h4 style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 14 }}>Products</h4>
              {['Purchase','Refinance','Cash-Out Refi','HELOC','FHA / VA','DSCR Loans'].map(l => <button key={l} onClick={() => openModal()} style={{ display: 'block', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: '0.855rem', color: 'rgba(255,255,255,0.6)', marginBottom: 9, padding: 0, textAlign: 'left' }}>{l}</button>)}
            </div>
            <div>
              <h4 style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 14 }}>Company</h4>
              {[['#about','About Us'],['#products','How It Works'],['#reviews','Reviews'],['mailto:shane@shieldhomeloans.com','Contact']].map(([h,l]) => <a key={l} href={h} style={{ display: 'block', textDecoration: 'none', fontSize: '0.855rem', color: 'rgba(255,255,255,0.6)', marginBottom: 9 }}>{l}</a>)}
            </div>
          </div>
        </div>
        <div style={{ paddingTop: 26, borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: '0.7rem', color: 'rgba(255,255,255,0.28)', lineHeight: 1.65 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 10 }}>
            <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>© {new Date().getFullYear()} MME Home · Shield Home Loans Inc. · NMLS# 2396589</span>
            <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>32 Discovery Suite 170, Irvine CA · (888) 819-9981</span>
          </div>
          <p>MME Home is a DBA of Shield Home Loans Inc., a licensed California mortgage broker. NMLS# 2396589. DRE# 02244476. This is not an offer to lend. All loans subject to credit approval, appraisal, and lender guidelines. Equal Housing Opportunity.</p>
        </div>
      </footer>

      {/* MODAL */}
      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(13,27,62,0.72)', backdropFilter: 'blur(8px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={() => setModalOpen(false)}>
          <div style={{ background: 'white', borderRadius: 28, padding: 40, maxWidth: 500, width: '100%', position: 'relative', boxShadow: '0 24px 80px rgba(13,27,62,0.3)', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setModalOpen(false)} style={{ position: 'absolute', top: 16, right: 16, background: greyLight, border: 'none', cursor: 'pointer', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', color: grey }}>✕</button>

            {!submitted && <div style={{ display: 'flex', gap: 6, marginBottom: 26 }}>
              {[1,2,3,4,5,6,7].map(i => <div key={i} style={{ height: 3, borderRadius: 3, flex: 1, background: i === currentStep ? '#1B4F9A' : greyLight, transition: 'background 0.3s' }}/>)}
            </div>}

            {/* Step 1 */}
            {!submitted && currentStep === 1 && <div>
              <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: '1.65rem', color: navy, marginBottom: 6, lineHeight: 1.2 }}>Tell us about your property</h2>
              <p style={{ fontSize: '0.86rem', color: grey, marginBottom: 24, lineHeight: 1.55 }}>Enter the property address to get started.</p>
              <div style={{ position: 'relative', marginBottom: 12 }}>
                <input style={inputStyle} value={modalAddress} onChange={e => { setModalAddress(e.target.value); fetchAddresses(e.target.value, setModalDropdown, modalDebounce) }} placeholder="Property address" autoComplete="off"/>
                {modalDropdown.length > 0 && <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, background: 'white', border: `1px solid ${greyLight}`, borderRadius: 16, boxShadow: '0 12px 40px rgba(11,35,72,0.15)', zIndex: 50, overflow: 'hidden' }}>
                  {modalDropdown.map((item, i) => <div key={i} style={{ padding: '11px 18px', fontSize: '0.88rem', cursor: 'pointer', borderBottom: `1px solid ${greyLight}` }} onClick={() => { setModalAddress(item.label); setModalDropdown([]) }}>{item.label}</div>)}
                </div>}
              </div>
              <p style={{ fontSize: '0.78rem', fontWeight: 600, color: navy, margin: '16px 0 10px' }}>Ownership type</p>
              <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                {["I Own It","I'm Buying It","Other"].map(o => <YNTile key={o} label={o} selected={ownership === o} onSelect={() => setOwnership(o)}/>)}
              </div>
              <p style={{ fontSize: '0.78rem', fontWeight: 600, color: navy, margin: '16px 0 10px' }}>How will you use this property?</p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
                {[['🏠','Primary Residence'],['🏖️','Secondary / Vacation'],['🏢','Investment Property']].map(([icon,label]) => <OccTile key={label} icon={icon} label={label} selected={occupancy === label} onSelect={() => setOccupancy(label)}/>)}
              </div>
              {addrError && <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '10px 14px', fontSize: '0.82rem', color: '#991B1B', marginBottom: 14, marginTop: 10 }}>{addrError}</div>}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 20, paddingTop: 16, borderTop: `1px solid ${greyLight}` }}>
                <span style={{ fontSize: '0.72rem', color: greyMid }}>🔒 No credit pull required</span>
                <button style={continueBtnStyle} onClick={() => goToStep(2)}>Continue →</button>
              </div>
            </div>}

            {/* Step 2 */}
            {!submitted && currentStep === 2 && <div>
              <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: '1.65rem', color: navy, marginBottom: 6 }}>Is this property for sale?</h2>
              <p style={{ fontSize: '0.86rem', color: grey, marginBottom: 24 }}>This helps us identify the right loan programs.</p>
              <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
                <YNTile label="Yes" selected={forSale === 'Yes'} onSelect={() => setForSale('Yes')}/>
                <YNTile label="No" selected={forSale === 'No'} onSelect={() => setForSale('No')}/>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 20, paddingTop: 16, borderTop: `1px solid ${greyLight}` }}>
                <button style={backBtnStyle} onClick={() => goToStep(1)}>← Back</button>
                <button style={continueBtnStyle} onClick={() => goToStep(3)}>Continue →</button>
              </div>
            </div>}

            {/* Step 3 */}
            {!submitted && currentStep === 3 && <div>
              <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: '1.65rem', color: navy, marginBottom: 6 }}>Any mortgage lates in the past 12 months?</h2>
              <p style={{ fontSize: '0.86rem', color: grey, marginBottom: 24 }}>Late payments may affect program eligibility.</p>
              <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
                <YNTile label="Yes" selected={lates === 'Yes'} onSelect={() => setLates('Yes')}/>
                <YNTile label="No" selected={lates === 'No'} onSelect={() => setLates('No')}/>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 20, paddingTop: 16, borderTop: `1px solid ${greyLight}` }}>
                <button style={backBtnStyle} onClick={() => goToStep(2)}>← Back</button>
                <button style={continueBtnStyle} onClick={() => goToStep(4)}>Continue →</button>
              </div>
            </div>}

            {/* Step 4 */}
            {!submitted && currentStep === 4 && <div>
              <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: '1.65rem', color: navy, marginBottom: 6 }}>Tell us about your income</h2>
              <p style={{ fontSize: '0.86rem', color: grey, marginBottom: 24 }}>Used to match you with the right programs.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <input style={inputStyle} value={preTaxIncome} onChange={e => setPreTaxIncome(e.target.value)} placeholder="Annual pre-tax income"/>
                <input style={inputStyle} value={otherIncome} onChange={e => setOtherIncome(e.target.value)} placeholder="Other income (optional)"/>
              </div>
              <select style={inputStyle} value={incomeSource} onChange={e => setIncomeSource(e.target.value)}>
                {['W2 Employee','Self-Employed','Retired','Rental Income','Other'].map(o => <option key={o}>{o}</option>)}
              </select>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 8, paddingTop: 16, borderTop: `1px solid ${greyLight}` }}>
                <button style={backBtnStyle} onClick={() => goToStep(3)}>← Back</button>
                <button style={continueBtnStyle} onClick={() => goToStep(5)}>Continue →</button>
              </div>
            </div>}

            {/* Step 5 */}
            {!submitted && currentStep === 5 && <div>
              <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: '1.65rem', color: navy, marginBottom: 6 }}>What&apos;s your legal name?</h2>
              <p style={{ fontSize: '0.86rem', color: grey, marginBottom: 24 }}>As it appears on your government-issued ID.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <input style={inputStyle} value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First name"/>
                <input style={inputStyle} value={middleName} onChange={e => setMiddleName(e.target.value)} placeholder="Middle name"/>
                <input style={inputStyle} value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last name"/>
                <select style={inputStyle} value={suffix} onChange={e => setSuffix(e.target.value)}>
                  <option value="">No suffix</option>
                  {['Jr.','Sr.','II','III'].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 8, paddingTop: 16, borderTop: `1px solid ${greyLight}` }}>
                <button style={backBtnStyle} onClick={() => goToStep(4)}>← Back</button>
                <button style={continueBtnStyle} onClick={() => goToStep(6)}>Continue →</button>
              </div>
            </div>}

            {/* Step 6 */}
            {!submitted && currentStep === 6 && <div>
              <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: '1.65rem', color: navy, marginBottom: 6 }}>Date of birth</h2>
              <p style={{ fontSize: '0.86rem', color: grey, marginBottom: 24 }}>Required for identity verification.</p>
              <input style={inputStyle} type="date" value={dob} onChange={e => setDob(e.target.value)}/>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 8, paddingTop: 16, borderTop: `1px solid ${greyLight}` }}>
                <button style={backBtnStyle} onClick={() => goToStep(5)}>← Back</button>
                <button style={continueBtnStyle} onClick={() => goToStep(7)}>Continue →</button>
              </div>
            </div>}

            {/* Step 7 */}
            {!submitted && currentStep === 7 && <div>
              <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: '1.65rem', color: navy, marginBottom: 6 }}>Create your account</h2>
              <p style={{ fontSize: '0.86rem', color: grey, marginBottom: 24 }}>We&apos;ll send your rate quote here.</p>
              <input style={inputStyle} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address"/>
              <input style={inputStyle} type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone number"/>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 14, cursor: 'pointer', fontSize: '0.82rem', color: navy, lineHeight: 1.5 }}>
                <input type="checkbox" checked={consentTCPA} onChange={e => setConsentTCPA(e.target.checked)} style={{ width: 18, height: 18, flexShrink: 0, marginTop: 1, accentColor: blue }}/>
                I agree to receive calls and texts from MME Home / Shield Home Loans about my mortgage inquiry. Reply STOP to opt out.
              </label>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 14, cursor: 'pointer', fontSize: '0.82rem', color: navy, lineHeight: 1.5 }}>
                <input type="checkbox" checked={consentPrivacy} onChange={e => setConsentPrivacy(e.target.checked)} style={{ width: 18, height: 18, flexShrink: 0, marginTop: 1, accentColor: blue }}/>
                I agree to the Privacy Policy and Terms of Service.
              </label>
              {submitError && <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '10px 14px', fontSize: '0.82rem', color: '#991B1B', marginBottom: 14 }}>{submitError}</div>}
              <button onClick={handleSubmit} disabled={submitting} style={{ width: '100%', background: navy, color: 'white', border: 'none', borderRadius: 10, padding: 14, fontSize: '0.95rem', fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans', sans-serif", marginTop: 6, opacity: submitting ? 0.6 : 1 }}>
                {submitting ? 'Submitting...' : 'Get My Rate Quote →'}
              </button>
              <p style={{ fontSize: '0.7rem', color: greyMid, textAlign: 'center', marginTop: 10, lineHeight: 1.5 }}>No credit pull required to receive your rate quote.</p>
            </div>}

            {/* Success */}
            {submitted && <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <div style={{ width: 64, height: 64, background: 'rgba(74,141,245,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={blue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: '1.65rem', color: navy, marginBottom: 6 }}>You&apos;re all set!</h2>
              <p style={{ fontSize: '0.9rem', color: grey, lineHeight: 1.7, marginBottom: 24 }}>Thank you! Shane will review your information and reach out within 1 business day with your personalized rate quote.</p>
              <a href="https://www.zillow.com/lender-profile/Shane%20Bakhtiari/" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'transparent', color: navy, border: `1.5px solid ${navy}`, borderRadius: 10, padding: '13px 28px', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none' }}>View Zillow Reviews →</a>
            </div>}
          </div>
        </div>
      )}
    </div>
  )
}
