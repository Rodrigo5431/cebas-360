import { AlertTriangle, ExternalLink } from 'lucide-react'
import { Card, Eyebrow, Heading } from '@/components/ui'

export default function Norms() {
  return (
    <>
      <Heading
        eyebrow="Knowledge base"
        title="Base normativa"
        description="Regras vigentes e referências que parametrizam o módulo Educação."
      />

      {/* Banner de Aviso Histórico */}
      <div className="mt-6 flex items-start gap-3 rounded-lg border border-[#f6e05e] bg-[#fffaf0] p-4 text-sm text-[#744210]">
  <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#d69e2e]" />
  <div>
    <strong className="text-[#975a16]">A cartilha do MEC de 2013 é material histórico.</strong><br />
    Ela foi produzida sob a Lei nº 12.101/2009 e Decreto nº 7.237/2010, ambos superados. O motor do MVP foi parametrizado pela LC 187/2021 e pelo Decreto nº 11.791/2023.
  </div>
</div>

      {/* Cards de Legislação */}
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {/* Card 1: LC 187 */}
        <Card className="flex flex-col p-6">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <Eyebrow>Base legal primária</Eyebrow>
              <h2 className="mt-1 font-serif text-xl">Lei Complementar nº 187/2021</h2>
            </div>
            <div className="rounded bg-[#f4f2ea] px-2 py-1 text-xs font-bold text-[#7d837e]">LC</div>
          </div>
          <p className="mb-4 text-sm text-[#647078]">
            Dispõe sobre a certificação e regula os procedimentos referentes à imunidade de contribuições à seguridade social.
          </p>
          <ul className="mb-6 flex-grow space-y-1 pl-5 text-sm text-[#4b3d2e] list-disc">
            <li>Arts. 18 a 28 - requisitos da Educação</li>
            <li>Proporções de bolsas e benefícios</li>
            <li>Perfil socioeconômico e universalidade</li>
            <li>Registros contábeis e termo de ajuste</li>
          </ul>
          <a href="https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp187.htm" target="_blank" rel="noreferrer" className="mt-auto flex w-fit items-center gap-2 text-sm font-bold text-[#c69a5c] hover:underline">
            Abrir texto atualizado <ExternalLink size={14} />
          </a>
        </Card>

        {/* Card 2: Decreto 11.791 */}
        <Card className="flex flex-col p-6">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <Eyebrow>Regulamento vigente</Eyebrow>
              <h2 className="mt-1 font-serif text-xl">Decreto nº 11.791/2023</h2>
            </div>
            <div className="rounded bg-[#f4f2ea] px-2 py-1 text-xs font-bold text-[#7d837e]">DEC</div>
          </div>
          <p className="mb-4 text-sm text-[#647078]">
            Regulamenta o processo de certificação, a documentação comum e as regras específicas de cada área.
          </p>
          <ul className="mb-6 flex-grow space-y-1 pl-5 text-sm text-[#4b3d2e] list-disc">
            <li>Arts. 5º a 15 - processo e validade</li>
            <li>Arts. 46 a 71 - módulo Educação</li>
            <li>Relatório e plano anual</li>
            <li>Janela de renovação de 360 dias</li>
          </ul>
          <a href="https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2023/decreto/d11791.htm" target="_blank" rel="noreferrer" className="mt-auto flex w-fit items-center gap-2 text-sm font-bold text-[#c69a5c] hover:underline">
            Abrir texto atualizado <ExternalLink size={14} />
          </a>
        </Card>
      </div>

      {/* Tabela de Regras */}
      <Card className="mt-6 overflow-hidden">
        <div className="border-b border-[#e8e1d6] p-5">
          <Eyebrow>Regras Parametrizadas</Eyebrow>
          <h2 className="mt-2 font-serif text-xl">O que o sistema monitora</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead className="border-b border-[#e8e1d6] bg-[#f4f2ea] text-[#7d837e]">
              <tr>
                <th className="px-4 py-3 text-left font-normal">Requisito</th>
                <th className="px-4 py-3 text-left font-normal">Regra aplicada</th>
                <th className="px-4 py-3 text-left font-normal">Base Legal</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[#ede8dd] hover:bg-[#fffdf9]">
                <td className="px-4 py-3 font-semibold text-[#4b3d2e]">Renovação tempestiva</td>
                <td className="px-4 py-3">Protocolo no período de 360 dias anterior ao término da validade</td>
                <td className="px-4 py-3 text-[#647078]">Dec. 11.791, art. 5º</td>
              </tr>
              <tr className="border-b border-[#ede8dd] hover:bg-[#fffdf9]">
                <td className="px-4 py-3 font-semibold text-[#4b3d2e]">Educação básica</td>
                <td className="px-4 py-3">1 bolsa integral para cada 5 pagantes, admitida composição legal</td>
                <td className="px-4 py-3 text-[#647078]">LC 187, art. 19</td>
              </tr>
              <tr className="border-b border-[#ede8dd] hover:bg-[#fffdf9]">
                <td className="px-4 py-3 font-semibold text-[#4b3d2e]">Superior sem Prouni</td>
                <td className="px-4 py-3">1 bolsa integral para cada 25 pagantes e controles por IES/curso</td>
                <td className="px-4 py-3 text-[#647078]">LC 187, art. 20</td>
              </tr>
              <tr className="border-b border-[#ede8dd] hover:bg-[#fffdf9]">
                <td className="px-4 py-3 font-semibold text-[#4b3d2e]">Renda familiar</td>
                <td className="px-4 py-3">Até 1,5 SM per capita para integral e até 3 SM para parcial de 50%</td>
                <td className="px-4 py-3 text-[#647078]">LC 187, art. 19, § 1º</td>
              </tr>
              <tr className="border-b border-[#ede8dd] hover:bg-[#fffdf9]">
                <td className="px-4 py-3 font-semibold text-[#4b3d2e]">Documentos e registros</td>
                <td className="px-4 py-3">Escrituração segregada, notas explicativas e guarda por 5 anos</td>
                <td className="px-4 py-3 text-[#647078]">LC 187, art. 28, I e II</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </>
  )
}