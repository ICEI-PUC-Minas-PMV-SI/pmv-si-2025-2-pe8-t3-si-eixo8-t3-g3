<script setup lang="ts">
import { ref, computed } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

// Dados de entrada para o gráfico
const props = defineProps<{
  seriesData: number[];
  categories: string[];
}>();

const chartSeries = computed(() => [
  {
    name: 'Novos Alunos',
    data: props.seriesData,
  },
]);

const chartOptions = ref({
  chart: {
    type: 'bar',
    height: 350,
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '55%',
      borderRadius: 8, // A propriedade para arredondar as barras
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 2,
    colors: ['transparent'],
  },
  xaxis: {
    categories: props.categories,
  },
  yaxis: {
    title: {
      text: 'Número de Alunos',
    },
  },
  fill: {
    opacity: 1,
  },
  tooltip: {
    y: {
      formatter: function (val: number) {
        return val + ' alunos';
      },
    },
  },
});
</script>

<template>
  <VueApexCharts
    type="bar"
    height="350"
    :options="chartOptions"
    :series="chartSeries"
  />
</template>