import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const generateDocs = async () => {
    if (!url) {
      alert('कृपया गिटहब लिंक डालें!');
      return;
    }
    setLoading(true);
    setResult('⏳ AI गाइड तैयार कर रहा है... कृपया रुकें...');

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ githubUrl: url })
      });
      const data = await response.json();
      if (data.readme) {
        setResult(data.readme);
      } else {
        setResult('❌ गड़बड़: ' + (data.error || 'सर्वर एरर आया'));
      }
    } catch (err) {
      setResult('❌ कनेक्शन फेल: ' + err.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f4f6f9', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', width: '90%', maxWidth: '500px', textAlign: 'center' }}>
        <h2>Scrutinix DocBot 🤖</h2>
        <p style={{ color: '#666' }}>अपना GitHub लिंक डालें और ऑटोमैटिक गाइड (README) पाएं।</p>
        <input type="text" placeholder="https://github.com" value={url} onChange={(e) => setUrl(e.target.value)} style={{ width: '100%', padding: '14px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ced4da', boxSizing: 'border-box' }} />
        <button onClick={generateDocs} disabled={loading} style={{ width: '100%', padding: '14px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
          {loading ? 'Generating...' : 'Generate Documentation'}
        </button>
        {result && <div style={{ marginTop: '25px', padding: '20px', background: '#1e1e1e', color: '#39ff14', borderRadius: '8px', textAlign: 'left', whiteSpace: 'pre-wrap', maxHeight: '300px', overflowY: 'auto', fontFamily: 'monospace' }}>{result}</div>}
      </div>
    </div>
  );
}
