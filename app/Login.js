"use client";import{useState as a}from"react";import{supabase as m}from"../lib/supabaseClient";import C from"./LogoMark";export default function E(){const[o,l]=a(""),[r,u]=a(""),[t,s]=a(""),[n,i]=a(!1);async function d(e){e.preventDefault(),s(""),i(!0);const{error:c}=await m.auth.signInWithPassword({email:o,password:r});i(!1),c&&s("Correo o contraseña incorrectos.")}return<div className="login-shell">
      <form className="login-card"onSubmit={d}>
        <C size={56}variant="gradient"/>
        <div className="login-logo"style={{marginTop:10}}>THETOMFIT</div>
        <p className="login-sub">Acceso privado — panel de control</p>
        <label>Correo</label>
        <input type="email"value={o}onChange={e=>l(e.target.value)}required autoFocus/>
        <label>Contraseña</label>
        <input type="password"value={r}onChange={e=>u(e.target.value)}required/>
        {t&&<div className="login-error">{t}</div>}
        <button type="submit"disabled={n}>
          {n?"Entrando...":"Entrar"}
        </button>
      </form>
    </div>}
