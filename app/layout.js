import { Libre_Franklin, Fredoka } from "next/font/google";
import "./globals.css";

const franklin = Libre_Franklin({
  subsets: ["latin"],
  weight: ["500", "700", "800", "900"],
  variable: "--font-franklin",
});

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-fredoka",
});

export const metadata = {
  title: "THETOMFIT — Panel de control",
  description: "Panel de ventas, finanzas y seguimiento de clientes de THETOMFIT",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${franklin.variable} ${fredoka.variable}`}>
      <body>{children}</body>
    </html>
  );
}
