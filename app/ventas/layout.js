"use client";import{supabase as t}from"../../lib/supabaseClient";import N from"../AuthGate";import V from"../Sidebar";import A from"../VentasTabs";export default function C({children:a}){return<N>
      <div className="shell">
        <V/>
        <main className="main">
          <div className="topbar">
            <div>
              <h1>Ventas</h1>
              <p className="subtitle">Todo tu proceso comercial en un solo lugar.</p>
            </div>
            <div className="topbar-actions">
              <button className="btn btn-secondary"onClick={()=>t.auth.signOut()}>
                Cerrar sesión
              </button>
            </div>
          </div>
          <A/>
          {a}
        </main>
      </div>
    </N>}
