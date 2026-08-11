export default function i({size:e=34,variant:t="gradient"}){const o=t==="white"?"#ffffff":t==="dark"?"#2a1640":"url(#tfgrad)",f=t==="white"?"#2e1c3d":"#ffffff";return<svg width={e}height={e}viewBox="0 0 40 40"xmlns="http://www.w3.org/2000/svg"aria-label="THETOMFIT">
      <defs>
        <linearGradient id="tfgrad"x1="0"y1="0"x2="1"y2="1">
          <stop offset="0%"stopColor="#d9773f"/>
          <stop offset="50%"stopColor="#b14e7b"/>
          <stop offset="100%"stopColor="#5a2d82"/>
        </linearGradient>
      </defs>
      <rect width="40"height="40"rx="10"fill={o}/>
      <text x="50%"y="54%"textAnchor="middle"dominantBaseline="middle"fontFamily="Georgia, 'Times New Roman', serif"fontWeight="700"fontSize="22"fill={f}>
        T
      </text>
    </svg>}
