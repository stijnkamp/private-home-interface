<template>
    <div>
        <div class="location-map" :id="id"></div>
    </div>
</template>

<script>
import L from "leaflet";
import "leaflet.markercluster/dist/leaflet.markercluster.js"
import {nanoid} from "nanoid";
export default {
    name: "LocationMap",
    components: {},
    props: {
        locations:{
            required: true
        }
    },
    data(){
        return {
            map: null,
            markers: null,
            id: nanoid()

        }
    },
    watch: {
        locations: {
            handler(){
                this.setMap();
            }
        }
    },
    mounted() {
      this.setMap();
    },
    methods: {
        setMap(){
            if(this.map == null) {
                this.map = L.map(this.id);
                L.tileLayer(
                    "https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png?api_key=5cf22f98-0e44-4e44-8982-5f34e214437b",
                    {
                        maxZoom: 20,
                        attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
                    }).addTo(this.map);
            }
            if(this.markers != null) {
                this.markers.clearLayers();
            } else {
                this.markers = L.markerClusterGroup();
            }
            const icon = L.icon({
                iconUrl: "/img/marker.png",
                iconSize: L.point(27, 35),
            });
            if(this.locations.length > 0) {
                const bounds = L.latLngBounds();
                this.locations.forEach((location) => {
                    bounds.extend(L.latLng(location.lat, location.lon));
                    const marker = L.marker(L.latLng(location.lat, location.lon), {icon});
                    const domains = location.servers.reduce((prev, cur) => {
                        cur.domains.forEach((newDomain) => {
                            if(!prev.some(domain => domain === newDomain.name)) {
                                prev.push(newDomain.name + '('+this.$filters.formatSize(cur.traffic)+')');
                            }
                        })
                        return prev;
                    }, []);
                    const tooltip = marker.bindPopup('<div>' + domains.join('</div><div>') + '</div>')
                    marker.on("click", () => {
                        tooltip.openTooltip();
                    });

                    this.markers.addLayer(marker);
                })
                this.map.addLayer(this.markers);
                this.map.fitBounds(bounds, {
                    maxZoom: 6
                });
                console.log(this.map);
                if (this.map.zoomLevel > 9) {
                    this.map.zoomLevel = 9;
                }
            }
        }
    }
}
</script>

<style scoped>
 .location-map{
     width: 100%;
     height: 400px;
     overflow: hidden;
 }

</style>
