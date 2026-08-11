"use client";import{supabase as e}from"../../lib/supabaseClient";import N from"../AuthGate";import T from"../TareasTabs";import A from"../Sidebar";export default function C({children:a}){return<N>
      <div className="shell">
        <A/>
        <main className="main">
          <div className="topbar">
            <div>
              <h1>Mis tareas</h1>
              <p className="subtitle">Lo pendiente del negocio, para que no se te escape nada.</p>
            </div>
            <div className="topbar-actions">
              <button className="btn btn-secondary"onClick={()=>e.auth.signOut()}>
                Cerrar sesión
              </button>
            </div>
          </div>
          <T/>
          {a}
        </main>
      </div>
    </N>}
