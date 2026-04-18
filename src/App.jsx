import React, { useState, useMemo } from 'react';
import { Shield, LayoutDashboard, FileText, Bell, ChevronRight, Search, Filter, Download, Upload, Check, AlertTriangle, Clock, Building2, Mail, Phone, Calendar, FileCheck2, X, ArrowUpRight, Sparkles } from 'lucide-react';

// =====================================================================
// SEED DATA — Apex Construction universe
// =====================================================================

const APEX = {
  name: 'Apex Construction',
  tagline: 'Commercial General Contractor',
  address: '4820 Industrial Blvd, Arlington, TX',
  ein: '74-2918374',
  primaryContact: 'Dana Ruiz, Office Manager',
  logo: 'AC',
};

// GC view: Apex's subcontractors they're tracking
const APEX_SUBS = [
  { id: 1, name: 'Delta Electric LLC', trade: 'Electrical', contact: 'Marco Delgado', email: 'marco@deltaelectric.com', phone: '(817) 555-0142', gl: { carrier: 'Travelers', limit: 2000000, expires: '2026-05-02', status: 'active' }, wc: { carrier: 'Travelers', limit: 1000000, expires: '2026-05-02', status: 'active' }, auto: { carrier: 'Progressive', limit: 1000000, expires: '2026-03-18', status: 'expiring' }, lastSubmitted: '2025-11-04', projects: ['Sundance Tower', 'Westfork Medical'] },
  { id: 2, name: 'Precision Plumbing Co.', trade: 'Plumbing', contact: 'Rita Okafor', email: 'rita@precisionplumb.com', phone: '(214) 555-0177', gl: { carrier: 'The Hartford', limit: 2000000, expires: '2025-12-15', status: 'expired' }, wc: { carrier: 'The Hartford', limit: 1000000, expires: '2025-12-15', status: 'expired' }, auto: { carrier: 'Geico', limit: 1000000, expires: '2025-12-15', status: 'expired' }, lastSubmitted: '2024-12-10', projects: ['Sundance Tower'] },
  { id: 3, name: 'Ironline Steel & Rebar', trade: 'Structural Steel', contact: 'Jim Halberg', email: 'jim@ironlinesteel.com', phone: '(972) 555-0129', gl: { carrier: 'Liberty Mutual', limit: 5000000, expires: '2026-08-21', status: 'active' }, wc: { carrier: 'Liberty Mutual', limit: 1000000, expires: '2026-08-21', status: 'active' }, auto: { carrier: 'Liberty Mutual', limit: 1000000, expires: '2026-08-21', status: 'active' }, lastSubmitted: '2025-08-19', projects: ['Westfork Medical', 'Pinnacle Logistics'] },
  { id: 4, name: 'Summit HVAC Systems', trade: 'HVAC', contact: 'Elena Park', email: 'elena@summithvac.com', phone: '(817) 555-0193', gl: { carrier: 'Chubb', limit: 2000000, expires: '2026-04-30', status: 'expiring' }, wc: { carrier: 'Chubb', limit: 1000000, expires: '2026-04-30', status: 'expiring' }, auto: { carrier: 'Chubb', limit: 1000000, expires: '2026-04-30', status: 'expiring' }, lastSubmitted: '2025-05-01', projects: ['Sundance Tower', 'Pinnacle Logistics'] },
  { id: 5, name: 'Concrete Kings Ltd.', trade: 'Concrete', contact: 'Dmitri Volkov', email: 'dmitri@concretekings.com', phone: '(469) 555-0108', gl: { carrier: 'Nationwide', limit: 2000000, expires: '2026-10-14', status: 'active' }, wc: { carrier: 'Nationwide', limit: 1000000, expires: '2026-10-14', status: 'active' }, auto: { carrier: 'Nationwide', limit: 1000000, expires: '2026-10-14', status: 'active' }, lastSubmitted: '2025-10-12', projects: ['Pinnacle Logistics'] },
  { id: 6, name: 'Glasswork Specialists', trade: 'Glazing', contact: 'Amy Chen', email: 'amy@glassworkspec.com', phone: '(214) 555-0156', gl: { carrier: 'Zurich', limit: 2000000, expires: '2026-06-08', status: 'active' }, wc: { carrier: 'Zurich', limit: 1000000, expires: '2026-06-08', status: 'active' }, auto: null, lastSubmitted: '2025-06-05', projects: ['Westfork Medical'] },
  { id: 7, name: 'Northwind Roofing', trade: 'Roofing', contact: 'Paul Kowalski', email: 'paul@northwindroof.com', phone: '(972) 555-0164', gl: null, wc: null, auto: null, lastSubmitted: null, projects: ['Pinnacle Logistics'] },
];

// Apex's own COI (what a GC tracking Apex would see)
const APEX_OWN_COI = {
  gl: { carrier: 'Travelers Indemnity', policy: 'GL-8827194-TX', limit: 2000000, aggregate: 4000000, expires: '2026-09-14', status: 'active' },
  wc: { carrier: 'Texas Mutual', policy: 'WC-4471093', payroll: 500000, limit: 1000000, expires: '2026-09-14', status: 'active' },
  property: { carrier: 'CNA Commercial', policy: 'PR-9918204', limit: 1500000, expires: '2026-09-14', status: 'active' },
  auto: { carrier: 'Travelers Indemnity', policy: 'AU-7739104', limit: 1000000, expires: '2026-09-14', status: 'active' },
};

// GCs that track Apex as one of their subs
const APEX_TRACKED_BY = [
  { gc: 'Beacon Hill Development', project: 'Sundance Tower', status: 'active', lastVerified: '2025-09-16' },
  { gc: 'Meridian Healthcare Partners', project: 'Westfork Medical Center', status: 'active', lastVerified: '2025-09-16' },
  { gc: 'Pinnacle Industrial Group', project: 'Pinnacle Logistics Hub', status: 'active', lastVerified: '2025-09-20' },
];

const ACTIVITY = [
  { time: '2 min ago', type: 'reminder', msg: 'Reminder sent to Summit HVAC — expires in 13 days' },
  { time: '1 hr ago', type: 'submit', msg: 'Concrete Kings submitted renewed COI — auto-verified' },
  { time: '3 hr ago', type: 'alert', msg: 'Precision Plumbing flagged: COI expired on Sundance Tower' },
  { time: 'Yesterday', type: 'reminder', msg: 'Reminder sent to Delta Electric — auto policy expires in 30 days' },
  { time: 'Yesterday', type: 'submit', msg: 'Ironline Steel updated W-9 on file' },
  { time: '2 days ago', type: 'alert', msg: 'Northwind Roofing has no COI on file — onboarding required' },
];

// =====================================================================
// BRAND CONTEXT — lets Randy rebrand the demo mid-call
// =====================================================================

const DEFAULT_BRAND = { name: 'Apex Construction', contact: 'Dana', logoUrl: null };
const BRAND_STORAGE_KEY = 'coi-autopilot-brand-v1';
const BrandContext = React.createContext({ brand: DEFAULT_BRAND, setBrand: () => {}, resetBrand: () => {} });
const useBrand = () => React.useContext(BrandContext);

function firmInitials(name) {
  const letters = (name || '').split(/\s+/).filter(Boolean).map(w => w[0]).join('');
  return (letters || 'AC').slice(0, 2).toUpperCase();
}

function FirmMark({ size = 14 }) {
  const { brand } = useBrand();
  if (brand.logoUrl) {
    return <span className="firm-mark" style={{ width: size * 1.5, height: size * 1.5 }}><img src={brand.logoUrl} alt="" /></span>;
  }
  return <span className="firm-mark firm-mark-initials" style={{ width: size * 1.5, height: size * 1.5, fontSize: size * 0.7 }}>{firmInitials(brand.name)}</span>;
}

