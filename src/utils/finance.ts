export type Inputs = {
  valor: number
  parcelas: number
  taxaMes: number // decimal (ex.: 0.008416 = 0,8416%)
  primeiraParcelaMesZero: boolean
}

export type LinhaParcela = {
  numero: number
  mes: number
  valorParcela: number
  fatorDesconto: number
  valorPresente: number
}

export type Resultado = {
  valorParcela: number
  linhas: LinhaParcela[]
  totalValorPresente: number
  descontoAbsoluto: number
  descontoPercentual: number // decimal (0.044 = 4.4%)
}

export function arred2(v: number) {
  return Math.round((v + Number.EPSILON) * 100) / 100
}

export function fatorDesconto(meses: number, taxaMes: number) {
  return 1 / Math.pow(1 + taxaMes, meses)
}

export function simular(i: Inputs): Resultado {
  const valorParcela = i.parcelas > 0 ? i.valor / i.parcelas : 0
  const offset = i.primeiraParcelaMesZero ? 0 : 1

  const linhas: LinhaParcela[] = Array.from({ length: i.parcelas }, (_, idx) => {
    const numero = idx + 1
    const mes = offset + idx
    const fator = fatorDesconto(mes, i.taxaMes)
    const vp = valorParcela * fator
    return {
      numero,
      mes,
      valorParcela,
      fatorDesconto: fator,
      valorPresente: vp
    }
  })

  const totalValorPresente = linhas.reduce((s, l) => s + l.valorPresente, 0)
  const descontoAbsoluto = i.valor - totalValorPresente
  const descontoPercentual = i.valor > 0 ? descontoAbsoluto / i.valor : 0

  return {
    valorParcela,
    linhas,
    totalValorPresente,
    descontoAbsoluto,
    descontoPercentual
  }
}

export const moeda = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

export const pct = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 4 }).format(v)

export const num = (v: number, frac = 6) =>
  new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: frac }).format(v)
