import Vue from 'vue'
import moment from "moment";
const filters = {
    formatDate: (value, format = 'DD/MM/YYYY H:m') => {
        if(format  === 'fromNow') {
            return moment.unix(value).fromNow(value);
        }
        return moment.unix(value).format(format);
    },
    formatSize: (bytes) => {
        const dp = 1;
        const si = true;
        const thresh = si ? 1000 : 1024;

        if (Math.abs(bytes) < thresh) {
            return bytes + ' B';
        }

        const units = si
            ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
            : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
        let u = -1;
        const r = 10**dp;

        do {
            bytes /= thresh;
            ++u;
        } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);


        return bytes.toFixed(dp) + ' ' + units[u];
    },
    parseSlug: (slug, delimiter = '_') => {
        const string = slug.replace(delimiter, ' ');
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
};

for (const filter in filters) {
    if(filters.hasOwnProperty(filter)) {
        Vue.filter(filter, filters[filter]);
    }
}

export default ({ app, store }, inject) => {
    inject("filters", filters);
};

