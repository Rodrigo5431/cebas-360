'use client'

import { Card, Eyebrow, Heading } from '@/components/ui'
import { BookOpen, ExternalLink, Scale, ShieldAlert } from 'lucide-react'

export default function BaseNormativa() {
  return (
    <div className="animate-in fade-in duration-300">
      <Heading
        eyebrow="KNOWLEDGE BASE"
        title="Base normativa"
        description="Regras vigentes e referências que parametrizam o módulo Educação."
      />

      <div className="mb-6 flex gap-3 rounded-xl bg-[#fffaf0] border border-[#f0e6d2] p-5 text-[#8a6317]">
        <ShieldAlert size={24} className="shrink-0" />
        <div className="text-sm">
          <strong className="block mb-1">A cartilha do MEC de 2013 é material histórico.</strong>
          <p>Ela foi produzida sob a Lei nº 12.101/2009 e o Decreto nº 7.237/2010, ambos superados. O motor do MVP foi parametrizado pela LC 187/2021 e pelo Decreto nº 11.791/2023.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[#f4f2ea] rounded text-[#c49a3c]"><Scale size={20} /></div>
            <div>
              <Eyebrow>BASE LEGAL PRIMÁRIA</Eyebrow>
              <h3 className="font-serif text-xl text-[#34332f]">Lei Complementar nº 187/2021</h3>
            </div>
          </div>
          <p className="text-xs text-[#879087] mb-4">Dispõe sobre a certificação e regula os procedimentos referentes à imunidade de contribuições à seguridade social.</p>
          <ul className="space-y-2 text-sm text-[#34332f] mb-6 border-l-2 border-[#e8e1d6] pl-4">
            <li>Arts. 18 a 28 — requisitos da Educação</li>
            <li>Proporções de bolsas e benefícios</li>
            <li>Perfil socioeconômico e universalidade</li>
            <li>Registros contábeis e termo de ajuste</li>
          </ul>
          <a href="#" className="text-xs font-bold text-[#aa7a1d] flex items-center gap-1 hover:underline">
            Abrir texto atualizado <ExternalLink size={14} />
          </a>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[#f4f2ea] rounded text-[#4b8c78]"><BookOpen size={20} /></div>
            <div>
              <Eyebrow>REGULAMENTO VIGENTE</Eyebrow>
              <h3 className="font-serif text-xl text-[#34332f]">Decreto nº 11.791/2023</h3>
            </div>
          </div>
          <p className="text-xs text-[#879087] mb-4">Regulamenta o processo de certificação, a documentação comum e as regras específicas de cada área.</p>
          <ul className="space-y-2 text-sm text-[#34332f] mb-6 border-l-2 border-[#e8e1d6] pl-4">
            <li>Arts. 5º a 15 — processo e validade</li>
            <li>Arts. 46 a 71 — módulo Educação</li>
            <li>Relatório e plano anual</li>
            <li>Janela de renovação de 360 dias</li>
          </ul>
          <a href="#" className="text-xs font-bold text-[#aa7a1d] flex items-center gap-1 hover:underline">
            Abrir texto atualizado <ExternalLink size={14} />
          </a>
        </Card>
      </div>

      <Card className="mt-6 p-6">
        <Eyebrow>REGRAS PARAMETRIZADAS</Eyebrow>
        <h3 className="font-serif text-xl text-[#34332f] mt-1 mb-6">O que o sistema monitora</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <tbody>
              <tr className="border-b border-[#e8e1d6]">
                <td className="py-3 font-bold text-[#34332f] w-1/4">Renovação tempestiva</td>
                <td className="py-3 text-[#647078]">Protocolo no período de 360 dias anterior ao término da validade.</td>
                <td className="py-3 text-xs text-[#879087] text-right">Dec. 11.791, art. 6º</td>
              </tr>
              <tr className="border-b border-[#e8e1d6]">
                <td className="py-3 font-bold text-[#34332f]">Educação básica</td>
                <td className="py-3 text-[#647078]">1 bolsa integral para cada 5 pagantes, admitida composição legal.</td>
                <td className="py-3 text-xs text-[#879087] text-right">LC 187, art. 19</td>
              </tr>
              <tr className="border-b border-[#e8e1d6]">
                <td className="py-3 font-bold text-[#34332f]">Superior sem Prouni</td>
                <td className="py-3 text-[#647078]">1 bolsa integral para cada 4 pagantes e controles por IES/curso.</td>
                <td className="py-3 text-xs text-[#879087] text-right">LC 187, art. 20</td>
              </tr>
              <tr className="border-b border-[#e8e1d6]">
                <td className="py-3 font-bold text-[#34332f]">Renda familiar</td>
                <td className="py-3 text-[#647078]">Até 1,5 SM per capita para integral e 3 SM para parcial de 50%.</td>
                <td className="py-3 text-xs text-[#879087] text-right">LC 187, art. 22</td>
              </tr>
              <tr>
                <td className="py-3 font-bold text-[#34332f]">Documentos e registros</td>
                <td className="py-3 text-[#647078]">Escrituração segregada, notas explicativas e guarda por 10 anos.</td>
                <td className="py-3 text-xs text-[#879087] text-right">LC 187, arts. 3º e 32</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}