<template>
    <div class="p-chart w-full">
        <canvas ref="canvas" :height="height" @click="onCanvasClick($event)"></canvas>
    </div>
</template>

<script>
export default {
    name: 'Chart',
    emits: ['select', 'loaded'],
    props: {
        type: String,
        data: null,
        options: null,
        plugins: null,
        height: {
            type: Number,
            default: 200
        },
    },
    chart: null,
    mounted() {
        this.initChart();
    },
    beforeUnmount() {
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
    },
    watch: {
        /*
         * Use deep watch to enable triggering watch for changes within structure
         * otherwise the entire data object needs to be replaced to trigger watch
         */
        data: {
            handler() {
              console.log(this.data);

                this.refresh();
            },
            deep: true
        },
        type() {
            this.refresh();
        },
        options() {
            this.refresh();
        }
    },
    methods: {
        initChart() {
            import('chart.js/auto').then((module) => {
                if (this.chart) {
                    this.chart.destroy();
                    this.chart = null;
                }
                if (module && module.default) {
                    this.chart = new module.default(this.$refs.canvas, {
                        type: this.type,
                        data: this.data,
                        options: this.options,
                        plugins: this.plugins
                    });
                }
                this.$emit('loaded', this.chart);
            });
        },
        getCanvas() {
            return this.$canvas;
        },
        getChart() {
            return this.chart;
        },
        getBase64Image() {
            return this.chart.toBase64Image();
        },
        refresh() {
            if (this.chart) {
              this.chart.data = this.data;
              console.log("Updating chart");
                this.chart.update();
            }
        },
        reinit() {
            this.initChart();
        },
        onCanvasClick(event) {
            if (this.chart) {
                const element = this.chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, false);
                let dataset = null;
                if (element && element[0]) {
                    dataset = this.chart.data.datasets[element[0].datasetIndex];
                } else {
                    dataset = this.chart.getElementsAtEventForMode(event, 'dataset', { intersect: true }, false);
                }
                if (element && element[0] && dataset) {
                    this.$emit('select', {originalEvent: event, element: element[0], dataset: dataset});
                }
            }
        }
    }
}
</script>

<style>
.p-chart {
    position: relative;
}
</style>