// =====================================================================
// DESIGN TOKENS
// =====================================================================

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

  .coi-app * { box-sizing: border-box; }
  .coi-app {
    --ink: #1a1a1a;
    --ink-2: #4a4a4a;
    --ink-3: #8a8a8a;
    --paper: #f5f5f5;
    --cream: #ffffff;
    --cream-2: #eaeaea;
    --line: #dcdcdc;
    --line-2: #d4d4d4;
    --accent: #f79546;
    --accent-hover: #e88536;
    --ok: #2d5f3f;
    --ok-bg: #e8f0ea;
    --warn: #8a5a1a;
    --warn-bg: #f7edd9;
    --bad: #8a2a2a;
    --bad-bg: #f5e3e0;
    --blue: #1a3a5a;
    --blue-bg: #e5ecf3;

    font-family: 'DM Sans', system-ui, sans-serif;
    color: var(--ink);
    background: var(--cream);
    min-height: 100vh;
    font-weight: 400;
    letter-spacing: -0.005em;
  }

  .coi-app .serif { font-family: 'DM Serif Display', serif; font-weight: 400; }
  .coi-app .mono { font-family: ui-monospace, 'SF Mono', Menlo, monospace; }

  .coi-app .layout {
    display: grid;
    grid-template-columns: 240px 1fr;
    min-height: 100vh;
  }

  .coi-app .sidebar {
    background: var(--paper);
    border-right: 0.5px solid var(--line);
    padding: 1.5rem 1rem;
    display: flex;
    flex-direction: column;
  }

  .coi-app .brand {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 0.5rem 1.5rem;
    border-bottom: 0.5px solid var(--line);
    margin-bottom: 1.5rem;
  }
  .coi-app .brand-mark {
    width: 30px; height: 30px;
    background: var(--accent);
    color: var(--ink);
    border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
  }
  .coi-app .brand-name { font-family: 'DM Serif Display', serif; font-size: 17px; line-height: 1; }
  .coi-app .brand-sub { font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-3); margin-top: 3px; }

  .coi-app .persona-switch {
    background: var(--cream);
    border: 0.5px solid var(--line);
    border-radius: 8px;
    padding: 4px;
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin-bottom: 1.5rem;
  }
  .coi-app .persona-label { font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-3); padding: 6px 8px 4px; }
  .coi-app .persona-btn {
    background: transparent;
    border: none;
    text-align: left;
    padding: 8px 10px;
    border-radius: 5px;
    font-size: 12px;
    cursor: pointer;
    color: var(--ink-2);
    font-family: inherit;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.15s ease;
  }
  .coi-app .persona-btn:hover { background: var(--cream-2); color: var(--ink); }
  .coi-app .persona-btn.active { background: var(--accent); color: var(--ink); }

  .coi-app .nav { display: flex; flex-direction: column; gap: 2px; }
  .coi-app .nav-label { font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-3); padding: 6px 10px; margin-top: 0.5rem; }
  .coi-app .nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 8px 10px;
    border-radius: 6px;
    font-size: 13px;
    color: var(--ink-2);
    cursor: pointer;
    border: none;
    background: transparent;
    font-family: inherit;
    text-align: left;
    width: 100%;
    transition: all 0.15s ease;
  }
  .coi-app .nav-item:hover { background: var(--cream-2); color: var(--ink); }
  .coi-app .nav-item.active { background: var(--cream-2); color: var(--ink); font-weight: 500; }
  .coi-app .nav-item .badge {
    margin-left: auto;
    background: var(--bad-bg);
    color: var(--bad);
    font-size: 10px;
    font-weight: 500;
    padding: 1px 6px;
    border-radius: 10px;
  }

  .coi-app .sidebar-foot { margin-top: auto; padding-top: 1rem; border-top: 0.5px solid var(--line); font-size: 11px; color: var(--ink-3); }

  .coi-app .firm-mark {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    overflow: hidden;
    flex-shrink: 0;
    background: var(--cream-2);
    border: 0.5px solid var(--line);
    color: var(--ink);
  }
  .coi-app .firm-mark img { width: 100%; height: 100%; object-fit: contain; }
  .coi-app .firm-mark-initials { font-family: 'DM Sans', sans-serif; font-weight: 600; letter-spacing: -0.02em; }

  .coi-app .customize-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 8px 10px;
    margin-top: 10px;
    background: transparent;
    border: 0.5px dashed var(--line-2);
    border-radius: 6px;
    font-family: inherit;
    font-size: 11px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--ink-3);
    cursor: pointer;
    transition: all 0.15s ease;
  }
  .coi-app .customize-btn:hover { border-color: var(--ink); color: var(--ink); background: var(--cream-2); }

  .coi-app .brand-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(26, 26, 26, 0.35);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 200;
    padding: 1rem;
  }
  .coi-app .brand-modal {
    background: var(--paper);
    border: 0.5px solid var(--line);
    border-radius: 12px;
    width: 100%;
    max-width: 440px;
    box-shadow: 0 20px 60px rgba(26, 26, 26, 0.15);
    overflow: hidden;
  }
  .coi-app .brand-modal-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem 1.5rem;
    border-bottom: 0.5px solid var(--line);
  }
  .coi-app .brand-modal-title { font-family: 'DM Serif Display', serif; font-size: 20px; }
  .coi-app .brand-modal-close {
    background: transparent; border: none; cursor: pointer;
    color: var(--ink-3); padding: 4px; border-radius: 4px;
    display: flex; align-items: center; justify-content: center;
  }
  .coi-app .brand-modal-close:hover { color: var(--ink); background: var(--cream-2); }

  .coi-app .brand-modal-body {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.1rem;
  }
  .coi-app .brand-field { display: flex; flex-direction: column; gap: 6px; }
  .coi-app .brand-field-label { font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-3); }
  .coi-app .brand-field-hint { font-size: 11px; color: var(--ink-3); margin-top: 2px; }
  .coi-app .brand-input {
    font-family: inherit;
    font-size: 14px;
    padding: 9px 12px;
    border: 0.5px solid var(--line-2);
    border-radius: 6px;
    background: var(--paper);
    color: var(--ink);
    outline: none;
    transition: border-color 0.15s ease;
  }
  .coi-app .brand-input:focus { border-color: var(--ink); }

  .coi-app .brand-logo-row {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .coi-app .brand-logo-preview {
    width: 56px; height: 56px;
    border-radius: 8px;
    background: var(--cream);
    border: 0.5px solid var(--line);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    color: var(--ink-3);
    font-size: 10px;
    flex-shrink: 0;
  }
  .coi-app .brand-logo-preview img { width: 100%; height: 100%; object-fit: contain; }
  .coi-app .brand-logo-actions { display: flex; flex-direction: column; gap: 6px; }
  .coi-app .brand-logo-upload {
    display: inline-flex; align-items: center; gap: 6px;
    font-family: inherit;
    font-size: 12px;
    padding: 7px 12px;
    border: 0.5px solid var(--line-2);
    border-radius: 6px;
    background: var(--paper);
    color: var(--ink);
    cursor: pointer;
    transition: all 0.15s ease;
  }
  .coi-app .brand-logo-upload:hover { border-color: var(--ink); background: var(--cream-2); }
  .coi-app .brand-logo-clear {
    background: transparent;
    border: none;
    font-family: inherit;
    font-size: 11px;
    color: var(--ink-3);
    cursor: pointer;
    padding: 4px 0;
    text-align: left;
  }
  .coi-app .brand-logo-clear:hover { color: var(--bad); }

  .coi-app .brand-modal-foot {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 1rem 1.5rem;
    border-top: 0.5px solid var(--line);
    background: var(--cream);
  }

  .coi-app .main { padding: 2rem 2.5rem; max-width: 1400px; }

  .coi-app .page-head { margin-bottom: 2rem; }
  .coi-app .page-eyebrow { font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink-3); margin-bottom: 6px; }
  .coi-app .page-title { font-family: 'DM Serif Display', serif; font-size: 34px; line-height: 1.1; margin: 0 0 6px; }
  .coi-app .page-title em { font-style: italic; color: var(--ink-2); }
  .coi-app .page-sub { font-size: 14px; color: var(--ink-2); max-width: 640px; line-height: 1.5; }

  .coi-app .kpi-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 2rem; }
  .coi-app .kpi {
    background: var(--paper);
    border: 0.5px solid var(--line);
    border-radius: 10px;
    padding: 1.1rem 1.2rem;
    position: relative;
    overflow: hidden;
  }
  .coi-app .kpi-label { font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-3); margin-bottom: 10px; }
  .coi-app .kpi-value { font-family: 'DM Serif Display', serif; font-size: 34px; line-height: 1; margin-bottom: 4px; }
  .coi-app .kpi-delta { font-size: 11px; color: var(--ink-3); }
  .coi-app .kpi-delta.up { color: var(--ok); }
  .coi-app .kpi-delta.down { color: var(--bad); }
  .coi-app .kpi-spark { position: absolute; right: 10px; bottom: 10px; opacity: 0.35; }

  .coi-app .panel {
    background: var(--paper);
    border: 0.5px solid var(--line);
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 1.25rem;
  }
  .coi-app .panel-head {
    padding: 1rem 1.25rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 0.5px solid var(--line);
  }
  .coi-app .panel-title { font-family: 'DM Serif Display', serif; font-size: 18px; }
  .coi-app .panel-actions { display: flex; gap: 6px; align-items: center; }

  .coi-app .btn {
    background: var(--paper);
    border: 0.5px solid var(--line-2);
    border-radius: 6px;
    padding: 6px 12px;
    font-size: 12px;
    color: var(--ink);
    cursor: pointer;
    font-family: inherit;
    display: inline-flex; align-items: center; gap: 6px;
    transition: all 0.15s ease;
  }
  .coi-app .btn:hover { background: var(--cream-2); border-color: var(--ink-3); }
  .coi-app .btn-primary { background: var(--accent); color: var(--ink); border-color: var(--accent); }
  .coi-app .btn-primary:hover { background: var(--accent-hover); border-color: var(--accent-hover); }

  .coi-app .table { width: 100%; border-collapse: collapse; }
  .coi-app .table th {
    font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase;
    color: var(--ink-3); text-align: left; font-weight: 500;
    padding: 10px 1.25rem; background: var(--cream);
    border-bottom: 0.5px solid var(--line);
  }
  .coi-app .table td {
    padding: 14px 1.25rem;
    border-bottom: 0.5px solid var(--line);
    font-size: 13px;
    vertical-align: middle;
  }
  .coi-app .table tr:last-child td { border-bottom: none; }
  .coi-app .table tr { cursor: pointer; transition: background 0.15s ease; }
  .coi-app .table tbody tr:hover { background: var(--cream); }

  .coi-app .vendor-cell { display: flex; align-items: center; gap: 10px; }
  .coi-app .vendor-avatar {
    width: 30px; height: 30px; border-radius: 6px;
    background: var(--cream-2); color: var(--ink);
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 500; letter-spacing: 0.02em;
    border: 0.5px solid var(--line);
  }
  .coi-app .vendor-name { font-weight: 500; font-size: 13px; line-height: 1.2; }
  .coi-app .vendor-trade { font-size: 11px; color: var(--ink-3); margin-top: 2px; }

  .coi-app .status {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 11px; font-weight: 500;
    padding: 3px 8px; border-radius: 10px;
    letter-spacing: 0.01em;
  }
  .coi-app .status.ok { background: var(--ok-bg); color: var(--ok); }
  .coi-app .status.warn { background: var(--warn-bg); color: var(--warn); }
  .coi-app .status.bad { background: var(--bad-bg); color: var(--bad); }
  .coi-app .status.neutral { background: var(--cream-2); color: var(--ink-2); }
  .coi-app .status-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }

  .coi-app .coverage-bar { display: flex; gap: 3px; align-items: center; }
  .coi-app .cov-pill {
    font-size: 10px; padding: 2px 6px; border-radius: 3px;
    font-family: ui-monospace, monospace;
    letter-spacing: 0.02em;
  }
  .coi-app .cov-pill.ok { background: var(--ok-bg); color: var(--ok); }
  .coi-app .cov-pill.warn { background: var(--warn-bg); color: var(--warn); }
  .coi-app .cov-pill.bad { background: var(--bad-bg); color: var(--bad); }
  .coi-app .cov-pill.none { background: var(--cream-2); color: var(--ink-3); }

  .coi-app .grid-2 { display: grid; grid-template-columns: 2fr 1fr; gap: 1.25rem; }
  .coi-app .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }

  .coi-app .activity-item {
    display: flex; gap: 10px; align-items: flex-start;
    padding: 12px 1.25rem;
    border-bottom: 0.5px solid var(--line);
    font-size: 12px;
  }
  .coi-app .activity-item:last-child { border-bottom: none; }
  .coi-app .activity-icon {
    width: 24px; height: 24px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .coi-app .activity-icon.reminder { background: var(--blue-bg); color: var(--blue); }
  .coi-app .activity-icon.submit { background: var(--ok-bg); color: var(--ok); }
  .coi-app .activity-icon.alert { background: var(--bad-bg); color: var(--bad); }
  .coi-app .activity-time { font-size: 10px; color: var(--ink-3); margin-top: 3px; letter-spacing: 0.04em; text-transform: uppercase; }
  .coi-app .activity-msg { color: var(--ink-2); line-height: 1.45; }

  /* Intake form */
  .coi-app .intake-shell { max-width: 720px; margin: 0 auto; }
  .coi-app .intake-hero {
    background: var(--paper);
    border: 0.5px solid var(--line);
    border-radius: 12px;
    padding: 2.25rem 2.5rem;
    margin-bottom: 1rem;
  }
  .coi-app .intake-logo {
    width: 44px; height: 44px;
    background: var(--accent); color: var(--ink);
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-family: 'DM Serif Display', serif; font-size: 20px;
    margin-bottom: 1rem;
  }
  .coi-app .intake-title { font-family: 'DM Serif Display', serif; font-size: 28px; line-height: 1.15; margin-bottom: 6px; }
  .coi-app .intake-subtitle { font-size: 14px; color: var(--ink-2); line-height: 1.5; }

  .coi-app .form-section {
    background: var(--paper);
    border: 0.5px solid var(--line);
    border-radius: 12px;
    padding: 1.75rem 2.5rem;
    margin-bottom: 1rem;
  }
  .coi-app .form-section-head { margin-bottom: 1.25rem; padding-bottom: 0.75rem; border-bottom: 0.5px solid var(--line); }
  .coi-app .form-section-num { font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-3); margin-bottom: 3px; }
  .coi-app .form-section-title { font-family: 'DM Serif Display', serif; font-size: 20px; }

  .coi-app .field { margin-bottom: 1rem; }
  .coi-app .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .coi-app .field label { font-size: 11px; letter-spacing: 0.04em; font-weight: 500; color: var(--ink-2); display: block; margin-bottom: 5px; text-transform: uppercase; }
  .coi-app .field input, .coi-app .field select, .coi-app .field textarea {
    width: 100%; background: var(--cream);
    border: 0.5px solid var(--line);
    border-radius: 6px;
    padding: 10px 12px;
    font-size: 13px;
    font-family: inherit;
    color: var(--ink);
    transition: all 0.15s ease;
  }
  .coi-app .field input:focus, .coi-app .field select:focus, .coi-app .field textarea:focus {
    outline: none; background: var(--paper);
    border-color: var(--ink);
  }
  .coi-app .field input.readonly { background: var(--cream-2); color: var(--ink-2); }

  .coi-app .upload-zone {
    border: 1px dashed var(--line-2);
    border-radius: 8px;
    padding: 2rem;
    text-align: center;
    background: var(--cream);
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .coi-app .upload-zone:hover { background: var(--cream-2); border-color: var(--ink-3); }
  .coi-app .upload-zone.uploaded { background: var(--ok-bg); border-color: var(--ok); border-style: solid; }

  .coi-app .parsed-preview {
    background: var(--cream);
    border: 0.5px solid var(--line);
    border-radius: 8px;
    padding: 1rem 1.25rem;
    margin-top: 1rem;
  }
  .coi-app .parsed-head { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--ok); margin-bottom: 10px; font-weight: 500; }
  .coi-app .parsed-row { display: flex; justify-content: space-between; font-size: 12px; padding: 4px 0; }
  .coi-app .parsed-row span:first-child { color: var(--ink-3); }
  .coi-app .parsed-row span:last-child { font-family: ui-monospace, monospace; }

  /* Drawer */
  .coi-app .drawer-backdrop {
    position: fixed; inset: 0;
    background: rgba(20,20,20,0.3);
    z-index: 40;
    animation: fadeIn 0.2s ease;
  }
  .coi-app .drawer {
    position: fixed; top: 0; right: 0; bottom: 0;
    width: 520px; max-width: 90vw;
    background: var(--paper);
    border-left: 0.5px solid var(--line);
    z-index: 50; overflow-y: auto;
    animation: slideIn 0.25s ease;
    box-shadow: -20px 0 60px rgba(0,0,0,0.08);
  }
  @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

  .coi-app .drawer-head {
    padding: 1.5rem 1.75rem;
    border-bottom: 0.5px solid var(--line);
    display: flex; align-items: flex-start; justify-content: space-between;
    gap: 1rem;
  }
  .coi-app .drawer-close {
    background: transparent; border: none; cursor: pointer;
    color: var(--ink-3); padding: 4px; border-radius: 4px;
  }
  .coi-app .drawer-close:hover { background: var(--cream-2); color: var(--ink); }

  .coi-app .drawer-body { padding: 1.5rem 1.75rem; }

  .coi-app .detail-group { margin-bottom: 1.5rem; }
  .coi-app .detail-label { font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-3); margin-bottom: 8px; }
  .coi-app .detail-value { font-size: 13px; color: var(--ink); line-height: 1.5; }

  .coi-app .coverage-detail {
    background: var(--cream);
    border: 0.5px solid var(--line);
    border-radius: 8px;
    padding: 1rem 1.25rem;
    margin-bottom: 0.5rem;
  }
  .coi-app .coverage-detail-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
  .coi-app .coverage-type { font-weight: 500; font-size: 13px; }
  .coi-app .coverage-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 12px; }
  .coi-app .coverage-grid > div > span:first-child { color: var(--ink-3); display: block; font-size: 10px; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 2px; }

  .coi-app .reminder-timeline {
    display: flex; gap: 0; align-items: stretch;
    background: var(--cream); border-radius: 8px;
    padding: 4px; border: 0.5px solid var(--line);
  }
  .coi-app .timeline-step {
    flex: 1; padding: 10px 8px;
    text-align: center; font-size: 11px;
    border-radius: 6px;
  }
  .coi-app .timeline-step.done { background: var(--ok-bg); color: var(--ok); }
  .coi-app .timeline-step.now { background: var(--paper); color: var(--ink); border: 0.5px solid var(--line); }
  .coi-app .timeline-step.future { color: var(--ink-3); }
  .coi-app .timeline-step .ts-label { font-weight: 500; margin-bottom: 2px; }

  .coi-app .empty {
    text-align: center; padding: 3rem 1rem;
    color: var(--ink-3); font-size: 13px;
  }

  /* Confirmation screen */
  .coi-app .confirm-screen {
    text-align: center; padding: 3rem 2rem;
    background: var(--paper);
    border: 0.5px solid var(--line);
    border-radius: 12px;
  }
  .coi-app .confirm-check {
    width: 64px; height: 64px;
    background: var(--ok-bg); color: var(--ok);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 1.25rem;
  }
  .coi-app .confirm-title { font-family: 'DM Serif Display', serif; font-size: 26px; margin-bottom: 8px; }
  .coi-app .confirm-msg { font-size: 14px; color: var(--ink-2); max-width: 440px; margin: 0 auto 1.5rem; line-height: 1.5; }

  .coi-app .page-head-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 2rem;
    margin-bottom: 2rem;
  }
  .coi-app .page-head-row .page-head { margin-bottom: 0; flex: 1; }
  .coi-app .page-head-row .btn svg { margin-right: 4px; }

  /* ==== EXECUTIVE REPORT ==== */
  .coi-app .exec-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 10px 14px;
    background: var(--cream-2);
    border: 0.5px solid var(--line);
    border-radius: 8px;
    margin-bottom: 1.5rem;
  }
  .coi-app .exec-topbar-label {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: var(--ink-2);
  }
  .coi-app .exec-topbar-actions { display: flex; gap: 8px; }

  .coi-app .exec-report {
    background: var(--paper);
    max-width: 820px;
    margin: 0 auto;
    padding: 3rem 3.25rem;
    border: 0.5px solid var(--line);
    border-radius: 4px;
    font-size: 13px;
    line-height: 1.55;
    color: var(--ink);
  }
  .coi-app .report-letterhead {
    display: flex;
    align-items: center;
    gap: 18px;
    padding-bottom: 1.5rem;
    margin-bottom: 2rem;
    border-bottom: 2px solid var(--ink);
  }
  .coi-app .report-mark {
    width: 56px; height: 56px;
    border-radius: 8px;
    background: var(--cream);
    border: 0.5px solid var(--line);
    display: flex; align-items: center; justify-content: center;
    overflow: hidden;
    color: var(--ink);
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    font-size: 22px;
    flex-shrink: 0;
  }
  .coi-app .report-mark img { width: 100%; height: 100%; object-fit: contain; }
  .coi-app .report-firm-name { font-family: 'DM Serif Display', serif; font-size: 22px; line-height: 1.1; margin-bottom: 4px; }
  .coi-app .report-subtitle { font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-3); }
  .coi-app .report-meta { margin-left: auto; text-align: right; font-size: 11px; color: var(--ink-3); line-height: 1.5; }

  .coi-app .report-section { margin-bottom: 2.25rem; }
  .coi-app .report-section-label { font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--ink-3); margin-bottom: 4px; }
  .coi-app .report-section-title { font-family: 'DM Serif Display', serif; font-size: 19px; margin-bottom: 1rem; border-bottom: 0.5px solid var(--line); padding-bottom: 8px; }

  .coi-app .report-summary {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 1.25rem;
  }
  .coi-app .report-summary-cell { padding: 10px 0; }
  .coi-app .report-summary-label { font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-3); margin-bottom: 6px; }
  .coi-app .report-summary-value { font-family: 'DM Serif Display', serif; font-size: 28px; line-height: 1; }

  .coi-app .report-para { font-size: 13px; color: var(--ink-2); line-height: 1.7; }
  .coi-app .report-para strong { color: var(--ink); }

  .coi-app .report-table { width: 100%; border-collapse: collapse; font-size: 12px; }
  .coi-app .report-table thead th {
    text-align: left;
    padding: 8px 10px;
    border-bottom: 1px solid var(--ink);
    font-size: 10px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--ink-3);
    font-weight: 500;
  }
  .coi-app .report-table tbody td {
    padding: 10px;
    border-bottom: 0.5px solid var(--line);
    vertical-align: top;
  }
  .coi-app .report-table tbody tr:last-child td { border-bottom: none; }
  .coi-app .report-vendor-name { font-weight: 500; color: var(--ink); }
  .coi-app .report-vendor-trade { font-size: 11px; color: var(--ink-3); }
  .coi-app .report-status {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 10px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    font-weight: 500;
  }
  .coi-app .report-status.ok { color: var(--ok); background: var(--ok-bg); }
  .coi-app .report-status.warn { color: var(--warn); background: var(--warn-bg); }
  .coi-app .report-status.bad { color: var(--bad); background: var(--bad-bg); }

  .coi-app .report-action-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
  .coi-app .report-action-item {
    display: flex;
    gap: 12px;
    padding: 12px 14px;
    background: var(--cream);
    border-left: 3px solid var(--bad);
    border-radius: 0 6px 6px 0;
  }
  .coi-app .report-action-item.warn { border-left-color: var(--warn); }
  .coi-app .report-action-label { font-weight: 500; color: var(--ink); margin-bottom: 2px; font-size: 13px; }
  .coi-app .report-action-body { font-size: 12px; color: var(--ink-2); line-height: 1.5; }

  .coi-app .report-footer {
    margin-top: 3rem;
    padding-top: 1rem;
    border-top: 0.5px solid var(--line);
    display: flex;
    justify-content: space-between;
    font-size: 10px;
    color: var(--ink-3);
    letter-spacing: 0.04em;
  }

  @media print {
    @page { size: letter; margin: 0.5in; }
    body { background: white !important; }
    .coi-app .sidebar, .coi-app .exec-topbar { display: none !important; }
    .coi-app .layout { grid-template-columns: 1fr !important; }
    .coi-app .main { padding: 0 !important; max-width: 100% !important; }
    .coi-app .exec-report { border: none; padding: 0; max-width: 100%; }
    .coi-app .report-section { page-break-inside: avoid; }
    .coi-app .brand-modal-overlay { display: none !important; }
  }

  @media (max-width: 900px) {
    .coi-app .layout { grid-template-columns: 1fr; }
    .coi-app .sidebar { display: none; }
    .coi-app .main { padding: 1.25rem; }
    .coi-app .kpi-row { grid-template-columns: repeat(2, 1fr); }
    .coi-app .grid-2 { grid-template-columns: 1fr; }
    .coi-app .page-title { font-size: 26px; }
    .coi-app .exec-report { padding: 1.5rem; }
    .coi-app .report-summary { grid-template-columns: repeat(2, 1fr); }
    .coi-app .report-letterhead { flex-wrap: wrap; }
    .coi-app .report-meta { margin-left: 0; text-align: left; }
  }
