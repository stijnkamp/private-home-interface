<template>
    <card :icon="{color: 'blue', name:'chart-line'}" title="Data from local device(s)">
        <div slot="center" class="space-x-4">
            <button @click="setDate(-1)" class="font-bold">
                <i class="la la-lg la-angle-left"></i>
            </button>
            <button @click="toggleCalendar" class="font-bold cursor-pointer">{{formattedDate}} <i class="la la-angle-down"></i></button>
            <button @click="setDate(1)" class="font-bold">
                <i class="la la-lg la-angle-right"></i>
            </button>
            <p-overlay-panel ref="calendar">
                <p-calendar :inline="true" :value="selectedDate" @input="selectDate($event)" :view="options.calendarView[timeFilter.duration]" :selectionMode="timeFilter.duration === 'week'?'range':'single'"></p-calendar>
            </p-overlay-panel>
        </div>
        <div slot="end">
            <p-dropdown v-model="timeFilter.duration" :options="options.duration" optionLabel="name" optionValue="key"></p-dropdown>
        </div>
        <div class="grid grid-cols-10">
            <div class="relative col-span-8">
                <chart @select="showLabelInfo" v-if="graphData" type="line" :data="graphData" :options="basicOptions" :plugins="chartPlugins"></chart>
                <div class="loading-container" v-if="loading"></div>
            </div>
            <div class="col-span-2">
                <div ref="legend" style="width: 180px;" class="h-full overflow-auto"></div>
            </div>
        </div>

        <modal v-if="showModal" v-model="showModal" button-position="top" :title="filter.group_by==='dst'?'Destination':'Device'">
            <device-info v-if="groupInfo.group_type === 'device'" :device="groupInfo"></device-info>
            <company-detail v-if="groupInfo.group_type === 'company'" :company="groupInfo"></company-detail>
            <server-group-detail v-else-if="groupInfo.group_type === 'server_group'" :server-group="groupInfo"></server-group-detail>
        </modal>
    </card>
</template>

