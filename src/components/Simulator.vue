<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { simular, moeda, pct, num } from '../utils/finance'

// Chave para o localStorage
const STORAGE_KEY = 'simulador-desconto-dados'

// Função para carregar dados do localStorage
const carregarDados = () => {
	try {
		const dados = localStorage.getItem(STORAGE_KEY)
		if (dados) {
			return JSON.parse(dados)
		}
	} catch (error) {
		console.warn('Erro ao carregar dados do localStorage:', error)
	}
	return null
}

// Função para salvar dados no localStorage
const salvarDados = (dados: any) => {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(dados))
	} catch (error) {
		console.warn('Erro ao salvar dados no localStorage:', error)
	}
}

// Carrega dados salvos ou usa valores padrão
const dadosSalvos = carregarDados()

const valor = ref<number>(dadosSalvos?.valor ?? 10000)
const parcelas = ref<number>(dadosSalvos?.parcelas ?? 12)
const taxaAnualPct = ref(dadosSalvos?.taxaAnualPct ?? 10.58)
const primeiraParcelaMesZero = ref(dadosSalvos?.primeiraParcelaMesZero ?? true)
// Novo campo de cashback
const cashbackPct = ref<number>(dadosSalvos?.cashbackPct ?? 0.5)

// Conversões
const taxaAnual = computed(() => (Number(taxaAnualPct.value) || 0) / 100)
// taxa mensal efetiva derivada da anual: (1 + ia)^(1/12) - 1
const taxaMes = computed(() => Math.pow(1 + taxaAnual.value, 1 / 12) - 1)

// Cálculo do cashback
const cashbackValor = computed(() => {
	const valorCompra = Number(valor.value) || 0
	const percentualCashback = (Number(cashbackPct.value) || 0) / 100
	return valorCompra * percentualCashback
})

const apply = (v: number, p: number, m0: boolean) => {
	valor.value = v
	parcelas.value = p
	primeiraParcelaMesZero.value = m0
}

const resultado = computed(() => simular({
	valor: Number(valor.value) || 0,
	parcelas: Math.max(1, Math.floor(Number(parcelas.value) || 1)),
	taxaMes: Number(taxaMes.value) || 0,
	primeiraParcelaMesZero: !!primeiraParcelaMesZero.value
}))

// Watchers para salvar automaticamente quando os valores mudarem
watch([valor, parcelas, taxaAnualPct, primeiraParcelaMesZero, cashbackPct], () => {
	const dadosParaSalvar = {
		valor: valor.value,
		parcelas: parcelas.value,
		taxaAnualPct: taxaAnualPct.value,
		primeiraParcelaMesZero: primeiraParcelaMesZero.value,
		cashbackPct: cashbackPct.value,
		ultimaAtualizacao: new Date().toISOString()
	}
	salvarDados(dadosParaSalvar)
}, { deep: true })

// Opcional: Função para limpar dados salvos
const limparDadosSalvos = () => {
	try {
		localStorage.removeItem(STORAGE_KEY)
		// Restaura valores padrão
		valor.value = 10000
		parcelas.value = 12
		taxaAnualPct.value = 10.58
		primeiraParcelaMesZero.value = true
		cashbackPct.value = 0.5
	} catch (error) {
		console.warn('Erro ao limpar dados salvos:', error)
	}
};

// Cálculo do benefício total (desconto + cashback)
const beneficioTotal = computed(() => {
	const desconto = Number(resultado.value.descontoAbsoluto) || 0
	const cashback = Number(cashbackValor.value) || 0
	return desconto + cashback
})

// Carrega dados quando o componente é montado
onMounted(() => {
	// Os dados já foram carregados na inicialização das refs
	console.log('Dados carregados do localStorage')
})
</script>

