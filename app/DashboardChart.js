"use client";function f(i){return(i<0?"-":"")+"€"+Math.round(Math.abs(i)).toLocaleString("es-ES")}export default function d({meses:i}){const s=Math.max(1,...i.flatMap(t=>[t.ingresos,t.gastos])),h=640,a=240,e={top:34,right:10,bottom:34,left:10},x=a-e.top-e.bottom,o=(h-e.left-e.right)/i.length,c=Math.min(30,o*.28),n=a-e.bottom;return<svg viewBox={`0 0 ${h} ${a}`}style={{width:"100%",height:"auto"}}>
      <line x1={e.left}y1={n}x2={h-e.right}y2={n}stroke="#ecdfe8"strokeWidth="1"/>
      {i.map(t=>{const r=e.left+i.indexOf(t)*o,g=t.ingresos/s*x,l=t.gastos/s*x;return<g key={t.key}>
            <rect x={r+o/2-c-3}y={n-g}width={c}height={Math.max(g,1)}rx="3"fill="#4c7351"opacity={t.isCurrent?1:.75}/>
            <rect x={r+o/2+3}y={n-l}width={c}height={Math.max(l,1)}rx="3"fill="#ad3a3a"opacity={t.isCurrent?1:.75}/>
            <text x={r+o/2}y={n-Math.max(g,l)-8}textAnchor="middle"fontSize="10"fontWeight="700"fill={t.beneficio>=0?"#345640":"#8a2c2c"}>
              {t.beneficio>=0?"+":""}
              {f(t.beneficio)}
            </text>
            <text x={r+o/2}y={a-14}textAnchor="middle"fontSize="11"fill="#8a7d92">
              {t.label.split(" ")[0].slice(0,3)}
              {t.isCurrent?" ●":""}
            </text>
          </g>})}
    </svg>}