<script>
import Chart from "@/components/general/Chart";
import Card from "@/components/general/Card";
import Badge from "@/components/general/Badge";
import moment from "moment";
import {mapState} from "vuex";
import Modal from "@/components/general/Modal";
import ServerGroupCard from "@/components/devices/overview/ServerGroupCard";
import ServerGroupDetail from "@/components/devices/ServerGroupDetail";
import DeviceInfo from "@/components/devices/DeviceInfo";
import CompanyDetail from "@/components/devices/CompanyDetail";
import {debounce} from "lodash";
export default {
    name: "TrafficChart",
    components: {CompanyDetail, DeviceInfo, ServerGroupDetail, ServerGroupCard, Modal, Chart, Card, Badge},
    props: {
        filter: {
            default(){
                return { group_by: 'src'}
            }
        }
    },
    data(){
        return {
            loading: false,
            groupInfo: null,
            options: {
                calendarView: {
                    'day': 'date',
                    'week': 'date',
                    'month': 'month',
                    'year': 'year'
                },
                duration: [{name: 'Day', key: 'day'}, {name: 'Week', key: 'week'}, {name: 'Month', key: 'month'}, {name: 'Year', key: 'year'}]
            },
            showCalendar: false,
            selectedDate: null,
            timeFilter: {
                duration: 'week',
                date: null
            },
            colors: {},
            lineStylesData: {
                labels: [],
                datasets: [
                ]
            },
            chartPlugins: [
                {
                    afterUpdate: (chart) => {
                        const datasets = chart.data.datasets;
                        this.$refs.legend.innerHTML = ''
                        datasets.forEach((dataset, i) => {
                            var meta = chart.getDatasetMeta(i);
                            const color = dataset.borderColor;
                            // const light = color.replace('rgb', 'rgba').replace(')', ', 0.2)')
                            const text = [];
                            text.push('<div class="text-sm cursor-pointer">');
                            text.push('<span class="legend-block" style="background-color:' + color + '; color: #ffffff;"><i class="la la-eye"></i></span>');
                            text.push('<span style="' + (meta.hidden?'text-decoration: line-through;':'')+ '">' + dataset.label + '</span>')
                            text.push('</div>');
                            const div = document.createElement('div');
                            div.innerHTML = text.join('');
                            // Change this to div.childNodes to support multiple top-level nodes.
                            const item = div.firstChild;

                            item.firstChild.onclick = () => {
                                this.groupInfo = dataset.labelData;
                            }
                            item.onclick = () => {

                                meta.hidden = !meta.hidden;
                                chart.update();
                            }
                            this.$refs.legend.appendChild(item);
                        })
                    }
                }
            ],
            basicOptions: {
                spanGaps: true,
                plugins: {
                    legend: {
                        display: false,
                        position: 'right',
                        onClick: (e, legendItem, legend) => {
                            console.log(legendItem);
                            this.groupInfo = Object.values(this.mappedTraffic.labels)[legendItem.datasetIndex];
                        },

                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += this.$filters.formatSize(context.parsed.y);
                                }
                                return label;
                            }
                        },
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: '#495057'
                        },
                        grid: {
                            color: '#ebedef'
                        }
                    },
                    y: {
                        ticks: {
                            callback: (value, index, values) => {
                                return this.$filters.formatSize(value);
                            },
                            color: '#495057'
                        },
                        grid: {
                            color: '#ebedef'
                        }
                    }
                }
            }
        }
    },
    mounted() {
        // setInterval(()=> {
        //     this.lineStylesData.labels.push(Math.floor(Math.random() * 1000));
        //     this.lineStylesData.datasets = this.lineStylesData.datasets.map((set) => {
        //         set.data.push(Math.floor(Math.random() * 1000))
        //         return set;
        //     })
        // }, 1000)
        this.selectDate(new Date());
    },
    watch: {
        'timeFilter.duration': function(){
            this.selectDate(this.selectedDate)
        },
        'timeFilter': {
            handler: function(){
              this.getTrafficData();
            },
            deep: true
        },
        'filter': {
            handler: debounce(function(){
                this.getTrafficData();
            }, 100),
            deep: true
        },
    },
    computed:{
        ...mapState({
            mappedTraffic: state => state.traffic.mappedTraffic,
            servers: state => state.traffic.servers,
            devices: state => state.traffic.devices
        }),
        showModal: {
            set(){
                this.groupInfo = null
            }, get() {
                return this.groupInfo;
            }
        },
        formattedDate(){
            if(!this.timeFilter.date) {
                return null;
            }
            const selectedDate = this.timeFilter.date[0];
            switch(this.timeFilter.duration) {
                case "day":
                    return moment(selectedDate).format('DD/MM/YYYY');
                case "week":
                    return 'Week ' + moment(selectedDate).week();
                case "month":
                    return moment(selectedDate).format('MMMM');
                case "year":
                    return moment(selectedDate).format('YYYY');
            }
        },
        graphData(){
            if(this.mappedTraffic == null) {
                return null
            }
            let datasets = {};
            const labels = this.mappedTraffic.labels;
            const data = this.mappedTraffic.data;
            const timestamps = Object.keys(this.mappedTraffic.data);
            for(const timestamp in data) {
                if(data.hasOwnProperty(timestamp)) {
                    for(const label in data[timestamp]) {
                        if(data[timestamp].hasOwnProperty(label)) {
                            if(!datasets.hasOwnProperty(label)) {
                                datasets[label] = {};
                            }
                            datasets[label][timestamp] = data[timestamp][label];
                        }
                    }
                }
            }
            const colors = this.$parsers.generateColors({quantity: Object.keys(datasets).length, })
            console.log(colors);

            datasets = Object.keys(datasets).map((label, index) => {
                const datasetData = timestamps.map((timestamp) => {
                    if(datasets[label].hasOwnProperty(timestamp)) {
                        return datasets[label][timestamp];
                    }
                    return null;
                })
                this.colors[label] = colors[index];
                if(!this.colors.hasOwnProperty(label)) {

                }
                return {
                    label: (this.$parsers.getLabelName(labels[label])??'Unknown'),
                    labelData: labels[label],
                    data: datasetData,
                    borderColor: this.colors[label],
                    tension: .5
                }
            })
            const timestampLabels = timestamps.map(timestamp => {
                return moment(timestamp).format('DD/MM/YYYY HH:mm');
            })
            return {
                labels: timestampLabels,
                datasets
            }
        }
    },
    methods: {
        getTrafficData(){
            this.loading = true;
            this.$store.dispatch('traffic/getTrafficData', {
                ...this.timeFilter,
                ...this.filter
            }).finally(() => {
                this.loading = false;
            })
        },
        selectDate(date) {
            let selectedDate;
            if(Array.isArray(date)) {
                selectedDate = date[0];
            } else {
                selectedDate = date;
            }
            if(this.timeFilter.duration === 'week') {
                const diff = selectedDate.getDate() - selectedDate.getDay() + (selectedDate.getDay() === 0 ? -6 : 1);
                const startOfWeek = new Date(selectedDate.setDate(diff));
                const endOfWeek =new Date(selectedDate.setDate(startOfWeek.getDate() + 6));
                this.selectedDate = this.timeFilter.date = [startOfWeek, endOfWeek];
            } else {
                let endDate;
                switch(this.timeFilter.duration) {
                    case "day":
                        endDate = selectedDate;
                        break;
                    case "month":
                        selectedDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth()-1, 1);
                        endDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
                        break;
                    case "year":
                        selectedDate = new Date(selectedDate.getFullYear(), 1, 1);
                        endDate = new Date(selectedDate.getFullYear(), 12, 0);
                        break;
                }
                this.selectedDate = selectedDate;
                this.timeFilter.date = [selectedDate, endDate]
                console.log(selectedDate);
            }
        },
        setDate(multiply) {
            let date;
            const currentDate = this.timeFilter.date[0];
            switch(this.timeFilter.duration) {
                case "day":
                    date = currentDate.setDate(currentDate.getDate() + multiply);
                    break;
                case "week":
                    date = currentDate.setDate(currentDate.getDate() + (7 * multiply));
                    break;
                case "month":
                    date = currentDate.setMonth(currentDate.getMonth() + multiply);
                    break;
                case "year":
                    date = currentDate.setFullYear(currentDate.getFullYear() + multiply);
                    break;
            }
            date = new Date(date);
            this.selectDate(date)
        },
        toggleCalendar(e) {
            this.$refs.calendar.toggle(e);
        },
        showLabelInfo(e) {
            this.groupInfo = e.dataset.labelData;
        }
    }
}
</script>

<style scoped>
    .new-device-list {
        max-height: 400px;
    }
    .loading-container {
        position: absolute;
        inset: 0 0 0 0;
        background: rgba(255,255,255,0.7);
    }

</style>