<template>
	<div class="card shadow-sm">
		<div class="card-body">
			<div class="d-flex justify-content-between align-items-center mb-3">
				<h5 class="mb-0">Simulador de Desconto por Antecipação</h5>
				<div class="d-flex gap-2 align-items-center">
					<span class="badge badge-soft px-3 py-2">Nubank</span>
					<button type="button" class="btn btn-outline-secondary btn-sm" @click="limparDadosSalvos"
						title="Limpar dados salvos">
						🗑️ Limpar
					</button>
				</div>
			</div>
			<form class="mb-3" @submit.prevent>
				<div class="mb-2 d-flex gap-2 align-items-center flex-wrap">
					<label class="small-muted me-2 mb-0">Exemplos rápidos:</label>
					<button type="button" class="btn btn-outline-primary btn-sm" @click="apply(4952, 3, true)">R$ 4.952
						em 3x (1ª
						mês 0)</button>
					<button type="button" class="btn btn-outline-primary btn-sm" @click="apply(4952, 6, true)">R$ 4.952
						em 6x (1ª
						mês 0)</button>
					<button type="button" class="btn btn-outline-primary btn-sm" @click="apply(4952, 12, true)">R$ 4.952
						em 12x
						(1ª mês 0)</button>
				</div>
				<div class="row g-3">
					<div class="col-12 col-md-6 col-lg-3">
						<label class="form-label">Valor da compra</label>
						<div class="input-group">
							<span class="input-group-text">R$</span>
							<input v-model.number="valor" type="number" min="0" step="0.01" class="form-control" />
						</div>
					</div>
					<div class="col-12 col-md-6 col-lg-3">
						<label class="form-label">Parcelas</label>
						<input v-model.number="parcelas" type="number" min="1" step="1" class="form-control" />
					</div>
					<div class="col-12 col-md-6 col-lg-3">
						<label class="form-label">Desconto a.a. por antecipar</label>
						<div class="input-group flex-grow-0 aa-input-max">
							<input v-model.number="taxaAnualPct" type="number" min="0" step="0.01"
								class="form-control" />
							<span class="input-group-text">%</span>
						</div>
					</div>
					<div class="col-12 col-md-6 col-lg-3">
						<label class="form-label">Cashback do cartão</label>
						<div class="input-group">
							<input v-model.number="cashbackPct" type="number" min="0" step="0.01"
								class="form-control" />
							<span class="input-group-text">%</span>
						</div>
					</div>
					<div class="col-12">
						<div class="aviso">
							<p class="m-0 small-muted">
								<b>Dica: Nubank → Fatura → Barra de limites → Antecipar.</b>
							</p>
							<p class="m-0 small-muted">O % de desconto aparece no topo.</p>
						</div>
					</div>
				</div>
			</form>
			<!-- Cards de Resultados -->
			<div class="grid-3 mb-3">
				<div class="p-3 bg-white border rounded">
					<div class="small-muted">Valor da parcela</div>
					<div class="fs-4 fw-semibold">{{ moeda(resultado.valorParcela) }}</div>
				</div>
				<div class="p-3 bg-white border rounded">
					<div class="small-muted">Valor presente (total ao antecipar)</div>
					<div class="fs-4 fw-semibold">{{ moeda(resultado.totalValorPresente) }}</div>
				</div>
				<div class="p-3 bg-white border rounded discount-card">
					<div class="small-muted">Desconto por antecipar</div>
					<div class="fs-4 fw-semibold text-success">- {{ moeda(resultado.descontoAbsoluto) }}</div>
				</div>
			</div>

			<!-- Segundo Grid com Desconto % e Cashback -->
			<div class="grid-2 mb-3">
				<div class="p-3 bg-white border rounded">
					<div class="small-muted">Desconto efetivo</div>
					<div class="fs-4 fw-semibold">{{ pct(resultado.descontoPercentual) }}</div>
				</div>
				<div class="p-3 bg-light border rounded cashback-card">
					<div class="small-muted d-flex align-items-center gap-1">
						<span>💳</span>
						<span>Cashback ganho ({{ pct(cashbackPct / 100) }})</span>
					</div>
					<div class="fs-4 fw-semibold text-info">+ {{ moeda(cashbackValor) }}</div>
				</div>
				<div class="p-3 bg-white border rounded total-benefit-card">
					<div class="small-muted d-flex align-items-center gap-1">
						<span>🎯</span>
						<span>Benefício Total</span>
					</div>
					<div class="fs-4 fw-semibold text-primary">{{ moeda(beneficioTotal) }}</div>
				</div>
			</div>

			<!-- Tabela de Parcelas -->
			<div class="table-responsive" style="max-height: 50vh;">
				<table class="table table-sm align-middle zebra" style="font-size: 0.9rem ;">
					<thead>
						<tr>
							<th>Parcela</th>
							<th>Mês</th>
							<th class="text-end">Valor Parcela</th>
							<th class="text-end">Fator Desconto</th>
							<th class="text-end">Valor Presente</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="l in resultado.linhas" :key="l.numero">
							<td>{{ l.numero }}</td>
							<td>{{ l.mes }}</td>
							<td class="text-end">{{ moeda(l.valorParcela) }}</td>
							<td class="text-end"><code>{{ num(l.fatorDesconto, 6) }}</code></td>
							<td class="text-end">{{ moeda(l.valorPresente) }}</td>
						</tr>
					</tbody>
					<tfoot>
						<tr class="fw-semibold">
							<td colspan="4" class="text-end">Total (VP):</td>
							<td class="text-end">{{ moeda(resultado.totalValorPresente) }}</td>
						</tr>
					</tfoot>
				</table>
			</div>
			<div class="small-muted">
				<div class="mt-1">
					<small class="text-muted">💾 Seus dados são salvos automaticamente no navegador</small>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
/* Card especial para benefício total */
.total-benefit-card {
        background: linear-gradient(135deg, #fff3e0 0%, #f3e5f5 100%) !important;
        border-color: #ff9800 !important;
        border-width: 2px !important;
}

.total-benefit-card .text-primary {
        color: #1565c0 !important;
        font-weight: 600 !important;
}

.discount-card {
        background: linear-gradient(135deg, #e8f5e8 0%, #f0f8e8 100%) !important;
        border-color: #4caf50 !important;
}

.discount-card .text-success {
        color: #2e7d32 !important;
}

.fs-4 {
font-size: 1.5rem;
}

.aviso {
padding: 12px 14px;
background: rgba(130, 10, 209, 0.06);
border-left: 3px solid rgba(130, 10, 209, 0.6);
border-radius: 10px;
display: flex;
align-items: flex-start;
flex-direction: column;
width: 100%;
}

/* Grid layouts responsivos */
.grid-2 {
display: grid;
grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
gap: 1rem;
}

.grid-3 {
display: grid;
grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
gap: 1rem;
}

/* Card especial para cashback */
.cashback-card {
        background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%) !important;
        border-color: #81c784 !important;
}

.cashback-card .text-info {
        color: #1976d2 !important;
}

@media (max-width: 768px) {

	.grid-2,
	.grid-3 {
		grid-template-columns: 1fr;
	}
}
</style>