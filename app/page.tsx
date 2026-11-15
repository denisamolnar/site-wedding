'use client'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const fontStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&display=swap');
  .font-caligrafic { font-family: 'Dancing Script', cursive !important; }
  .font-elegant { font-family: 'Cinzel', serif; }
  .text-gold {
    background: linear-gradient(to right, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .border-gold { border: 1px solid #bf953f; }
`;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function WeddingPage() {
  const [uploading, setUploading] = useState(false)
  const [status, setStatus] = useState('')

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'poza' | 'video') => {
    try {
      setUploading(true)
      setStatus(type === 'poza' ? 'Se trimite amintirea... ✨' : 'Se trimite videoul... 🎥')
      const file = e.target.files?.[0]
      if (!file) return
      
      const fileExt = file.name.split('.').pop()
      const fileName = `${type}-${Math.random()}-${Date.now()}.${fileExt}`

      // CONFIGURAT EXACT: Denisa&Joan (fără spații)
      const { error } = await supabase.storage
        .from('Denisa&Joan') 
        .upload(fileName, file)

      if (error) throw error
      setStatus('Trimis cu succes! ❤️')
      alert('Mulțumim! Amintirea ta a fost salvată.')
    } catch (err) {
      console.error(err)
      setStatus('Eroare la trimitere.')
      alert('A apărut o problemă. Te rugăm să mai încerci o dată!')
    } finally {
      setUploading(false)
      setTimeout(() => setStatus(''), 3000)
    }
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: fontStyles }} />
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-[#111111] p-8 rounded-[20px] border-gold shadow-[0_0_20px_rgba(191,149,63,0.2)] max-w-sm w-full relative overflow-hidden">
          
          <div className="absolute top-2 left-2 text-[#bf953f] opacity-30 text-lg font-elegant">⚜️</div>
          <div className="absolute top-2 right-2 text-[#bf953f] opacity-30 text-lg font-elegant">⚜️</div>

          <div className="text-3xl mb-4 text-[#bf953f]">✨</div>
          
          {/* NUMELE PE ACEEAȘI LINIE */}
          <h1 className="text-4xl font-caligrafic text-gold mb-6 py-2 whitespace-nowrap">
            Denisa & Joan
          </h1>
          
          <div className="space-y-4 mb-10">
            <p className="text-[#fcf6ba] font-elegant text-base uppercase tracking-[0.15em] px-2">
              Ajutați-ne să vedem nunta prin ochii voștri! 😍
            </p>
          </div>

          <div className="space-y-4">
            <label className="block cursor-pointer">
              <div className={`w-full py-4 rounded-md border-gold text-[#fcf6ba] font-bold text-sm tracking-widest transition-all active:scale-95 flex items-center justify-center gap-3 ${uploading ? 'bg-gray-800' : 'bg-transparent hover:bg-[#bf953f] hover:text-black'}`}>
                <span>📸</span> TRIMITE POZE
              </div>
              <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, 'poza')} disabled={uploading} />
            </label>

            <label className="block cursor-pointer">
              <div className={`w-full py-4 rounded-md border-gold text-[#fcf6ba] font-bold text-sm tracking-widest transition-all active:scale-95 flex items-center justify-center gap-3 ${uploading ? 'bg-gray-800' : 'bg-transparent hover:bg-[#bf953f] hover:text-black'}`}>
                <span>🎥</span> TRIMITE VIDEO
              </div>
              <input type="file" className="hidden" accept="video/*" onChange={(e) => handleUpload(e, 'video')} disabled={uploading} />
            </label>
          </div>

          {status && <p className="mt-6 text-[#fcf6ba] font-medium animate-pulse text-xs font-elegant">{status}</p>}

          <div className="mt-10 pt-6 border-t border-[#bf953f]/10">
            <p className="text-[9px] text-[#bf953f] uppercase tracking-[0.4em] font-elegant opacity-60">Digital Guestbook</p>
          </div>
        </div>
      </div>
    </>
  )
}
