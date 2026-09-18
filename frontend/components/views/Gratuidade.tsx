'use client'

import { useState } from 'react'
import { Card, Eyebrow, Heading } from '@/components/ui'
import { Info, RefreshCw, ArrowRight, BookOpen } from 'lucide-react'

export default function Gratuidade() {
  const [pagantes, setPagantes] = useState<number>(1380)
  const [integrais, setIntegrais] = useState<number>(284)
  const [parciais, setParciais] = useState<number>(42)
  const [beneficios, setBeneficios] = useState<number>(8.4)

  const exigido = pagantes / 5
  const minimoIntegrais = pagantes / 9
  const equivalenteOfertado = integrais + (parciais / 2) + beneficios
  const margem = equivalenteOfertado - exigido
  
  const isConforme = equivalenteOfertado >= exigido && integrais >= minimoIntegrais
  const percentual = Math.min(100, Math.round((equivalenteOfertado / exigido) * 100)) || 0

  const syncWithERP = () => {
    setPagantes(1380)
    setIntegrais(284)
    setParciais(42)
    setBeneficios(8.4)
  }

  return (
    <>
      <Heading
        eyebrow="MOTOR DE REGRAS"
        title="Gratuidade e contrapartidas"
        description="Simule os cenários da LC 187/2021 antes do fechamento do período letivo."
        action={
          <span className="rounded-full bg-[#e7f3ee] px-3 py-2 text-[10px] text-[#4b8c78] font-bold border border-[#bce0d3]">
            ● Ambiente demonstrativo
          </span>
        }
      />

      <div className="mt-6 mb-4 max-w-sm">
        <select className="w-full bg-white border border-[#d1c4ae] text-[#34332f] text-sm rounded-md px-4 py-2.5 outline-none focus:border-[#c49a3c] shadow-sm font-bold">
          <option>Educação básica</option>
          <option>Ensino Superior (Com Prouni)</option>
          <option>Ensino Superior (Sem Prouni)</option>
        </select>
      </div>

      <div className="bg-[#292e43] rounded-xl p-5 text-white flex flex-col md:flex-row md:items-center gap-6 justify-between shadow-md">
        <div className="flex md:items-center gap-6 flex-col md:flex-row">
          <div className="shrink-0">
            <span className="text-[9px] uppercase tracking-widest text-[#98a5b8] font-bold">Regra Aplicada</span>
            <h2 className="text-lg font-serif mt-1">1 bolsa integral / 5 pagantes</h2>
          </div>
          <div className="hidden md:block w-px h-10 bg-[#50566b]"></div>
          <p className="text-xs text-[#bfc5d2] max-w-2xl leading-relaxed">
            Admite composição com bolsas parciais de 50%, observado o mínimo de 1 bolsa integral para cada 9 pagantes e o limite de substituição por benefícios.
          </p>
        </div>
        <button className="text-[11px] font-bold text-[#c49a3c] hover:text-[#e8dcc8] transition-colors flex items-center gap-1 shrink-0">
          Ver fundamento <ArrowRight size={12} />
        </button>
      </div>

      <div className="grid lg:grid-cols-[2fr_1fr] gap-6 mt-6">
        
        <Card className="p-6 md:p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <Eyebrow>DADOS DO CENÁRIO</Eyebrow>
              <h3 className="font-serif text-xl text-[#34332f] mt-1">Simulador de conformidade</h3>
            </div>
            <button onClick={syncWithERP} className="text-[#879087] hover:text-[#34332f] bg-[#f4f5fb] px-3 py-1.5 rounded text-[10px] font-bold flex items-center gap-2 border border-[#e8e1d6] transition-colors">
              <RefreshCw size={12} /> Sincronizar ERP
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-x-6 gap-y-5">
            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold text-[#879087] mb-1.5 uppercase tracking-wider">Alunos pagantes</label>
              <input 
                type="number" 
                value={pagantes || ''}
                onChange={(e) => setPagantes(Number(e.target.value))}
                className="w-full border border-[#c49a3c] rounded p-3 text-lg text-[#34332f] font-bold outline-none focus:ring-2 ring-[#c49a3c]/20 bg-[#fffaf0]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#879087] mb-1.5 uppercase tracking-wider">Bolsas integrais</label>
              <input 
                type="number" 
                value={integrais || ''}
                onChange={(e) => setIntegrais(Number(e.target.value))}
                className="w-full border border-[#c49a3c] rounded p-3 text-lg text-[#34332f] font-bold outline-none focus:ring-2 ring-[#c49a3c]/20 bg-[#fffaf0]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#879087] mb-1.5 uppercase tracking-wider">Bolsas parciais (50%)</label>
              <input 
                type="number" 
                value={parciais || ''}
                onChange={(e) => setParciais(Number(e.target.value))}
                className="w-full border border-[#c49a3c] rounded p-3 text-lg text-[#34332f] font-bold outline-none focus:ring-2 ring-[#c49a3c]/20 bg-[#fffaf0]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold text-[#879087] mb-1.5 uppercase tracking-wider">Benefícios convertidos em bolsas</label>
              <input 
                type="number" 
                value={beneficios || ''}
                onChange={(e) => setBeneficios(Number(e.target.value))}
                className="w-full border border-[#c49a3c] rounded p-3 text-lg text-[#34332f] font-bold outline-none focus:ring-2 ring-[#c49a3c]/20 bg-[#fffaf0]"
              />
            </div>
          </div>

          <div className="mt-6 bg-[#fcfbfa] border-l-4 border-[#c49a3c] p-4 rounded-r-lg flex gap-3 text-[#647078] text-xs leading-relaxed">
            <Info size={16} className="text-[#c49a3c] shrink-0 mt-0.5" />
            <p>
              A simulação usa equivalência de 2 bolsas parciais para 1 integral. No produto final, os dados serão importados automaticamente do sistema acadêmico e da contabilidade via API.
            </p>
          </div>
        </Card>

        <Card className="p-6 md:p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <span className={`absolute top-6 right-6 text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded border ${isConforme ? 'bg-[#e7f3ee] text-[#4b8c78] border-[#bce0d3]' : 'bg-[#fdf0f0] text-[#d94444] border-[#f5c2c2]'}`}>
            {isConforme ? 'Cenário Conforme' : 'Atenção Necessária'}
          </span>

          <div className="relative h-40 w-40 mt-6 mb-6">
            <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#f4f2ea" strokeWidth="6" />
              <circle 
                cx="50" cy="50" r="45" fill="none" stroke={isConforme ? "#c49a3c" : "#d94444"} strokeWidth="6" 
                strokeDasharray="283" strokeDashoffset={283 - (283 * percentual) / 100} 
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-[#34332f]">
              <span className="font-serif text-5xl leading-none">{percentual}%</span>
              <span className="text-[10px] text-[#879087] mt-1 font-bold">da meta</span>
            </div>
          </div>

          <h3 className="text-lg font-serif text-[#34332f]">
            Margem de {margem > 0 ? '+' : ''}{margem.toFixed(1)} bolsas
          </h3>
          <p className="text-[11px] text-[#879087] mt-2 mb-8 max-w-[220px]">
            {isConforme 
              ? 'A projeção atende à proporção geral e ao piso de bolsas integrais.' 
              : 'O cenário atual não atinge os requisitos mínimos exigidos pela legislação.'}
          </p>

          <div className="w-full space-y-3 text-xs border-t border-[#e8e1d6] pt-5">
            <div className="flex justify-between items-center bg-[#f4f2ea] px-3 py-2 rounded">
              <span className="text-[#647078]">Exigido</span>
              <strong className="text-[#34332f]">{exigido.toFixed(1)}</strong>
            </div>
            <div className="flex justify-between items-center bg-[#f4f2ea] px-3 py-2 rounded">
              <span className="text-[#647078]">Equivalente ofertado</span>
              <strong className={isConforme ? 'text-[#4b8c78]' : 'text-[#d94444]'}>{equivalenteOfertado.toFixed(1)}</strong>
            </div>
            <div className="flex justify-between items-center bg-[#f4f2ea] px-3 py-2 rounded">
              <span className="text-[#647078]">Mínimo de integrais</span>
              <strong className="text-[#34332f]">{minimoIntegrais.toFixed(1)}</strong>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-6">
        <Card className="p-6">
          <Eyebrow>BÁSICA E PROFISSIONAL</Eyebrow>
          <h4 className="font-serif text-lg text-[#34332f] mt-1 mb-2">Regra 1 / 5</h4>
          <p className="text-[11px] text-[#879087] leading-relaxed">
            Ponderações especiais para bolsa integral de aluno com deficiência (1,2) ou em tempo integral (1,4), sem acumulação.
          </p>
        </Card>

        <Card className="p-6">
          <Eyebrow>SUPERIOR SEM PROUNI</Eyebrow>
          <h4 className="font-serif text-lg text-[#34332f] mt-1 mb-2">Regra 1 / 4</h4>
          <p className="text-[11px] text-[#879087] leading-relaxed">
            Exige ainda oferta em todos os cursos e ao menos 1 bolsa integral para cada 25 pagantes em cada IES.
          </p>
        </Card>

        <Card className="p-6">
          <Eyebrow>PERFIL SOCIOECONÔMICO</Eyebrow>
          <h4 className="font-serif text-lg text-[#34332f] mt-1 mb-2">1,5 ou 3 salários mínimos</h4>
          <p className="text-[11px] text-[#879087] leading-relaxed">
            Renda familiar per capita para bolsa integral e parcial de 50%, respectivamente, validada por assistente social.
          </p>
        </Card>
      </div>
    </>
  )
}