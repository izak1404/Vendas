import { redirect } from 'next/navigation';

export default function Home() {
  // Redireciona automaticamente para o ecrã de stock ao abrir o link principal
  redirect('/estoque'); 
}