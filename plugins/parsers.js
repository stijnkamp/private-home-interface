import Vue from 'vue'
import moment from "moment";
const getGroupBySrc = (traffic, devices, servers, existing) => {
    let group = {
        name: traffic.src
    };
    let group_type = 'original'
    let group_key = traffic.src
    const device = devices.find(device => device.hwaddr === traffic.src);
    if(device) {
        group_type = 'device'
        group = device;
    }
    return {
        key: group_type + '_' + group_key,
        value: {
            ...group,
            group_type
        }
    }
}
const addLocations = (server, locations = []) => {
    if(server.location && !locations.some(location => location.id === server.location.id)) {
        locations.push(server.location)
    }
    return locations;
}
const addCompanies = (server, companies = []) => {
    if(server.company && !companies.some(company => company.id === server.company.id)) {
        companies.push(server.company)
    }
    return companies;
}
const updateServers = (server, servers = []) => {
    const foundServer = servers.find(s => s.id === server.id);
    if(foundServer) {
        foundServer.traffic += server.traffic;
    }
    else {
        servers.push(server);
    }
    return servers;
}
const addDomains = (server, domains = []) => {
    const domainIds = domains.map(domain => domain.id);
    const newDomains = server.domains.filter(domain => !domainIds.includes(domain.id));
    domains.push(...newDomains);
    return domains;;
}

const getGroupByDst = (traffic, devices, servers, existing = {}) => {
    let group = {
        value: {
            name: traffic.dst,
        },
        type: 'original',
        key: traffic.dst,
        exists: false
    }
    let server = servers.find(server => server.ip === traffic.dst);
    if(server) {
        if (server.server_group !== null) {
            group = {
                value: server.server_group,
                key: server.server_group.id,
                type: 'server_group'
            }
        } else if(server.company !== null) {
            group = {
                value: server.company,
                key: server.company.id,
                type: 'company'
            }
        }
        else {
            group = {
                value: {
                    name: 'Unknown',
                },
                key: 'unknown',
                type: 'server_group'
            }
        }
    } else if(traffic.dst.includes('192.168.2')) {
        return null;
    } else {
        group = {
            value: {
                name: 'Unknown',
            },
            key: 'unknown',
            type: 'server_group'
        }
        server = {
            ip: traffic.dst,
            domains: [],
            location: null,
            abstractions: []
        }
    }
    server.traffic = traffic.size;
    if(Object.keys(existing).includes(group.type + '_' + group.key)) {
        group.value = existing[group.type + '_' + group.key]
        group.value.servers = updateServers(server, group.value.servers)
    }
    else {
        group.value.servers = [server];
    }

    return {
        key: group.type + '_' + group.key,
        value: {
            ...group.value,
            group_type: group.type
        }
    }
}
const getLabelName = (label) => {
    switch (label.group_type) {
        case "original":
            return label.name
        case "device":
            return label.device?label.device.name:label.name;
        case "company":
            return label.name;
        case "domain":
            return label[0].name;
        case "server_group":
            return label.name
    }
    return "Unknown"
}
const mapTraffic = (res, group_by = 'src') => {
    //maps traffic to datasets
    const data = {}
    const labels = {}
    res.traffic.forEach(traffic  => {
        if(!data.hasOwnProperty(traffic.date_created)) {
            data[traffic.date_created] = {}
        }
        const groupGetters = {
            'src': getGroupBySrc,
            'dst': getGroupByDst
        }
        const group = groupGetters[group_by](traffic, res.devices, res.servers, labels)
        if(group) {
            labels[group.key] = group.value
            if (!data[traffic.date_created].hasOwnProperty(group.key)) {
                data[traffic.date_created][group.key] = 0
            }
            data[traffic.date_created][group.key] += traffic.size;

        }
    })
    console.log({data, labels})
    return {data, labels}
}

const generateColors = ({ quantity = 1, shuffle = false, order = "0,360", offset = 30, saturation = 90, lightness = 60 }) => {
    let colours = [];
    for (let i = 0; i < quantity; i++) {
        let hue;
        if (order === "0,360") hue = ((360/quantity) * (quantity+i)) - 360;
        if (order === "360,0") hue = (360/quantity) * (quantity-i);

        hue += offset;

        colours.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
    }

    if (shuffle) {
        // uses the Fisher-Yates Shuffle to shuffle the colours
        let currentIndex = colours.length, randomIndex;

        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [colours[currentIndex], colours[randomIndex]] = [colours[randomIndex], colours[currentIndex]];
        }
    }

    return colours;
}

export default ({ app, store }, inject) => {
    inject("parsers", {
        mapTraffic,
        getLabelName,
        generateColors
    });
};