`;

// =====================================================================
// HELPERS
// =====================================================================

const fmtMoney = (n) => n >= 1000000 ? `$${(n/1000000).toFixed(n % 1000000 === 0 ? 0 : 1)}M` : `$${(n/1000).toFixed(0)}K`;
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
const daysUntil = (d) => {
  if (!d) return null;
  const diff = Math.ceil((new Date(d) - new Date('2026-04-17')) / (1000*60*60*24));
  return diff;
};

const overallStatus = (sub) => {
  if (!sub.gl && !sub.wc) return 'missing';
  const statuses = [sub.gl, sub.wc, sub.auto].filter(Boolean).map(c => c.status);
  if (statuses.includes('expired')) return 'expired';
  if (statuses.includes('expiring')) return 'expiring';
  return 'compliant';
};

// =====================================================================
// SHARED SIDEBAR
// =====================================================================

function Sidebar({ persona, setPersona, view, setView, onRebrand }) {
  const { brand } = useBrand();
  const expiredCount = APEX_SUBS.filter(s => overallStatus(s) === 'expired' || overallStatus(s) === 'missing').length;
  const shortName = brand.name.length > 22 ? brand.name.slice(0, 20) + '…' : brand.name;

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark"><Shield size={16} /></div>
        <div>
          <div className="brand-name">COI Autopilot</div>
          <div className="brand-sub">by AECLogix</div>
        </div>
      </div>

      <div className="persona-switch">
        <div className="persona-label">Viewing as</div>
        <button className={`persona-btn ${persona === 'gc' ? 'active' : ''}`} onClick={() => { setPersona('gc'); setView('dashboard'); }}>
          <FirmMark size={14} /> {shortName} (GC)
        </button>
        <button className={`persona-btn ${persona === 'sub' ? 'active' : ''}`} onClick={() => { setPersona('sub'); setView('dashboard'); }}>
          <FileCheck2 size={14} /> {shortName} (tracked by others)
        </button>
        <button className={`persona-btn ${persona === 'vendor' ? 'active' : ''}`} onClick={() => { setPersona('vendor'); setView('intake'); }}>
          <Upload size={14} /> Vendor (submitting COI)
        </button>
        <button className="customize-btn" onClick={onRebrand}>
          <Sparkles size={12} /> Customize demo brand
        </button>
      </div>

      <nav className="nav">
        <div className="nav-label">Workspace</div>
        {persona === 'gc' && (
          <>
            <button className={`nav-item ${view === 'dashboard' ? 'active' : ''}`} onClick={() => setView('dashboard')}>
              <LayoutDashboard size={14} /> Dashboard
            </button>
            <button className={`nav-item ${view === 'vendors' ? 'active' : ''}`} onClick={() => setView('vendors')}>
              <Building2 size={14} /> Vendors
              {expiredCount > 0 && <span className="badge">{expiredCount}</span>}
            </button>
            <button className={`nav-item ${view === 'alerts' ? 'active' : ''}`} onClick={() => setView('alerts')}>
              <Bell size={14} /> Alerts
            </button>
            <button className={`nav-item ${view === 'intake' ? 'active' : ''}`} onClick={() => setView('intake')}>
              <FileText size={14} /> Intake Form
            </button>
            <button className={`nav-item ${view === 'report' ? 'active' : ''}`} onClick={() => setView('report')}>
              <Download size={14} /> Executive Report
            </button>
          </>
        )}
        {persona === 'sub' && (
          <>
            <button className={`nav-item ${view === 'dashboard' ? 'active' : ''}`} onClick={() => setView('dashboard')}>
              <LayoutDashboard size={14} /> My Compliance
            </button>
            <button className={`nav-item ${view === 'alerts' ? 'active' : ''}`} onClick={() => setView('alerts')}>
              <Bell size={14} /> Upcoming Renewals
            </button>
          </>
        )}
        {persona === 'vendor' && (
          <button className={`nav-item active`}>
            <Upload size={14} /> Submit COI
          </button>
        )}
      </nav>

      <div className="sidebar-foot">
        <div style={{marginBottom: 4, color: 'var(--ink-2)', fontWeight: 500}}>Demo environment</div>
        Seeded with {brand.name} data. No real emails are sent.
      </div>
    </aside>
  );
}

// =====================================================================
// BRAND MODAL — rebrand the demo live
// =====================================================================

function BrandModal({ onClose }) {
  const { brand, setBrand, resetBrand } = useBrand();
  const [name, setName] = useState(brand.name);
  const [contact, setContact] = useState(brand.contact);
  const [logoUrl, setLogoUrl] = useState(brand.logoUrl);
  const fileRef = React.useRef(null);

  const onFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setLogoUrl(reader.result);
    reader.readAsDataURL(file);
  };

  const apply = () => {
    setBrand({
      name: name.trim() || DEFAULT_BRAND.name,
      contact: contact.trim() || DEFAULT_BRAND.contact,
      logoUrl,
    });
    onClose();
  };

  const reset = () => {
    resetBrand();
    onClose();
  };

  return (
    <div className="brand-modal-overlay" onClick={onClose}>
      <div className="brand-modal" onClick={e => e.stopPropagation()}>
        <div className="brand-modal-head">
          <div className="brand-modal-title">Customize demo</div>
          <button className="brand-modal-close" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="brand-modal-body">
          <div className="brand-field">
            <div className="brand-field-label">Firm name</div>
            <input className="brand-input" value={name} onChange={e => setName(e.target.value)} placeholder="Apex Construction" />
          </div>
          <div className="brand-field">
            <div className="brand-field-label">Contact name</div>
            <input className="brand-input" value={contact} onChange={e => setContact(e.target.value)} placeholder="Dana" />
            <div className="brand-field-hint">Used in greetings (e.g. "Good morning, Dana")</div>
          </div>
          <div className="brand-field">
            <div className="brand-field-label">Firm logo</div>
            <div className="brand-logo-row">
              <div className="brand-logo-preview">
                {logoUrl ? <img src={logoUrl} alt="" /> : <span>No logo</span>}
              </div>
              <div className="brand-logo-actions">
                <input ref={fileRef} type="file" accept="image/*" onChange={onFile} style={{display: 'none'}} />
                <button className="brand-logo-upload" onClick={() => fileRef.current?.click()}>
                  <Upload size={12} /> Upload image
                </button>
                {logoUrl && <button className="brand-logo-clear" onClick={() => setLogoUrl(null)}>Clear logo</button>}
              </div>
            </div>
          </div>
        </div>
        <div className="brand-modal-foot">
          <button className="btn" onClick={reset}>Reset to Apex</button>
          <div style={{flex: 1}} />
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={apply}>Apply</button>
        </div>
      </div>
    </div>
  );
}

// =====================================================================
// GC VIEW — DASHBOARD
// =====================================================================

function GCDashboard({ onSelectVendor, onViewReport }) {
  const { brand } = useBrand();
  const compliant = APEX_SUBS.filter(s => overallStatus(s) === 'compliant').length;
  const expiring = APEX_SUBS.filter(s => overallStatus(s) === 'expiring').length;
  const expired = APEX_SUBS.filter(s => overallStatus(s) === 'expired' || overallStatus(s) === 'missing').length;
  const compliancePct = Math.round((compliant / APEX_SUBS.length) * 100);

  return (
    <>
      <div className="page-head-row">
        <div className="page-head">
          <div className="page-eyebrow">{brand.name} · Compliance workspace</div>
          <h1 className="page-title">Good morning, {brand.contact}.<br /><em>Here's where things stand.</em></h1>
          <p className="page-sub">Seven active subs across three projects. Two need attention in the next 14 days, one is already non-compliant on Sundance Tower.</p>
        </div>
        <button className="btn" onClick={onViewReport}>
          <Download size={13} /> Export report
        </button>
      </div>

      <div className="kpi-row">
        <div className="kpi">
          <div className="kpi-label">Overall compliance</div>
          <div className="kpi-value">{compliancePct}<span style={{fontSize: 20, color: 'var(--ink-3)'}}>%</span></div>
          <div className="kpi-delta up">↑ 12 pts vs. last quarter</div>
          <svg className="kpi-spark" width="50" height="20" viewBox="0 0 50 20"><polyline points="0,15 10,12 20,14 30,8 40,6 50,4" fill="none" stroke="var(--ok)" strokeWidth="1.5"/></svg>
        </div>
        <div className="kpi">
          <div className="kpi-label">Compliant</div>
          <div className="kpi-value" style={{color: 'var(--ok)'}}>{compliant}</div>
          <div className="kpi-delta">of {APEX_SUBS.length} vendors</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Expiring ≤ 30 days</div>
          <div className="kpi-value" style={{color: 'var(--warn)'}}>{expiring}</div>
          <div className="kpi-delta">Reminders queued</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Expired or missing</div>
          <div className="kpi-value" style={{color: 'var(--bad)'}}>{expired}</div>
          <div className="kpi-delta down">Action required</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="panel">
          <div className="panel-head">
            <div className="panel-title">Vendors needing attention</div>
            <div className="panel-actions">
              <button className="btn"><Filter size={12}/> Filter</button>
              <button className="btn btn-primary">Send batch reminder</button>
            </div>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Vendor</th>
                <th>Coverage</th>
                <th>Expires</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {APEX_SUBS.filter(s => overallStatus(s) !== 'compliant').map(sub => {
                const status = overallStatus(sub);
                const soonest = [sub.gl, sub.wc, sub.auto].filter(Boolean).sort((a,b) => new Date(a.expires) - new Date(b.expires))[0];
                return (
                  <tr key={sub.id} onClick={() => onSelectVendor(sub)}>
                    <td>
                      <div className="vendor-cell">
                        <div className="vendor-avatar">{sub.name.split(' ').slice(0,2).map(w => w[0]).join('')}</div>
                        <div>
                          <div className="vendor-name">{sub.name}</div>
                          <div className="vendor-trade">{sub.trade}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="coverage-bar">
                        <span className={`cov-pill ${sub.gl ? sub.gl.status === 'active' ? 'ok' : sub.gl.status === 'expiring' ? 'warn' : 'bad' : 'none'}`}>GL</span>
                        <span className={`cov-pill ${sub.wc ? sub.wc.status === 'active' ? 'ok' : sub.wc.status === 'expiring' ? 'warn' : 'bad' : 'none'}`}>WC</span>
                        <span className={`cov-pill ${sub.auto ? sub.auto.status === 'active' ? 'ok' : sub.auto.status === 'expiring' ? 'warn' : 'bad' : 'none'}`}>AU</span>
                      </div>
                    </td>
                    <td style={{fontFamily: 'ui-monospace, monospace', fontSize: 12, color: 'var(--ink-2)'}}>
                      {soonest ? fmtDate(soonest.expires) : 'No COI on file'}
                    </td>
                    <td>
                      {status === 'expired' && <span className="status bad"><span className="status-dot"/>Expired</span>}
                      {status === 'expiring' && <span className="status warn"><span className="status-dot"/>Expiring soon</span>}
                      {status === 'missing' && <span className="status bad"><span className="status-dot"/>Missing</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="panel">
          <div className="panel-head">
            <div className="panel-title">Recent activity</div>
          </div>
          <div>
            {ACTIVITY.map((a, i) => (
              <div key={i} className="activity-item">
                <div className={`activity-icon ${a.type}`}>
                  {a.type === 'reminder' && <Bell size={12}/>}
                  {a.type === 'submit' && <Check size={12}/>}
                  {a.type === 'alert' && <AlertTriangle size={12}/>}
                </div>
                <div style={{flex: 1}}>
                  <div className="activity-msg">{a.msg}</div>
                  <div className="activity-time">{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// =====================================================================
// GC VIEW — VENDORS TABLE
// =====================================================================

function GCVendors({ onSelectVendor }) {
  const { brand } = useBrand();
  const [filter, setFilter] = useState('all');
  const [q, setQ] = useState('');

  const filtered = APEX_SUBS.filter(s => {
    const st = overallStatus(s);
    if (filter === 'compliant' && st !== 'compliant') return false;
    if (filter === 'attention' && st === 'compliant') return false;
    if (q && !s.name.toLowerCase().includes(q.toLowerCase()) && !s.trade.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <>
      <div className="page-head">
        <div className="page-eyebrow">{brand.name} · Vendors</div>
        <h1 className="page-title">All vendors</h1>
        <p className="page-sub">Every subcontractor and vendor {brand.name} engages, with live COI status. Click any row for full policy detail and reminder history.</p>
      </div>

      <div className="panel">
        <div className="panel-head">
          <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
            <div style={{position: 'relative'}}>
              <Search size={13} style={{position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-3)'}}/>
              <input
                value={q}
                onChange={e => setQ(e.target.value)}
                placeholder="Search vendors or trades..."
                style={{padding: '6px 10px 6px 30px', fontSize: 12, border: '0.5px solid var(--line-2)', borderRadius: 6, background: 'var(--cream)', fontFamily: 'inherit', width: 240}}
              />
            </div>
            <div style={{display: 'flex', gap: 4, background: 'var(--cream)', padding: 3, borderRadius: 6, border: '0.5px solid var(--line)'}}>
              {[['all', 'All'], ['compliant', 'Compliant'], ['attention', 'Needs attention']].map(([k, l]) => (
                <button key={k} className="btn" style={{border: 'none', background: filter === k ? 'var(--paper)' : 'transparent', boxShadow: filter === k ? '0 1px 2px rgba(0,0,0,0.04)' : 'none'}} onClick={() => setFilter(k)}>{l}</button>
              ))}
            </div>
          </div>
          <div className="panel-actions">
            <button className="btn"><Download size={12}/> Export</button>
            <button className="btn btn-primary">+ Add vendor</button>
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Vendor</th>
              <th>Coverage</th>
              <th>Next expiry</th>
              <th>Projects</th>
              <th>Last submitted</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(sub => {
              const status = overallStatus(sub);
              const coverages = [sub.gl, sub.wc, sub.auto].filter(Boolean);
              const soonest = coverages.length ? coverages.sort((a,b) => new Date(a.expires) - new Date(b.expires))[0] : null;
              return (
                <tr key={sub.id} onClick={() => onSelectVendor(sub)}>
                  <td>
                    <div className="vendor-cell">
                      <div className="vendor-avatar">{sub.name.split(' ').slice(0,2).map(w => w[0]).join('')}</div>
                      <div>
                        <div className="vendor-name">{sub.name}</div>
                        <div className="vendor-trade">{sub.trade}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="coverage-bar">
                      <span className={`cov-pill ${sub.gl ? sub.gl.status === 'active' ? 'ok' : sub.gl.status === 'expiring' ? 'warn' : 'bad' : 'none'}`}>GL</span>
                      <span className={`cov-pill ${sub.wc ? sub.wc.status === 'active' ? 'ok' : sub.wc.status === 'expiring' ? 'warn' : 'bad' : 'none'}`}>WC</span>
                      <span className={`cov-pill ${sub.auto ? sub.auto.status === 'active' ? 'ok' : sub.auto.status === 'expiring' ? 'warn' : 'bad' : 'none'}`}>AU</span>
                    </div>
                  </td>
                  <td style={{fontFamily: 'ui-monospace, monospace', fontSize: 12, color: 'var(--ink-2)'}}>
                    {soonest ? fmtDate(soonest.expires) : '—'}
                  </td>
                  <td style={{fontSize: 12, color: 'var(--ink-2)'}}>
                    {sub.projects.length > 0 ? sub.projects.join(', ') : '—'}
                  </td>
                  <td style={{fontFamily: 'ui-monospace, monospace', fontSize: 12, color: 'var(--ink-3)'}}>
                    {fmtDate(sub.lastSubmitted)}
                  </td>
                  <td>
                    {status === 'compliant' && <span className="status ok"><span className="status-dot"/>Compliant</span>}
                    {status === 'expiring' && <span className="status warn"><span className="status-dot"/>Expiring</span>}
                    {status === 'expired' && <span className="status bad"><span className="status-dot"/>Expired</span>}
                    {status === 'missing' && <span className="status bad"><span className="status-dot"/>Missing</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

// =====================================================================
// GC VIEW — ALERTS
// =====================================================================

function GCAlerts() {
  const { brand } = useBrand();
  const alerts = [
    { severity: 'critical', vendor: 'Precision Plumbing Co.', project: 'Sundance Tower', msg: 'General Liability COI expired 123 days ago. Vendor is currently active on jobsite.', time: '3 hours ago' },
    { severity: 'critical', vendor: 'Northwind Roofing', project: 'Pinnacle Logistics Hub', msg: 'No COI on file. Vendor scheduled to start work in 6 days.', time: 'Yesterday' },
    { severity: 'warn', vendor: 'Summit HVAC Systems', project: 'Sundance Tower, Pinnacle Logistics', msg: 'All three policies expire in 13 days. 14-day reminder sent automatically.', time: '2 minutes ago' },
    { severity: 'warn', vendor: 'Delta Electric LLC', project: 'Sundance Tower, Westfork Medical', msg: 'Auto liability expires in 30 days. First reminder sent.', time: 'Yesterday' },
    { severity: 'info', vendor: 'Concrete Kings Ltd.', project: 'Pinnacle Logistics', msg: 'Renewed COI received and auto-verified. No action needed.', time: '1 hour ago' },
  ];

  return (
    <>
      <div className="page-head">
        <div className="page-eyebrow">{brand.name} · Alerts</div>
        <h1 className="page-title">Alerts & notifications</h1>
        <p className="page-sub">Project managers and compliance leads are notified automatically. Critical alerts are also routed to on-call operations.</p>
      </div>

      <div className="panel">
        <div className="panel-head">
          <div className="panel-title">Active alerts ({alerts.length})</div>
          <div className="panel-actions">
            <button className="btn">Mark all read</button>
          </div>
        </div>
        <div>
          {alerts.map((a, i) => (
            <div key={i} style={{padding: '1.1rem 1.25rem', borderBottom: '0.5px solid var(--line)', display: 'flex', gap: 14, alignItems: 'flex-start'}}>
              <div className={`activity-icon ${a.severity === 'critical' ? 'alert' : a.severity === 'warn' ? 'reminder' : 'submit'}`} style={{width: 32, height: 32}}>
                {a.severity === 'critical' ? <AlertTriangle size={14}/> : a.severity === 'warn' ? <Clock size={14}/> : <Check size={14}/>}
              </div>
              <div style={{flex: 1}}>
                <div style={{display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4}}>
                  <span style={{fontSize: 13, fontWeight: 500}}>{a.vendor}</span>
                  <span className={`status ${a.severity === 'critical' ? 'bad' : a.severity === 'warn' ? 'warn' : 'ok'}`}>
                    {a.severity === 'critical' ? 'Critical' : a.severity === 'warn' ? 'Attention' : 'Resolved'}
                  </span>
                </div>
                <div style={{fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.5, marginBottom: 4}}>{a.msg}</div>
                <div style={{fontSize: 11, color: 'var(--ink-3)', letterSpacing: '0.04em'}}>
                  {a.project} · {a.time}
                </div>
              </div>
              {a.severity !== 'info' && (
                <button className="btn">Take action <ChevronRight size={11}/></button>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// =====================================================================
// SUB VIEW — Apex's own compliance (tracked by GCs)
// =====================================================================

function SubDashboard() {
  const { brand } = useBrand();
  return (
    <>
      <div className="page-head">
        <div className="page-eyebrow">{brand.name} · Compliance profile</div>
        <h1 className="page-title">Your COI is <em>current</em> on every project.</h1>
        <p className="page-sub">{brand.name} is tracked as a subcontractor by three general contractors across three live projects. All coverages renew September 14, 2026.</p>
      </div>

      <div className="kpi-row">
        <div className="kpi">
          <div className="kpi-label">Active projects</div>
          <div className="kpi-value">3</div>
          <div className="kpi-delta">All verified</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">GCs tracking you</div>
          <div className="kpi-value">3</div>
          <div className="kpi-delta">Auto-synced</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Days to renewal</div>
          <div className="kpi-value">150</div>
          <div className="kpi-delta">Sept 14, 2026</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Compliance score</div>
          <div className="kpi-value" style={{color: 'var(--ok)'}}>A+</div>
          <div className="kpi-delta up">All coverages active</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="panel">
          <div className="panel-head">
            <div className="panel-title">Your coverage on file</div>
            <div className="panel-actions">
              <button className="btn"><Download size={12}/> Download COI</button>
            </div>
          </div>
          <div style={{padding: '1.25rem'}}>
            {[
              { type: 'General Liability', data: APEX_OWN_COI.gl, extra: `Aggregate ${fmtMoney(APEX_OWN_COI.gl.aggregate)}` },
              { type: 'Workers Compensation', data: APEX_OWN_COI.wc, extra: `Payroll ${fmtMoney(APEX_OWN_COI.wc.payroll)}` },
              { type: 'Commercial Property', data: APEX_OWN_COI.property, extra: 'Equipment & facilities' },
              { type: 'Commercial Auto', data: APEX_OWN_COI.auto, extra: 'Combined single limit' },
            ].map((c, i) => (
              <div key={i} className="coverage-detail">
                <div className="coverage-detail-head">
                  <div>
                    <div className="coverage-type">{c.type}</div>
                    <div style={{fontSize: 11, color: 'var(--ink-3)', marginTop: 2}}>{c.data.carrier} · {c.data.policy}</div>
                  </div>
                  <span className="status ok"><span className="status-dot"/>Active</span>
                </div>
                <div className="coverage-grid">
                  <div><span>Limit</span><span style={{fontFamily: 'ui-monospace, monospace'}}>{fmtMoney(c.data.limit)}</span></div>
                  <div><span>Expires</span><span style={{fontFamily: 'ui-monospace, monospace'}}>{fmtDate(c.data.expires)}</span></div>
                  <div style={{gridColumn: 'span 2'}}><span>Note</span><span>{c.extra}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <div className="panel-title">Tracked on these projects</div>
          </div>
          <div>
            {APEX_TRACKED_BY.map((t, i) => (
              <div key={i} style={{padding: '1rem 1.25rem', borderBottom: '0.5px solid var(--line)'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6}}>
                  <div style={{fontSize: 13, fontWeight: 500}}>{t.project}</div>
                  <span className="status ok"><span className="status-dot"/>Verified</span>
                </div>
                <div style={{fontSize: 11, color: 'var(--ink-3)', marginBottom: 2}}>General Contractor</div>
                <div style={{fontSize: 12, color: 'var(--ink-2)', marginBottom: 8}}>{t.gc}</div>
                <div style={{fontSize: 10, color: 'var(--ink-3)', letterSpacing: '0.04em', textTransform: 'uppercase'}}>
                  Last verified {fmtDate(t.lastVerified)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// =====================================================================
// VENDOR VIEW — Intake form
// =====================================================================

function VendorIntake() {
  const { brand } = useBrand();
  const [step, setStep] = useState('form');
  const [uploaded, setUploaded] = useState(false);

  if (step === 'done') {
    return (
      <div className="intake-shell">
        <div className="confirm-screen">
          <div className="confirm-check"><Check size={30}/></div>
          <h2 className="confirm-title">Your COI was submitted.</h2>
          <p className="confirm-msg">
            We've verified your certificate, extracted the expiration dates, and updated {brand.name}'s compliance record. You'll get automatic reminders 30, 14, and 3 days before your next renewal.
          </p>
          <div style={{display: 'inline-flex', gap: 8, alignItems: 'center', fontSize: 12, color: 'var(--ink-3)', background: 'var(--cream)', padding: '8px 14px', borderRadius: 20, border: '0.5px solid var(--line)'}}>
            <Sparkles size={12}/> Processed automatically in 4 seconds
          </div>
          <div style={{marginTop: '2rem'}}>
            <button className="btn" onClick={() => { setStep('form'); setUploaded(false); }}>Submit another</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="intake-shell">
      <div className="intake-hero">
        <div className="intake-logo">
          {brand.logoUrl ? <img src={brand.logoUrl} alt="" style={{width: '100%', height: '100%', objectFit: 'contain'}} /> : firmInitials(brand.name)}
        </div>
        <div className="intake-title">Submit your Certificate of Insurance</div>
        <div className="intake-subtitle">
          {brand.name} requires a current COI before work begins on any jobsite. Upload your certificate below — we'll verify expiration dates automatically and confirm with your project manager.
        </div>
      </div>

      <div className="form-section">
        <div className="form-section-head">
          <div className="form-section-num">Step 01</div>
          <div className="form-section-title">Your company</div>
        </div>
        <div className="field-row">
          <div className="field">
            <label>Company name</label>
            <input defaultValue="Delta Electric LLC" />
          </div>
          <div className="field">
            <label>Primary trade</label>
            <select defaultValue="Electrical">
              <option>Electrical</option>
              <option>Plumbing</option>
              <option>HVAC</option>
              <option>Concrete</option>
              <option>Structural Steel</option>
              <option>Other</option>
            </select>
          </div>
        </div>
        <div className="field-row">
          <div className="field">
            <label>Contact name</label>
            <input defaultValue="Marco Delgado" />
          </div>
          <div className="field">
            <label>Email</label>
            <input defaultValue="marco@deltaelectric.com" />
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="form-section-head">
          <div className="form-section-num">Step 02</div>
          <div className="form-section-title">Upload your COI</div>
        </div>
        <div className={`upload-zone ${uploaded ? 'uploaded' : ''}`} onClick={() => setUploaded(true)}>
          {!uploaded ? (
            <>
              <Upload size={22} style={{color: 'var(--ink-3)', marginBottom: 10}}/>
              <div style={{fontSize: 14, fontWeight: 500, marginBottom: 4}}>Drop your ACORD 25 here</div>
              <div style={{fontSize: 12, color: 'var(--ink-3)'}}>PDF, PNG, or JPG — up to 10MB. Click to browse.</div>
            </>
          ) : (
            <>
              <FileCheck2 size={22} style={{color: 'var(--ok)', marginBottom: 10}}/>
              <div style={{fontSize: 14, fontWeight: 500, marginBottom: 4, color: 'var(--ok)'}}>delta-electric-coi-2026.pdf</div>
              <div style={{fontSize: 12, color: 'var(--ok)'}}>Uploaded · 847 KB</div>
            </>
          )}
        </div>

        {uploaded && (
          <div className="parsed-preview">
            <div className="parsed-head"><Sparkles size={13}/> Auto-extracted from your certificate</div>
            <div className="parsed-row"><span>Insurance carrier</span><span>Travelers Indemnity</span></div>
            <div className="parsed-row"><span>General liability limit</span><span>$2,000,000</span></div>
            <div className="parsed-row"><span>Workers comp limit</span><span>$1,000,000</span></div>
            <div className="parsed-row"><span>Auto liability limit</span><span>$1,000,000</span></div>
            <div className="parsed-row"><span>Policy expiration</span><span>May 2, 2026</span></div>
            <div className="parsed-row"><span>Additional insured</span><span style={{color: 'var(--ok)'}}>{brand.name} ✓</span></div>
          </div>
        )}
      </div>

      <div className="form-section">
        <div className="form-section-head">
          <div className="form-section-num">Step 03</div>
          <div className="form-section-title">Project assignment</div>
        </div>
        <div className="field">
          <label>Which {brand.name.split(' ')[0]} project is this for?</label>
          <select>
            <option>Sundance Tower — Fort Worth</option>
            <option>Westfork Medical Center — Arlington</option>
            <option>Pinnacle Logistics Hub — Grand Prairie</option>
            <option>Multiple / ongoing</option>
          </select>
        </div>
      </div>

      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.25rem'}}>
        <div style={{fontSize: 11, color: 'var(--ink-3)'}}>
          By submitting, you confirm this certificate is current and accurate.
        </div>
        <button
          className="btn btn-primary"
          disabled={!uploaded}
          style={{padding: '10px 20px', fontSize: 13, opacity: uploaded ? 1 : 0.4, cursor: uploaded ? 'pointer' : 'not-allowed'}}
          onClick={() => setStep('done')}
        >
          Submit COI <ArrowUpRight size={13}/>
        </button>
      </div>
    </div>
  );
}

// =====================================================================
// VENDOR DETAIL DRAWER
// =====================================================================

function VendorDrawer({ vendor, onClose }) {
  if (!vendor) return null;
  const status = overallStatus(vendor);

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose}/>
      <div className="drawer">
        <div className="drawer-head">
          <div style={{display: 'flex', gap: 12, alignItems: 'center'}}>
            <div className="vendor-avatar" style={{width: 44, height: 44, fontSize: 14}}>
              {vendor.name.split(' ').slice(0,2).map(w => w[0]).join('')}
            </div>
            <div>
              <div style={{fontFamily: 'DM Serif Display, serif', fontSize: 20, lineHeight: 1.1, marginBottom: 3}}>{vendor.name}</div>
              <div style={{fontSize: 12, color: 'var(--ink-3)'}}>{vendor.trade}</div>
            </div>
          </div>
          <button className="drawer-close" onClick={onClose}><X size={18}/></button>
        </div>

        <div className="drawer-body">
          <div style={{display: 'flex', gap: 6, marginBottom: '1.5rem'}}>
            {status === 'compliant' && <span className="status ok"><span className="status-dot"/>Compliant</span>}
            {status === 'expiring' && <span className="status warn"><span className="status-dot"/>Expiring soon</span>}
            {status === 'expired' && <span className="status bad"><span className="status-dot"/>Expired</span>}
            {status === 'missing' && <span className="status bad"><span className="status-dot"/>Missing COI</span>}
            <button className="btn" style={{marginLeft: 'auto'}}><Mail size={11}/> Send reminder</button>
          </div>

          <div className="detail-group">
            <div className="detail-label">Primary contact</div>
            <div className="detail-value">
              <div style={{fontWeight: 500, marginBottom: 3}}>{vendor.contact}</div>
              <div style={{color: 'var(--ink-2)', fontSize: 12, display: 'flex', flexDirection: 'column', gap: 3}}>
                <span><Mail size={11} style={{display: 'inline', marginRight: 6, verticalAlign: '-1px'}}/>{vendor.email}</span>
                <span><Phone size={11} style={{display: 'inline', marginRight: 6, verticalAlign: '-1px'}}/>{vendor.phone}</span>
              </div>
            </div>
          </div>

          <div className="detail-group">
            <div className="detail-label">Coverage on file</div>
            {[
              ['General Liability', vendor.gl],
              ['Workers Compensation', vendor.wc],
              ['Commercial Auto', vendor.auto],
            ].map(([type, c], i) => (
              <div key={i} className="coverage-detail">
                <div className="coverage-detail-head">
                  <div className="coverage-type">{type}</div>
                  {!c && <span className="status neutral">Not provided</span>}
                  {c && c.status === 'active' && <span className="status ok"><span className="status-dot"/>Active</span>}
                  {c && c.status === 'expiring' && <span className="status warn"><span className="status-dot"/>Expiring</span>}
                  {c && c.status === 'expired' && <span className="status bad"><span className="status-dot"/>Expired</span>}
                </div>
                {c && (
                  <div className="coverage-grid">
                    <div><span>Carrier</span><span>{c.carrier}</span></div>
                    <div><span>Limit</span><span style={{fontFamily: 'ui-monospace, monospace'}}>{fmtMoney(c.limit)}</span></div>
                    <div><span>Expires</span><span style={{fontFamily: 'ui-monospace, monospace'}}>{fmtDate(c.expires)}</span></div>
                    <div><span>Days until</span><span style={{fontFamily: 'ui-monospace, monospace', color: daysUntil(c.expires) < 0 ? 'var(--bad)' : daysUntil(c.expires) < 30 ? 'var(--warn)' : 'var(--ink)'}}>
                      {daysUntil(c.expires) < 0 ? `${Math.abs(daysUntil(c.expires))} expired` : daysUntil(c.expires)}
                    </span></div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {vendor.gl && (
            <div className="detail-group">
              <div className="detail-label">Reminder cadence</div>
              <div className="reminder-timeline">
                {(() => {
                  const d = daysUntil(vendor.gl.expires);
                  const stages = [
                    { label: '30 days', threshold: 30 },
                    { label: '14 days', threshold: 14 },
                    { label: '3 days', threshold: 3 },
                    { label: 'Expiry', threshold: 0 },
                  ];
                  return stages.map((s, i) => {
                    const state = d !== null && d <= s.threshold ? 'done' : (i > 0 && d !== null && d <= stages[i-1].threshold) ? 'now' : 'future';
                    return (
                      <div key={i} className={`timeline-step ${state}`}>
                        <div className="ts-label">{s.label}</div>
                        <div style={{fontSize: 10}}>{state === 'done' ? 'Sent' : state === 'now' ? 'Queued' : '—'}</div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          )}

          <div className="detail-group">
            <div className="detail-label">Active on projects</div>
            <div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
              {vendor.projects.length > 0 ? vendor.projects.map((p, i) => (
                <div key={i} style={{padding: '8px 12px', background: 'var(--cream)', borderRadius: 6, fontSize: 12, border: '0.5px solid var(--line)'}}>{p}</div>
              )) : <div style={{fontSize: 12, color: 'var(--ink-3)'}}>No current assignments</div>}
            </div>
          </div>

          <div className="detail-group">
            <div className="detail-label">Last submission</div>
            <div className="detail-value" style={{fontFamily: 'ui-monospace, monospace', fontSize: 12, color: 'var(--ink-2)'}}>
              {vendor.lastSubmitted ? fmtDate(vendor.lastSubmitted) : 'No submission on file — send initial intake link'}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// =====================================================================
// EXECUTIVE COMPLIANCE REPORT (print-ready)
// =====================================================================

function ExecutiveReport({ onBack }) {
  const { brand } = useBrand();
  const today = new Date();
  const reportDate = today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const periodEnd = reportDate;
  const periodStart = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate())
    .toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const compliant = APEX_SUBS.filter(s => overallStatus(s) === 'compliant').length;
  const expiring = APEX_SUBS.filter(s => overallStatus(s) === 'expiring').length;
  const expired = APEX_SUBS.filter(s => overallStatus(s) === 'expired' || overallStatus(s) === 'missing').length;
  const total = APEX_SUBS.length;
  const pct = Math.round((compliant / total) * 100);

  const critical = APEX_SUBS.filter(s => {
    const st = overallStatus(s);
    return st === 'expired' || st === 'missing';
  });
  const renewalsSoon = APEX_SUBS.filter(s => overallStatus(s) === 'expiring');

  const statusLabel = (st) => {
    if (st === 'compliant') return { text: 'Compliant', cls: 'ok' };
    if (st === 'expiring') return { text: 'Expiring', cls: 'warn' };
    if (st === 'expired') return { text: 'Expired', cls: 'bad' };
    return { text: 'Missing', cls: 'bad' };
  };

  const earliestExpiry = (s) => {
    const dates = [s.gl?.expires, s.wc?.expires, s.auto?.expires].filter(Boolean).sort();
    return dates[0] || '—';
  };

  const fmt = (d) => d === '—' ? '—' : new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <>
      <div className="exec-topbar">
        <div className="exec-topbar-label">
          <FileCheck2 size={14} /> Print preview — use your browser's print dialog to save as PDF or send to a printer.
        </div>
        <div className="exec-topbar-actions">
          <button className="btn" onClick={onBack}>← Back to dashboard</button>
          <button className="btn btn-primary" onClick={() => window.print()}>
            <Download size={13} /> Print / Save PDF
          </button>
        </div>
      </div>

      <div className="exec-report">
        <div className="report-letterhead">
          <div className="report-mark">
            {brand.logoUrl ? <img src={brand.logoUrl} alt="" /> : firmInitials(brand.name)}
          </div>
          <div>
            <div className="report-firm-name">{brand.name}</div>
            <div className="report-subtitle">Certificate of Insurance · Compliance Report</div>
          </div>
          <div className="report-meta">
            <div><strong style={{color: 'var(--ink)'}}>Report date</strong></div>
            <div>{reportDate}</div>
            <div style={{marginTop: 6}}>Period: {periodStart} – {periodEnd}</div>
          </div>
        </div>

        <div className="report-section">
          <div className="report-section-title">Executive Summary</div>
          <div className="report-summary">
            <div className="report-summary-cell">
              <div className="report-summary-label">Overall compliance</div>
              <div className="report-summary-value">{pct}%</div>
            </div>
            <div className="report-summary-cell">
              <div className="report-summary-label">Compliant</div>
              <div className="report-summary-value" style={{color: 'var(--ok)'}}>{compliant}</div>
            </div>
            <div className="report-summary-cell">
              <div className="report-summary-label">Expiring ≤ 30 days</div>
              <div className="report-summary-value" style={{color: 'var(--warn)'}}>{expiring}</div>
            </div>
            <div className="report-summary-cell">
              <div className="report-summary-label">Expired or missing</div>
              <div className="report-summary-value" style={{color: 'var(--bad)'}}>{expired}</div>
            </div>
          </div>
          <p className="report-para">
            As of {reportDate}, {brand.name} is tracking <strong>{total} active vendors</strong> across three live projects.
            <strong> {compliant} of {total}</strong> carry current, complete Certificates of Insurance.
            {expired > 0 && <> <strong>{expired}</strong> require immediate action to restore compliance on active jobsites.</>}
            {expiring > 0 && <> <strong>{expiring}</strong> additional {expiring === 1 ? 'vendor is' : 'vendors are'} within the 30-day renewal window and {expiring === 1 ? 'has' : 'have'} been notified via automated reminder.</>}
          </p>
        </div>

        {critical.length > 0 && (
          <div className="report-section">
            <div className="report-section-title">Critical Action Items</div>
            <ul className="report-action-list">
              {critical.map(v => {
                const st = overallStatus(v);
                return (
                  <li key={v.id} className={`report-action-item ${st === 'missing' ? 'warn' : ''}`}>
                    <AlertTriangle size={16} style={{color: st === 'missing' ? 'var(--warn)' : 'var(--bad)', flexShrink: 0, marginTop: 2}}/>
                    <div>
                      <div className="report-action-label">{v.name} — {statusLabel(st).text}</div>
                      <div className="report-action-body">
                        {st === 'missing'
                          ? <>No COI on file. Active on project{v.projects.length > 1 ? 's' : ''}: {v.projects.join(', ')}.</>
                          : <>Last valid expiration {fmt(earliestExpiry(v))}. Active on project{v.projects.length > 1 ? 's' : ''}: {v.projects.join(', ')}.</>}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {renewalsSoon.length > 0 && (
          <div className="report-section">
            <div className="report-section-title">Upcoming Renewals (Next 30 Days)</div>
            <table className="report-table">
              <thead>
                <tr>
                  <th>Vendor</th>
                  <th>Earliest expiry</th>
                  <th>Reminder status</th>
                </tr>
              </thead>
              <tbody>
                {renewalsSoon.map(v => (
                  <tr key={v.id}>
                    <td>
                      <div className="report-vendor-name">{v.name}</div>
                      <div className="report-vendor-trade">{v.trade}</div>
                    </td>
                    <td>{fmt(earliestExpiry(v))}</td>
                    <td><span className="report-status warn">Auto-reminder sent</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="report-section">
          <div className="report-section-title">Complete Vendor Compliance Roster</div>
          <table className="report-table">
            <thead>
              <tr>
                <th>Vendor</th>
                <th>Coverage</th>
                <th>Earliest expiry</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {APEX_SUBS.map(v => {
                const st = overallStatus(v);
                const label = statusLabel(st);
                const coverages = [v.gl && 'GL', v.wc && 'WC', v.auto && 'AU'].filter(Boolean).join(' · ') || '—';
                return (
                  <tr key={v.id}>
                    <td>
                      <div className="report-vendor-name">{v.name}</div>
                      <div className="report-vendor-trade">{v.trade}</div>
                    </td>
                    <td>{coverages}</td>
                    <td>{fmt(earliestExpiry(v))}</td>
                    <td><span className={`report-status ${label.cls}`}>{label.text}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="report-footer">
          <div>Generated automatically by COI Autopilot</div>
          <div>AECLogix · Automation as a Service for AEC Firms</div>
        </div>
      </div>
    </>
  );
}

// =====================================================================
// ROOT
// =====================================================================

export default function CoiAutopilot() {
  const [persona, setPersona] = useState('gc');
  const [view, setView] = useState('dashboard');
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [brandModalOpen, setBrandModalOpen] = useState(false);
  const [brand, setBrandState] = useState(() => {
    if (typeof window === 'undefined') return DEFAULT_BRAND;
    try {
      const saved = window.localStorage.getItem(BRAND_STORAGE_KEY);
      return saved ? { ...DEFAULT_BRAND, ...JSON.parse(saved) } : DEFAULT_BRAND;
    } catch { return DEFAULT_BRAND; }
  });

  const setBrand = (next) => {
    setBrandState(next);
    try { window.localStorage.setItem(BRAND_STORAGE_KEY, JSON.stringify(next)); } catch {}
  };
  const resetBrand = () => {
    setBrandState(DEFAULT_BRAND);
    try { window.localStorage.removeItem(BRAND_STORAGE_KEY); } catch {}
  };

  let content;
  if (persona === 'gc') {
    if (view === 'dashboard') content = <GCDashboard onSelectVendor={setSelectedVendor} onViewReport={() => setView('report')}/>;
    else if (view === 'vendors') content = <GCVendors onSelectVendor={setSelectedVendor}/>;
    else if (view === 'alerts') content = <GCAlerts/>;
    else if (view === 'intake') content = <VendorIntake/>;
    else if (view === 'report') content = <ExecutiveReport onBack={() => setView('dashboard')}/>;
  } else if (persona === 'sub') {
    if (view === 'dashboard') content = <SubDashboard/>;
    else if (view === 'alerts') content = <GCAlerts/>;
  } else {
    content = <VendorIntake/>;
  }

  return (
    <BrandContext.Provider value={{ brand, setBrand, resetBrand }}>
      <div className="coi-app">
        <style>{styles}</style>
        <div className="layout">
          <Sidebar
            persona={persona}
            setPersona={setPersona}
            view={view}
            setView={setView}
            onRebrand={() => setBrandModalOpen(true)}
          />
          <main className="main">
            {content}
          </main>
        </div>
        {selectedVendor && <VendorDrawer vendor={selectedVendor} onClose={() => setSelectedVendor(null)}/>}
        {brandModalOpen && <BrandModal onClose={() => setBrandModalOpen(false)} />}
      </div>
    </BrandContext.Provider>
  );
}
