import DiceCanvas from '../components/DiceCanvas';

export default function Home() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#0c1018',
        paddingTop: 80
      }}
    >
      <DiceCanvas />
    </main>
  );
}
