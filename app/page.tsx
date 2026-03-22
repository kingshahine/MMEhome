'use client'

import { useEffect } from 'react'

export default function Home() {
  useEffect(() => {
    // Scroll reveal
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible')
      }),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))

    // Nav scroll shadow
    const nav = document.getElementById('mainNav')
    const onScroll = () => nav?.classList.toggle('scrolled', window.scrollY > 20)
    window.addEventListener('scroll', onScroll)

    // FAQ accordion
    document.querySelectorAll('.faq-q').forEach(btn => {
      btn.addEventListener('click', () => {
        const isOpen = btn.classList.contains('open')
        document.querySelectorAll('.faq-q').forEach(b => {
          b.classList.remove('open')
          const a = b.nextElementSibling as HTMLElement
          if (a) a.classList.remove('open')
        })
        if (!isOpen) {
          btn.classList.add('open')
          const ans = btn.nextElementSibling as HTMLElement
          if (ans) ans.classList.add('open')
        }
      })
    })

    // Products tabs
    document.querySelectorAll('.products-tab-item').forEach((item, i) => {
      item.addEventListener('click', () => {
        document.querySelectorAll('.products-tab-item').forEach(t => t.classList.remove('active'))
        document.querySelectorAll('.tab-visual-panel').forEach(p => p.classList.remove('active'))
        item.classList.add('active')
        const panel = document.querySelector(`.tab-visual-panel[data-tab="${i}"]`)
        if (panel) panel.classList.add('active')
      })
    })

    // Hamburger
    const burger = document.getElementById('navBurger')
    const drawer = document.getElementById('mobileDrawer')
    burger?.addEventListener('click', () => {
      drawer?.classList.toggle('open')
    })
    drawer?.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => drawer.classList.remove('open'))
    })

    // Cookie banner
    if (!localStorage.getItem('cookie_consent')) {
      setTimeout(() => document.getElementById('cookieBanner')?.classList.add('show'), 1200)
    }
    document.getElementById('cookieAccept')?.addEventListener('click', () => {
      localStorage.setItem('cookie_consent', 'accepted')
      document.getElementById('cookieBanner')?.classList.remove('show')
    })
    document.getElementById('cookieDecline')?.addEventListener('click', () => {
      localStorage.setItem('cookie_consent', 'declined')
      document.getElementById('cookieBanner')?.classList.remove('show')
    })

    return () => {
      window.removeEventListener('scroll', onScroll)
      observer.disconnect()
    }
  }, [])

  return (
    <>
      <style>{`
        :root {
          --navy: #0B2348; --navy-light: #1B4F9A;
          --blue: #1967E4; --blue-bright: #4A8DF5;
          --accent: #C8960A; --accent-light: #E5AD20;
          --white: #FFFFFF; --off-white: #F6F8FC;
          --grey-light: #E4EAF2; --grey-mid: #8EA3BF;
          --grey-text: #4A6480;
          --radius: 14px; --radius-lg: 28px;
          --shadow: 0 4px 24px rgba(11,35,72,0.08);
          --shadow-lg: 0 20px 60px rgba(11,35,72,0.13);
          --shadow-blue: 0 8px 32px rgba(27,79,154,0.22);
        }
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{font-family:'DM Sans',sans-serif;color:var(--navy);background:var(--white);overflow-x:hidden;-webkit-font-smoothing:antialiased}

        nav{position:fixed;top:0;left:0;right:0;z-index:100;background:rgba(255,255,255,0.93);backdrop-filter:blur(16px);border-bottom:1px solid rgba(13,27,62,0.07);padding:0 5%;height:68px;display:flex;align-items:center;justify-content:space-between;transition:box-shadow 0.3s}
        nav.scrolled{box-shadow:var(--shadow)}
        .nav-logo{display:flex;align-items:center;gap:11px;text-decoration:none}
        .nav-logo-icon{width:38px;height:38px;background:#0B2348;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .nav-logo-text{font-size:1rem;font-weight:600;color:var(--navy);letter-spacing:-0.02em;line-height:1.2}
        .nav-logo-text span{display:block;font-size:0.62rem;font-weight:500;color:var(--grey-mid);letter-spacing:0.02em}
        .nav-links{display:flex;align-items:center;gap:2rem;list-style:none}
        .nav-links a{text-decoration:none;color:var(--grey-text);font-size:0.88rem;font-weight:500;transition:color 0.2s}
        .nav-links a:hover{color:var(--navy)}
        .nav-cta{background:var(--blue)!important;color:var(--white)!important;padding:9px 22px!important;border-radius:8px;font-weight:600!important;transition:background 0.2s,transform 0.15s,box-shadow 0.2s!important;box-shadow:var(--shadow-blue)!important;cursor:pointer}
        .nav-cta:hover{background:#0E50C8!important;transform:translateY(-1px)}
        .nav-hamburger{display:none;flex-direction:column;gap:5px;background:none;border:none;cursor:pointer;padding:4px}
        .nav-hamburger span{display:block;width:22px;height:2px;background:var(--navy);border-radius:2px;transition:all 0.3s}
        .mobile-drawer{display:none;position:fixed;top:68px;left:0;right:0;background:white;border-bottom:1px solid var(--grey-light);padding:20px 5%;z-index:99;flex-direction:column;gap:4px;box-shadow:var(--shadow)}
        .mobile-drawer.open{display:flex}
        .mobile-drawer a{text-decoration:none;color:var(--grey-text);font-size:0.95rem;font-weight:500;padding:10px 0;border-bottom:1px solid var(--grey-light)}
        .mobile-drawer a:last-child{border-bottom:none}
        @media(max-width:900px){.nav-links{display:none}.nav-hamburger{display:flex}}

        .hero{min-height:100vh;padding:160px 5% 100px;display:flex;flex-direction:column;align-items:flex-start;justify-content:center;background:linear-gradient(160deg,#F0F4FB 0%,#FFFFFF 50%,#EBF1FA 100%);position:relative;overflow:hidden}
        .hero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 60% 50% at 70% 30%,rgba(27,79,154,0.07) 0%,transparent 60%),radial-gradient(ellipse 40% 40% at 20% 70%,rgba(27,79,154,0.04) 0%,transparent 50%);pointer-events:none}
        .hero-grid{position:absolute;inset:0;z-index:0;pointer-events:none;background-image:linear-gradient(rgba(27,79,154,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(27,79,154,0.03) 1px,transparent 1px);background-size:60px 60px;mask-image:radial-gradient(ellipse 80% 80% at 50% 50%,black 0%,transparent 100%)}
        .hero-left{position:relative;z-index:2;max-width:680px}
        .hero-badge{display:inline-flex;align-items:center;gap:8px;background:rgba(27,79,154,0.08);border:1px solid rgba(27,79,154,0.18);color:var(--blue);padding:7px 16px;border-radius:100px;font-size:0.72rem;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;margin-bottom:28px;opacity:0;animation:fadeUp 0.6s 0.1s ease forwards;box-shadow:0 2px 12px rgba(25,103,228,0.1)}
        .hero-badge::before{content:'';width:7px;height:7px;border-radius:50%;background:#C8960A;flex-shrink:0;animation:pulse 2s ease infinite}
        .hero-h1{font-family:'Instrument Serif',serif;font-size:clamp(3rem,7vw,5.2rem);line-height:1.05;color:var(--navy);letter-spacing:-0.03em;margin-bottom:20px;opacity:0;animation:fadeUp 0.6s 0.2s ease forwards}
        .hero-h1 em{font-style:italic;color:#1B4F9A;display:block}
        .hero-sub{font-size:1.05rem;color:var(--grey-text);line-height:1.7;max-width:500px;margin:0 0 40px;font-weight:400;opacity:0;animation:fadeUp 0.6s 0.3s ease forwards}
        .search-card{background:var(--white);border-radius:100px;padding:7px 7px 7px 24px;box-shadow:0 8px 40px rgba(11,35,72,0.12);border:1px solid rgba(27,79,154,0.1);opacity:0;animation:fadeUp 0.7s 0.4s ease forwards;display:flex;align-items:center;gap:0;max-width:560px;overflow:hidden;position:relative}
        .address-wrap{display:flex;align-items:center;gap:12px;flex:1;min-width:0}
        .address-wrap-icon{color:var(--grey-mid);flex-shrink:0}
        .address-input{flex:1;min-width:0;border:none;background:transparent;padding:12px 0;font-size:0.97rem;font-family:'DM Sans',sans-serif;color:var(--text);outline:none}
        .address-input::placeholder{color:var(--grey-mid)}
        .address-btn{background:var(--blue);color:var(--white);border:none;border-radius:100px;padding:14px 24px;font-size:0.9rem;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;transition:background 0.2s,box-shadow 0.2s,transform 0.15s;white-space:nowrap;display:flex;align-items:center;gap:6px;flex-shrink:0;box-shadow:var(--shadow-blue)}
        .address-btn:hover{background:#0E50C8;transform:translateY(-1px)}
        .search-note{font-size:0.76rem;color:var(--grey-mid);display:flex;align-items:center;gap:6px;margin-top:14px;opacity:0;animation:fadeUp 0.6s 0.45s ease forwards}
        .hero-stats{display:flex;gap:36px;margin-top:52px;opacity:0;animation:fadeUp 0.6s 0.5s ease forwards}
        .stat{display:flex;flex-direction:column}
        .stat-num{font-family:'Instrument Serif',serif;font-size:1.6rem;color:var(--navy);line-height:1.1}
        .stat-label{font-size:0.72rem;color:var(--grey-mid);font-weight:500;margin-top:3px}
        .stat-divider{width:1px;background:var(--grey-light);align-self:stretch}
        .autocomplete-dropdown{position:absolute;top:calc(100% + 8px);left:0;right:0;background:#fff;border:1px solid var(--grey-light);border-radius:16px;box-shadow:0 12px 40px rgba(11,35,72,0.15);z-index:50;overflow:hidden;display:none}
        .autocomplete-dropdown.show{display:block}
        .autocomplete-item{padding:11px 18px;font-size:0.88rem;cursor:pointer;border-bottom:1px solid var(--grey-light);transition:background 0.15s}
        .autocomplete-item:hover{background:#F0F6FF}
        .autocomplete-item:last-child{border-bottom:none}

        .trust-bar{background:var(--white);border-top:1px solid var(--grey-light);border-bottom:1px solid var(--grey-light);padding:24px 5%;text-align:center}
        .trust-bar-label{font-size:0.72rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:var(--grey-mid);margin-bottom:18px}
        .trust-logos{display:flex;justify-content:center;align-items:center;gap:40px;flex-wrap:wrap}
        .trust-logo{font-size:0.8rem;font-weight:700;color:var(--grey-mid);opacity:0.55;transition:opacity 0.2s;letter-spacing:-0.01em}
        .trust-logo:hover{opacity:1}

        section{padding:96px 5%}
        .section-tag{display:inline-block;font-size:0.72rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#1B4F9A;margin-bottom:12px}
        .section-h2{font-family:'Instrument Serif',serif;font-size:clamp(2rem,3.5vw,3rem);line-height:1.1;color:var(--navy);letter-spacing:-0.03em;margin-bottom:16px}
        .section-sub{font-size:0.975rem;color:var(--grey-text);line-height:1.65;max-width:540px;margin-bottom:52px}

        .heloc-callout{background:linear-gradient(135deg,#0B2348 0%,#1B4F9A 100%);padding:80px 5%;position:relative;overflow:hidden}
        .heloc-callout-inner{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center;max-width:1100px;margin:0 auto;position:relative;z-index:2}
        .heloc-tag{display:inline-flex;align-items:center;gap:7px;background:#C8960A;color:#0B2348;padding:5px 14px;border-radius:100px;font-size:0.72rem;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;margin-bottom:18px}
        .heloc-h2{font-family:'Instrument Serif',serif;font-size:clamp(2.4rem,4vw,3.4rem);color:var(--white);line-height:1.1;letter-spacing:-0.02em;margin-bottom:28px}
        .heloc-bullets{list-style:none;display:flex;flex-direction:column;gap:14px;margin-bottom:36px}
        .heloc-bullets li{display:flex;align-items:flex-start;gap:12px;font-size:0.975rem;color:rgba(255,255,255,0.85);line-height:1.5}
        .heloc-btn{background:#C8960A;color:#0B2348;border:none;border-radius:10px;padding:15px 40px;font-size:0.98rem;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;transition:background 0.2s,transform 0.15s}
        .heloc-btn:hover{background:var(--accent-light);transform:translateY(-2px)}
        .heloc-callout-right{display:flex;justify-content:center;align-items:center}
        .heloc-phone-card{background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);border-radius:28px;padding:4px;width:100%;max-width:320px}
        .heloc-phone-inner{background:var(--white);border-radius:24px;padding:36px 28px}
        .heloc-congrats-icon{width:52px;height:52px;background:linear-gradient(135deg,var(--blue),var(--navy-light));border-radius:14px;display:flex;align-items:center;justify-content:center;margin:0 auto 16px}
        .heloc-congrats-label{text-align:center;font-size:0.78rem;font-weight:600;color:var(--grey-mid);letter-spacing:0.04em;text-transform:uppercase;margin-bottom:6px}
        .heloc-congrats-amount{text-align:center;font-family:'Instrument Serif',serif;font-size:3rem;color:var(--navy);line-height:1;margin-bottom:4px}
        .heloc-congrats-sub{text-align:center;font-size:0.74rem;color:var(--grey-mid);margin-bottom:20px}
        .heloc-divider{height:1px;background:var(--grey-light);margin-bottom:16px}
        .heloc-detail-row{display:flex;justify-content:space-between;font-size:0.83rem;padding:7px 0;border-bottom:1px solid var(--grey-light)}
        .heloc-detail-row:last-child{border-bottom:none}
        .heloc-detail-row span:first-child{color:var(--grey-text)}
        .heloc-detail-row span:last-child{color:var(--navy);font-weight:600}

        .products-tab-section{background:var(--white);padding:96px 5%}
        .products-tab-inner{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:start;max-width:1100px;margin:0 auto}
        .products-tab-visual{position:sticky;top:100px;background:#0B2348;border-radius:24px;overflow:hidden;aspect-ratio:4/3;display:flex;align-items:center;justify-content:center;box-shadow:var(--shadow-lg)}
        .tab-visual-panel{display:none;width:100%;height:100%;padding:32px;flex-direction:column;justify-content:center}
        .tab-visual-panel.active{display:flex}
        .tab-visual-label{font-size:0.7rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#C8960A;margin-bottom:10px}
        .tab-visual-title{font-family:'Instrument Serif',serif;font-size:2rem;color:white;line-height:1.2;margin-bottom:20px}
        .tab-visual-stats{display:flex;gap:20px;flex-wrap:wrap}
        .tab-visual-stat{background:rgba(255,255,255,0.08);border-radius:12px;padding:14px 18px;flex:1;min-width:100px}
        .tab-visual-stat-num{font-family:'Instrument Serif',serif;font-size:1.6rem;color:#C8960A;line-height:1;margin-bottom:4px}
        .tab-visual-stat-label{font-size:0.72rem;color:rgba(255,255,255,0.5)}
        .products-tab-list{display:flex;flex-direction:column}
        .products-tab-item{border-bottom:1px solid var(--grey-light);cursor:pointer}
        .products-tab-item:first-child{border-top:1px solid var(--grey-light)}
        .products-tab-header{display:flex;align-items:center;justify-content:space-between;padding:22px 0;gap:12px}
        .products-tab-name{font-family:'Instrument Serif',serif;font-size:1.5rem;color:var(--grey-mid);transition:color 0.3s;line-height:1;letter-spacing:-0.01em}
        .products-tab-item.active .products-tab-name{color:#0B2348;font-size:1.55rem}
        .products-tab-indicator{width:3px;height:0;background:#C8960A;border-radius:100px;flex-shrink:0;transition:height 0.3s ease;align-self:stretch}
        .products-tab-item.active .products-tab-indicator{height:auto;min-height:40px}
        .products-tab-body{display:none;padding-bottom:22px}
        .products-tab-item.active .products-tab-body{display:block}
        .products-tab-desc{font-size:0.9rem;color:var(--grey-text);line-height:1.65;margin-bottom:16px;max-width:380px}
        .products-tab-btn{background:transparent;border:1.5px solid var(--navy);color:var(--navy);border-radius:100px;padding:10px 24px;font-size:0.85rem;font-weight:600;cursor:pointer;font-family:'DM Sans',sans-serif;transition:background 0.2s,color 0.2s}
        .products-tab-btn:hover{background:#0B2348;color:white}

        .how-section{background:var(--white)}
        .how-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:0;position:relative}
        .how-grid::before{content:'';position:absolute;top:39px;left:calc(16.66% + 24px);right:calc(16.66% + 24px);height:1px;background:linear-gradient(to right,var(--blue-bright),var(--accent));z-index:0}
        .how-step{padding:0 28px;text-align:center;position:relative}
        .how-step:first-child{padding-left:0}
        .how-step:last-child{padding-right:0}
        .how-num{width:72px;height:72px;border-radius:50%;background:white;border:2px solid var(--grey-light);display:flex;align-items:center;justify-content:center;font-family:'Instrument Serif',serif;font-size:1.5rem;color:#1B4F9A;margin:0 auto 26px;position:relative;z-index:1;transition:background 0.25s,color 0.25s,border-color 0.25s,box-shadow 0.25s;box-shadow:var(--shadow)}
        .how-step:hover .how-num{background:#1B4F9A;color:white;border-color:#1B4F9A;box-shadow:0 8px 24px rgba(27,79,154,0.3)}
        .how-title{font-size:0.98rem;font-weight:600;color:var(--navy);margin-bottom:8px}
        .how-desc{font-size:0.855rem;color:var(--grey-text);line-height:1.65}

        .testimonials-section{background:#0B2348;overflow:hidden;position:relative;padding:96px 5%}
        .testimonials-section .section-tag{color:var(--accent)}
        .testimonials-section .section-h2{color:var(--white)}
        .testimonials-section .section-sub{color:rgba(255,255,255,0.5)}
        .zillow-btn{display:inline-flex;align-items:center;gap:10px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);color:white;padding:14px 28px;border-radius:12px;font-size:0.92rem;font-weight:600;text-decoration:none;transition:background 0.2s,transform 0.15s;margin-top:8px}
        .zillow-btn:hover{background:rgba(255,255,255,0.14);transform:translateY(-1px)}

        .about-section{background:var(--off-white);padding:96px 5%}
        .about-inner{display:grid;grid-template-columns:1fr 2fr;gap:64px;align-items:start;max-width:1100px;margin:0 auto}
        .about-photo{width:100%;aspect-ratio:3/4;background:linear-gradient(135deg,#0B2348 0%,#1B4F9A 100%);border-radius:24px;display:flex;align-items:center;justify-content:center;font-family:'Instrument Serif',serif;font-size:4rem;color:white;position:relative;overflow:hidden}
        .nmls-badge{position:absolute;bottom:16px;left:50%;transform:translateX(-50%);background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.2);border-radius:100px;padding:7px 18px;font-size:0.72rem;font-weight:600;color:white;white-space:nowrap;backdrop-filter:blur(8px)}
        .about-stats{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:32px 0}
        .about-stat{background:white;border-radius:14px;padding:18px 20px}
        .about-stat-num{font-family:'Instrument Serif',serif;font-size:1.8rem;color:var(--navy);margin-bottom:4px}
        .about-stat-label{font-size:0.78rem;color:var(--grey-mid);font-weight:500}
        .about-values{display:flex;flex-direction:column;gap:12px;margin-bottom:28px}
        .about-value{display:flex;align-items:flex-start;gap:12px;font-size:0.9rem;color:var(--grey-text)}
        .about-value-icon{width:22px;height:22px;background:rgba(27,79,154,0.1);border-radius:6px;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px}
        .about-btns{display:flex;gap:12px;flex-wrap:wrap}
        .btn-primary{background:#0B2348;color:white;border:none;border-radius:10px;padding:13px 28px;font-size:0.9rem;font-weight:600;cursor:pointer;font-family:'DM Sans',sans-serif;transition:background 0.2s,transform 0.15s;text-decoration:none;display:inline-flex;align-items:center;gap:8px}
        .btn-primary:hover{background:#1B4F9A;transform:translateY(-1px)}
        .btn-outline{background:transparent;color:var(--navy);border:1.5px solid var(--navy);border-radius:10px;padding:13px 28px;font-size:0.9rem;font-weight:600;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all 0.2s;text-decoration:none;display:inline-flex;align-items:center;gap:8px}
        .btn-outline:hover{background:var(--navy);color:white}

        .faq-section{background:var(--off-white);padding:96px 5%}
        .faq-list{max-width:760px;margin:0 auto}
        .faq-item{border-bottom:1px solid var(--grey-light)}
        .faq-item:first-child{border-top:1px solid var(--grey-light)}
        .faq-q{width:100%;background:none;border:none;cursor:pointer;display:flex;align-items:center;justify-content:space-between;padding:20px 0;gap:16px;font-family:'DM Sans',sans-serif;font-size:1rem;font-weight:600;color:var(--navy);text-align:left;transition:color 0.2s}
        .faq-q:hover{color:var(--blue)}
        .faq-q svg{width:20px;height:20px;flex-shrink:0;color:var(--grey-mid);transition:transform 0.3s}
        .faq-q.open svg{transform:rotate(180deg)}
        .faq-q.open{color:var(--blue)}
        .faq-a{max-height:0;overflow:hidden;transition:max-height 0.35s ease,padding 0.3s}
        .faq-a.open{max-height:300px;padding-bottom:18px}
        .faq-a p{font-size:0.9rem;color:var(--grey-text);line-height:1.75}

        .cta-section{padding:80px 5%;background:linear-gradient(135deg,#0B2348 0%,#1B4F9A 100%);text-align:center;position:relative;overflow:hidden}
        .cta-section .section-h2{color:var(--white);max-width:580px;margin:0 auto 12px}
        .cta-section .section-sub{color:rgba(255,255,255,0.5);text-align:center;margin:0 auto 34px}
        .cta-btn{background:#C8960A;color:#0B2348;border:none;border-radius:100px;padding:16px 40px;font-size:1rem;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all 0.2s;letter-spacing:-0.01em;box-shadow:0 4px 20px rgba(0,0,0,0.15)}
        .cta-btn:hover{background:#E5AD20;transform:translateY(-2px)}

        footer{background:#0B2348;border-top:1px solid rgba(255,255,255,0.08);padding:52px 5% 32px}
        .footer-top{display:flex;justify-content:space-between;align-items:flex-start;gap:40px;margin-bottom:40px;flex-wrap:wrap}
        .footer-brand-name{font-size:1rem;font-weight:600;color:white}
        .footer-brand-name span{display:block;font-size:0.62rem;font-weight:400;color:rgba(255,255,255,0.35);margin-top:1px;letter-spacing:0.03em}
        .footer-brand p{font-size:0.78rem;color:rgba(255,255,255,0.35);margin-top:10px;max-width:250px;line-height:1.6}
        .footer-links{display:flex;gap:56px;flex-wrap:wrap}
        .footer-col h4{font-size:0.72rem;font-weight:600;letter-spacing:0.07em;text-transform:uppercase;color:rgba(255,255,255,0.35);margin-bottom:14px}
        .footer-col a{display:block;text-decoration:none;font-size:0.855rem;color:rgba(255,255,255,0.6);margin-bottom:9px;transition:color 0.2s;cursor:pointer}
        .footer-col a:hover{color:white}
        .footer-bottom{padding-top:26px;border-top:1px solid rgba(255,255,255,0.08);font-size:0.7rem;color:rgba(255,255,255,0.28);line-height:1.65}
        .footer-bottom-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:10px}

        .modal-overlay{position:fixed;inset:0;background:rgba(13,27,62,0.72);backdrop-filter:blur(8px);z-index:200;display:flex;align-items:center;justify-content:center;padding:20px;opacity:0;pointer-events:none;transition:opacity 0.3s}
        .modal-overlay.open{opacity:1;pointer-events:all}
        .modal{background:var(--white);border-radius:var(--radius-lg);padding:40px;max-width:500px;width:100%;position:relative;box-shadow:0 24px 80px rgba(13,27,62,0.3);transform:translateY(20px);transition:transform 0.3s;overflow-y:auto;max-height:90vh}
        .modal-overlay.open .modal{transform:translateY(0)}
        .modal-close{position:absolute;top:16px;right:16px;background:var(--grey-light);border:none;cursor:pointer;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.1rem;color:var(--grey-text);transition:background 0.2s}
        .modal-close:hover{background:#dde2eb}
        .modal-step{display:none}
        .modal-step.active{display:block}
        .modal-progress{display:flex;gap:6px;margin-bottom:26px}
        .progress-dot{height:3px;border-radius:3px;flex:1;background:var(--grey-light);transition:background 0.3s}
        .progress-dot.active{background:#1B4F9A}
        .modal-h2{font-family:'Instrument Serif',serif;font-size:1.65rem;color:var(--navy);margin-bottom:6px;line-height:1.2}
        .modal-sub{font-size:0.86rem;color:var(--grey-text);margin-bottom:24px;line-height:1.55}
        .modal-address-tag{background:var(--off-white);border:1px solid var(--grey-light);border-radius:9px;padding:11px 14px;font-size:0.855rem;color:var(--grey-text);margin-bottom:22px;display:flex;align-items:center;gap:8px}
        .fwrap{position:relative;margin-bottom:12px}
        .finput{width:100%;padding:20px 14px 7px;border:1.5px solid var(--grey-light);border-radius:9px;font-size:0.9rem;font-family:'DM Sans',sans-serif;color:var(--navy);background:var(--off-white);outline:none;transition:border-color 0.2s,box-shadow 0.2s;-webkit-appearance:none;box-sizing:border-box}
        .finput:focus{border-color:var(--blue);box-shadow:0 0 0 3px rgba(25,103,228,0.1);background:var(--white)}
        .flabel{position:absolute;top:50%;left:14px;transform:translateY(-50%);font-size:0.88rem;color:var(--grey-mid);font-weight:500;pointer-events:none;transition:all 0.15s ease;white-space:nowrap}
        .finput:focus~.flabel,.finput:not(:placeholder-shown)~.flabel{top:9px;transform:translateY(0);font-size:0.65rem;color:var(--blue);font-weight:600;letter-spacing:0.03em}
        select.finput{cursor:pointer;padding-right:32px;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2385AECA' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center}
        select.finput~.flabel{top:9px;transform:translateY(0);font-size:0.65rem;color:var(--blue);font-weight:600;letter-spacing:0.03em}
        .occ-tiles{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:4px}
        .occ-tile{flex:1;min-width:120px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:14px 10px;border:1.5px solid var(--grey-light);border-radius:12px;background:var(--off-white);cursor:pointer;font-family:'DM Sans',sans-serif;font-size:0.8rem;font-weight:500;color:var(--grey-text);transition:border-color 0.2s,background 0.2s,color 0.2s}
        .occ-tile:hover{border-color:var(--blue);background:var(--white)}
        .occ-tile.selected{border-color:var(--blue);background:rgba(25,103,228,0.07);color:var(--blue)}
        .yn-tiles{display:flex;gap:12px;margin-bottom:24px}
        .yn-tile{padding:11px 32px;border-radius:100px;border:1.5px solid var(--grey-light);background:var(--white);font-family:'DM Sans',sans-serif;font-size:0.9rem;font-weight:500;color:var(--grey-text);cursor:pointer;transition:border-color 0.2s,background 0.2s,color 0.2s}
        .yn-tile:hover{border-color:var(--blue);color:var(--blue)}
        .yn-tile.selected{border-color:var(--blue);background:rgba(25,103,228,0.07);color:var(--blue);font-weight:600}
        .income-row{display:grid;grid-template-columns:1fr 1fr;gap:14px}
        .name-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
        .modal-footer-row{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:20px;padding-top:16px;border-top:1px solid var(--grey-light);flex-wrap:wrap}
        .modal-footer-note{font-size:0.72rem;color:var(--grey-mid);flex:1;min-width:160px}
        .modal-continue-btn{background:#1B4F9A;color:var(--white);border:none;border-radius:100px;padding:12px 28px;font-size:0.92rem;font-weight:600;cursor:pointer;font-family:'DM Sans',sans-serif;transition:background 0.2s,transform 0.15s;white-space:nowrap}
        .modal-continue-btn:hover{background:#0B2348;transform:translateY(-1px)}
        .consent-row{display:flex;align-items:flex-start;gap:10px;margin-bottom:14px;cursor:pointer;font-size:0.82rem;color:var(--navy);line-height:1.5}
        .consent-check{width:18px;height:18px;flex-shrink:0;margin-top:1px;accent-color:var(--blue);cursor:pointer}
        .form-submit{width:100%;background:#0B2348;color:var(--white);border:none;border-radius:10px;padding:14px;font-size:0.95rem;font-weight:600;cursor:pointer;font-family:'DM Sans',sans-serif;margin-top:6px;transition:background 0.2s,transform 0.15s}
        .form-submit:hover{background:var(--blue);transform:translateY(-1px)}
        .form-submit:disabled{opacity:0.6;cursor:not-allowed;transform:none}
        .error-box{background:#FEF2F2;border:1px solid #FECACA;border-radius:8px;padding:10px 14px;font-size:0.82rem;color:#991B1B;margin-bottom:14px;display:none}
        .error-box.show{display:block}
        .success-center{text-align:center;padding:12px 0}
        .success-icon{width:64px;height:64px;background:rgba(74,141,245,0.1);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 18px}

        .cookie-banner{position:fixed;bottom:0;left:0;right:0;z-index:300;background:#0B2348;border-top:1px solid rgba(255,255,255,0.1);padding:20px 5%;display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap;transform:translateY(100%);transition:transform 0.4s ease;box-shadow:0 -8px 32px rgba(13,27,62,0.3)}
        .cookie-banner.show{transform:translateY(0)}
        .cookie-text{font-size:0.82rem;color:rgba(255,255,255,0.75);line-height:1.6;flex:1;min-width:260px}
        .cookie-btns{display:flex;gap:10px;flex-shrink:0}
        .cookie-btn-accept{background:#1B4F9A;color:white;border:none;border-radius:8px;padding:10px 22px;font-size:0.85rem;font-weight:600;cursor:pointer;font-family:'DM Sans',sans-serif;transition:background 0.2s}
        .cookie-btn-decline{background:transparent;color:rgba(255,255,255,0.6);border:1px solid rgba(255,255,255,0.2);border-radius:8px;padding:10px 22px;font-size:0.85rem;cursor:pointer;font-family:'DM Sans',sans-serif}

        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.6;transform:scale(1.3)}}
        .reveal{opacity:0;transform:translateY(22px);transition:opacity 0.6s ease,transform 0.6s ease}
        .reveal.visible{opacity:1;transform:translateY(0)}

        @media(max-width:900px){
          section{padding:64px 5%}
          .hero{padding-top:110px;padding-bottom:60px;align-items:center;text-align:center}
          .how-grid{grid-template-columns:1fr;gap:32px}
          .how-grid::before{display:none}
          .how-step{padding:0;text-align:left;display:flex;gap:18px;align-items:flex-start}
          .how-num{margin:0;flex-shrink:0;width:52px;height:52px;font-size:1.2rem}
          .heloc-callout-inner{grid-template-columns:1fr}
          .heloc-callout-right{display:none}
          .products-tab-inner{grid-template-columns:1fr}
          .products-tab-visual{display:none}
          .about-inner{grid-template-columns:1fr}
          .about-photo{aspect-ratio:3/2;max-height:280px}
          .footer-top{flex-direction:column;gap:32px}
          .footer-links{gap:28px}
          .income-row{grid-template-columns:1fr}
          .name-grid{grid-template-columns:1fr}
          .search-card{border-radius:20px;padding:12px}
          .address-wrap{flex-direction:column;gap:8px}
          .address-btn{width:100%;justify-content:center;border-radius:12px;padding:14px}
        }
        @media(max-width:600px){
          nav{padding:0 4%}
          section{padding:52px 4%}
          .hero{padding:90px 4% 52px;align-items:center;text-align:center}
          .hero-stats{gap:16px;flex-wrap:wrap;justify-content:center}
          .stat-divider{display:none}
          .modal{padding:24px 16px;border-radius:24px 24px 16px 16px}
          .modal-overlay{padding:12px;align-items:flex-end}
          .occ-tiles{flex-direction:column}
          .modal-footer-row{flex-direction:column;align-items:stretch}
          .modal-continue-btn{width:100%;text-align:center}
          .yn-tiles{flex-direction:column}
          .income-row{grid-template-columns:1fr}
          .name-grid{grid-template-columns:1fr}
          .about-stats{grid-template-columns:1fr 1fr}
          .footer-links{gap:24px}
        }
      `}</style>

      {/* NAV */}
      <nav id="mainNav">
        <a className="nav-logo" href="/">
          <div className="nav-logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
          <div className="nav-logo-text">MME Home <span>Making Mortgage Easy</span></div>
        </a>
        <ul className="nav-links">
          <li><a href="#products">Products</a></li>
          <li><a href="#dscr">DSCR Loans</a></li>
          <li><a href="#tools">Tools</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#reviews">Reviews</a></li>
          <li><a href="#" className="nav-cta" onClick={(e) => { e.preventDefault(); openModal() }}>Get My Rate</a></li>
        </ul>
        <button className="nav-hamburger" id="navBurger" aria-label="Menu">
          <span/><span/><span/>
        </button>
      </nav>
      <div className="mobile-drawer" id="mobileDrawer">
        <a href="#products">Products</a>
        <a href="#dscr">DSCR Loans</a>
        <a href="#tools">Tools</a>
        <a href="#about">About</a>
        <a href="#reviews">Reviews</a>
        <a href="#" onClick={(e) => { e.preventDefault(); openModal() }}>Get My Rate →</a>
      </div>

      {/* HERO */}
      <section className="hero">
        <div className="hero-grid"/>
        <div className="hero-left">
          <div className="hero-badge">California Licensed Wholesale Broker</div>
          <h1 className="hero-h1">Home financing,<em>done easier.</em></h1>
          <p className="hero-sub">Access 100+ wholesale lenders for the best rates in California. Purchase, refinance, HELOC, DSCR, FHA/VA — all in one place.</p>
          <div className="search-card" style={{position:'relative'}}>
            <div className="address-wrap">
              <div className="address-wrap-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:17,height:17}}>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <input className="address-input" id="heroAddress" type="text" placeholder="Enter your property address" autoComplete="off" onChange={(e) => handleAddressInput(e.target.value, 'heroDropdown', 'heroAddress')}/>
            </div>
            <button className="address-btn" onClick={() => openModalWithAddress()}>
              Get My Rate
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{width:15,height:15}}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
            <div className="autocomplete-dropdown" id="heroDropdown"/>
          </div>
          <p className="search-note">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:13,height:13}}>
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            No credit pull required · Free rate quote in 60 seconds
          </p>
          <div className="hero-stats">
            <div className="stat"><span className="stat-num">100+</span><span className="stat-label">Wholesale lenders</span></div>
            <div className="stat-divider"/>
            <div className="stat"><span className="stat-num">5 days</span><span className="stat-label">Fastest close</span></div>
            <div className="stat-divider"/>
            <div className="stat"><span className="stat-num">NMLS#</span><span className="stat-label">1082653</span></div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div className="trust-bar">
        <p className="trust-bar-label">Wholesale access to top lenders</p>
        <div className="trust-logos">
          {['United Wholesale','Pennymac','loanDepot','Rocket Pro','AmeriSave','Better','Cardinal Financial','Caliber'].map(l => (
            <span key={l} className="trust-logo">{l}</span>
          ))}
        </div>
      </div>

      {/* HELOC CALLOUT */}
      <div className="heloc-callout reveal">
        <div className="heloc-callout-inner">
          <div>
            <div className="heloc-tag">Featured Product</div>
            <h2 className="heloc-h2">Unlock your home equity — without refinancing</h2>
            <ul className="heloc-bullets">
              {[
                'Access up to 90% of your home\'s value',
                'Interest-only payment options available',
                'No prepayment penalties',
                'Close in as few as 5 business days',
              ].map(b => (
                <li key={b}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{width:18,height:18,color:'#C8960A',flexShrink:0,marginTop:2}}>
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {b}
                </li>
              ))}
            </ul>
            <button className="heloc-btn" onClick={() => openModal()}>See If You Qualify →</button>
          </div>
          <div className="heloc-callout-right">
            <div className="heloc-phone-card">
              <div className="heloc-phone-inner">
                <div className="heloc-congrats-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:24,height:24}}><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <p className="heloc-congrats-label">Estimated equity available</p>
                <p className="heloc-congrats-amount">$84,000</p>
                <p className="heloc-congrats-sub">Based on 80% LTV · Example only</p>
                <div className="heloc-divider"/>
                <div className="heloc-detail-row"><span>Est. home value</span><span>$520,000</span></div>
                <div className="heloc-detail-row"><span>Current balance</span><span>$332,000</span></div>
                <div className="heloc-detail-row"><span>Available equity</span><span>$84,000</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PRODUCTS TABS */}
      <div id="products" className="products-tab-section">
        <div className="products-tab-inner">
          <div className="products-tab-list">
            <div className="section-tag">Our products</div>
            <h2 className="section-h2" style={{marginBottom:32}}>Every loan type, one broker</h2>
            {[
              { name:'HELOC', desc:'Access your home equity with a revolving line of credit. Use it for renovations, debt consolidation, or anything else.', stat1:'Up to 90% LTV', stat2:'5-day close' },
              { name:'DSCR Loans', desc:'Qualify based on rental income alone — no personal income verification required. Perfect for investors.', stat1:'No W2 needed', stat2:'1-4 units' },
              { name:'Cash-Out Refinance', desc:'Replace your current mortgage and take out your equity as cash. Lock in a great rate at the same time.', stat1:'Up to 80% LTV', stat2:'No PMI options' },
              { name:'Purchase', desc:'Get the best rate from 100+ wholesale lenders. Fast pre-approval and a smooth close.', stat1:'100+ lenders', stat2:'Pre-approval same day' },
              { name:'Rate/Term Refinance', desc:'Lower your rate or shorten your term without taking cash out. Reduce your monthly payment.', stat1:'Competitive rates', stat2:'No-cost options' },
              { name:'FHA / VA', desc:'Government-backed programs with low down payments and flexible credit requirements.', stat1:'3.5% down FHA', stat2:'0% down VA' },
              { name:'Home Equity Agreement', desc:'Access equity without monthly payments. Share a portion of future appreciation instead.', stat1:'No monthly payments', stat2:'10-year term' },
            ].map((p, i) => (
              <div key={p.name} className={`products-tab-item${i === 0 ? ' active' : ''}`}>
                <div className="products-tab-header">
                  <span className="products-tab-name">{p.name}</span>
                  <span className="products-tab-indicator"/>
                </div>
                <div className="products-tab-body">
                  <p className="products-tab-desc">{p.desc}</p>
                  <button className="products-tab-btn" onClick={() => openModal()}>Get a Quote →</button>
                </div>
              </div>
            ))}
          </div>
          <div className="products-tab-visual">
            {[
              { label:'HELOC', title:'Tap your equity without refinancing', s1n:'Up to 90%', s1l:'Max LTV', s2n:'5 days', s2l:'To close' },
              { label:'DSCR Loans', title:'Qualify on rental income alone', s1n:'No W2', s1l:'Required', s2n:'1–4', s2l:'Units' },
              { label:'Cash-Out Refi', title:'Get cash from your home equity', s1n:'$0', s1l:'Min cash-out', s2n:'80%', s2l:'Max LTV' },
              { label:'Purchase', title:'Best rates from 100+ lenders', s1n:'Same day', s1l:'Pre-approval', s2n:'100+', s2l:'Lenders' },
              { label:'Refinance', title:'Lower your rate or monthly payment', s1n:'No-cost', s1l:'Options available', s2n:'15–30', s2l:'Year terms' },
              { label:'FHA / VA', title:'Low down payment programs', s1n:'3.5%', s1l:'Down (FHA)', s2n:'0%', s2l:'Down (VA)' },
              { label:'Home Equity Agreement', title:'Equity access — no monthly payments', s1n:'No payments', s1l:'Monthly', s2n:'10 yr', s2l:'Term' },
            ].map((p, i) => (
              <div key={i} className={`tab-visual-panel${i === 0 ? ' active' : ''}`} data-tab={i}>
                <div className="tab-visual-label">{p.label}</div>
                <div className="tab-visual-title">{p.title}</div>
                <div className="tab-visual-stats">
                  <div className="tab-visual-stat"><div className="tab-visual-stat-num">{p.s1n}</div><div className="tab-visual-stat-label">{p.s1l}</div></div>
                  <div className="tab-visual-stat"><div className="tab-visual-stat-num">{p.s2n}</div><div className="tab-visual-stat-label">{p.s2l}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section className="how-section reveal">
        <div className="section-tag">How it works</div>
        <h2 className="section-h2">Three steps to your best rate</h2>
        <p className="section-sub">No bank branch, no hassle. Everything online, with a real person available every step of the way.</p>
        <div className="how-grid">
          {[
            { n:'1', title:'Tell us about your property', desc:'Enter your address and answer a few quick questions about your loan goals. Takes under 2 minutes.' },
            { n:'2', title:'Get matched with lenders', desc:'We search 100+ wholesale lenders and surface the best rates for your specific situation — instantly.' },
            { n:'3', title:'Close on your timeline', desc:'Work directly with your broker to lock your rate and close. As fast as 5 business days.' },
          ].map(s => (
            <div key={s.n} className="how-step">
              <div className="how-num">{s.n}</div>
              <div>
                <div className="how-title">{s.title}</div>
                <p className="how-desc">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials-section reveal" id="reviews">
        <div className="section-tag">Reviews</div>
        <h2 className="section-h2">What clients are saying</h2>
        <p className="section-sub" style={{marginBottom:28}}>Real reviews from real homeowners and investors.</p>
        <a href="https://www.zillow.com/lender-profile/Shane%20Bakhtiari/" target="_blank" rel="noopener noreferrer" className="zillow-btn">
          <svg viewBox="0 0 24 24" fill="#006AFF" style={{width:20,height:20}}><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          View reviews on Zillow
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:15,height:15}}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </a>
      </section>

      {/* ABOUT */}
      <section className="about-section reveal" id="about">
        <div className="about-inner">
          <div>
            <div className="about-photo">
              SB
              <div className="nmls-badge">NMLS# 1082653 · DRE# 02244476</div>
            </div>
          </div>
          <div>
            <div className="section-tag">About your broker</div>
            <h2 className="section-h2">Shane Bakhtiari</h2>
            <p style={{fontSize:'0.975rem',color:'var(--grey-text)',lineHeight:1.75,marginBottom:20}}>
              Licensed wholesale mortgage broker in California with access to over 100 lenders. I work on your behalf — not the bank&apos;s — to find the most competitive rates and terms for your unique situation.
            </p>
            <p style={{fontSize:'0.975rem',color:'var(--grey-text)',lineHeight:1.75,marginBottom:24}}>
              Whether you&apos;re purchasing your first home, refinancing to a better rate, tapping your equity, or building a rental portfolio with DSCR loans — I&apos;ve got the tools and lender relationships to make it happen.
            </p>
            <div className="about-stats">
              {[
                { n:'100+', l:'Wholesale lenders' },
                { n:'5 days', l:'Fastest close' },
                { n:'$0', l:'Rate quote cost' },
                { n:'CA', l:'Licensed statewide' },
              ].map(s => (
                <div key={s.n} className="about-stat">
                  <div className="about-stat-num">{s.n}</div>
                  <div className="about-stat-label">{s.l}</div>
                </div>
              ))}
            </div>
            <div className="about-values">
              {[
                'Wholesale pricing — not retail bank rates',
                'One broker, 100+ lenders competing for your loan',
                'Transparent process with no hidden fees',
              ].map(v => (
                <div key={v} className="about-value">
                  <div className="about-value-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#1B4F9A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{width:13,height:13}}><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  {v}
                </div>
              ))}
            </div>
            <div className="about-btns">
              <button className="btn-primary" onClick={() => openModal()}>Get My Free Rate Quote</button>
              <a href="mailto:shane@shieldhomeloans.com" className="btn-outline">Email Shane</a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section reveal">
        <div className="section-tag">FAQ</div>
        <h2 className="section-h2" style={{textAlign:'center'}}>Common questions</h2>
        <div className="faq-list">
          {[
            { q:'What is a wholesale mortgage broker?', a:'A wholesale mortgage broker works with wholesale lenders on your behalf — lenders that don\'t deal directly with the public. This gives you access to rates and programs you can\'t get by going directly to a retail bank.' },
            { q:'Does getting a rate quote affect my credit?', a:'No. Our initial rate quote requires no credit pull. We only pull credit when you\'re ready to move forward with a full application, and we\'ll always ask permission first.' },
            { q:'How fast can you close a loan?', a:'Depending on the loan type and your documentation, we can close as fast as 5 business days. Most purchase loans close in 21–30 days. HELOC closings can happen in 5–10 days.' },
            { q:'What is a DSCR loan?', a:'A DSCR (Debt Service Coverage Ratio) loan lets real estate investors qualify based on the property\'s rental income rather than their personal income. No W2s, no tax returns needed — just a lease or comparable rent analysis.' },
            { q:'Can I get a HELOC without refinancing my current mortgage?', a:'Yes. A HELOC is a separate second lien on your property. You keep your existing mortgage and its rate exactly as-is, and simply add a new revolving credit line on top.' },
            { q:'What states do you serve?', a:'We are currently licensed in California. We work with borrowers throughout the state for all loan types including purchase, refinance, HELOC, DSCR, FHA, and VA loans.' },
          ].map(f => (
            <div key={f.q} className="faq-item">
              <button className="faq-q">
                {f.q}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              <div className="faq-a"><p>{f.a}</p></div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section reveal">
        <div className="section-tag" style={{color:'#C8960A'}}>Ready to start?</div>
        <h2 className="section-h2">Get your free rate quote today</h2>
        <p className="section-sub">No credit pull. No obligation. Takes under 2 minutes.</p>
        <button className="cta-btn" onClick={() => openModal()}>Get My Rate →</button>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-brand-name">MME Home <span>Making Mortgage Easy</span></div>
            <p>Licensed wholesale mortgage broker in California. NMLS# 1082653 · DRE# 02244476</p>
          </div>
          <div className="footer-links">
            <div className="footer-col">
              <h4>Products</h4>
              <a onClick={() => openModal()}>Purchase</a>
              <a onClick={() => openModal()}>Refinance</a>
              <a onClick={() => openModal()}>Cash-Out Refi</a>
              <a onClick={() => openModal()}>HELOC</a>
              <a onClick={() => openModal()}>FHA / VA</a>
              <a onClick={() => openModal()}>DSCR Loans</a>
            </div>
            <div className="footer-col">
              <h4>Company</h4>
              <a href="#about">About Us</a>
              <a href="#products">How It Works</a>
              <a href="#reviews">Reviews</a>
              <a href="mailto:shane@shieldhomeloans.com">Contact</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-bottom-top">
            <span>© {new Date().getFullYear()} MME Home · Shield Home Loans Inc. · NMLS# 2396589</span>
            <span>32 Discovery Suite 170, Irvine CA · (888) 819-9981</span>
          </div>
          <p>MME Home is a DBA of Shield Home Loans Inc., a licensed California mortgage broker. NMLS# 2396589. DRE# 02244476. This is not an offer to lend. All loans subject to credit approval, appraisal, and lender guidelines. Equal Housing Opportunity.</p>
        </div>
      </footer>

      {/* LEAD FORM MODAL */}
      <div className="modal-overlay" id="leadModal">
        <div className="modal" role="dialog" aria-modal="true">
          <button className="modal-close" onClick={() => closeModal()} aria-label="Close">✕</button>
          <div className="modal-progress" id="modalProgress">
            {[0,1,2,3,4,5,6].map(i => <div key={i} className={`progress-dot${i===0?' active':''}`}/>)}
          </div>

          {/* STEP 1 - Address */}
          <div className="modal-step active" id="step1">
            <h2 className="modal-h2">Tell us about your property</h2>
            <p className="modal-sub">Enter the property address to get started.</p>
            <div className="fwrap" style={{position:'relative'}}>
              <input className="finput" id="modalAddress" type="text" placeholder=" " autoComplete="off" onChange={(e) => handleAddressInput(e.target.value, 'modalDropdown', 'modalAddress')}/>
              <label className="flabel">Property address</label>
              <div className="autocomplete-dropdown" id="modalDropdown"/>
            </div>
            <p style={{fontSize:'0.78rem',fontWeight:600,color:'var(--navy)',margin:'16px 0 10px'}}>Ownership type</p>
            <div className="yn-tiles" id="ownershipTiles">
              {['I Own It','I\'m Buying It','Other'].map(o => (
                <button key={o} className="yn-tile" onClick={(e) => { document.querySelectorAll('#ownershipTiles .yn-tile').forEach(b=>b.classList.remove('selected')); (e.target as HTMLElement).classList.add('selected') }}>{o}</button>
              ))}
            </div>
            <p style={{fontSize:'0.78rem',fontWeight:600,color:'var(--navy)',margin:'16px 0 10px'}}>How will you use this property?</p>
            <div className="occ-tiles" id="occTiles">
              {[
                { icon:'🏠', label:'Primary Residence' },
                { icon:'🏖️', label:'Secondary / Vacation' },
                { icon:'🏢', label:'Investment Property' },
              ].map(t => (
                <div key={t.label} className="occ-tile" onClick={(e) => { document.querySelectorAll('#occTiles .occ-tile').forEach(b=>b.classList.remove('selected')); (e.currentTarget as HTMLElement).classList.add('selected') }}>
                  <span style={{fontSize:22}}>{t.icon}</span>
                  <span>{t.label}</span>
                </div>
              ))}
            </div>
            <div className="error-box" id="addrError"/>
            <div className="modal-footer-row">
              <span className="modal-footer-note">🔒 No credit pull required</span>
              <button className="modal-continue-btn" onClick={() => goToStep(2)}>Continue →</button>
            </div>
          </div>

          {/* STEP 2 - For sale? */}
          <div className="modal-step" id="step2">
            <h2 className="modal-h2">Is this property currently for sale?</h2>
            <p className="modal-sub">This helps us identify the right loan programs.</p>
            <div className="yn-tiles" id="forSaleTiles">
              <button className="yn-tile" onClick={(e) => { document.querySelectorAll('#forSaleTiles .yn-tile').forEach(b=>b.classList.remove('selected')); (e.target as HTMLElement).classList.add('selected') }}>Yes</button>
              <button className="yn-tile" onClick={(e) => { document.querySelectorAll('#forSaleTiles .yn-tile').forEach(b=>b.classList.remove('selected')); (e.target as HTMLElement).classList.add('selected') }}>No</button>
            </div>
            <div className="modal-footer-row">
              <button className="modal-continue-btn" style={{background:'var(--grey-light)',color:'var(--navy)',marginRight:'auto'}} onClick={() => goToStep(1)}>← Back</button>
              <button className="modal-continue-btn" onClick={() => goToStep(3)}>Continue →</button>
            </div>
          </div>

          {/* STEP 3 - Mortgage lates */}
          <div className="modal-step" id="step3">
            <h2 className="modal-h2">Any mortgage lates in the past 12 months?</h2>
            <p className="modal-sub">Late payments may affect program eligibility.</p>
            <div className="yn-tiles" id="latesTiles">
              <button className="yn-tile" onClick={(e) => { document.querySelectorAll('#latesTiles .yn-tile').forEach(b=>b.classList.remove('selected')); (e.target as HTMLElement).classList.add('selected') }}>Yes</button>
              <button className="yn-tile" onClick={(e) => { document.querySelectorAll('#latesTiles .yn-tile').forEach(b=>b.classList.remove('selected')); (e.target as HTMLElement).classList.add('selected') }}>No</button>
            </div>
            <div className="modal-footer-row">
              <button className="modal-continue-btn" style={{background:'var(--grey-light)',color:'var(--navy)',marginRight:'auto'}} onClick={() => goToStep(2)}>← Back</button>
              <button className="modal-continue-btn" onClick={() => goToStep(4)}>Continue →</button>
            </div>
          </div>

          {/* STEP 4 - Income */}
          <div className="modal-step" id="step4">
            <h2 className="modal-h2">Tell us about your income</h2>
            <p className="modal-sub">Used to match you with the right programs.</p>
            <div className="income-row">
              <div className="fwrap">
                <input className="finput" id="inputPreTaxIncome" type="text" placeholder=" "/>
                <label className="flabel">Annual pre-tax income</label>
              </div>
              <div className="fwrap">
                <input className="finput" id="inputOtherIncome" type="text" placeholder=" "/>
                <label className="flabel">Other income (optional)</label>
              </div>
            </div>
            <div className="fwrap">
              <select className="finput" id="inputIncomeSource">
                <option value="W2 Employee">W2 Employee</option>
                <option value="Self-Employed">Self-Employed</option>
                <option value="Retired">Retired</option>
                <option value="Rental Income">Rental Income</option>
                <option value="Other">Other</option>
              </select>
              <label className="flabel">Income source</label>
            </div>
            <div className="modal-footer-row">
              <button className="modal-continue-btn" style={{background:'var(--grey-light)',color:'var(--navy)',marginRight:'auto'}} onClick={() => goToStep(3)}>← Back</button>
              <button className="modal-continue-btn" onClick={() => goToStep(5)}>Continue →</button>
            </div>
          </div>

          {/* STEP 5 - Name */}
          <div className="modal-step" id="step5">
            <h2 className="modal-h2">What&apos;s your legal name?</h2>
            <p className="modal-sub">As it appears on your government-issued ID.</p>
            <div className="name-grid">
              <div className="fwrap">
                <input className="finput" id="inputFirstName" type="text" placeholder=" "/>
                <label className="flabel">First name</label>
              </div>
              <div className="fwrap">
                <input className="finput" id="inputMiddleName" type="text" placeholder=" "/>
                <label className="flabel">Middle name</label>
              </div>
              <div className="fwrap">
                <input className="finput" id="inputLastName" type="text" placeholder=" "/>
                <label className="flabel">Last name</label>
              </div>
              <div className="fwrap">
                <select className="finput" id="inputSuffix">
                  <option value="">No suffix</option>
                  <option value="Jr.">Jr.</option>
                  <option value="Sr.">Sr.</option>
                  <option value="II">II</option>
                  <option value="III">III</option>
                </select>
                <label className="flabel">Suffix</label>
              </div>
            </div>
            <div className="modal-footer-row">
              <button className="modal-continue-btn" style={{background:'var(--grey-light)',color:'var(--navy)',marginRight:'auto'}} onClick={() => goToStep(4)}>← Back</button>
              <button className="modal-continue-btn" onClick={() => goToStep(6)}>Continue →</button>
            </div>
          </div>

          {/* STEP 6 - DOB */}
          <div className="modal-step" id="step6">
            <h2 className="modal-h2">Date of birth</h2>
            <p className="modal-sub">Required for identity verification.</p>
            <div className="fwrap">
              <input className="finput" id="dobInput" type="date" placeholder=" "/>
              <label className="flabel" style={{top:9,transform:'none',fontSize:'0.65rem',color:'var(--blue)',fontWeight:600}}>Date of birth</label>
            </div>
            <div className="modal-footer-row">
              <button className="modal-continue-btn" style={{background:'var(--grey-light)',color:'var(--navy)',marginRight:'auto'}} onClick={() => goToStep(5)}>← Back</button>
              <button className="modal-continue-btn" onClick={() => goToStep(7)}>Continue →</button>
            </div>
          </div>

          {/* STEP 7 - Contact */}
          <div className="modal-step" id="step7">
            <h2 className="modal-h2">Create your account</h2>
            <p className="modal-sub">We&apos;ll send your rate quote here.</p>
            <div className="fwrap">
              <input className="finput" id="inputEmail" type="email" placeholder=" "/>
              <label className="flabel">Email address</label>
            </div>
            <div className="fwrap">
              <input className="finput" id="inputPhone" type="tel" placeholder=" "/>
              <label className="flabel">Phone number</label>
            </div>
            <label className="consent-row">
              <input className="consent-check" type="checkbox" id="consentTCPA"/>
              <span>I agree to receive calls and texts from MME Home / Shield Home Loans about my mortgage inquiry. Message frequency varies. Reply STOP to opt out.</span>
            </label>
            <label className="consent-row">
              <input className="consent-check" type="checkbox" id="consentPrivacy"/>
              <span>I agree to the <span style={{color:'var(--blue)',textDecoration:'underline'}}>Privacy Policy</span> and <span style={{color:'var(--blue)',textDecoration:'underline'}}>Terms of Service</span>.</span>
            </label>
            <div className="error-box" id="submitError"/>
            <button className="form-submit" id="submitBtn" onClick={() => handleFinalSubmit()}>Get My Rate Quote →</button>
            <p style={{fontSize:'0.7rem',color:'var(--grey-mid)',textAlign:'center',marginTop:10,lineHeight:1.5}}>
              By submitting you agree to be contacted by a licensed mortgage professional. No credit pull required to receive your rate quote.
            </p>
          </div>

          {/* SUCCESS */}
          <div className="modal-step" id="stepSuccess">
            <div className="success-center">
              <div className="success-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:28,height:28,color:'var(--blue)'}}><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <h2 className="modal-h2">You&apos;re all set!</h2>
              <p style={{fontSize:'0.9rem',color:'var(--grey-text)',lineHeight:1.7,marginBottom:24}}>
                Thank you! Shane will review your information and reach out within 1 business day with your personalized rate quote.
              </p>
              <a href="https://www.zillow.com/lender-profile/Shane%20Bakhtiari/" target="_blank" rel="noopener noreferrer" className="btn-outline" style={{display:'inline-flex'}}>
                View Zillow Reviews →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* COOKIE BANNER */}
      <div className="cookie-banner" id="cookieBanner">
        <p className="cookie-text">We use cookies to improve your experience. By continuing, you agree to our use of cookies.</p>
        <div className="cookie-btns">
          <button className="cookie-btn-accept" id="cookieAccept">Accept</button>
          <button className="cookie-btn-decline" id="cookieDecline">Decline</button>
        </div>
      </div>

      <script dangerouslySetInnerHTML={{ __html: `
        // ── MODAL ──
        function openModal() {
          document.getElementById('leadModal').classList.add('open');
          document.body.style.overflow = 'hidden';
        }
        function openModalWithAddress() {
          var addr = document.getElementById('heroAddress').value.trim();
          if (addr) document.getElementById('modalAddress').value = addr;
          openModal();
        }
        function closeModal() {
          document.getElementById('leadModal').classList.remove('open');
          document.body.style.overflow = '';
        }
        document.getElementById('leadModal').addEventListener('click', function(e) {
          if (e.target === this) closeModal();
        });

        // ── STEP NAVIGATION ──
        var currentStep = 1;
        function goToStep(n) {
          if (n === 2) {
            var addr = document.getElementById('modalAddress').value.trim();
            var errBox = document.getElementById('addrError');
            var ownership = document.querySelector('#ownershipTiles .yn-tile.selected');
            var occupancy = document.querySelector('#occTiles .occ-tile.selected');
            if (!addr || addr.length < 6) { errBox.textContent = 'Please enter a valid property address.'; errBox.classList.add('show'); return; }
            if (!/\\d/.test(addr)) { errBox.textContent = 'Address must include a street number.'; errBox.classList.add('show'); return; }
            if (!ownership) { errBox.textContent = 'Please select an ownership type.'; errBox.classList.add('show'); return; }
            if (!occupancy) { errBox.textContent = 'Please select how you will use this property.'; errBox.classList.add('show'); return; }
            errBox.classList.remove('show');
          }
          document.getElementById('step' + currentStep).classList.remove('active');
          document.getElementById('step' + n).classList.add('active');
          currentStep = n;
          var dots = document.querySelectorAll('.progress-dot');
          dots.forEach(function(d, i) {
            d.classList.remove('active');
            if (i === n - 1) d.classList.add('active');
          });
        }

        // ── FINAL SUBMIT ──
        async function handleFinalSubmit() {
          var email = document.getElementById('inputEmail').value.trim();
          var phone = document.getElementById('inputPhone').value.trim();
          var firstName = document.getElementById('inputFirstName').value.trim();
          var lastName = document.getElementById('inputLastName').value.trim();
          var errBox = document.getElementById('submitError');

          if (!email || !email.includes('@')) { errBox.textContent = 'Please enter a valid email address.'; errBox.classList.add('show'); return; }
          if (!phone || phone.replace(/\\D/g,'').length < 10) { errBox.textContent = 'Please enter a valid 10-digit phone number.'; errBox.classList.add('show'); return; }
          if (!document.getElementById('consentTCPA').checked) { errBox.textContent = 'Please agree to receive communications to continue.'; errBox.classList.add('show'); return; }
          if (!document.getElementById('consentPrivacy').checked) { errBox.textContent = 'Please agree to the Privacy Policy to continue.'; errBox.classList.add('show'); return; }
          errBox.classList.remove('show');

          var btn = document.getElementById('submitBtn');
          btn.disabled = true;
          btn.textContent = 'Submitting...';

          // Parse address parts
          var fullAddr = document.getElementById('modalAddress').value.trim();
          var addrParts = fullAddr.split(',').map(function(s) { return s.trim(); });
          var street = addrParts[0] || '';
          var city = addrParts[1] || '';
          var stateZip = (addrParts[2] || '').trim().split(' ');
          var state = stateZip[0] || '';
          var zip = stateZip[1] || '';

          var payload = {
            first_name: firstName,
            last_name: lastName,
            email: email,
            phone: phone.replace(/\\D/g,'').slice(0,10),
            address: street,
            city: city,
            state: state,
            zip: zip,
            property_address: street,
            property_city: city,
            property_state: state,
            property_use: (document.querySelector('#occTiles .occ-tile.selected') || {}).textContent,
            ownership_type: (document.querySelector('#ownershipTiles .yn-tile.selected') || {}).textContent,
            income_source: document.getElementById('inputIncomeSource').value,
            pre_tax_income: document.getElementById('inputPreTaxIncome').value,
            mortgage_lates: (document.querySelector('#latesTiles .yn-tile.selected') || {}).textContent === 'Yes' ? 'yes' : 'no',
          };

          try {
            var res = await fetch('/api/submit-lead', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            });
            document.getElementById('step7').classList.remove('active');
            document.getElementById('stepSuccess').classList.add('active');
          } catch(err) {
            // Still show success to user even if API fails
            document.getElementById('step7').classList.remove('active');
            document.getElementById('stepSuccess').classList.add('active');
          }
        }

        // ── ADDRESS AUTOCOMPLETE ──
        var debounceTimers = {};
        function handleAddressInput(val, dropdownId, inputId) {
          clearTimeout(debounceTimers[dropdownId]);
          var dropdown = document.getElementById(dropdownId);
          if (!val || val.length < 4) { dropdown.classList.remove('show'); dropdown.innerHTML = ''; return; }
          debounceTimers[dropdownId] = setTimeout(function() {
            fetch('https://photon.komoot.io/api/?q=' + encodeURIComponent(val) + '&limit=5&bbox=-125,24,-66,50&lang=en')
              .then(function(r) { return r.json(); })
              .then(function(data) {
                var items = (data.features || []).filter(function(f) {
                  return f.properties && f.properties.country === 'United States';
                });
                if (!items.length) { dropdown.classList.remove('show'); return; }
                dropdown.innerHTML = items.map(function(f) {
                  var p = f.properties;
                  var label = [p.housenumber, p.street, p.city, p.state].filter(Boolean).join(', ');
                  return '<div class="autocomplete-item" onclick="pickAddress(\\'' + label.replace(/'/g,"\\\\'") + '\\', \\'' + inputId + '\\', \\'' + dropdownId + '\\')">' + label + '</div>';
                }).join('');
                dropdown.classList.add('show');
              }).catch(function() {});
          }, 350);
        }
        function pickAddress(label, inputId, dropdownId) {
          document.getElementById(inputId).value = label;
          document.getElementById(dropdownId).classList.remove('show');
          document.getElementById(dropdownId).innerHTML = '';
        }
        document.addEventListener('click', function(e) {
          ['heroDropdown','modalDropdown'].forEach(function(id) {
            var el = document.getElementById(id);
            if (el && !el.contains(e.target)) { el.classList.remove('show'); }
          });
        });
      `}}/>
    </>
  )
}
