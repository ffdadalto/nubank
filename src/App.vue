<template>
	<main class="container py-4">
		<header class="mb-4">
			<h2 class="fw-bold mb-1 text-white">Desconto por Antecipação</h2>
			<p class="mb-0 text-white">Replica os cálculos do Nubank (estimativa).</p>
		</header>
		<Simulator />
		<footer class="mt-4 text-center small d-flex justify-content-center align-items-center text-white">
			<div class="row">
				<div class="col-12">
					<p class="m-0">Feito com Vue 3 + TypeScript + Bootstrap por Franchescolle Dadalto</p>
				</div>
				<div class="col-12">
					<img class="m-0 p-0 ms-2 me-1" style="opacity: 1;" src="./assets//envelope.svg" alt="env"
						height="13" />
					<span>ffdadalto@gmail.com</span>
				</div>
				<div class="col-12">
					<p class="ms-2" style="font-size: 12px;">Versão: 1.4.0</p>
				</div>
			</div>

		</footer>
	</main>
</template>

<script setup lang="ts">
import Simulator from './components/Simulator.vue'
</script>
