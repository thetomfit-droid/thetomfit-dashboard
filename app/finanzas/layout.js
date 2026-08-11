"use client";import{supabase as t}from"../../lib/supabaseClient";import N from"../AuthGate";import C from"../Sidebar";import F from"../FinanzasTabs";export default function A({children:a}){return<N>
      <div className="shell">
        <C/>
        <main className="main">
          <div className="topbar">
            <div>
              <h1>Finanzas</h1>
              <p className="subtitle">Clientes, gastos y el estado real de tu negocio.</p>
            </div>
            <div className="topbar-actions">
              <button className="btn btn-secondary"onClick={()=>t.auth.signOut()}>
                Cerrar sesión
              </button>
            </div>
          </div>
          <F/>
          {a}
        </main>
      </div>
    </N>}
